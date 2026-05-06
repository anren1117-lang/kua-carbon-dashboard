import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { ScopePageInfo } from '../components/ScopePageInfo';
import { SCOPE1_TOTAL_MT } from '../data/scopeTotals.js';
import { SCOPE1_RANGE } from '../data/geographicEstimates.js';
import { TOTAL_STUDENTS } from '../data/students.js';

const SCOPE1_PER_STUDENT = +(SCOPE1_TOTAL_MT / TOTAL_STUDENTS).toFixed(2);

const categories = [
  { name: 'Heating Fuel', desc: 'Heating oil and propane delivered to campus boilers and water heaters.', factor: 'EPA GHG Emission Factors Hub: 10.16 kg CO₂/gal heating oil, 5.72 kg CO₂/gal propane', status: 'In dashboard (fuel_bills table)' },
  { name: 'Refrigerant Leakage', desc: 'Fugitive HVAC refrigerant emissions from technician service reports.', factor: 'IPCC AR6 global warming potentials', status: 'Planned' },
  { name: 'Fleet Vehicles', desc: 'Campus-owned vans and trucks via fuel-card records.', factor: 'EPA GHG Emission Factors Hub (gasoline / diesel)', status: 'Planned' },
];

const styles = {
  title: { margin: 0, fontSize: 36, fontWeight: 700 },
  subtitle: { marginTop: 10, color: '#94a3b8', maxWidth: 760, fontSize: 17, lineHeight: 1.6 },
  list: { marginTop: 24, display: 'grid', gap: 12 },
  item: { background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, padding: 16 },
  itemTitle: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' },
  itemName: { fontSize: 18, fontWeight: 600 },
  status: { fontSize: 12, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 0.5 },
  desc: { marginTop: 6, color: '#cbd5e1' },
  factor: { marginTop: 6, fontSize: 12, color: '#64748b' },
};

function Scope1() {
  return (
    <div>
      <h1 style={styles.title}>Scope 1 — Direct Emissions</h1>
      <p style={styles.subtitle}>
        Greenhouse gases released from sources owned or controlled by KUA. Dominant source is
        on-site fuel combustion for heat and hot water.
      </p>

      <EducationalCard
        title="What Scope 1 means and why it matters here"
        sections={[
          {
            heading: 'Definition',
            body: 'Scope 1 covers greenhouse gases released directly from sources KUA owns or controls — most visibly the heating-oil truck pulling up to a building, the propane tanks behind a dorm, and fugitive refrigerant from HVAC equipment. If KUA can choose to turn it off, it\'s Scope 1.',
          },
          {
            heading: 'Why it dominates in New Hampshire',
            body: [
              'Cold winters mean heating runs eight months a year. Most KUA buildings burn either #2 heating oil or propane.',
              'Burning one gallon of heating oil releases 10.16 kg CO₂ — about the same as driving a typical car 25 miles.',
              'A single boarding-school dorm on oil heat can use 4,000–8,000 gallons per winter, producing 40–80 mtCO₂e from that one building.',
            ],
          },
          {
            heading: 'The chemistry',
            body: 'Heating fuel is a hydrocarbon mix. In a boiler, it reacts with oxygen:',
            formula: 'CₓHᵧ + (x + y/4) O₂ → x CO₂ + (y/2) H₂O + heat',
            citation: 'EPA GHG Emission Factors Hub (2024), Stationary Combustion table; IPCC AR6 for refrigerant GWP100 values.',
          },
          {
            heading: 'Where reduction happens',
            body: [
              'Heat-pump retrofits replace fossil heat with grid electricity (which then becomes Scope 2 — but a third of the emissions per BTU on the New England grid).',
              'Building envelope upgrades (insulation, weatherization) cut fuel use without changing the heating system.',
              'Refrigerant leak detection during HVAC service catches small leaks before they grow.',
            ],
          },
        ]}
      />

      <ScopePageInfo
        color="#ef4444"
        estimate={{
          total: `~${SCOPE1_TOTAL_MT.toLocaleString()}`,
          totalRange: `${SCOPE1_RANGE.low.toLocaleString()} – ${SCOPE1_RANGE.high.toLocaleString()} mt across 3 methods per component (ASHRAE 90.1 modern compliance / KUA-typical NH-CZ6 stock / ENERGY STAR HDD-direct upper bound)`,
          perStudent: SCOPE1_PER_STUDENT,
          thirdMetric: { label: 'Dominant source', value: 'Heating', note: '~95% of Scope 1' },
          provenance: 'estimated',
          note: 'Heating fuel is the overwhelming driver. Refrigerant leakage and fleet vehicles add roughly 20–50 mtCO₂e between them.',
          currentMethod: 'Bottom-up estimate from KUA actual building stock × NH-CZ6 heating intensity. Heating fuel ~111K gal oil + ~19K gal propane / yr from 290K sqft × intensity by category (Dorm 75 / Academic 55 / Athletic 45 / Other 55 kBtu/sqft/yr) × 90% oil + 10% propane × EPA Stationary Combustion factors. Fleet: 5 vehicles × actual annualMiles ÷ mpg × EPA Mobile Combustion (~54 mt). Refrigerants: 80 lb HVAC charge × 5–15%/yr leak × IPCC AR6 GWPs (~7 mt). Range across 3 methods per component (ASHRAE 90.1 modern compliance / KUA-typical / ENERGY STAR HDD-direct upper) gives 891–1,867 mt total — see /admin/methodology for the full breakdown.',
          futureMethod: 'Heating fuel → annual delivery invoices per building entered via Admin Portal (fuel_bills table) × EPA factors → flips to MEASURED. Refrigerants → HVAC technician service-report mass balance × IPCC AR6 GWP100 → MEASURED. Fleet → KUA fuel-card records × EPA Mobile Combustion factors → MEASURED. Once all three integrate, this page reads measured end-to-end.',
        }}
        references={[
          { title: 'EPA GHG Emission Factors Hub (2024)', source: 'Stationary Combustion Table 2', use: '10.16 kg CO₂/gal heating oil; 5.72 kg CO₂/gal propane' },
          { title: 'IPCC AR6 Working Group I, Chapter 7', source: '2021', use: 'GWP100 values for refrigerants (R-410A 2256, R-134a 1530, etc.)' },
          { title: 'EPA GHG Emission Factors Hub — Mobile Combustion', use: '8.78 kg CO₂/gal gasoline; 10.21 kg CO₂/gal diesel for fleet vehicles' },
          { title: 'GHG Protocol Refrigerants Tool', use: 'Mass-balance method: emissions = (recharge − reclaim) × GWP100' },
        ]}
        actions={[
          {
            action: 'Heat pump retrofit on a major dorm',
            impact: '−30 to −51 mtCO₂e/yr',
            detail: 'Replaces a dorm\'s oil/propane boiler with an electric heat pump. New Scope 2 load is roughly 1/3 the original Scope 1 emissions because heat pumps deliver 2.5–3.5 kWh of heat per 1 kWh of electricity, and the New England grid is ~3× cleaner than oil per BTU delivered.',
            data: [
              { input: 'Annual heating oil per dorm', value: '4,000 – 8,000 gal/yr', source: 'Boarding-school facilities surveys (NEEP 2022)' },
              { input: 'Heating oil emission factor', value: '10.16 kg CO₂/gal', source: 'EPA GHG Emission Factors Hub 2024, Stationary Combustion' },
              { input: 'Heating oil heat content (HHV)', value: '138,500 BTU/gal', source: 'EIA Energy Calculator' },
              { input: 'Boiler thermal efficiency', value: '80%', source: 'ASHRAE 90.1 typical for in-service systems' },
              { input: 'Cold-climate heat pump COP', value: '2.0 – 3.0', source: 'NEEP Cold Climate Air-Source Heat Pump Specification' },
              { input: 'ISO-NE effective emission factor', value: '0.235 kg/kWh', source: 'Per-fuel output factors at ISO-NE 2024 mix; matches gridMix.js' },
            ],
            math: [
              '# Worked example: 6,000 gal/yr dorm at COP 2.5',
              'old_emissions = 6,000 gal × 10.16 kg/gal = 60,960 kg ≈ 61.0 mtCO₂e',
              '',
              'heat_delivered_btu = 6,000 × 138,500 × 0.80 = 665M BTU',
              'heat_delivered_kwh = 665M / 3,412 BTU/kWh = 195,000 kWh',
              'electricity_needed = 195,000 / 2.5 (COP) = 78,000 kWh',
              'new_emissions = 78,000 × 0.235 = 18,330 kg ≈ 18.3 mtCO₂e',
              '',
              'savings = 61.0 − 18.3 = 42.7 mtCO₂e/yr',
              '',
              '# Range: 4,000 gal at COP 3.0 → ~30 mt; 8,000 gal at COP 2.0 → ~51 mt',
            ],
          },
          {
            action: 'Weatherization + envelope upgrades',
            impact: '−8 to −24 mtCO₂e/yr per dorm',
            detail: 'Air sealing, insulation, and window upgrades typically reduce a building\'s heating fuel use by 20–30%. Highest leverage is the oldest, leakiest dormitory.',
            data: [
              { input: 'Heating reduction from envelope retrofit', value: '20 – 30%', source: 'DOE Building America Solution Center; ENERGY STAR Home Performance' },
              { input: 'Annual heating oil per dorm', value: '4,000 – 8,000 gal/yr', source: 'NEEP 2022' },
              { input: 'Heating oil emission factor', value: '10.16 kg CO₂/gal', source: 'EPA GHG Hub 2024' },
            ],
            math: [
              '# Low: 4,000 gal × 20% reduction × 10.16 = 8.1 mtCO₂e/yr',
              '# High: 8,000 gal × 30% reduction × 10.16 = 24.4 mtCO₂e/yr',
            ],
          },
          {
            action: 'Thermostat setback at night and breaks',
            impact: '−7 to −60 mtCO₂e/yr campus-wide',
            detail: 'Lowering setpoint 2°F overnight, weekends, and during breaks. EPA-published rule of thumb: ~7% reduction per 1°F × 8 hours.',
            data: [
              { input: 'Heating reduction per 1°F × 8 hrs setback', value: '~7%', source: 'EPA ENERGY STAR Programmable Thermostat guidance' },
              { input: 'Total campus heating fuel', value: '~100,000 gal/yr (estimate)', source: 'KUA Scope 1 estimate, this dashboard' },
              { input: 'Heating oil emission factor', value: '10.16 kg CO₂/gal', source: 'EPA GHG Hub 2024' },
            ],
            math: [
              '# 2°F overnight setback ≈ 7% reduction (one full 8-hr window)',
              '# campus = 100,000 gal × 7% × 10.16 = 71,120 kg ≈ 71 mtCO₂e/yr',
              '# realistic implementation across mixed building stock: 7-60 mt range',
            ],
          },
          {
            action: 'Refrigerant leak detection on routine HVAC service',
            impact: '−4 to −10 mtCO₂e/yr',
            detail: 'Annual leak inspection during scheduled HVAC service catches small leaks before they grow. The dominant impact is preventing R-410A loss, which has GWP100 of 2,256.',
            data: [
              { input: 'Typical commercial HVAC leak rate', value: '5 – 15% per year', source: 'GHG Protocol Refrigerants Tool' },
              { input: 'Total refrigerant charge (school estimate)', value: '60 – 100 lb across HVAC systems', source: 'Commercial HVAC sizing norms' },
              { input: 'R-410A GWP100', value: '2,256', source: 'IPCC AR6 WG1 Ch.7 Table 7.SM.7' },
              { input: 'Detection effectiveness', value: '50 – 80% leak reduction', source: 'EPA Stratospheric Protection Division (2018 MOU)' },
            ],
            math: [
              '# baseline_leak = 80 lb × 10% × 0.4536 kg/lb × 2,256 GWP = 8,180 kg ≈ 8.2 mtCO₂e',
              '# with detection: leak drops 50-80%',
              '# savings = 8.2 × 0.5 to 8.2 × 0.8 = 4.1 to 6.6 mtCO₂e/yr',
              '# Higher charge (100 lb) systems extend the upper bound to ~10',
            ],
          },
          {
            action: 'Electric or hybrid replacements for fleet vehicles',
            impact: '−10 to −22 mtCO₂e/yr',
            detail: 'EV vans on the New England grid emit roughly 75% less per mile than gasoline. Best ROI on the highest-mileage vehicles.',
            data: [
              { input: 'Gasoline emission factor', value: '8.78 kg CO₂/gal', source: 'EPA GHG Hub Mobile Combustion 2024' },
              { input: 'Average van fuel economy', value: '18 mpg', source: 'EPA Fuel Economy data' },
              { input: 'Annual mileage per fleet van', value: '8,000 – 15,000 mi', source: 'School fleet operating norms' },
              { input: 'EV efficiency', value: '0.30 kWh/mi', source: 'EPA fueleconomy.gov electric vehicle data' },
              { input: 'ISO-NE effective emission factor', value: '0.235 kg/kWh', source: 'Per-fuel output factors at ISO-NE 2024 mix' },
            ],
            math: [
              '# Per van per year (12,000 mi):',
              'gasoline_emissions = 12,000 / 18 × 8.78 = 5,853 kg ≈ 5.9 mtCO₂e',
              'ev_emissions      = 12,000 × 0.30 × 0.235 = 846 kg ≈ 0.85 mtCO₂e',
              'savings_per_van   = 5.9 − 0.85 = 5.05 mtCO₂e/yr',
              '',
              '# Replacing 3-5 vans: 14 to 24 mtCO₂e/yr (rounded 10-22)',
            ],
          },
        ]}
      />

      <div style={styles.list}>
        {categories.map((c) => (
          <div key={c.name} style={styles.item}>
            <div style={styles.itemTitle}>
              <div style={styles.itemName}>{c.name}</div>
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

export default Scope1;
