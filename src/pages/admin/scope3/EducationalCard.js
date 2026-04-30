import React from 'react';

const styles = {
  card: { marginTop: 16, padding: 16, background: '#0f172a', border: '1px solid #1e3a8a', borderRadius: 10, borderLeft: '3px solid #3b82f6' },
  head: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  badge: { fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#1e3a8a', color: '#bfdbfe', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  title: { fontSize: 15, color: '#e5e7eb', fontWeight: 600 },
  section: { marginBottom: 12 },
  sectionLast: { marginBottom: 0 },
  sectionTitle: { fontSize: 12, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontWeight: 600 },
  text: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, margin: 0 },
  list: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: 0, paddingLeft: 18 },
  formula: { marginTop: 8, padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: '#86efac' },
  cite: { fontSize: 11, color: '#64748b', marginTop: 6, fontStyle: 'italic' },
};

// Reusable "Why this matters" educational sidebar.
// Pass `title` plus an array of `sections`, each { heading, body, formula?, citation? }.
// `body` can be a string or an array of strings (rendered as bullets).
export function EducationalCard({ title, sections }) {
  return (
    <div style={styles.card}>
      <div style={styles.head}>
        <span style={styles.badge}>Learn</span>
        <span style={styles.title}>{title}</span>
      </div>
      {sections.map((sec, i) => {
        const isLast = i === sections.length - 1;
        return (
          <div key={sec.heading} style={isLast ? styles.sectionLast : styles.section}>
            <div style={styles.sectionTitle}>{sec.heading}</div>
            {Array.isArray(sec.body) ? (
              <ul style={styles.list}>{sec.body.map((b, j) => <li key={j}>{b}</li>)}</ul>
            ) : (
              <p style={styles.text}>{sec.body}</p>
            )}
            {sec.formula && <div style={styles.formula}>{sec.formula}</div>}
            {sec.citation && <div style={styles.cite}>{sec.citation}</div>}
          </div>
        );
      })}
    </div>
  );
}
