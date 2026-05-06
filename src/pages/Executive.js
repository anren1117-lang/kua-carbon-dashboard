import React from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { ProvenancePill, ProvenanceLegend } from '../components/ProvenancePill.js';
import { EnergyEquivalents } from '../components/EnergyEquivalents.js';
import { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E } from '../data/gridMix.js';
import { SCOPE_TOTALS as SCOPE_TOTALS_CENTRAL, GROSS_MT as GROSS_MT_CENTRAL } from '../data/scopeTotals.js';
import { reductionActionsByVisibility } from '../data/reductionActions.js';
import { ANNUAL_SEQUESTRATION_MT, TOTAL_FOREST_ACRES } from '../data/sinks.js';
import { SOLAR_ANNUAL_KWH } from '../data/renewables.js';
import { TOTAL_STUDENTS } from '../data/students.js';
import { TOTAL_STAFF } from '../data/staff.js';
import { rankActions } from '../utils/hotspots.js';
import { carbonEquivalents } from '../utils/equivalents.js';
import { monthlyPattern } from '../data/seasonalPatterns.js';
import { Sparkline } from '../components/Sparkline.js';

// Executive Dashboard — what a head of school or trustee should see in
// the first 30 seconds. Aggregates the most-load-bearing numbers from
// every OS module and links to the page that owns each one.

const KG_PER_KWH = (GRID_MIX_TOTAL_MTCO2E * 1000) / GRID_MIX_TOTAL_KWH;

// Scope totals come from the single-source-of-truth file
// scopeTotals.js so this page automatically picks up new measured
// values when fuel deliveries / Sodexo invoices / etc. land. Local
// alias keeps the existing JSX call-sites unchanged.
const SCOPE_TOTALS = SCOPE_TOTALS_CENTRAL;
const GROSS_MT = GROSS_MT_CENTRAL;
const NET_MT = GROSS_MT - ANNUAL_SEQUESTRATION_MT;

export default function Executive() {
  // Executive view = leadership decisions only. Public actions are
  // per-student behavioral commitments and don't belong in the same
  // ranked queue as institutional levers (different unit basis, different
  // owner, different decision-maker). Public actions live on /actions.
  const adminActions = reductionActionsByVisibility('admin');
  const ranked = rankActions(adminActions);
  const top3 = ranked.slice(0, 3);
  const totalActionImpact = adminActions.reduce((s, a) => s + a.expectedReductionMtCO2e, 0);
  const cEq = carbonEquivalents(GROSS_MT);
  const perStudent = NET_MT / TOTAL_STUDENTS;

  // Personal-action multiplier: each public action's per-student annual
  // savings × enrollment = the campus-scale impact if every student
  // adopts the behavior. We rank by this campus number (not the
  // per-student number) because that's the lever from a leadership
  // perspective — should the school fund a behavioral campaign?
  const personalActions = reductionActionsByVisibility('public');
  const personalRanked = personalActions
    .map((a) => ({ action: a, campusMt: a.expectedReductionMtCO2e * TOTAL_STUDENTS }))
    .sort((x, y) => y.campusMt - x.campusMt);
  const totalPersonalCampusMt = personalRanked.reduce((s, r) => s + r.campusMt, 0);
  // Matched personal-vs-policy pairs. Each row pits a single behavioral
  // commitment (student, ×340) against the school-side policy that
  // targets the same emission source. When personal-side > policy-side,
  // the campaign is a better use of leadership attention than the
  // matching policy debate. We pull dynamically from data so future
  // edits to reductionActions.js automatically flow through.
  const findP = (id) => personalActions.find((a) => a.id === id);
  const findA = (id) => adminActions.find((a) => a.id === id);
  const matchedPairs = [
    { theme: 'Dining',    personalId: 'ra_choose_chicken',   policyId: 'ra_beef_cut20',         personalLabel: 'Every student picks chicken or vegetarian over beef',                policyLabel: '20% beef cut in dining menus' },
    { theme: 'Commuting', personalId: 'ra_carpool_offcampus', policyId: 'ra_commute_policy',     personalLabel: 'Every student carpools to off-campus events with 3+ riders',         policyLabel: 'Faculty/staff commute incentive policy' },
    { theme: 'Energy',    personalId: 'ra_short_showers',    policyId: 'ra_led_retrofit',        personalLabel: 'Every student keeps showers to 4 minutes',                           policyLabel: 'Replace remaining T8 fluorescents with LEDs' },
    { theme: 'Waste',     personalId: 'ra_compost_clean',    policyId: 'ra_compost_expand',      personalLabel: 'Every student sorts food waste cleanly (no contamination)',          policyLabel: 'Expand compost collection to all dining stations' },
  ]
    .map(({ theme, personalId, policyId, personalLabel, policyLabel }) => {
      const p = findP(personalId);
      const a = findA(policyId);
      if (!p || !a) return null;
      const personalCampus = p.expectedReductionMtCO2e * TOTAL_STUDENTS;
      const policyCampus = a.expectedReductionMtCO2e;
      return {
        theme,
        personalLabel,
        policyLabel,
        personalCampus,
        policyCampus,
        delta: personalCampus - policyCampus,
      };
    })
    .filter(Boolean);

  return (
    <ModulePage
      title="Executive Dashboard"
      subtitle="The numbers a head of school or trustee should see first. Each card links to the OS module that owns the underlying data."
    >
      <MetricGrid metrics={[
        { label: 'Net annual emissions', value: Math.round(NET_MT).toLocaleString(), unit: 'mtCO₂e', accent: '#fbbf24', note: `${perStudent.toFixed(2)} per student` },
        { label: 'Gross emissions',      value: Math.round(GROSS_MT).toLocaleString(), unit: 'mtCO₂e', accent: '#ef4444' },
        { label: 'Forest sequestration', value: Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString(), unit: 'mtCO₂e/yr', accent: '#22c55e', note: `${TOTAL_FOREST_ACRES.toLocaleString()} acres` },
        { label: 'On-campus solar',      value: SOLAR_ANNUAL_KWH.toLocaleString(), unit: 'kWh/yr', accent: '#86efac', note: 'Whittemore array' },
      ]} />

      <ModuleSection
        title="Data provenance"
        hint="What the four numbers above are actually based on, plus the upgrade path that will replace each placeholder with measured data."
      >
        <ProvenanceLegend />
        <div style={execProvStyles.list}>
          <ExecProvRow
            provenance="estimated"
            label={`Net annual emissions (${Math.round(NET_MT).toLocaleString()} mt)`}
            today="Derived from gross − sinks; inherits the lowest-confidence inputs from below."
            target="Becomes 'cited' the moment the two estimated scope rows below ship to measured."
          />
          <ExecProvRow
            provenance="estimated"
            label={`Gross emissions (${Math.round(GROSS_MT).toLocaleString()} mt)`}
            today="Scope 1 (~1,250 mt dashboard placeholder; bottom-up cross-check ~1,351 mt central, range 891–1,867 across 3 methods × 3 components) + Scope 2 (cited from BMS-measured kWh × ISO-NE 2024 per-fuel output factors × ~2.5 seasonally-anchored annualization, ±5% measured band) + Scope 3 (~2,700 mt dashboard placeholder; bottom-up cross-check ~2,635 mt central, range 1,726–3,720 across 3-4 methods × 8 components). See /admin/methodology for the per-component method-by-method breakdown."
            target="Scope 1 → KUA fuel-delivery invoices × EPA Stationary Combustion factors. Scope 3 → travel office records + business-office spend mapped to USEEIO sectors + hauler invoices for waste."
          />
          <ExecProvRow
            provenance="estimated"
            label={`Forest sequestration (${Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()} mt)`}
            today="7 named forest stands × per-acre rates inside IPCC LULUCF ranges. Total acreage (~1,000) is cited but the per-stand subdivision and individual acreages are invented."
            target="Commission a USFS Forest Inventory & Analysis-style stand inventory: real species composition, age class, basal area, per-stand acreage. Per-acre rates stay; inputs become real."
          />
          <ExecProvRow
            provenance="cited"
            label={`On-campus solar (${SOLAR_ANNUAL_KWH.toLocaleString()} kWh/yr)`}
            today="Anchored on MEASURED April 2026 BMS production (1,692 kWh from 2 metered arrays — PM_15_RoofTopSolarFeed + PM_15_FieldSolarFeed; PM_19_SolarFeed is a NET-CONSUMER feed and excluded) × NREL PVWatts NH seasonal-shape factor — April produces ~10% of annual generation. Result is well below the prior PVWatts-only model because the parser now sign-flips backwards-CT readings instead of double-counting parasitic load as generation."
            target="Capture a full 12 months of BMS production data → SOLAR_ANNUAL_KWH flips fully measured (~April 2027). The PM_19 feed needs Facilities to investigate whether it's a backwards-CT install or genuinely consuming energy."
          />
        </div>
      </ModuleSection>

      <ModuleSection
        title="Where the gross number comes from"
        hint="Click any row to drill into that scope's detail."
      >
        <div style={styles.scopeList}>
          <ScopeRow
            to="/scope-1"
            label="Scope 1 — direct (heating fuel + fleet + refrigerants)"
            mt={SCOPE_TOTALS.scope1Mt}
            share={(SCOPE_TOTALS.scope1Mt / GROSS_MT) * 100}
            color="#fbbf24"
            scopeKey="scope1"
          />
          <ScopeRow
            to="/scope-2"
            label="Scope 2 — purchased electricity"
            mt={SCOPE_TOTALS.scope2Mt}
            share={(SCOPE_TOTALS.scope2Mt / GROSS_MT) * 100}
            color="#22d3ee"
            scopeKey="scope2"
          />
          <ScopeRow
            to="/scope-3"
            label="Scope 3 — travel, food, waste, procurement"
            mt={SCOPE_TOTALS.scope3Mt}
            share={(SCOPE_TOTALS.scope3Mt / GROSS_MT) * 100}
            color="#ef4444"
            scopeKey="scope3"
          />
          <ScopeRow
            to="/sinks-os"
            label="Sinks — forest sequestration (subtracts)"
            mt={-ANNUAL_SEQUESTRATION_MT}
            share={(ANNUAL_SEQUESTRATION_MT / GROSS_MT) * 100}
            color="#22c55e"
            sinks
          />
        </div>
      </ModuleSection>

      <ModuleSection
        title="Top institutional levers"
        hint="Policy + facility decisions ranked by impact × urgency × confidence. Full queue on the admin Actions page."
      >
        <div style={styles.actionList}>
          {top3.map(({ action }, i) => (
            <Link key={action.id} to="/admin/actions" style={styles.actionRow}>
              <div style={styles.actionRank}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.actionTitle}>{action.title}</div>
                <div style={styles.actionMeta}>
                  ~{action.expectedReductionMtCO2e} mtCO₂e/yr · {action.estimatedCostUsd === 0 ? 'no cost' : `$${action.estimatedCostUsd.toLocaleString()}`} · {action.owner}
                </div>
              </div>
              <Pill kind={action.urgency === 'high' ? 'bad' : action.urgency === 'medium' ? 'warn' : 'neutral'}>
                {action.urgency}
              </Pill>
            </Link>
          ))}
        </div>
        <div style={styles.actionFoot}>
          {adminActions.length} institutional actions in queue · {totalActionImpact.toFixed(0)} mtCO₂e/yr potential if every one ships · student-side commitments live on the public <Link to="/actions" style={{ color: '#86efac' }}>Actions</Link> page
        </div>
      </ModuleSection>

      <ModuleSection
        title={`Personal action × ${TOTAL_STUDENTS} students`}
        hint="Behavioral campaigns aren't engagement theater. At our enrollment, several student-side habits are larger campus levers than the matching institutional policy — worth funding as much as a facility upgrade."
      >
        <div style={styles.personalHero}>
          <div style={styles.personalHeroNum}>
            {Math.round(totalPersonalCampusMt).toLocaleString()}
            <span style={styles.personalHeroUnit}>mtCO₂e/yr</span>
          </div>
          <div style={styles.personalHeroLabel}>
            if every student adopts every personal action — {(totalPersonalCampusMt / GROSS_MT * 100).toFixed(1)}% of KUA's gross emissions, roughly {(totalPersonalCampusMt / ANNUAL_SEQUESTRATION_MT * 100).toFixed(0)}% of what our forest sequesters annually
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: '#fbbf24' }}>
            <ProvenancePill provenance="estimated" /> per-student kg/yr values are placeholders sized to plausible behavior-change benchmarks (Project Drawdown, EPA WARM, ICAO). Treat campus totals as order-of-magnitude until a behavior-survey baseline is taken.
          </div>
        </div>

        {matchedPairs.length > 0 && (
          <>
            <div style={styles.personalCompareSectionTitle}>
              Where student behavior outperforms the matching policy
            </div>
            <div style={styles.matchedGrid}>
              {matchedPairs.map((pair, i) => {
                const personalWins = pair.delta > 0;
                return (
                  <div key={i} style={{ ...styles.matchedCard, borderLeftColor: personalWins ? '#22c55e' : '#f59e0b' }}>
                    <div style={styles.matchedTheme}>{pair.theme}</div>
                    <div style={styles.matchedRow}>
                      <div style={styles.matchedLeft}>
                        <div style={styles.matchedLabel}>{pair.personalLabel}</div>
                        <div style={styles.matchedNumGreen}>{pair.personalCampus.toFixed(0)}<span style={styles.matchedUnit}>mt/yr</span></div>
                        <div style={styles.matchedSub}>×{TOTAL_STUDENTS} students</div>
                      </div>
                      <div style={styles.matchedVs}>vs</div>
                      <div style={styles.matchedRight}>
                        <div style={styles.matchedLabel}>{pair.policyLabel}</div>
                        <div style={styles.matchedNumAmber}>{pair.policyCampus.toFixed(0)}<span style={styles.matchedUnit}>mt/yr</span></div>
                        <div style={styles.matchedSub}>policy lever</div>
                      </div>
                    </div>
                    <div style={styles.matchedDelta}>
                      {personalWins
                        ? `Student behavior wins by ${pair.delta.toFixed(0)} mtCO₂e/yr`
                        : `Policy lever wins by ${(-pair.delta).toFixed(0)} mtCO₂e/yr — but only if dining services adopts it`}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div style={styles.personalList}>
          {personalRanked.map(({ action, campusMt }, i) => (
            <Link key={action.id} to="/actions" style={styles.personalRow}>
              <div style={styles.personalRank}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.personalTitle}>{action.title}</div>
                <div style={styles.personalMeta}>
                  {Math.round(action.expectedReductionMtCO2e * 1000)} kg/student/yr × {TOTAL_STUDENTS} students
                </div>
              </div>
              <div style={styles.personalNum}>
                {campusMt < 1
                  ? `${Math.round(campusMt * 1000).toLocaleString()} kg`
                  : `${campusMt.toFixed(1)} mt`}
                <span style={styles.personalNumUnit}>CO₂e/yr</span>
              </div>
            </Link>
          ))}
        </div>
        <div style={styles.actionFoot}>
          Per-student kg figures from the Actions page · students multiply by {TOTAL_STUDENTS} (current enrollment) · adoption rates of 30–50% are realistic for sustained campaigns
        </div>
      </ModuleSection>

      <ModuleSection
        title="Carbon equivalents"
        hint="Translation layer for the gross emissions figure — useful in trustee + parent communications."
      >
        <div style={styles.eqGrid}>
          <EqCell icon="🚗" value={cEq.carYears.toLocaleString()} label="cars driven for a year" />
          <EqCell icon="🌳" value={cEq.treeYears.toLocaleString()} label="tree-years to absorb" />
          <EqCell icon="🏠" value={cEq.homeYears.toLocaleString()} label="US homes powered for a year" />
          <EqCell icon="✈️" value={cEq.transatFlights.toLocaleString()} label="transatlantic flights" />
          <EqCell icon="⛽" value={cEq.galsGasoline.toLocaleString()} label="gallons of gasoline" />
        </div>
      </ModuleSection>

      <ModuleSection
        title="Population denominators"
        hint="Per-student / per-staff intensity is sensitive to how these are counted. Using the data-layer rosters."
      >
        <MetricGrid metrics={[
          { label: 'Students',         value: TOTAL_STUDENTS,         accent: '#22d3ee' },
          { label: 'Faculty + staff',  value: TOTAL_STAFF,            accent: '#fbbf24' },
          { label: 'mtCO₂e / student', value: perStudent.toFixed(2),  accent: '#86efac', note: 'Net basis' },
          { label: 'kWh / student',    value: Math.round(GRID_MIX_TOTAL_KWH / TOTAL_STUDENTS).toLocaleString(), accent: '#ef4444' },
        ]} />
      </ModuleSection>

      <ModuleSection
        title="Annual electricity equivalents"
        hint="From the kWh side — handy for assemblies and tours."
      >
        <EnergyEquivalents kwh={GRID_MIX_TOTAL_KWH} label="A year of campus electricity is equivalent to" />
      </ModuleSection>

      <ModuleSection title="Direct module links">
        <LinkGroup label="Operations & data" links={[
          { to: '/hotspots',        label: 'Hotspots' },
          { to: '/buildings',       label: 'Buildings' },
          { to: '/trends',          label: 'Trend Builder' },
          { to: '/methodology',     label: 'Methodology' },
          { to: '/data-admin',      label: 'Data Admin' },
        ]} />
        <LinkGroup label="By category" links={[
          { to: '/dining',          label: 'Dining' },
          { to: '/transportation',  label: 'Transportation' },
          { to: '/waste',           label: 'Waste' },
          { to: '/procurement',     label: 'Procurement' },
        ]} />
        <LinkGroup label="Reductions & drawdown" links={[
          { to: '/admin/actions',   label: 'Actions (institutional)' },
          { to: '/goals',           label: 'Goals & Targets' },
          { to: '/renewables-os',   label: 'Renewables' },
          { to: '/sinks-os',        label: 'Sinks' },
        ]} />
        <LinkGroup label="Reporting" links={[
          { to: '/report',          label: 'Annual Report' },
          { to: '/scenarios',       label: 'Scenarios' },
          { to: '/credits',         label: 'Carbon Credits' },
        ]} />
        <LinkGroup label="Student & faculty-facing" links={[
          { to: '/actions',         label: 'Actions (student-facing)' },
          { to: '/challenges',      label: 'Student Challenges' },
          { to: '/teacher',         label: 'Teacher Tools' },
          { to: '/chatbot',         label: 'Carbon Chatbot' },
        ]} />
      </ModuleSection>
    </ModulePage>
  );
}

// Approximate the per-scope monthly shape using the same monthly pattern
// the live ticker uses — Scope 2 follows ISO-NE seasonal grid usage, and
// Scope 1 is heavily heating-driven so we accentuate the winter peaks.
function scopeMonthlySeries(scopeKey, total) {
  const baseShape = monthlyPattern.map((m) => m.multiplier);
  let shape = baseShape;
  if (scopeKey === 'scope1') {
    // Steeper winter peak, near-zero summer trough.
    shape = baseShape.map((v) => Math.pow(v, 1.6));
  } else if (scopeKey === 'scope3') {
    // Peaks at fall/spring break travel; minor summer dip.
    shape = baseShape.map((v, i) => {
      const travelBoost = (i === 11 || i === 5 || i === 2) ? 1.18 : 1;
      return v * travelBoost;
    });
  }
  const sum = shape.reduce((s, v) => s + v, 0);
  return shape.map((v) => (v / sum) * total);
}

function ScopeRow({ to, label, mt, share, color, sinks, scopeKey }) {
  const series = scopeKey ? scopeMonthlySeries(scopeKey, Math.abs(mt)) : null;
  return (
    <Link to={to} style={{ ...styles.scopeRow, borderLeftColor: color }}>
      <div style={{ flex: 1 }}>
        <div style={styles.scopeLabel}>{label}</div>
        <div style={styles.scopeBar}>
          <div style={{ ...styles.scopeFill, width: `${Math.min(100, share)}%`, background: color }} />
        </div>
      </div>
      {series && (
        <div style={styles.scopeSpark}>
          {/* All twelve months are pure seasonal-pattern projections —
              no per-scope BMS measurement exists yet. Pass measured:false
              on every point so the Sparkline renders dashed. */}
          <Sparkline
            data={series.map((v, i) => ({
              value: v,
              measured: false,
              month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
            }))}
            color={color}
            fill={`${color}26`}
            width={120}
            height={32}
            formatValue={(v) => `${v.toFixed(1)} mt`}
            formatLabel={(d) => d?.month ?? ''}
          />
          <div style={styles.scopeSparkLabel}>monthly · projected</div>
        </div>
      )}
      <div style={styles.scopeNums}>
        <div style={{ ...styles.scopeMt, color: sinks ? '#86efac' : '#e5e7eb' }}>
          {sinks ? mt.toFixed(0) : Math.round(mt).toLocaleString()}
        </div>
        <div style={styles.scopeUnit}>mtCO₂e</div>
      </div>
    </Link>
  );
}

function LinkGroup({ label, links }) {
  return (
    <div style={styles.linkGroup}>
      <div style={styles.linkGroupLabel}>{label}</div>
      <div style={styles.linkGrid}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} style={styles.linkCard}>{l.label} →</Link>
        ))}
      </div>
    </div>
  );
}

function ExecProvRow({ provenance, label, today, target }) {
  return (
    <div style={execProvStyles.row}>
      <div style={execProvStyles.head}>
        <ProvenancePill provenance={provenance} />
        <span style={execProvStyles.label}>{label}</span>
      </div>
      <div style={execProvStyles.method}>
        <span style={execProvStyles.methodLabel}>Today:</span> {today}
      </div>
      <div style={execProvStyles.method}>
        <span style={execProvStyles.methodLabel}>Target:</span> {target}
      </div>
    </div>
  );
}

const execProvStyles = {
  list: { display: 'grid', gap: 12, marginTop: 14 },
  row: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  head: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 },
  label: { fontSize: 14, color: '#e5e7eb', fontWeight: 700 },
  method: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, marginTop: 4 },
  methodLabel: { color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 },
};

function EqCell({ icon, value, label }) {
  return (
    <div style={styles.eqCell}>
      <div style={styles.eqIcon}>{icon}</div>
      <div style={styles.eqValue}>{value}</div>
      <div style={styles.eqLabel}>{label}</div>
    </div>
  );
}

const styles = {
  scopeList: { display: 'grid', gap: 8 },
  scopeRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 8, color: 'inherit', textDecoration: 'none' },
  scopeLabel: { fontSize: 14, color: '#cbd5e1', fontWeight: 600 },
  scopeBar: { marginTop: 8, height: 8, background: '#0f172a', borderRadius: 4, overflow: 'hidden' },
  scopeFill: { height: '100%' },
  scopeSpark: { textAlign: 'center', minWidth: 120 },
  scopeSparkLabel: { fontSize: 10, color: '#64748b', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  scopeNums: { textAlign: 'right', minWidth: 90 },
  scopeMt: { fontSize: 22, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  scopeUnit: { fontSize: 11, color: '#64748b', marginTop: 4 },

  actionList: { display: 'grid', gap: 8 },
  actionRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: 'inherit', textDecoration: 'none' },
  actionRank: { fontSize: 14, color: '#fbbf24', fontWeight: 800, fontVariantNumeric: 'tabular-nums', minWidth: 30 },
  actionTitle: { fontSize: 14, color: '#e5e7eb', fontWeight: 700 },
  actionMeta: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  actionFoot: { marginTop: 12, fontSize: 12, color: '#64748b' },

  personalHero: { padding: '20px 22px', background: 'linear-gradient(135deg, #052e1a 0%, #0b1220 100%)', border: '1px solid #14532d', borderRadius: 10, marginBottom: 14 },
  personalHeroNum: { fontSize: 40, fontWeight: 800, color: '#86efac', lineHeight: 1, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 8 },
  personalHeroUnit: { fontSize: 16, color: '#86efac', fontWeight: 600, opacity: 0.8 },
  personalHeroLabel: { marginTop: 10, fontSize: 14, color: '#cbd5e1', lineHeight: 1.5 },
  personalCompareSectionTitle: { fontSize: 12, color: '#86efac', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 10, marginTop: 4 },
  matchedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 10, marginBottom: 14 },
  matchedCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22c55e', borderRadius: 8 },
  matchedTheme: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 10 },
  matchedRow: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 10 },
  matchedLeft: { textAlign: 'left' },
  matchedRight: { textAlign: 'left' },
  matchedLabel: { fontSize: 12, color: '#cbd5e1', lineHeight: 1.4, marginBottom: 6, minHeight: 32 },
  matchedNumGreen: { fontSize: 22, color: '#86efac', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 4 },
  matchedNumAmber: { fontSize: 22, color: '#fbbf24', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 4 },
  matchedUnit: { fontSize: 11, fontWeight: 600, opacity: 0.8 },
  matchedSub: { fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 600 },
  matchedVs: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, padding: '4px 6px', alignSelf: 'center' },
  matchedDelta: { marginTop: 12, paddingTop: 10, borderTop: '1px solid #1f2937', fontSize: 12, color: '#86efac', fontWeight: 600, lineHeight: 1.4 },
  personalList: { display: 'grid', gap: 6 },
  personalRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: 'inherit', textDecoration: 'none' },
  personalRank: { fontSize: 13, color: '#86efac', fontWeight: 800, fontVariantNumeric: 'tabular-nums', minWidth: 28 },
  personalTitle: { fontSize: 14, color: '#e5e7eb', fontWeight: 600 },
  personalMeta: { fontSize: 12, color: '#64748b', marginTop: 2, fontVariantNumeric: 'tabular-nums' },
  personalNum: { fontSize: 18, color: '#86efac', fontWeight: 800, fontVariantNumeric: 'tabular-nums', minWidth: 110, textAlign: 'right' },
  personalNumUnit: { fontSize: 10, color: '#64748b', marginLeft: 4, fontWeight: 600 },

  eqGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 },
  eqCell: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, textAlign: 'center' },
  eqIcon: { fontSize: 24 },
  eqValue: { fontSize: 22, color: '#e5e7eb', fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums', lineHeight: 1 },
  eqLabel: { fontSize: 11, color: '#94a3b8', marginTop: 6, lineHeight: 1.3 },

  linkGroup: { marginTop: 12 },
  linkGroupLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 8 },
  linkGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 },
  linkCard: { padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: '#cbd5e1', textDecoration: 'none', fontSize: 13, fontWeight: 600 },
};
