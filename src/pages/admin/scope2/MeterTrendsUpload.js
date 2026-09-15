import React, { useMemo, useRef, useState } from 'react';
import { useTable, formStyles as s } from '../_shared';
import { parseMeterTrendsCsv, sumCampusFeedsByMonth, MAX_MISSING_SHARE } from '../../../data/feedMonthSums.js';
import { SOURCE_MASTER, SOURCE_FEED_SUM, MONTH_ABBR, daysInMonthKey } from '../../../data/electricityLedger.js';
import { SOURCE_BUILDING_MONTHLY } from '../../../data/buildingMonths.js';
import { getEffectiveBuildings } from '../../../data/assetInventory.js';
import { composeScope2FromRows, SCOPE2_TABLE } from '../../../hooks/useMeasuredScope2.js';

// /admin/scope-2/meter-trends — the admin entry point for the electricity
// ledger that drives the public Scope 2 page.
//
// Two inputs, both stored as campus-wide rows in scope2_meter_readings:
//   • a daily Meter Trends export (CSV) → one feed-sum row per month
//     (source 'meter_trends_feed_sum'), parsed in the browser with the same
//     tested rules as scripts/sumMonthlyFeeds.mjs
//   • a BMS All Meters monthly "Totals" figure → one master row per month
//     (source 'bms_master_monthly'); ground truth that replaces a scaled month
//
// Saving a month replaces any earlier row for that month and source. The
// preview composes exactly what useMeasuredScope2() will show the public.

const lastDayOf = (month) => `${month}-${String(daysInMonthKey(month)).padStart(2, '0')}`;
const monthLabel = (key) => `${MONTH_ABBR[parseInt(key.slice(5, 7), 10) - 1]} ${key.slice(0, 4)}`;
const fmt = (n) => Math.round(n).toLocaleString();
const isLedgerRow = (r) => (r.source === SOURCE_MASTER || r.source === SOURCE_FEED_SUM) && !r.building;

/** Daily export text → the monthly feed-sum rows this page would write, and the months it can't use. */
export function uploadToRows(text, fileName) {
  const result = sumCampusFeedsByMonth(parseMeterTrendsCsv(text));
  const keys = Object.keys(result.months).sort();
  const rows = [];
  const skipped = [];
  keys.forEach((mk, i) => {
    const m = result.months[mk];
    const isFirst = i === 0;
    const isLast = i === keys.length - 1;
    if (isFirst && result.firstReading.slice(8, 10) !== '01') {
      skipped.push({ month: mk, reason: `the export starts ${result.firstReading}, part-way through the month` });
      return;
    }
    const expectedDays = isLast ? parseInt(result.lastFullDay.slice(8, 10), 10) : m.calendarDays;
    if (m.days !== expectedDays) {
      skipped.push({ month: mk, reason: `only ${m.days} of ${expectedDays} days have readings` });
      return;
    }
    if (!(m.kwh > 0)) {
      skipped.push({ month: mk, reason: 'feed-sum is not positive' });
      return;
    }
    const share = m.missingEstKwh / m.kwh;
    rows.push({
      period_start: `${mk}-01`,
      period_end: m.days === m.calendarDays ? lastDayOf(mk) : result.lastFullDay,
      meter_id: null,
      building: null,
      kwh: Math.round(m.kwh),
      data_quality: share <= MAX_MISSING_SHARE ? 'measured' : 'estimated',
      source: SOURCE_FEED_SUM,
      notes: `${fileName} · ${m.days}/${m.calendarDays} days · ~${(share * 100).toFixed(1)}% of feed load missing`,
    });
  });
  return {
    rows,
    skipped,
    feedCount: result.feedCount,
    firstReading: result.firstReading,
    lastFullDay: result.lastFullDay,
    dayCount: keys.reduce((sum, k) => sum + result.months[k].days, 0),
    warningCount: result.warnings.length,
  };
}

/**
 * Ordered write plan for a replace-by-month save. The new row is INSERTED
 * before the row it replaces is deleted, so a failure part-way through leaves
 * the month with the old value rather than with nothing (composition is
 * last-wins, so a momentary duplicate is harmless).
 * @param {object[]} existingRows  saved ledger rows
 * @param {object[]} newRows       rows about to be written
 */
export function planMonthSave(existingRows, newRows) {
  const ops = [];
  for (const r of newRows) {
    // Same source, same building (campus-wide rows have none) and same month.
    const stale = existingRows.find((x) => (
      x.source === r.source
      && (x.building ?? null) === (r.building ?? null)
      && String(x.period_start).slice(0, 10) === r.period_start
    ));
    ops.push({ op: 'insert', row: r });
    if (stale) ops.push({ op: 'delete', id: stale.id, meta: { period_start: stale.period_start, source: stale.source, kwh: stale.kwh } });
  }
  return ops;
}

function MeterTrendsUpload() {
  const { rows, error, insert, remove } = useTable(SCOPE2_TABLE, 'created_at', { ascending: true });
  const [upload, setUpload] = useState(null);
  const [masterForm, setMasterForm] = useState({ month: '', kwh: '', notes: '' });
  const [buildingForm, setBuildingForm] = useState({ building: '', month: '', kwh: '', notes: '' });
  const buildings = useMemo(() => getEffectiveBuildings(), []);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  // setBusy only lands on the next render, so a fast second click would
  // otherwise re-enter with the same rows and insert the month twice.
  const savingRef = useRef(false);

  const ledgerRows = rows.filter(isLedgerRow);
  const buildingRows = rows.filter((r) => r.source === SOURCE_BUILDING_MONTHLY && r.building);
  const current = useMemo(() => composeScope2FromRows(rows), [rows]);

  // A valid master-meter form gets previewed too, so the higher-stakes input
  // isn't the one you save blind.
  const masterDraft = useMemo(() => {
    const kwh = parseFloat(masterForm.kwh);
    if (!/^\d{4}-\d{2}$/.test(masterForm.month) || !Number.isFinite(kwh) || kwh <= 0) return null;
    return {
      period_start: `${masterForm.month}-01`,
      period_end: lastDayOf(masterForm.month),
      meter_id: null,
      building: null,
      kwh,
      data_quality: 'measured',
      source: SOURCE_MASTER,
      notes: masterForm.notes || null,
    };
  }, [masterForm]);

  const pendingRows = [...(upload?.rows ?? []), ...(masterDraft ? [masterDraft] : [])];
  const pending = useMemo(
    () => (pendingRows.length ? composeScope2FromRows([...rows, ...pendingRows]) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, upload, masterDraft],
  );

  const existingFor = (r) => ledgerRows.find((x) => x.source === r.source && String(x.period_start).slice(0, 10) === r.period_start);

  const saveMonthRows = async (newRows) => {
    // All saved rows, not just the campus ones: planMonthSave matches on
    // source + building + month, so a per-building save replaces the right row.
    for (const op of planMonthSave(rows, newRows)) {
      if (op.op === 'insert') await insert(op.row);
      else await remove(op.id, op.meta);
    }
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    setMsg(null);
    setUpload(null);
    if (!file) return;
    try {
      const parsed = uploadToRows(await file.text(), file.name);
      if (parsed.dayCount === 0) {
        setMsg({ ok: false, text: 'No full days found. Is this the DAILY Meter Trends export? Hourly exports go through scripts/parseBmsExport.mjs.' });
      }
      setUpload({ fileName: file.name, ...parsed });
    } catch (err) {
      setMsg({ ok: false, text: `Couldn't read that file: ${err.message}` });
    }
  };

  const saveUpload = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setBusy(true);
    try {
      await saveMonthRows(upload.rows);
      setMsg({ ok: true, text: `Saved ${upload.rows.length} month${upload.rows.length === 1 ? '' : 's'} from ${upload.fileName}.` });
      setUpload(null);
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      savingRef.current = false;
      setBusy(false);
    }
  };

  const saveMaster = async (e) => {
    e.preventDefault();
    const kwh = parseFloat(masterForm.kwh);
    if (!/^\d{4}-\d{2}$/.test(masterForm.month)) { setMsg({ ok: false, text: 'Pick a month.' }); return; }
    if (!Number.isFinite(kwh) || kwh <= 0) { setMsg({ ok: false, text: `kWh must be a positive number (got "${masterForm.kwh}")` }); return; }
    const replacing = masterDraft ? existingFor(masterDraft) : null;
    if (replacing && !window.confirm(`Replace the ${monthLabel(masterForm.month)} master total already saved (${fmt(Number(replacing.kwh))} kWh) with ${fmt(kwh)} kWh?`)) return;
    // A month after a gap or a partial month is saved but won't reach the
    // public page — say so before the admin assumes it's live.
    const wontCount = pending?.ledger.uncounted.find((u) => u.month === masterForm.month);
    if (wontCount && !window.confirm(`Save it, but ${monthLabel(masterForm.month)} won't appear on the public page yet: ${wontCount.reason}. Save anyway?`)) return;
    if (savingRef.current) return;
    savingRef.current = true;
    setBusy(true);
    try {
      await saveMonthRows([masterDraft]);
      setMsg({ ok: true, text: `Saved the ${monthLabel(masterForm.month)} master-meter total.` });
      setMasterForm({ month: '', kwh: '', notes: '' });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      savingRef.current = false;
      setBusy(false);
    }
  };

  const saveBuildingMonth = async (e) => {
    e.preventDefault();
    const kwh = parseFloat(buildingForm.kwh);
    if (!buildingForm.building) { setMsg({ ok: false, text: 'Pick a building.' }); return; }
    if (!/^\d{4}-\d{2}$/.test(buildingForm.month)) { setMsg({ ok: false, text: 'Pick a month.' }); return; }
    if (!Number.isFinite(kwh) || kwh <= 0) { setMsg({ ok: false, text: `kWh must be a positive number (got "${buildingForm.kwh}")` }); return; }
    const row = {
      period_start: `${buildingForm.month}-01`,
      period_end: lastDayOf(buildingForm.month),
      meter_id: null,
      building: buildingForm.building,
      kwh,
      data_quality: 'measured',
      source: SOURCE_BUILDING_MONTHLY,
      notes: buildingForm.notes || null,
    };
    const replacing = rows.find((x) => x.source === SOURCE_BUILDING_MONTHLY && x.building === row.building && String(x.period_start).slice(0, 10) === row.period_start);
    const name = buildings.find((b) => b.id === row.building)?.name || row.building;
    if (replacing && !window.confirm(`Replace the ${monthLabel(buildingForm.month)} reading for ${name} (${fmt(Number(replacing.kwh))} kWh) with ${fmt(kwh)} kWh?`)) return;
    if (savingRef.current) return;
    savingRef.current = true;
    setBusy(true);
    try {
      await saveMonthRows([row]);
      setMsg({ ok: true, text: `Saved ${monthLabel(buildingForm.month)} for ${name}.` });
      setBuildingForm({ building: '', month: '', kwh: '', notes: '' });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      savingRef.current = false;
      setBusy(false);
    }
  };

  const onDelete = async (row) => {
    if (!window.confirm('Delete this entry? The public page falls back to the seed data for that month.')) return;
    try {
      await remove(row.id, { period_start: row.period_start, source: row.source, kwh: row.kwh });
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 2 · Electricity</div>
      <h1 style={s.title}>Monthly electricity ledger</h1>
      <p style={s.subtitle}>
        Everything the public Scope 2 page shows is composed from monthly figures. A BMS All Meters
        monthly total is ground truth. Where a month doesn’t have one, the daily Meter Trends export’s
        building-feed total is scaled to match the master meter, using the months that have both.
      </p>
      <p style={p.hint}>
        Saving here changes <strong>/scope-2</strong> and the campus totals that read the live
        composition. Some older pages still show the figures built into the last release until they’re
        moved onto it — so after a save, treat those as the stale ones, not this page.
      </p>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}
      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}

      <form style={s.card} onSubmit={saveMaster}>
        <h2 style={s.h2}>Enter a master-meter monthly total</h2>
        <p style={p.hint}>From the BMS All Meters page with the date range set to one calendar month — the “Totals” row.</p>
        <div style={s.formGrid}>
          <label style={s.field}><span style={s.label}>Month</span>
            <input type="month" value={masterForm.month} onChange={(e) => setMasterForm({ ...masterForm, month: e.target.value })} style={s.input} required />
          </label>
          <label style={s.field}><span style={s.label}>Totals row (kWh)</span>
            <input type="number" step="1" min="0" value={masterForm.kwh} onChange={(e) => setMasterForm({ ...masterForm, kwh: e.target.value })} style={s.input} required />
          </label>
          <label style={{ ...s.field, ...s.full }}><span style={s.label}>Notes</span>
            <input type="text" value={masterForm.notes} onChange={(e) => setMasterForm({ ...masterForm, notes: e.target.value })} style={s.input} placeholder="e.g. captured 2026-10-02 from 10.1.1.27" />
          </label>
        </div>
        <button type="submit" style={{ ...s.submit, marginTop: 16 }} disabled={busy}>Save master total</button>
      </form>

      <div style={s.card}>
        <h2 style={s.h2}>Upload a daily Meter Trends export</h2>
        <p style={p.hint}>
          The CSV with one midnight reading per day. Each month’s building-feed total is computed in your
          browser; a month missing more than {(MAX_MISSING_SHARE * 100).toFixed(1)}% of its feed load is saved
          but not used to set the scale. Nothing is saved until you confirm.
        </p>
        <input type="file" accept=".csv,text/csv" onChange={onFile} style={{ ...s.input, padding: 8 }} />

        {upload && (
          <div style={{ marginTop: 16 }}>
            <div style={p.meta}>
              {upload.fileName} · {upload.feedCount} campus feeds · readings from {upload.firstReading} · complete through {upload.lastFullDay ?? '—'}
              {upload.warningCount > 0 && ` · ${upload.warningCount} warnings`}
            </div>
            <table style={p.table}>
              <thead><tr><th style={p.th}>Month</th><th style={p.th}>Days</th><th style={{ ...p.th, ...p.num }}>Feed-sum kWh</th><th style={p.th}>Sets the scale?</th><th style={p.th}>Replaces</th></tr></thead>
              <tbody>
                {upload.rows.map((r) => {
                  const month = r.period_start.slice(0, 7);
                  const replaces = ledgerRows.some((x) => x.source === SOURCE_FEED_SUM && String(x.period_start).slice(0, 10) === r.period_start);
                  return (
                    <tr key={month}>
                      <td style={p.td}>{monthLabel(month)}</td>
                      <td style={p.td}>{r.notes.split(' · ')[1]}</td>
                      <td style={{ ...p.td, ...p.num }}>{fmt(r.kwh)}</td>
                      <td style={p.td}>{r.data_quality === 'measured' ? 'Eligible' : 'No — feed data missing'}</td>
                      <td style={p.td}>{replaces ? 'Earlier upload' : '—'}</td>
                    </tr>
                  );
                })}
                {upload.skipped.map((x) => (
                  <tr key={`skip-${x.month}`}><td style={p.td}>{monthLabel(x.month)}</td><td style={p.tdMuted} colSpan={4}>Not saved: {x.reason}</td></tr>
                ))}
              </tbody>
            </table>
            {upload.rows.length > 0 && (
              <button type="button" onClick={saveUpload} style={{ ...s.submit, marginTop: 12 }} disabled={busy}>
                Save {upload.rows.length} month{upload.rows.length === 1 ? '' : 's'}
              </button>
            )}
          </div>
        )}
      </div>

      <form style={s.card} onSubmit={saveBuildingMonth}>
        <h2 style={s.h2}>Enter one building’s month</h2>
        <p style={p.hint}>
          A whole calendar month for a single building, from the BMS All Meters page with the date
          range set to that month. This doesn’t change the campus total above — it feeds the
          per-building figures on <strong>/buildings</strong>, <strong>/hotspots</strong>, the campus
          map, the dorm leaderboard and the monthly digest, replacing the estimate for that building
          and month.
        </p>
        <div style={s.formGrid}>
          <label style={s.field}><span style={s.label}>Building</span>
            <select value={buildingForm.building} onChange={(e) => setBuildingForm({ ...buildingForm, building: e.target.value })} style={s.input} required>
              <option value="">Pick a building…</option>
              {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
          <label style={s.field}><span style={s.label}>Month</span>
            <input type="month" value={buildingForm.month} onChange={(e) => setBuildingForm({ ...buildingForm, month: e.target.value })} style={s.input} required />
          </label>
          <label style={s.field}><span style={s.label}>kWh for the month</span>
            <input type="number" step="1" min="0" value={buildingForm.kwh} onChange={(e) => setBuildingForm({ ...buildingForm, kwh: e.target.value })} style={s.input} required />
          </label>
          <label style={{ ...s.field, ...s.full }}><span style={s.label}>Notes</span>
            <input type="text" value={buildingForm.notes} onChange={(e) => setBuildingForm({ ...buildingForm, notes: e.target.value })} style={s.input} placeholder="optional" />
          </label>
        </div>
        <button type="submit" style={{ ...s.submit, marginTop: 16 }} disabled={busy}>Save building month</button>
      </form>

      <div style={s.card}>
        <h2 style={s.h2}>Per-building months saved ({buildingRows.length})</h2>
        {buildingRows.length === 0 ? (
          <p style={p.hint}>None yet — every building still uses its meter mapping or the older snapshot.</p>
        ) : (
          <table style={p.table}>
            <thead><tr><th style={p.th}>Building</th><th style={p.th}>Month</th><th style={{ ...p.th, ...p.num }}>kWh</th><th style={p.th}>Notes</th><th style={p.th} /></tr></thead>
            <tbody>
              {[...buildingRows].reverse().map((r) => (
                <tr key={r.id}>
                  <td style={p.td}>{buildings.find((b) => b.id === r.building)?.name || r.building}</td>
                  <td style={p.td}>{monthLabel(String(r.period_start).slice(0, 7))}</td>
                  <td style={{ ...p.td, ...p.num }}>{fmt(Number(r.kwh))}</td>
                  <td style={p.tdMuted}>{r.notes || ''}</td>
                  <td style={p.td}><button type="button" onClick={() => onDelete(r)} style={p.linkBtn}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pending && <LedgerPreview title="Public Scope 2 page after saving what’s above" view={pending} compareTo={current} />}
      <LedgerPreview title="Public Scope 2 page right now" view={current} />

      <div style={s.card}>
        <h2 style={s.h2}>Saved entries ({ledgerRows.length})</h2>
        {ledgerRows.length === 0 ? (
          <p style={p.hint}>None yet — the public page is using the seed data files for every month.</p>
        ) : (
          <table style={p.table}>
            <thead><tr><th style={p.th}>Month</th><th style={p.th}>Type</th><th style={{ ...p.th, ...p.num }}>kWh</th><th style={p.th}>Notes</th><th style={p.th} /></tr></thead>
            <tbody>
              {[...ledgerRows].reverse().map((r) => (
                <tr key={r.id}>
                  <td style={p.td}>{monthLabel(String(r.period_start).slice(0, 7))}</td>
                  <td style={p.td}>{r.source === SOURCE_MASTER ? 'Master total' : `Feed-sum${r.data_quality === 'measured' ? '' : ' (not for scale)'}`}</td>
                  <td style={{ ...p.td, ...p.num }}>{fmt(Number(r.kwh))}</td>
                  <td style={p.tdMuted}>{r.notes || ''}</td>
                  <td style={p.td}><button type="button" onClick={() => onDelete(r)} style={p.linkBtn}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function LedgerPreview({ title, view, compareTo }) {
  const { ledger } = view;
  const before = compareTo ? new Map(compareTo.ledger.months.map((m) => [m.month, m])) : null;
  const changed = (m) => before && (!before.has(m.month) || before.get(m.month).kwh !== m.kwh || before.get(m.month).provenance !== m.provenance);
  return (
    <div style={s.card}>
      <h2 style={s.h2}>{title}</h2>
      <div style={p.stats}>
        <PreviewStat label="Measured through" value={ledger.asOf ?? '—'} />
        <PreviewStat label="Year-to-date" value={`${fmt(view.ytdKwh)} kWh`} />
        <PreviewStat label="Year 1 projection" value={`${fmt(view.year1Kwh)} kWh`} />
        <PreviewStat label="Annual Scope 2" value={`${view.annualMt} mtCO₂e`} before={compareTo ? `${compareTo.annualMt}` : null} />
        <PreviewStat
          label="Feed → master scale"
          value={ledger.scale ? `×${ledger.scale.value.toFixed(3)}` : 'none yet'}
          sub={ledger.scale ? `from ${ledger.scale.perMonth.map((x) => `${monthLabel(x.month)} ${x.ratio}`).join(', ')}` : 'needs a month with both a master total and a complete feed-sum'}
        />
      </div>
      <table style={p.table}>
        <thead><tr><th style={p.th}>Month</th><th style={p.th}>Days</th><th style={{ ...p.th, ...p.num }}>kWh</th><th style={p.th}>Shown as</th><th style={p.th}>From</th></tr></thead>
        <tbody>
          {ledger.months.map((m) => (
            <tr key={m.month} style={changed(m) ? p.changed : undefined}>
              <td style={p.td}>{monthLabel(m.month)}</td>
              <td style={p.td}>{m.days < m.calendarDays ? `${m.days} of ${m.calendarDays}` : m.days}</td>
              <td style={{ ...p.td, ...p.num }}>{fmt(m.kwh)}</td>
              <td style={p.td}>{m.provenance === 'master' ? 'Measured' : 'Measured · scaled'}</td>
              <td style={p.tdMuted}>{String(m.source).startsWith('Admin') ? m.source : 'Seed data file'}</td>
            </tr>
          ))}
          {ledger.uncounted.map((m) => (
            <tr key={`u-${m.month}`}><td style={p.td}>{monthLabel(m.month)}</td><td style={p.tdMuted} colSpan={4}>Not on the page yet: {m.reason}</td></tr>
          ))}
        </tbody>
      </table>
      {ledger.scale?.excluded.filter((x) => x.note).map((x) => (
        <p key={x.month} style={p.hint}><strong>{monthLabel(x.month)} isn’t used for the scale.</strong> {x.note}</p>
      ))}
      {view.ignoredRows.length > 0 && (
        <p style={p.hint}>{view.ignoredRows.length} saved row{view.ignoredRows.length === 1 ? '' : 's'} in {SCOPE2_TABLE} can’t be used here: {[...new Set(view.ignoredRows.map((x) => x.reason))].join('; ')}.</p>
      )}
    </div>
  );
}

function PreviewStat({ label, value, sub, before }) {
  return (
    <div style={p.stat}>
      <div style={p.statLabel}>{label}</div>
      <div style={p.statValue}>{value}</div>
      {before && before !== String(value).split(' ')[0] && <div style={p.statSub}>currently {before}</div>}
      {sub && <div style={p.statSub}>{sub}</div>}
    </div>
  );
}

const p = {
  hint: { color: '#94a3b8', fontSize: 13, lineHeight: 1.5, margin: '4px 0 12px' },
  meta: { color: '#94a3b8', fontSize: 12, marginBottom: 8 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 },
  th: { textAlign: 'left', padding: '6px 8px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #1f2937' },
  td: { padding: '6px 8px', borderBottom: '1px solid #111827', color: '#e5e7eb' },
  tdMuted: { padding: '6px 8px', borderBottom: '1px solid #111827', color: '#94a3b8', fontSize: 12 },
  num: { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  changed: { background: 'rgba(34, 211, 238, 0.08)' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 12 },
  stat: { padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  statLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.4 },
  statValue: { fontSize: 18, fontWeight: 700, color: '#e5e7eb', marginTop: 2 },
  statSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  linkBtn: { background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12 },
};

export default MeterTrendsUpload;
