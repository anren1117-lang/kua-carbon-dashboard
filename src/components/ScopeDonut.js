import React, { useState } from 'react';
import { SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT, GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { useIsNarrow } from '../hooks/useViewport.js';
import { useAnimatedNumber } from './AnimatedNumber.js';

// Same color palette as PeerComparison so the two charts read as one story.
// Values flow through the centralized scopeTotals chain so the donut
// stays in sync with every other place on the dashboard.
const segments = [
  { key: 'scope1',  label: 'Scope 1 — direct',         value: Math.round(SCOPE1_TOTAL_MT),       color: '#ef4444' },
  { key: 'scope2',  label: 'Scope 2 — electricity',    value: Math.round(SCOPE2_TOTAL_MT),       color: '#f59e0b' },
  { key: 'scope3',  label: 'Scope 3 — indirect',       value: Math.round(SCOPE3_TOTAL_MT),       color: '#8b5cf6' },
];
const sinkValue = Math.round(ANNUAL_SEQUESTRATION_MT); // pulled out by the campus forest
const grossTotal = Math.round(GROSS_MT);
const netTotal = grossTotal - sinkValue;

// SVG arc helper for a donut segment.
function arcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const polar = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x1, y1] = polar(rOuter, startAngle);
  const [x2, y2] = polar(rOuter, endAngle);
  const [x3, y3] = polar(rInner, endAngle);
  const [x4, y4] = polar(rInner, startAngle);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`;
}

const styles = {
  wrap: { maxWidth: 1100, margin: '24px auto 0', padding: '0 16px' },
  card: { padding: '24px 28px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 14 },
  title: { fontSize: 22, fontWeight: 700, color: '#e5e7eb', margin: 0 },
  blurb: { fontSize: 14, color: '#94a3b8', maxWidth: 720, marginTop: 6 },
  body: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, alignItems: 'center', marginTop: 20 },
  bodyMobile: { display: 'grid', gridTemplateColumns: '1fr', gap: 20 },
  centerText: { fontSize: 12, fill: '#94a3b8' },
  centerBig:  { fontSize: 28, fill: '#e5e7eb', fontWeight: 700 },
  centerUnit: { fontSize: 11, fill: '#64748b' },
  legendList: { display: 'grid', gap: 8 },
  legendRow: { display: 'grid', gridTemplateColumns: '14px 1fr 100px', alignItems: 'center', gap: 10, fontSize: 13, color: '#cbd5e1' },
  swatch: (color) => ({ width: 14, height: 14, borderRadius: 3, background: color }),
  value: { textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#e5e7eb' },
  netRow: { borderTop: '1px solid #1f2937', marginTop: 10, paddingTop: 10, display: 'grid', gridTemplateColumns: '14px 1fr 100px', alignItems: 'center', gap: 10, fontSize: 13, color: '#fbbf24', fontWeight: 600 },
  sinkRow: { display: 'grid', gridTemplateColumns: '14px 1fr 100px', alignItems: 'center', gap: 10, fontSize: 13, color: '#86efac' },
};

export function ScopeDonut() {
  const narrow = useIsNarrow();
  const [hover, setHover] = useState(null);

  // Build arc segments
  const cx = 130, cy = 130, rO = 110, rI = 70;
  let acc = -Math.PI / 2;
  const arcs = segments.map((s) => {
    const angle = (s.value / grossTotal) * 2 * Math.PI;
    const start = acc;
    const end = acc + angle;
    acc = end;
    return { ...s, d: arcPath(cx, cy, rO, rI, start, end), pct: (s.value / grossTotal) * 100 };
  });

  const hoveredArc = hover ? arcs.find((a) => a.key === hover) : null;
  const centerLabel = hoveredArc ? hoveredArc.label.toUpperCase() : 'GROSS / YR';
  const centerValue = hoveredArc ? hoveredArc.value : grossTotal;
  const centerSub   = hoveredArc ? `${hoveredArc.pct.toFixed(0)}% of gross` : 'mtCO₂e';
  // Tween the center number whenever it changes (hover swap +
  // initial mount). 350ms is fast enough to feel responsive to
  // hover but slow enough to register as motion.
  const displayValue = useAnimatedNumber(centerValue, hoveredArc ? 350 : 900);

  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <h2 style={styles.title}>KUA emissions by scope</h2>
        <p style={styles.blurb}>
          Where the ~{grossTotal.toLocaleString()} mtCO₂e of gross annual emissions actually come
          from. The forest pulls roughly {sinkValue.toLocaleString()} mtCO₂e back out, so the net is
          ~{netTotal.toLocaleString()}. Hover any arc to focus on a single scope.
        </p>

        <div style={narrow ? styles.bodyMobile : styles.body}>
          <svg viewBox="0 0 260 260" style={{ width: '100%', maxWidth: 260, height: 'auto' }}>
            {arcs.map((a, i) => {
              const dim = hover && hover !== a.key;
              return (
                <path
                  key={a.key}
                  d={a.d}
                  fill={a.color}
                  opacity={dim ? 0.28 : 1}
                  className="kua-donut-segment"
                  // Stagger: each segment fades+scales in 180ms after
                  // the previous one (~600ms total reveal for 3 arcs).
                  style={{ cursor: 'pointer', transition: 'opacity 120ms', animationDelay: `${i * 180}ms` }}
                  onMouseEnter={() => setHover(a.key)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(a.key)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${a.label}: ${a.value.toLocaleString()} mtCO₂e (${a.pct.toFixed(0)}%)`}
                />
              );
            })}
            {/* Soft glow ring behind the center text when a segment
                is hovered — colored to match the hovered segment so
                hover feedback feels integrated. */}
            {hoveredArc && (
              <circle
                cx={cx} cy={cy} r={rI - 6}
                fill="none"
                stroke={hoveredArc.color}
                strokeWidth={2}
                opacity={0.4}
                style={{ filter: `drop-shadow(0 0 8px ${hoveredArc.color})`, transition: 'stroke 200ms ease, opacity 200ms ease' }}
              />
            )}
            <text x={cx} y={cy - 14} textAnchor="middle" style={styles.centerText}>{centerLabel}</text>
            <text
              x={cx}
              y={cy + 12}
              textAnchor="middle"
              style={{
                ...styles.centerBig,
                fill: hoveredArc ? hoveredArc.color : '#e5e7eb',
                transition: 'fill 200ms ease',
              }}
            >
              {Math.round(displayValue).toLocaleString()}
            </text>
            <text x={cx} y={cy + 30} textAnchor="middle" style={styles.centerUnit}>{centerSub}</text>
          </svg>

          <div style={styles.legendList}>
            {arcs.map((a) => {
              const isHover = hover === a.key;
              return (
                <div
                  key={a.key}
                  style={{ ...styles.legendRow, opacity: hover && !isHover ? 0.45 : 1, transition: 'opacity 120ms' }}
                  onMouseEnter={() => setHover(a.key)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div style={styles.swatch(a.color)} />
                  <div>{a.label} <span style={{ color: '#64748b' }}>· {a.pct.toFixed(0)}%</span></div>
                  <div style={styles.value}>{a.value.toLocaleString()}</div>
                </div>
              );
            })}
            <div style={styles.sinkRow}>
              <div style={styles.swatch('#22c55e')} />
              <div>On-campus sequestration</div>
              <div style={styles.value}>−{sinkValue.toLocaleString()}</div>
            </div>
            <div style={styles.netRow}>
              <div />
              <div>Net</div>
              <div style={styles.value}>{netTotal.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
