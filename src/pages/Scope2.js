import React from 'react';

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
    </div>
  );
}

export default Scope2;
