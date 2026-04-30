import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { ScopePageInfo } from '../components/ScopePageInfo';

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
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
          totalPrefix: '−', total: '~3,000', totalRange: '2,000 – 4,000 pulled out', perStudent: -5.0,
          thirdMetric: { label: 'Forested area', value: '~1,000', note: 'acres of campus forest' },
          note: 'KUA is the only school in the peer chart with a quantified physical sink. Roughly 1,000 acres of campus forest absorbs CO₂ via photosynthesis at 2.1–4.2 mtCO₂e per acre per year. On the optimistic end of the range, the forest pulls more carbon out of the air than the entire campus emits.',
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
          { action: 'Plant additional native canopy trees', impact: '+2 to +5 mtCO₂e/yr per 100 trees', detail: 'New trees sequester slowly at first (0.01–0.05 mtCO₂e/yr) but compound over decades. A 100-tree planting today is ~5 mtCO₂e/yr by year 30. Native maple/oak/birch best for NH climate.' },
          { action: 'Protect existing forested land from development', impact: '−500 to −2,000 mtCO₂e per acre converted', detail: 'Avoiding even 1 acre of forest-to-pavement conversion preserves both the standing biomass (≈ 117 mtCO₂e stored above ground per acre) AND the soil organic carbon (often 200+ mtCO₂e/acre). Land-use change is the highest-impact threat to the sink.' },
          { action: 'Forest stand management', impact: '+50 to +200 mtCO₂e/yr', detail: 'Selective thinning of suppressed trees increases growth rates of dominant trees and overall sequestration. Avoid clear-cutting; managed mature forests sequester more than monoculture plantations.' },
          { action: 'Reduce mowing on lawn-edges → meadow', impact: '+5 to +15 mtCO₂e/yr per acre converted', detail: 'Unmown native grass meadows store more soil carbon than mowed lawns and require zero gasoline mower emissions. Best on athletic-field perimeters.' },
          { action: 'Enable woody-debris decay (no burn pile)', impact: '+2 to +10 mtCO₂e/yr', detail: 'Standing and fallen deadwood decomposes slowly back into soil carbon, retaining ~50% of stored C. Burning releases it all immediately.' },
          { action: 'Annual tree inventory + canopy-cover analysis', impact: 'replaces estimate with measured', detail: 'The biggest reduction in uncertainty (not direct emissions). The Phase 1 fieldwork in the project plan turns the ±50% range on this line into a ±10% measured value.' },
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
