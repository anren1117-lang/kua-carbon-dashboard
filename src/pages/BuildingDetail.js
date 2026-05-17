import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { buildings, getBuilding } from '../data/buildings.js';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';
import { buildingMonthlyHistory } from '../data/monthlyConsumption.js';

// /buildings/:id — single-building deep view. Links target this page
// from the campus map's selected-building detail panel and from the
// /buildings list. Self-contained: pulls the same per-building
// emissions roll-up the map page uses, then drills into the monthly
// kWh series for the bar chart + ranks the building among its
// same-category peers.

export default function BuildingDetail() {
  const { id } = useParams();
  const building = getBuilding(id);
  const { rows } = useMemo(() => computeBuildingEmissions(), []);
  const history = useMemo(() => buildingMonthlyHistory()[id] || {}, [id]);
  const row = rows.find((r) => r.id === id);

  if (!building) {
    return (
      <ModulePage title="Building not found" subtitle="No building registered with that id.">
        <p style={styles.fineprint}>
          Try the <Link to="/campus-map" style={styles.link}>campus map</Link> or
          the <Link to="/buildings" style={styles.link}>buildings list</Link>.
        </p>
      </ModulePage>
    );
  }

  // Per-category ranking: where this building sits among its peers
  // on (a) total mt and (b) intensity.
  const peers = rows.filter((r) => r.category === building.category);
  const rankByMt = [...peers].sort((a, b) => b.mtCO2e - a.mtCO2e).findIndex((r) => r.id === id) + 1;
  const rankByIntensity = [...peers].sort((a, b) => b.kgPerSqft - a.kgPerSqft).findIndex((r) => r.id === id) + 1;
  const peerCount = peers.length;

  const months = Object.keys(history).sort();
  const maxKwh = Math.max(...months.map((m) => history[m] || 0), 1);

  return (
    <ModulePage
      title={building.name}
      subtitle={`${building.category} · BMS #${building.bmsNumber ?? '—'} · ${building.sqft.toLocaleString()} sqft · ${building.occupants.toLocaleString()} daily occupants`}
      toolbar={
        <div style={styles.toolbar}>
          <Link to="/campus-map" style={styles.toolBtn}>← Campus map</Link>
          <Link to="/buildings" style={styles.toolBtn}>All buildings</Link>
        </div>
      }
    >
      {row ? (
        <ModuleSection title="Headline numbers" hint="Annualized from the months of measured BMS data this building has.">
          <div style={styles.statGrid}>
            <Stat label="Annual electricity"  value={`${row.annualKwh.toLocaleString()} kWh`} />
            <Stat label="Annual emissions"    value={`${row.mtCO2e.toFixed(2)} mtCO₂e`} />
            <Stat label="Share of campus"     value={`${row.sharePercent}%`} />
            <Stat label="Intensity"           value={`${row.kgPerSqft} kg/sqft/yr`} />
            <Stat label={`Rank in ${building.category}s by total`} value={peerCount > 0 ? `#${rankByMt} of ${peerCount}` : '—'} />
            <Stat label={`Rank in ${building.category}s by intensity`} value={peerCount > 0 ? `#${rankByIntensity} of ${peerCount}` : '—'} />
          </div>
        </ModuleSection>
      ) : (
        <ModuleSection title="No measured data yet" hint="">
          <p style={styles.fineprint}>
            This building isn't in the current BMS captures yet. When a meter
            comes online its readings will start populating
            <code> monthlyConsumption.js</code> and this page will fill in
            automatically.
          </p>
        </ModuleSection>
      )}

      {months.length > 0 && (
        <ModuleSection title="Monthly electricity" hint="Each bar = one captured month of BMS data. Larger bars = more electricity that month.">
          <div style={styles.chartWrap}>
            <svg viewBox="0 0 800 220" style={styles.chartSvg} role="img" aria-label="Monthly kWh">
              {months.map((m, i) => {
                const kwh = history[m] || 0;
                const slot = 780 / months.length;
                const barW = Math.max(12, slot - 8);
                const x = 10 + i * slot + (slot - barW) / 2;
                const h = (kwh / maxKwh) * 170;
                const y = 30 + (170 - h);
                return (
                  <g key={m}>
                    <rect x={x} y={y} width={barW} height={h} fill="#06b6d4" rx={2}>
                      <title>{`${m}: ${kwh.toLocaleString()} kWh`}</title>
                    </rect>
                    <text x={x + barW / 2} y={215} textAnchor="middle" style={styles.chartLabel}>
                      {monthShort(m)}
                    </text>
                    <text x={x + barW / 2} y={y - 4} textAnchor="middle" style={styles.chartValue}>
                      {kwh >= 1000 ? `${Math.round(kwh / 1000)}k` : kwh}
                    </text>
                  </g>
                );
              })}
              <line x1="10" y1="200" x2="790" y2="200" stroke="#1f2937" strokeWidth="1" />
            </svg>
          </div>
        </ModuleSection>
      )}

      <ModuleSection title={`Peer ${building.category.toLowerCase()}s on campus`} hint="Same category, ranked by intensity. Hover any row → click through to that building.">
        <ol style={styles.peerList}>
          {[...peers].sort((a, b) => b.kgPerSqft - a.kgPerSqft).map((p, i) => (
            <li key={p.id} style={{ ...styles.peerRow, ...(p.id === id ? styles.peerRowMe : {}) }}>
              <span style={styles.peerRank}>#{i + 1}</span>
              <Link to={`/buildings/${p.id}`} style={{ ...styles.peerName, ...(p.id === id ? styles.peerNameMe : {}) }}>
                {p.name}{p.id === id ? ' — this building' : ''}
              </Link>
              <span style={styles.peerSqft}>{p.sqft.toLocaleString()} sqft</span>
              <span style={styles.peerMt}>{p.mtCO2e.toFixed(1)} mt</span>
              <span style={styles.peerIntensity}>{p.kgPerSqft.toFixed(1)} kg/sqft</span>
            </li>
          ))}
        </ol>
      </ModuleSection>

      <ModuleSection title="Operating profile" hint="From the building registry — used by the HVAC schedule + setpoint analysis.">
        <div style={styles.statGrid}>
          <Stat label="HVAC schedule"   value={building.hvacSchedule || '—'} />
          <Stat label="Heating setpoint" value={`${building.setpointHeatingF} °F`} />
          <Stat label="Cooling setpoint" value={`${building.setpointCoolingF} °F`} />
          <Stat label="Dorm population" value={building.dormPopulation > 0 ? building.dormPopulation.toLocaleString() : '—'} />
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function monthShort(ym) {
  if (!ym) return '';
  const [, m] = ym.split('-').map(Number);
  return Number.isFinite(m) && m >= 1 && m <= 12 ? MONTH_NAMES[m - 1] : ym;
}

const styles = {
  toolbar:        { display: 'flex', gap: 10 },
  toolBtn:        { padding: '6px 12px', background: '#0f172a', color: '#22d3ee', border: '1px solid #1f2937', borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none' },

  statGrid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  stat:           { padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  statLabel:      { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: 700 },
  statValue:      { fontSize: 17, color: '#e5e7eb', fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 4 },

  chartWrap:      { background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, padding: 12 },
  chartSvg:       { width: '100%', maxWidth: 800, height: 'auto', display: 'block' },
  chartLabel:     { fontSize: 10, fill: '#64748b' },
  chartValue:     { fontSize: 9, fill: '#94a3b8', fontVariantNumeric: 'tabular-nums' },

  peerList:       { listStyle: 'none', padding: 0, margin: 0 },
  peerRow:        { display: 'grid', gridTemplateColumns: '40px 1fr 110px 80px 100px', gap: 10, alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #1f2937', fontSize: 13 },
  peerRowMe:      { background: '#0e3a5f', borderLeft: '3px solid #22d3ee' },
  peerRank:       { color: '#64748b', fontWeight: 700, fontSize: 11 },
  peerName:       { color: '#cbd5e1', textDecoration: 'none', fontWeight: 600 },
  peerNameMe:     { color: '#22d3ee' },
  peerSqft:       { color: '#94a3b8', fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  peerMt:         { color: '#e5e7eb', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontWeight: 600 },
  peerIntensity:  { color: '#94a3b8', fontVariantNumeric: 'tabular-nums', textAlign: 'right' },

  fineprint:      { fontSize: 13, color: '#94a3b8', lineHeight: 1.7 },
  link:           { color: '#22d3ee', textDecoration: 'none' },
};
