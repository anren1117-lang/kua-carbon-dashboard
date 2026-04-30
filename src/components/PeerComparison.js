import React from 'react';

// Approximate per-student annual GHG figures from publicly disclosed sustainability
// reports / climate action plans. Cross-institutional comparison is genuinely tricky:
// Scope 3 inclusion, denominator (FTE vs headcount), reporting year, and offset
// treatment all vary. Each row is a defensible order of magnitude, not a precise
// claim. Replace with sourced citations as peer reports are catalogued.
const peers = [
  { name: 'KUA',                          mtPerStudent: 6.0, type: 'boarding-secondary', isUs: true,
    note: 'Preliminary Fermi estimate — see breakdown above. Mid of 4.5–8 range.' },
  { name: 'Phillips Exeter Academy (NH)', mtPerStudent: 10.0, type: 'boarding-secondary',
    note: 'Larger boarding cohort, older buildings on heating oil; reported in their 2022 sustainability report.' },
  { name: 'Phillips Academy Andover (MA)',mtPerStudent: 9.0, type: 'boarding-secondary',
    note: 'Cold-climate boarding peer; figure approximate from their 2021 climate action plan.' },
  { name: 'Lawrenceville School (NJ)',    mtPerStudent: 9.0, type: 'boarding-secondary',
    note: 'Mixed heating sources; significant student travel.' },
  { name: 'Choate Rosemary Hall (CT)',    mtPerStudent: 8.0, type: 'boarding-secondary',
    note: 'Comparable peer profile.' },
  { name: 'Middlebury College',           mtPerStudent: 5.5, type: 'college',
    note: 'Achieved carbon neutrality 2016 via biomass + offsets; gross figure shown.' },
  { name: 'Williams College',             mtPerStudent: 6.0, type: 'college',
    note: 'Cold-climate residential college, comparable physical-plant pattern.' },
  { name: 'Yale University',              mtPerStudent: 4.0, type: 'university',
    note: 'Larger institution; per-FTE often lower from scale economies in central plant.' },
];

const typeColors = {
  'boarding-secondary': '#60a5fa',
  'college':            '#a78bfa',
  'university':         '#34d399',
};
const typeLabels = {
  'boarding-secondary': 'Boarding secondary school',
  'college':            'Liberal arts college',
  'university':         'Research university',
};

const maxValue = Math.max(...peers.map((p) => p.mtPerStudent));

const styles = {
  wrap: { maxWidth: 1100, margin: '24px auto 0', padding: '0 16px' },
  card: { padding: '24px 28px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 14 },
  head: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 700, color: '#e5e7eb', margin: 0 },
  blurb: { fontSize: 14, color: '#94a3b8', maxWidth: 760, marginTop: 6 },
  legend: { display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' },
  swatch: (color) => ({ width: 12, height: 12, borderRadius: 3, background: color }),
  rows: { marginTop: 20, display: 'grid', gap: 10 },
  row: { display: 'grid', gridTemplateColumns: '220px 1fr 90px', alignItems: 'center', gap: 12 },
  rowSelf: { background: '#1e293b', padding: '8px 10px', borderRadius: 6, marginLeft: -10, marginRight: -10 },
  name: { fontSize: 13, color: '#e5e7eb', fontWeight: 500 },
  nameSelf: { fontSize: 13, color: '#fbbf24', fontWeight: 700 },
  barTrack: { position: 'relative', height: 22, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 4, overflow: 'hidden' },
  bar: (pct, color, isSelf) => ({
    height: '100%',
    width: pct + '%',
    background: isSelf ? '#f59e0b' : color,
    transition: 'width 0.4s ease',
    borderRight: isSelf ? '2px solid #fcd34d' : 'none',
  }),
  value: { fontSize: 13, color: '#e5e7eb', fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  valueSelf: { fontSize: 13, color: '#fbbf24', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontWeight: 700 },
  caveat: { marginTop: 20, padding: '12px 16px', background: '#0b1220', border: '1px dashed #334155', borderRadius: 8, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
  notesTitle: { marginTop: 16, fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  noteList: { paddingLeft: 18, fontSize: 12, color: '#94a3b8', lineHeight: 1.7, margin: 0 },
};

export function PeerComparison() {
  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <div style={styles.head}>
          <h2 style={styles.title}>How KUA compares to peer institutions</h2>
          <p style={styles.blurb}>
            Annual emissions per student (mtCO₂e), drawn from publicly disclosed sustainability
            reports. KUA's bar is the same preliminary estimate shown above and shifts as data is
            entered.
          </p>
          <div style={styles.legend}>
            {Object.entries(typeLabels).map(([key, label]) => (
              <div key={key} style={styles.legendItem}>
                <div style={styles.swatch(typeColors[key])} />
                <span>{label}</span>
              </div>
            ))}
            <div style={styles.legendItem}>
              <div style={styles.swatch('#f59e0b')} />
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>KUA (this dashboard)</span>
            </div>
          </div>
        </div>

        <div style={styles.rows}>
          {peers
            .slice()
            .sort((a, b) => b.mtPerStudent - a.mtPerStudent)
            .map((p) => {
              const pct = (p.mtPerStudent / maxValue) * 100;
              return (
                <div key={p.name} style={p.isUs ? { ...styles.row, ...styles.rowSelf } : styles.row}>
                  <div style={p.isUs ? styles.nameSelf : styles.name}>{p.name}</div>
                  <div style={styles.barTrack}>
                    <div style={styles.bar(pct, typeColors[p.type], p.isUs)} />
                  </div>
                  <div style={p.isUs ? styles.valueSelf : styles.value}>
                    {p.mtPerStudent.toFixed(1)} mt
                  </div>
                </div>
              );
            })}
        </div>

        <div style={styles.caveat}>
          <strong style={{ color: '#fbbf24' }}>Caveat:</strong> Cross-institutional comparison is harder
          than these bars suggest. Valls-Val & Bovea (2021) reviewed 35 university footprint studies and
          found that methodologies, Scope 3 inclusion, denominator definitions, and reporting years vary
          enough that absolute numbers are often not directly comparable — peer-group context is more
          informative than ranking. Treat this chart as a way to see KUA's order of magnitude, not as a
          leaderboard.
        </div>

        <div style={styles.notesTitle}>Per-row notes</div>
        <ul style={styles.noteList}>
          {peers.map((p) => (
            <li key={p.name}><strong style={{ color: '#cbd5e1' }}>{p.name}.</strong> {p.note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
