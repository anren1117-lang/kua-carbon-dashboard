import React from 'react';
import { scope2MtAtVintage, FACTOR_RECONCILIATION } from '../data/gridMix.js';

// The same electricity, priced at each year's grid.
//
// This is the chart the Phase 391 research earned and never got. KUA's Year 1
// projection is a fixed number of kilowatt-hours; what they COST in carbon
// depends entirely on which year's grid you price them against. Identical
// behaviour reads as 372.6 mtCO2e at the 2019 grid and 410.5 at the 2021 grid —
// a ~10% swing, larger than most efficiency projects, with nobody at KUA doing
// anything differently.
//
// Why that matters on a school's dashboard: it separates "we used less" from
// "the grid got cleaner", which are the two things a board most often
// conflates when a number moves.
//
// PREPARED FOR MORE DATA: driven entirely by the EGRID_NEWE series, so when
// eGRID2024 publishes it gains a bar with no code change. The reporting vintage
// is highlighted rather than hardcoded.

export function GridVintageChart({ kwh, highlightVintage }) {
  const rows = scope2MtAtVintage(kwh);
  if (!rows || rows.length === 0) return null;

  const W = 920;
  const H = 160;
  const PAD_L = 40;
  const PAD_R = 12;
  const PAD_TOP = 14;
  const PAD_BOT = 34;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_TOP - PAD_BOT;
  const slot = innerW / rows.length;
  const barW = Math.max(14, Math.min(64, slot - 18));

  // Scale from zero would flatten a 10% spread into invisibility, so the axis
  // starts below the minimum — and the caption says so, because a truncated
  // axis that doesn't announce itself is a way of overstating a difference.
  const values = rows.map((r) => r.mtCO2e);
  const lo = Math.min(...values) * 0.94;
  const hi = Math.max(...values) * 1.02;
  const yFor = (v) => PAD_TOP + innerH - ((v - lo) / (hi - lo)) * innerH;

  const reporting = highlightVintage ?? FACTOR_RECONCILIATION.vintage;

  return (
    <div style={styles.wrap}>
      <div style={styles.head}>
        <span style={styles.heading}>The same electricity, priced at each year's grid</span>
        <span style={styles.sub}>
          {Math.round(kwh).toLocaleString()} kWh · {rows[0].vintage}–{rows[rows.length - 1].vintage}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={styles.svg} role="img"
           aria-label="Scope 2 emissions for a fixed electricity total, priced at each published eGRID vintage">
        <line x1={PAD_L} y1={PAD_TOP + innerH} x2={W - PAD_R} y2={PAD_TOP + innerH} stroke="#1f2937" strokeWidth="1" />

        {rows.map((r, i) => {
          const x = PAD_L + i * slot + (slot - barW) / 2;
          const y = yFor(r.mtCO2e);
          const h = PAD_TOP + innerH - y;
          const isReporting = r.vintage === reporting;
          return (
            <g key={r.vintage}>
              <rect
                x={x} y={y} width={barW} height={h}
                fill={isReporting ? '#22d3ee' : '#0e7490'}
                rx={3}
                className="kua-trend-bar"
                style={{
                  transformOrigin: `${x + barW / 2}px ${PAD_TOP + innerH}px`,
                  animationDelay: `${i * 60}ms`,
                  filter: isReporting ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.45))' : 'none',
                }}
              >
                <title>{`${r.vintage} grid: ${r.mtCO2e} mtCO₂e for the same ${Math.round(kwh).toLocaleString()} kWh (${r.kgPerKwh} kg/kWh) — ${r.source}`}</title>
              </rect>
              <text x={x + barW / 2} y={y - 5} textAnchor="middle"
                    style={{ fontSize: 11, fill: isReporting ? '#22d3ee' : '#94a3b8', fontWeight: isReporting ? 700 : 500 }}>
                {r.mtCO2e}
              </text>
              <text x={x + barW / 2} y={H - 16} textAnchor="middle"
                    style={{ fontSize: 10, fill: isReporting ? '#22d3ee' : '#64748b', fontWeight: isReporting ? 700 : 500 }}>
                {r.vintage}
              </text>
              {isReporting && (
                <text x={x + barW / 2} y={H - 4} textAnchor="middle"
                      style={{ fontSize: 9, fill: '#64748b' }}>
                  reported
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <p style={styles.caption}>
        Nobody at KUA changed anything between these bars — the electricity total is identical in
        every one. The difference is the grid: nuclear share fell and gas rose, so a kilowatt-hour
        bought more carbon in some years than others. The axis starts below the lowest bar to make
        the spread legible; it is about {spreadPct(rows)}% end to end, which is larger than most
        efficiency projects deliver.
      </p>
    </div>
  );
}

function spreadPct(rows) {
  const v = rows.map((r) => r.mtCO2e);
  const lo = Math.min(...v);
  const hi = Math.max(...v);
  return lo > 0 ? Math.round(((hi - lo) / lo) * 100) : 0;
}

const styles = {
  wrap: { marginTop: 18 },
  head: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  heading: { fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: '#94a3b8' },
  sub: { fontSize: 12, color: '#64748b' },
  svg: { width: '100%', height: 'auto', display: 'block' },
  caption: { marginTop: 8, fontSize: 12, color: '#64748b', lineHeight: 1.6 },
};
