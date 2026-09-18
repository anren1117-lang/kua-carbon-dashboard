import React from 'react';
import { ProvenancePill } from './ProvenancePill.js';

// Per-component detail the composers have always built and no page ever
// rendered. composeScope1FromBills returns heating / fleet / refrigerants;
// composeScope3FromRecords returns six rows. Each carries its own `mt`,
// `provenance` and `method` — so a reader can see that heating is 1,290 of
// 1,350, that goods are 1,315 of 2,635, and WHICH parts are measured rather
// than estimated. Scope1.js read `breakdown` zero times; Scope3.js rendered
// only its cohort table.
//
// UNGATED, deliberately — unlike Scope 3's cohort panel. cohortDetail is
// undefined on the placeholder path (verified), so gating that behind
// isMeasured is correct. `breakdown` is always present on both paths, and
// per-row provenance is exactly what makes it worth showing BEFORE any live
// rows exist: it is the difference between "we measured 1,290" and "we
// estimated 1,290".
//
// Shares are computed from the rows themselves, not the page headline, so the
// column always sums to 100% and cannot drift from what is displayed beside it.
//
// role="region" + aria-label are not decoration: the component names here
// legitimately repeat elsewhere on the same page (Scope 1 has a "Fleet
// Vehicles" category card; Scope 3's thirdMetric says "Purchased goods"), so
// a reader using assistive tech needs the landmark, and a test needs a handle
// to scope to. Relaxing the assertions to getAllByText instead would let them
// pass while this panel rendered nothing at all.

const styles = {
  panel: { marginTop: 28, padding: '24px 26px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 12 },
  head: { marginBottom: 16 },
  title: { fontSize: 16, color: '#e5e7eb', fontWeight: 700, letterSpacing: 0.4 },
  subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.5, maxWidth: 760 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 8px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '12px 8px', fontSize: 14, color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  num: { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  method: { fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.4 },
  bar: { height: 4, borderRadius: 2, marginTop: 6, minWidth: 2 },
};

export function ScopeBreakdownPanel({ breakdown, title, subtitle, color = '#8b5cf6' }) {
  if (!Array.isArray(breakdown) || breakdown.length === 0) return null;
  const rows = breakdown.filter((r) => r && Number.isFinite(Number(r.mt)));
  if (rows.length === 0) return null;
  const total = rows.reduce((s, r) => s + Number(r.mt), 0);
  const pct = (mt) => (total > 0 ? (Number(mt) / total) * 100 : 0);

  return (
    <section style={styles.panel} role="region" aria-label={title}>
      <div style={styles.head}>
        <div style={styles.title}>{title}</div>
        {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Component</th>
            <th style={{ ...styles.th, ...styles.num }}>mtCO₂e/yr</th>
            <th style={{ ...styles.th, ...styles.num }}>Share</th>
            <th style={styles.th}>Provenance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.source}>
              <td style={styles.td}>
                <div style={{ fontWeight: 600 }}>{r.source}</div>
                {r.method && <div style={styles.method}>{r.method}</div>}
                <div style={{ ...styles.bar, width: `${Math.max(pct(r.mt), 1)}%`, background: color }} />
              </td>
              <td style={{ ...styles.td, ...styles.num, fontWeight: 700 }}>{Math.round(Number(r.mt)).toLocaleString()}</td>
              <td style={{ ...styles.td, ...styles.num, color: '#94a3b8' }}>{pct(r.mt).toFixed(0)}%</td>
              <td style={styles.td}>{r.provenance ? <ProvenancePill provenance={r.provenance} /> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ScopeBreakdownPanel;
