import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { ScopePageInfo } from '../components/ScopePageInfo';
import { SCOPE3_TOTAL_MT } from '../data/scopeTotals.js';
import { TOTAL_STUDENTS } from '../data/students.js';

const SCOPE3_PER_STUDENT = +(SCOPE3_TOTAL_MT / TOTAL_STUDENTS).toFixed(2);

const categories = [
  { num: 1, name: 'Purchased Goods & Services', desc: 'Embodied emissions of food, paper, supplies, equipment, materials.', factor: 'EPA Supply Chain GHG Emission Factors (EEIO, spend-based)', status: 'Planned' },
  { num: 3, name: 'Fuel & Energy-Related (Upstream)', desc: 'Well-to-pump emissions for heating oil, propane, and grid electricity.', factor: 'EPA upstream factors (~15–20% of combustion)', status: 'Planned' },
  { num: 5, name: 'Waste Generated in Operations', desc: 'Landfill, recycling, composting; includes avoided virgin material and fugitive landfill methane.', factor: 'EPA WARM model', status: 'In dashboard (waste table)' },
  { num: 6, name: 'Business Travel', desc: 'Faculty/staff flights, trains, hotels, mileage on KUA business.', factor: 'EPA Hub (ground); DEFRA (air, with radiative forcing)', status: 'In dashboard (faculty_travel)' },
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
};

function Scope3() {
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
          total: `~${SCOPE3_TOTAL_MT.toLocaleString()}`,
          totalRange: `${Math.round(SCOPE3_TOTAL_MT * 0.75).toLocaleString()} – ${Math.round(SCOPE3_TOTAL_MT * 1.25).toLocaleString()} (placeholder ±25%)`,
          perStudent: SCOPE3_PER_STUDENT,
          thirdMetric: { label: 'Dominant source', value: 'Travel', note: 'student travel ~70% of S3' },
          provenance: 'estimated',
          note: 'Likely the largest scope at KUA, in line with Kool (2025) at Royal Roads University where student air travel dwarfed every other category. International student round trips to Asia (~3 mtCO₂e each) are the highest per-student line item.',
          currentMethod: 'Hand-set assumptions × cited methodologies. Travel: ~50 international students × ~3 mtCO₂e per round trip + ~150 US boarders × 3-4 trips/yr × ~1 mt each + study abroad + athletic teams (ICAO calculator + DEFRA 2024 RF multiplier). Goods: EEIO spend-based using guessed annual spend × USEEIO sector factors. Waste: assumed tonnage × EPA WARM v15.1 net factors (+0.52 landfill, -0.10 recycling, +0.04 compost). Commuting: residential-school adjustment (most live on campus). Upstream fuel: ~15-20% uplift on Scope 1+2.',
          futureMethod: 'Each subcategory ships independently and flips estimated → cited as inputs become real. Travel: KUA travel office departure logs + study abroad ledger + athletics bus routes. Dining (Cat 1 portion): Sodexo/SAGE invoices × USEEIO food-sector factors + Project Drawdown overlay. Waste: hauler invoices (tons by stream). Procurement: Business Office annual spend mapped to USEEIO sectors. Commuting: HR zip-code survey × ICCT fleet fuel-economy. The methodologies are already standard; only KUA-specific inputs are pending.',
        }}
        references={[
          { title: 'Kool, B. (2025)', source: 'Sustainability Accounting at Royal Roads University', use: 'Student air travel scale at residential institutions' },
          { title: 'EPA Supply Chain GHG Emission Factors v1.2', use: 'Spend-based EEIO factors for purchased goods (Cat 1)' },
          { title: 'EPA Waste Reduction Model (WARM) v15', use: 'Net factors for landfill (+0.52), recycling (−0.10), composting (+0.04) kg CO₂e per ton' },
          { title: 'DEFRA 2024 Conversion Factors for Company Reporting', use: 'Air travel per-passenger-km with 1.9× radiative forcing multiplier' },
          { title: 'Greenhouse Gas Protocol Scope 3 Standard', source: 'WRI/WBCSD 2011', use: 'Defines all 15 Scope 3 categories; Cat 9 and Cat 12 explicitly excluded for schools' },
          { title: 'Yale Office of Sustainability', use: 'Student-travel category methodology adapted for KUA boarding-school context' },
        ]}
        actions={[
          {
            action: 'One fewer round-trip flight per international student',
            impact: '−146 mtCO₂e/yr',
            detail: 'If all ~50 international students replace one home trip per year with an extended on-campus stay (e.g., during shoulder break), the saving is 50 students × 1 round trip × ~2.9 mtCO₂e per round trip. The single highest-leverage individual choice in the entire dashboard.',
            data: [
              { input: 'Average distance international student → BOS', value: '~7,500 km one-way', source: 'Geographic average for major Asian/EU origins' },
              { input: 'DEFRA long-haul economy factor', value: '0.195 kg CO₂e/passenger-km', source: 'DEFRA Conversion Factors 2024 (with 1.9× radiative forcing multiplier)' },
              { input: 'International cohort size', value: '~50 students', source: 'KUA enrollment estimate' },
            ],
            math: [
              'per_round_trip = 7,500 km × 2 × 0.195 = 2,925 kg ≈ 2.93 mtCO₂e per student',
              'cohort_savings  = 50 students × 2.93 = 146 mtCO₂e/yr',
              '',
              '# Range depends on actual cohort size and distances:',
              '# 40 students × 2.5 mt = 100 mt',
              '# 70 students × 3.5 mt = 245 mt',
            ],
          },
          {
            action: 'Carpooling for US-boarder term-break travel',
            impact: '−45 to −90 mtCO₂e/yr',
            detail: 'Drive-share groups for the Boston/NYC corridors. A 4-person carpool vs 4 separate trips cuts per-passenger emissions by 75%.',
            data: [
              { input: 'Solo car emission factor', value: '0.404 kg CO₂e/passenger-mi', source: 'EPA GHG Hub Mobile Combustion (gasoline car, single occupant)' },
              { input: 'Carpool factor (2 occupants)', value: '0.202 kg CO₂e/passenger-mi', source: 'EPA Hub (per-passenger after dividing by occupants)' },
              { input: 'Avg one-way distance for US boarders', value: '~300 mi (BOS region) to ~1,500 mi (cross-country)', source: 'KUA enrollment ZIP distribution estimate' },
              { input: 'Round trips per year per US boarder', value: '3 – 4 (Thanksgiving, winter, spring, summer)', source: 'Boarding-school break calendar' },
            ],
            math: [
              '# Assume 50 of 150 US boarders within ground-driving distance (<500 mi)',
              '# Average drive distance one-way: 350 mi',
              '',
              'baseline = 50 students × 4 trips × 2 (round) × 350 mi × 0.404 = 56,560 kg = 56.6 mtCO₂e',
              'carpool  = 50 students × 4 trips × 2 × 350 mi × 0.202 = 28,280 kg = 28.3 mtCO₂e',
              'savings  = 56.6 − 28.3 = 28.3 mtCO₂e/yr (per pair carpooling)',
              '',
              '# Higher participation + 4-person carpools yields 45-90 mt range',
            ],
          },
          {
            action: 'Train/bus over plane for sub-1,000-mile travel',
            impact: '−25 to −55 mtCO₂e/yr',
            detail: 'Faculty business travel within the Northeast corridor. Trains emit ~70% less per passenger-mile than short-haul flights including radiative forcing.',
            data: [
              { input: 'Short-haul air factor', value: '0.246 kg CO₂e/passenger-km (~0.395/mi)', source: 'DEFRA 2024 short-haul economy with RF' },
              { input: 'US passenger rail factor', value: '0.041 kg CO₂e/passenger-km (~0.066/mi)', source: 'DEFRA 2024 rail; Amtrak Sustainability Report' },
              { input: 'Faculty annual NE-corridor trips', value: '~80 round trips at ~600 mi avg', source: 'KUA business travel estimate' },
            ],
            math: [
              'flying  = 80 trips × 2 × 600 mi × 0.395 = 37,920 kg = 37.9 mtCO₂e',
              'train   = 80 trips × 2 × 600 mi × 0.066 =  6,336 kg =  6.3 mtCO₂e',
              'savings = 31.6 mtCO₂e/yr (full mode shift)',
              '',
              '# Realistic 80% mode shift: 25 mt; with bus also: up to 55 mt',
            ],
          },
          {
            action: 'Local food procurement (regional sourcing)',
            impact: '−15 to −60 mtCO₂e/yr',
            detail: 'Regional supply chains have lower transportation emissions. EPA Supply Chain factors are roughly 15–30% lower for local food sourcing.',
            data: [
              { input: 'Annual food spend (school dining)', value: '~$1.5M (estimate)', source: 'Boarding school operations norms' },
              { input: 'EEIO factor — national supply', value: '0.55 kg CO₂e/USD', source: 'EPA Supply Chain GHG Emission Factors v1.2' },
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
            detail: 'Each ton of food waste diverted from landfill (+0.52 kg CO₂e/ton net) to composting (+0.04 kg CO₂e/ton) saves ~0.48 mtCO₂e/ton. Captures fugitive methane that would otherwise leak.',
            data: [
              { input: 'School food waste generation', value: '~80 – 150 lb/student/yr', source: 'Food Recovery Network surveys' },
              { input: 'Student count', value: '~600', source: 'KUA enrollment' },
              { input: 'WARM landfill factor', value: '+520 kg CO₂e/ton', source: 'EPA WARM v15 — mixed MSW' },
              { input: 'WARM compost factor', value: '+40 kg CO₂e/ton', source: 'EPA WARM v15 — food waste composted' },
            ],
            math: [
              'food_waste_tons = 340 students × 100 lb/yr / 2,000 lb/ton = 17 tons',
              'baseline_emissions = 17 × 520 = 8,840 kg = 8.84 mtCO₂e',
              'compost_emissions  = 17 × 40 = 680 kg = 0.68 mtCO₂e',
              'savings = 14.4 mtCO₂e/yr at 100% diversion',
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
              { input: 'ISO-NE effective emission factor', value: '0.235 kg/kWh', source: 'Per-fuel output factors at ISO-NE 2024 mix' },
            ],
            math: [
              '# Per bus per year (8,000 mi at 7 mpg):',
              'diesel_emissions = 8,000 / 7 × 10.21 = 11,668 kg = 11.7 mtCO₂e',
              'ev_emissions     = 8,000 × 2.0 × 0.235 = 3,760 kg = 3.8 mtCO₂e',
              'savings_per_bus  = 11.7 − 3.8 = 7.9 mtCO₂e/yr',
              '',
              '# Replacing 1 bus: 7 mt; partial fleet replacement: 4-10 mt',
            ],
          },
        ]}
      />

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
