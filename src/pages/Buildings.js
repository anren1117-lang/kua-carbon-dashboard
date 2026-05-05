import React, { useState, useMemo, useEffect } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { getEffectiveBuildings } from '../data/assetInventory.js';
import { envysionSnapshot } from '../data/envysionSnapshot.js';
import { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E } from '../data/gridMix.js';
import { monthlyPattern } from '../data/seasonalPatterns.js';
import { campusMonthlyTotals, monthlyReports } from '../data/monthlyConsumption.js';
import { bmsExportMeters } from '../data/bmsExportApr2026.js';
import { getBmsMeterMap } from '../data/bmsExportMapping.js';
import { COMPOSED_ANNUALIZE_FACTOR } from '../data/composedYtd.js';
import { Sparkline } from '../components/Sparkline.js';
import { ProvenancePill } from '../components/ProvenancePill.js';

function useBuildingEnergy(buildingId, enabled) {
  const [state, setState] = useState({ loading: false, data: null, error: null });
  useEffect(() => {
    if (!enabled || !buildingId) return;
    const controller = new AbortController();
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    setState({ loading: true, data: null, error: null });
    fetch(`/api/buildings/${encodeURIComponent(buildingId)}/energy?start=${start.toISOString()}&end=${end.toISOString()}`, {
      signal: controller.signal,
    })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ loading: false, data: null, error: err.message });
      });
    return () => controller.abort();
  }, [buildingId, enabled]);
  return state;
}

const KG_PER_KWH = (GRID_MIX_TOTAL_MTCO2E * 1000) / GRID_MIX_TOTAL_KWH;

const CATEGORY_COLORS = {
  Academic: '#ef4444',
  Athletic: '#3b82f6',
  Dorm:     '#22c55e',
  Dining:   '#fbbf24',
  Other:    '#9ca3af',
};

export default function BuildingsPage() {
  const [sortBy, setSortBy] = useState('kwh');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const rows = useMemo(() => {
    // Per-building energy: prefer BMS-mapped measured data when a PM
    // device is mapped to this building. Fall back to envysionSnapshot
    // (older single-snapshot per-building YTD). When neither, surface
    // 0 kWh with a "no data" indicator so the user knows it's unmapped
    // rather than zero-load.
    const snapshotById = Object.fromEntries(envysionSnapshot.map((r) => [r.buildingId, r]));
    const meterMap = getBmsMeterMap();
    return getEffectiveBuildings().map((b) => {
      const mappedMeters = bmsExportMeters.filter((m) => meterMap[m.id] === b.id && m.direction !== 'stuck');
      let kwh = 0;
      let source = 'none';
      if (mappedMeters.length > 0) {
        // BMS-mapped: window total × annualize so column is comparable
        // to the envysionSnapshot rows (which are also annual-equivalent).
        const windowKwh = mappedMeters.reduce((s, m) => s + m.totalKwh, 0);
        kwh = windowKwh * COMPOSED_ANNUALIZE_FACTOR;
        source = 'bms';
      } else if (snapshotById[b.id]) {
        const snap = snapshotById[b.id];
        kwh = snap?.energyUsedKwh ?? 0;
        source = 'snapshot';
      }
      const snap = snapshotById[b.id];
      const mt = (kwh * KG_PER_KWH) / 1000;
      return {
        ...b,
        kwh,
        source,
        mappedMeterIds: mappedMeters.map((m) => m.id),
        powerKw: snap?.powerKw ?? null,
        avgVoltage: snap?.avgVoltage ?? null,
        mt,
        kgPerSqft: b.sqft ? (mt * 1000) / b.sqft : 0,
        kgPerOccupant: b.occupants ? (mt * 1000) / b.occupants : 0,
      };
    });
  }, []);

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.category === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'kwh')          return b.kwh - a.kwh;
    if (sortBy === 'sqft')         return b.kgPerSqft - a.kgPerSqft;
    if (sortBy === 'occupant')     return b.kgPerOccupant - a.kgPerOccupant;
    if (sortBy === 'name')         return a.name.localeCompare(b.name);
    return 0;
  });

  const totalKwh = rows.reduce((s, r) => s + r.kwh, 0);
  const totalMt = (totalKwh * KG_PER_KWH) / 1000;
  const totalSqft = rows.reduce((s, r) => s + r.sqft, 0);
  const avgKgPerSqft = totalSqft ? (totalMt * 1000) / totalSqft : 0;

  return (
    <ModulePage
      title="Buildings"
      subtitle="Per-building electricity, intensities, and operational context. Sort by absolute use, by sqft intensity, or by per-occupant intensity to expose different kinds of inefficiency."
    >
      <MetricGrid metrics={[
        { label: 'Buildings monitored', value: rows.length, accent: '#22d3ee' },
        { label: 'Total electricity', value: Math.round(totalKwh).toLocaleString(), unit: 'kWh/yr', accent: '#fbbf24' },
        { label: 'Total emissions', value: totalMt.toFixed(1), unit: 'mtCO₂e', accent: '#ef4444' },
        { label: 'Avg intensity', value: avgKgPerSqft.toFixed(1), unit: 'kg/sqft', accent: '#86efac' },
      ]} />

      <ModuleSection title="Filter & sort">
        <div style={styles.filterRow}>
          <div>
            <div style={styles.label}>Sort by</div>
            <div style={styles.chipRow}>
              {[
                { v: 'kwh', l: 'Absolute kWh' },
                { v: 'sqft', l: 'Intensity (kg/sqft)' },
                { v: 'occupant', l: 'Per occupant' },
                { v: 'name', l: 'Name' },
              ].map((o) => (
                <Chip key={o.v} active={sortBy === o.v} onClick={() => setSortBy(o.v)}>{o.l}</Chip>
              ))}
            </div>
          </div>
          <div>
            <div style={styles.label}>Category</div>
            <div style={styles.chipRow}>
              {['all', 'Academic', 'Athletic', 'Dorm', 'Other'].map((c) => (
                <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>{c === 'all' ? 'All' : c}</Chip>
              ))}
            </div>
          </div>
        </div>
      </ModuleSection>

      <ModuleSection
        title="Campus seasonal pattern"
        hint="Aggregate shape over the year. Winter peaks reflect heating-driven plug load; summer dip is everyone-off-campus. Solid line = months measured from BMS; dashed = months still on the seasonal-pattern proxy."
      >
        {(() => {
          const measuredKeys = new Set(campusMonthlyTotals().map((r) => r.month));
          const measuredCount = measuredKeys.size;
          const sparkData = monthlyPattern.map((m, i) => ({
            value: m.emissions,
            measured: measuredKeys.has(`2026-${String(i + 1).padStart(2, '0')}`),
          }));
          return (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <Sparkline
                  data={sparkData}
                  color="#22d3ee"
                  fill="rgba(34, 211, 238, 0.18)"
                  width={420}
                  height={64}
                  strokeWidth={2}
                  showLast
                />
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  Jan → Dec, mtCO₂e per month
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                <ProvenancePill provenance="measured" />
                <span style={{ fontSize: 12, color: '#cbd5e1' }}>{measuredCount} month{measuredCount === 1 ? '' : 's'} from KUA Distech Eclypse BMS (solid)</span>
                <span style={{ width: 12 }} />
                <ProvenancePill provenance="estimated" />
                <span style={{ fontSize: 12, color: '#cbd5e1' }}>{12 - measuredCount} month{12 - measuredCount === 1 ? '' : 's'} from seasonal-pattern proxy (dashed)</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
                <span style={{ color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 }}>Today:</span>
                Measured months pull from <code>monthlyConsumption.js</code> (master-meter displayedTotal × ISO-NE 2024 grid factor). Projected months use <code>seasonalPatterns.monthlyPattern</code> — winter heating peak / summer trough shape, scaled to plausible NH magnitudes.
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
                <span style={{ color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 }}>Target:</span>
                Each month flips dashed → solid as its BMS export ships; the seasonal-pattern proxy is removed once a full year is measured (~Jan 2027).
              </div>
            </>
          );
        })()}
      </ModuleSection>

      <ModuleSection
        title="Monthly BMS data quality"
        hint='Every captured month from the KUA Distech Eclypse All Meters page carries TWO totals: the master-meter "Totals" row at the bottom, and the sum of the per-building submeter rows. They drift apart from CT calibration, branch overlaps, and untracked load between the main meter and the submeter network. We carry both numbers rather than silently picking one.'
      >
        <div style={styles.qualityList}>
          {monthlyReports.map((r) => {
            const gapPct = ((r.sumOfRows - r.displayedTotal) / r.displayedTotal) * 100;
            const ratio = Math.min(r.displayedTotal, r.sumOfRows) / Math.max(r.displayedTotal, r.sumOfRows);
            const monthName = new Date(r.month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
            return (
              <div key={r.month} style={styles.qualityRow}>
                <div style={styles.qualityMonthCol}>
                  <div style={styles.qualityMonth}>{monthName}</div>
                  <div style={styles.qualityCaptured}>captured {r.capturedAt}</div>
                  <div style={{ marginTop: 6 }}><ProvenancePill provenance="measured" /></div>
                </div>
                <div style={styles.qualityBarsCol}>
                  <div style={styles.qualityRowBar}>
                    <div style={styles.qualityBarLabel}>
                      Master-meter total
                      <span style={styles.qualityBarBadge}>source of truth</span>
                    </div>
                    <div style={styles.qualityBarTrack}>
                      <div style={{ ...styles.qualityBarFill, width: '100%', background: '#22c55e' }} />
                      <span style={styles.qualityBarValue}>{r.displayedTotal.toLocaleString()} kWh</span>
                    </div>
                  </div>
                  <div style={styles.qualityRowBar}>
                    <div style={styles.qualityBarLabel}>
                      Sum of {r.rows.length} submeters
                      <span style={{ ...styles.qualityBarBadge, color: '#fbbf24', borderColor: '#92400e' }}>
                        +{gapPct.toFixed(1)}% over master
                      </span>
                    </div>
                    <div style={styles.qualityBarTrack}>
                      <div style={{ ...styles.qualityBarFill, width: `${(r.sumOfRows / Math.max(r.sumOfRows, r.displayedTotal)) * 100}%`, background: '#fbbf24' }} />
                      <span style={styles.qualityBarValue}>{r.sumOfRows.toLocaleString()} kWh</span>
                    </div>
                  </div>
                  <div style={styles.qualityGap}>
                    Gap: {(r.sumOfRows - r.displayedTotal).toLocaleString()} kWh ({gapPct.toFixed(1)}% submeter over master) · agreement {(ratio * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={styles.qualityFooter}>
          <div style={styles.qualityMethodLine}>
            <span style={styles.qualityMethodLabel}>Today:</span>
            Master-meter "displayedTotal" is what the BMS itself reports as the campus total — that's the figure we use for Scope 2 emissions math (gridMix.js GRID_MIX_TOTAL_KWH). The per-building submeter rows are useful for relative ranking (which dorm uses more than which) but the absolute numbers consistently overshoot by 8–10% across all four captured months — a stable, systematic offset, not a one-off anomaly.
          </div>
          <div style={styles.qualityMethodLine}>
            <span style={styles.qualityMethodLabel}>Target:</span>
            Calibrate the CT (current transformer) clamps on each submeter circuit until the sum of submeter rows lands within 3% of the master meter. Investigate branch overlaps where a downstream submeter may be double-counting load from an upstream one. After calibration, both numbers carry MEASURED provenance with no caveat — currently the submeter sum carries a calibration-drift caveat.
          </div>
        </div>
      </ModuleSection>

      <ModuleSection
        title={`${sorted.length} buildings`}
        hint="Click a row for setpoints, occupancy, and the BMS join number."
      >
        <div style={styles.list}>
          {sorted.map((b) => {
            const isOpen = expanded === b.id;
            return (
              <div key={b.id} style={styles.row(CATEGORY_COLORS[b.category])}>
                <button
                  type="button"
                  style={{ ...styles.head, background: 'transparent', border: 'none', width: '100%', textAlign: 'left', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}
                  onClick={() => setExpanded(isOpen ? null : b.id)}
                  aria-expanded={isOpen}
                  aria-controls={`building-detail-${b.id}`}
                  aria-label={`${b.name} — ${isOpen ? 'collapse' : 'expand'} details`}
                >
                  <div style={{ flex: 1 }}>
                    <div style={styles.rowTop}>
                      {b.bmsNumber != null && <span style={styles.bmsTag}>#{b.bmsNumber}</span>}
                      <div style={styles.rowName}>{b.name}</div>
                      <Pill kind="info">{b.category}</Pill>
                    </div>
                    <div style={styles.rowMeta}>
                      {Math.round(b.kwh).toLocaleString()} kWh · {b.mt.toFixed(2)} mtCO₂e · {b.kgPerSqft.toFixed(1)} kg/sqft · {b.kgPerOccupant.toFixed(1)} kg/occupant
                      <span style={{ marginLeft: 8 }}>
                        {b.source === 'bms' && <ProvenancePill provenance="measured" label={`Measured · ${b.mappedMeterIds.length} PM`} />}
                        {b.source === 'snapshot' && <ProvenancePill provenance="cited" label="Snapshot YTD" />}
                        {b.source === 'none' && <ProvenancePill provenance="estimated" label="No meter mapped" />}
                      </span>
                    </div>
                  </div>
                  <span style={styles.arrow} aria-hidden="true">{isOpen ? '▼' : '▶'}</span>
                </button>
                {isOpen && (
                  <div id={`building-detail-${b.id}`}>
                    <div style={styles.detail}>
                      <Field label="Square footage" value={`${b.sqft.toLocaleString()} sqft`} />
                      <Field label="Occupants" value={b.occupants} />
                      {b.dormPopulation > 0 && <Field label="Dorm population" value={b.dormPopulation} />}
                      <Field label="HVAC schedule" value={b.hvacSchedule} />
                      <Field label="Heating setpoint" value={`${b.setpointHeatingF}°F`} />
                      <Field label="Cooling setpoint" value={`${b.setpointCoolingF}°F`} />
                      {b.powerKw != null && <Field label="Last observed demand" value={`${b.powerKw} kW`} />}
                      {b.avgVoltage != null && <Field label="Avg voltage" value={`${b.avgVoltage} V`} />}
                      {b.bmsNumber != null && <Field label="Distech BMS number" value={`#${b.bmsNumber}`} />}
                    </div>
                    <BmsExportPanel buildingId={b.id} />
                    <LivePanel buildingId={b.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 12,
        border: '1px solid',
        cursor: 'pointer',
        fontWeight: 600,
        background: active ? '#22d3ee' : '#0b1220',
        color: active ? '#0b1220' : '#cbd5e1',
        borderColor: active ? '#22d3ee' : '#1f2937',
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, value }) {
  return (
    <div style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      <span style={styles.fieldValue}>{value}</span>
    </div>
  );
}

function BmsExportPanel({ buildingId }) {
  // Look up which PM devices are mapped to this building, sum their
  // daily kWh series, render as a sparkline + total. Renders nothing
  // when no PM is mapped — keeps the row clean for un-mapped buildings.
  const map = getBmsMeterMap();
  const meterIds = Object.entries(map).filter(([, b]) => b === buildingId).map(([m]) => m);
  if (meterIds.length === 0) return null;
  const meters = meterIds.map((id) => bmsExportMeters.find((m) => m.id === id)).filter(Boolean);
  if (meters.length === 0) return null;

  const dailyMap = new Map();
  for (const m of meters) {
    for (const d of (m.daily || [])) {
      dailyMap.set(d.date, (dailyMap.get(d.date) || 0) + d.kwh);
    }
  }
  const daily = Array.from(dailyMap.entries()).sort().map(([date, kwh]) => ({ value: +kwh.toFixed(1), measured: true, date }));
  const totalKwh = daily.reduce((s, d) => s + d.value, 0);
  const peakKw = Math.max(...meters.map((m) => m.peakKw || 0));

  return (
    <div style={styles.bmsPanel}>
      <div style={styles.bmsHeader}>
        <ProvenancePill provenance="measured" />
        <span style={styles.bmsTitle}>BMS export · last 30 days</span>
        <span style={styles.bmsMeta}>{meterIds.length} mapped meter{meterIds.length === 1 ? '' : 's'}</span>
      </div>
      <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <Sparkline data={daily} color="#22c55e" fill="rgba(34, 197, 94, 0.18)" width={260} height={48} strokeWidth={2} showLast />
        <div style={{ fontSize: 12, color: '#cbd5e1' }}>
          <div><strong>{Math.round(totalKwh).toLocaleString()}</strong> kWh in window</div>
          <div>peak <strong>{peakKw}</strong> kW</div>
          <div style={{ color: '#64748b' }}>via {meterIds.join(', ')}</div>
        </div>
      </div>
    </div>
  );
}

function LivePanel({ buildingId }) {
  const [enabled, setEnabled] = useState(false);
  const { loading, data, error } = useBuildingEnergy(buildingId, enabled);

  function downloadCsv() {
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 3600 * 1000);
    const url = `/api/meters/readings/export?buildingId=${encodeURIComponent(buildingId)}&start=${start.toISOString()}&end=${end.toISOString()}`;
    window.open(url, '_blank');
  }

  return (
    <div style={styles.live}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          style={styles.liveBtn}
          onClick={() => setEnabled((v) => !v)}
          aria-expanded={enabled}
        >
          {enabled ? '× Hide live data' : '↻ Pull live 30-day energy from API'}
        </button>
        <button
          type="button"
          style={styles.liveBtn}
          onClick={downloadCsv}
          aria-label="Download last 30 days of readings as CSV"
        >
          ↓ Download 30-day CSV
        </button>
      </div>
      {enabled && (
        <div style={styles.liveBody}>
          {loading && <div style={styles.liveStatus}>Loading from /api/buildings/{buildingId}/energy …</div>}
          {error && <div style={{ ...styles.liveStatus, color: '#fca5a5' }}>Error: {error}</div>}
          {data && (
            <div style={styles.liveGrid}>
              <Field label="Live total (30d)" value={`${data.totalKwh.toLocaleString()} kWh`} />
              <Field label="Peak demand" value={`${data.peakKw} kW`} />
              <Field label="Live mtCO₂e" value={data.mtCO2e.toFixed(3)} />
              <Field label="Live kg/sqft" value={data.mtCO2ePerSqft.toFixed(2)} />
              <Field label="Live kg/occupant" value={data.mtCO2ePerOccupant.toFixed(2)} />
              <Field label="Daily samples" value={data.dailyKwh.length} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  qualityList: { display: 'grid', gap: 12 },
  qualityRow: { display: 'grid', gridTemplateColumns: 'minmax(140px, 180px) 1fr', gap: 18, padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  qualityMonthCol: { borderRight: '1px solid #1f2937', paddingRight: 14 },
  qualityMonth: { fontSize: 14, color: '#e5e7eb', fontWeight: 700 },
  qualityCaptured: { fontSize: 11, color: '#64748b', marginTop: 4 },
  qualityBarsCol: { display: 'grid', gap: 10 },
  qualityRowBar: { },
  qualityBarLabel: { fontSize: 12, color: '#cbd5e1', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  qualityBarBadge: { fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#052e1a', color: '#86efac', border: '1px solid #14532d', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 },
  qualityBarTrack: { position: 'relative', height: 22, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 4, overflow: 'hidden' },
  qualityBarFill: { position: 'absolute', top: 0, bottom: 0, left: 0, opacity: 0.4 },
  qualityBarValue: { position: 'absolute', top: 0, bottom: 0, left: 8, display: 'flex', alignItems: 'center', fontSize: 12, fontVariantNumeric: 'tabular-nums', color: '#e5e7eb', fontWeight: 600 },
  qualityGap: { fontSize: 11, color: '#94a3b8', marginTop: 4, fontVariantNumeric: 'tabular-nums' },
  qualityFooter: { marginTop: 14, padding: '12px 14px', background: '#0b1220', border: '1px dashed #334155', borderRadius: 6 },
  qualityMethodLine: { fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, marginTop: 4 },
  qualityMethodLabel: { color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 },

  bmsPanel: { marginTop: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22c55e', borderRadius: 6 },
  bmsHeader: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' },
  bmsTitle: { fontSize: 12, color: '#e5e7eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 },
  bmsMeta: { fontSize: 11, color: '#94a3b8' },



  filterRow: { display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' },
  label: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },

  list: { display: 'grid', gap: 8 },
  row: (color) => ({
    padding: '12px 14px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderLeft: `4px solid ${color}`,
    borderRadius: 8,
  }),
  head: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
  rowTop: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  bmsTag: { fontSize: 12, color: '#fbbf24', fontWeight: 700, background: '#3a2a0d', border: '1px solid #92400e', padding: '2px 8px', borderRadius: 6, fontVariantNumeric: 'tabular-nums' },
  rowName: { fontSize: 15, color: '#e5e7eb', fontWeight: 600 },
  rowMeta: { fontSize: 13, color: '#94a3b8', marginTop: 6 },
  arrow: { color: '#64748b' },

  detail: { marginTop: 12, paddingTop: 12, borderTop: '1px solid #1f2937', display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
  field: { display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' },
  fieldLabel: { color: '#64748b', fontWeight: 600 },
  fieldValue: { color: '#cbd5e1', textAlign: 'right' },

  live: { marginTop: 12, paddingTop: 12, borderTop: '1px solid #1f2937' },
  liveBtn: { padding: '8px 14px', background: '#0f172a', color: '#22d3ee', border: '1px solid #0e7490', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: 0.4 },
  liveBody: { marginTop: 12, padding: 12, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6 },
  liveStatus: { fontSize: 12, color: '#94a3b8', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  liveGrid: { display: 'grid', gap: 6, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
};
