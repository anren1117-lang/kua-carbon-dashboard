import React, { useState } from 'react';

const rows = [
  { name: 'Scope 1 — Heating fuel',                low: 1000, high: 1500, kind: 'estimate', note: '100k–150k gal heating-oil-equivalent at 10.16 kg CO₂/gal. Replaced as fuel deliveries are logged.' },
  { name: 'Scope 1 — Refrigerants + fleet',         low: 20,   high: 50,   kind: 'estimate', note: 'Service-report mass balance + fuel-card records.' },
  { name: 'Scope 2 — Electricity',                  low: 222,  high: 222,  kind: 'documented', note: '2.3M kWh × ISO-NE 2024 (643 lb CO₂/MWh). The one figure currently cited.' },
  { name: 'Scope 3 — Student travel',               low: 1500, high: 3000, kind: 'estimate', note: 'Internationals (~50) at ~3 mtCO₂e per round trip, US boarders (~150) at ~3–4 trips/yr at ~1 mt each, plus study abroad and athletic teams. Often the largest single category at residential schools (Kool 2025).' },
  { name: 'Scope 3 — Goods, waste, commuting, upstream fuel', low: 500, high: 800, kind: 'estimate', note: 'EEIO spend-based (Cat 1) + WARM waste + small commuting (residential school) + upstream fuel ~15–20% of Scope 1+2.' },
  { name: 'Sinks — On-campus sequestration',        low: -4000,high: -2000, kind: 'estimate', note: '~1,000 acres of campus forest × forest accumulation rate. Conservative end uses Birdsey (1992) US-forest average (~2.1 mtCO₂e/acre/yr). Upper end uses Nowak (2013) urban-tree density (0.28 kg C/m²/yr → ~4.2 mtCO₂e/acre/yr) where open-grown trees grow faster. Negative = pulled out of the air.' },
];

const summary = {
  grossLow: 3242, grossHigh: 5572, grossMid: 4150,
  sinkLow: -4000, sinkHigh: -2000,
  netLow: -758, netHigh: 3572, netMid: 1150,
  // Per-student values are net mt ÷ ~340 enrolled students (KUA's actual
  // headcount per the school's "By the Numbers" page). Range reflects
  // the gross/sinks low/mid/high spread.
  perStudentLow: -2.2, perStudentHigh: 10.5, perStudentMid: 3.4,
  studentCount: 340,
};

const styles = {
  wrap: { maxWidth: 1100, margin: '0 auto', padding: '0 16px' },
  card: { padding: 'clamp(20px, 4vw, 36px) clamp(20px, 4vw, 40px)', background: 'linear-gradient(160deg, #0f172a 0%, #0b1220 100%)', border: '1px solid #1f2937', borderRadius: 16, boxShadow: '0 1px 0 rgba(245, 158, 11, 0.05) inset' },
  badge: { fontSize: 11, padding: '5px 12px', borderRadius: 4, background: '#3a2a0d', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700, border: '1px solid #92400e', display: 'inline-block' },
  hero: { marginTop: 22 },
  heroLabel: { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.6, fontWeight: 600 },
  heroValue: { fontSize: 'clamp(40px, 11vw, 72px)', color: '#fbbf24', fontWeight: 800, marginTop: 6, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' },
  heroUnit: { fontSize: 'clamp(14px, 3vw, 22px)', color: '#94a3b8', marginLeft: 8, fontWeight: 500, letterSpacing: 0 },
  heroRange: { fontSize: 14, color: '#94a3b8', marginTop: 12 },
  blurb: { fontSize: 16, color: '#cbd5e1', maxWidth: 760, marginTop: 22, lineHeight: 1.7 },
  numbers: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 32 },
  numCell: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  numLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 },
  numBig: { fontSize: 'clamp(22px, 5vw, 32px)', color: '#e5e7eb', fontWeight: 700, marginTop: 8, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  numUnit: { fontSize: 14, color: '#94a3b8', marginLeft: 6, fontWeight: 400 },
  numRange: { fontSize: 13, color: '#64748b', marginTop: 8 },
  tableWrap: { marginTop: 32, padding: '24px 26px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 12 },
  tableHead: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, marginBottom: 14 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 8px', fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '14px 8px', fontSize: 15, color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  tdNum: { padding: '14px 8px', fontSize: 15, color: '#e5e7eb', borderBottom: '1px solid #1f2937', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', fontWeight: 600 },
  pill: (kind) => ({ fontSize: 10, padding: '3px 9px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 0.6, background: kind === 'documented' ? '#052e1a' : '#3a2a0d', color: kind === 'documented' ? '#86efac' : '#fbbf24', fontWeight: 700 }),
  detailsToggle: { marginTop: 18, background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '9px 18px', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 500 },
  noteList: { marginTop: 18, paddingLeft: 22, fontSize: 14, color: '#94a3b8', lineHeight: 1.9 },
};

const fmt = (n) => Math.abs(n) >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toString();
const fmtRange = (lo, hi) => lo === hi ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}`;

export function NetEstimate() {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <span style={styles.badge}>Preliminary estimate</span>
        <div style={styles.hero}>
          <div style={styles.heroLabel}>Net annual carbon balance</div>
          <div style={styles.heroValue}>
            {fmt(summary.netMid)}
            <span style={styles.heroUnit}>mtCO₂e / yr</span>
          </div>
          <div style={styles.heroRange}>
            range {fmtRange(summary.netLow, summary.netHigh)} · low end is net-negative
          </div>
        </div>

        <div style={styles.numbers}>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Per student</div>
            <div style={styles.numBig}>~{summary.perStudentMid}<span style={styles.numUnit}>mtCO₂e</span></div>
          </div>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Gross emissions</div>
            <div style={styles.numBig}>~{fmt(summary.grossMid)}<span style={styles.numUnit}>mtCO₂e</span></div>
          </div>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Sequestration</div>
            <div style={styles.numBig}>~{fmt(3000)}<span style={styles.numUnit}>mtCO₂e</span></div>
          </div>
        </div>

        <button type="button" style={styles.detailsToggle} onClick={() => setShowBreakdown((v) => !v)}>
          {showBreakdown ? 'Hide breakdown' : 'Show line-by-line breakdown'}
        </button>

        {showBreakdown && (
          <div style={styles.tableWrap}>
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
              {showNotes ? 'Hide assumptions' : 'Show assumptions per line'}
            </button>
            {showNotes && (
              <ul style={styles.noteList}>
                {rows.map((r) => <li key={r.name}><strong>{r.name}.</strong> {r.note}</li>)}
                <li><strong>Per-student denominator.</strong> ≈ {summary.studentCount} students (boarding + day). Adjust when enrollment data is integrated.</li>
                <li><strong>Calibration.</strong> {summary.perStudentMid} mtCO₂e/student/yr lands inside the 2–15 envelope reported across HEI footprint studies (Gutiérrez-Mosquera et al. 2024).</li>
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
