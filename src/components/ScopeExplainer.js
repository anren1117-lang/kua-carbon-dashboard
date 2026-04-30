import React, { useState } from 'react';

const scopes = [
  {
    key: 'scope1', color: '#ef4444', label: 'Scope 1', title: 'Direct Emissions',
    summary: 'Greenhouse gases released directly from sources KUA owns or controls — heating fuel, refrigerants, fleet vehicles.',
    kuaTotal: '~1,000', kuaPerStudent: 1.6, kuaRange: '800 – 1,500',
    definition: 'Greenhouse gases released directly from sources KUA owns or controls — fuel burned in our boilers, refrigerants leaking from HVAC equipment, gasoline in our vans. If KUA can choose to turn it off, it counts as Scope 1.',
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
    peerComparison: 'KUA sits at the LOW end of the boarding-school range. Exeter and Andover are 3.5–4.0 — they have larger heated square-footage per student and more buildings on heating oil.',
  },
  {
    key: 'scope2', color: '#f59e0b', label: 'Scope 2', title: 'Purchased Electricity',
    summary: 'Indirect emissions from electricity KUA buys but does not generate. The only line currently sourced from real measurement.',
    kuaTotal: '222', kuaPerStudent: 0.4, kuaRange: 'documented · 222', isDocumented: true,
    definition: 'Indirect emissions from electricity that KUA buys but does not generate. We never burn fuel to make electricity — but the power plants on the New England grid do, on our behalf, every time someone flips a light switch.',
    calculation: [
      'This is the only line currently sourced from real measurement. The campus real-time meter records consumption every few seconds; we sum it to an annual total:',
      '2,316,469 kWh measured in 2024',
      '× ISO New England 2024 emission factor (location-based)',
      '= 221.53 mtCO₂e/year',
    ],
    formula: 'kWh × (lb CO₂ / MWh) × 0.4536 kg/lb / 1000',
    factorSource: 'ISO New England Electric Generator Air Emissions Report 2024 — 643 lb CO₂/MWh in-region',
    peerRange: '0.4 – 2.0 mtCO₂e/student',
    peerComparison: 'KUA is at the LOW end. Two reasons: the New England grid is cleaner than most US regions, and per-student electricity use is moderate.',
  },
  {
    key: 'scope3', color: '#8b5cf6', label: 'Scope 3', title: 'Other Indirect Emissions',
    summary: 'Everything else — supply chain, food, travel, waste. Typically the LARGEST scope at residential institutions.',
    kuaTotal: '~3,000', kuaPerStudent: 5.0, kuaRange: '2,000 – 3,800',
    definition: 'Everything else — the school\'s supply chain, the food in the dining hall, the flights students take home for break, the waste truck. Typically the LARGEST scope at residential institutions but the hardest to measure because the data lives outside the school.',
    calculation: [
      'Each sub-category has its own methodology:',
      'International student travel: students × round trips × distance × DEFRA factor',
      'US boarder break travel: ZIP → distance → mode × per-pmi factor',
      'Purchased goods (EEIO): spend × kg CO₂e/USD by category',
      'Waste: tons × WARM net factor',
      'Commuting: per-person miles × 2 × days × weeks × mode factor',
    ],
    formula: 'Σ over sub-categories — each row carries its own factor',
    factorSource: 'EPA Supply Chain (EEIO); EPA WARM v15; DEFRA 2024 air-travel; EPA Hub upstream factors',
    peerRange: '1.5 – 4.5 mtCO₂e/student',
    peerComparison: 'KUA is at the HIGH end because of the large international student cohort — long-haul flights are by far the most carbon-intensive travel mode (~3 mtCO₂e per round trip to Asia).',
  },
  {
    key: 'sinks', color: '#22c55e', label: 'Sinks', title: 'On-Campus Sequestration',
    summary: 'Carbon pulled OUT of the atmosphere by the ~1,000-acre campus forest. Most peer schools don\'t even measure this.',
    kuaTotal: '~3,000', kuaPerStudent: -5.0, kuaRange: '2,000 – 4,000 pulled out', isSink: true,
    definition: 'Carbon that the trees and soils on KUA\'s ~1,000-acre campus pull OUT of the atmosphere each year via photosynthesis. Subtracted from gross emissions to get the net balance. Most peer institutions don\'t even measure this — it\'s the gap Valls-Val & Bovea (2021) identified.',
    calculation: [
      'For each tree we collect Diameter at Breast Height (DBH); biomass × 0.5 = stored carbon. We multiply C by 44/12 to get CO₂-equivalent.',
      'For closed-canopy forest: Birdsey (1992) ≈ 2.1 mtCO₂e/acre/year.',
      'For open-grown campus trees: Nowak (2013) ≈ 4.2 mtCO₂e/acre/year.',
      'Soil organic carbon: depth × bulk density × OC% per sample.',
    ],
    formula: 'Σ(tree biomass × 0.5 × 44/12) + Σ(land area × forest-type rate)',
    factorSource: 'Nowak et al. (2013); Birdsey (1992); USDA Urban Tree Database',
    peerRange: '0 measured at most peer schools',
    peerComparison: 'KUA is the only school in the peer chart with a quantified physical sink. Middlebury reaches "net zero" by purchasing offsets — a financial drawdown, not physical. Our forest pulling 3,000 mtCO₂e is REAL sequestration.',
  },
];

const styles = {
  wrap: { maxWidth: 1100, margin: '24px auto 0', padding: '0 16px' },
  outer: { padding: '24px 28px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 14 },
  outerTitle: { fontSize: 22, fontWeight: 700, color: '#e5e7eb', margin: 0 },
  outerBlurb: { fontSize: 14, color: '#94a3b8', maxWidth: 760, marginTop: 6, marginBottom: 20 },
  card: (color) => ({
    marginTop: 12, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10,
    overflow: 'hidden', borderLeft: `4px solid ${color}`,
  }),
  head: { padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 14, cursor: 'pointer', userSelect: 'none' },
  headOpen: { borderBottom: '1px solid #1f2937' },
  label: (color) => ({ fontSize: 11, color, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }),
  title: { fontSize: 17, fontWeight: 700, color: '#e5e7eb', marginTop: 2 },
  summary: { fontSize: 13, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 },
  totals: { textAlign: 'right', display: 'flex', gap: 16, alignItems: 'baseline' },
  totalCell: { },
  totalLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 },
  totalValue: { fontSize: 18, color: '#e5e7eb', fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  chevron: (open) => ({ color: '#64748b', fontSize: 14, transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }),
  body: { padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  bodyMobile: { padding: '14px 18px', display: 'grid', gap: 18 },
  section: { },
  sectionTitle: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8, fontWeight: 600 },
  text: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 },
  list: { paddingLeft: 18, fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, margin: 0 },
  formula: { marginTop: 8, padding: '8px 12px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: '#86efac' },
  cite: { marginTop: 8, fontSize: 11, color: '#64748b', fontStyle: 'italic' },
  documentedPill: { fontSize: 9, padding: '2px 6px', borderRadius: 999, background: '#052e1a', color: '#86efac', textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 6, fontWeight: 700 },
  peerLine: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginTop: 4 },
};

function ScopeCard({ s, color }) {
  const [open, setOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 760;
  return (
    <div style={styles.card(color)}>
      <div
        style={{ ...styles.head, ...(open ? styles.headOpen : {}) }}
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((v) => !v); }}
      >
        <div>
          <div style={styles.label(color)}>{s.label}</div>
          <div style={styles.title}>
            {s.title}
            {s.isDocumented && <span style={styles.documentedPill}>Documented</span>}
          </div>
          <div style={styles.summary}>{s.summary}</div>
        </div>
        <div style={styles.totals}>
          <div style={styles.totalCell}>
            <div style={styles.totalLabel}>Total</div>
            <div style={styles.totalValue}>{s.isSink ? '−' : ''}{s.kuaTotal}</div>
          </div>
          <div style={styles.totalCell}>
            <div style={styles.totalLabel}>/ student</div>
            <div style={styles.totalValue}>{s.kuaPerStudent > 0 ? '+' : ''}{s.kuaPerStudent}</div>
          </div>
        </div>
        <span style={styles.chevron(open)}>▸</span>
      </div>
      {open && (
        <div style={isMobile ? styles.bodyMobile : styles.body}>
          <div style={styles.section}>
            <div style={styles.sectionTitle}>How we calculate it</div>
            <p style={{ ...styles.text, marginTop: 0 }}>{s.definition}</p>
            <ul style={{ ...styles.list, marginTop: 10 }}>
              {s.calculation.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
            <div style={styles.formula}>{s.formula}</div>
            <div style={styles.cite}>Factor sources: {s.factorSource}</div>
          </div>
          <div style={styles.section}>
            <div style={styles.sectionTitle}>How KUA compares</div>
            <div style={styles.peerLine}>
              <span>Peer per-student range</span>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{s.peerRange}</span>
            </div>
            <div style={styles.peerLine}>
              <span>KUA per-student</span>
              <span style={{ color, fontWeight: 700 }}>{s.kuaPerStudent > 0 ? '+' : ''}{s.kuaPerStudent} mtCO₂e</span>
            </div>
            <p style={{ ...styles.text, marginTop: 12 }}>{s.peerComparison}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function ScopeExplainer() {
  return (
    <div style={styles.wrap}>
      <section style={styles.outer}>
        <h2 style={styles.outerTitle}>By scope</h2>
        <p style={styles.outerBlurb}>
          Click any row for the definition, the formula, factor sources, and how KUA compares to peer schools on that specific scope.
        </p>
        {scopes.map((s) => <ScopeCard key={s.key} s={s} color={s.color} />)}
      </section>
    </div>
  );
}
