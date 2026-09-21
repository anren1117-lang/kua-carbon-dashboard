import React from 'react';
import { BOTTOM_UP_BREAKDOWN } from '../data/geographicEstimates.js';

// The per-component method breakdown six public pages promise: for each of the
// nine components, the figure, the arithmetic that produced it, and the
// published sources behind it.
//
// It lived only on /admin/methodology until Phase 441 — and AdminLayout.js
// renders a PASSWORD FORM in place of its <Outlet /> when there is no session,
// so every one of those promises led a school-board reader to "Enter the admin
// password to manage emissions data." The content was never sensitive; it is
// citations and arithmetic. It was misfiled, not private.
//
// Rendered by BOTH /methodology and /admin/methodology so the public page can
// never drift from the admin one.
const styles = {
  row: { display: 'grid', gridTemplateColumns: 'minmax(180px, 220px) 100px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #1f2937', alignItems: 'flex-start' },
  label: { fontSize: 14, color: '#e5e7eb', fontWeight: 600 },
  scope: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 4 },
  mt: { fontSize: 16, color: '#86efac', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  basis: { fontSize: 12, color: '#cbd5e1', lineHeight: 1.55 },
  citations: { marginTop: 6, fontSize: 11, color: '#64748b' },
};

export function MethodBreakdown({ rows = BOTTOM_UP_BREAKDOWN }) {
  return (
    // Labelled region so a test can scope to this panel instead of relying on
    // a text match that would also hit a same-named category card elsewhere.
    <div role="region" aria-label="Per-component method breakdown" style={{ marginTop: 18 }}>
      {rows.map((row) => (
        <div key={`${row.scope}-${row.component}`} style={styles.row}>
          <div>
            <div style={styles.label}>{row.component}</div>
            <div style={styles.scope}>{row.scope}</div>
          </div>
          <div style={styles.mt}>{Math.round(row.mt).toLocaleString()} mt</div>
          <div>
            <div style={styles.basis}>{row.basis}</div>
            <div style={styles.citations}>Sources: {row.citations.join(' · ')}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MethodBreakdown;
