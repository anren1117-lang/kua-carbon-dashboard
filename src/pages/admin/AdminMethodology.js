import React from 'react';
import { ProvenancePill } from '../../components/ProvenancePill.js';
import {
  BOTTOM_UP_BREAKDOWN,
  BOTTOM_UP_TOTALS,
  KUA_HDD_BASE_65,
  HEATING_KBTU_PER_SQFT,
  SCOPE1_HEATING_DETAIL,
  SCOPE1_RANGE,
  SCOPE1_COMPONENT_RANGES,
  SCOPE3_RANGE,
  SCOPE3_COMPONENT_RANGES,
  SINKS_RANGE,
  SINKS_COMPONENT_RANGES,
} from '../../data/geographicEstimates.js';
import { ANNUAL_SEQUESTRATION_MT } from '../../data/sinks.js';
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
        <h2 style={styles.h2}>
          Composite gross + net range (every scope, every method) <ProvenancePill provenance="cited" />
        </h2>
        <p style={{ marginTop: 8, marginBottom: 14, color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
          Roll-up of the per-component low/central/high across Scope 1 + Scope 2 (±5% measured
          band) + Scope 3 + sinks (negative). The brackets show what KUA's full balance looks like
          across the spread of reasonable methodologies — the central column is what the public
          dashboard reports today.
        </p>
        {(() => {
          const s2Low = 366, s2Central = 385, s2High = 405; // measured ±5%
          const grossLow = SCOPE1_RANGE.low + s2Low + SCOPE3_RANGE.low;
          const grossCentral = SCOPE1_RANGE.central + s2Central + SCOPE3_RANGE.central;
          const grossHigh = SCOPE1_RANGE.high + s2High + SCOPE3_RANGE.high;
          const netLow = grossLow - SINKS_RANGE.high;       // most-negative net = smallest gross + biggest drawdown
          const netCentral = grossCentral - SINKS_RANGE.central;
          const netHigh = grossHigh - SINKS_RANGE.low;      // largest net = biggest gross + smallest drawdown
          return (
            <div style={styles.compareGrid}>
              <div style={styles.compareCell}>
                <div style={styles.compareLabel}>Gross (S1 + S2 + S3)</div>
                <div style={styles.compareValue}>{Math.round(grossCentral).toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
                <div style={styles.compareDelta}>Range {Math.round(grossLow).toLocaleString()} – {Math.round(grossHigh).toLocaleString()} mt</div>
              </div>
              <div style={styles.compareCell}>
                <div style={styles.compareLabel}>Sinks drawdown</div>
                <div style={styles.compareValue}>−{Math.round(SINKS_RANGE.central).toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
                <div style={styles.compareDelta}>Range −{Math.round(SINKS_RANGE.low).toLocaleString()} to −{Math.round(SINKS_RANGE.high).toLocaleString()} mt</div>
              </div>
              <div style={styles.compareCell}>
                <div style={styles.compareLabel}>Net (gross − sinks)</div>
                <div style={styles.compareValue}>{Math.round(netCentral).toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
                <div style={styles.compareDelta}>Range {Math.round(netLow).toLocaleString()} – {Math.round(netHigh).toLocaleString()} mt</div>
              </div>
              <div style={styles.compareCell}>
                <div style={styles.compareLabel}>Per student (net)</div>
                <div style={styles.compareValue}>{(netCentral / BOTTOM_UP_TOTALS.studentsAtBasis).toFixed(1)}<span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}> mt/student</span></div>
                <div style={styles.compareDelta}>Range {(netLow / BOTTOM_UP_TOTALS.studentsAtBasis).toFixed(1)} – {(netHigh / BOTTOM_UP_TOTALS.studentsAtBasis).toFixed(1)} mt/student</div>
              </div>
            </div>
          );
        })()}
      </div>

      <div style={styles.card}>
        <h2 style={styles.h2}>
          Scope 1 estimate range — multiple methods per component <ProvenancePill provenance="cited" />
        </h2>
        <p style={{ marginTop: 8, marginBottom: 14, color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
          Same multi-method treatment as Scope 3, applied to KUA's direct combustion + leakage
          sources. The whole-Scope-1 range
          ({SCOPE1_RANGE.low.toLocaleString()}–{SCOPE1_RANGE.high.toLocaleString()} mtCO₂e/yr,
          central {SCOPE1_RANGE.central.toLocaleString()}) brackets every reasonable interpretation
          of building energy intensity, fleet maintenance state, and refrigerant leak rate. The
          canonical placeholder ({Math.round(SCOPE1_TOTAL_MT).toLocaleString()} mt) sits inside.
        </p>
        <div style={styles.compareGrid}>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Scope 1 — low</div>
            <div style={styles.compareValue}>{SCOPE1_RANGE.low.toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>Modern stock + best-practice leak</div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Scope 1 — central</div>
            <div style={styles.compareValue}>{SCOPE1_RANGE.central.toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>Mean across methods</div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Scope 1 — high</div>
            <div style={styles.compareValue}>{SCOPE1_RANGE.high.toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>Older stock + aging-equipment</div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Spread</div>
            <div style={styles.compareValue}>±{Math.round(((SCOPE1_RANGE.high - SCOPE1_RANGE.low) / 2) / SCOPE1_RANGE.central * 100)}%</div>
            <div style={styles.compareDelta}>Range as % of central</div>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          {SCOPE1_COMPONENT_RANGES.map((row) => (
            <Scope3RangeRow key={row.component} row={row} />
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.h2}>
          Scope 3 estimate range — multiple methods per component <ProvenancePill provenance="cited" />
        </h2>
        <p style={{ marginTop: 8, marginBottom: 14, color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
          A single number for Scope 3 hides the fact that the answer depends heavily on which
          methodology you anchor on. For each component below we run 3-4 independent methods
          (e.g. Yale-style cohort method vs Andover/Exeter peer benchmark vs national long-tail
          scenario for US boarders) and report the spread. The whole-Scope-3 range
          ({SCOPE3_RANGE.low.toLocaleString()}–{SCOPE3_RANGE.high.toLocaleString()} mtCO₂e/yr,
          central {SCOPE3_RANGE.central.toLocaleString()}) brackets every reasonable interpretation
          of KUA's situation. The canonical placeholder ({Math.round(SCOPE3_TOTAL_MT).toLocaleString()} mt) sits inside.
        </p>

        <div style={styles.compareGrid}>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Scope 3 — low</div>
            <div style={styles.compareValue}>{SCOPE3_RANGE.low.toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>Best-case bound across methods</div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Scope 3 — central</div>
            <div style={styles.compareValue}>{SCOPE3_RANGE.central.toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>Mean of method means</div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Scope 3 — high</div>
            <div style={styles.compareValue}>{SCOPE3_RANGE.high.toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>Upper bound across methods</div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Spread</div>
            <div style={styles.compareValue}>±{Math.round(((SCOPE3_RANGE.high - SCOPE3_RANGE.low) / 2) / SCOPE3_RANGE.central * 100)}%</div>
            <div style={styles.compareDelta}>Range as % of central</div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          {SCOPE3_COMPONENT_RANGES.map((row) => (
            <Scope3RangeRow key={row.component} row={row} />
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.h2}>
          Sinks (forest sequestration) estimate range <ProvenancePill provenance="cited" />
        </h2>
        <p style={{ marginTop: 8, marginBottom: 14, color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
          KUA's ~1,000 acres of campus forest. Three published methodologies: Birdsey 1992
          (US-forest average), USDA NH FIA Morin 2020 (NH-specific), Nowak 2013 (stand-specific
          weighted by KUA forest type mix). Range
          {' '}{Math.round(SINKS_RANGE.low).toLocaleString()}–{Math.round(SINKS_RANGE.high).toLocaleString()} mtCO₂e/yr drawdown,
          central {Math.round(SINKS_RANGE.central).toLocaleString()}. Canonical sinks figure
          ({Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()} mt) tracks the Nowak stand-specific
          method, which is the highest-fidelity bound for KUA's actual forest mix.
        </p>
        <div style={styles.compareGrid}>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Sinks — low</div>
            <div style={styles.compareValue}>{Math.round(SINKS_RANGE.low).toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>US-forest average (Birdsey)</div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Sinks — central</div>
            <div style={styles.compareValue}>{Math.round(SINKS_RANGE.central).toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>Mean across methods</div>
          </div>
          <div style={styles.compareCell}>
            <div style={styles.compareLabel}>Sinks — high</div>
            <div style={styles.compareValue}>{Math.round(SINKS_RANGE.high).toLocaleString()} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>mt</span></div>
            <div style={styles.compareDelta}>Stand-specific (Nowak / NH FIA)</div>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          {SINKS_COMPONENT_RANGES.map((row) => (
            <Scope3RangeRow key={row.component} row={row} />
          ))}
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

function Scope3RangeRow({ row }) {
  const span = row.high - row.low;
  return (
    <div style={s3Styles.row}>
      <div style={s3Styles.head}>
        <div style={s3Styles.title}>{row.component}</div>
        <div style={s3Styles.range}>
          <span style={s3Styles.lo}>{Math.round(row.low).toLocaleString()}</span>
          <span style={s3Styles.sep}> – </span>
          <span style={s3Styles.hi}>{Math.round(row.high).toLocaleString()}</span>
          <span style={s3Styles.unit}> mt/yr</span>
          <span style={s3Styles.central}>· central {Math.round(row.central).toLocaleString()}</span>
        </div>
      </div>
      <div style={s3Styles.bar}>
        <div
          style={{
            ...s3Styles.barFill,
            width: span > 0 ? '100%' : '4px',
          }}
          title={`Span ${Math.round(span).toLocaleString()} mt across ${row.methods.length} methods`}
        />
      </div>
      <div style={s3Styles.methodsList}>
        {row.methods.map((m, i) => (
          <div key={i} style={s3Styles.method}>
            <div style={s3Styles.methodHead}>
              <span style={s3Styles.methodLabel}>{m.label}</span>
              <span style={s3Styles.methodMt}>{Math.round(m.mt).toLocaleString()} mt</span>
            </div>
            <div style={s3Styles.methodBasis}>{m.basis}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s3Styles = {
  row: { padding: '14px 0', borderBottom: '1px solid #1f2937' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 8 },
  title: { fontSize: 14, color: '#e5e7eb', fontWeight: 700 },
  range: { fontSize: 13, fontVariantNumeric: 'tabular-nums' },
  lo: { color: '#86efac', fontWeight: 700 },
  hi: { color: '#fbbf24', fontWeight: 700 },
  sep: { color: '#475569' },
  unit: { color: '#94a3b8', marginLeft: 4 },
  central: { color: '#cbd5e1', marginLeft: 10, fontSize: 12 },
  bar: { height: 4, background: 'linear-gradient(90deg, #22c55e 0%, #fbbf24 100%)', borderRadius: 2, marginBottom: 10 },
  barFill: { height: '100%', background: 'transparent' },
  methodsList: { display: 'grid', gap: 8, marginTop: 4 },
  method: { padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  methodHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  methodLabel: { fontSize: 12, color: '#22d3ee', fontWeight: 700 },
  methodMt: { fontSize: 12, color: '#cbd5e1', fontVariantNumeric: 'tabular-nums', fontWeight: 600 },
  methodBasis: { fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginTop: 4 },
};

export default AdminMethodology;
