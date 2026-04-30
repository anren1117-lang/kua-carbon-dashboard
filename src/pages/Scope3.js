import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { ScopePageInfo } from '../components/ScopePageInfo';

const categories = [
  { num: 1, name: 'Purchased Goods & Services', desc: 'Embodied emissions of food, paper, supplies, equipment, materials.', factor: 'EPA Supply Chain GHG Emission Factors (EEIO, spend-based)', status: 'Planned' },
  { num: 3, name: 'Fuel & Energy-Related (Upstream)', desc: 'Well-to-pump emissions for heating oil, propane, and grid electricity.', factor: 'EPA upstream factors (~15–20% of combustion)', status: 'Planned' },
  { num: 5, name: 'Waste Generated in Operations', desc: 'Landfill, recycling, composting; includes avoided virgin material and fugitive landfill methane.', factor: 'EPA WARM model', status: 'In dashboard (waste table)' },
  { num: 6, name: 'Business Travel', desc: 'Faculty/staff flights, trains, hotels, mileage on KUA business.', factor: 'EPA Hub (ground); DEFRA (air, with radiative forcing)', status: 'In dashboard (faculty_travel)' },
  { num: 7, name: 'Employee Commuting', desc: 'Daily travel of non-resident faculty and staff to campus.', factor: 'EPA per-passenger-mile by mode', status: 'Planned' },
  { num: '+', name: 'Student Travel', desc: 'Term-break, international, and athletic team travel — likely the single largest Scope 3 source.', factor: 'Per-passenger-mile by mode (Yale-style addition)', status: 'In dashboard (day/us/intl/study_abroad)' },
];

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
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
          total: '~3,000', totalRange: '2,000 – 3,800', perStudent: 5.0,
          thirdMetric: { label: 'Dominant source', value: 'Travel', note: 'student travel ~70% of S3' },
          note: 'Likely the largest scope at KUA, in line with Kool (2025) at Royal Roads University where student air travel alone dwarfed every other category. International student round trips to Asia (~3 mtCO₂e each) are the single highest-impact line item per student affected.',
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
          { action: 'One fewer round-trip flight per international student', impact: '−150 to −200 mtCO₂e/yr', detail: 'If 50 international students replace one home trip per year with an extended on-campus stay (e.g., shoulder break), that\'s 50 × 3 mtCO₂e saved. The single highest-leverage individual choice in the entire dashboard.' },
          { action: 'Carpooling for US-boarder term-break travel', impact: '−50 to −100 mtCO₂e/yr', detail: 'Coordinated drive-share groups for the Boston/NYC corridors. A 4-person carpool vs 4 separate trips saves roughly 75% per passenger-mile.' },
          { action: 'Train/bus over plane for sub-1,000-mile travel', impact: '−30 to −60 mtCO₂e/yr', detail: 'Faculty business travel within the Northeast corridor. Trains emit ~70% less per passenger-mile than short-haul flights.' },
          { action: 'Local food procurement (regional sourcing)', impact: '−40 to −100 mtCO₂e/yr', detail: 'Food has higher EEIO factors than most categories (~0.55 kg CO₂e/$). Regional supply chains can cut transportation emissions and often have lower upstream factors.' },
          { action: 'Compost diversion from landfill', impact: '−10 to −25 mtCO₂e/yr', detail: 'Each ton of food waste shifted from landfill (+0.52) to composting (+0.04) saves ~0.48 mtCO₂e. Captures fugitive methane that would otherwise leak.' },
          { action: 'Electric school buses for athletic team travel', impact: '−5 to −15 mtCO₂e/yr', detail: 'EV buses on the NE grid emit ~60% less per mile than diesel. Modest absolute number but visible to the student body.' },
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
