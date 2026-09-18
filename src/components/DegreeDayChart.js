import React from 'react';
import { monthlyComparison, compareToNormal, STATION, HDD_ACTUAL } from '../data/degreeDays.js';

// Heating degree days, measured against the 1991-2020 normal.
//
// Phase 393 put this data in the codebase and surfaced it as a SENTENCE
// ("9.1% milder than normal"). A sentence can't show that the mildness is
// concentrated in March, April and August while January and February came in
// close to normal — which is the part that matters when someone asks whether a
// fall in consumption was effort or weather.
//
// PREPARED FOR MORE DATA, which is the point:
//   • Draws whatever months exist. Four months or twelve, same component.
//   • PARTIAL months (September 2026 held 15 of 30 days when captured) are
//     drawn hatched and carry no percentage — the same whole-month rule as
//     buildingMonths.js. They are visible but not counted.
//   • Returns null rather than an empty frame when there is nothing to show.

const MONTH_LABELS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Newest year we actually hold actuals for. Derived from HDD_ACTUAL rather
// than kept as a second constant, so a 2027 row needs no edit here.
const LATEST_HDD_YEAR = Math.max(...Object.keys(HDD_ACTUAL).map(Number));

// year defaults to that. Phase 423: Scope1.js mounted this with no prop, so
// monthlyComparison(undefined) returned [] and the component rendered NOTHING
// for twenty phases — the page's only chart, invisible, while every test
// passed because they all pass year explicitly.
export function DegreeDayChart({ year = LATEST_HDD_YEAR }) {
  const rows = monthlyComparison(year);
  if (!rows || rows.length === 0) return null;
  const summary = compareToNormal(year);

  const W = 920;
  const H = 150;
  const PAD_L = 34;
  const PAD_R = 10;
  const PAD_TOP = 10;
  const PAD_BOT = 30;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_TOP - PAD_BOT;
  const slot = innerW / rows.length;
  const barW = Math.max(6, (slot - 10) / 2);

  const maxHdd = Math.max(...rows.map((r) => Math.max(r.actual, r.normal)), 1);
  const yFor = (v) => PAD_TOP + innerH - (v / maxHdd) * innerH;

  return (
    <div style={styles.wrap}>
      <div style={styles.head}>
        <span style={styles.heading}>Heating degree days vs normal</span>
        <span style={styles.sub}>
          {summary && summary.pctVsNormal !== null
            ? `${Math.abs(summary.pctVsNormal).toFixed(1)}% ${summary.pctVsNormal < 0 ? 'milder' : 'colder'} across ${summary.monthsCompared} whole months`
            : 'No whole months to compare yet'}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={styles.svg} role="img"
           aria-label={`Monthly heating degree days for ${year} against the 1991-2020 normal`}>
        <defs>
          {/* Partial months get a hatch, so "incomplete" is visible at a glance
              rather than hidden behind a shorter bar that reads as "mild". */}
          <pattern id="hddPartial" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
            <rect width="4" height="4" fill="#0f172a" />
            <line x1="0" y1="0" x2="0" y2="4" stroke="#475569" strokeWidth="1.5" />
          </pattern>
        </defs>

        {/* Baseline */}
        <line x1={PAD_L} y1={PAD_TOP + innerH} x2={W - PAD_R} y2={PAD_TOP + innerH} stroke="#1f2937" strokeWidth="1" />

        {rows.map((r, i) => {
          const xBase = PAD_L + i * slot + (slot - barW * 2 - 3) / 2;
          const aH = (r.actual / maxHdd) * innerH;
          const nH = (r.normal / maxHdd) * innerH;
          const colder = r.pctVsNormal !== null && r.pctVsNormal > 0;
          return (
            <g key={r.month}>
              {/* Normal — the reference, always muted */}
              <rect
                x={xBase} y={yFor(r.normal)} width={barW} height={nH}
                fill="#334155" rx={2}
                className="kua-trend-bar"
                style={{ transformOrigin: `${xBase + barW / 2}px ${PAD_TOP + innerH}px`, animationDelay: `${i * 40}ms` }}
              >
                <title>{`${MONTH_LABELS[r.month]} normal: ${Math.round(r.normal)} HDD (1991–2020)`}</title>
              </rect>
              {/* Actual — coloured by direction, hatched when incomplete */}
              <rect
                x={xBase + barW + 3} y={yFor(r.actual)} width={barW} height={aH}
                fill={r.partial ? 'url(#hddPartial)' : colder ? '#fbbf24' : '#22d3ee'}
                stroke={r.partial ? '#475569' : 'none'}
                strokeWidth={r.partial ? 1 : 0}
                rx={2}
                className="kua-trend-bar"
                style={{ transformOrigin: `${xBase + barW * 1.5}px ${PAD_TOP + innerH}px`, animationDelay: `${i * 40 + 20}ms` }}
              >
                <title>
                  {r.partial
                    ? `${MONTH_LABELS[r.month]} ${year}: ${Math.round(r.actual)} HDD so far — month incomplete, excluded from the comparison`
                    : `${MONTH_LABELS[r.month]} ${year}: ${Math.round(r.actual)} HDD vs ${Math.round(r.normal)} normal (${r.pctVsNormal > 0 ? '+' : ''}${r.pctVsNormal}%)`}
                </title>
              </rect>
              <text x={xBase + barW + 1.5} y={H - 14} textAnchor="middle"
                    style={{ fontSize: 10, fill: r.partial ? '#475569' : '#64748b', fontWeight: 500 }}>
                {MONTH_LABELS[r.month]}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={styles.legend}>
        <LegendSwatch color="#334155" /> <span style={styles.legendText}>1991–2020 normal</span>
        <LegendSwatch color="#22d3ee" /> <span style={styles.legendText}>milder than normal</span>
        <LegendSwatch color="#fbbf24" /> <span style={styles.legendText}>colder than normal</span>
        <LegendSwatch color="#0f172a" border="#475569" /> <span style={styles.legendText}>month incomplete — not counted</span>
      </div>
      <p style={styles.caption}>
        Base 65°F at {STATION.name}, {STATION.milesFromCampus} miles from campus. Weather is not
        performance: a mild winter lowers consumption without anyone doing anything, and this is
        how much of the year's movement was the weather's doing.
      </p>
    </div>
  );
}

function LegendSwatch({ color, border }) {
  return <span style={{ ...styles.swatch, background: color, border: border ? `1px solid ${border}` : 'none' }} />;
}

const styles = {
  wrap: { marginTop: 18 },
  head: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  heading: { fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: '#94a3b8' },
  sub: { fontSize: 12, color: '#64748b' },
  svg: { width: '100%', height: 'auto', display: 'block' },
  legend: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 8, fontSize: 11 },
  legendText: { color: '#94a3b8', marginRight: 10 },
  swatch: { display: 'inline-block', width: 10, height: 10, borderRadius: 2 },
  caption: { marginTop: 8, fontSize: 12, color: '#64748b', lineHeight: 1.6 },
};
