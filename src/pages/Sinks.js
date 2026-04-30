import React from 'react';
import { EducationalCard } from '../components/EducationalCard';

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
