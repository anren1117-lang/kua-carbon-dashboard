import React from 'react';

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  card: { marginTop: 24, padding: 20, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10 },
  h2: { margin: 0, fontSize: 18, color: '#e5e7eb' },
  ul: { paddingLeft: 20, color: '#cbd5e1', lineHeight: 1.7, marginTop: 8 },
  pill: { fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#1e293b', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 },
  factorTable: { width: '100%', marginTop: 12, borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '8px 10px', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937' },
  td: { padding: '8px 10px', fontSize: 14, borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
};

function AdminMethodology() {
  return (
    <div>
      <h1 style={styles.title}>Methodology Management</h1>
      <p style={styles.subtitle}>
        Admin-side view of the methodology rules and factor versions that drive every public
        number. Changes here flow to the public Methodology page automatically.
      </p>

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
            <tr><td style={styles.td}>Grid electricity (ISO-NE)</td><td style={styles.td}>643 lb CO₂/MWh</td><td style={styles.td}>ISO-NE 2024 report</td></tr>
            <tr><td style={styles.td}>Imported electricity</td><td style={styles.td}>177 lb CO₂/MWh</td><td style={styles.td}>ISO-NE 2024 report</td></tr>
            <tr><td style={styles.td}>Tree storage</td><td style={styles.td}>7.69 kg C/m²</td><td style={styles.td}>Nowak et al. (2013)</td></tr>
            <tr><td style={styles.td}>Tree sequestration</td><td style={styles.td}>0.28 kg C/m²/yr</td><td style={styles.td}>Nowak et al. (2013)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminMethodology;
