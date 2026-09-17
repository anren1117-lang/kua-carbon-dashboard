import React from 'react';
import { useMeasuredScopeTotals } from '../hooks/useMeasuredScopeTotals.js';

// Gross → sinks → net, as a subtraction you can watch happen.
//
// "Gross 4,375, net 1,725" is two numbers a student has to hold in their head
// and relate. A waterfall makes the relationship physical: three bars stack up
// to the gross total, the forest bar drops back down, and what's left standing
// is the net. The arithmetic is the picture.
//
// The honest part is the caption, not the chart: sequestration is NOT a licence
// to emit. A forest that already exists has been absorbing carbon for decades —
// counting it as an offset against new emissions is a presentational choice the
// GHG Protocol treats separately from reductions, and a student should meet
// that caveat at the same moment they meet the subtraction.

export function NetBalanceWaterfall() {
  const live = useMeasuredScopeTotals();

  const s1 = live.scope1Mt;
  const s2 = live.scope2Mt;
  const s3 = live.scope3Mt;
  // sinkMt, not sinksMt — the hook's actual field name. The wrong one is
  // undefined, which fails the guard below and renders NOTHING: no crash, no
  // failing test, just a missing chart. Worth the comment because the singular
  // sits next to scope1Mt/scope3Mt and reads like a typo when it isn't.
  const sinks = live.sinkMt;
  if (![s1, s2, s3, sinks].every((v) => Number.isFinite(v) && v >= 0)) return null;

  // Use the hook's own gross/net rather than recomputing, so this chart can
  // never disagree with the figures the rest of the site shows.
  const gross = Number.isFinite(live.grossMt) ? live.grossMt : s1 + s2 + s3;
  if (gross <= 0) return null;
  const net = Number.isFinite(live.netMt) ? live.netMt : gross - sinks;

  // Steps: each scope stacks upward, sinks steps back down, net is the result.
  const steps = [
    { key: 's1', label: 'Scope 1', value: s1, colour: '#fbbf24', kind: 'add' },
    { key: 's2', label: 'Scope 2', value: s2, colour: '#22d3ee', kind: 'add' },
    { key: 's3', label: 'Scope 3', value: s3, colour: '#a855f7', kind: 'add' },
    { key: 'gross', label: 'Gross', value: gross, colour: '#64748b', kind: 'total' },
    { key: 'sinks', label: 'Forest', value: -sinks, colour: '#22c55e', kind: 'sub' },
    { key: 'net', label: 'Net', value: net, colour: net > 0 ? '#ef4444' : '#22c55e', kind: 'total' },
  ];

  const W = 920;
  const H = 210;
  const PAD_TOP = 18;
  const PAD_BOT = 42;
  const PAD_L = 18;
  const PAD_R = 18;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_TOP - PAD_BOT;
  const slot = innerW / steps.length;
  const barW = Math.max(28, slot - 26);

  // Scale must cover the tallest point the walk reaches (the gross) and the
  // floor (zero), so nothing is clipped.
  const peak = Math.max(gross, net, 1);
  const yFor = (v) => PAD_TOP + innerH - (v / peak) * innerH;

  let running = 0;
  const bars = steps.map((s) => {
    let bottom;
    let top;
    if (s.kind === 'total') {
      bottom = 0;
      top = s.value;
      running = s.value;
    } else if (s.kind === 'add') {
      bottom = running;
      top = running + s.value;
      running = top;
    } else {
      bottom = running + s.value; // value is negative
      top = running;
      running = bottom;
    }
    return { ...s, bottom, top };
  });

  return (
    <div style={styles.wrap}>
      <div style={styles.head}>
        <span style={styles.heading}>Gross, minus the forest, equals net</span>
        <span style={styles.sub}>mtCO₂e per year</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={styles.svg} role="img"
           aria-label="Waterfall from the three scopes through forest sequestration to the net figure">
        <line x1={PAD_L} y1={yFor(0)} x2={W - PAD_R} y2={yFor(0)} stroke="#1f2937" strokeWidth="1" />

        {bars.map((b, i) => {
          const x = PAD_L + i * slot + (slot - barW) / 2;
          const yTop = yFor(Math.max(b.top, b.bottom));
          const h = Math.max(2, Math.abs(yFor(b.bottom) - yFor(b.top)));
          const isTotal = b.kind === 'total';
          return (
            <g key={b.key}>
              {/* Connector from the previous bar's resting height */}
              {i > 0 && (
                <line
                  x1={PAD_L + (i - 1) * slot + (slot + barW) / 2}
                  y1={yFor(bars[i - 1].kind === 'sub' ? bars[i - 1].bottom : bars[i - 1].top)}
                  x2={x}
                  y2={yFor(bars[i - 1].kind === 'sub' ? bars[i - 1].bottom : bars[i - 1].top)}
                  stroke="#334155" strokeWidth="1" strokeDasharray="3 3"
                />
              )}
              <rect
                x={x} y={yTop} width={barW} height={h}
                fill={b.colour} rx={3}
                opacity={isTotal ? 0.95 : 0.85}
                className="kua-trend-bar"
                style={{ transformOrigin: `${x + barW / 2}px ${yFor(0)}px`, animationDelay: `${i * 70}ms` }}
              >
                <title>{`${b.label}: ${Math.abs(Math.round(b.value)).toLocaleString()} mtCO₂e`}</title>
              </rect>
              <text x={x + barW / 2} y={yTop - 5} textAnchor="middle" style={styles.value}>
                {b.kind === 'sub' ? '−' : ''}{Math.abs(Math.round(b.value)).toLocaleString()}
              </text>
              <text x={x + barW / 2} y={H - 22} textAnchor="middle"
                    style={{ ...styles.label, fill: isTotal ? '#e5e7eb' : '#94a3b8', fontWeight: isTotal ? 700 : 500 }}>
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>

      <p style={styles.caption}>
        The three scopes stack up to gross emissions; the campus forest steps the total back down.
        What's left is net — currently {Math.abs(Math.round(net)).toLocaleString()} mtCO₂e{net > 0 ? ' still emitted' : ' absorbed'}.
        Worth understanding before quoting the net figure: that forest has been growing for decades
        and would absorb this carbon whether or not KUA burned any oil. Subtracting it makes the
        balance look better without anything changing on the ground, which is why reductions and
        sequestration are reported separately rather than netted off in most carbon accounting.
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
  value: { fontSize: 11, fill: '#cbd5e1', fontWeight: 600 },
  label: { fontSize: 11 },
  caption: { marginTop: 8, fontSize: 12, color: '#64748b', lineHeight: 1.6 },
};
