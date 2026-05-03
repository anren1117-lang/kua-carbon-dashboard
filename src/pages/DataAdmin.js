import React from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { meters } from '../data/meters.js';
import { emissionFactors } from '../data/emissionFactors.js';
import { buildings } from '../data/buildings.js';

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

export default function DataAdmin() {
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
