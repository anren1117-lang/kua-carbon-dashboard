import React, { useMemo, useState } from 'react';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';

// /campus-map — schematic SVG layout of all 19 KUA buildings, grouped
// by category zone (Academic / Athletic / Dorm / Other), each box
// sized by sqft and colored by per-sqft emissions intensity so the
// hot spots jump out visually. Hover/click a building → detail card
// with annual kWh, mtCO₂e, intensity, and occupants.
//
// Not geographically accurate — we don't have lat/lng. The layout
// reads as "campus zones" rather than "campus map." For a real
// geo map, swap the layout function for one that consumes
// per-building coordinates.

// Hand-picked positions for each building inside its category zone.
// The zone boxes themselves are stacked vertically with horizontal
// flow inside each zone (see ZONE_LAYOUT below).
const CATEGORY_ZONES = ['Academic', 'Athletic', 'Dorm', 'Other'];
const ZONE_HEAD_HEIGHT = 28;
const ZONE_PADDING     = 16;
const ZONE_GAP         = 14;
const BOX_GAP          = 10;

// Color scale for emissions intensity (kgCO₂e/sqft/yr).
// Roughly: <8 cool (efficient), 8–25 mid, >25 hot (high-intensity).
function intensityColor(kgPerSqft) {
  if (kgPerSqft <= 0)  return '#1f2937';
  if (kgPerSqft <  4)  return '#0e7490';
  if (kgPerSqft <  8)  return '#06b6d4';
  if (kgPerSqft < 16)  return '#fcd34d';
  if (kgPerSqft < 30)  return '#fb923c';
  return '#dc2626';
}

function categoryAccent(cat) {
  return cat === 'Academic'  ? '#a5b4fc'
       : cat === 'Athletic'  ? '#fdba74'
       : cat === 'Dorm'      ? '#86efac'
       : cat === 'Dining'    ? '#fca5a5'
       : '#94a3b8';
}

// Layout: stack zones top→bottom. Inside each zone, flow buildings
// left→right, wrapping when they exceed the width. Each building's
// box size scales by sqrt(sqft) so the ratio is visual but the
// smallest building stays clickable.
function layoutBoxes(rows, width) {
  const MIN_BOX = 56;
  const MAX_BOX = 130;
  const allSqft = rows.map((r) => r.sqft || 1);
  const minSq = Math.min(...allSqft);
  const maxSq = Math.max(...allSqft);
  const scale = (sqft) => {
    if (maxSq === minSq) return (MIN_BOX + MAX_BOX) / 2;
    const norm = (Math.sqrt(sqft) - Math.sqrt(minSq)) / (Math.sqrt(maxSq) - Math.sqrt(minSq));
    return MIN_BOX + norm * (MAX_BOX - MIN_BOX);
  };

  const zones = [];
  let y = 0;
  for (const category of CATEGORY_ZONES) {
    const bs = rows.filter((r) => r.category === category);
    if (bs.length === 0) continue;
    const zoneInnerW = width - ZONE_PADDING * 2;
    const boxes = [];
    let cursorX = 0;
    let rowMaxH = 0;
    let rowY = 0;
    for (const r of bs) {
      const w = scale(r.sqft || 1);
      const h = scale(r.sqft || 1) * 0.7;
      if (cursorX + w > zoneInnerW && cursorX > 0) {
        rowY += rowMaxH + BOX_GAP;
        cursorX = 0;
        rowMaxH = 0;
      }
      boxes.push({ row: r, x: ZONE_PADDING + cursorX, y: ZONE_HEAD_HEIGHT + rowY, w, h });
      cursorX += w + BOX_GAP;
      rowMaxH = Math.max(rowMaxH, h);
    }
    const zoneHeight = ZONE_HEAD_HEIGHT + rowY + rowMaxH + ZONE_PADDING;
    zones.push({ category, y, height: zoneHeight, boxes });
    y += zoneHeight + ZONE_GAP;
  }
  return { zones, totalHeight: y };
}

export default function CampusMap() {
  const [selectedId, setSelectedId] = useState(null);
  // null = "All (annualized)"; otherwise 'YYYY-MM'.
  const [selectedMonth, setSelectedMonth] = useState(null);

  const { rows, totalKwh, totalMt, monthsObserved, mode, availableMonths } = useMemo(
    () => computeBuildingEmissions({ month: selectedMonth }),
    [selectedMonth],
  );
  const selected = rows.find((r) => r.id === selectedId);

  const W = 920;
  const { zones, totalHeight } = useMemo(() => layoutBoxes(rows, W), [rows]);

  const top5 = [...rows].sort((a, b) => b.mtCO2e - a.mtCO2e).slice(0, 5);
  const hottest = [...rows].filter((r) => r.kgPerSqft > 0).sort((a, b) => b.kgPerSqft - a.kgPerSqft).slice(0, 5);

  const subtitle = mode === 'monthly'
    ? `Slice of campus emissions for ${formatMonthLabel(selectedMonth)}. Each box is sized by sqft and colored by per-sqft intensity for that month's reading. Click any building for detail.`
    : `Where the ${totalMt.toLocaleString()} mtCO₂e of measured electricity emissions actually come from. Each box is one of KUA's ${rows.length} tracked buildings, sized by square footage and colored by per-sqft emissions intensity. Click any building for detail.`;

  return (
    <ModulePage title="Campus map — emissions distribution" subtitle={subtitle}>
      <ModuleSection
        title="Campus zones"
        hint={`Schematic layout grouped by category — not geographically accurate (we don't yet have building coordinates). Sizes are scaled by sqft. Colors show kg CO₂e per square foot per year, so a small intense building stands out as much as a large efficient one. Based on ${monthsObserved} months of measured BMS data${mode === 'monthly' ? ', currently viewing one month' : ', annualized'}.`}
      >
        <div style={styles.controlsRow}>
          <span style={styles.controlLabel}>Time window:</span>
          <button
            type="button"
            onClick={() => setSelectedMonth(null)}
            style={{ ...styles.monthBtn, ...(selectedMonth === null ? styles.monthBtnActive : {}) }}
          >
            All (annualized)
          </button>
          {availableMonths.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMonth(m)}
              style={{ ...styles.monthBtn, ...(selectedMonth === m ? styles.monthBtnActive : {}) }}
            >
              {formatMonthShort(m)}
            </button>
          ))}
        </div>

        <div style={styles.legendRow}>
          <span style={styles.legendLabel}>Intensity (kg CO₂e/sqft/yr):</span>
          <LegendChip color="#0e7490">&lt; 4 (very efficient)</LegendChip>
          <LegendChip color="#06b6d4">4–8</LegendChip>
          <LegendChip color="#fcd34d">8–16</LegendChip>
          <LegendChip color="#fb923c">16–30</LegendChip>
          <LegendChip color="#dc2626">&gt; 30 (hot)</LegendChip>
        </div>

        <svg
          viewBox={`0 0 ${W} ${totalHeight}`}
          style={styles.svg}
          role="img"
          aria-label="KUA campus map showing per-building emissions intensity"
        >
          {zones.map((z) => (
            <g key={z.category} transform={`translate(0, ${z.y})`}>
              <rect
                x={0} y={0} width={W} height={z.height}
                fill="#0b1220"
                stroke="#1f2937"
                strokeWidth={1}
                rx={8}
              />
              <text
                x={ZONE_PADDING} y={18}
                style={{ fontSize: 12, fontWeight: 700, fill: categoryAccent(z.category), textTransform: 'uppercase', letterSpacing: 0.8 }}
              >
                {z.category}
              </text>
              {z.boxes.map((b) => {
                const fill = intensityColor(b.row.kgPerSqft);
                const stroke = selectedId === b.row.id ? '#fff' : '#1f2937';
                return (
                  <g
                    key={b.row.id}
                    transform={`translate(${b.x}, ${b.y})`}
                    onClick={() => setSelectedId(b.row.id === selectedId ? null : b.row.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={0} y={0} width={b.w} height={b.h}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={selectedId === b.row.id ? 2.5 : 1}
                      rx={4}
                    />
                    <text
                      x={b.w / 2} y={b.h / 2 - 4}
                      textAnchor="middle"
                      style={{ fontSize: 10, fontWeight: 700, fill: '#0b1220', pointerEvents: 'none' }}
                    >
                      {shortName(b.row.name)}
                    </text>
                    <text
                      x={b.w / 2} y={b.h / 2 + 10}
                      textAnchor="middle"
                      style={{ fontSize: 9, fill: '#0b1220', pointerEvents: 'none', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {b.row.mtCO2e > 0 ? `${b.row.mtCO2e.toFixed(1)} mt` : '—'}
                    </text>
                  </g>
                );
              })}
            </g>
          ))}
        </svg>

        {selected && (
          <div style={styles.detail}>
            <div style={styles.detailHead}>
              <h3 style={styles.detailName}>{selected.name}</h3>
              <Pill kind="neutral">
                <span style={{ color: categoryAccent(selected.category), fontWeight: 700 }}>{selected.category}</span>
              </Pill>
              <button type="button" onClick={() => setSelectedId(null)} style={styles.detailClose}>✕</button>
            </div>
            <div style={styles.detailGrid}>
              {mode === 'monthly' ? (
                <>
                  <DetailStat label={`${formatMonthLabel(selectedMonth)} electricity`} value={`${(selected.monthKwh || 0).toLocaleString()} kWh`} />
                  <DetailStat label="Annualized equivalent"  value={`${selected.annualKwh.toLocaleString()} kWh/yr`} />
                </>
              ) : (
                <DetailStat label="Annual electricity" value={`${selected.annualKwh.toLocaleString()} kWh`} />
              )}
              <DetailStat label={mode === 'monthly' ? 'Annualized emissions' : 'Annual emissions'} value={`${selected.mtCO2e.toFixed(2)} mtCO₂e`} />
              <DetailStat label="Share of campus"   value={`${selected.sharePercent}%`} />
              <DetailStat label="Square feet"       value={selected.sqft.toLocaleString()} />
              <DetailStat label="Daily occupants"   value={selected.occupants.toLocaleString()} />
              <DetailStat label="Intensity"         value={`${selected.kgPerSqft} kg/sqft/yr`} />
            </div>
            <div style={styles.detailNote}>
              {mode === 'monthly'
                ? `Reading is for ${formatMonthLabel(selectedMonth)} alone. Annualized-equivalent figures use month × 12 so the color scale stays comparable across views.`
                : `Measured over ${selected.monthsCovered} month${selected.monthsCovered === 1 ? '' : 's'} of BMS data, annualized.`}
              {' '}Emissions = kWh × 0.235 kg/kWh (ISO-NE 2024 effective).
            </div>
          </div>
        )}
      </ModuleSection>

      <ModuleSection title="Top 5 by total emissions" hint="Where the absolute most carbon comes from. Usually correlates with sqft.">
        <Ranking rows={top5} valueKey="mtCO2e" suffix=" mt" />
      </ModuleSection>

      <ModuleSection title="Top 5 by intensity" hint="kgCO₂e per sqft per year. A small intense building can show up here without showing up in the absolute top 5.">
        <Ranking rows={hottest} valueKey="kgPerSqft" suffix=" kg/sqft" />
      </ModuleSection>
    </ModulePage>
  );
}

function LegendChip({ color, children }) {
  return (
    <span style={styles.legendChip}>
      <span style={{ ...styles.legendSwatch, background: color }} />
      {children}
    </span>
  );
}

function DetailStat({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function Ranking({ rows, valueKey, suffix }) {
  const max = Math.max(...rows.map((r) => r[valueKey]), 1);
  return (
    <ol style={styles.rankList}>
      {rows.map((r, i) => (
        <li key={r.id} style={styles.rankRow}>
          <span style={styles.rankNum}>#{i + 1}</span>
          <span style={styles.rankName}>{r.name}</span>
          <span style={styles.rankBar}>
            <span style={{ ...styles.rankFill, width: `${(r[valueKey] / max) * 100}%`, background: intensityColor(r.kgPerSqft) }} />
          </span>
          <span style={styles.rankValue}>{r[valueKey].toLocaleString()}{suffix}</span>
        </li>
      ))}
    </ol>
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

// Trim long building names for the in-box label.
function shortName(name) {
  return name
    .replace(/ Hall$| House$| Bicentennial Hall$| Athletic Center$| Field House$| Alumni House$| Arts Center$| Care Center$/, '')
    .slice(0, 12);
}

const styles = {
  controlsRow:    { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
  controlLabel:   { fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7, marginRight: 4 },
  monthBtn:       { padding: '4px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 4, color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
  monthBtnActive: { background: '#0e3a5f', borderColor: '#22d3ee', color: '#22d3ee', fontWeight: 700 },

  legendRow:   { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14, fontSize: 11, color: '#94a3b8' },
  legendLabel: { color: '#cbd5e1', fontWeight: 600 },
  legendChip:  { display: 'inline-flex', alignItems: 'center', gap: 6 },
  legendSwatch:{ display: 'inline-block', width: 14, height: 14, borderRadius: 3 },

  svg:         { width: '100%', maxWidth: 920, height: 'auto', display: 'block' },

  detail:      { marginTop: 16, padding: '16px 18px', background: '#0f172a', border: '1px solid #1f2937', borderLeft: '3px solid #22d3ee', borderRadius: 8 },
  detailHead:  { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  detailName:  { margin: 0, fontSize: 18, color: '#e5e7eb', fontWeight: 700, flex: 1 },
  detailClose: { background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '4px 10px', borderRadius: 4, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
  detailGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 },
  stat:        { padding: '8px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  statLabel:   { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: 700 },
  statValue:   { fontSize: 16, color: '#e5e7eb', fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 4 },
  detailNote:  { marginTop: 12, fontSize: 11, color: '#64748b', lineHeight: 1.6 },

  rankList:    { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 },
  rankRow:     { display: 'grid', gridTemplateColumns: '36px 1fr 200px 100px', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1f2937', fontSize: 13 },
  rankNum:     { color: '#64748b', fontWeight: 700, fontSize: 11 },
  rankName:    { color: '#e5e7eb', fontWeight: 600 },
  rankBar:     { height: 6, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 3, overflow: 'hidden' },
  rankFill:    { display: 'block', height: '100%' },
  rankValue:   { textAlign: 'right', color: '#e5e7eb', fontVariantNumeric: 'tabular-nums', fontWeight: 600 },
};
