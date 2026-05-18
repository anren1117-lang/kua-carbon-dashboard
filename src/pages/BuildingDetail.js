import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { buildings, getBuilding } from '../data/buildings.js';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';
import { buildingMonthlyHistory } from '../data/monthlyConsumption.js';
import { toCsv, downloadCsv } from '../utils/csv.js';
import { Icon } from '../components/Icon.js';
import { CopyButton } from '../components/CopyButton.js';

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
          <Link to="/campus-map" style={styles.toolBtn}>
            <span className="kua-back-arrow"><Icon.ArrowLeft size={12} /></span>
            <span style={{ marginLeft: 6 }}>Campus map</span>
          </Link>
          <Link to="/buildings" style={styles.toolBtn}>All buildings</Link>
          {building.category === 'Dorm' && (
            <Link to="/dorm-leaderboard" style={styles.toolBtn}>Dorm leaderboard</Link>
          )}
          {months.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const csv = toCsv(
                  months.map((m) => ({ month: m, kwh: history[m] || 0 })),
                  ['month', 'kwh'],
                );
                downloadCsv(`${id}_monthly_${new Date().toISOString().slice(0, 10)}.csv`, csv);
              }}
              style={styles.exportBtn}
              title="Download this building's monthly kWh series as CSV"
            >
              <Icon.Download size={12} />
              <span style={{ marginLeft: 6 }}>Monthly CSV</span>
            </button>
          )}
          <ShareStatsButton building={building} row={row} />

        </div>
      }
    >
      <BuildingPhoto buildingId={id} buildingName={building.name} />

      {building.category === 'Dorm' && row && <DormSpotlight id={id} row={row} rows={rows} occupants={building.occupants} />}

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

// Dorm-only spotlight callout above the standard headline numbers.
// Shows this dorm's rank in the per-resident leaderboard with a
// gold/silver/bronze flavor and links to the full leaderboard.
function DormSpotlight({ id, row, rows, occupants }) {
  const dorms = rows
    .filter((r) => r.category === 'Dorm' && r.occupants > 0)
    .map((d) => ({ ...d, perResident: d.annualKwh / d.occupants }))
    .sort((a, b) => a.perResident - b.perResident);
  const rank = dorms.findIndex((d) => d.id === id) + 1;
  const total = dorms.length;
  if (rank === 0 || total === 0) return null;
  const perResident = Math.round(row.annualKwh / Math.max(1, occupants));
  const isTop3 = rank <= 3;
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  return (
    <div style={spotlightStyles.wrap} className="kua-card-hover kua-champion-glow">
      <div style={spotlightStyles.eyebrow}>🏆 Dorm leaderboard</div>
      <div style={spotlightStyles.head}>
        {medal && <span style={spotlightStyles.medal}>{medal}</span>}
        <div>
          <div style={spotlightStyles.rank}>
            #{rank} <span style={spotlightStyles.rankTotal}>of {total} dorms</span>
          </div>
          <div style={spotlightStyles.sub}>
            {perResident.toLocaleString()} kWh per resident per year (annualized)
          </div>
        </div>
      </div>
      <div style={spotlightStyles.footer}>
        {isTop3
          ? '🎉 This dorm is in the top 3 most efficient — keep doing whatever you\'re doing differently.'
          : `${dorms[0].name} leads at ${Math.round(dorms[0].perResident).toLocaleString()} kWh/resident — that's the bar.`}
        {' '}
        <Link to="/dorm-leaderboard" style={spotlightStyles.link}>See full leaderboard →</Link>
      </div>
    </div>
  );
}

const spotlightStyles = {
  wrap: {
    marginBottom: 24,
    padding: '20px 24px',
    background: 'linear-gradient(135deg, rgba(8, 51, 24, 0.6) 0%, #0f172a 70%)',
    border: '1px solid #16a34a',
    borderLeft: '4px solid #86efac',
    borderRadius: 12,
  },
  eyebrow: { fontSize: 11, color: '#86efac', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 800, marginBottom: 12 },
  head: { display: 'flex', alignItems: 'center', gap: 18 },
  medal: { fontSize: 44, lineHeight: 1 },
  rank: { fontSize: 32, fontWeight: 800, color: '#dcfce7', lineHeight: 1 },
  rankTotal: { fontSize: 14, color: '#bbf7d0', fontWeight: 600, marginLeft: 6 },
  sub: { fontSize: 13, color: '#bbf7d0', marginTop: 6 },
  footer: { marginTop: 14, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 },
  link: { color: '#86efac', textDecoration: 'none', fontWeight: 700 },
};

// "Share stats" button — copies a tweet-length building summary
// to clipboard so the user can paste into a dorm chat / Slack /
// IG story. No share when there's no measured data row yet.
function ShareStatsButton({ building, row }) {
  if (!row) return null;
  const url = (typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://kua-carbon-dashboard.vercel.app') + `/buildings/${building.id}`;
  const text =
    `${building.name} (${building.category}) at KUA: `
    + `${row.annualKwh.toLocaleString()} kWh/yr, `
    + `${row.mtCO2e.toFixed(1)} mtCO₂e, `
    + `${row.kgPerSqft} kg/sqft. `
    + `See live: ${url}`;
  return (
    <CopyButton
      text={text}
      label="Share stats"
      copiedLabel="✓ Copied!"
      title="Copy a tweet-length summary of this building's stats to your clipboard"
      style={{ padding: '6px 12px', fontSize: 12 }}
    />
  );
}

// Building photo with graceful fallback. Looks for an image at
// /buildings/{id}.jpg (or .png). If not present, renders nothing.
// To add a photo for a building, drop the file at
// src/public/buildings/{id}.jpg — Vite copies /src/public to the
// site root at build, so /buildings/{id}.jpg resolves automatically.
// No code change needed when photos arrive.
function BuildingPhoto({ buildingId, buildingName }) {
  const [status, setStatus] = useState('loading'); // loading | loaded | missing
  const [src, setSrc] = useState(`/buildings/${buildingId}.jpg`);

  React.useEffect(() => {
    let cancelled = false;
    const jpg = new Image();
    jpg.onload = () => { if (!cancelled) { setSrc(`/buildings/${buildingId}.jpg`); setStatus('loaded'); } };
    jpg.onerror = () => {
      // Fall back to .png if .jpg fails
      const png = new Image();
      png.onload = () => { if (!cancelled) { setSrc(`/buildings/${buildingId}.png`); setStatus('loaded'); } };
      png.onerror = () => { if (!cancelled) setStatus('missing'); };
      png.src = `/buildings/${buildingId}.png`;
    };
    jpg.src = `/buildings/${buildingId}.jpg`;
    return () => { cancelled = true; };
  }, [buildingId]);

  if (status === 'missing' || status === 'loading') return null;

  return (
    <div style={styles.photoWrap}>
      <img
        src={src}
        alt={`Photo of ${buildingName}`}
        style={styles.photo}
        draggable={false}
      />
    </div>
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
  toolBtn:        { padding: '6px 12px', background: '#0f172a', color: '#22d3ee', border: '1px solid #1f2937', borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },
  exportBtn:      { padding: '6px 12px', background: '#052e16', color: '#86efac', border: '1px solid #16a34a', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center' },

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

  photoWrap: { width: '100%', maxWidth: 800, margin: '0 auto 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, overflow: 'hidden', lineHeight: 0 },
  photo:     { width: '100%', height: 'auto', maxHeight: 400, objectFit: 'cover', display: 'block' },
};
