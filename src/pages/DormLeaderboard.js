import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';
import { buildingMonthlyHistory, monthlyReports } from '../data/monthlyConsumption.js';
import { useIsNarrow } from '../hooks/useViewport.js';
import { energyEquivalents } from '../utils/equivalents.js';

// /dorm-leaderboard — apples-to-apples kWh-per-resident ranking
// across the 11 student dorms. Larger dorms ALWAYS use more
// electricity in absolute terms, so a per-resident metric is the
// only fair comparison (a 14-person Baxter shouldn't be congratulated
// for using less than a 48-person Barrette).
//
// Trend column compares this-month per-resident to last-month
// per-resident, so a small dorm can show real improvement.

export default function DormLeaderboard() {
  const isNarrow = useIsNarrow();
  const { rows } = useMemo(() => computeBuildingEmissions(), []);
  const dormRows = rows.filter((r) => r.category === 'Dorm' && r.occupants > 0);

  // Build a per-dorm, per-month, per-resident kWh series so the trend
  // arrow has something to compare against.
  const history = useMemo(() => buildingMonthlyHistory(), []);
  const monthsAvailable = useMemo(() => {
    const all = new Set();
    for (const bucket of Object.values(history)) {
      for (const m of Object.keys(bucket || {})) all.add(m);
    }
    return [...all].sort();
  }, [history]);

  const latestMonth   = monthsAvailable[monthsAvailable.length - 1] || null;
  const previousMonth = monthsAvailable[monthsAvailable.length - 2] || null;

  const [view, setView] = useState('annual'); // 'annual' | 'latest_month'

  const ranked = useMemo(() => {
    return dormRows.map((d) => {
      const kwhAnnualPerResident = d.occupants > 0 ? Math.round(d.annualKwh / d.occupants) : 0;
      const thisMonthKwh = latestMonth ? (history[d.id]?.[latestMonth] || 0) : 0;
      const prevMonthKwh = previousMonth ? (history[d.id]?.[previousMonth] || 0) : 0;
      const thisMonthPer = d.occupants > 0 ? thisMonthKwh / d.occupants : 0;
      const prevMonthPer = d.occupants > 0 ? prevMonthKwh / d.occupants : 0;
      const pctChange = prevMonthPer > 0 ? ((thisMonthPer - prevMonthPer) / prevMonthPer) * 100 : null;
      return {
        ...d,
        kwhAnnualPerResident,
        thisMonthKwh,
        thisMonthPerResident: Math.round(thisMonthPer),
        prevMonthPerResident: Math.round(prevMonthPer),
        pctChange,
      };
    }).sort((a, b) => {
      // Lower per-resident = better → sort ascending.
      if (view === 'latest_month') return a.thisMonthPerResident - b.thisMonthPerResident;
      return a.kwhAnnualPerResident - b.kwhAnnualPerResident;
    });
  }, [dormRows, history, latestMonth, previousMonth, view]);

  const champion = ranked[0] || null;
  const maxValue = view === 'latest_month'
    ? Math.max(...ranked.map((r) => r.thisMonthPerResident), 1)
    : Math.max(...ranked.map((r) => r.kwhAnnualPerResident), 1);

  return (
    <ModulePage
      title="Dorm energy leaderboard"
      subtitle={`Ranking the ${dormRows.length} student dorms by electricity per resident — the only fair comparison since a 48-person dorm always uses more total kWh than a 14-person dorm. Lower = better.`}
      toolbar={
        <button
          type="button"
          onClick={() => window.print()}
          style={{ padding: '8px 14px', background: '#0e7490', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}
          title="Print the leaderboard as a bulletin-board handout"
        >
          🖨 Print leaderboard
        </button>
      }
    >
      {champion && (
        <ModuleSection title="This year's most efficient dorm" hint="">
          <div style={styles.championCard} className="kua-champion-glow">
            <div style={styles.championRank}>🏆 #1</div>
            <div style={{ flex: 1 }}>
              <div style={styles.championName}>{champion.name}</div>
              <div style={styles.championMeta}>
                {champion.kwhAnnualPerResident.toLocaleString()} kWh per resident per year
                {' '}· {champion.occupants} residents · {champion.sqft.toLocaleString()} sqft
              </div>
              {(() => {
                // Per-resident kWh → tangible equivalents (iPhone
                // charges + light-bulb hours). Lands the abstract
                // kWh number in something a student can picture.
                const eq = energyEquivalents(champion.kwhAnnualPerResident);
                return (
                  <div style={styles.championEquiv}>
                    ≈ {eq.iphoneCharges.toLocaleString()} iPhone charges
                    {' · '}
                    {eq.bulbHours.toLocaleString()} hours of a 60W bulb
                  </div>
                );
              })()}
            </div>
          </div>
        </ModuleSection>
      )}

      <ModuleSection title="Full leaderboard" hint="Click a dorm name to see its full monthly trend + operating profile.">
        <div style={styles.controls}>
          <span style={styles.controlLabel}>Rank by:</span>
          <button
            type="button"
            onClick={() => setView('annual')}
            style={{ ...styles.modeBtn, ...(view === 'annual' ? styles.modeBtnActive : {}) }}
          >
            Annualized kWh/resident
          </button>
          <button
            type="button"
            onClick={() => setView('latest_month')}
            disabled={!latestMonth}
            style={{ ...styles.modeBtn, ...(view === 'latest_month' ? styles.modeBtnActive : {}) }}
          >
            {latestMonth ? `${formatMonth(latestMonth)} only` : 'No monthly data'}
          </button>
        </div>

        <ol style={styles.list}>
          {ranked.map((d, i) => {
            const value = view === 'latest_month' ? d.thisMonthPerResident : d.kwhAnnualPerResident;
            const widthPct = (value / maxValue) * 100;
            const trend = d.pctChange;
            const showTrend = view === 'latest_month' && previousMonth && trend !== null;
            if (isNarrow) {
              return (
                <li key={d.id} style={styles.cardRow}>
                  <div style={styles.cardHead}>
                    <span style={styles.cardRank}>#{i + 1}</span>
                    <Link to={`/buildings/${d.id}`} style={styles.cardName}>{d.name}</Link>
                    {showTrend && <span style={styles.cardTrend}><TrendBadge pct={trend} /></span>}
                  </div>
                  <div style={styles.cardMeta}>{d.occupants} residents</div>
                  <div style={styles.cardBarWrap}>
                    <span
                      className="kua-bar-grow"
                      style={{
                        ...styles.barFill,
                        background: barColor(i, ranked.length),
                        '--kua-bar-target': `${widthPct}%`,
                        '--kua-bar-delay': `${i * 60}ms`,
                      }}
                    />
                  </div>
                  <div style={styles.cardValue}>
                    {value.toLocaleString()}{' '}
                    <span style={styles.valueUnit}>kWh/resident{view === 'latest_month' ? '/mo' : '/yr'}</span>
                  </div>
                </li>
              );
            }
            return (
              <li key={d.id} style={styles.row}>
                <span style={styles.rankCol}>#{i + 1}</span>
                <Link to={`/buildings/${d.id}`} style={styles.nameCol}>
                  {d.name}
                </Link>
                <span style={styles.metaCol}>
                  {d.occupants} residents
                </span>
                <span style={styles.barCol}>
                  <span
                    className="kua-bar-grow"
                    style={{
                      ...styles.barFill,
                      background: barColor(i, ranked.length),
                      '--kua-bar-target': `${widthPct}%`,
                      '--kua-bar-delay': `${i * 60}ms`,
                    }}
                  />
                </span>
                <span style={styles.valueCol}>
                  {value.toLocaleString()}{' '}
                  <span style={styles.valueUnit}>kWh/resident{view === 'latest_month' ? '/mo' : '/yr'}</span>
                </span>
                <span style={styles.trendCol}>
                  {showTrend ? <TrendBadge pct={trend} /> : '—'}
                </span>
              </li>
            );
          })}
        </ol>

        {view === 'latest_month' && previousMonth && (
          <p style={styles.fineprint}>
            Trend column compares <strong>{formatMonth(latestMonth)}</strong> per-resident kWh to
            {' '}<strong>{formatMonth(previousMonth)}</strong>. A small reduction in a small dorm
            can be a bigger percentage than a large reduction in a big dorm — that's the point of
            ranking per-resident, not absolute.
          </p>
        )}
      </ModuleSection>

      <ModuleSection title="Where these numbers come from" hint="">
        <p style={styles.fineprint}>
          Per-resident kWh = (building's measured BMS electricity) ÷ (residents from dorm registry).
          Annualized when the building has fewer than 12 months of measured data. Doesn't include
          heating fuel (that's tracked campus-wide on /scope-1, not per-dorm).
        </p>
        <p style={styles.fineprint}>
          See the <Link to="/campus-map" style={styles.link}>campus map</Link> for the full
          visual distribution, or click any dorm above for its individual monthly trend +
          comparison against same-category peers.
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

function TrendBadge({ pct }) {
  if (!Number.isFinite(pct)) return <span style={{ color: '#64748b' }}>—</span>;
  const round = Math.round(pct);
  if (Math.abs(round) < 3) return <Pill kind="neutral">flat</Pill>;
  if (round < 0) return <Pill kind="good">↓ {Math.abs(round)}% better</Pill>;
  return <Pill kind="warn">↑ {round}% worse</Pill>;
}

// Color the bars from green (most efficient) to amber (highest use)
// across the leaderboard — quick visual encoding of rank.
function barColor(rank, total) {
  if (total <= 1) return '#22c55e';
  const norm = rank / (total - 1); // 0..1
  if (norm < 0.33) return '#22c55e';
  if (norm < 0.66) return '#fcd34d';
  return '#fb923c';
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatMonth(ym) {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return ym;
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

const styles = {
  championCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    padding: '18px 22px',
    background: 'linear-gradient(120deg, #052e16 0%, #14532d 100%)',
    border: '1px solid #16a34a',
    borderLeft: '4px solid #86efac',
    borderRadius: 10,
  },
  championRank: { fontSize: 32, fontWeight: 800, color: '#86efac', minWidth: 80, textAlign: 'center' },
  championName: { fontSize: 22, fontWeight: 800, color: '#dcfce7' },
  championMeta: { fontSize: 13, color: '#bbf7d0', marginTop: 4 },
  championEquiv: { fontSize: 12, color: '#86efac', marginTop: 8, fontStyle: 'italic' },

  controls: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  controlLabel: { fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7, marginRight: 4 },
  modeBtn: { padding: '6px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
  modeBtnActive: { background: '#0e3a5f', borderColor: '#22d3ee', color: '#22d3ee', fontWeight: 700 },

  list: { listStyle: 'none', padding: 0, margin: 0 },
  row: {
    display: 'grid',
    gridTemplateColumns: '50px 1fr 110px 200px 170px 130px',
    gap: 12,
    alignItems: 'center',
    padding: '10px 12px',
    borderBottom: '1px solid #1f2937',
    fontSize: 13,
  },
  rankCol: { color: '#64748b', fontWeight: 800, fontSize: 14, textAlign: 'center' },
  nameCol: { color: '#e5e7eb', fontWeight: 600, textDecoration: 'none' },
  metaCol: { color: '#94a3b8', fontSize: 12, fontVariantNumeric: 'tabular-nums' },
  barCol:  { height: 10, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 3, overflow: 'hidden' },
  barFill: { display: 'block', height: '100%', transition: 'width 200ms ease' },
  valueCol: { color: '#e5e7eb', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  valueUnit: { color: '#64748b', fontWeight: 500, fontSize: 11, marginLeft: 2 },
  trendCol: { textAlign: 'right' },

  fineprint: { fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '8px 0' },
  link: { color: '#22d3ee', textDecoration: 'none' },

  // Mobile card layout (one card per dorm, info stacks vertically)
  cardRow: { padding: '12px 12px', borderBottom: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: 8 },
  cardHead: { display: 'flex', alignItems: 'center', gap: 10 },
  cardRank: { color: '#64748b', fontWeight: 800, fontSize: 14, minWidth: 30 },
  cardName: { color: '#e5e7eb', fontWeight: 700, fontSize: 15, textDecoration: 'none', flex: 1 },
  cardTrend: { textAlign: 'right' },
  cardMeta: { color: '#94a3b8', fontSize: 12, fontVariantNumeric: 'tabular-nums' },
  cardBarWrap: { height: 8, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 3, overflow: 'hidden' },
  cardValue: { color: '#e5e7eb', fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums' },
};
