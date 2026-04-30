import React from 'react';
import { EducationalCard } from '../components/EducationalCard';

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
