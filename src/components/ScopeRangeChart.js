import React from 'react';
import { SCOPE1_RANGE, SCOPE3_RANGE } from '../data/geographicEstimates.js';
import { useMeasuredScopeTotals } from '../hooks/useMeasuredScopeTotals.js';

// Size versus certainty — the relationship this dashboard states in words and
// has never shown.
//
// A student reading "Scope 3: ~2,635 mt" and "Scope 2: ~410 mt" concludes that
// Scope 3 is the important one and Scope 2 is a rounding error. Both true. What
// the text hides is that the 2,635 could be anywhere from 1,727 to 3,721 —
// the UNCERTAINTY on Scope 3 alone is roughly four times the whole of Scope 2.
//
// Drawn as bars with error bands, three things land at once:
//   • Scope 3 is the biggest number.
//   • Scope 3 is also the least trustworthy number.
//   • Scope 2 is small, and it is the only one standing on meters — which is
//     why it got measured first, and why the rest is the real work ahead.
//
// That is the honest shape of a carbon inventory, and it is a better lesson
// than any single total.

export function ScopeRangeChart() {
  const live = useMeasuredScopeTotals();

  const scopes = [
    {
      key: 'scope1',
      label: 'Scope 1',
      sub: 'Heating, fleet, refrigerants',
      mt: live.scope1Mt,
      low: SCOPE1_RANGE.low,
      high: SCOPE1_RANGE.high,
      measured: live.scope1Measured,
      colour: '#fbbf24',
    },
    {
      key: 'scope2',
      label: 'Scope 2',
      sub: 'Purchased electricity',
      mt: live.scope2Mt,
      // Scope 2's band is a working +/-5%, not a multi-method spread: the kWh
      // are metered, so the uncertainty is in the emission factor, not the
      // activity data. That is exactly why it's narrow.
      low: Math.round(live.scope2Mt * 0.95),
      high: Math.round(live.scope2Mt * 1.05),
      measured: true,
      measuredCaveat: 'metered kWh × cited factor',
      colour: '#22d3ee',
    },
    {
      key: 'scope3',
      label: 'Scope 3',
      sub: 'Purchased goods, travel, dining, waste',
      mt: live.scope3Mt,
      low: SCOPE3_RANGE.low,
      high: SCOPE3_RANGE.high,
      measured: live.scope3Measured,
      colour: '#a855f7',
    },
  ].filter((s) => Number.isFinite(s.mt) && s.mt > 0);

  if (scopes.length === 0) return null;

  const W = 920;
  const ROW_H = 58;
  const H = scopes.length * ROW_H + 34;
  const PAD_L = 92;
  const PAD_R = 76;
  const innerW = W - PAD_L - PAD_R;
  const maxVal = Math.max(...scopes.map((s) => s.high), 1);
  const xFor = (v) => PAD_L + (v / maxVal) * innerW;

  return (
    <div style={styles.wrap}>
      <div style={styles.head}>
        <span style={styles.heading}>How big, and how sure</span>
        <span style={styles.sub}>Bar = best estimate · line = range across methods</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={styles.svg} role="img"
           aria-label="Each scope's estimate with its uncertainty range">
        {scopes.map((s, i) => {
          const y = i * ROW_H + 16;
          const barH = 20;
          const x0 = xFor(s.low);
          const x1 = xFor(s.high);
          const xc = xFor(s.mt);
          const spreadPct = s.mt > 0 ? Math.round(((s.high - s.low) / s.mt) * 100) : 0;
          return (
            <g key={s.key}>
              <text x={8} y={y + 13} style={styles.rowLabel}>{s.label}</text>
              <text x={8} y={y + 26} style={styles.rowSub}>
                {s.measured ? '● measured' : '○ estimated'}
              </text>

              {/* Uncertainty band, drawn BEHIND the bar so the bar reads as
                  "our best guess inside this range" rather than a fact. */}
              <line x1={x0} y1={y + barH / 2} x2={x1} y2={y + barH / 2}
                    stroke="#475569" strokeWidth="2" />
              <line x1={x0} y1={y + 2} x2={x0} y2={y + barH - 2} stroke="#475569" strokeWidth="2" />
              <line x1={x1} y1={y + 2} x2={x1} y2={y + barH - 2} stroke="#475569" strokeWidth="2" />

              <rect x={PAD_L} y={y} width={Math.max(2, xc - PAD_L)} height={barH}
                    fill={s.colour} rx={3} opacity={s.measured ? 1 : 0.75}
                    className="kua-bar-grow"
                    style={{ '--kua-bar-target': '100%', animationDelay: `${i * 90}ms` }}>
                <title>
                  {`${s.label}: ${Math.round(s.mt).toLocaleString()} mtCO₂e (range ${s.low.toLocaleString()}–${s.high.toLocaleString()}). ${s.measured ? (s.measuredCaveat || 'Measured.') : 'Estimated — no measured data yet.'}`}
                </title>
              </rect>

              <text x={W - PAD_R + 8} y={y + 14} style={styles.value}>
                {Math.round(s.mt).toLocaleString()}
              </text>
              <text x={W - PAD_R + 8} y={y + 27} style={styles.spread}>
                ±{spreadPct}%
              </text>
              <text x={PAD_L + 4} y={y + barH + 13} style={styles.rowDesc}>{s.sub}</text>
            </g>
          );
        })}
      </svg>

      <p style={styles.caption}>
        The longest bar is not the best-known one. Scope 3's range alone —{' '}
        {(SCOPE3_RANGE.high - SCOPE3_RANGE.low).toLocaleString()} mtCO₂e of uncertainty — is several
        times the entire Scope 2 figure. Scope 2 is narrow because the kilowatt-hours are metered;
        the others rest on building models, cohort methods and spend data until real invoices arrive.
        Reducing the uncertainty is as much of a job as reducing the emissions.
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
  rowLabel: { fontSize: 13, fill: '#e5e7eb', fontWeight: 700 },
  rowSub: { fontSize: 10, fill: '#64748b' },
  rowDesc: { fontSize: 10, fill: '#64748b' },
  value: { fontSize: 13, fill: '#e5e7eb', fontWeight: 700 },
  spread: { fontSize: 10, fill: '#64748b' },
  caption: { marginTop: 8, fontSize: 12, color: '#64748b', lineHeight: 1.6 },
};
