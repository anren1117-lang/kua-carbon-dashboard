import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { ScopePageInfo } from '../components/ScopePageInfo';
import { SCOPE3_TOTAL_MT } from '../data/scopeTotals.js';
import { KG_PER_KWH } from '../data/gridMix.js';
import { REPORTING_PERIOD } from '../data/academicCalendar.js';
import { factorVintageFor, describeFactorVintage, SCOPE3_FACTOR_KEYS } from '../data/emissionFactors.js';
import { KUA_USAGE_YEAR as FACTOR_USAGE_YEAR } from '../data/gridMix.js';
import { SCOPE3_RANGE, SCOPE3_INTL_TRAVEL } from '../data/geographicEstimates.js';

import { TOTAL_STUDENTS } from '../data/students.js';
import { useMeasuredScope3 } from '../hooks/useMeasuredScope3.js';
import { ScopeBreakdownPanel } from '../components/ScopeBreakdownPanel.js';

// One fewer round trip per international student. Derived from the published
// four-method range rather than a distance assumption private to this page:
// the cohort flies ~1.6 RTs/yr, so dropping one saves 1/1.6 of the total.
const INTL_ONE_FEWER_RT_MT = Math.round(SCOPE3_INTL_TRAVEL.central / 1.6);
const INTL_PER_RT_MT = +(SCOPE3_INTL_TRAVEL.central / 50 / 1.6).toFixed(1);

const SCOPE3_PER_STUDENT = +(SCOPE3_TOTAL_MT / TOTAL_STUDENTS).toFixed(2);

const categories = [
  { num: 1, name: 'Purchased Goods & Services', desc: 'Embodied emissions of food, paper, supplies, equipment, materials.', factor: 'EPA Supply Chain GHG Emission Factors (EEIO, spend-based)', status: 'Planned' },
  { num: 3, name: 'Fuel & Energy-Related (Upstream)', desc: 'Well-to-pump emissions for heating oil, propane, and grid electricity.', factor: 'EPA upstream factors (~15–20% of combustion)', status: 'Planned' },
  { num: 5, name: 'Waste Generated in Operations', desc: 'Landfill, recycling, composting; includes avoided virgin material and fugitive landfill methane.', factor: 'EPA WARM model', status: 'In dashboard (waste table)' },
  { num: 6, name: 'Business Travel', desc: 'Faculty/staff flights, trains, hotels, mileage on KUA business.', factor: 'EPA Hub (ground); DEFRA (air, incl. indirect non-CO₂ effects)', status: 'In dashboard (faculty_travel)' },
  { num: 7, name: 'Employee Commuting', desc: 'Daily travel of non-resident faculty and staff to campus.', factor: 'EPA per-passenger-mile by mode', status: 'Planned' },
  { num: '+', name: 'Student Travel', desc: 'Term-break, international, and athletic team travel — likely the single largest Scope 3 source.', factor: 'Per-passenger-mile by mode (Yale-style addition)', status: 'In dashboard (day/us/intl/study_abroad)' },
];

const styles = {
  title: { margin: 0, fontSize: 36, fontWeight: 700 },
  subtitle: { marginTop: 10, color: '#94a3b8', maxWidth: 760, fontSize: 17, lineHeight: 1.6 },
  excluded: { marginTop: 16, padding: 12, background: '#0f172a', border: '1px dashed #334155', borderRadius: 8, color: '#94a3b8', fontSize: 13 },
  list: { marginTop: 24, display: 'grid', gap: 12 },
  item: { background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, padding: 16 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' },
  cat: { fontSize: 12, color: '#64748b', letterSpacing: 1 },
  name: { fontSize: 18, fontWeight: 600 },
  status: { fontSize: 12, color: '#22d3ee', textTransform: 'uppercase' },
  desc: { marginTop: 6, color: '#cbd5e1' },
  factor: { marginTop: 6, fontSize: 12, color: '#64748b' },

  cohortPanel: { marginTop: 28, padding: '24px 26px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 12 },
  cohortHead: { marginBottom: 16 },
  cohortTitle: { fontSize: 16, color: '#e5e7eb', fontWeight: 700, letterSpacing: 0.4 },
  cohortSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.5, maxWidth: 760 },
  cohortTable: { width: '100%', borderCollapse: 'collapse' },
  cohortTh: { textAlign: 'left', padding: '10px 8px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  cohortTd: { padding: '12px 8px', fontSize: 14, color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
};

function Scope3() {
  // Live upgrade: any rows in day_students / us_boarding_students /
  // international_students / study_abroad / faculty_travel / waste flip
  // the headline + provenance pill from estimated → measured. Components
  // without records still surface as 'estimated' inside the breakdown.
  const live = useMeasuredScope3();
  const isMeasured = live.measured && !live.loading && !live.error;
  const dataIssue = live.error ? `Live data unavailable (${live.error}). Showing the bottom-up estimate below.` : null;
  const headlineTotal = isMeasured ? live.totalMt : SCOPE3_TOTAL_MT;
  const headlinePerStudent = +(headlineTotal / TOTAL_STUDENTS).toFixed(2);
  const headlineProvenance = isMeasured ? 'measured' : 'estimated';
  const headlineNote = isMeasured
    ? `${live.note} Likely the largest scope at KUA. International student round trips to Asia (~${INTL_PER_RT_MT} mtCO₂e each) are the highest per-student line item.`
    : `Likely the largest scope at KUA, in line with Kool (2025) at Royal Roads University where student air travel dwarfed every other category. International student round trips to Asia (~${INTL_PER_RT_MT} mtCO₂e each) are the highest per-student line item.`;

  return (
    <div>
      <h1 style={styles.title}>Scope 3 — Other Indirect Emissions</h1>
      <p style={styles.subtitle}>
        Implemented incrementally; the GHG Protocol defines fifteen categories, and this dashboard
        includes the subset most relevant to a residential secondary school.
      </p>
      <div style={styles.excluded}>
        Categories 9 (downstream transportation) and 12 (end-of-life of sold products) do not apply
        to a school and are excluded from the inventory by design.
      </div>

      <EducationalCard
        title="Scope 3 is everything else — and usually the largest"
        sections={[
          {
            heading: 'The hidden majority',
            body: [
              'Scope 1 + 2 is the carbon you can see from the parking lot — boilers, the fuel truck, the meter. Scope 3 is everything indirect: the food in the dining hall, the laptops in classrooms, the flights students take home for break.',
              'Across higher-education footprint studies, Scope 3 typically represents 50–80% of total emissions. It\'s also the hardest category to measure because the data lives outside the institution.',
              'For a residential boarding school, student travel can dwarf every other category combined — Kool (2025) at Royal Roads University found 28 million km of student air travel in a single pre-COVID year, more than every other emissions source put together.',
            ],
            citation: 'Valls-Val & Bovea (2021); Gutiérrez-Mosquera et al. (2024); Kool (2025).',
          },
          {
            heading: 'Why we implement it incrementally',
            body: [
              'The GHG Protocol defines 15 Scope 3 categories. We add them one at a time — each requires its own data source, methodology, and uncertainty assessment.',
              'Two categories (downstream transportation, end-of-life of sold products) don\'t apply because schools don\'t sell physical products. We list them publicly as excluded rather than silently dropping them.',
              'The Yale-style "student travel" addition isn\'t a numbered category, but for residential schools it\'s materially the most important — so we track it as a first-class line.',
            ],
          },
          {
            heading: 'What you can do',
            body: [
              'Term-break travel: one fewer round trip per year usually beats anything you can change at the dorm level.',
              'Mode choice: train and bus often emit less than half what flying does on the same route.',
              'Group travel: 4 people in one car emits roughly 1/4 the per-person emissions of 4 separate trips.',
            ],
          },
        ]}
      />

      <ScopePageInfo
        color="#8b5cf6"
        estimate={{
          total: `${isMeasured ? '' : '~'}${headlineTotal.toLocaleString()}`,
          totalRange: `${SCOPE3_RANGE.low.toLocaleString()} – ${SCOPE3_RANGE.high.toLocaleString()} mt. The three student-travel components are genuine cross-checks — a built-up calculation beside an independently published benchmark (EPA SLD / Andover-Exeter / Yale). Dining, waste, commute, goods and upstream fuel are parameter sensitivities on one model each, so their spread measures assumption dependence rather than agreement between sources.`,
          perStudent: headlinePerStudent,
          thirdMetric: { label: 'Dominant source', value: 'Purchased goods', note: 'goods ~1,315 mt ≈ 50% of S3; travel ~760 mt ≈ 29%' },
          period: REPORTING_PERIOD.label,
          factorVintage: describeFactorVintage(factorVintageFor(SCOPE3_FACTOR_KEYS, FACTOR_USAGE_YEAR)),
          dataIssue,
          provenance: headlineProvenance,
          note: headlineNote,
          currentMethod: `Bottom-up estimate. Student travel uses Yale-style cohort method × KUA-specific fingerprint (~82 day commuters Upper Valley local, ~208 US boarders Northeast-skewed, ~50 international East-Asia heavy) cross-checked against Andover/Exeter peer benchmarks and source-country distance splits. Goods: EEIO spend-based across $2.5-4M procurement scenarios × EPA Supply Chain GHG Emission Factors v1.3. Waste: 420 people × per-day generation × diversion-split scenarios × EPA Hub 2025 Table 9 (Scope 3 Cat 5). Commuting: 52 staff × Upper Valley ACS distribution × ICCT effective fleet. Dining: actual boarding/day meal mix (~217K student meals + 50K faculty/staff) × 0.70-1.10 kg CO2e/meal. Upstream fuel: 12-22% uplift on bottom-up Scope 1. Student travel is genuinely cross-checked (a built-up calculation beside an independently published benchmark); goods, waste, commuting, dining and upstream fuel are one model each run at several parameter values, so their spread measures assumption dependence rather than agreement. Together they give ${SCOPE3_RANGE.low.toLocaleString()}–${SCOPE3_RANGE.high.toLocaleString()} mt total — see /admin/methodology.`,
          futureMethod: 'Each subcategory ships independently and flips estimated → cited as inputs become real. Travel: KUA travel office departure logs + study abroad ledger + athletics bus routes. Dining (Cat 1 portion): Sodexo/SAGE invoices × USEEIO food-sector factors + Project Drawdown overlay. Waste: hauler invoices (tons by stream). Procurement: Business Office annual spend mapped to USEEIO sectors. Commuting: HR zip-code survey × ICCT fleet fuel-economy. The methodologies are already standard; only KUA-specific inputs are pending.',
        }}
        references={[
          { title: 'Kool, B. (2025)', source: 'Sustainability Accounting at Royal Roads University', use: 'Student air travel scale at residential institutions' },
          { title: 'EPA Supply Chain GHG Emission Factors v1.3', use: 'Spend-based factors for purchased goods (Cat 1) — kg CO₂e per 2022 USD at purchaser prices, AR5' },
          { title: 'EPA GHG Emission Factors Hub 2025, Table 9 (Scope 3 Cat 5)', use: 'Landfill 0.58, recycling 0.09, composting 0.11 mtCO₂e per short ton. Avoided emissions are EXCLUDED, so recycling and composting are smaller emissions rather than credits — the negative figures shown here previously answered the wrong question for an inventory.' },
          { title: 'DEFRA 2024 Conversion Factors for Company Reporting', use: 'Air travel per passenger-km, economy, using the factor set that INCLUDES the indirect effects of non-CO₂ emissions (not a multiplier applied on top)' },
          { title: 'Greenhouse Gas Protocol Scope 3 Standard', source: 'WRI/WBCSD 2011', use: 'Defines all 15 Scope 3 categories; Cat 9 and Cat 12 explicitly excluded for schools' },
          { title: 'Yale Office of Sustainability', use: 'Student-travel category methodology adapted for KUA boarding-school context' },
        ]}
        actions={[
          {
            action: 'One fewer round-trip flight per international student',
            impact: `−${INTL_ONE_FEWER_RT_MT} mtCO₂e/yr`,
            detail: `If all ~50 international students replace one home trip per year with an extended on-campus stay (e.g., during shoulder break), the saving is 50 students × 1 round trip × ~${INTL_PER_RT_MT} mtCO₂e per round trip. The single highest-leverage individual choice in the entire dashboard.`,
            data: [
              { input: 'Per-round-trip central', value: `~${INTL_PER_RT_MT} mtCO₂e`, source: 'Central of the four published methods in geographicEstimates.js (ICAO+DEFRA weighted 4.00, explicit source-country split 3.63, Yale benchmark 3.13, two-RT-plus-summer 4.06)' },
              { input: 'DEFRA long-haul economy factor', value: '0.20011 kg CO₂e/passenger-km', source: 'DEFRA 2024, long-haul economy, incl. indirect non-CO₂ effects' },
              { input: 'International cohort size', value: '~50 students', source: 'KUA enrollment estimate' },
            ],
            math: [
              `per_round_trip = central of 4 methods = ${INTL_PER_RT_MT} mtCO₂e (range 3.13–4.06)`,
              `cohort_savings  = ${SCOPE3_INTL_TRAVEL.central.toFixed(0)} mt total ÷ 1.6 RTs/yr = ${INTL_ONE_FEWER_RT_MT} mtCO₂e/yr`,
              '',
              '# Range across the four published methods:',
              `# low  (Yale benchmark)      = ${Math.round(SCOPE3_INTL_TRAVEL.low / 1.6)} mt`,
              `# high (two-RT-plus-summer)  = ${Math.round(SCOPE3_INTL_TRAVEL.high / 1.6)} mt`,
            ],
          },
          {
            action: 'Carpooling for US-boarder term-break travel',
            impact: '−33 to −67 mtCO₂e/yr',
            detail: 'Drive-share groups for the Boston/NYC corridors. A 4-person carpool vs 4 separate trips cuts per-passenger emissions by 75%.',
            data: [
              { input: 'Solo car emission factor', value: '0.2986 kg CO₂e/passenger-mi', source: 'EPA GHG Emission Factors Hub 2025, Table 10 (Scope 3 Cat 6/7), Passenger Car — CO₂e at AR5' },
              { input: 'Carpool factor (2 occupants)', value: '0.1493 kg CO₂e/passenger-mi', source: 'EPA Hub Table 10 (per-passenger after dividing by occupants)' },
              { input: 'Avg one-way distance for US boarders', value: '~300 mi (BOS region) to ~1,500 mi (cross-country)', source: 'KUA enrollment ZIP distribution estimate' },
              { input: 'Round trips per year per US boarder', value: '3 – 4 (Thanksgiving, winter, spring, summer)', source: 'Boarding-school break calendar' },
            ],
            math: [
              '# Assume 50 of 208 US boarders within ground-driving distance (<500 mi)',
              '# Average drive distance one-way: 350 mi',
              '',
              'baseline = 50 students × 4 trips × 2 (round) × 350 mi × 0.2986 = 41,804 kg = 41.8 mtCO₂e',
              'carpool  = 50 students × 4 trips × 2 × 350 mi × 0.1493 = 20,902 kg = 20.9 mtCO₂e',
              'savings  = 41.8 − 20.9 = 20.9 mtCO₂e/yr (per pair carpooling)',
              '',
              '# Higher participation + 4-person carpools yields 45-90 mt range',
            ],
          },
          {
            action: 'Train/bus over plane for sub-1,000-mile travel',
            impact: '−11 to −18 mtCO₂e/yr',
            detail: 'Faculty business travel within the Northeast corridor. Trains emit ~78% less per passenger-mile than short-haul flights — comparing DEFRA factor sets that both include the indirect effects of non-CO₂ emissions.',
            data: [
              { input: 'Short-haul air factor', value: '0.18287 kg CO₂e/passenger-km (~0.294/mi)', source: 'DEFRA 2024 short-haul economy, incl. indirect non-CO₂ effects' },
              { input: 'US passenger rail factor', value: '0.041 kg CO₂e/passenger-km (~0.066/mi)', source: 'DEFRA 2024 rail; Amtrak Sustainability Report' },
              { input: 'Faculty annual NE-corridor trips', value: '~80 round trips at ~600 mi avg', source: 'KUA business travel estimate' },
            ],
            math: [
              'flying  = 80 trips × 2 × 600 mi × 0.294 = 28,253 kg = 28.3 mtCO₂e',
              'train   = 80 trips × 2 × 600 mi × 0.066 =  6,336 kg =  6.3 mtCO₂e',
              'savings = 28.3 − 6.3 = 22.0 mtCO₂e/yr (full mode shift)',
              '',
              '# Realistic 50–80% mode shift: 11 to 18 mtCO₂e/yr',
            ],
          },
          {
            action: 'Local food procurement (regional sourcing)',
            impact: '−15 to −60 mtCO₂e/yr',
            detail: 'Regional supply chains have lower transportation emissions. EPA Supply Chain factors are roughly 15–30% lower for local food sourcing.',
            data: [
              { input: 'Annual food spend (school dining)', value: '~$1.5M (estimate)', source: 'Boarding school operations norms' },
              { input: 'EEIO factor — national supply', value: '0.55 kg CO₂e/USD', source: 'EPA Supply Chain GHG Emission Factors v1.3' },
              { input: 'EEIO factor — regional supply', value: '~0.40 kg CO₂e/USD', source: 'EPA Supply Chain (regional categories)' },
              { input: 'Practical local procurement share', value: '15 – 40%', source: 'Real Food Challenge case studies' },
            ],
            math: [
              'baseline = $1,500,000 × 0.55 = 825,000 kg = 825 mtCO₂e/yr',
              'best_case = $1,500,000 × 0.40 = 600,000 kg = 600 mtCO₂e/yr (full local)',
              'reduction_per_USD = 0.15 kg CO₂e',
              '',
              '# 15% local procurement: $225,000 × 0.15 = 33.7 mtCO₂e/yr',
              '# 40% local procurement: $600,000 × 0.15 = 90 mtCO₂e/yr',
              '# Discounted for actual displacement: 15-60 mt/yr',
            ],
          },
          {
            action: 'Compost diversion from landfill',
            impact: '−10 to −24 mtCO₂e/yr',
            detail: 'Each ton of food waste diverted from landfill (0.58 mtCO₂e/ton) to composting (0.11 mtCO₂e/ton) saves ~0.47 mtCO₂e/ton. Composting still emits — a smaller emission, not a credit — but it avoids the fugitive methane landfilled food produces.',
            data: [
              { input: 'School food waste generation', value: '~80 – 150 lb/student/yr', source: 'Food Recovery Network surveys' },
              { input: 'Student count', value: '340', source: 'KUA published enrollment' },
              { input: 'WARM landfill factor', value: '+580 kg CO₂e/ton', source: 'EPA GHG Emission Factors Hub 2025, Table 9 — Mixed MSW landfilled (0.58 mt/short ton)' },
              { input: 'WARM compost factor', value: '+110 kg CO₂e/ton', source: 'EPA GHG Emission Factors Hub 2025, Table 9 — Food waste composted (0.11 mt/short ton)' },
            ],
            math: [
              'food_waste_tons = 340 students × 100 lb/yr / 2,000 lb/ton = 17 tons',
              'baseline_emissions = 17 tons × 580 kg/ton = 9,860 kg = 9.86 mtCO₂e',
              'compost_emissions  = 17 tons × 110 kg/ton = 1,870 kg = 1.87 mtCO₂e',
              'savings = 9.86 − 1.87 = 7.99 mtCO₂e/yr at 100% diversion',
              '',
              '# Range with realistic diversion rates (50-100%) and waste levels: 10-24',
            ],
          },
          {
            action: 'Electric school buses for athletic team travel',
            impact: '−4 to −10 mtCO₂e/yr',
            detail: 'EV buses on the NE grid emit ~75% less per mile than diesel. Modest absolute number, but highly visible to the student body and reduces local air pollution near athletic fields.',
            data: [
              { input: 'Diesel emission factor', value: '10.21 kg CO₂/gal', source: 'EPA GHG Hub Mobile Combustion 2024' },
              { input: 'School bus fuel economy', value: '6 – 8 mpg', source: 'EPA SmartWay' },
              { input: 'Athletic team annual mileage', value: '~5,000 – 12,000 mi/yr per bus', source: 'School transportation estimates' },
              { input: 'Electric bus efficiency', value: '~2.0 kWh/mi', source: 'NREL electric school bus data' },
              { input: 'ISO-NE inventory emission factor', value: `${KG_PER_KWH} kg/kWh`, source: 'Per-fuel output factors at ISO-NE 2024 mix — the inventory average' },
            ],
            math: [
              '# Per bus per year (8,000 mi at 7 mpg):',
              'diesel_emissions = 8,000 / 7 × 10.21 = 11,668 kg = 11.7 mtCO₂e',
              `ev_emissions     = 8,000 × 2.0 × ${KG_PER_KWH} = ${Math.round(8000 * 2.0 * KG_PER_KWH).toLocaleString()} kg = ${(8000 * 2.0 * KG_PER_KWH / 1000).toFixed(1)} mtCO₂e`,
              'savings_per_bus  = 11.7 − 3.7 = 8.0 mtCO₂e/yr',
              '',
              '# Replacing 1 bus: 7 mt; partial fleet replacement: 4-10 mt',
            ],
          },
        ]}
      />

      <ScopeBreakdownPanel
        breakdown={live.breakdown}
        color="#8b5cf6"
        title="Where Scope 3 comes from"
        subtitle="Six components, each with its own provenance. The largest single line in the whole inventory is here — roughly half of Scope 3 — and appeared as no number anywhere on this page before now."
      />

      {isMeasured && Array.isArray(live.cohortDetail) && (
        <section style={styles.cohortPanel}>
          <div style={styles.cohortHead}>
            <div style={styles.cohortTitle}>Per-cohort student travel</div>
            <div style={styles.cohortSubtitle}>
              Live measured row-counts × cited per-cohort factors. The
              dashboard headline above sums these plus the trip-level
              study-abroad / faculty-travel rows.
            </div>
          </div>
          <table style={styles.cohortTable}>
            <thead>
              <tr>
                <th style={styles.cohortTh}>Cohort</th>
                <th style={{ ...styles.cohortTh, textAlign: 'right' }}>Count</th>
                <th style={{ ...styles.cohortTh, textAlign: 'right' }}>Per-student</th>
                <th style={{ ...styles.cohortTh, textAlign: 'right' }}>mtCO₂e/yr</th>
                <th style={styles.cohortTh}>Provenance</th>
              </tr>
            </thead>
            <tbody>
              {live.cohortDetail.map((c) => (
                <tr key={c.cohort}>
                  <td style={styles.cohortTd}>
                    <div style={{ fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.4 }}>{c.method}</div>
                  </td>
                  <td style={{ ...styles.cohortTd, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.count.toLocaleString()}</td>
                  <td style={{ ...styles.cohortTd, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#94a3b8' }}>
                    {c.perStudentMt !== null ? `${c.perStudentMt} mt` : '—'}
                  </td>
                  <td style={{ ...styles.cohortTd, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{c.mt.toLocaleString()}</td>
                  <td style={styles.cohortTd}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, background: c.provenance === 'measured' ? '#0e3a1f' : '#1f2937', color: c.provenance === 'measured' ? '#86efac' : '#94a3b8', border: `1px solid ${c.provenance === 'measured' ? '#16a34a' : '#475569'}` }}>
                      {c.provenance === 'measured' ? '✓ measured' : 'estimated'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <div style={styles.list}>
        {categories.map((c) => (
          <div key={c.name} style={styles.item}>
            <div style={styles.head}>
              <div>
                <div style={styles.cat}>CATEGORY {c.num}</div>
                <div style={styles.name}>{c.name}</div>
              </div>
              <div style={styles.status}>{c.status}</div>
            </div>
            <div style={styles.desc}>{c.desc}</div>
            <div style={styles.factor}>Emission factor: {c.factor}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Scope3;
