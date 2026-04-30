import React from 'react';
import { EducationalCard } from '../components/EducationalCard';

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  card: { marginTop: 24, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, padding: 20 },
  row: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1f2937' },
  label: { color: '#94a3b8' },
  value: { fontWeight: 600 },
  link: { color: '#22d3ee' },
};

function Scope2() {
  return (
    <div>
      <h1 style={styles.title}>Scope 2 — Purchased Electricity</h1>
      <p style={styles.subtitle}>
        Indirect emissions from electricity delivered by Liberty Utilities (Granite State
        Electric). Quantity comes from the campus real-time meter; emission intensity uses the
        ISO New England regional factor with hourly grid-mix as a future refinement.
      </p>
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>Distribution utility</span>
          <span style={styles.value}>Liberty Utilities (Granite State Electric)</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Grid emission factor (location-based)</span>
          <span style={styles.value}>643 lb CO₂/MWh (ISO-NE 2024)</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Imported power factor</span>
          <span style={styles.value}>177 lb CO₂/MWh</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Quantity source</span>
          <span style={styles.value}>Campus real-time meter (subhourly)</span>
        </div>
        <div style={{ ...styles.row, borderBottom: 'none' }}>
          <span style={styles.label}>Reconciliation</span>
          <span style={styles.value}>Liberty monthly bill</span>
        </div>
      </div>
      <p style={{ marginTop: 24, color: '#94a3b8' }}>
        Live grid-mix and per-building energy data are rendered on the main Dashboard.
      </p>

      <EducationalCard
        title="How Scope 2 actually works"
        sections={[
          {
            heading: 'The two-layer model',
            body: [
              'KUA never burns fuel to make electricity — but the power plants on the grid do, on KUA\'s behalf, every time someone flips a light switch.',
              'Scope 2 separates two things: how much electricity you used (kWh, from the meter) and how dirty that electricity was (kg CO₂ per kWh, from the grid operator).',
              'The dashboard handles them as separate inputs so when ISO-NE updates its annual factor, all historical kWh re-price automatically without breaking what was actually measured.',
            ],
          },
          {
            heading: 'Why ISO New England matters',
            body: 'ISO-NE runs the wholesale grid for the six New England states. They publish an annual Air Emissions Report that gives the average lb-CO₂-per-MWh of all generators feeding the regional grid. In 2024 that was 643 lb/MWh from in-region generation, and 177 lb/MWh from imported power (much of which is Canadian hydro).',
            citation: 'ISO New England Electric Generator Air Emissions Report 2024.',
          },
          {
            heading: 'Location-based vs market-based',
            body: 'The GHG Protocol lets institutions report two numbers: a location-based one (what the grid actually emitted on average) and a market-based one (which credits any renewable energy you specifically procured). New Hampshire was the first deregulated state in 1998, so KUA could in principle source from a cleaner supplier — and the dashboard would reflect that change in the market-based view.',
          },
          {
            heading: 'Why the meter beats the bill',
            body: 'Liberty\'s monthly bill gives one number per month. The campus real-time meter records consumption every few seconds — which means we can see when a building is using power, not just how much. That hourly resolution unlocks weather-normalized analysis, anomaly detection, and (eventually) hour-by-hour grid-emissions tracking as ISO-NE\'s mix shifts through the day.',
          },
        ]}
      />

    </div>
  );
}

export default Scope2;
