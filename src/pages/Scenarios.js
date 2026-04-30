import React from 'react';

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  placeholder: { marginTop: 32, padding: 32, background: '#0f172a', border: '1px dashed #334155', borderRadius: 12, textAlign: 'center', color: '#94a3b8' },
};

function Scenarios() {
  return (
    <div>
      <h1 style={styles.title}>Reduction Scenarios & Forecasting</h1>
      <p style={styles.subtitle}>
        Counterfactual modeling (“what if heating oil drops 15%?”), trajectory forecasting toward a
        net-zero target year, weather-normalized analysis, and uncertainty ranking. Every scenario
        will expose its underlying calculation.
      </p>
      <div style={styles.placeholder}>
        Simulator UI lands in Phase 5. Backend will reuse the same emission factors and audit
        trail as the production dashboard.
      </div>
    </div>
  );
}

export default Scenarios;
