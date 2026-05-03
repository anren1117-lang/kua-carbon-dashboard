import React from 'react';

// Tiny dep-free SVG sparkline. Pass an array of numbers; it renders a
// line + area fill scaled to the container. Width/height are inline
// styles so callers can size it to whatever metric card they're in.
//
// Why not recharts/visx: this is the only chart shape the OS dashboard
// uses today, and recharts would add ~80 KB gzipped. Keeping it inline
// is cheaper and matches the existing inline-style aesthetic of the
// rest of the codebase.

export function Sparkline({
  data,
  width = 120,
  height = 32,
  color = '#22d3ee',
  fill = 'rgba(34, 211, 238, 0.15)',
  strokeWidth = 1.5,
  showLast = false,
}) {
  if (!data || data.length === 0) return null;
  // Accept either a plain number, or an object with { value, measured }.
  // When any point carries the `measured` flag, the line is drawn in two
  // visual styles: solid for measured stretches, dashed for projected
  // stretches — matching the TimeSeriesChart per-point dot vocabulary.
  const values = data.map((d) => (typeof d === 'number' ? d : d.value ?? 0));
  const flags  = data.map((d) => (typeof d === 'object' && d !== null && 'measured' in d) ? !!d.measured : null);
  const hasFlags = flags.some((f) => f !== null);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Build the polyline path. Pad 1px so the stroke doesn't clip.
  const xStep = (width - 2) / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = 1 + i * xStep;
    const y = height - 1 - ((v - min) / range) * (height - 2);
    return [x, y];
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(2)},${height - 1} L${points[0][0].toFixed(2)},${height - 1} Z`;

  const last = points[points.length - 1];

  // When measured flags are present, split the polyline into measured and
  // projected segments so we can render each with a different stroke style.
  // Boundary points are duplicated across adjacent segments so the line
  // visually connects without a gap.
  const segments = [];
  if (hasFlags) {
    let cur = { measured: !!flags[0], pts: [points[0]] };
    for (let i = 1; i < points.length; i++) {
      const m = !!flags[i];
      if (m === cur.measured) {
        cur.pts.push(points[i]);
      } else {
        cur.pts.push(points[i]); // include boundary point in current
        segments.push(cur);
        cur = { measured: m, pts: [points[i]] };
      }
    }
    segments.push(cur);
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }} aria-hidden="true">
      <path d={areaPath} fill={fill} stroke="none" />
      {hasFlags ? (
        segments.map((seg, i) => {
          const segPath = seg.pts.map(([x, y], j) => `${j === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
          return (
            <path
              key={i}
              d={segPath}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={seg.measured ? '' : '3 2'}
              opacity={seg.measured ? 1 : 0.7}
            />
          );
        })
      ) : (
        <path d={linePath} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
      )}
      {showLast && last && (
        <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
      )}
    </svg>
  );
}
