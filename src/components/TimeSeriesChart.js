import React, { useState, useMemo } from 'react';

// Dep-free SVG line chart with axes, grid, and hover-tooltip. Sibling
// to the Sparkline component — that one is for inline at-a-glance use,
// this one for the Trend Builder page where the user wants to read
// values off the chart.

/**
 * @param {object} props
 * @param {Array<{ t: string|number|Date, v: number }>} props.data
 * @param {number=} props.width
 * @param {number=} props.height
 * @param {string=} props.color
 * @param {string=} props.fill
 * @param {string=} props.unit
 * @param {string=} props.title
 * @param {boolean=} props.showGrid
 */
export function TimeSeriesChart({
  data,
  width = 720,
  height = 240,
  color = '#22d3ee',
  fill = 'rgba(34, 211, 238, 0.15)',
  unit = '',
  title,
  showGrid = true,
}) {
  const [hover, setHover] = useState(null);

  const padding = { top: 16, right: 16, bottom: 28, left: 56 };

  const { values, times, min, max, points, xStep, plotWidth, plotHeight } = useMemo(() => {
    if (!data || data.length === 0) {
      return { values: [], times: [], min: 0, max: 1, points: [], xStep: 0, plotWidth: 0, plotHeight: 0 };
    }
    const values = data.map((d) => d.v);
    const times = data.map((d) => (d.t instanceof Date ? d.t.getTime() : new Date(d.t).getTime()));
    const min = Math.min(...values, 0);
    const max = Math.max(...values, min + 1);
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const xStep = data.length > 1 ? plotWidth / (data.length - 1) : 0;
    const points = data.map((d, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + plotHeight - ((d.v - min) / (max - min)) * plotHeight;
      return [x, y];
    });
    return { values, times, min, max, points, xStep, plotWidth, plotHeight };
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyText}>No data in window</div>
      </div>
    );
  }

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(2)},${padding.top + plotHeight} L${points[0][0].toFixed(2)},${padding.top + plotHeight} Z`;

  const yTicks = niceTicks(min, max, 4);
  const xTickIndices = pickXTickIndices(data.length);

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < padding.left || x > padding.left + plotWidth) {
      setHover(null);
      return;
    }
    const idx = Math.round((x - padding.left) / xStep);
    if (idx >= 0 && idx < data.length) {
      setHover({ idx, x: points[idx][0], y: points[idx][1] });
    }
  }

  return (
    <div style={styles.wrap}>
      {title && <div style={styles.title}>{title}</div>}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        role="img"
        aria-label={title ? `Time series chart: ${title}` : 'Time series chart'}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {/* Axes */}
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="#1f2937" />
        <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="#1f2937" />

        {/* Y-axis grid + tick labels */}
        {yTicks.map((t, i) => {
          const y = padding.top + plotHeight - ((t - min) / (max - min)) * plotHeight;
          return (
            <g key={i}>
              {showGrid && (
                <line x1={padding.left} y1={y} x2={padding.left + plotWidth} y2={y} stroke="#1f2937" strokeDasharray="2 4" />
              )}
              <text x={padding.left - 8} y={y} fill="#64748b" fontSize="10" textAnchor="end" dominantBaseline="middle">
                {formatNum(t)}
              </text>
            </g>
          );
        })}

        {/* X-axis tick labels */}
        {xTickIndices.map((i) => (
          <text key={i} x={points[i][0]} y={padding.top + plotHeight + 16} fill="#64748b" fontSize="10" textAnchor="middle">
            {formatTime(times[i])}
          </text>
        ))}

        {/* Area + line */}
        <path d={areaPath} fill={fill} stroke="none" />
        <path d={linePath} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />

        {/* Per-point provenance dots: solid = measured, hollow = projected.
            Only renders when at least one data point carries the measured
            flag — otherwise stays out of the way. */}
        {data.some((d) => d.measured !== undefined) && points.map(([x, y], i) => {
          const isMeasured = !!data[i].measured;
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={isMeasured ? 3.5 : 3}
              fill={isMeasured ? color : '#0b1220'}
              stroke={color}
              strokeWidth={isMeasured ? 0 : 1.5}
              strokeDasharray={isMeasured ? '' : '2 1.5'}
            >
              <title>{isMeasured ? 'Measured (BMS)' : 'Projected (seasonal pattern)'}</title>
            </circle>
          );
        })}

        {/* Hover marker */}
        {hover && (
          <g>
            <line x1={hover.x} y1={padding.top} x2={hover.x} y2={padding.top + plotHeight} stroke="#334155" strokeDasharray="2 3" />
            <circle cx={hover.x} cy={hover.y} r={4} fill={color} stroke="#0b1220" strokeWidth={2} />
            <g>
              <rect
                x={Math.min(hover.x + 8, width - 160)}
                y={Math.max(padding.top, hover.y - 48)}
                width={150}
                height={data[hover.idx].measured !== undefined ? 46 : 32}
                rx={4}
                fill="#0b1220"
                stroke="#1f2937"
              />
              <text
                x={Math.min(hover.x + 14, width - 154)}
                y={Math.max(padding.top + 12, hover.y - 34)}
                fill="#cbd5e1"
                fontSize="11"
              >
                {formatTime(times[hover.idx], true)}
              </text>
              <text
                x={Math.min(hover.x + 14, width - 154)}
                y={Math.max(padding.top + 26, hover.y - 20)}
                fill={color}
                fontSize="12"
                fontWeight="700"
              >
                {formatNum(values[hover.idx])} {unit}
              </text>
              {data[hover.idx].measured !== undefined && (
                <text
                  x={Math.min(hover.x + 14, width - 154)}
                  y={Math.max(padding.top + 38, hover.y - 6)}
                  fill={data[hover.idx].measured ? '#86efac' : '#fbbf24'}
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="0.5"
                >
                  {data[hover.idx].measured ? '● MEASURED (BMS)' : '○ PROJECTED'}
                </text>
              )}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}

function niceTicks(min, max, count) {
  const range = max - min || 1;
  const step = roundNice(range / count);
  const start = Math.floor(min / step) * step;
  const out = [];
  for (let v = start; v <= max + 1e-9; v += step) {
    if (v >= min - 1e-9) out.push(Number(v.toFixed(6)));
    if (out.length > count + 2) break;
  }
  return out;
}

function roundNice(x) {
  if (x === 0) return 1;
  const exp = Math.floor(Math.log10(x));
  const f = x / Math.pow(10, exp);
  let nice;
  if (f < 1.5) nice = 1;
  else if (f < 3) nice = 2;
  else if (f < 7) nice = 5;
  else nice = 10;
  return nice * Math.pow(10, exp);
}

function pickXTickIndices(len) {
  if (len <= 6) return Array.from({ length: len }, (_, i) => i);
  const count = 6;
  const step = (len - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(i * step));
}

function formatNum(n) {
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (Math.abs(n) >= 10)   return n.toFixed(1);
  return n.toFixed(2);
}

function formatTime(ms, withDate = false) {
  const d = new Date(ms);
  const hr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  if (!withDate) return hr;
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${date} ${hr}`;
}

const styles = {
  wrap: { background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, padding: 12, position: 'relative' },
  title: { fontSize: 13, color: '#94a3b8', fontWeight: 600, marginBottom: 8 },
  empty: { padding: 32, textAlign: 'center', background: '#0f172a', border: '1px dashed #334155', borderRadius: 10 },
  emptyText: { color: '#64748b', fontSize: 13 },
};
