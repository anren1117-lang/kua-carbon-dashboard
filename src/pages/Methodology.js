import React from 'react';

const sources = [
  { domain: 'Framework', source: 'GHG Protocol — Scope 1 / 2 / 3', use: 'Inventory boundaries and dual-reporting (location- vs market-based)' },
  { domain: 'Electricity', source: 'ISO New England Electric Generator Air Emissions Report (2024 data) + EPA eGRID NEWE per-fuel rates', use: 'Per-fuel output-basis kg/kWh (combined-cycle gas 0.40, oil 0.78, coal 0.95, imports 0.30) summed across the 2024 generation mix → effective ~0.234 kg/kWh. ISO-NE also publishes 643 lb CO₂/MWh on an input-energy basis; we report against the output-basis number to align with how building-level kWh maps to emissions.' },
  { domain: 'Fuel', source: 'EPA GHG Emission Factors Hub', use: '10.21 kg CO₂/gal heating oil; 5.72 kg CO₂/gal propane' },
  { domain: 'Refrigerants', source: 'IPCC AR6 Global Warming Potentials', use: 'GWP100 conversions for fugitive HVAC leakage' },
  { domain: 'Waste', source: 'EPA GHG Emission Factors Hub 2025, Table 9 (Scope 3 Category 5), derived from WARM v16', use: 'Landfill 0.58, recycling 0.09, composting 0.11 mtCO₂e per short ton (AR4 GWPs). Avoided emissions are excluded per EPA\'s note, so recycling and composting are smaller emissions rather than credits — the life-cycle figures published in the WARM tool itself answer a different question.' },
  { domain: 'Air travel', source: 'UK DEFRA/DESNZ 2024 GHG conversion factors, "Business travel- air"', use: 'Economy class, using the factor set that includes the indirect effects of non-CO₂ emissions: 0.18287 short-haul and 0.20011 long-haul kg CO₂e per passenger-km (0.294 / 0.322 per passenger-mile). Long-haul economy is higher than short-haul in this published set.' },
  { domain: 'Purchased goods', source: 'EPA Supply Chain GHG Emission Factors v1.3', use: 'Spend-based Scope 3 Cat 1 estimates — kg CO₂e per 2022 USD at purchaser prices, AR5 GWPs, across 1,016 NAICS-6 commodities.' },
  { domain: 'Food', source: 'Poore & Nemecek (2018), Science — per-kg figures via Our World in Data', use: 'Full supply-chain kg CO₂e per kg of product (beef 99.5, poultry 9.9, rice 4.5, peas 1.0). The paper reported per 100 g protein and per 1,000 kcal; the per-kg conversion is OWID\'s.' },
  { domain: 'Vehicles & commuting', source: 'EPA GHG Emission Factors Hub 2025, Table 10 (Scope 3 Categories 6 and 7)', use: 'Passenger car, distance-based: 0.297 kg CO₂ plus CH₄/N₂O per vehicle-mile = 0.2986 kg CO₂e at AR5 GWPs.' },
  { domain: 'Tree sequestration', source: 'Nowak et al. (2013), Urban Forestry & Urban Greening', use: '7.69 kg C/m² storage, 0.28 kg C/m²/yr sequestration' },
  { domain: 'Soil & forest carbon', source: 'Morin et al. (2020), USDA NH forest inventory; Birdsey (1992)', use: 'Land-use-weighted soil carbon baselines' },
  { domain: 'AI ingestion', source: 'Dagdelen et al. (2024), Nature Communications', use: 'LLM-based structured extraction approach' },
  { domain: 'Heat pumps (scenarios)', source: 'NREL cold-climate heat pump field data + DOE technical reports', use: 'COP 3.0 conservative cold-climate seasonal average — used by the /scenarios "electrify heating" lever' },
  { domain: 'Solar PV (scenarios)', source: 'NREL PVWatts for NH fixed-tilt + NHEC interconnection data', use: '1,300 kWh/kW/yr typical NH capacity factor — used by the /scenarios "install solar" lever' },
];

const principles = [
  'Every numeric value links back to its source record (real-time meter, invoice, sample, survey).',
  'Measured values are visually distinguished from estimates throughout the UI.',
  'Emission factors are versioned in the database so historical numbers remain reproducible when factors are updated.',
  'AI-generated text is constrained at the prompt level to reference values present in the database, exposes a “show calculation” control, and is visually distinct from measured data.',
  'Scope 3 categories not applicable to a school (Cat 9, Cat 12) are explicitly excluded rather than silently dropped.',
  'Where measured data is not yet integrated, headline numbers carry a multi-method range (3-4 published methodologies per component) so the spread of reasonable interpretations is visible — not just a single point. The full per-method breakdown lives at /admin/methodology.',
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }} className="no-print">
        <button
          type="button"
          onClick={() => window.print()}
          style={{ padding: '8px 14px', background: '#0e7490', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}
          title="Print this page or save it as a PDF"
        >
          🖨 Print / Save PDF
        </button>
      </div>
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
