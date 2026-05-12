import React from 'react';

// Shared layout primitives for the OS module pages. Centralizing the
// header/section/card patterns keeps the new pages visually consistent
// without re-writing inline styles per page.

export function ModulePage({ title, subtitle, children, className, toolbar }) {
  return (
    <div style={styles.page} className={className}>
      <header style={styles.header}>
        {toolbar && <div className="no-print" style={styles.toolbar}>{toolbar}</div>}
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </header>
      {children}
    </div>
  );
}

export function ModuleSection({ title, hint, children, collapsible, defaultOpen = true }) {
  if (collapsible) {
    return (
      <section style={styles.section}>
        <details open={defaultOpen} style={{ display: 'block' }}>
          <summary style={{ cursor: 'pointer', listStyle: 'revert', outline: 'none' }}>
            {title && <h2 style={{ ...styles.sectionTitle, display: 'inline' }}>{title}</h2>}
          </summary>
          {hint && <p style={styles.hint}>{hint}</p>}
          {children}
        </details>
      </section>
    );
  }
  return (
    <section style={styles.section}>
      {title && <h2 style={styles.sectionTitle}>{title}</h2>}
      {hint && <p style={styles.hint}>{hint}</p>}
      {children}
    </section>
  );
}

export function MetricGrid({ metrics }) {
  return (
    <div style={styles.metricGrid}>
      {metrics.map((m, i) => (
        <div key={i} style={{ ...styles.metricCard, borderLeftColor: m.accent || '#22d3ee' }}>
          <div style={styles.metricLabel}>{m.label}</div>
          <div style={styles.metricValue}>
            {m.value}
            {m.unit && <span style={styles.metricUnit}>{m.unit}</span>}
          </div>
          {m.note && <div style={styles.metricNote}>{m.note}</div>}
        </div>
      ))}
    </div>
  );
}

export function Pill({ kind = 'neutral', children }) {
  const palette = {
    neutral: { bg: '#1e293b', fg: '#cbd5e1', border: '#334155' },
    good:    { bg: '#052e1a', fg: '#86efac', border: '#14532d' },
    warn:    { bg: '#3a2a0d', fg: '#fbbf24', border: '#92400e' },
    bad:     { bg: '#3a0d12', fg: '#fca5a5', border: '#7f1d1d' },
    info:    { bg: '#0c2a3a', fg: '#67e8f9', border: '#0e7490' },
  };
  const c = palette[kind] || palette.neutral;
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 11,
      padding: '3px 10px',
      borderRadius: 999,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      fontWeight: 700,
      background: c.bg,
      color: c.fg,
      border: `1px solid ${c.border}`,
    }}>{children}</span>
  );
}

const styles = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '0 16px' },
  header: { marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #1f2937' },
  toolbar: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 10 },
  title: { fontSize: 'clamp(24px, 5vw, 32px)', color: '#e5e7eb', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' },
  subtitle: { fontSize: 15, color: '#94a3b8', margin: '8px 0 0', lineHeight: 1.5, maxWidth: 800 },

  section: { marginTop: 24, padding: 'clamp(18px, 3vw, 24px)', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12 },
  sectionTitle: { fontSize: 18, color: '#e5e7eb', fontWeight: 700, margin: 0, marginBottom: 8 },
  hint: { fontSize: 14, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.6 },

  metricGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 },
  metricCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 8 },
  metricLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  metricValue: { fontSize: 'clamp(20px, 4vw, 26px)', color: '#e5e7eb', fontWeight: 800, marginTop: 6, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  metricUnit: { fontSize: 13, color: '#94a3b8', marginLeft: 6, fontWeight: 500 },
  metricNote: { fontSize: 12, color: '#64748b', marginTop: 6, lineHeight: 1.5 },
};
