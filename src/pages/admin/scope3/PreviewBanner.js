import React from 'react';

const styles = {
  wrap: { marginTop: 12, padding: '12px 16px', borderRadius: 8, border: '1px solid #14532d', background: '#052e1a', color: '#86efac', fontSize: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  wrapDim: { borderColor: '#1f2937', background: '#0f172a', color: '#94a3b8' },
  big: { fontSize: 18, fontWeight: 700 },
  cite: { fontSize: 12, color: '#64748b' },
};

// Live emission preview shown above the form's submit button.
// Pass a numeric `kgCo2e` plus a citation string from the active emission factor.
export function PreviewBanner({ kgCo2e, citation, label = 'This entry will record' }) {
  if (kgCo2e == null || isNaN(kgCo2e)) {
    return <div style={{ ...styles.wrap, ...styles.wrapDim }}>Fill in the form to preview emissions.</div>;
  }
  const t = kgCo2e / 1000;
  return (
    <div style={styles.wrap}>
      <div>
        {label}: <span style={styles.big}>{kgCo2e.toFixed(2)} kg CO₂e</span>
        {Math.abs(t) >= 0.01 && <span style={{ marginLeft: 8, opacity: 0.8 }}>(~{t.toFixed(3)} t)</span>}
      </div>
      {citation && <div style={styles.cite}>via {citation}</div>}
    </div>
  );
}
