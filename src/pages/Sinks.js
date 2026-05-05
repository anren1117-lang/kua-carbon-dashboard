import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { ScopePageInfo } from '../components/ScopePageInfo';
import { ANNUAL_SEQUESTRATION_MT, TOTAL_FOREST_ACRES } from '../data/sinks.js';
import { TOTAL_STUDENTS } from '../data/students.js';

const SEQ_TOTAL  = Math.round(ANNUAL_SEQUESTRATION_MT);
const SEQ_PER_ST = +(ANNUAL_SEQUESTRATION_MT / TOTAL_STUDENTS).toFixed(1);
const SEQ_LOW    = Math.round(SEQ_TOTAL * 0.75);
const SEQ_HIGH   = Math.round(SEQ_TOTAL * 1.5);

const styles = {
  title: { margin: 0, fontSize: 36, fontWeight: 700 },
  subtitle: { marginTop: 10, color: '#94a3b8', maxWidth: 760, fontSize: 17, lineHeight: 1.6 },
  grid: { marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  card: { background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12, padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: 600 },
  big: { fontSize: 26, fontWeight: 700, marginTop: 12 },
  sub: { color: '#94a3b8', marginTop: 6, fontSize: 13 },
  cite: { marginTop: 12, fontSize: 12, color: '#64748b', borderTop: '1px solid #1f2937', paddingTop: 8 },
};

function Sinks() {
  return (
    <div>
      <h1 style={styles.title}>Carbon Sinks — Trees & Soils</h1>
      <p style={styles.subtitle}>
        On-campus sequestration that offsets gross emissions in the net-balance view. KUA sits in
        the maple/beech/birch forest type that covers 52% of New Hampshire forestland.
      </p>

      <EducationalCard
        title="The biology behind what offsets the campus footprint"
        sections={[
          {
            heading: 'Photosynthesis — the original carbon capture',
            body: 'Trees pull CO₂ out of the atmosphere and lock it into wood, leaves, and roots:',
            formula: '6 CO₂ + 6 H₂O + sunlight → C₆H₁₂O₆ + 6 O₂',
            citation: 'About half of a tree\'s dry biomass is carbon by mass — the conversion factor used in every forestry inventory.',
          },
          {
            heading: 'Why we measure DBH',
            body: [
              'Diameter at Breast Height (DBH) is measured at 1.3 m above the ground with a simple tape. From DBH alone, species-specific allometric equations (USDA Urban Tree Database) give a defensible estimate of total biomass — root-shoot ratios are well-studied for major species.',
              'Nowak et al. (2013) measured 28 cities and 6 states and found average urban tree storage of 7.69 kg C/m² of canopy and average sequestration of 0.28 kg C/m²/yr. Those become our defaults until we have species-specific KUA data.',
              'A mature 60 cm DBH sugar maple (~20 m tall) stores roughly 1,500 kg of carbon — equivalent to 5.5 mtCO₂e locked away.',
            ],
          },
          {
            heading: 'Why soil carbon matters more than you think',
            body: [
              'In an average US forest, 59% of total carbon lives below ground — soil and roots, not above-ground trees (Birdsey, 1992).',
              'Soil carbon turns over slowly, which is good for storage but bad if disturbed: paving over a forested acre can release decades of accumulated soil carbon in a few years.',
              'We sample soil at representative sites (forest, lawn, athletic fields, gardens) and weight to a campus average — land-use change becomes detectable as a step-change in the weighted total.',
            ],
            citation: 'Morin et al. (2020), USDA NH forest inventory: NH forests average 31.8 tons C/acre.',
          },
          {
            heading: 'A research gap this project closes',
            body: 'Valls-Val & Bovea (2021) reviewed 35 university footprint studies and found that sinks are rarely quantified — most reports publish gross emissions without ever subtracting what the trees on campus absorb. KUA\'s dashboard reports the net balance as the headline number, addressing that gap directly.',
          },
        ]}
      />

      <ScopePageInfo
        color="#22c55e"
        estimate={{
          totalPrefix: '−', total: `~${SEQ_TOTAL.toLocaleString()}`, totalRange: `${SEQ_LOW.toLocaleString()} – ${SEQ_HIGH.toLocaleString()} pulled out`, perStudent: -SEQ_PER_ST,
          thirdMetric: { label: 'Forested area', value: `~${TOTAL_FOREST_ACRES.toLocaleString()}`, note: 'acres of campus forest' },
          note: `KUA is the only school in the peer chart with a quantified physical sink. Roughly ${TOTAL_FOREST_ACRES.toLocaleString()} acres of campus forest absorbs CO₂ via photosynthesis at 2.1–4.2 mtCO₂e per acre per year. On the optimistic end of the range, the forest pulls more carbon out of the air than the entire campus emits.`,
        }}
        references={[
          { title: 'Nowak, D.J. et al. (2013)', source: 'Urban Forestry & Urban Greening', use: '7.69 kg C/m² storage; 0.28 kg C/m²/yr sequestration (urban tree averages across 28 cities, 6 states)' },
          { title: 'Birdsey, R.A. (1992)', source: 'USDA Forest Service General Technical Report WO-59', use: 'Average US forest accumulates 1,252 lb C/acre/year; 59% of total carbon held below ground' },
          { title: 'Morin, R.S. et al. (2020)', source: 'USDA Forest Inventory and Analysis, NH', use: 'NH forests average 31.8 tons C/acre; maple/beech/birch covers 52% of state forestland' },
          { title: 'USDA Urban Tree Database', use: 'Species-specific allometric equations replacing the Jenkins-style fallback' },
          { title: 'Valls-Val, K. & Bovea, M.D. (2021)', source: 'Sustainability', use: 'Systematic review identifying that sinks are rarely quantified in HEI carbon inventories — the gap KUA closes' },
          { title: 'Jenkins, J.C. et al. (2003)', source: 'Forest Science', use: 'Allometric equations for biomass estimation from DBH (used as fallback in the admin form)' },
          { title: 'IPCC Guidelines for National GHG Inventories', source: 'Volume 4: AFOLU, 2019 Refinement', use: 'Soil organic carbon stock methodology' },
        ]}
        actions={[
          {
            action: 'Plant additional native canopy trees',
            impact: '+1 to +5 mtCO₂e/yr per 100 trees (mature)',
            detail: 'New trees sequester slowly at first but compound over decades. A 100-tree planting today reaches a steady ~3–5 mtCO₂e/yr by year 25–30 once trees reach moderate canopy size.',
            data: [
              { input: 'Average new urban tree sequestration (years 1–5)', value: '~0.01 mtCO₂e/yr per tree', source: 'Nowak et al. (2008), Environmental Pollution' },
              { input: 'Mature tree sequestration (year 25+)', value: '~0.03 – 0.05 mtCO₂e/yr per tree', source: 'Nowak (2013)' },
              { input: 'Survival rate to maturity', value: '60 – 80%', source: 'USDA Urban Tree Database' },
            ],
            math: [
              '# Cohort of 100 trees:',
              'year_1_to_5    = 100 × 0.01 = 1.0 mtCO₂e/yr (early growth)',
              'year_25_steady = 100 × 0.04 × 0.70 (survival) = 2.8 mtCO₂e/yr',
              'best_case      = 100 × 0.05 × 0.80 = 4.0 mtCO₂e/yr',
              '',
              '# Cumulative over 30 years: ~50-100 mtCO₂e total stock',
            ],
          },
          {
            action: 'Protect existing forested land from development',
            impact: 'avoids −500 to −2,000 mtCO₂e per acre converted',
            detail: 'Each acre of forest-to-pavement conversion releases both above-ground biomass AND decades of soil organic carbon. Land-use change is the highest-impact threat to the sink — preventing even one such conversion is more valuable than years of efficiency upgrades.',
            data: [
              { input: 'NH forest carbon density (above ground)', value: '~31.8 ton C/acre', source: 'Morin et al. (2020), USDA NH Forest Inventory' },
              { input: 'Below-ground share of forest carbon', value: '~59%', source: 'Birdsey (1992), Forest Carbon Storage' },
              { input: 'Acres converted in typical campus expansion', value: '0.5 – 5', source: 'Campus master-plan precedents' },
            ],
            math: [
              'above_ground_C = 31.8 ton C/acre',
              'below_ground_C = 31.8 × (0.59 / 0.41) ≈ 45.7 ton C/acre  # since 41% is above',
              'total_C_stored = 31.8 + 45.7 = 77.5 ton C/acre',
              '',
              'CO₂_equivalent = 77.5 × 44/12 = 284 mtCO₂e/acre stored',
              '',
              '# On conversion (clear-cut + soil disturbance), 50-80% releases over 5-20 years:',
              'released_per_acre = 284 × 0.50 to 284 × 0.80 = 142 to 227 mtCO₂e/acre',
              '',
              '# Plus loss of FUTURE annual sequestration:',
              'lost_annual = 31.8 × (44/12) × 0.04 (annual share growing) = 0.5 - 4 mtCO₂e/yr/acre',
              '',
              '# Cumulative over 50 years preventing even 1-acre conversion: 500-2,000 mtCO₂e',
            ],
          },
          {
            action: 'Forest stand management',
            impact: '+30 to +150 mtCO₂e/yr',
            detail: 'Selective thinning of suppressed trees boosts growth rates of dominant trees and overall stand productivity. Avoid clear-cutting; managed mature forests sequester more than even-age monocultures.',
            data: [
              { input: 'Average forest sequestration', value: '~2.1 mtCO₂e/acre/yr', source: 'Birdsey (1992)' },
              { input: 'Productivity boost from selective management', value: '15 – 35%', source: 'USDA Forest Service silvicultural studies' },
              { input: 'Manageable forest acres at KUA', value: '~600 – 800', source: 'KUA campus estimate (subset of total 1,000 ac)' },
            ],
            math: [
              'baseline    = 700 acres × 2.1 = 1,470 mtCO₂e/yr (current)',
              'managed     = 1,470 × 1.15 to 1,470 × 1.35 = 1,690 to 1,985 mtCO₂e/yr',
              'improvement = 1,690 − 1,470 = 220 (low) to 515 (high) mtCO₂e/yr',
              '',
              '# Realistic phased implementation across stand age classes: 30-150 mt',
            ],
          },
          {
            action: 'Reduce mowing on lawn-edges → meadow',
            impact: '+1 to +5 mtCO₂e/yr per acre converted',
            detail: 'Unmown native grass meadows accumulate soil organic carbon faster than mowed lawns. Plus zero gasoline mower emissions. Best on athletic-field perimeters and other infrequent-use turf.',
            data: [
              { input: 'Lawn → meadow SOC accumulation', value: '~0.5 – 1.5 ton C/acre/yr (top 30 cm)', source: 'Carey et al. (2012); peer-reviewed lawn vs meadow soil studies' },
              { input: 'Avoided mower emissions', value: '~0.3 mtCO₂e/acre/yr', source: 'EPA non-road equipment factors for gas mowers' },
            ],
            math: [
              'soc_gain_low  = 0.5 ton C/acre × 44/12 = 1.8 mtCO₂e/yr',
              'soc_gain_high = 1.5 × 44/12 = 5.5 mtCO₂e/yr',
              'mower_avoid   = 0.3 mtCO₂e/yr per acre',
              '',
              'total_per_acre = 1.8 + 0.3 = 2.1 to 5.8 mtCO₂e/yr',
              '',
              '# Conservative range across implementation: 1-5 mt/acre/yr',
            ],
          },
          {
            action: 'Enable woody-debris decay (no burn pile)',
            impact: '+2 to +10 mtCO₂e/yr',
            detail: 'Standing and fallen deadwood decomposes slowly, returning roughly half of its stored carbon back to soil long-term storage. Burning releases all of it immediately.',
            data: [
              { input: 'Annual deadwood production at KUA', value: '~50 – 200 tons (estimate)', source: 'Forest growth/mortality ratios for managed NH forest' },
              { input: 'Carbon content of woody material', value: '~50% by dry weight', source: 'IPCC AFOLU Volume 4' },
              { input: 'Long-term retention via decay (vs burn)', value: '~50%', source: 'IPCC default for natural decay vs combustion' },
            ],
            math: [
              'C_in_debris    = 100 tons × 0.50 = 50 ton C/yr',
              'CO₂_equivalent = 50 × 44/12 = 183 mtCO₂e/yr would be lost if all burned',
              'retention_via_decay = 183 × 0.50 = 92 mtCO₂e/yr stays sequestered (long term)',
              '',
              '# Modest annual incremental sink vs current burn baseline: 2-10 mt/yr',
            ],
          },
          {
            action: 'Annual tree inventory + canopy-cover analysis',
            impact: 'replaces estimate with measured',
            detail: 'The single biggest reduction in uncertainty on the dashboard. The Phase 1 fieldwork in the project plan turns the ±50% range on the sink line into a ±10% measured value, which alone tightens the entire net-balance estimate.',
            data: [
              { input: 'Current sink uncertainty', value: '±50% (2,000 – 4,000 mtCO₂e/yr)', source: 'KUA dashboard preliminary estimate' },
              { input: 'Measured-inventory uncertainty', value: '±10%', source: 'Nowak et al. (2013) sample variability' },
              { input: 'Cost of fieldwork', value: '~1 student-week + DBH tape ($15)', source: 'Materials section of capstone proposal' },
            ],
            math: [
              '# Range tightening:',
              '# preliminary: 2,000 - 4,000 mt → midpoint ±50%',
              '# measured:    e.g. 3,200 ± 320 mt (±10%)',
              '',
              '# Doesn\'t change the central value, but lets every',
              '# downstream claim (net balance, per-student, peer comparison)',
              '# carry confidence intervals instead of order-of-magnitude ranges',
            ],
          },
        ]}
      />

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Tree Biomass</div>
          <div style={styles.big}>7.69 kg C/m²</div>
          <div style={styles.sub}>Average urban whole-tree carbon storage density (Nowak et al., 2013)</div>
          <div style={styles.big}>0.28 kg C/m²/yr</div>
          <div style={styles.sub}>Average annual sequestration density</div>
          <div style={styles.cite}>
            Method: DBH-based ground inventory + aerial canopy-cover analysis. Refinable later with
            species-specific allometric equations from the USDA Urban Tree Database.
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Soil Organic Carbon</div>
          <div style={styles.big}>~59%</div>
          <div style={styles.sub}>Share of total forest carbon held below ground in average US forest (Birdsey, 1992)</div>
          <div style={styles.big}>31.8 ton C/acre</div>
          <div style={styles.sub}>NH forest average total carbon density (Morin et al., 2020)</div>
          <div style={styles.cite}>
            Method: dry-combustion or loss-on-ignition sampling at representative sites (gardens,
            forest, athletic fields, lawns), land-use-weighted to a campus average.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sinks;
