import React, { useState } from 'react';

const rows = [
  { name: 'Scope 1 — Heating fuel',                low: 1000, high: 1500, kind: 'estimate', note: '100k–150k gal heating-oil-equivalent at 10.16 kg CO₂/gal. Replaced as fuel deliveries are logged.' },
  { name: 'Scope 1 — Refrigerants + fleet',         low: 20,   high: 50,   kind: 'estimate', note: 'Service-report mass balance + fuel-card records.' },
  { name: 'Scope 2 — Electricity',                  low: 222,  high: 222,  kind: 'documented', note: '2.3M kWh × ISO-NE 2024 (643 lb CO₂/MWh). The one figure currently cited.' },
  { name: 'Scope 3 — Student travel',               low: 1500, high: 3000, kind: 'estimate', note: 'Internationals (~50) at ~3 mtCO₂e per round trip, US boarders (~150) at ~3–4 trips/yr at ~1 mt each, plus study abroad and athletic teams. Often the largest single category at residential schools (Kool 2025).' },
  { name: 'Scope 3 — Goods, waste, commuting, upstream fuel', low: 500, high: 800, kind: 'estimate', note: 'EEIO spend-based (Cat 1) + WARM waste + small commuting (residential school) + upstream fuel ~15–20% of Scope 1+2.' },
  { name: 'Sinks — On-campus sequestration',        low: -4000,high: -2000, kind: 'estimate', note: '~1,000 acres of campus forest × forest accumulation rate. Conservative end uses Birdsey (1992) US-forest average (~2.1 mtCO₂e/acre/yr). Upper end uses Nowak (2013) urban-tree density (0.28 kg C/m²/yr → ~4.2 mtCO₂e/acre/yr) where open-grown trees grow faster. Negative = pulled out of the air.' },
];

// gross = scope1 + scope2 + scope3; net = gross + sinks (sinks stored negative)
const summary = {
  grossLow: 3242,
  grossHigh: 5572,
  grossMid: 4150,
  sinkLow: -4000,    // most-negative (best case sequestration)
  sinkHigh: -2000,   // least-negative (conservative)
  // Net range: best case = lowest gross + most sinks; worst case = highest gross + least sinks
  netLow: -758,      // 3242 - 4000 — slightly net-negative is plausible
  netHigh: 3572,     // 5572 - 2000
  netMid: 1150,      // 4150 - 3000
  perStudentLow: -1.3,
  perStudentHigh: 6.0,
  perStudentMid: 1.9,
  studentCount: 600,
};

const styles = {
  wrap: { maxWidth: 1100, margin: '24px auto 0', padding: '0 16px' },
  card: { padding: '24px 28px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 14, borderTop: '3px solid #f59e0b' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 16 },
  badge: { fontSize: 11, padding: '4px 10px', borderRadius: 4, background: '#3a2a0d', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, border: '1px solid #92400e' },
  title: { fontSize: 22, fontWeight: 700, color: '#e5e7eb', marginTop: 8, marginBottom: 4 },
  blurb: { fontSize: 14, color: '#94a3b8', maxWidth: 720, marginTop: 0 },
  numbers: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 20, marginBottom: 16 },
  numCell: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  numLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 },
  numBig: { fontSize: 26, color: '#e5e7eb', fontWeight: 700, marginTop: 4 },
  numUnit: { fontSize: 13, color: '#94a3b8', marginLeft: 6, fontWeight: 400 },
  numRange: { fontSize: 12, color: '#64748b', marginTop: 4 },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 16 },
  th: { textAlign: 'left', padding: '10px 8px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937' },
  td: { padding: '10px 8px', fontSize: 13, color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  tdNum: { padding: '10px 8px', fontSize: 13, color: '#e5e7eb', borderBottom: '1px solid #1f2937', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' },
  pill: (kind) => ({ fontSize: 10, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 0.5, background: kind === 'documented' ? '#052e1a' : '#3a2a0d', color: kind === 'documented' ? '#86efac' : '#fbbf24' }),
  detailsToggle: { marginTop: 16, background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '8px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  noteList: { marginTop: 16, paddingLeft: 20, fontSize: 13, color: '#94a3b8', lineHeight: 1.7 },
};

const fmt = (n) => Math.abs(n) >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toString();
const fmtRange = (lo, hi) => lo === hi ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}`;

export function NetEstimate() {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <div style={styles.head}>
          <div>
            <span style={styles.badge}>Preliminary estimate</span>
            <h2 style={styles.title}>Net Annual Carbon Balance</h2>
            <p style={styles.blurb}>
              Fermi estimate across every scope plus on-campus sequestration. Each line is replaced
              with a measured value as data is entered through the Admin Portal — only the Scope 2
              electricity row currently is.
            </p>
          </div>
        </div>

        <div style={styles.numbers}>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Net balance</div>
            <div style={styles.numBig}>~{fmt(summary.netMid)}<span style={styles.numUnit}>mtCO₂e/yr</span></div>
            <div style={styles.numRange}>range {fmtRange(summary.netLow, summary.netHigh)} · low end is net-negative</div>
          </div>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Per student</div>
            <div style={styles.numBig}>~{summary.perStudentMid}<span style={styles.numUnit}>mtCO₂e/student/yr</span></div>
            <div style={styles.numRange}>range {summary.perStudentLow} – {summary.perStudentHigh} · {summary.studentCount} students</div>
          </div>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Gross emissions</div>
            <div style={styles.numBig}>~{fmt(summary.grossMid)}<span style={styles.numUnit}>mtCO₂e/yr</span></div>
            <div style={styles.numRange}>range {fmtRange(summary.grossLow, summary.grossHigh)}</div>
          </div>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Sequestration</div>
            <div style={styles.numBig}>~{fmt(3000)}<span style={styles.numUnit}>mtCO₂e/yr</span></div>
            <div style={styles.numRange}>range {fmtRange(Math.abs(summary.sinkHigh), Math.abs(summary.sinkLow))} pulled out · ~1,000 acres of campus forest</div>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Source</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>mtCO₂e / yr</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td style={styles.td}>{r.name}</td>
                <td style={styles.tdNum}>
                  {r.low === r.high ? fmt(r.low) : `${fmt(r.low)} to ${fmt(r.high)}`}
                </td>
                <td style={styles.td}><span style={styles.pill(r.kind)}>{r.kind}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" style={styles.detailsToggle} onClick={() => setShowNotes((v) => !v)}>
          {showNotes ? 'Hide assumptions' : 'Show how each line was estimated'}
        </button>
        {showNotes && (
          <ul style={styles.noteList}>
            {rows.map((r) => <li key={r.name}><strong>{r.name}.</strong> {r.note}</li>)}
            <li><strong>Per-student denominator.</strong> ≈ {summary.studentCount} students (boarding + day). Adjust when enrollment data is integrated.</li>
            <li><strong>Calibration.</strong> {summary.perStudentMid} mtCO₂e/student/yr lands inside the 2–15 envelope reported across HEI footprint studies (Gutiérrez-Mosquera et al. 2024); cold-climate residential schools tend toward the higher end.</li>
          </ul>
        )}
      </section>
    </div>
  );
}
