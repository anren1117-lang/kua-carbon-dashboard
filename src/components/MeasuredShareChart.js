import React from 'react';
import { useMeasuredScopeTotals } from '../hooks/useMeasuredScopeTotals.js';

// How much of this inventory is actually measured.
//
// This is the chart that answers "be prepared for when the data are input",
// because it is the one that VISIBLY CHANGES when someone enters data. Every
// other figure on the dashboard shifts a little; this one redraws.
//
// Today roughly 9% of the gross footprint stands on meters — Scope 2's
// electricity. Scope 1 is a building-stock model, Scope 3 is cohort methods and
// spend data. A student who sees that learns something more useful than any
// total: that measuring a footprint is most of the work, and that a confident
// number is not the same as a known one.
//
// The Scope 2 caveat is stated rather than glossed: the kilowatt-hours are
// metered, but the emission factor is cited from EPA/ISO-NE, so even the
// measured slice is measured activity × published factor. Nothing here is
// measured end to end, and the chart should not imply otherwise.

export function MeasuredShareChart() {
  const live = useMeasuredScopeTotals();

  const parts = [
    { key: 'scope1', label: 'Scope 1', mt: live.scope1Mt, measured: live.scope1Measured, colour: '#fbbf24' },
    { key: 'scope2', label: 'Scope 2', mt: live.scope2Mt, measured: true, colour: '#22d3ee' },
    { key: 'scope3', label: 'Scope 3', mt: live.scope3Mt, measured: live.scope3Measured, colour: '#a855f7' },
  ].filter((p) => Number.isFinite(p.mt) && p.mt > 0);

  if (parts.length === 0) return null;

  // Prefer the hook's gross so this bar and the waterfall can't disagree.
  const gross = Number.isFinite(live.grossMt) && live.grossMt > 0
    ? live.grossMt
    : parts.reduce((s, p) => s + p.mt, 0);
  if (gross <= 0) return null;
  const measuredMt = parts.filter((p) => p.measured).reduce((s, p) => s + p.mt, 0);
  const measuredPct = Math.round((measuredMt / gross) * 100);

  const W = 920;
  const H = 74;
  const PAD = 12;
  const barY = 14;
  const barH = 30;
  const innerW = W - PAD * 2;

  let cursor = PAD;
  const segs = parts.map((p) => {
    const w = (p.mt / gross) * innerW;
    const seg = { ...p, x: cursor, w };
    cursor += w;
    return seg;
  });

  return (
    <div style={styles.wrap}>
      <div style={styles.head}>
        <span style={styles.heading}>How much of this is measured</span>
        <span style={styles.sub}>
          {measuredPct}% of {Math.round(gross).toLocaleString()} mtCO₂e rests on meters
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={styles.svg} role="img"
           aria-label="Share of the gross footprint that is measured rather than estimated">
        <defs>
          {/* Estimated slices are hatched, so "we don't really know this yet"
              is visible without reading a legend. */}
          <pattern id="estHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#1e293b" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#475569" strokeWidth="2" />
          </pattern>
        </defs>

        {segs.map((s) => (
          <g key={s.key}>
            <rect
              x={s.x} y={barY} width={Math.max(1, s.w)} height={barH}
              fill={s.measured ? s.colour : 'url(#estHatch)'}
              stroke={s.measured ? 'none' : s.colour}
              strokeWidth={s.measured ? 0 : 1.5}
              rx={2}
            >
              <title>
                {`${s.label}: ${Math.round(s.mt).toLocaleString()} mtCO₂e — ${s.measured ? 'measured activity data' : 'estimated, no measured data yet'}`}
              </title>
            </rect>
            {s.w > 64 && (
              <text x={s.x + s.w / 2} y={barY + barH + 15} textAnchor="middle"
                    style={{ ...styles.segLabel, fill: s.measured ? s.colour : '#64748b' }}>
                {s.label} {Math.round((s.mt / gross) * 100)}%
              </text>
            )}
          </g>
        ))}
      </svg>

      <p style={styles.caption}>
        Solid means the activity data is measured; hatched means it is modelled and will change when
        real invoices, fuel deliveries and travel records are entered. Even the solid slice is
        metered kilowatt-hours multiplied by a <em>published</em> emission factor — so nothing here
        is measured end to end, and this bar is a map of the work still to do rather than a score.
      </p>
    </div>
  );
}

const styles = {
  wrap: { marginTop: 18 },
  head: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  heading: { fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: '#94a3b8' },
  sub: { fontSize: 12, color: '#64748b' },
  svg: { width: '100%', height: 'auto', display: 'block' },
  segLabel: { fontSize: 11, fontWeight: 600 },
  caption: { marginTop: 8, fontSize: 12, color: '#64748b', lineHeight: 1.6 },
};
