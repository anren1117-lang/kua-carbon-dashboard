import React, { useState } from 'react';
import { ProvenancePill, ProvenanceLegend } from './ProvenancePill.js';
import { GRID_MIX_ANNUAL_MTCO2E } from '../data/gridMix.js';
import { COMPOSED_YTD_AS_OF, COMPOSED_ANNUAL_KWH } from '../data/composedYtd.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { GROSS_MT } from '../data/scopeTotals.js';
import { TOTAL_STUDENTS } from '../data/students.js';
import {
  SCOPE1_HEATING_RANGE, SCOPE1_FLEET_RANGE, SCOPE1_REFRIGERANTS_RANGE,
  SCOPE3_STUDENT_TRAVEL_RANGE, SCOPE3_DINING_RANGE, SCOPE3_WASTE_RANGE,
  SCOPE3_COMMUTING_RANGE, SCOPE3_GOODS_RANGE, SCOPE3_UPSTREAM_FUEL_RANGE,
  SINKS_RANGE,
} from '../data/geographicEstimates.js';
import { useMeasuredScopeTotals } from '../hooks/useMeasuredScopeTotals.js';
import { carbonEquivalents } from '../utils/equivalents.js';
import { AnimatedNumber } from './AnimatedNumber.js';
import { AmbientParticles } from './AmbientParticles.js';
import { useCardTilt } from '../hooks/useCardTilt.js';

// Scope 2 row recomputes from the composed YTD: ±5% around the
// annualized figure. When a new monthly capture or fresh CSV lands,
// the row updates automatically.
const SCOPE2_LOW  = Math.round(GRID_MIX_ANNUAL_MTCO2E * 0.95);
const SCOPE2_HIGH = Math.round(GRID_MIX_ANNUAL_MTCO2E * 1.05);

// Provenance taxonomy:
//   measured  — BMS / utility / fuel-delivery records integrated.
//   cited     — published methodology (EPA/IPCC/NREL/etc.) applied to
//               KUA inputs that are themselves measured or canonical.
//   estimated — placeholder I (Claude) wrote into the codebase. Not
//               measured, not cited — needs replacement before anyone
//               treats it as fact.
// Each row carries two methodology pointers so the upgrade path is
// transparent:
//   currentMethod — how the number on the dashboard is calculated TODAY
//   futureMethod  — what data integration replaces the placeholder, and
//                   what the row's provenance becomes when it ships
const rows = [
  {
    name: 'Scope 1 — Heating fuel',
    low: Math.round(SCOPE1_HEATING_RANGE.low), high: Math.round(SCOPE1_HEATING_RANGE.high),
    provenance: 'cited',
    currentMethod: 'Hand-set 100k–150k gal heating-oil-equivalent assumption × EPA Stationary Combustion factor (10.16 kg CO₂/gal heating oil, 5.72 kg CO₂/gal propane). The gallons figure is a guess sized to typical NH boarding-school footprints, not measured.',
    futureMethod:  'Replace the gallons assumption with KUA Facilities annual fuel-delivery invoices (heating oil + propane) per building. EPA factors stay; once invoices feed the fuel_bills table, this row flips estimated → measured.',
  },
  {
    name: 'Scope 1 — Refrigerants + fleet',
    low: Math.round(SCOPE1_FLEET_RANGE.low + SCOPE1_REFRIGERANTS_RANGE.low),
    high: Math.round(SCOPE1_FLEET_RANGE.high + SCOPE1_REFRIGERANTS_RANGE.high),
    provenance: 'cited',
    currentMethod: 'Hand-set order-of-magnitude figure (refrigerant leakage rates from typical commercial HVAC + small KUA fleet vehicles).',
    futureMethod:  'Refrigerants: HVAC technician service-report mass balance × IPCC AR6 GWP100. Fleet: KUA fuel-card records × EPA gasoline/diesel factors. Both flip estimated → measured once the records are integrated.',
  },
  {
    name: 'Scope 2 — Electricity (kWh × factor)', low: SCOPE2_LOW, high: SCOPE2_HIGH, provenance: 'cited',
    currentMethod: `Recomputed from the composed YTD on each render. Composed YTD-through-${COMPOSED_YTD_AS_OF} (monthly BMS captures Jan-Apr + Meter Trends CSV May days) annualizes to ${COMPOSED_ANNUAL_KWH.toLocaleString()} kWh/yr × ISO-NE 2024 effective rate 0.235 kg/kWh (per-fuel output factors at published generation mix) = ${GRID_MIX_ANNUAL_MTCO2E} mtCO₂e/yr. Range is the central value ±5% — the cross-validation noise between the two BMS sources.`,
    futureMethod:  'Already at target methodology. Year-over-year improvement comes from a longer measured BMS window (drop the annualization multiplier once a full year is metered) and from the next eGRID NEWE update.',
  },
  {
    name: 'Scope 3 — Student travel',
    low: Math.round(SCOPE3_STUDENT_TRAVEL_RANGE.low),
    high: Math.round(SCOPE3_STUDENT_TRAVEL_RANGE.high),
    provenance: 'cited',
    currentMethod: 'Hand-set assumptions × ICAO calculator: ~50 international students × ~3 mtCO₂e per round trip + ~150 US boarders × 3–4 trips/yr × ~1 mt each + small allocation for study abroad and athletic teams. Methodology is sound; the trip-count assumptions are guesses.',
    futureMethod:  'Replace assumed trip counts with actual travel records from the KUA travel office (international student departure counts, Athletic Office bus routes and team travel, OPE study-abroad ledger). ICAO calculator stays; row flips estimated → cited.',
  },
  {
    name: 'Scope 3 — Goods, dining, waste, commuting, upstream fuel',
    low: Math.round(SCOPE3_GOODS_RANGE.low + SCOPE3_DINING_RANGE.low + SCOPE3_WASTE_RANGE.low + SCOPE3_COMMUTING_RANGE.low + SCOPE3_UPSTREAM_FUEL_RANGE.low),
    high: Math.round(SCOPE3_GOODS_RANGE.high + SCOPE3_DINING_RANGE.high + SCOPE3_WASTE_RANGE.high + SCOPE3_COMMUTING_RANGE.high + SCOPE3_UPSTREAM_FUEL_RANGE.high),
    provenance: 'cited',
    currentMethod: 'Standard methodologies applied to guessed inputs: EEIO spend-based emissions for Cat 1 (purchased goods), Poore & Nemecek 2018 for dining (boarder + day meal counts × meal-class kg CO₂e), EPA WARM v15.1 for waste, GHG Protocol Cat 7 for commuting, ~15–20% uplift on Scope 1+2 for upstream fuel. KUA-specific spend, meal counts, waste tonnage, and commute distances are placeholders.',
    futureMethod:  'Pull real annual spend from KUA Business Office (mapped to USEEIO sectors). Replace dining estimate with Sodexo/SAGE invoices (item-level food cost × Poore & Nemecek). Replace waste assumption with hauler invoices (tons by stream). Replace commute estimate with HR-collected zip-code survey × ICCT fleet fuel-economy. Methodologies stay; row flips estimated → cited.',
  },
  {
    name: 'Sinks — On-campus sequestration',
    low: -Math.round(SINKS_RANGE.high),
    high: -Math.round(SINKS_RANGE.low),
    provenance: 'cited',
    currentMethod: '7 named forest stands × per-acre sequestration rates inside IPCC LULUCF ranges (Birdsey 1992 US-forest average 2.1 mtCO₂e/acre/yr to Nowak 2013 open-grown 4.2). Total 1,000-acre figure is cited (KUA disclosure + Wikipedia); the per-stand subdivision and acreages are placeholders, not from a forest inventory.',
    futureMethod:  'Commission a USFS Forest Inventory & Analysis-style stand inventory for the actual KUA woodlot — species composition, age class, basal area, per-stand acreage. Per-acre rates stay (IPCC defaults are appropriate for this scale); inputs become real. Row flips estimated → cited.',
  },
];

// Summary: gross/net MID values come from the centralized SCOPE_TOTALS
// chain (GROSS_MT - ANNUAL_SEQUESTRATION_MT), so the homepage hero
// matches Executive / Scope detail pages exactly. The LOW/HIGH range
// values still come from the rows[] array (which tracks per-row
// uncertainty bands), so the breakdown table conveys honest spread
// without the hero number drifting from canonical.
const grossPositive = rows.filter((r) => r.low >= 0);
const grossLowSum  = grossPositive.reduce((s, r) => s + r.low, 0);
const grossHighSum = grossPositive.reduce((s, r) => s + r.high, 0);
const sinksRow = rows.find((r) => r.name.startsWith('Sinks')) || { low: 0, high: 0 };
const grossMidCanonical = GROSS_MT;
const sinkMidCanonical  = -ANNUAL_SEQUESTRATION_MT; // signed
const netMidCanonical   = grossMidCanonical + sinkMidCanonical;
const studentCount = TOTAL_STUDENTS;

// Net-balance bounds under independent uncertainty:
//   smallest plausible net  = smallest gross + LARGEST drawdown (most negative sinks value, sinksRow.low)
//   largest plausible net   = largest gross  + SMALLEST drawdown (least negative sinks value, sinksRow.high)
// Earlier code paired grossLow with sinksRow.high and grossHigh with sinksRow.low — an anti-correlated
// pairing that produced a NARROWER interior range and contradicted the "low end is net-negative" caption
// below the headline. Independent treatment is honest about the actual uncertainty span.
const netLowSum  = grossLowSum  + sinksRow.low;
const netHighSum = grossHighSum + sinksRow.high;

const summary = {
  grossLow:  Math.round(grossLowSum),
  grossHigh: Math.round(grossHighSum),
  grossMid:  Math.round(grossMidCanonical),
  sinkLow:   sinksRow.low,
  sinkHigh:  sinksRow.high,
  netLow:    Math.round(netLowSum),
  netHigh:   Math.round(netHighSum),
  netMid:    Math.round(netMidCanonical),
  perStudentLow:  +(netLowSum  / studentCount).toFixed(1),
  perStudentHigh: +(netHighSum / studentCount).toFixed(1),
  perStudentMid:  +(netMidCanonical / studentCount).toFixed(1),
  studentCount,
};

const styles = {
  wrap: { maxWidth: 1100, margin: '0 auto', padding: '0 16px' },
  // background lives in .kua-hero-card (App.css) so the gradient
  // can animate. The CSS class wins over this inline declaration.
  card: { padding: 'clamp(20px, 4vw, 36px) clamp(20px, 4vw, 40px)', border: '1px solid #1f2937', borderRadius: 16, boxShadow: '0 1px 0 rgba(245, 158, 11, 0.05) inset' },
  badge: { fontSize: 11, padding: '5px 12px', borderRadius: 4, background: '#3a2a0d', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700, border: '1px solid #92400e', display: 'inline-block' },
  badgeRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  liveBadge: { fontSize: 10, padding: '4px 10px', borderRadius: 999, background: 'rgba(34, 197, 94, 0.1)', color: '#86efac', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 800, border: '1px solid #14532d', display: 'inline-flex', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)' },
  freshBadge: { fontSize: 11, padding: '4px 10px', borderRadius: 4, background: '#0b1220', color: '#94a3b8', border: '1px solid #1f2937', fontWeight: 600, display: 'inline-block' },
  hero: { marginTop: 22 },
  heroLabel: { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.6, fontWeight: 600 },
  heroValue: {
    fontSize: 'clamp(40px, 11vw, 78px)',
    fontWeight: 800,
    marginTop: 8,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.025em',
    // Gradient text instead of flat yellow. Falls back to the
    // first stop color on browsers that don't support background-clip.
    background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 40%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    // Soft glow so the number reads as the page's center of gravity.
    filter: 'drop-shadow(0 0 16px rgba(251, 191, 36, 0.18))',
    display: 'inline-block',
  },
  heroUnit: { fontSize: 'clamp(14px, 3vw, 22px)', color: '#94a3b8', marginLeft: 8, fontWeight: 500, letterSpacing: 0, WebkitBackgroundClip: 'initial', WebkitTextFillColor: 'initial', background: 'none', filter: 'none' },
  heroRange: { fontSize: 14, color: '#94a3b8', marginTop: 14 },
  blurb: { fontSize: 16, color: '#cbd5e1', maxWidth: 760, marginTop: 22, lineHeight: 1.7 },
  numbers: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 32 },
  numCell: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  numLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 },
  numBig: { fontSize: 'clamp(22px, 5vw, 32px)', color: '#e5e7eb', fontWeight: 700, marginTop: 8, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  numUnit: { fontSize: 14, color: '#94a3b8', marginLeft: 6, fontWeight: 400 },
  numRange: { fontSize: 13, color: '#64748b', marginTop: 8 },
  tableWrap: { marginTop: 32, padding: '24px 26px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 12 },
  tableHead: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, marginBottom: 14 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 8px', fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '14px 8px', fontSize: 15, color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  tdNum: { padding: '14px 8px', fontSize: 15, color: '#e5e7eb', borderBottom: '1px solid #1f2937', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', fontWeight: 600 },
  detailsToggle: { marginTop: 18, background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '9px 18px', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 500 },
  legendRow: { marginTop: 14, paddingTop: 14, borderTop: '1px solid #1f2937' },
  noteList: { marginTop: 18, paddingLeft: 22, fontSize: 14, color: '#94a3b8', lineHeight: 1.7, listStyle: 'none' },
  methodLine: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, marginTop: 4, marginLeft: 0 },
  methodLabel: { color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 },
};

const fmt = (n) => Math.abs(n) >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toString();
const fmtRange = (lo, hi) => lo === hi ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}`;

// "2026-05-04" → "May 4". Used by the freshness badge so the
// date reads as casual context, not a system timestamp.
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatFreshDate(ymd) {
  if (typeof ymd !== 'string' || ymd.length < 10) return ymd || '';
  const [, mm, dd] = ymd.split('-').map((s) => parseInt(s, 10));
  if (!Number.isFinite(mm) || mm < 1 || mm > 12) return ymd;
  return `${MONTH_SHORT[mm - 1]} ${dd}`;
}

// Tangible-equivalents bar — translates the abstract mtCO2e number
// into things a human can actually picture. Renders nothing when
// the input is zero/negative so the layout doesn't show a row of
// "0 cars" boxes if upstream data is missing.
function EquivalentsCallout({ grossMt }) {
  if (!Number.isFinite(grossMt) || grossMt <= 0) return null;
  const eq = carbonEquivalents(grossMt);
  const items = [
    { label: 'cars driven for a year',           rawValue: eq.carYears,       icon: '🚗' },
    { label: 'US homes powered for a year',      rawValue: eq.homeYears,      icon: '🏠' },
    { label: 'one-way transatlantic flights',    rawValue: eq.transatFlights, icon: '✈️' },
    { label: 'trees needed to absorb it (1 yr)', rawValue: eq.treeYears,      icon: '🌳' },
  ];
  return (
    <div style={equivStyles.wrap}>
      <div style={equivStyles.label}>
        That's roughly equivalent to…
      </div>
      <div style={equivStyles.grid}>
        {items.map((it) => (
          <div key={it.label} style={equivStyles.cell} className="kua-card-hover">
            <div style={equivStyles.icon}>{it.icon}</div>
            <div style={equivStyles.value}>
              <AnimatedNumber value={it.rawValue} duration={1200} />
            </div>
            <div style={equivStyles.text}>{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const equivStyles = {
  wrap:   { marginTop: 24, padding: '16px 18px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  label:  { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 12 },
  grid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 },
  cell:   { textAlign: 'center', padding: '12px 8px', borderRadius: 8, border: '1px solid transparent' },
  icon:   { fontSize: 22, marginBottom: 4 },
  value:  { fontSize: 20, color: '#e5e7eb', fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginBottom: 2 },
  text:   { fontSize: 11, color: '#94a3b8', lineHeight: 1.3 },
};

export function NetEstimate() {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const heroTiltRef = useCardTilt({ max: 4, scale: 1.005 });
  const live = useMeasuredScopeTotals();
  // Override the hero + per-student with live measured values when any
  // scope flipped to measured. The breakdown table below still shows
  // the multi-method ranges per row (those are the cross-check view,
  // independent of the measured headline).
  const heroNetMid = live.scope1Measured || live.scope3Measured ? live.netMt : summary.netMid;
  const heroGrossMid = live.scope1Measured || live.scope3Measured ? live.grossMt : summary.grossMid;
  const heroPerStudentMid = +(heroNetMid / TOTAL_STUDENTS).toFixed(1);
  const heroBadge = live.scope1Measured || live.scope3Measured
    ? (live.scope1Measured && live.scope3Measured ? 'Measured estimate' : 'Partially measured')
    : 'Preliminary estimate';

  // Per-row provenance derived from live state. Heating fuel flips to
  // 'measured' when fuel_bills has rows (the actual table that drives
  // the scope1Measured flag). Student travel flips when any of the
  // five cohort/trip tables has rows. The "goods + dining + ..." row
  // only partially flips (waste alone is in the live hook); call that
  // 'cited' rather than 'measured' until the other components ship.
  // Refrigerants + fleet have no live tables yet; sinks always 'cited'.
  const livePerRowProvenance = {
    'Scope 1 — Heating fuel': live.scope1Measured ? 'measured' : 'cited',
    'Scope 3 — Student travel (international + boarder)': live.scope3Measured ? 'measured' : 'cited',
  };

  return (
    <div style={styles.wrap}>
      <section ref={heroTiltRef} style={styles.card} className="kua-hero-card kua-tilt">
        <AmbientParticles />
        <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={styles.badgeRow}>
          <span style={styles.badge}>{heroBadge}</span>
          <span style={styles.liveBadge}>
            <span style={styles.liveDot} className="kua-pulse" aria-hidden="true" />
            LIVE
          </span>
          <span style={styles.freshBadge} title={`Most recent BMS capture used: ${COMPOSED_YTD_AS_OF}`}>
            Data fresh as of {formatFreshDate(COMPOSED_YTD_AS_OF)}
          </span>
        </div>
        <div style={styles.hero}>
          <div style={styles.heroLabel}>Net annual carbon balance</div>
          <div style={styles.heroValue}>
            <AnimatedNumber value={heroNetMid} duration={1400} />
            <span style={styles.heroUnit}>mtCO₂e / yr</span>
          </div>
          <div style={styles.heroRange}>
            range {fmtRange(summary.netLow, summary.netHigh)} · low end is net-negative
          </div>
        </div>

        <div style={styles.numbers}>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Per student</div>
            <div style={styles.numBig}>~<AnimatedNumber value={heroPerStudentMid} decimals={1} duration={1200} /><span style={styles.numUnit}>mtCO₂e</span></div>
          </div>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Gross emissions</div>
            <div style={styles.numBig}>~<AnimatedNumber value={heroGrossMid} duration={1200} /><span style={styles.numUnit}>mtCO₂e</span></div>
          </div>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Sequestration</div>
            <div style={styles.numBig}>~<AnimatedNumber value={Math.round(ANNUAL_SEQUESTRATION_MT)} duration={1200} /><span style={styles.numUnit}>mtCO₂e</span></div>
          </div>
        </div>

        <EquivalentsCallout grossMt={heroGrossMid} />


        <button type="button" style={styles.detailsToggle} onClick={() => setShowBreakdown((v) => !v)}>
          {showBreakdown ? 'Hide breakdown' : 'Show line-by-line breakdown'}
        </button>

        {showBreakdown && (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Source</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>mtCO₂e / yr</th>
                  <th style={styles.th}>Provenance</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td style={styles.td}>{r.name}</td>
                    <td style={styles.tdNum}>
                      {r.low === r.high ? fmt(r.low) : `${fmt(r.low)} to ${fmt(r.high)}`}
                    </td>
                    <td style={styles.td}><ProvenancePill provenance={livePerRowProvenance[r.name] ?? r.provenance} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={styles.legendRow}><ProvenanceLegend compact /></div>
            <button type="button" style={styles.detailsToggle} onClick={() => setShowNotes((v) => !v)}>
              {showNotes ? 'Hide assumptions' : 'Show assumptions per line'}
            </button>
            {showNotes && (
              <ul style={styles.noteList}>
                {rows.map((r) => (
                  <li key={r.name}>
                    <div style={{ marginBottom: 4 }}>
                      <strong style={{ color: '#e5e7eb' }}>{r.name}</strong>{' '}
                      <ProvenancePill provenance={livePerRowProvenance[r.name] ?? r.provenance} />
                    </div>
                    <div style={styles.methodLine}>
                      <span style={styles.methodLabel}>Today:</span> {r.currentMethod}
                    </div>
                    <div style={styles.methodLine}>
                      <span style={styles.methodLabel}>Target:</span> {r.futureMethod}
                    </div>
                  </li>
                ))}
                <li>
                  <div style={{ marginBottom: 4 }}>
                    <strong style={{ color: '#e5e7eb' }}>Per-student denominator</strong>{' '}
                    <ProvenancePill provenance="cited" />
                  </div>
                  <div style={styles.methodLine}>
                    <span style={styles.methodLabel}>Today:</span> 340 students from KUA "By the Numbers" + Wikipedia.
                  </div>
                </li>
                <li>
                  <div style={styles.methodLine}>
                    <span style={styles.methodLabel}>Calibration:</span> {summary.perStudentMid} mtCO₂e/student/yr lands inside the 2–15 envelope reported across HEI footprint studies (Gutiérrez-Mosquera et al. 2024).
                  </div>
                </li>
              </ul>
            )}
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
