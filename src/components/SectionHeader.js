import React from 'react';

const styles = {
  wrap: { maxWidth: 1100, margin: '56px auto 16px', padding: '0 16px' },
  rule: { width: 36, height: 3, background: 'linear-gradient(90deg, #22d3ee, #3b82f6)', borderRadius: 2, marginBottom: 14 },
  label: { fontSize: 12, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 6 },
  title: { fontSize: 28, fontWeight: 700, color: '#e5e7eb', margin: 0, lineHeight: 1.3 },
  description: { fontSize: 16, color: '#94a3b8', maxWidth: 720, marginTop: 10, lineHeight: 1.6 },
};

export function SectionHeader({ label, title, description }) {
  return (
    <header style={styles.wrap}>
      <div style={styles.rule} />
      {label && <div style={styles.label}>{label}</div>}
      <h2 style={styles.title}>{title}</h2>
      {description && <p style={styles.description}>{description}</p>}
    </header>
  );
}
