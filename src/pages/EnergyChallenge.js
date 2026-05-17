import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';
import { buildingMonthlyHistory } from '../data/monthlyConsumption.js';

// /challenge — frames the existing dorm leaderboard as a monthly
// competition. Useful for proctors / residential life running an
// energy challenge: "Welch House cut kWh/resident 18% from January
// to February — they're this month's champion."
//
// The page is opinionated about month-over-month rather than annual:
// the latter doesn't move week to week, but the former is a real
// scoreboard the dorms can race on.

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatMonth(ym) {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  if (!Number.isFinite(m) || m < 1 || m > 12) return ym;
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

export default function EnergyChallenge() {
  const { rows } = useMemo(() => computeBuildingEmissions(), []);
  const history = useMemo(() => buildingMonthlyHistory(), []);

  const dormRows = rows.filter((r) => r.category === 'Dorm' && r.occupants > 0);
  const monthsAvailable = useMemo(() => {
    const all = new Set();
    for (const bucket of Object.values(history)) {
      for (const m of Object.keys(bucket || {})) all.add(m);
    }
    return [...all].sort();
  }, [history]);

  const latestMonth   = monthsAvailable[monthsAvailable.length - 1] || null;
  const previousMonth = monthsAvailable[monthsAvailable.length - 2] || null;

  const [focusMonth, setFocusMonth] = useState(latestMonth);
  const compareToMonth = useMemo(() => {
    const idx = monthsAvailable.indexOf(focusMonth);
    return idx > 0 ? monthsAvailable[idx - 1] : null;
  }, [focusMonth, monthsAvailable]);

  // Build the standings for the focused month, with delta vs the
  // previous month. The "improvement champion" is the dorm with the
  // biggest negative pct change — i.e. the biggest reduction.
  const standings = useMemo(() => {
    if (!focusMonth) return [];
    return dormRows.map((d) => {
      const thisKwh = history[d.id]?.[focusMonth] || 0;
      const prevKwh = compareToMonth ? (history[d.id]?.[compareToMonth] || 0) : 0;
      const thisPer = d.occupants > 0 ? thisKwh / d.occupants : 0;
      const prevPer = d.occupants > 0 ? prevKwh / d.occupants : 0;
      const pctChange = prevPer > 0 ? ((thisPer - prevPer) / prevPer) * 100 : null;
      return {
        ...d,
        thisKwh,
        prevKwh,
        thisPer: Math.round(thisPer),
        prevPer: Math.round(prevPer),
        pctChange,
      };
    });
  }, [dormRows, history, focusMonth, compareToMonth]);

  // Two scoreboards: efficiency (lowest per-resident this month) +
  // improvement (biggest reduction vs last month).
  const byEfficiency = useMemo(() => [...standings].sort((a, b) => a.thisPer - b.thisPer), [standings]);
  const byImprovement = useMemo(() => {
    return [...standings]
      .filter((s) => s.pctChange !== null)
      .sort((a, b) => a.pctChange - b.pctChange); // most negative first
  }, [standings]);

  const efficiencyChampion = byEfficiency[0] || null;
  const improvementChampion = byImprovement[0] || null;
  const improvementChampionImproved = improvementChampion && improvementChampion.pctChange < 0;

  if (!latestMonth) {
    return (
      <ModulePage title="Dorm energy challenge" subtitle="No monthly data captured yet.">
        <ModuleSection title="Waiting for the first month">
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            The dorm challenge tracks month-over-month per-resident kWh changes. As soon
            as the BMS captures its first full month, this page lights up with standings.
            In the meantime, see the annualized rankings on the
            {' '}<Link to="/dorm-leaderboard" style={{ color: '#22d3ee' }}>main dorm leaderboard</Link>.
          </p>
        </ModuleSection>
      </ModulePage>
    );
  }

  return (
    <ModulePage
      title="🏆 Dorm energy challenge"
      subtitle={`A monthly competition between KUA's ${dormRows.length} student dorms. Two scoreboards: who uses the least electricity per resident this month, and who cut their usage the most vs last month.`}
    >
      {/* Month picker */}
      <ModuleSection title="This month's standings" hint="Pick a month to see its scoreboard. The previous month is used for the improvement comparison.">
        <div style={styles.monthPicker}>
          <span style={styles.monthPickerLabel}>Month:</span>
          {monthsAvailable.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setFocusMonth(m)}
              style={{ ...styles.monthBtn, ...(focusMonth === m ? styles.monthBtnActive : {}) }}
            >
              {formatMonth(m)}
            </button>
          ))}
        </div>
      </ModuleSection>

      {/* Champion cards — two side by side */}
      <ModuleSection title={`${formatMonth(focusMonth)} champions`} hint="">
        <div style={styles.championGrid}>
          {efficiencyChampion && (
            <ChampionCard
              kind="efficiency"
              title="Most efficient this month"
              dorm={efficiencyChampion}
              metric={`${efficiencyChampion.thisPer.toLocaleString()} kWh / resident`}
              subline={`out of ${dormRows.length} dorms tracked`}
            />
          )}
          {compareToMonth && improvementChampion && improvementChampionImproved ? (
            <ChampionCard
              kind="improvement"
              title="Biggest improvement"
              dorm={improvementChampion}
              metric={`${improvementChampion.pctChange.toFixed(0)}% reduction`}
              subline={`${improvementChampion.prevPer} → ${improvementChampion.thisPer} kWh/resident vs ${formatMonth(compareToMonth)}`}
            />
          ) : compareToMonth ? (
            <div style={{ ...styles.championCard, background: '#0b1220' }}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: 700 }}>
                Biggest improvement
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 1.5 }}>
                No dorm reduced per-resident usage from {formatMonth(compareToMonth)} to {formatMonth(focusMonth)} yet — the
                challenge is up for grabs.
              </div>
            </div>
          ) : null}
        </div>
      </ModuleSection>

      {/* Full standings table */}
      <ModuleSection
        title={`Full standings — ${formatMonth(focusMonth)}`}
        hint="Click a dorm to see its full monthly trend + operating profile."
      >
        <ol style={styles.list}>
          {byEfficiency.map((d, i) => {
            const trend = d.pctChange;
            const rankColor = i === 0 ? '#86efac' : i === 1 ? '#fcd34d' : i === 2 ? '#fdba74' : '#475569';
            return (
              <li key={d.id} style={styles.row}>
                <span style={{ ...styles.rank, color: rankColor }}>
                  {i < 3 ? ['🥇','🥈','🥉'][i] : `#${i + 1}`}
                </span>
                <Link to={`/buildings/${d.id}`} style={styles.name}>{d.name}</Link>
                <span style={styles.metaCol}>{d.occupants} residents</span>
                <span style={styles.value}>
                  <strong>{d.thisPer.toLocaleString()}</strong>{' '}
                  <span style={styles.unit}>kWh/resident</span>
                </span>
                <span style={styles.trend}>
                  {trend === null ? '—' :
                    Math.abs(trend) < 3 ? <Pill kind="neutral">flat</Pill> :
                    trend < 0 ? <Pill kind="good">↓ {Math.abs(trend).toFixed(0)}%</Pill> :
                    <Pill kind="warn">↑ {trend.toFixed(0)}%</Pill>
                  }
                </span>
              </li>
            );
          })}
        </ol>
      </ModuleSection>

      <ModuleSection title="How to run this as an RA challenge" hint="">
        <ul style={styles.tips}>
          <li>Announce the standings at house meeting on the 1st of each month.</li>
          <li>Reward the efficiency champion AND the improvement champion separately — a small dorm with low absolute use shouldn't lock out a big dorm that's actually cutting.</li>
          <li>Track week-over-week informally between updates so dorms see progress before the official scoreboard ships.</li>
          <li>The per-resident metric is the only fair comparison — a 48-person dorm shouldn't be congratulated for using less than a 14-person dorm.</li>
        </ul>
      </ModuleSection>
    </ModulePage>
  );
}

function ChampionCard({ kind, title, dorm, metric, subline }) {
  const gradients = {
    efficiency:  'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
    improvement: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
  };
  const accents = {
    efficiency:  '#86efac',
    improvement: '#7dd3fc',
  };
  return (
    <div style={{ ...styles.championCard, background: gradients[kind], borderLeftColor: accents[kind] }}>
      <div style={styles.championTitle}>{title}</div>
      <Link to={`/buildings/${dorm.id}`} style={{ ...styles.championName, color: accents[kind] }}>
        {dorm.name}
      </Link>
      <div style={styles.championMetric}>{metric}</div>
      <div style={styles.championSubline}>{subline}</div>
    </div>
  );
}

const styles = {
  monthPicker:      { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  monthPickerLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: 700, marginRight: 4 },
  monthBtn:         { padding: '6px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
  monthBtnActive:   { background: '#0e3a5f', borderColor: '#22d3ee', color: '#22d3ee', fontWeight: 700 },

  championGrid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 },
  championCard:     { padding: '18px 22px', border: '1px solid #1f2937', borderLeft: '4px solid', borderRadius: 10 },
  championTitle:    { fontSize: 11, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 10 },
  championName:     { fontSize: 22, fontWeight: 800, textDecoration: 'none', display: 'block', marginBottom: 8 },
  championMetric:   { fontSize: 26, fontWeight: 800, color: '#e5e7eb', fontVariantNumeric: 'tabular-nums', marginBottom: 6 },
  championSubline:  { fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 },

  list:    { listStyle: 'none', padding: 0, margin: 0 },
  row:     { display: 'grid', gridTemplateColumns: '50px 1fr 110px 180px 110px', gap: 12, alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #1f2937', fontSize: 13 },
  rank:    { fontWeight: 800, fontSize: 16, textAlign: 'center' },
  name:    { color: '#e5e7eb', fontWeight: 600, textDecoration: 'none' },
  metaCol: { color: '#94a3b8', fontSize: 12, fontVariantNumeric: 'tabular-nums' },
  value:   { color: '#e5e7eb', fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  unit:    { color: '#64748b', fontWeight: 400, fontSize: 11 },
  trend:   { textAlign: 'right' },

  tips: { paddingLeft: 20, fontSize: 13, color: '#cbd5e1', lineHeight: 1.8, margin: '8px 0' },
};
