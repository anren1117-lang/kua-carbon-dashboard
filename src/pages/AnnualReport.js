import React from 'react';
import { Link } from 'react-router-dom';
import { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E, GRID_MIX_ANNUAL_MTCO2E, gridMix } from '../data/gridMix.js';
import { ANNUAL_SEQUESTRATION_MT, TOTAL_FOREST_ACRES } from '../data/sinks.js';
import { SOLAR_ANNUAL_KWH } from '../data/renewables.js';
import { TOTAL_STUDENTS } from '../data/students.js';
import { reductionTargets, targetTrajectoryAt, trajectoryStatus } from '../data/targets.js';
import { reductionActions } from '../data/reductionActions.js';
import { rankActions } from '../utils/hotspots.js';
import { carbonEquivalents } from '../utils/equivalents.js';
import { SCOPE1_TOTAL_MT, SCOPE3_TOTAL_MT } from '../data/scopeTotals.js';
import { COMPOSED_ANNUAL_KWH, COMPOSED_YTD_AS_OF } from '../data/composedYtd.js';

// Trustee / parent-facing annual summary. Designed to print cleanly:
// no nav, no flashy interactions, every section uses 11pt body type
// when the print stylesheet is in effect.
//
// "Print" button uses window.print() — browser handles paper size +
// margins. The print CSS hides the nav and footer (see App.css).

// Use ANNUAL Scope 2 (Year 1 projection), not YTD. Older code path
// imported GRID_MIX_TOTAL_MTCO2E here which is the YTD figure — that
// silently understated the annual report's gross by ~240 mt.
const SCOPE_TOTALS = { scope1: SCOPE1_TOTAL_MT, scope2: GRID_MIX_ANNUAL_MTCO2E, scope3: SCOPE3_TOTAL_MT };
const GROSS = SCOPE_TOTALS.scope1 + SCOPE_TOTALS.scope2 + SCOPE_TOTALS.scope3;
const NET = GROSS - ANNUAL_SEQUESTRATION_MT;

export default function AnnualReport() {
  const cEq = carbonEquivalents(GROSS);
  const topActions = rankActions(reductionActions).slice(0, 5);
  const targets = reductionTargets;
  const year = new Date().getFullYear();

  return (
    <div style={styles.page} className="annual-report">
      <div style={styles.controls} className="no-print">
        <button type="button" style={styles.printBtn} onClick={() => window.print()}>
          🖨 Print or save as PDF
        </button>
        <Link to="/executive" style={styles.backLink}>← Back to dashboard</Link>
      </div>

      <header style={styles.header}>
        <div style={styles.brand}>Kimball Union Academy</div>
        <h1 style={styles.title}>Annual Carbon Report</h1>
        <div style={styles.subtitle}>Reporting period {year - 1}–{year} · Preliminary baseline</div>
      </header>

      <Section title="At a glance">
        <div style={styles.atGlance}>
          <Headline label="Net annual emissions" value={Math.round(NET).toLocaleString()} unit="mtCO₂e" tone="primary" />
          <Headline label="Per student" value={(NET / TOTAL_STUDENTS).toFixed(2)} unit="mtCO₂e" tone="muted" />
          <Headline label="Forest sequestration" value={Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()} unit="mtCO₂e/yr" tone="good" />
        </div>
        <p style={styles.lede}>
          KUA's gross emissions for {year - 1} are estimated at <strong>{Math.round(GROSS).toLocaleString()} mtCO₂e</strong>.
          The campus's roughly {TOTAL_FOREST_ACRES.toLocaleString()} acres of forest sequester an
          estimated <strong>{Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()} mtCO₂e/yr</strong>, leaving a
          net annual figure of <strong>{Math.round(NET).toLocaleString()} mtCO₂e</strong> — roughly
          <strong> {(NET / TOTAL_STUDENTS).toFixed(1)} per enrolled student</strong>. Peer
          residential schools that report figures publicly cluster between 6 and 10
          mtCO₂e/student/year; KUA's lower number is largely a function of measuring our
          forest, which most peers don't.
        </p>
      </Section>

      <Section title="Where the gross emissions come from">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Scope</th>
              <th style={styles.th}>Sources</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>mtCO₂e/yr</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Share</th>
            </tr>
          </thead>
          <tbody>
            <ScopeRow scope="Scope 1" sources="Heating fuel · refrigerants · fleet vehicles" mt={SCOPE_TOTALS.scope1} share={(SCOPE_TOTALS.scope1 / GROSS) * 100} />
            <ScopeRow scope="Scope 2" sources="Purchased electricity from the ISO-NE grid" mt={SCOPE_TOTALS.scope2} share={(SCOPE_TOTALS.scope2 / GROSS) * 100} />
            <ScopeRow scope="Scope 3" sources="Student travel · food procurement · waste · purchased goods · staff commuting" mt={SCOPE_TOTALS.scope3} share={(SCOPE_TOTALS.scope3 / GROSS) * 100} />
            <tr>
              <td style={{ ...styles.td, fontWeight: 700 }}>Gross total</td>
              <td style={styles.td}></td>
              <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{Math.round(GROSS).toLocaleString()}</td>
              <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700 }}>100%</td>
            </tr>
            <tr>
              <td style={{ ...styles.td, color: '#22c55e' }}>Sinks (forest)</td>
              <td style={styles.td}>~{TOTAL_FOREST_ACRES.toLocaleString()} acres of campus forest</td>
              <td style={{ ...styles.td, textAlign: 'right', color: '#22c55e', fontVariantNumeric: 'tabular-nums' }}>−{Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()}</td>
              <td style={{ ...styles.td, textAlign: 'right', color: '#22c55e' }}>—</td>
            </tr>
            <tr>
              <td style={{ ...styles.td, fontWeight: 700, borderTop: '2px solid #1f2937' }}>Net</td>
              <td style={{ ...styles.td, borderTop: '2px solid #1f2937' }}></td>
              <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums', borderTop: '2px solid #1f2937' }}>{Math.round(NET).toLocaleString()}</td>
              <td style={{ ...styles.td, textAlign: 'right', borderTop: '2px solid #1f2937' }}>—</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="Electricity supply">
        <p style={styles.body}>
          KUA's ~{COMPOSED_ANNUAL_KWH.toLocaleString()} kWh of Year 1 projected annual electricity ({GRID_MIX_TOTAL_KWH.toLocaleString()} kWh measured YTD through {COMPOSED_YTD_AS_OF}, seasonally projected) comes through the ISO New England regional grid. The 2024 system mix was:
        </p>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Source</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Share</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>kWh allocated to KUA</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>mtCO₂e</th>
            </tr>
          </thead>
          <tbody>
            {gridMix.map((m) => {
              // gridMix entries are derived from COMPOSED_YTD_KWH (YTD).
              // The annual report is annual, so scale the per-fuel kWh
              // and mt to Year 1 by the same factor used in
              // GRID_MIX_ANNUAL_MTCO2E (live, no need to import again).
              const factor = GRID_MIX_ANNUAL_MTCO2E / GRID_MIX_TOTAL_MTCO2E;
              return (
                <tr key={m.source}>
                  <td style={styles.td}>{m.source}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{m.mixPercent}%</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(m.kwhUsed * factor).toLocaleString()}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{(m.mtCO2e * factor).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ ...styles.body, marginTop: 12, color: '#475569' }}>
          The Whittemore rooftop array (40 kW DC, going operational this year) is projected to
          generate ~{SOLAR_ANNUAL_KWH.toLocaleString()} kWh — about
          {' '}{Math.round((SOLAR_ANNUAL_KWH / GRID_MIX_TOTAL_KWH) * 100)}% of campus demand at peak
          summer output, displacing the equivalent grid-driven emissions.
        </p>
      </Section>

      <Section title="Reduction pathway">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Target</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Baseline</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Target {`(${''})`}</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((t) => {
              const expected = targetTrajectoryAt(t, year);
              const status = trajectoryStatus(t, t.baselineValue, year); // baseline as placeholder until live measured value lands
              return (
                <tr key={t.id}>
                  <td style={styles.td}>{t.title}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round(t.baselineValue).toLocaleString()} <span style={{ color: '#64748b' }}>({t.baselineYear})</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    −{t.percentReduction}% by {t.targetYear}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right', textTransform: 'capitalize' }}>{status.replace('_', ' ')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ ...styles.body, marginTop: 12, color: '#475569', fontStyle: 'italic' }}>
          Targets are preliminary pending board approval. Trajectory status is computed
          against the linear path between baseline and target year.
        </p>
      </Section>

      <Section title="Top reduction actions in queue">
        <ol style={styles.actionList}>
          {topActions.map(({ action }) => (
            <li key={action.id} style={styles.actionItem}>
              <div style={styles.actionTitle}>{action.title}</div>
              <div style={styles.actionMeta}>
                ~{action.expectedReductionMtCO2e} mtCO₂e/yr · {action.estimatedCostUsd === 0 ? 'no upfront cost' : `$${action.estimatedCostUsd.toLocaleString()}`} · owned by {action.owner}
              </div>
              <div style={styles.actionDesc}>{action.description}</div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="What that gross figure equals">
        <p style={styles.body}>The {Math.round(GROSS).toLocaleString()} mtCO₂e gross figure is roughly equivalent to:</p>
        <ul style={styles.equivList}>
          <li>{cEq.carYears.toLocaleString()} cars driven for a year</li>
          <li>{cEq.treeYears.toLocaleString()} tree-years of absorption</li>
          <li>{cEq.homeYears.toLocaleString()} US homes powered for a year</li>
          <li>{cEq.transatFlights.toLocaleString()} transatlantic flights</li>
          <li>{cEq.galsGasoline.toLocaleString()} gallons of gasoline</li>
        </ul>
      </Section>

      <Section title="Methodology notes">
        <ul style={styles.notes}>
          <li><strong>Source factors.</strong> Electricity uses ISO-NE 2024 generation mix with per-fuel output emission factors (~0.235 kg CO₂/kWh effective system rate, in eGRID NEWE 2022 published range). Heating fuel uses EPA Greenhouse Gas Emission Factors Hub. Food uses Poore & Nemecek (2018). Waste uses EPA WARM v15. Procurement uses US EPA EEIO v2.0 spend-based.</li>
          <li><strong>Forest sequestration</strong> uses stand-specific accumulation rates from Birdsey (1992) for closed-canopy and Nowak (2013) for open-grown trees.</li>
          <li><strong>This report is preliminary.</strong> Until the data ingestion pipeline is fully populated, several Scope 3 figures (student travel, food procurement, supplier emissions) are estimates. The dashboard at <em>/data-admin</em> shows the live data quality status.</li>
          <li><strong>Audit trail.</strong> Every emission factor in the dashboard carries its citation and year. The full registry is at <em>/data-admin</em>.</li>
        </ul>
      </Section>

      <footer style={styles.footer}>
        Generated from the KUA Carbon Operating System ·
        {' '}{new Date().toISOString().slice(0, 10)} ·
        {' '}methodology and source code public on GitHub
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>{title}</h2>
      {children}
    </section>
  );
}

function Headline({ label, value, unit, tone }) {
  return (
    <div style={styles.headline}>
      <div style={styles.headlineLabel}>{label}</div>
      <div style={{ ...styles.headlineValue, color: tone === 'good' ? '#15803d' : tone === 'primary' ? '#0e7490' : '#334155' }}>
        {value}<span style={styles.headlineUnit}>{unit}</span>
      </div>
    </div>
  );
}

function ScopeRow({ scope, sources, mt, share }) {
  return (
    <tr>
      <td style={styles.td}><strong>{scope}</strong></td>
      <td style={styles.td}>{sources}</td>
      <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(mt).toLocaleString()}</td>
      <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{share.toFixed(0)}%</td>
    </tr>
  );
}

const styles = {
  page: { maxWidth: 820, margin: '0 auto', padding: '24px 32px', background: '#fff', color: '#1f2937', fontFamily: 'Georgia, "Times New Roman", serif', lineHeight: 1.6 },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  printBtn: { padding: '8px 16px', background: '#0e7490', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit' },
  backLink: { color: '#0e7490', textDecoration: 'none', fontSize: 14 },

  header: { textAlign: 'center', marginBottom: 32, paddingBottom: 16, borderBottom: '2px solid #1f2937' },
  brand: { fontSize: 14, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.6, fontWeight: 700 },
  title: { fontSize: 36, fontWeight: 800, color: '#1f2937', margin: '8px 0 4px' },
  subtitle: { fontSize: 14, color: '#475569', fontStyle: 'italic' },

  section: { marginTop: 28 },
  h2: { fontSize: 18, fontWeight: 800, color: '#1f2937', borderBottom: '1px solid #cbd5e1', paddingBottom: 6, marginBottom: 14, fontVariant: 'small-caps', letterSpacing: 1 },

  atGlance: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 },
  headline: { padding: '14px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 4 },
  headlineLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  headlineValue: { fontSize: 26, fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 },
  headlineUnit: { fontSize: 12, color: '#64748b', marginLeft: 6, fontWeight: 500 },

  body: { fontSize: 14, color: '#1f2937', margin: '0 0 12px' },
  lede: { fontSize: 15, color: '#1f2937', lineHeight: 1.7 },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 },
  th: { textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid #1f2937', fontSize: 11, color: '#1f2937', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, fontFamily: 'inherit' },
  td: { padding: '8px 10px', borderBottom: '1px solid #e2e8f0', color: '#1f2937', fontFamily: 'inherit' },

  actionList: { paddingLeft: 18 },
  actionItem: { marginBottom: 12 },
  actionTitle: { fontSize: 14, color: '#1f2937', fontWeight: 700 },
  actionMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  actionDesc: { fontSize: 13, color: '#475569', marginTop: 4, lineHeight: 1.5 },

  equivList: { fontSize: 14, color: '#1f2937', paddingLeft: 22, lineHeight: 1.8, margin: 0 },
  notes: { fontSize: 13, color: '#475569', paddingLeft: 22, lineHeight: 1.6, margin: 0 },

  footer: { marginTop: 36, paddingTop: 16, borderTop: '1px solid #cbd5e1', fontSize: 11, color: '#64748b', textAlign: 'center' },
};
