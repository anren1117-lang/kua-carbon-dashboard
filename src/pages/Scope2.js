import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { ScopePageInfo } from '../components/ScopePageInfo';
import { Scope2LiveDashboard } from '../components/Scope2LiveDashboard';
import { Scope2BmsInsights } from '../components/Scope2BmsInsights';
import { TOTAL_STUDENTS } from '../data/students.js';
import { ledgerSourceText } from '../data/electricityLedger.js';
import { useMeasuredScope2 } from '../hooks/useMeasuredScope2.js';
import {
  effectiveKgPerKwh,
  GRID_MIX_YEAR,
  KUA_USAGE_YEAR,
  VINTAGE_GAP,
  FACTOR_RECONCILIATION,
} from '../data/gridMix.js';
import { weatherContextText } from '../data/degreeDays.js';
import { avertAvoidedKgPerKwh } from '../data/gridMixHistory.js';
import { GridVintageChart } from '../components/GridVintageChart.js';

// Helper for the action-math blocks below — keeps the educational figures in
// sync with the grid factor. Everything that depends on the composed kWh is
// derived inside the component from the live ledger instead.
//
// Was hardcoded at 0.235 while the live dashboard on this same page computed
// 0.2344 from the per-fuel rows — two figures for one quantity, thirty lines of
// DOM apart. Derived from the same composition now.
const KG_PER_KWH = effectiveKgPerKwh();
// Solar displaces generation at the MARGIN, not at the inventory average.
// Kept separate and named so the two can never be confused again — the same
// split scenarioModel.js documents ("passing one value for both understates
// solar by ~2x").
const AVERT_KG_PER_KWH = +avertAvoidedKgPerKwh().toFixed(4);
const fmtKwh = (n) => Math.round(n).toLocaleString();
const fmtMt  = (kg) => (kg / 1000).toFixed(1);

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
  // Live Scope 2 composition (seed data + admin ledger months). Local names
  // mirror the static exports this page read before it went live.
  const s2 = useMeasuredScope2();
  const GRID_MIX_TOTAL_KWH = s2.ytdKwh;
  const GRID_MIX_ANNUAL_MTCO2E = s2.annualMt;
  const COMPOSED_ANNUAL_KWH = s2.year1Kwh;
  const COMPOSED_YTD_AS_OF = s2.asOf;
  const SCOPE2_RANGE_LOW = Math.round(s2.annualMt * 0.95);
  const SCOPE2_RANGE_HIGH = Math.round(s2.annualMt * 1.05);
  const hasMonths = s2.ledger.months.length > 0;
  // Label used by the action-math blocks lower down the page.
  const KWH_TOTAL_LABEL = `~${(COMPOSED_ANNUAL_KWH / 1_000_000).toFixed(1)}M kWh/yr (Year 1)`;
  return (
    <div>
      <h1 style={styles.title}>Scope 2 — Purchased Electricity</h1>
      <p style={styles.subtitle}>
        Indirect emissions from electricity delivered by Liberty Utilities. The kWh figure is
        {hasMonths ? `composed from real measured BMS data — ${ledgerSourceText(s2.ledger)}.` : 'not composed yet — no measured months are on the page.'} Emissions intensity is per-fuel output factors weighted by
        ISO-NE {GRID_MIX_YEAR} generation mix ({KG_PER_KWH} kg/kWh effective).
      </p>
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>Distribution utility</span>
          <span style={styles.value}>Liberty Utilities (Granite State Electric)</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Grid emission factor (effective)</span>
          <span style={styles.value}>{KG_PER_KWH} kg CO₂e/kWh (per-fuel ISO-NE {GRID_MIX_YEAR} mix)</span>
        </div>
        {/* The two rows below are the point of making the grid time-aware: a
            factor has a vintage, and ours is older than the electricity it
            prices. Saying so here is what stops the number reading as timeless. */}
        <div style={styles.row}>
          <span style={styles.label}>Factor vintage</span>
          <span style={styles.value}>
            EPA eGRID NEWE {VINTAGE_GAP.vintage} — {VINTAGE_GAP.yearsStale} years older than the {KUA_USAGE_YEAR} electricity it prices
          </span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Against EPA's published rate</span>
          <span style={styles.value}>
            {FACTOR_RECONCILIATION.publishedKgPerKwh} kg CO₂e/kWh published — this page runs {FACTOR_RECONCILIATION.gapPct}% below it, so Scope 2 here is a conservative-low estimate
          </span>
        </div>
        {/* The annualization above scales part of a year to a whole one using an
            ASSUMED seasonal shape. Weather is what makes that assumption right
            or wrong, and it was invisible here until now. Stated as weather,
            not as energy: heating at KUA is oil and propane (Scope 1), so this
            is context for reading the figure, not a claim about electricity. */}
        {weatherContextText(KUA_USAGE_YEAR) && (
          <div style={styles.row}>
            <span style={styles.label}>Weather this year</span>
            <span style={styles.value}>{weatherContextText(KUA_USAGE_YEAR)}</span>
          </div>
        )}
        <div style={styles.row}>
          <span style={styles.label}>YTD electricity (composed)</span>
          <span style={styles.value}>{hasMonths ? `${GRID_MIX_TOTAL_KWH.toLocaleString()} kWh through ${COMPOSED_YTD_AS_OF}` : 'No measured months yet'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Year 1 projection</span>
          <span style={styles.value}>~{COMPOSED_ANNUAL_KWH.toLocaleString()} kWh / ~{GRID_MIX_ANNUAL_MTCO2E} mtCO₂e</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Quantity source</span>
          <span style={styles.value}>{hasMonths ? `BMS ${ledgerSourceText(s2.ledger)}` : 'No measured months yet'}</span>
        </div>
        <div style={{ ...styles.row, borderBottom: 'none' }}>
          <span style={styles.label}>Reconciliation</span>
          <span style={styles.value}>Liberty monthly bill (TBD)</span>
        </div>
      </div>
      {/* The vintage rows above say the factor is three years older than the
          electricity it prices. This shows what that costs: the same kWh,
          priced at every published grid year. Gains a bar when eGRID2024
          lands, with no code change. */}
      <GridVintageChart kwh={COMPOSED_ANNUAL_KWH} />

      <Scope2LiveDashboard />

      <Scope2BmsInsights />

      <ScopePageInfo
        color="#f59e0b"
        estimate={{
          total: `~${Math.round(GRID_MIX_ANNUAL_MTCO2E).toLocaleString()}`,
          totalRange: `${SCOPE2_RANGE_LOW} – ${SCOPE2_RANGE_HIGH} (composed YTD ± 5%)`,
          perStudent: +(GRID_MIX_ANNUAL_MTCO2E / TOTAL_STUDENTS).toFixed(2),
          thirdMetric: {
            label: 'kWh annual',
            value: COMPOSED_ANNUAL_KWH >= 1e6 ? `${(COMPOSED_ANNUAL_KWH / 1e6).toFixed(2)}M` : COMPOSED_ANNUAL_KWH.toLocaleString(),
            note: `composed YTD × annualize`,
          },
          provenance: 'cited',
          note: `Recomputes automatically when new BMS data lands. kWh side: ${ledgerSourceText(s2.ledger)}. mtCO₂e side stays CITED via the ISO-NE 2024 per-fuel output factors.`,
          currentMethod: `Composed YTD-through-${COMPOSED_YTD_AS_OF}: ${GRID_MIX_TOTAL_KWH.toLocaleString()} kWh measured — ${ledgerSourceText(s2.ledger)}. Annualized × ${GRID_MIX_TOTAL_KWH > 0 ? (COMPOSED_ANNUAL_KWH / GRID_MIX_TOTAL_KWH).toFixed(2) : '—'} = ${COMPOSED_ANNUAL_KWH.toLocaleString()} kWh/yr. Multiplied by ISO-NE 2024 effective rate (~${KG_PER_KWH} kg/kWh, weighted from per-fuel output factors at the published generation mix) → ${GRID_MIX_ANNUAL_MTCO2E} mtCO₂e/yr. Per-student ${(GRID_MIX_ANNUAL_MTCO2E / TOTAL_STUDENTS).toFixed(2)} at ${TOTAL_STUDENTS} enrollment.`,
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
            impact: '−44 to −85 mtCO₂e/yr per 100 kW',
            detail: 'Every kWh of self-consumed solar displaces a kWh of grid electricity at the ISO-NE 2024 emission factor. Best ROI on south-facing rooftops with low shading and existing 3-phase service.',
            data: [
              { input: 'NH solar capacity factor', value: '13 – 16% (annual avg)', source: 'NREL PVWatts for Plainfield NH' },
              { input: 'Hours per year', value: '8,760', source: 'definitional' },
              { input: 'AVERT marginal avoided rate (New England)', value: `${AVERT_KG_PER_KWH} kg/kWh`, source: 'EPA AVERT — the rate at which added or displaced generation actually changes emissions. NOT the inventory average, which would understate solar by about half.' },
              { input: 'Self-consumption ratio (campus during day)', value: '70 – 100%', source: 'GHG Protocol Scope 2 — only behind-meter kWh reduce Scope 2' },
            ],
            math: [
              '# Per 100 kW of installed PV:',
              'annual_kwh = 100 kW × 8,760 hr × 0.145 (capacity factor) = 127,000 kWh',
              `avoided_emissions = 127,000 × ${AVERT_KG_PER_KWH} = ${Math.round(127000 * AVERT_KG_PER_KWH).toLocaleString()} kg ≈ ${Math.round((127000 * AVERT_KG_PER_KWH) / 1000)} mtCO₂e/yr`,
              '',
              '# Priced at the MARGINAL rate, not the inventory average. Solar',
              '# displaces whichever plant is running at the margin, and that',
              '# plant is dirtier than the grid-wide average. Using the',
              '# inventory factor here understates the benefit by about half —',
              '# it answers "what do we report?" instead of "what changed?".',
              '# Range: low CF + 70% self-consumption → ~44 mt',
              '# high CF + 100% self-consumption → ~85 mt per 100 kW',
              '# 200 kW system: ~88 to 171 mtCO₂e/yr',
            ],
          },
          {
            action: 'LED lighting retrofit campus-wide',
            impact: '−10 to −30 mtCO₂e/yr',
            detail: 'Modern LEDs use 60–80% less electricity than fluorescents and 90% less than incandescent. Highest leverage is in long-run-time fixtures (corridors, athletic facilities).',
            data: [
              { input: 'Lighting share of commercial electricity', value: '17 – 25%', source: 'EIA Commercial Buildings Energy Consumption Survey (CBECS)' },
              { input: 'LED savings vs fluorescent', value: '60 – 80% kWh', source: 'DOE LED Lighting Facts; ENERGY STAR' },
              { input: 'Total campus electricity', value: KWH_TOTAL_LABEL, source: 'composedYtd × annualize, /scope-2' },
              { input: 'ISO-NE inventory emission factor', value: `${KG_PER_KWH} kg/kWh`, source: 'Per-fuel output factors at ISO-NE 2024 mix — the inventory average, correct here because this lever cuts consumption the campus reports.' },
            ],
            math: (() => {
              const lightingKwh = COMPOSED_ANNUAL_KWH * 0.20;
              const halfRetrofit = lightingKwh * 0.50 * 0.60 * KG_PER_KWH;
              const fullRetrofit = lightingKwh * 1.00 * 0.80 * KG_PER_KWH;
              return [
                `lighting_kwh = ${fmtKwh(COMPOSED_ANNUAL_KWH)} × 0.20 = ${fmtKwh(lightingKwh)} kWh`,
                '',
                '# Realistic phased retrofit: replace 50-100% of fixtures',
                `savings = lighting_kwh × replacement% × LED_reduction × ${KG_PER_KWH}`,
                `       = ${fmtKwh(lightingKwh)} × 0.50 × 0.60 × ${KG_PER_KWH} = ${fmtMt(halfRetrofit)} mtCO₂e (50% retrofit, 60% LED savings)`,
                `       = ${fmtKwh(lightingKwh)} × 1.00 × 0.80 × ${KG_PER_KWH} = ${fmtMt(fullRetrofit)} mtCO₂e (full retrofit, 80% savings)`,
                '',
                '# Conservative range accounting for partial coverage + uncertainty: 10 - 30 mtCO₂e/yr',
              ];
            })(),
          },
          {
            action: 'Smart HVAC scheduling',
            impact: '−10 to −25 mtCO₂e/yr',
            detail: 'Building automation systems with night/weekend/break setback. Many older KUA buildings run HVAC continuously when scheduling could turn it down 60+ hours per week.',
            data: [
              { input: 'HVAC share of commercial electricity', value: '40 – 50%', source: 'EIA CBECS 2018' },
              { input: 'Reduction from BAS scheduling', value: '15 – 30%', source: 'ASHRAE Journal 2019; LBNL High-Performance Building Database' },
              { input: 'Total campus electricity', value: KWH_TOTAL_LABEL, source: 'composedYtd × annualize, /scope-2' },
              { input: 'ISO-NE inventory emission factor', value: `${KG_PER_KWH} kg/kWh`, source: 'Per-fuel output factors at ISO-NE 2024 mix — the inventory average, correct here because this lever cuts consumption the campus reports.' },
            ],
            math: (() => {
              const hvacKwh = COMPOSED_ANNUAL_KWH * 0.45;
              const savingsLow  = hvacKwh * 0.15 * KG_PER_KWH;
              const savingsHigh = hvacKwh * 0.30 * KG_PER_KWH;
              return [
                `hvac_kwh = ${fmtKwh(COMPOSED_ANNUAL_KWH)} × 0.45 = ${fmtKwh(hvacKwh)} kWh`,
                `savings_low  = ${fmtKwh(hvacKwh)} × 15% × ${KG_PER_KWH} = ${fmtMt(savingsLow)} mtCO₂e`,
                `savings_high = ${fmtKwh(hvacKwh)} × 30% × ${KG_PER_KWH} = ${fmtMt(savingsHigh)} mtCO₂e`,
                '',
                '# Discounted for partial implementation: 10 - 25 mtCO₂e/yr',
              ];
            })(),
          },
          {
            action: 'Procure clean electricity supplier',
            impact: `−${Math.round(GRID_MIX_ANNUAL_MTCO2E)} mtCO₂e/yr (market-based)`,
            detail: 'NH has been deregulated since 1998. KUA can choose a competitive supplier sourcing from wind/hydro/solar without changing physical delivery. Reflected in the market-based view (GHG Protocol Scope 2 dual reporting) but not the location-based view, to avoid double-counting.',
            data: [
              { input: 'Current Scope 2 emissions (location-based)', value: `~${Math.round(GRID_MIX_ANNUAL_MTCO2E)} mtCO₂e/yr`, source: 'Composed YTD × ISO-NE 2024 effective rate (live)' },
              { input: 'Market-based factor for 100% renewable supply', value: '~0 kg CO₂e/kWh', source: 'GHG Protocol Scope 2 Guidance §6 (renewable supply contracts)' },
              { input: 'NH retail electricity competition', value: 'enabled since 1998', source: 'NH PUC Order 22,950' },
            ],
            math: [
              '# Procuring 100% renewable supply replaces grid emissions on the market-based view',
              `market_based_savings = ${Math.round(GRID_MIX_ANNUAL_MTCO2E)} mtCO₂e/yr (full Scope 2 elimination)`,
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
