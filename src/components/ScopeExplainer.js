import React from 'react';

const scopes = [
  {
    key: 'scope1',
    color: '#ef4444',
    label: 'Scope 1',
    title: 'Direct Emissions',
    definition: 'Greenhouse gases released directly from sources KUA owns or controls — fuel burned in our boilers, refrigerants leaking from HVAC equipment, gasoline in our vans. If KUA can choose to turn it off, it counts as Scope 1.',
    kuaTotal: '~1,000',
    kuaPerStudent: 1.6,
    kuaRange: '800 – 1,500',
    calculation: [
      'Heating fuel is the dominant source. We multiply gallons delivered (from invoices) by an EPA combustion factor:',
      'gallons × kg CO₂ per gallon = mtCO₂e',
      'Heating oil: 10.16 kg CO₂/gal · Propane: 5.72 kg CO₂/gal',
      'Refrigerants: (recharge − reclaim) lb × GWP100 from IPCC AR6',
      'Fleet: gallons of fuel-card records × EPA mobile combustion factor',
    ],
    formula: 'Σ(gallons × factor) + Σ((recharge − reclaim) × GWP) + fleet',
    factorSource: 'EPA GHG Emission Factors Hub (2024); IPCC AR6 WG1 Ch.7 for refrigerants',
    peerRange: '1.5 – 4.0 mtCO₂e/student',
    peerComparison: 'KUA sits at the LOW end of the boarding-school range. Exeter and Andover are 3.5–4.0 — they have larger heated square-footage per student and more buildings on heating oil. Our number could rise once actual fuel-delivery records are loaded in place of the rough estimate.',
  },
  {
    key: 'scope2',
    color: '#f59e0b',
    label: 'Scope 2',
    title: 'Purchased Electricity',
    definition: 'Indirect emissions from electricity that KUA buys but does not generate. We never burn fuel to make electricity — but the power plants on the New England grid do, on our behalf, every time someone flips a light switch.',
    kuaTotal: '222',
    kuaPerStudent: 0.4,
    kuaRange: 'documented · 222',
    isDocumented: true,
    calculation: [
      'This is the only line currently sourced from real measurement. The campus real-time meter records consumption every few seconds; we sum it to an annual total:',
      '2,316,469 kWh measured in 2024',
      '× ISO New England 2024 emission factor (location-based)',
      '= 221.53 mtCO₂e/year',
      'Liberty Utilities is the distribution utility, but the meter — not the bill — is the source of truth.',
    ],
    formula: 'kWh × (lb CO₂ / MWh) × 0.4536 kg/lb / 1000',
    factorSource: 'ISO New England Electric Generator Air Emissions Report 2024 — 643 lb CO₂/MWh in-region (with imported power at 177 lb/MWh)',
    peerRange: '0.4 – 2.0 mtCO₂e/student',
    peerComparison: 'KUA is at the LOW end. Two reasons: (1) the New England grid is cleaner than most US regions because of significant nuclear and hydro share, and (2) per-student electricity use is moderate. Yale at 1.0 and Williams at 1.0 are higher partly because their campuses are larger and busier per square foot.',
  },
  {
    key: 'scope3',
    color: '#8b5cf6',
    label: 'Scope 3',
    title: 'Other Indirect Emissions',
    definition: 'Everything else — the school\'s supply chain, the food in the dining hall, the flights students take home for break, the waste truck. Typically the LARGEST scope at residential institutions but the hardest to measure because the data lives outside the school.',
    kuaTotal: '~3,000',
    kuaPerStudent: 5.0,
    kuaRange: '2,000 – 3,800',
    calculation: [
      'Each sub-category has its own methodology:',
      'International student travel: students × round trips × distance × DEFRA factor (with radiative forcing)',
      'US boarder break travel: ZIP → distance → mode (drive/fly threshold) × per-pmi factor',
      'Purchased goods (EEIO): spend × kg CO₂e/USD by category (EPA Supply Chain v1.2)',
      'Waste: tons × WARM net factor (landfill +0.52, recycling −0.10, compost +0.04 kg CO₂e/lb)',
      'Commuting: per-person miles × 2 × days × weeks × mode factor',
      'Upstream fuel (Cat 3): Scope 1+2 quantities × EPA upstream factors',
    ],
    formula: 'Σ over sub-categories — each row in the database carries its own factor',
    factorSource: 'EPA Supply Chain (EEIO); EPA WARM v15; DEFRA 2024 air-travel; EPA Hub upstream factors',
    peerRange: '1.5 – 4.5 mtCO₂e/student',
    peerComparison: 'KUA is at the HIGH end because of the large international student cohort — long-haul flights are by far the most carbon-intensive travel mode (~3 mtCO₂e per round trip to Asia). Kool (2025) found this same pattern at Royal Roads University, where student air travel alone dwarfed every other category. This is also the most uncertain line: easily ±40% until actual student travel data is loaded.',
  },
  {
    key: 'sinks',
    color: '#22c55e',
    label: 'Sinks',
    title: 'On-Campus Sequestration',
    definition: 'Carbon that the trees and soils on KUA\'s ~1,000-acre campus pull OUT of the atmosphere each year via photosynthesis. Subtracted from gross emissions to get the net balance. Most peer institutions don\'t even measure this — it\'s the gap Valls-Val & Bovea (2021) identified.',
    kuaTotal: '~3,000',
    kuaPerStudent: -5.0,
    kuaRange: '2,000 – 4,000 pulled out',
    isSink: true,
    calculation: [
      'For each tree we collect Diameter at Breast Height (DBH); a species-specific allometric equation gives biomass; biomass × 0.5 = stored carbon. We multiply C by 44/12 to get CO₂-equivalent.',
      'For closed-canopy forest we use Birdsey (1992): 1,252 lb C/acre/year ≈ 2.1 mtCO₂e/acre/year.',
      'For open-grown campus trees we use Nowak (2013): 0.28 kg C/m²/year ≈ 4.2 mtCO₂e/acre/year — they grow faster with less competition.',
      'Soil organic carbon: depth × bulk density × OC% (per sample, land-use weighted to a campus average). Slower turnover but huge stocks — 59% of forest carbon is below ground.',
    ],
    formula: 'Σ(tree biomass × 0.5 × 44/12) + Σ(land area × forest-type rate)',
    factorSource: 'Nowak et al. (2013); Birdsey (1992); USDA Urban Tree Database; Morin et al. (2020) for NH forest baselines',
    peerRange: '0 measured at most peer schools',
    peerComparison: 'KUA is the only school in the peer chart with a quantified physical sink. Most institutions report only gross emissions. Middlebury reaches "net zero" by purchasing offsets equal to gross emissions — that\'s a financial drawdown, not a physical one. Our 1,000 acres of forest pulling roughly 3,000 mtCO₂e/year out of the air is REAL sequestration, and is large enough that on the optimistic end of the range KUA\'s campus may be net carbon negative.',
  },
];

const styles = {
  wrap: { maxWidth: 1100, margin: '24px auto 0', padding: '0 16px' },
  outer: { padding: '24px 28px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 14 },
  outerTitle: { fontSize: 22, fontWeight: 700, color: '#e5e7eb', margin: 0 },
  outerBlurb: { fontSize: 14, color: '#94a3b8', maxWidth: 760, marginTop: 6, marginBottom: 20 },
  card: (color) => ({
    marginTop: 16,
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 10,
    overflow: 'hidden',
    borderLeft: `4px solid ${color}`,
  }),
  head: { padding: '14px 18px', borderBottom: '1px solid #1f2937' },
  label: (color) => ({ fontSize: 11, color, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }),
  title: { fontSize: 20, fontWeight: 700, color: '#e5e7eb', marginTop: 4 },
  body: { padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  bodyMobile: { padding: '14px 18px', display: 'grid', gap: 20 },
  section: { },
  sectionTitle: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8, fontWeight: 600 },
  text: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 },
  bigBox: { display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' },
  bigCell: { padding: '10px 14px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8, minWidth: 130 },
  bigLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 },
  bigValue: { fontSize: 22, color: '#e5e7eb', fontWeight: 700, marginTop: 2 },
  bigUnit: { fontSize: 11, color: '#94a3b8', marginLeft: 4, fontWeight: 400 },
  bigRange: { fontSize: 11, color: '#64748b', marginTop: 2 },
  list: { paddingLeft: 18, fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: 0 },
  formula: { marginTop: 8, padding: '8px 12px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: '#86efac' },
  cite: { marginTop: 8, fontSize: 11, color: '#64748b', fontStyle: 'italic' },
  documentedPill: { fontSize: 10, padding: '2px 8px', borderRadius: 999, background: '#052e1a', color: '#86efac', textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 8 },
  peerLine: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginTop: 6 },
};

export function ScopeExplainer() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 760;

  return (
    <div style={styles.wrap}>
      <section style={styles.outer}>
        <h2 style={styles.outerTitle}>What each scope means and how it's calculated</h2>
        <p style={styles.outerBlurb}>
          A walk-through of every category on the headline number above — what it covers, the
          formula that turns raw inputs into mtCO₂e, where the emission factors come from, and
          how KUA's number compares to peer institutions.
        </p>

        {scopes.map((s) => (
          <div key={s.key} style={styles.card(s.color)}>
            <div style={styles.head}>
              <div style={styles.label(s.color)}>{s.label}</div>
              <div style={styles.title}>
                {s.title}
                {s.isDocumented && <span style={styles.documentedPill}>Documented</span>}
              </div>
              <p style={{ ...styles.text, marginTop: 8, marginBottom: 0 }}>{s.definition}</p>
              <div style={styles.bigBox}>
                <div style={styles.bigCell}>
                  <div style={styles.bigLabel}>KUA total</div>
                  <div style={styles.bigValue}>
                    {s.isSink ? '−' : ''}{s.kuaTotal}
                    <span style={styles.bigUnit}>mtCO₂e/yr</span>
                  </div>
                  <div style={styles.bigRange}>range {s.kuaRange}</div>
                </div>
                <div style={styles.bigCell}>
                  <div style={styles.bigLabel}>Per student</div>
                  <div style={styles.bigValue}>
                    {s.kuaPerStudent > 0 ? '+' : ''}{s.kuaPerStudent}
                    <span style={styles.bigUnit}>mtCO₂e</span>
                  </div>
                  <div style={styles.bigRange}>≈ 600 students</div>
                </div>
              </div>
            </div>
            <div style={isMobile ? styles.bodyMobile : styles.body}>
              <div style={styles.section}>
                <div style={styles.sectionTitle}>How we calculate it</div>
                <ul style={styles.list}>
                  {s.calculation.map((line, i) => <li key={i}>{line}</li>)}
                </ul>
                <div style={styles.formula}>{s.formula}</div>
                <div style={styles.cite}>Factor sources: {s.factorSource}</div>
              </div>
              <div style={styles.section}>
                <div style={styles.sectionTitle}>How KUA compares to peer schools</div>
                <div style={styles.peerLine}>
                  <span>Peer per-student range</span>
                  <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{s.peerRange}</span>
                </div>
                <div style={styles.peerLine}>
                  <span>KUA per-student</span>
                  <span style={{ color: s.color, fontWeight: 700 }}>
                    {s.kuaPerStudent > 0 ? '+' : ''}{s.kuaPerStudent} mtCO₂e
                  </span>
                </div>
                <p style={{ ...styles.text, marginTop: 12 }}>{s.peerComparison}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
