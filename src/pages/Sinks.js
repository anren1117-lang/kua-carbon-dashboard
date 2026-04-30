import React from 'react';

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
