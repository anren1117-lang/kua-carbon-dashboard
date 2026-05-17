import React from 'react';

// Tiny SVG bar chart of campus-wide monthly emissions, used as a
// navigation strip above the campus map. Each bar = one month of
// measured BMS data; the selected month (or null for "all") is
// highlighted; clicking a bar fires onSelect(month) so the parent
// can drive its own state. Pure presentational + click handler.

const ISO_NE_KG_PER_KWH = 0.235;

/**
 * @param {object} props
 * @param {Array<{ month: string, displayedTotal: number, sumOfRows: number }>} props.monthlyTotals
 * @param {string|null} props.selectedMonth   'YYYY-MM' or null for "all".
 * @param {(month: string|null) => void} props.onSelect
 */
export function CampusMonthlyTrend({ monthlyTotals, selectedMonth, onSelect }) {
  if (!Array.isArray(monthlyTotals) || monthlyTotals.length === 0) return null;

  // Use displayedTotal (the BMS master-meter line) so the bar height
  // matches what the school's own monthly statement shows.
  const months = monthlyTotals
    .filter((m) => m && m.month && typeof m.displayedTotal === 'number')
    .sort((a, b) => a.month.localeCompare(b.month));
  if (months.length === 0) return null;

  const maxKwh = Math.max(...months.map((m) => m.displayedTotal), 1);
  const W = 920;
  const H = 88;
  const PAD_L = 10;
  const PAD_R = 10;
  const PAD_TOP = 8;
  const PAD_BOT = 22;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_TOP - PAD_BOT;
  const slot = innerW / months.length;
  const barW = Math.max(8, slot - 6);

  return (
    <div style={styles.wrap}>
      <div style={styles.head}>
        <span style={styles.heading}>Campus electricity, month by month</span>
        <span style={styles.sub}>
          {selectedMonth ? `Highlighting ${formatMonthLabel(selectedMonth)}` : 'Showing all months · click a bar to focus one'}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={styles.svg} role="img" aria-label="Monthly campus electricity">
        {months.map((m, i) => {
          const x = PAD_L + i * slot + (slot - barW) / 2;
          const h = (m.displayedTotal / maxKwh) * innerH;
          const y = PAD_TOP + (innerH - h);
          const isSelected = selectedMonth === m.month;
          const fill = isSelected ? '#22d3ee' : '#0e7490';
          const mt = Math.round(m.displayedTotal * ISO_NE_KG_PER_KWH / 1000);
          return (
            <g key={m.month}>
              <rect
                x={x} y={y} width={barW} height={h}
                fill={fill}
                rx={2}
                style={{ cursor: 'pointer', transition: 'fill 120ms' }}
                onClick={() => onSelect(isSelected ? null : m.month)}
              >
                <title>{`${formatMonthLabel(m.month)}: ${m.displayedTotal.toLocaleString()} kWh · ~${mt} mt`}</title>
              </rect>
              <text
                x={x + barW / 2}
                y={H - 6}
                textAnchor="middle"
                style={{ fontSize: 10, fill: isSelected ? '#22d3ee' : '#64748b', fontWeight: isSelected ? 700 : 500, pointerEvents: 'none' }}
              >
                {formatMonthShort(m.month)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function formatMonthLabel(ym) {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return ym;
  return `${MONTH_NAMES[m - 1]} ${y}`;
}
function formatMonthShort(ym) {
  if (!ym) return '';
  const [, m] = ym.split('-').map(Number);
  return Number.isFinite(m) && m >= 1 && m <= 12 ? MONTH_NAMES[m - 1].slice(0, 3) : ym;
}

const styles = {
  wrap: { marginBottom: 14 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, gap: 12, flexWrap: 'wrap' },
  heading: { fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7 },
  sub: { fontSize: 11, color: '#64748b' },
  svg: { width: '100%', maxWidth: 920, height: 'auto', display: 'block' },
};
