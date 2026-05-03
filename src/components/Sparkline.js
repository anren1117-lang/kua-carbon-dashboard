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
  const values = data.map((d) => (typeof d === 'number' ? d : d.value ?? 0));
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

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }} aria-hidden="true">
      <path d={areaPath} fill={fill} stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
      {showLast && last && (
        <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
      )}
    </svg>
  );
}
