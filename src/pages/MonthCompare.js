import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { AnimatedNumber } from '../components/AnimatedNumber.js';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';
import { buildingMonthlyHistory, campusMonthlyTotals } from '../data/monthlyConsumption.js';

// /compare — side-by-side comparison of any two captured months.
// Drives questions like "did the post-winter-break January spike
// recover in February?" or "which dorms moved up between two
// arbitrary months?"
//
// Default selection: most-recent month vs the one before it.
// User picks any pair via two dropdown lists. Comparison shows:
//   - Campus total delta (kWh + mt + % change)
//   - Per-dorm leaderboard: rank-change between the two months
//   - Biggest gainer + biggest faller called out

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtMonth(ym) {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  if (!Number.isFinite(m) || m < 1 || m > 12) return ym;
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

const ISO_NE_KG_PER_KWH = 0.235;

export default function MonthCompare() {
  const monthly = useMemo(() => campusMonthlyTotals().sort((a, b) => a.month.localeCompare(b.month)), []);
  const months  = monthly.map((m) => m.month);
  const defaultB = months[months.length - 1] || null;
  const defaultA = months[months.length - 2] || months[0] || null;

  const [a, setA] = useState(defaultA);
  const [b, setB] = useState(defaultB);

  const { rows } = useMemo(() => computeBuildingEmissions(), []);
  const history = useMemo(() => buildingMonthlyHistory(), []);

  const monthA = monthly.find((m) => m.month === a) || null;
  const monthB = monthly.find((m) => m.month === b) || null;

  const dormDeltas = useMemo(() => {
    if (!a || !b) return [];
    return rows
      .filter((r) => r.category === 'Dorm' && r.occupants > 0)
      .map((d) => {
        const kwhA = history[d.id]?.[a] || 0;
        const kwhB = history[d.id]?.[b] || 0;
        const perA = d.occupants > 0 ? kwhA / d.occupants : 0;
        const perB = d.occupants > 0 ? kwhB / d.occupants : 0;
        const pct  = perA > 0 ? ((perB - perA) / perA) * 100 : null;
        return { ...d, perA: Math.round(perA), perB: Math.round(perB), pct };
      })
      .filter((d) => d.perA > 0 || d.perB > 0);
  }, [rows, history, a, b]);

  const biggestImprover = useMemo(() => {
    return [...dormDeltas]
      .filter((d) => d.pct !== null && d.pct < 0)
      .sort((a, b) => a.pct - b.pct)[0] || null;
  }, [dormDeltas]);

  const biggestRegression = useMemo(() => {
    return [...dormDeltas]
      .filter((d) => d.pct !== null && d.pct > 0)
      .sort((a, b) => b.pct - a.pct)[0] || null;
  }, [dormDeltas]);

  if (months.length < 2) {
    return (
      <ModulePage title="Month-by-month comparison" subtitle="Need at least two captured months to compare.">
        <ModuleSection title="Waiting for data">
          <p style={styles.fineprint}>
            As soon as the second month of BMS data lands, this page becomes useful.
            In the meantime, see <Link to="/dorm-leaderboard" style={styles.link}>the leaderboard</Link>{' '}
            for annualized rankings.
          </p>
        </ModuleSection>
      </ModulePage>
    );
  }

  const campusKwhA = monthA?.displayedTotal || 0;
  const campusKwhB = monthB?.displayedTotal || 0;
  const campusMtA  = Math.round((campusKwhA * ISO_NE_KG_PER_KWH) / 1000);
  const campusMtB  = Math.round((campusKwhB * ISO_NE_KG_PER_KWH) / 1000);
  const campusPct  = campusKwhA > 0 ? Math.round(((campusKwhB - campusKwhA) / campusKwhA) * 100) : null;
  const campusImproved = campusPct !== null && campusPct < 0;

  return (
    <ModulePage
      title="Month-by-month comparison"
      subtitle={`Pick any two captured months. The page shows the campus total delta, the dorm leaderboard's movement, and the biggest improvers + regressions. Useful for answering "did the January spike recover by February?" or "which dorms moved up between two specific months?"`}
    >
      <ModuleSection title="Pick two months" hint="">
        <div style={styles.pickerRow}>
          <label style={styles.pickerLabel}>
            Starting from:
            <select value={a || ''} onChange={(e) => setA(e.target.value)} style={styles.picker}>
              {months.map((m) => <option key={m} value={m}>{fmtMonth(m)}</option>)}
            </select>
          </label>
          <span style={styles.pickerSep}>→</span>
          <label style={styles.pickerLabel}>
            Compared to:
            <select value={b || ''} onChange={(e) => setB(e.target.value)} style={styles.picker}>
              {months.map((m) => <option key={m} value={m}>{fmtMonth(m)}</option>)}
            </select>
          </label>
        </div>
      </ModuleSection>

      <ModuleSection title="Campus total" hint="">
        <div style={styles.campusGrid}>
          <CampusCell label={`${fmtMonth(a)}`} kwh={campusKwhA} mt={campusMtA} />
          <CampusCell label={`${fmtMonth(b)}`} kwh={campusKwhB} mt={campusMtB} highlight />
        </div>
        {campusPct !== null && Math.abs(campusPct) > 0 && (
          <div style={styles.campusDelta}>
            <Pill kind={campusImproved ? 'good' : 'warn'}>
              {campusPct < 0 ? '↓' : '↑'} {Math.abs(campusPct)}% campus-wide
            </Pill>
            <span style={styles.campusDeltaText}>
              {campusImproved
                ? `Campus electricity is ${Math.abs(campusPct)}% lower in ${fmtMonth(b)} than ${fmtMonth(a)}.`
                : `Campus electricity rose ${campusPct}% from ${fmtMonth(a)} to ${fmtMonth(b)}.`}
            </span>
          </div>
        )}
      </ModuleSection>

      <div style={styles.twoCol}>
        {biggestImprover && (
          <ModuleSection title="📉 Biggest improver" hint="">
            <div style={styles.miniCard} className="kua-card-hover kua-champion-glow">
              <Link to={`/buildings/${biggestImprover.id}`} style={styles.miniName}>{biggestImprover.name}</Link>
              <div style={{ ...styles.miniValue, color: '#86efac' }}>
                ↓ <AnimatedNumber value={Math.abs(Math.round(biggestImprover.pct))} duration={900} />%
              </div>
              <div style={styles.miniMeta}>
                {biggestImprover.perA} → {biggestImprover.perB} kWh/resident
              </div>
            </div>
          </ModuleSection>
        )}
        {biggestRegression && (
          <ModuleSection title="📈 Biggest regression" hint="">
            <div style={styles.miniCard} className="kua-card-hover">
              <Link to={`/buildings/${biggestRegression.id}`} style={styles.miniName}>{biggestRegression.name}</Link>
              <div style={{ ...styles.miniValue, color: '#fca5a5' }}>
                ↑ <AnimatedNumber value={Math.round(biggestRegression.pct)} duration={900} />%
              </div>
              <div style={styles.miniMeta}>
                {biggestRegression.perA} → {biggestRegression.perB} kWh/resident
              </div>
            </div>
          </ModuleSection>
        )}
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 20, marginBottom: 0 }}>
        Want to compare two BUILDINGS instead of two months?
        {' '}<Link to="/compare-buildings" style={styles.link}>Open the building comparison →</Link>
      </p>

      <ModuleSection title="Every dorm, sorted by change" hint="Click any dorm to drill into its full monthly trend.">
        <ol style={styles.list}>
          {[...dormDeltas].sort((x, y) => {
            // Improvers first (most negative pct), then no-change, then regressors
            if (x.pct === null && y.pct === null) return 0;
            if (x.pct === null) return 1;
            if (y.pct === null) return -1;
            return x.pct - y.pct;
          }).map((d) => (
            <li key={d.id} style={styles.row} className="kua-card-hover">
              <Link to={`/buildings/${d.id}`} style={styles.rowName}>{d.name}</Link>
              <span style={styles.rowFrom}>{d.perA}</span>
              <span style={styles.rowArrow}>→</span>
              <span style={styles.rowTo}>{d.perB}</span>
              <span style={styles.rowUnit}>kWh/resident</span>
              <span style={styles.rowDelta}>
                {d.pct === null ? <Pill kind="neutral">no prior data</Pill>
                  : Math.abs(d.pct) < 3 ? <Pill kind="neutral">flat</Pill>
                  : d.pct < 0 ? <Pill kind="good">↓ {Math.abs(d.pct).toFixed(0)}%</Pill>
                  : <Pill kind="warn">↑ {d.pct.toFixed(0)}%</Pill>}
              </span>
            </li>
          ))}
        </ol>
      </ModuleSection>
    </ModulePage>
  );
}

function CampusCell({ label, kwh, mt, highlight }) {
  return (
    <div style={highlight ? { ...styles.campusCell, ...styles.campusCellActive } : styles.campusCell}>
      <div style={styles.campusCellLabel}>{label}</div>
      <div style={styles.campusCellKwh}>
        <AnimatedNumber value={kwh} duration={1100} /> <span style={styles.campusCellUnit}>kWh</span>
      </div>
      <div style={styles.campusCellMt}>≈ <AnimatedNumber value={mt} duration={1100} /> mtCO₂e</div>
    </div>
  );
}

const styles = {
  pickerRow: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  pickerLabel: { fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 10 },
  picker: { padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 14, fontFamily: 'inherit' },
  pickerSep: { color: '#475569', fontSize: 20 },

  campusGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 },
  campusCell: { padding: '18px 20px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  campusCellActive: { borderColor: '#22d3ee', borderLeft: '4px solid #22d3ee', background: 'linear-gradient(135deg, rgba(14, 58, 95, 0.4) 0%, #0b1220 70%)' },
  campusCellLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 10 },
  campusCellKwh: { fontSize: 26, color: '#e5e7eb', fontWeight: 800, fontVariantNumeric: 'tabular-nums' },
  campusCellUnit: { fontSize: 13, color: '#94a3b8', fontWeight: 500 },
  campusCellMt: { fontSize: 13, color: '#94a3b8', marginTop: 6 },

  campusDelta: { marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  campusDeltaText: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 },

  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 },
  miniCard: { padding: '18px 20px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  miniName: { fontSize: 18, fontWeight: 700, color: '#22d3ee', textDecoration: 'none', display: 'block', marginBottom: 10 },
  miniValue: { fontSize: 30, fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginBottom: 6 },
  miniMeta: { fontSize: 13, color: '#94a3b8' },

  list: { listStyle: 'none', padding: 0, margin: 0 },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 70px 20px 70px 110px 110px',
    gap: 10,
    alignItems: 'center',
    padding: '10px 12px',
    borderBottom: '1px solid #1f2937',
    fontSize: 13,
  },
  rowName: { color: '#e5e7eb', fontWeight: 600, textDecoration: 'none' },
  rowFrom: { color: '#94a3b8', fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  rowArrow: { color: '#475569', textAlign: 'center' },
  rowTo: { color: '#e5e7eb', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontWeight: 700 },
  rowUnit: { color: '#64748b', fontSize: 11 },
  rowDelta: { textAlign: 'right' },

  link: { color: '#22d3ee', textDecoration: 'none', fontWeight: 700 },
  fineprint: { fontSize: 13, color: '#94a3b8', lineHeight: 1.7 },
};
