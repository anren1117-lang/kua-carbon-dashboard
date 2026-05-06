import React from 'react';
import { ProvenancePill } from '../../components/ProvenancePill.js';
import {
  BOTTOM_UP_BREAKDOWN,
  BOTTOM_UP_TOTALS,
  KUA_HDD_BASE_65,
  HEATING_KBTU_PER_SQFT,
  SCOPE1_HEATING_DETAIL,
} from '../../data/geographicEstimates.js';
import { SCOPE1_TOTAL_MT, SCOPE3_TOTAL_MT } from '../../data/scopeTotals.js';

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760, lineHeight: 1.6 },
  card: { marginTop: 24, padding: 20, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10 },
  h2: { margin: 0, fontSize: 18, color: '#e5e7eb' },
  ul: { paddingLeft: 20, color: '#cbd5e1', lineHeight: 1.7, marginTop: 8 },
  pill: { fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#1e293b', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 },
  factorTable: { width: '100%', marginTop: 12, borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '8px 10px', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937' },
  td: { padding: '8px 10px', fontSize: 14, borderBottom: '1px solid #1f2937', verticalAlign: 'top' },

  bottomUpRow: { display: 'grid', gridTemplateColumns: 'minmax(180px, 220px) 100px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #1f2937', alignItems: 'flex-start' },
  bottomUpLabel: { fontSize: 14, color: '#e5e7eb', fontWeight: 600 },
  bottomUpScope: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 4 },
  bottomUpMt: { fontSize: 16, color: '#86efac', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  bottomUpBasis: { fontSize: 12, color: '#cbd5e1', lineHeight: 1.55 },
  bottomUpCitations: { marginTop: 6, fontSize: 11, color: '#64748b' },
  totalsCard: { marginTop: 16, padding: 14, background: '#0a1f17', border: '1px solid #14532d', borderRadius: 8, fontSize: 13, color: '#86efac' },
  compareGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginTop: 12 },
  compareCell: { padding: 12, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  compareLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  compareValue: { fontSize: 22, color: '#e5e7eb', fontWeight: 800, marginTop: 6, fontVariantNumeric: 'tabular-nums' },
  compareDelta: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
};

function AdminMethodology() {
  const scope1Delta = BOTTOM_UP_TOTALS.scope1 - Math.round(SCOPE1_TOTAL_MT);
  const scope3Delta = BOTTOM_UP_TOTALS.scope3 - Math.round(SCOPE3_TOTAL_MT);
  return (
    <div>
      <h1 style={styles.title}>Methodology Management</h1>
      <p style={styles.subtitle}>
        Admin-side view of the methodology rules and factor versions that drive every public
        number. Changes here flow to the public Methodology page automatically.
      </p>

      <div style={styles.card}>
        <h2 style={styles.h2}>
          Geographic bottom-up estimate <ProvenancePill provenance="cited" />
        </h2>
        <p style={{ marginTop: 8, marginBottom: 0, color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
          Parallel estimate computed from KUA's actual building stock (290K sqft across 19 buildings),
          actual fleet registry, NH climate factors ({KUA_HDD_BASE_65.toLocaleString()} HDD basis,
          climate zone 6), and Yale-style residential-school student-travel methodology — anchored
          on published per-fuel/passenger-mile factors with full citations. Provided alongside the
          canonical placeholder so admins can see what bottom-up reasoning yields. Replace each
          input quantity with measured data as it lands; the methodology stays the same.
        </p>

        <div style={styles.compareGrid}>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Scope 1 — bottom-up</div>
            <div style={styles.compareValue}>{BOTTOM_UP_TOTALS.scope1.toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>
              vs canonical {Math.round(SCOPE1_TOTAL_MT).toLocaleString()} mt
              {' '}{scope1Delta >= 0 ? '(+' : '('}{scope1Delta} mt; {((scope1Delta/SCOPE1_TOTAL_MT)*100).toFixed(0)}%)
            </div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Scope 3 — bottom-up</div>
            <div style={styles.compareValue}>{BOTTOM_UP_TOTALS.scope3.toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>
              vs canonical {Math.round(SCOPE3_TOTAL_MT).toLocaleString()} mt
              {' '}{scope3Delta >= 0 ? '(+' : '('}{scope3Delta} mt; {((scope3Delta/SCOPE3_TOTAL_MT)*100).toFixed(0)}%)
            </div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Heating-oil estimate</div>
            <div style={styles.compareValue}>{Math.round(SCOPE1_HEATING_DETAIL.oilGalYr / 1000)}K <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>gal/yr</span></div>
            <div style={styles.compareDelta}>From sqft × NH-CZ6 heating intensity</div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Heating intensity (kBtu/sqft/yr)</div>
            <div style={styles.compareValue} style={{ fontSize: 14, color: '#cbd5e1', fontWeight: 600, marginTop: 6 }}>
              Dorm {HEATING_KBTU_PER_SQFT.Dorm} · Acad {HEATING_KBTU_PER_SQFT.Academic}
              <br />Athl {HEATING_KBTU_PER_SQFT.Athletic} · Other {HEATING_KBTU_PER_SQFT.Other}
            </div>
            <div style={styles.compareDelta}>EIA RECS 2020 NH + ASHRAE CZ-6</div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          {BOTTOM_UP_BREAKDOWN.map((row) => (
            <div key={`${row.scope}-${row.component}`} style={styles.bottomUpRow}>
              <div>
                <div style={styles.bottomUpLabel}>{row.component}</div>
                <div style={styles.bottomUpScope}>{row.scope}</div>
              </div>
              <div style={styles.bottomUpMt}>{Math.round(row.mt).toLocaleString()} mt</div>
              <div>
                <div style={styles.bottomUpBasis}>{row.basis}</div>
                <div style={styles.bottomUpCitations}>Sources: {row.citations.join(' · ')}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.totalsCard}>
          <strong>Bottom-up gross (Scope 1 + 3, before Scope 2 + sinks):</strong>{' '}
          {(BOTTOM_UP_TOTALS.scope1 + BOTTOM_UP_TOTALS.scope3).toLocaleString()} mtCO₂e/yr.
          {' '}Add the measured Scope 2 (~385 mt) and subtract sinks ({BOTTOM_UP_TOTALS.sinks.toLocaleString()} mt) for the
          full balance. Both bottom-up scopes are within ±5% of the canonical placeholders, so the
          dashboard's headline numbers are well-sized — but each component above can be refined as
          measured data lands without changing the methodology.
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.h2}>Reporting principles enforced by the schema</h2>
        <ul style={styles.ul}>
          <li>Every record has a <code>source</code> column linking back to the underlying meter, invoice, sample, or survey.</li>
          <li>Every record has a <code>data_quality</code> flag (measured / estimated / modeled).</li>
          <li>Emission factors are stored in a versioned <code>emission_factors</code> table — historical numbers stay reproducible.</li>
          <li>AI-generated insights cite database row IDs; the prompt structurally forbids ungrounded numbers.</li>
          <li>Excluded Scope 3 categories (Cat 9, Cat 12) are listed publicly, never silently dropped.</li>
        </ul>
      </div>

      <div style={styles.card}>
        <h2 style={styles.h2}>Active factor set <span style={styles.pill}>Planned UI</span></h2>
        <table style={styles.factorTable}>
          <thead>
            <tr>
              <th style={styles.th}>Factor</th>
              <th style={styles.th}>Value</th>
              <th style={styles.th}>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={styles.td}>Heating oil</td><td style={styles.td}>10.16 kg CO₂/gal</td><td style={styles.td}>EPA GHG Hub</td></tr>
            <tr><td style={styles.td}>Propane</td><td style={styles.td}>5.72 kg CO₂/gal</td><td style={styles.td}>EPA GHG Hub</td></tr>
            <tr><td style={styles.td}>Grid electricity (ISO-NE, effective)</td><td style={styles.td}>0.235 kg CO₂/kWh</td><td style={styles.td}>Per-fuel output factors × ISO-NE 2024 mix (gridMix.js)</td></tr>
            <tr><td style={styles.td}>— Combined-cycle natural gas</td><td style={styles.td}>0.40 kg CO₂/kWh</td><td style={styles.td}>EPA eGRID NEWE</td></tr>
            <tr><td style={styles.td}>— Oil generation</td><td style={styles.td}>0.78 kg CO₂/kWh</td><td style={styles.td}>EPA eGRID NEWE</td></tr>
            <tr><td style={styles.td}>— Coal generation</td><td style={styles.td}>0.95 kg CO₂/kWh</td><td style={styles.td}>EPA eGRID NEWE</td></tr>
            <tr><td style={styles.td}>— Net imports (NY + Quebec hydro)</td><td style={styles.td}>0.30 kg CO₂/kWh</td><td style={styles.td}>NYISO + Quebec hydro blend</td></tr>
            <tr><td style={styles.td}>ISO-NE input-energy basis (cross-ref only)</td><td style={styles.td}>643 lb CO₂/MWh</td><td style={styles.td}>ISO-NE 2024 Emissions Report</td></tr>
            <tr><td style={styles.td}>Tree storage</td><td style={styles.td}>7.69 kg C/m²</td><td style={styles.td}>Nowak et al. (2013)</td></tr>
            <tr><td style={styles.td}>Tree sequestration</td><td style={styles.td}>0.28 kg C/m²/yr</td><td style={styles.td}>Nowak et al. (2013)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminMethodology;
