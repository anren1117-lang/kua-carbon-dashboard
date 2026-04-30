import React from 'react';

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
