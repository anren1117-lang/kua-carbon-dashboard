import React from 'react';

const sources = [
  { domain: 'Framework', source: 'GHG Protocol — Scope 1 / 2 / 3', use: 'Inventory boundaries and dual-reporting (location- vs market-based)' },
  { domain: 'Electricity', source: 'ISO New England Electric Generator Air Emissions Report (2024 data)', use: '643 lb CO₂/MWh regional; 177 lb CO₂/MWh imported' },
  { domain: 'Fuel', source: 'EPA GHG Emission Factors Hub', use: '10.16 kg CO₂/gal heating oil; 5.72 kg CO₂/gal propane' },
  { domain: 'Refrigerants', source: 'IPCC AR6 Global Warming Potentials', use: 'GWP100 conversions for fugitive HVAC leakage' },
  { domain: 'Waste', source: 'EPA Waste Reduction Model (WARM)', use: 'Landfill / recycling / composting net factors' },
  { domain: 'Air travel', source: 'DEFRA conversion factors', use: 'Per-passenger-km with radiative forcing multiplier' },
  { domain: 'Purchased goods', source: 'EPA Supply Chain GHG Emission Factors (EEIO)', use: 'Spend-based Scope 3 Cat 1 estimates' },
  { domain: 'Tree sequestration', source: 'Nowak et al. (2013), Urban Forestry & Urban Greening', use: '7.69 kg C/m² storage, 0.28 kg C/m²/yr sequestration' },
  { domain: 'Soil & forest carbon', source: 'Morin et al. (2020), USDA NH forest inventory; Birdsey (1992)', use: 'Land-use-weighted soil carbon baselines' },
  { domain: 'AI ingestion', source: 'Dagdelen et al. (2024), Nature Communications', use: 'LLM-based structured extraction approach' },
];

const principles = [
  'Every numeric value links back to its source record (real-time meter, invoice, sample, survey).',
  'Measured values are visually distinguished from estimates throughout the UI.',
  'Emission factors are versioned in the database so historical numbers remain reproducible when factors are updated.',
  'AI-generated text is constrained at the prompt level to reference values present in the database, exposes a “show calculation” control, and is visually distinct from measured data.',
  'Scope 3 categories not applicable to a school (Cat 9, Cat 12) are explicitly excluded rather than silently dropped.',
];

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  section: { marginTop: 32 },
  h2: { fontSize: 18, marginBottom: 12, color: '#e5e7eb' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8, overflow: 'hidden' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937' },
  td: { padding: '10px 12px', fontSize: 14, borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  ul: { paddingLeft: 20, color: '#cbd5e1', lineHeight: 1.6 },
};

function Methodology() {
  return (
    <div>
      <h1 style={styles.title}>Methodology</h1>
      <p style={styles.subtitle}>
        Every emission factor, framework choice, and data boundary used by this dashboard,
        with citations. Updated whenever a factor or methodology is added or revised.
      </p>

      <section style={styles.section}>
        <h2 style={styles.h2}>Data sources & emission factors</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Domain</th>
              <th style={styles.th}>Source</th>
              <th style={styles.th}>Use</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.domain + s.source}>
                <td style={styles.td}>{s.domain}</td>
                <td style={styles.td}>{s.source}</td>
                <td style={styles.td}>{s.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={styles.section}>
        <h2 style={styles.h2}>Reporting principles</h2>
        <ul style={styles.ul}>
          {principles.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </section>
    </div>
  );
}

export default Methodology;
