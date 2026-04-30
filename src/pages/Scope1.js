import React from 'react';
import { EducationalCard } from '../components/EducationalCard';

const categories = [
  { name: 'Heating Fuel', desc: 'Heating oil and propane delivered to campus boilers and water heaters.', factor: 'EPA GHG Emission Factors Hub: 10.16 kg CO₂/gal heating oil, 5.72 kg CO₂/gal propane', status: 'In dashboard (fuel_bills table)' },
  { name: 'Refrigerant Leakage', desc: 'Fugitive HVAC refrigerant emissions from technician service reports.', factor: 'IPCC AR6 global warming potentials', status: 'Planned' },
  { name: 'Fleet Vehicles', desc: 'Campus-owned vans and trucks via fuel-card records.', factor: 'EPA GHG Emission Factors Hub (gasoline / diesel)', status: 'Planned' },
];

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  list: { marginTop: 24, display: 'grid', gap: 12 },
  item: { background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, padding: 16 },
  itemTitle: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' },
  itemName: { fontSize: 18, fontWeight: 600 },
  status: { fontSize: 12, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 0.5 },
  desc: { marginTop: 6, color: '#cbd5e1' },
  factor: { marginTop: 6, fontSize: 12, color: '#64748b' },
};

function Scope1() {
  return (
    <div>
      <h1 style={styles.title}>Scope 1 — Direct Emissions</h1>
      <p style={styles.subtitle}>
        Greenhouse gases released from sources owned or controlled by KUA. Dominant source is
        on-site fuel combustion for heat and hot water.
      </p>

      <EducationalCard
        title="What Scope 1 means and why it matters here"
        sections={[
          {
            heading: 'Definition',
            body: 'Scope 1 covers greenhouse gases released directly from sources KUA owns or controls — most visibly the heating-oil truck pulling up to a building, the propane tanks behind a dorm, and fugitive refrigerant from HVAC equipment. If KUA can choose to turn it off, it\'s Scope 1.',
          },
          {
            heading: 'Why it dominates in New Hampshire',
            body: [
              'Cold winters mean heating runs eight months a year. Most KUA buildings burn either #2 heating oil or propane.',
              'Burning one gallon of heating oil releases 10.16 kg CO₂ — about the same as driving a typical car 25 miles.',
              'A single boarding-school dorm on oil heat can use 4,000–8,000 gallons per winter, producing 40–80 mtCO₂e from that one building.',
            ],
          },
          {
            heading: 'The chemistry',
            body: 'Heating fuel is a hydrocarbon mix. In a boiler, it reacts with oxygen:',
            formula: 'CₓHᵧ + (x + y/4) O₂ → x CO₂ + (y/2) H₂O + heat',
            citation: 'EPA GHG Emission Factors Hub (2024), Stationary Combustion table; IPCC AR6 for refrigerant GWP100 values.',
          },
          {
            heading: 'Where reduction happens',
            body: [
              'Heat-pump retrofits replace fossil heat with grid electricity (which then becomes Scope 2 — but a third of the emissions per BTU on the New England grid).',
              'Building envelope upgrades (insulation, weatherization) cut fuel use without changing the heating system.',
              'Refrigerant leak detection during HVAC service catches small leaks before they grow.',
            ],
          },
        ]}
      />

      <div style={styles.list}>
        {categories.map((c) => (
          <div key={c.name} style={styles.item}>
            <div style={styles.itemTitle}>
              <div style={styles.itemName}>{c.name}</div>
              <div style={styles.status}>{c.status}</div>
            </div>
            <div style={styles.desc}>{c.desc}</div>
            <div style={styles.factor}>Emission factor: {c.factor}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Scope1;
