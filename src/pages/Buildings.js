import React, { useState, useMemo, useEffect } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { buildings } from '../data/buildings.js';
import { envysionSnapshot } from '../data/envysionSnapshot.js';
import { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E } from '../data/gridMix.js';
import { monthlyPattern } from '../data/seasonalPatterns.js';
import { Sparkline } from '../components/Sparkline.js';

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
    const snapshotById = Object.fromEntries(envysionSnapshot.map((r) => [r.buildingId, r]));
    return buildings.map((b) => {
      const snap = snapshotById[b.id];
      const kwh = snap?.energyUsedKwh ?? 0;
      const mt = (kwh * KG_PER_KWH) / 1000;
      return {
        ...b,
        kwh,
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
        hint="Aggregate kWh shape over the year. Winter peaks reflect heating-driven plug load; summer dip is everyone-off-campus."
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Sparkline
            data={monthlyPattern.map((m) => m.emissions)}
            color="#22d3ee"
            fill="rgba(34, 211, 238, 0.18)"
            width={420}
            height={64}
            strokeWidth={2}
            showLast
          />
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            Jan → Dec, mtCO₂e per month from the ISO-NE 2024 baseline
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

function LivePanel({ buildingId }) {
  const [enabled, setEnabled] = useState(false);
  const { loading, data, error } = useBuildingEnergy(buildingId, enabled);
  return (
    <div style={styles.live}>
      <button
        type="button"
        style={styles.liveBtn}
        onClick={() => setEnabled((v) => !v)}
      >
        {enabled ? '× Hide live data' : '↻ Pull live 30-day energy from API'}
      </button>
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
