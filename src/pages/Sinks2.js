import React from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import {
  forestStands,
  soilSamples,
  TOTAL_FOREST_ACRES,
  ANNUAL_SEQUESTRATION_MT,
  soilCarbonStored,
} from '../data/sinks.js';

// Sinks OS module — forest + soil sequestration. Mirrors the Renewables
// module pattern. Lives at /sinks-os to avoid colliding with the older
// /sinks page during transition.

const TYPE_COLORS = {
  mixed_hardwood: '#22c55e',
  softwood:       '#0ea5e9',
  transitional:   '#fbbf24',
  open_grown:     '#a855f7',
};

export default function Sinks() {
  const sortedStands = [...forestStands].sort((a, b) => (b.acres * b.mtco2eAcreYr) - (a.acres * a.mtco2eAcreYr));

  // Soil carbon: average %OC across samples, applied to total acreage.
  const avgOC = soilSamples.length
    ? soilSamples.filter((s) => s.depthCm <= 30).reduce((s, x) => s + x.percentOrganicC, 0) /
      soilSamples.filter((s) => s.depthCm <= 30).length
    : 0;
  const totalSoilStored = soilCarbonStored(avgOC, TOTAL_FOREST_ACRES);

  return (
    <ModulePage
      title="Carbon Sinks"
      subtitle="On-campus carbon drawdown — what KUA's roughly 1,000 acres of forest and the soil under it pull out of the air every year. Most peer schools don't measure their sinks at all; that gap is the single biggest reason KUA's net footprint reads near zero."
    >
      <MetricGrid metrics={[
        { label: 'Forest acres',        value: TOTAL_FOREST_ACRES.toLocaleString(), accent: '#22c55e' },
        { label: 'Annual sequestration', value: ANNUAL_SEQUESTRATION_MT.toFixed(0), unit: 'mtCO₂e/yr', accent: '#86efac', note: 'Stand-weighted' },
        { label: 'Soil carbon stored',   value: Math.round(totalSoilStored).toLocaleString(), unit: 'mtCO₂e', accent: '#fbbf24', note: 'Top 30 cm' },
        { label: 'Forest stands',        value: forestStands.length, accent: '#22d3ee' },
      ]} />

      <ModuleSection
        title="Forest stands"
        hint="Sequestration rates from Birdsey 1992 (US-forest accumulation by region/age) and Nowak 2013 (open-grown urban-tree canopy). Open-grown trees grow faster per acre than dense forest because they aren't competing for light."
      >
        <div style={styles.list}>
          {sortedStands.map((s) => {
            const annual = s.acres * s.mtco2eAcreYr;
            return (
              <div key={s.id} style={{ ...styles.row, borderLeftColor: TYPE_COLORS[s.type] || '#94a3b8' }}>
                <div style={{ flex: 1 }}>
                  <div style={styles.head}>
                    <div style={styles.name}>{s.name}</div>
                    <Pill kind="info">{s.ageClass.replace('_', ' ')}</Pill>
                  </div>
                  <div style={styles.meta}>
                    {s.acres} acres · {s.mtco2eAcreYr} mt/acre/yr · {s.dominantSpecies}
                  </div>
                </div>
                <div style={styles.annual}>
                  <div style={styles.annualValue}>{annual.toFixed(0)}</div>
                  <div style={styles.annualUnit}>mtCO₂e/yr</div>
                </div>
              </div>
            );
          })}
        </div>
      </ModuleSection>

      <ModuleSection
        title="Soil sampling program"
        hint="Soil organic carbon to 30 cm — the fraction of campus carbon that's locked underground. Sampled by UNH Cooperative Extension."
      >
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Stand</th>
              <th style={styles.th}>Sampled</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Depth</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>% OC</th>
              <th style={styles.th}>Lab</th>
            </tr>
          </thead>
          <tbody>
            {soilSamples.map((s) => {
              const stand = forestStands.find((st) => st.id === s.standId);
              return (
                <tr key={s.id}>
                  <td style={styles.td}>{stand?.name ?? s.standId}</td>
                  <td style={{ ...styles.td, color: '#94a3b8' }}>{s.sampledAt}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{s.depthCm} cm</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: s.percentOrganicC >= 5 ? '#86efac' : s.percentOrganicC >= 3 ? '#fbbf24' : '#fca5a5' }}>
                    {s.percentOrganicC.toFixed(1)}%
                  </td>
                  <td style={{ ...styles.td, color: '#94a3b8', fontSize: 12 }}>{s.lab}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ModuleSection>

      <ModuleSection
        title="Methodology + caveats"
        hint="Sequestration accounting is genuinely uncertain. These notes go with every sink figure surfaced elsewhere in the OS."
      >
        <ul style={styles.notes}>
          <li><strong>Annual flux vs stock.</strong> The "annual sequestration" figure is a flux — how fast new carbon is being added each year. The "soil carbon stored" figure is a stock — how much is sitting in the top 30 cm right now.</li>
          <li><strong>Range.</strong> Birdsey 1992 reports US-forest accumulation rates of 0.6–6.7 mtCO₂e/acre/yr depending on age, species, and site quality. We use mid-range stand-specific rates and label the totals as preliminary until inventory work tightens them.</li>
          <li><strong>Permanence risk.</strong> Forest carbon is reversible. A windthrow event, beetle kill, or fire releases it. Sequestration claims should always carry that disclaimer in any external report.</li>
          <li><strong>Additionality.</strong> KUA didn't plant these forests as an offset — they were already here. That's still legitimate to measure, but it's not the same thing as creating new offsets, and it shouldn't be sold as carbon credits without a verified registry process.</li>
        </ul>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  list: { display: 'grid', gap: 8 },
  row: { display: 'flex', gap: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22c55e', borderRadius: 8, alignItems: 'center' },
  head: { display: 'flex', alignItems: 'center', gap: 10 },
  name: { fontSize: 15, color: '#e5e7eb', fontWeight: 700 },
  meta: { fontSize: 13, color: '#94a3b8', marginTop: 6 },
  annual: { textAlign: 'right' },
  annualValue: { fontSize: 22, color: '#86efac', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  annualUnit: { fontSize: 11, color: '#64748b', marginTop: 4 },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },

  notes: { margin: 0, paddingLeft: 22, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 },
};
