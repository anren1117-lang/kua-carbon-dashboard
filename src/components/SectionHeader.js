import React from 'react';

const styles = {
  wrap: { maxWidth: 1100, margin: '56px auto 16px', padding: '0 16px' },
  rule: { width: 36, height: 3, background: 'linear-gradient(90deg, #22d3ee, #3b82f6)', borderRadius: 2, marginBottom: 14 },
  labelRow: { display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  labelDot: { width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px rgba(34, 211, 238, 0.7)' },
  label: { fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 },
  title: {
    fontSize: 30,
    fontWeight: 700,
    color: '#e5e7eb',
    margin: 0,
    lineHeight: 1.25,
    letterSpacing: '-0.015em',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  titleIcon: { display: 'inline-flex', color: '#22d3ee', flexShrink: 0 },
  description: { fontSize: 16, color: '#94a3b8', maxWidth: 720, marginTop: 12, lineHeight: 1.6 },
};

export function SectionHeader({ label, title, description, icon: SectionIcon }) {
  return (
    <header style={styles.wrap}>
      <div style={styles.rule} />
      {label && (
        <div style={styles.labelRow}>
          <span style={styles.labelDot} className="kua-pulse" aria-hidden="true" />
          <span style={styles.label}>{label}</span>
        </div>
      )}
      <h2 style={styles.title}>
        {SectionIcon && (
          <span style={styles.titleIcon} aria-hidden="true">
            <SectionIcon size={26} />
          </span>
        )}
        {title}
      </h2>
      {description && <p style={styles.description}>{description}</p>}
    </header>
  );
}
