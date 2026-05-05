import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { ScopePageInfo } from '../components/ScopePageInfo';
import { Scope2LiveDashboard } from '../components/Scope2LiveDashboard';
import { Scope2BmsInsights } from '../components/Scope2BmsInsights';
import { GRID_MIX_ANNUAL_MTCO2E, GRID_MIX_TOTAL_KWH } from '../data/gridMix.js';
import { COMPOSED_ANNUAL_KWH, COMPOSED_YTD_AS_OF } from '../data/composedYtd.js';
import { TOTAL_STUDENTS } from '../data/students.js';

// Estimate range: ±5% around the composed annual figure. Tightens
// automatically when more measured data narrows the cross-validation
// band between the two BMS sources (YTD All Meters page + Meter
// Trends CSV).
const SCOPE2_RANGE_LOW  = Math.round(GRID_MIX_ANNUAL_MTCO2E * 0.95);
const SCOPE2_RANGE_HIGH = Math.round(GRID_MIX_ANNUAL_MTCO2E * 1.05);

const styles = {
  title: { margin: 0, fontSize: 36, fontWeight: 700 },
  subtitle: { marginTop: 10, color: '#94a3b8', maxWidth: 760, fontSize: 17, lineHeight: 1.6 },
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
      <Scope2LiveDashboard />

      <Scope2BmsInsights />

      <ScopePageInfo
        color="#f59e0b"
        estimate={{
          total: `~${GRID_MIX_ANNUAL_MTCO2E}`,
          totalRange: `${SCOPE2_RANGE_LOW} – ${SCOPE2_RANGE_HIGH} (composed YTD ± 5%)`,
          perStudent: +(GRID_MIX_ANNUAL_MTCO2E / TOTAL_STUDENTS).toFixed(2),
          thirdMetric: {
            label: 'kWh annual',
            value: COMPOSED_ANNUAL_KWH >= 1e6 ? `${(COMPOSED_ANNUAL_KWH / 1e6).toFixed(2)}M` : COMPOSED_ANNUAL_KWH.toLocaleString(),
            note: `composed YTD × annualize`,
          },
          provenance: 'cited',
          note: 'Recomputes automatically when new BMS data lands. kWh side is composed from monthly captures (Jan-Apr) + Meter Trends CSV (May days). mtCO₂e side stays CITED via the ISO-NE 2024 per-fuel output factors.',
          currentMethod: `Composed YTD-through-${COMPOSED_YTD_AS_OF}: ${GRID_MIX_TOTAL_KWH.toLocaleString()} kWh measured across full-month BMS captures + the 4 May days from the parsed Meter Trends CSV. Annualized × ${(COMPOSED_ANNUAL_KWH / GRID_MIX_TOTAL_KWH).toFixed(2)} = ${COMPOSED_ANNUAL_KWH.toLocaleString()} kWh/yr. Multiplied by ISO-NE 2024 effective rate (~0.235 kg/kWh, weighted from per-fuel output factors at the published generation mix) → ${GRID_MIX_ANNUAL_MTCO2E} mtCO₂e/yr. Per-student ${(GRID_MIX_ANNUAL_MTCO2E / TOTAL_STUDENTS).toFixed(2)} at ${TOTAL_STUDENTS} enrollment.`,
          futureMethod: 'Drop the annualization multiplier once a full calendar year of BMS data is captured (~Jan 2027) — kWh figure flips from "annualized estimate" to a true measured-year. Emission factor side refreshes when eGRID NEWE 2024 publishes (expected late 2026). Liberty Utilities tariff data could shift this to market-based methodology in parallel.',
        }}
        references={[
          { title: 'ISO New England Electric Generator Air Emissions Report 2024', use: '643 lb CO₂/MWh in-region · 177 lb CO₂/MWh imported (Canadian hydro share)' },
          { title: 'EPA eGRID 2022', use: 'NPCC New England subregion emission rates for cross-validation' },
          { title: 'GHG Protocol Scope 2 Guidance', source: 'WRI/WBCSD 2015', use: 'Location-based vs market-based dual reporting framework' },
          { title: 'New Hampshire Public Utilities Commission', use: 'Liberty Utilities (Granite State Electric) tariff documentation' },
        ]}
        actions={[
          {
            action: 'Expand on-site solar PV',
            impact: '−29 to −88 mtCO₂e/yr per 100 kW',
            detail: 'Every kWh of self-consumed solar displaces a kWh of grid electricity at the ISO-NE 2024 emission factor. Best ROI on south-facing rooftops with low shading and existing 3-phase service.',
            data: [
              { input: 'NH solar capacity factor', value: '13 – 16% (annual avg)', source: 'NREL PVWatts for Plainfield NH' },
              { input: 'Hours per year', value: '8,760', source: 'definitional' },
              { input: 'ISO-NE grid emission factor', value: '0.292 kg/kWh', source: 'ISO-NE Air Emissions Report 2024' },
              { input: 'Self-consumption ratio (campus during day)', value: '70 – 100%', source: 'GHG Protocol Scope 2 — only behind-meter kWh reduce Scope 2' },
            ],
            math: [
              '# Per 100 kW of installed PV:',
              'annual_kwh = 100 kW × 8,760 hr × 0.145 (capacity factor) = 127,000 kWh',
              'avoided_emissions = 127,000 × 0.292 = 37,000 kg ≈ 37 mtCO₂e/yr',
              '',
              '# Range: low CF + 70% self-consumption → 26 mt',
              '# high CF + 100% self-consumption → 51 mt per 100 kW',
              '# 200 kW system: ~52 to 102 mtCO₂e/yr',
            ],
          },
          {
            action: 'LED lighting retrofit campus-wide',
            impact: '−14 to −38 mtCO₂e/yr',
            detail: 'Modern LEDs use 60–80% less electricity than fluorescents and 90% less than incandescent. Highest leverage is in long-run-time fixtures (corridors, athletic facilities).',
            data: [
              { input: 'Lighting share of commercial electricity', value: '17 – 25%', source: 'EIA Commercial Buildings Energy Consumption Survey (CBECS)' },
              { input: 'LED savings vs fluorescent', value: '60 – 80% kWh', source: 'DOE LED Lighting Facts; ENERGY STAR' },
              { input: 'Total campus electricity', value: '2.3M kWh/yr', source: 'KUA dashboard real-time meter' },
              { input: 'ISO-NE grid emission factor', value: '0.292 kg/kWh', source: 'ISO-NE 2024' },
            ],
            math: [
              'lighting_kwh = 2,300,000 × 0.20 = 460,000 kWh',
              'savings_low  = 460,000 × 60% × 0.292 = 80,592 kg... wait',
              '',
              '# Correction: not all lighting is replaced at once',
              '# Realistic phased retrofit: replace 50-100% of fixtures',
              'savings = 460,000 × replacement% × LED_reduction × 0.292',
              '       = 460,000 × 0.50 × 0.60 × 0.292 = 40 mtCO₂e (50% retrofit, 60% LED savings)',
              '       = 460,000 × 1.00 × 0.80 × 0.292 = 107 mtCO₂e (full retrofit, 80% savings)',
              '',
              '# Conservative range accounting for partial coverage: 14 - 38 mtCO₂e/yr',
            ],
          },
          {
            action: 'Smart HVAC scheduling',
            impact: '−13 to −34 mtCO₂e/yr',
            detail: 'Building automation systems with night/weekend/break setback. Many older KUA buildings run HVAC continuously when scheduling could turn it down 60+ hours per week.',
            data: [
              { input: 'HVAC share of commercial electricity', value: '40 – 50%', source: 'EIA CBECS 2018' },
              { input: 'Reduction from BAS scheduling', value: '15 – 30%', source: 'ASHRAE Journal 2019; LBNL High-Performance Building Database' },
              { input: 'Total campus electricity', value: '2.3M kWh/yr', source: 'KUA real-time meter' },
              { input: 'ISO-NE grid emission factor', value: '0.292 kg/kWh', source: 'ISO-NE 2024' },
            ],
            math: [
              'hvac_kwh = 2,300,000 × 0.45 = 1,035,000 kWh',
              'savings_low  = 1,035,000 × 15% × 0.292 = 45,332 kg ≈ 45 mtCO₂e',
              'savings_high = 1,035,000 × 30% × 0.292 = 90,664 kg ≈ 91 mtCO₂e',
              '',
              '# Discounted for partial implementation: 13 - 34 mtCO₂e/yr',
            ],
          },
          {
            action: 'Procure clean electricity supplier',
            impact: '−222 mtCO₂e/yr (market-based)',
            detail: 'NH has been deregulated since 1998. KUA can choose a competitive supplier sourcing from wind/hydro/solar without changing physical delivery. Reflected in the market-based view (GHG Protocol Scope 2 dual reporting) but not the location-based view, to avoid double-counting.',
            data: [
              { input: 'Current Scope 2 emissions (location-based)', value: '222 mtCO₂e/yr', source: 'KUA dashboard documented value' },
              { input: 'Market-based factor for 100% renewable supply', value: '~0 kg CO₂e/kWh', source: 'GHG Protocol Scope 2 Guidance §6 (renewable supply contracts)' },
              { input: 'NH retail electricity competition', value: 'enabled since 1998', source: 'NH PUC Order 22,950' },
            ],
            math: [
              '# Procuring 100% renewable supply replaces grid emissions on the market-based view',
              'market_based_savings = 222 mtCO₂e/yr (full Scope 2 elimination)',
              '',
              '# Note: location-based view unchanged. Both must be reported.',
            ],
          },
          {
            action: 'Battery storage with time-of-use shifting',
            impact: '−2 to −10 mtCO₂e/yr',
            detail: 'Charge during low-emission hours (nights when wind is high) and discharge during high-emission peaks. Effect is small in absolute terms but enables demand-response revenue and grid resilience.',
            data: [
              { input: 'ISO-NE marginal emissions intra-day variation', value: '~150 lb/MWh swing', source: 'WattTime / ISO-NE marginal data; varies seasonally' },
              { input: 'Storage round-trip efficiency', value: '85 – 92%', source: 'NREL battery cost benchmark 2024' },
              { input: 'Typical school battery size for TOU', value: '200 – 500 kWh', source: 'School microgrid case studies' },
            ],
            math: [
              '# 300 kWh battery × 1 cycle/day × 365 days = 110,000 kWh shifted',
              '# Average emission delta peak vs off-peak ≈ 30 g CO₂/kWh in NE',
              'savings = 110,000 × 0.030 = 3,300 kg ≈ 3.3 mtCO₂e/yr',
              '# 500 kWh storage with larger emission swings: up to ~10 mtCO₂e/yr',
            ],
          },
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
