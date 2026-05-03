import React, { useState, useEffect } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { PasswordGate } from '../components/PasswordGate.js';
import { meters } from '../data/meters.js';
import { emissionFactors } from '../data/emissionFactors.js';
import { buildings } from '../data/buildings.js';
import { parseMeterCsv } from '../utils/csvMeterParser.js';

// Data Admin — health and provenance of the data layer. Phase-1 surfaces:
// (a) which adapters are wired vs stubs, (b) every emission factor with
// source + year, (c) meter registry with BMS join numbers, (d) data
// completeness signals.
//
// Phase-2 will add: real meter quality reports (gap/spike counts pulled
// from /api/meters/quality), CSV upload for batch ingestion, and an
// audit trail keyed on submitted_by_hash.

function readMeterSource() {
  if (typeof process !== 'undefined' && process.env?.METER_SOURCE) return process.env.METER_SOURCE;
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_METER_SOURCE) return import.meta.env.VITE_METER_SOURCE;
  } catch {}
  return 'mock';
}

const ADAPTER_STATUS = {
  mock:        { kind: 'good', label: 'Working' },
  csv:         { kind: 'warn', label: 'Stub' },
  utility_api: { kind: 'warn', label: 'Stub' },
  bms:         { kind: 'info', label: 'Scaffold (needs env)' },
};

// Shares the same localStorage key as the existing AdminLayout login, so
// signing into /admin/* once also unlocks /data-admin (and vice versa).
export default function DataAdmin() {
  return (
    <PasswordGate
      title="Data Admin"
      subtitle="Operational tools — live health, CSV upload, factor registry, meter quality. Sign in with the admin password."
      envKey="ADMIN_PASSWORD"
      storageKey="adminLoggedIn"
      defaultPassword="KUA2026"
      accent="#22d3ee"
    >
      <DataAdminContent />
    </PasswordGate>
  );
}

function DataAdminContent() {
  const activeSource = readMeterSource();
  const electricityMeters = meters.filter((m) => m.type === 'electricity');
  const buildingsWithBmsNumber = buildings.filter((b) => b.bmsNumber != null).length;

  // Group factors by category for the table
  const factorsByCategory = emissionFactors.reduce((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {});

  return (
    <ModulePage
      title="Data Admin"
      subtitle="Provenance, freshness, and connectivity of the carbon-OS data layer. Use this page to verify what's mock, what's live, and which factors back each emissions number."
    >
      <MetricGrid metrics={[
        { label: 'Active meter source', value: activeSource, accent: '#22d3ee', note: 'Set METER_SOURCE env to switch' },
        { label: 'Meters in registry', value: meters.length, accent: '#fbbf24', note: `${electricityMeters.length} electricity, ${meters.length - electricityMeters.length} fuel` },
        { label: 'Buildings with BMS number', value: `${buildingsWithBmsNumber} / ${buildings.length}`, accent: '#86efac' },
        { label: 'Emission factors loaded', value: emissionFactors.length, accent: '#ef4444' },
      ]} />

      <ModuleSection
        title="Meter adapters"
        hint="Adapter pattern: callers go through src/adapters/meter/, the factory picks based on METER_SOURCE."
      >
        <div style={styles.adapterGrid}>
          {Object.entries(ADAPTER_STATUS).map(([key, meta]) => (
            <div key={key} style={{ ...styles.adapterCard, borderLeftColor: key === activeSource ? '#22d3ee' : '#334155' }}>
              <div style={styles.adapterHead}>
                <div style={styles.adapterName}>{key.replace('_', ' ')}</div>
                <Pill kind={meta.kind}>{meta.label}</Pill>
              </div>
              <div style={styles.adapterBody}>
                {key === 'mock'        && 'Generates deterministic interval readings from baseline kWh + day-of-week + month-of-year shapes.'}
                {key === 'csv'         && 'Plan: CSV upload (Data Admin or Supabase storage drop) → ingest job persists to readings table.'}
                {key === 'utility_api' && 'Plan: Liberty Utilities Green Button or UtilityAPI.com pull. Requires UTILITY_API_TOKEN env.'}
                {key === 'bms'         && 'Distech Eclypse REST scaffold. Requires BMS_BASE_URL, BMS_USERNAME, BMS_PASSWORD, BMS_POINT_MAP. Cloud Vercel needs an on-campus relay to reach 10.1.1.27.'}
              </div>
              {key === activeSource && <div style={styles.activeTag}>← currently active</div>}
            </div>
          ))}
        </div>
      </ModuleSection>

      <ModuleSection
        title="Emission factors"
        hint="Every kgCO2e value in the dashboard traces back to one of these factors. Update the year column when refreshing from a newer source release."
      >
        {Object.entries(factorsByCategory).map(([category, factors]) => (
          <div key={category} style={{ marginBottom: 18 }}>
            <div style={styles.catHeader}>
              <span style={styles.catName}>{category}</span>
              <span style={styles.catCount}>{factors.length} factor{factors.length === 1 ? '' : 's'}</span>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Subcategory</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>kg CO₂e / unit</th>
                  <th style={styles.th}>Unit</th>
                  <th style={styles.th}>Source</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Year</th>
                </tr>
              </thead>
              <tbody>
                {factors.map((f) => (
                  <tr key={f.id}>
                    <td style={styles.td}>{f.subcategory}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{f.kgco2e_per_unit}</td>
                    <td style={styles.td}>{f.unit}</td>
                    <td style={{ ...styles.td, color: '#94a3b8', fontSize: 12 }}>{f.source}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{f.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </ModuleSection>

      <HealthPanel />

      <CsvUploadPanel />

      <QualityPanel />

      <ModuleSection
        title="Meter registry"
        hint="One row per meter. The bmsNumber column is the join key for Distech Eclypse — match against /api/rest/v1/protocols/bacnet/local/objects/<id>."
      >
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Meter ID</th>
              <th style={styles.th}>Building</th>
              <th style={styles.th}>BMS #</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Provider</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Annual baseline</th>
              <th style={styles.th}>Unit</th>
            </tr>
          </thead>
          <tbody>
            {meters.map((m) => {
              const b = buildings.find((bb) => bb.id === m.buildingId);
              return (
                <tr key={m.id}>
                  <td style={{ ...styles.td, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11 }}>{m.id}</td>
                  <td style={styles.td}>{b?.name ?? m.buildingId}</td>
                  <td style={{ ...styles.td, fontVariantNumeric: 'tabular-nums', color: '#fbbf24' }}>{b?.bmsNumber != null ? `#${b.bmsNumber}` : '—'}</td>
                  <td style={styles.td}>{m.type}</td>
                  <td style={{ ...styles.td, color: '#94a3b8', fontSize: 12 }}>{m.provider}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{m.annualBaselineValue.toLocaleString()}</td>
                  <td style={styles.td}>{m.unit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ModuleSection>
    </ModulePage>
  );
}

function HealthPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function refresh() {
    setLoading(true); setError(null);
    fetch('/api/health')
      .then((r) => r.json().then((j) => ({ ok: r.ok, body: j })))
      .then(({ ok, body }) => { setData({ ok, ...body }); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }

  useEffect(refresh, []);

  return (
    <ModuleSection
      title="Live health"
      hint="Pings /api/health — adapter reachability, Supabase connectivity, factor registry."
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" style={hpStyles.refresh} onClick={refresh} disabled={loading}>
          {loading ? 'Refreshing…' : '↻ Refresh'}
        </button>
        {error && <span style={{ color: '#fca5a5', fontSize: 12 }}>Error: {error}</span>}
        {data && (
          <Pill kind={data.ok ? 'good' : 'bad'}>
            {data.ok ? 'All systems ok' : 'Degraded'}
          </Pill>
        )}
      </div>
      {data && (
        <div style={hpStyles.grid}>
          <HealthCell
            label="Meter adapter"
            ok={data.checks.adapter.ok}
            detail={data.checks.adapter.ok ? `${data.checks.adapter.count} meters` : data.checks.adapter.error}
          />
          <HealthCell
            label="Emission factors"
            ok={data.checks.factors.ok}
            detail={`${data.checks.factors.count} factors loaded`}
          />
          <HealthCell
            label="Supabase"
            ok={!data.checks.supabase.configured ? null : data.checks.supabase.ok}
            detail={
              !data.checks.supabase.configured
                ? 'Not configured (writes go to memory only)'
                : data.checks.supabase.ok
                  ? 'Reachable'
                  : data.checks.supabase.error
            }
          />
        </div>
      )}
    </ModuleSection>
  );
}

function HealthCell({ label, ok, detail }) {
  return (
    <div style={hpStyles.cell}>
      <div style={hpStyles.cellHead}>
        <span style={hpStyles.cellLabel}>{label}</span>
        <Pill kind={ok === null ? 'neutral' : ok ? 'good' : 'bad'}>
          {ok === null ? 'inactive' : ok ? 'ok' : 'fail'}
        </Pill>
      </div>
      <div style={hpStyles.cellDetail}>{detail}</div>
    </div>
  );
}

const hpStyles = {
  refresh: { padding: '8px 14px', background: '#0f172a', border: '1px solid #0e7490', borderRadius: 6, color: '#22d3ee', cursor: 'pointer', fontSize: 13, fontWeight: 700 },
  grid: { marginTop: 14, display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
  cell: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  cellHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cellLabel: { fontSize: 13, color: '#e5e7eb', fontWeight: 700 },
  cellDetail: { fontSize: 12, color: '#94a3b8', lineHeight: 1.5 },
};

function CsvUploadPanel() {
  const [csv, setCsv] = useState('');
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [serverResult, setServerResult] = useState(null);
  const [error, setError] = useState(null);

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    f.text().then((text) => {
      setCsv(text);
      setPreview(parseMeterCsv(text));
      setServerResult(null);
      setError(null);
    });
  }

  function onTextChange(e) {
    setCsv(e.target.value);
    setPreview(null);
    setServerResult(null);
    setError(null);
  }

  function onPreview() {
    setPreview(parseMeterCsv(csv));
    setServerResult(null);
    setError(null);
  }

  function onUpload() {
    if (!preview || preview.errors.length || preview.readings.length === 0) return;
    setBusy(true);
    fetch('/api/meters/readings/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readings: preview.readings }),
    })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((j) => { setServerResult(j); setBusy(false); })
      .catch((err) => { setError(err.message); setBusy(false); });
  }

  return (
    <ModuleSection
      title="CSV upload"
      hint={
        <>
          Required columns: <code>meter_id, timestamp, value, unit, interval_minutes</code>.
          Optional: <code>demand_kw, data_quality</code>. Files containing
          name/email/student_id columns are rejected to prevent accidental PII uploads.
        </>
      }
    >
      <div style={csvStyles.row}>
        <label style={csvStyles.fileBtn}>
          📎 Pick a file
          <input type="file" accept=".csv,text/csv" onChange={onFile} style={{ display: 'none' }} />
        </label>
        <span style={csvStyles.or}>or paste below</span>
      </div>
      <textarea
        style={csvStyles.textarea}
        value={csv}
        onChange={onTextChange}
        placeholder={'meter_id,timestamp,value,unit,interval_minutes\nm_elec_b_miller,2026-04-01T00:00:00Z,5.2,kWh,60\nm_elec_b_miller,2026-04-01T01:00:00Z,5.4,kWh,60'}
        rows={6}
      />
      <div style={csvStyles.actions}>
        <button type="button" style={csvStyles.preview} onClick={onPreview} disabled={!csv.trim()}>
          Preview parse
        </button>
        <button
          type="button"
          style={csvStyles.upload}
          onClick={onUpload}
          disabled={!preview || preview.errors.length > 0 || preview.readings.length === 0 || busy}
        >
          {busy ? 'Uploading…' : `Import ${preview?.readings.length ?? 0} rows`}
        </button>
      </div>

      {preview && (
        <div style={csvStyles.result}>
          <div style={csvStyles.resultLine}>
            <Pill kind={preview.errors.length === 0 && preview.readings.length > 0 ? 'good' : preview.errors.length > 0 ? 'bad' : 'warn'}>
              {preview.readings.length} valid · {preview.errors.length} error{preview.errors.length === 1 ? '' : 's'}
            </Pill>
          </div>
          {preview.errors.length > 0 && (
            <ul style={csvStyles.errList}>
              {preview.errors.slice(0, 8).map((e, i) => <li key={i} style={csvStyles.errItem}>{e}</li>)}
              {preview.errors.length > 8 && <li style={csvStyles.errItem}>… and {preview.errors.length - 8} more</li>}
            </ul>
          )}
        </div>
      )}

      {serverResult && (
        <div style={{ ...csvStyles.result, marginTop: 8 }}>
          <Pill kind="good">Server inserted {serverResult.inserted} rows</Pill>
        </div>
      )}
      {error && (
        <div style={{ ...csvStyles.result, marginTop: 8, color: '#fca5a5' }}>Error: {error}</div>
      )}
    </ModuleSection>
  );
}

const csvStyles = {
  row: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  fileBtn: { padding: '8px 14px', background: '#0f172a', border: '1px solid #0e7490', borderRadius: 6, color: '#22d3ee', cursor: 'pointer', fontSize: 13, fontWeight: 700 },
  or: { fontSize: 12, color: '#64748b' },
  textarea: { width: '100%', boxSizing: 'border-box', padding: 12, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#cbd5e1', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, lineHeight: 1.5, resize: 'vertical' },
  actions: { display: 'flex', gap: 8, marginTop: 10 },
  preview: { padding: '8px 14px', background: 'transparent', border: '1px solid #334155', borderRadius: 6, color: '#cbd5e1', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  upload: { padding: '8px 14px', background: '#22d3ee', color: '#0b1220', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700 },
  result: { marginTop: 12, padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  resultLine: { display: 'flex', alignItems: 'center', gap: 8 },
  errList: { margin: 0, marginTop: 8, paddingLeft: 20, color: '#fca5a5', fontSize: 12, lineHeight: 1.6 },
  errItem: {},
};

function QualityPanel() {
  const [enabled, setEnabled] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    const ctrl = new AbortController();
    const end = new Date();
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    setLoading(true); setError(null);
    fetch(`/api/meters/quality?start=${start.toISOString()}&end=${end.toISOString()}`, { signal: ctrl.signal })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((j) => { setData(j); setLoading(false); })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message); setLoading(false);
      });
    return () => ctrl.abort();
  }, [enabled]);

  return (
    <ModuleSection
      title="Meter quality"
      hint="Live anomaly + gap detection over the last 7 days, served by /api/meters/quality. Score is 100 minus a per-issue penalty."
    >
      {!enabled && (
        <button
          type="button"
          onClick={() => setEnabled(true)}
          style={qpStyles.runBtn}
        >
          ↻ Run quality scan
        </button>
      )}
      {enabled && (
        <>
          {loading && <div style={qpStyles.status}>Scanning every meter for the last 7 days …</div>}
          {error && <div style={{ ...qpStyles.status, color: '#fca5a5' }}>Error: {error}</div>}
          {data && (
            <>
              <div style={qpStyles.summary}>
                {data.reports.length} meters scanned ·{' '}
                {data.reports.reduce((s, r) => s + r.issues.length, 0)} issues found ·{' '}
                avg score {Math.round(data.reports.reduce((s, r) => s + r.qualityScore, 0) / Math.max(1, data.reports.length))}
              </div>
              <div style={qpStyles.list}>
                {data.reports
                  .sort((a, b) => a.qualityScore - b.qualityScore)
                  .slice(0, 10)
                  .map((r) => (
                    <div key={r.meterId} style={qpStyles.row}>
                      <div style={qpStyles.left}>
                        <code style={qpStyles.id}>{r.meterId}</code>
                        <span style={qpStyles.readings}>{r.totalReadings} readings</span>
                      </div>
                      <div style={qpStyles.right}>
                        <Pill kind={r.qualityScore >= 80 ? 'good' : r.qualityScore >= 50 ? 'warn' : 'bad'}>
                          score {r.qualityScore}
                        </Pill>
                        <span style={qpStyles.issues}>
                          {r.issues.length === 0 ? 'no issues' : `${r.issues.length} issue${r.issues.length === 1 ? '' : 's'}`}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </ModuleSection>
  );
}

const qpStyles = {
  runBtn: { padding: '10px 18px', background: '#0f172a', color: '#22d3ee', border: '1px solid #0e7490', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700 },
  status: { fontSize: 13, color: '#94a3b8', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  summary: { fontSize: 13, color: '#cbd5e1', marginBottom: 12 },
  list: { display: 'grid', gap: 6 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  left: { display: 'flex', alignItems: 'center', gap: 12 },
  right: { display: 'flex', alignItems: 'center', gap: 10 },
  id: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: '#cbd5e1' },
  readings: { fontSize: 11, color: '#64748b' },
  issues: { fontSize: 12, color: '#94a3b8' },
};

const styles = {
  adapterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 },
  adapterCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #334155', borderRadius: 8 },
  adapterHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8 },
  adapterName: { fontSize: 14, color: '#e5e7eb', fontWeight: 700, textTransform: 'capitalize' },
  adapterBody: { fontSize: 12, color: '#94a3b8', lineHeight: 1.6 },
  activeTag: { fontSize: 11, color: '#22d3ee', fontWeight: 700, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.6 },

  catHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, marginBottom: 8 },
  catName: { fontSize: 13, color: '#22d3ee', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 },
  catCount: { fontSize: 11, color: '#64748b', fontWeight: 600 },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 10, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },
};
