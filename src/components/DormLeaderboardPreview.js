import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';
import { useIsNarrow } from '../hooks/useViewport.js';

// Homepage preview of /dorm-leaderboard. Shows the top 3 most
// efficient dorms (by annualized kWh per resident) so a student
// landing on / immediately sees the residence-hall competition
// without having to discover the /dorm-leaderboard route via the
// Categories dropdown.
//
// Pure render — pulls from the same computeBuildingEmissions()
// chain the leaderboard page uses. No API call, no cost.

export function DormLeaderboardPreview() {
  const isNarrow = useIsNarrow();
  const { rows } = useMemo(() => computeBuildingEmissions(), []);
  const dorms = useMemo(() => {
    return rows
      .filter((r) => r.category === 'Dorm' && r.occupants > 0 && r.annualKwh > 0)
      .map((r) => ({
        id: r.id,
        name: r.name,
        occupants: r.occupants,
        perResident: Math.round(r.annualKwh / r.occupants),
      }))
      .sort((a, b) => a.perResident - b.perResident);
  }, [rows]);

  if (dorms.length === 0) return null;
  const top3 = dorms.slice(0, 3);
  const total = dorms.length;

  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <div style={styles.head}>
          <div>
            <div style={styles.eyebrow}>🏆 Dorm energy leaderboard</div>
            <h2 style={styles.title}>Where your dorm ranks</h2>
            <p style={styles.blurb}>
              The three most efficient dorms right now, ranked by kilowatt-hours per
              resident per year (the only apples-to-apples comparison — a 14-person
              dorm shouldn't be congratulated for using less total electricity than
              a 48-person dorm).
            </p>
          </div>
          <Link to="/dorm-leaderboard" style={styles.cta}>
            See all {total} dorms →
          </Link>
        </div>

        <ol style={styles.list}>
          {top3.map((d, i) => (
            <li key={d.id} style={isNarrow ? styles.rowNarrow : styles.row}>
              <span style={styles.medal}>{['🥇','🥈','🥉'][i]}</span>
              <Link to={`/buildings/${d.id}`} style={styles.dormName}>
                {d.name}
              </Link>
              <span style={styles.meta}>{d.occupants} residents</span>
              <span style={styles.value}>
                <strong style={styles.valueNum}>{d.perResident.toLocaleString()}</strong>
                <span style={styles.valueUnit}> kWh/resident/yr</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 1100, margin: '24px auto 0', padding: '0 16px' },
  card: {
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #0f172a 0%, #052e16 100%)',
    border: '1px solid #1f2937',
    borderLeft: '3px solid #86efac',
    borderRadius: 14,
  },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 },
  eyebrow: { fontSize: 11, color: '#86efac', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, marginBottom: 6 },
  title: { fontSize: 22, fontWeight: 700, color: '#e5e7eb', margin: 0 },
  blurb: { fontSize: 13, color: '#94a3b8', maxWidth: 620, marginTop: 6, lineHeight: 1.55 },
  cta: {
    padding: '10px 16px',
    background: '#052e16',
    color: '#86efac',
    border: '1px solid #16a34a',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  list: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 },
  row: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 110px 200px',
    gap: 14,
    alignItems: 'center',
    padding: '10px 12px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 8,
  },
  rowNarrow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '10px 12px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 8,
  },
  medal: { fontSize: 22, lineHeight: 1, textAlign: 'center' },
  dormName: { color: '#e5e7eb', fontWeight: 700, textDecoration: 'none', fontSize: 15 },
  meta: { color: '#64748b', fontSize: 12, fontVariantNumeric: 'tabular-nums' },
  value: { textAlign: 'right' },
  valueNum: { color: '#86efac', fontSize: 16, fontVariantNumeric: 'tabular-nums', fontWeight: 700 },
  valueUnit: { color: '#64748b', fontSize: 11 },
};
