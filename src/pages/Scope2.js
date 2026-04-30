import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { ScopePageInfo } from '../components/ScopePageInfo';

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  card: { marginTop: 24, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, padding: 20 },
  row: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1f2937' },
  label: { color: '#94a3b8' },
  value: { fontWeight: 600 },
  link: { color: '#22d3ee' },
};

function Scope2() {
  return (
    <div>
      <h1 style={styles.title}>Scope 2 — Purchased Electricity</h1>
      <p style={styles.subtitle}>
        Indirect emissions from electricity delivered by Liberty Utilities (Granite State
        Electric). Quantity comes from the campus real-time meter; emission intensity uses the
        ISO New England regional factor with hourly grid-mix as a future refinement.
      </p>
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>Distribution utility</span>
          <span style={styles.value}>Liberty Utilities (Granite State Electric)</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Grid emission factor (location-based)</span>
          <span style={styles.value}>643 lb CO₂/MWh (ISO-NE 2024)</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Imported power factor</span>
          <span style={styles.value}>177 lb CO₂/MWh</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Quantity source</span>
          <span style={styles.value}>Campus real-time meter (subhourly)</span>
        </div>
        <div style={{ ...styles.row, borderBottom: 'none' }}>
          <span style={styles.label}>Reconciliation</span>
          <span style={styles.value}>Liberty monthly bill</span>
        </div>
      </div>
      <p style={{ marginTop: 24, color: '#94a3b8' }}>
        Live grid-mix and per-building energy data are rendered on the main Dashboard.
      </p>

      <ScopePageInfo
        color="#f59e0b"
        estimate={{
          total: '222', totalRange: 'documented · 222', perStudent: 0.4, documented: true,
          thirdMetric: { label: 'kWh consumed', value: '2.3M', note: 'campus-wide annual' },
          note: 'This is the only line currently sourced from real measurement: 2,316,469 kWh from the campus real-time meter × the ISO-NE 2024 grid emission factor. Liberty Utilities is the distribution utility but the meter is the source of truth.',
        }}
        references={[
          { title: 'ISO New England Electric Generator Air Emissions Report 2024', use: '643 lb CO₂/MWh in-region · 177 lb CO₂/MWh imported (Canadian hydro share)' },
          { title: 'EPA eGRID 2022', use: 'NPCC New England subregion emission rates for cross-validation' },
          { title: 'GHG Protocol Scope 2 Guidance', source: 'WRI/WBCSD 2015', use: 'Location-based vs market-based dual reporting framework' },
          { title: 'New Hampshire Public Utilities Commission', use: 'Liberty Utilities (Granite State Electric) tariff documentation' },
        ]}
        actions={[
          { action: 'Expand on-site solar PV', impact: '−40 to −100 mtCO₂e/yr', detail: 'Each additional 100 MWh of self-consumed solar displaces ~30 mtCO₂e of grid generation. Best ROI on rooftops with low shading and existing 3-phase service.' },
          { action: 'LED lighting retrofit campus-wide', impact: '−20 to −50 mtCO₂e/yr', detail: 'Modern LEDs use 60–80% less than fluorescents and 90% less than incandescent. Highest impact in old-stock fixtures with long daily run times (corridors, athletic facilities).' },
          { action: 'Smart HVAC scheduling', impact: '−15 to −30 mtCO₂e/yr', detail: 'Setback during nights, weekends, and breaks. Modern building automation systems pay for themselves in 1–3 years. Currently many KUA buildings run HVAC continuously.' },
          { action: 'Procure clean electricity supplier', impact: '−50 to −150 mtCO₂e/yr (market-based)', detail: 'NH has been deregulated since 1998. KUA can choose a competitive supplier sourcing from wind/hydro/solar without changing physical delivery. Shows up only in the market-based view to avoid double-counting.' },
          { action: 'Battery storage with time-of-use shifting', impact: '−5 to −15 mtCO₂e/yr', detail: 'Charge from solar/grid at low-emission hours (nights, when wind is high), discharge at peak hours. Modest reduction but enables demand-response revenue.' },
        ]}
      />


      <EducationalCard
        title="How Scope 2 actually works"
        sections={[
          {
            heading: 'The two-layer model',
            body: [
              'KUA never burns fuel to make electricity — but the power plants on the grid do, on KUA\'s behalf, every time someone flips a light switch.',
              'Scope 2 separates two things: how much electricity you used (kWh, from the meter) and how dirty that electricity was (kg CO₂ per kWh, from the grid operator).',
              'The dashboard handles them as separate inputs so when ISO-NE updates its annual factor, all historical kWh re-price automatically without breaking what was actually measured.',
            ],
          },
          {
            heading: 'Why ISO New England matters',
            body: 'ISO-NE runs the wholesale grid for the six New England states. They publish an annual Air Emissions Report that gives the average lb-CO₂-per-MWh of all generators feeding the regional grid. In 2024 that was 643 lb/MWh from in-region generation, and 177 lb/MWh from imported power (much of which is Canadian hydro).',
            citation: 'ISO New England Electric Generator Air Emissions Report 2024.',
          },
          {
            heading: 'Location-based vs market-based',
            body: 'The GHG Protocol lets institutions report two numbers: a location-based one (what the grid actually emitted on average) and a market-based one (which credits any renewable energy you specifically procured). New Hampshire was the first deregulated state in 1998, so KUA could in principle source from a cleaner supplier — and the dashboard would reflect that change in the market-based view.',
          },
          {
            heading: 'Why the meter beats the bill',
            body: 'Liberty\'s monthly bill gives one number per month. The campus real-time meter records consumption every few seconds — which means we can see when a building is using power, not just how much. That hourly resolution unlocks weather-normalized analysis, anomaly detection, and (eventually) hour-by-hour grid-emissions tracking as ISO-NE\'s mix shifts through the day.',
          },
        ]}
      />

    </div>
  );
}

export default Scope2;
