import React, { useState, useEffect, useCallback } from 'react';
import { buildings } from '../data/buildings.js';
import { envysionSnapshot } from '../data/envysionSnapshot.js';
import { GRID_MIX_TOTAL_MTCO2E, GRID_MIX_TOTAL_KWH } from '../data/gridMix.js';
import { COMPOSED_ANNUALIZE_FACTOR as ANNUALIZE_FACTOR } from '../data/composedYtd.js';
import { dayOfWeekPattern, monthlyPattern } from '../data/seasonalPatterns.js';
import { campusMonthlyTotals } from '../data/monthlyConsumption.js';
import { ProvenancePill } from './ProvenancePill.js';
import { gridMix } from '../data/gridMix.js';
import { EnergyEquivalents } from './EnergyEquivalents.js';

// The original campus-electricity dashboard — live emissions counter, time
// analysis, per-building data, ISO-NE grid mix breakdown. Lives on /scope-2
// because it's all about Scope 2 (purchased electricity).
//
// Data here is read from src/data/ (gridMix, seasonalPatterns, buildings,
// envysionSnapshot) rather than hardcoded inline. The narrative copy for
// each grid source still lives in this file because it's UI explanation,
// not data.
// Lazy-initialize the counters to current YTD-equivalent so the page
// doesn't show "0.0000 mtCO₂e" for a frame on every load before the
// useEffect runs.
//
// Year-counter prefers the ACTUAL composed YTD figure (which already
// reflects heating-heavy Jan-Apr months) over linear-prorating the
// annual baseline — those differ by ~14% in early May because the
// year isn't uniform.
function initialEmissions(annualMt, measuredYtdMt) {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msPerYear = 365 * 24 * 3600 * 1000;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  // Use measured YTD as the year-counter anchor when available;
  // top up with linear pro-rata for the time elapsed between the
  // YTD snapshot and now.
  const yearAnchor = measuredYtdMt > 0 ? measuredYtdMt : ((now - startOfYear) / msPerYear) * annualMt;
  return {
    year:  yearAnchor,
    month: ((now - startOfMonth) / (daysInMonth * 24 * 3600 * 1000)) * (annualMt / 12),
    day:   ((now - startOfDay) / (24 * 3600 * 1000)) * (annualMt / 365),
    cur:   yearAnchor,
  };
}

export function Scope2LiveDashboard() {
  // Annual baseline (Year 1 projection) — referenced before useState
  // so we can seed the counters with actual measured YTD + current
  // elapsed time instead of 0.
  const seedAnnualMt = +(GRID_MIX_TOTAL_MTCO2E * ANNUALIZE_FACTOR).toFixed(1);
  const seed = initialEmissions(seedAnnualMt, GRID_MIX_TOTAL_MTCO2E);
  const [currentEmissions, setCurrentEmissions] = useState(seed.cur);
  const [todayEmissions, setTodayEmissions] = useState(seed.day);
  const [monthEmissions, setMonthEmissions] = useState(seed.month);
  const [yearEmissions, setYearEmissions] = useState(seed.year);
  const [isLive, setIsLive] = useState(true);
  const [expandedSource, setExpandedSource] = useState(null);
  const [expandedBuilding, setExpandedBuilding] = useState(null);
  const [viewMode, setViewMode] = useState('overview');

  // Annual baseline derived from the seasonally-anchored Year 1
  // projection (composedYtd.js). The factor (~×2.59) accounts for
  // the fact that the YTD measured months are heating-heavy — naive
  // linear annualization would over-count summer.
  const yearlyEmissions = +(GRID_MIX_TOTAL_MTCO2E * ANNUALIZE_FACTOR).toFixed(1);
  // Annualized for the same reason as yearlyEmissions above — the
  // "kWh/year" stat below would be wrong showing the YTD figure.
  const totalKwh = Math.round(GRID_MIX_TOTAL_KWH * ANNUALIZE_FACTOR);
  const emissionsPerSecond = yearlyEmissions / (365 * 24 * 60 * 60);
  const emissionsPerMinute = yearlyEmissions / (365 * 24 * 60);
  const emissionsPerHour = yearlyEmissions / (365 * 24);
  const emissionsPerDay = yearlyEmissions / 365;
  const emissionsPerMonth = yearlyEmissions / 12;

  // Buildings + Envysion observations joined from the data layer.
  // envysionSnapshot.energyUsedKwh is YTD-through-2026-05-03 (123 days);
  // multiply by ANNUALIZE_FACTOR so the displayed "Energy Used" column
  // shows Year 1 kWh consistent with /buildings, /hotspots, and the
  // headline Year 1 figure on this same page.
  const buildingsById = Object.fromEntries(buildings.map((b) => [b.id, b]));
  const buildingsData = envysionSnapshot.map((row) => {
    const b = buildingsById[row.buildingId];
    return {
      name: b?.name ?? row.buildingId,
      energyUsed: Math.round(row.energyUsedKwh * ANNUALIZE_FACTOR),
      power: row.powerKw,
      avgVoltage: row.avgVoltage,
      category: b?.category ?? 'Other',
    };
  });

  const totalEnergyKwh = buildingsData.reduce((sum, b) => sum + b.energyUsed, 0);
  const totalPowerKw = buildingsData.reduce((sum, b) => sum + b.power, 0);

  // Narrative copy per grid source — UI explanation, not data. Keyed by the
  // source label exactly as it appears in src/data/gridMix.js.
  const sourceNarrative = {
    'Natural Gas': {
      howItWorks: 'Natural gas (primarily methane, CH4) is extracted from underground reservoirs and transported via pipelines to power plants. In combined-cycle plants, gas is burned in combustion turbines, and the hot exhaust drives steam turbines for additional power generation.',
      chemicalProcess: 'CH4 + 2O2 → CO2 + 2H2O + Heat. The combustion of methane releases carbon dioxide and water vapor, along with trace amounts of nitrogen oxides (NOx).',
      environmentalImpacts: [
        'Produces about 50% less CO2 than coal per kWh',
        'Methane leaks during extraction (2-3%) increase warming impact',
        'Hydraulic fracturing (fracking) can contaminate groundwater',
        'Lower particulate and sulfur emissions than coal or oil',
        'Dominant fuel source in New England grid (51%)'
      ],
      globalContext: 'Natural gas provides 51% of New England electricity (ISO-NE 2024). The region relies heavily on natural gas due to pipeline infrastructure and coal/oil plant retirements.',
      efficiency: '40-60% efficient in combined-cycle plants (best among fossil fuels).',
      costComparison: 'Moderate cost at $0.05-0.08 per kWh. Price volatile due to market fluctuations and pipeline constraints in winter.',
      history: 'Became dominant after 2008 shale gas boom. Now provides over half of New England electricity.',
      alternatives: 'Renewable natural gas, hydrogen blending, wind/solar with battery storage.',
    },
    'Nuclear': {
      howItWorks: 'Nuclear fission splits uranium atoms, releasing heat that produces steam to drive turbines. New England has two nuclear plants: Millstone (CT) and Seabrook (NH).',
      chemicalProcess: 'U-235 + neutron → fission products + neutrons + energy. No combustion, no CO2 emissions during operation.',
      environmentalImpacts: [
        'Zero carbon emissions during operation',
        'Provides reliable baseload power 24/7',
        'Radioactive waste requires long-term storage',
        'High upfront construction costs',
        'Critical for New England grid reliability'
      ],
      globalContext: 'Nuclear provides 23% of New England electricity. Millstone and Seabrook are critical for grid reliability and carbon-free power.',
      efficiency: '90%+ capacity factor - highest of any source.',
      costComparison: 'Low operating cost at $0.03-0.05 per kWh for existing plants. New plants very expensive.',
      history: 'Vermont Yankee closed 2013, Pilgrim closed 2019. Remaining plants essential for clean energy.',
      alternatives: 'Advanced nuclear designs, small modular reactors (SMRs).',
    },
    'Renewables (Solar, Wind, Biomass)': {
      howItWorks: 'Solar panels convert sunlight to electricity. Wind turbines capture kinetic energy. Biomass burns organic material. Combined they provide 12% of New England power.',
      chemicalProcess: 'Solar: Photovoltaic effect converts photons to electrons. Wind: Kinetic energy to rotational to electrical. No combustion for solar/wind.',
      environmentalImpacts: [
        'Zero emissions from solar and wind',
        'Biomass considered carbon-neutral (CO2 absorbed during growth)',
        'Land use considerations for large installations',
        'Intermittent - depends on weather',
        'Growing rapidly in New England'
      ],
      globalContext: '12% of New England electricity from renewables. Solar 4.1%, Wind 3.9%, Biomass/Wood 1.7%, MSW 2.2%, Landfill Gas 0.3%.',
      efficiency: 'Solar: 20-25%, Wind: 35-45%, varies by weather.',
      costComparison: 'Solar: $0.03-0.06/kWh, Wind: $0.02-0.05/kWh. Now cost-competitive with fossil fuels.',
      history: 'Rapid growth since 2010. Block Island Wind Farm (2016) was first US offshore wind. Vineyard Wind started 2024.',
      alternatives: 'Offshore wind expansion, community solar, battery storage integration.',
    },
    'Hydropower': {
      howItWorks: 'Water flows through turbines to generate electricity. Includes conventional hydro dams and pumped storage facilities in New England.',
      chemicalProcess: 'Gravitational potential energy → kinetic energy → electrical energy. No combustion, no emissions.',
      environmentalImpacts: [
        'Zero carbon emissions',
        'Can affect fish migration and river ecosystems',
        'Pumped storage provides grid reliability',
        'Dependent on water availability',
        'Long facility lifespan (50+ years)'
      ],
      globalContext: '6% of New England electricity from hydro. Region also imports Canadian hydropower (part of 7% imports).',
      efficiency: '90% efficiency - highest of any generation type.',
      costComparison: 'Very low cost at $0.02-0.04 per kWh. Existing facilities very economical.',
      history: 'New England has used hydro since 1800s. Two large pumped storage facilities provide 1,600 MW.',
      alternatives: 'Run-of-river hydro, increased imports from Quebec.',
    },
    'Net Imports (NY, Quebec, New Brunswick)': {
      howItWorks: 'Electricity imported via transmission lines from neighboring regions - primarily hydropower from Quebec and New Brunswick, and mixed sources from New York.',
      chemicalProcess: 'Mostly hydropower from Canada - no combustion, no emissions.',
      environmentalImpacts: [
        'Mostly clean hydropower from Canada',
        'Reduces need for local fossil fuel generation',
        'Requires transmission infrastructure',
        'Subject to availability and contracts',
        'New England is historically a net importer'
      ],
      globalContext: '7% of New England electricity is imported. Quebec hydro is major source of clean power.',
      efficiency: 'Transmission losses ~3-5% over long distances.',
      costComparison: 'Varies by contract and market conditions.',
      history: 'Long-term contracts with Hydro-Quebec. New transmission projects proposed.',
      alternatives: 'New England Clean Energy Connect, additional Canadian imports.',
    },
    'Oil': {
      howItWorks: 'Petroleum is refined into heavy fuel oil or diesel, then burned in boilers or combustion turbines. Oil plants serve as backup during peak demand and gas shortages.',
      chemicalProcess: 'CxHy + O2 → CO2 + H2O + Heat. Petroleum hydrocarbons combust to form CO2 and water.',
      environmentalImpacts: [
        'Higher CO2 emissions than natural gas',
        'Used mainly for backup/peak demand',
        'Important during winter gas shortages',
        'Oil spills during transport risk ecosystems',
        'Being phased out in favor of cleaner sources'
      ],
      globalContext: 'Oil provides only 1% of New England electricity normally, but increases during cold winter days when gas is constrained.',
      efficiency: '35-45% efficient.',
      costComparison: 'Most expensive fossil fuel at $0.10-0.20 per kWh. Used when no alternatives available.',
      history: 'Peaked in 1970s during oil embargo. Now mainly backup power for winter reliability.',
      alternatives: 'Battery storage for peak demand, demand response programs.',
    },
    'Coal': {
      howItWorks: 'Coal is burned in boilers to create steam that drives turbines. New England has almost completely phased out coal power.',
      chemicalProcess: 'C + O2 → CO2 + Heat. Coal also releases sulfur dioxide, mercury, and particulates.',
      environmentalImpacts: [
        'Highest CO2 emissions of any fuel',
        'Releases mercury and toxic heavy metals',
        'Causes acid rain from sulfur dioxide',
        'New England has closed nearly all coal plants',
        'Only 0.23% of grid mix remains'
      ],
      globalContext: 'Coal provides only 0.23% of New England electricity. Bridgeport Harbor (last major coal plant) closed in 2021.',
      efficiency: '33-40% efficient.',
      costComparison: 'Was cheapest at $0.03-0.05/kWh but environmental costs made it uneconomical.',
      history: 'Brayton Point closed 2017, Mount Tom 2018, Bridgeport Harbor 2021. Coal era essentially over in New England.',
      alternatives: 'Already replaced by natural gas and renewables.',
    },
  };

  // gridMix.mtCO2e and .kwhUsed are YTD figures. The "Energy Sources"
  // panel below shows them under a footer that says "TOTAL ANNUAL
  // EMISSIONS" (yearlyEmissions, ~395 mt). Annualize the per-source
  // rows here so the breakdown adds up to the footer instead of being
  // ~38% short.
  const emissionsData = gridMix.map((m) => ({
    source: m.source,
    emissions: +(m.mtCO2e * ANNUALIZE_FACTOR).toFixed(1),
    percentage: m.percentOfEmissions,
    mixPercent: m.mixPercent,
    kwhUsed: Math.round(m.kwhUsed * ANNUALIZE_FACTOR),
    color: m.color,
    emissionFactor: m.emissionFactor,
    ...(sourceNarrative[m.source] || {}),
  }));

  // Seasonal patterns from data layer. Day-of-week is reordered to start
  // Monday for display. The monthlyPattern.emissions field is calibrated
  // to a legacy ~213 mt annual baseline; rescale here so the displayed
  // monthly mtCO2e values sum to the canonical annual Scope 2 figure
  // (~395 mt today via per-fuel output factors).
  const dayOfWeekData = [...dayOfWeekPattern.slice(1), dayOfWeekPattern[0]];
  const _monthlyMultSum = monthlyPattern.reduce((s, m) => s + m.multiplier, 0);
  const monthlyData = monthlyPattern.map((m) => ({
    ...m,
    emissions: +((m.multiplier / _monthlyMultSum) * yearlyEmissions).toFixed(1),
  }));

  const initializeEmissions = useCallback(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const msInMonth = now - startOfMonth;
    const msInDay = now - startOfDay;

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const msPerMonth = daysInMonth * 24 * 60 * 60 * 1000;
    const msPerDay = 24 * 60 * 60 * 1000;

    // Anchor the year counter on actual measured YTD (which already
    // reflects heating-heavy Jan-Apr) rather than linear-prorating the
    // annual figure. Linear pro-rata understates by ~14% in early May.
    setYearEmissions(GRID_MIX_TOTAL_MTCO2E);
    setMonthEmissions((msInMonth / msPerMonth) * emissionsPerMonth);
    setTodayEmissions((msInDay / msPerDay) * emissionsPerDay);
    setCurrentEmissions(GRID_MIX_TOTAL_MTCO2E);
  }, [emissionsPerMonth, emissionsPerDay]);

  useEffect(() => {
    if (!isLive) return;
    initializeEmissions();
    const interval = setInterval(() => {
      setCurrentEmissions(prev => prev + emissionsPerSecond);
      setYearEmissions(prev => prev + emissionsPerSecond);
      setMonthEmissions(prev => prev + emissionsPerSecond);
      setTodayEmissions(prev => prev + emissionsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive, initializeEmissions, emissionsPerSecond]);

  const emissionFactorPerKwh = totalKwh > 0 ? yearlyEmissions / totalKwh : 0;
  const buildingsWithEmissions = buildingsData.map(b => ({
    ...b,
    emissions: (b.energyUsed * emissionFactorPerKwh).toFixed(2),
    percentOfTotal: totalEnergyKwh > 0 ? ((b.energyUsed / totalEnergyKwh) * 100).toFixed(1) : '0.0',
  }));

  const currentDayOfWeek = new Date().getDay();
  const currentMonth = new Date().getMonth();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}><span style={styles.logoText}>KUA</span></div>
        <h1 style={styles.title}>Kimball Union Academy</h1>
        <h2 style={styles.subtitle}>Campus Carbon Emissions Dashboard</h2>
        <div style={styles.liveIndicator}>
          <span style={{...styles.liveDot, backgroundColor: isLive ? '#22c55e' : '#9ca3af'}}></span>
          <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
        </div>
        <p style={styles.dataSource}>Data Source: ISO New England Grid Mix 2024</p>
        <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 999, background: '#0b1220', border: '1px solid #1f2937', fontSize: 12, color: '#cbd5e1', letterSpacing: 0.3, flexWrap: 'wrap', justifyContent: 'center' }}>
          <ProvenancePill provenance="cited" />
          <span><strong>{yearlyEmissions} mtCO₂e</strong> · measured BMS kWh × ISO-NE 2024 per-fuel output factors. Live counter interpolates this baseline by elapsed seconds; it is a smooth approximation, not a real-time meter reading.</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8', maxWidth: 720, lineHeight: 1.5 }}>
          <span style={{ color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7, marginRight: 6 }}>Today:</span>
          Counter ticks at a fixed rate derived from the YTD kWh baseline ÷ seconds-in-period.
          <span style={{ color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7, marginRight: 6, marginLeft: 12 }}>Target:</span>
          Tick rate becomes time-varying once the BMS relay streams 15-min reads — counter then reflects actual instantaneous load (peak/trough) rather than a smooth average.
        </div>
      </header>

      <div style={styles.navButtons} role="tablist">
        <button type="button" role="tab" aria-selected={viewMode === 'overview'}  style={{...styles.navButton, backgroundColor: viewMode === 'overview'  ? '#22c55e' : '#334155'}} onClick={() => setViewMode('overview')}>Overview</button>
        <button type="button" role="tab" aria-selected={viewMode === 'time'}      style={{...styles.navButton, backgroundColor: viewMode === 'time'      ? '#22c55e' : '#334155'}} onClick={() => setViewMode('time')}>Time Analysis</button>
        <button type="button" role="tab" aria-selected={viewMode === 'buildings'} style={{...styles.navButton, backgroundColor: viewMode === 'buildings' ? '#22c55e' : '#334155'}} onClick={() => setViewMode('buildings')}>Buildings</button>
        <button type="button" role="tab" aria-selected={viewMode === 'sources'}   style={{...styles.navButton, backgroundColor: viewMode === 'sources'   ? '#22c55e' : '#334155'}} onClick={() => setViewMode('sources')}>Energy Sources</button>
      </div>

      {/* OVERVIEW TAB */}
      {viewMode === 'overview' && (
        <>
          <div style={styles.mainCounter}>
            <p style={styles.counterLabel}>Year-to-Date CO2 Emissions</p>
            <p style={styles.counterValue}>{yearEmissions.toFixed(4)}</p>
            <p style={styles.counterUnit}>metric tonnes CO2e</p>
            <button type="button" style={styles.toggleButton} onClick={() => setIsLive(!isLive)}>{isLive ? 'Pause' : 'Resume'}</button>
          </div>

          <div style={styles.timeCards}>
            <div style={styles.timeCard}>
              <p style={styles.timeLabel}>Today</p>
              <p style={styles.timeValue}>{(todayEmissions * 1000).toFixed(1)}</p>
              <p style={styles.timeUnit}>kg CO2e</p>
            </div>
            <div style={styles.timeCard}>
              <p style={styles.timeLabel}>This Month</p>
              <p style={styles.timeValue}>{monthEmissions.toFixed(2)}</p>
              <p style={styles.timeUnit}>mtCO2e</p>
            </div>
            <div style={styles.timeCard}>
              <p style={styles.timeLabel}>Year Total</p>
              <p style={styles.timeValue}>{yearlyEmissions.toFixed(2)}</p>
              <p style={styles.timeUnit}>mtCO2e/year</p>
            </div>
            <div style={styles.timeCard}>
              <p style={styles.timeLabel}>Per Hour</p>
              <p style={styles.timeValue}>{(emissionsPerHour * 1000).toFixed(1)}</p>
              <p style={styles.timeUnit}>kg CO2e</p>
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}><p style={styles.statLabel}>Total Electricity</p><p style={styles.statValue}>{totalKwh.toLocaleString()}</p><p style={styles.statUnit}>kWh/year</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Zero-Emission</p><p style={styles.statValue}>48%</p><p style={styles.statUnit}>of grid mix</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Buildings</p><p style={styles.statValue}>{buildingsData.length}</p><p style={styles.statUnit}>monitored</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Emission Factor</p><p style={styles.statValue}>0.096</p><p style={styles.statUnit}>kg CO2/kWh</p></div>
          </div>

          <div style={{ maxWidth: 700, margin: '0 auto 20px' }}>
            <EnergyEquivalents kwh={totalKwh} label="This year's electricity is equivalent to" />
          </div>

          <div style={styles.mixSummary}>
            <h3 style={styles.sectionTitle}>ISO New England Grid Mix (2024)</h3>
            <div style={styles.mixGrid}>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#ef4444'}}></span>Natural Gas: 51%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#8b5cf6'}}></span>Nuclear: 23%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#22c55e'}}></span>Renewables: 12%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#06b6d4'}}></span>Net Imports: 7%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#3b82f6'}}></span>Hydro: 6%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#f97316'}}></span>Oil: 1%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#6b7280'}}></span>Coal: 0.23%</div>
            </div>
          </div>

          <div style={styles.equivSection}>
            <h3 style={styles.sectionTitle}>Environmental Impact Equivalents</h3>
            <div style={styles.equivGrid}>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🚗</span><p style={styles.equivValue}>48</p><p style={styles.equivLabel}>Cars driven for 1 year</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🌳</span><p style={styles.equivValue}>3,660</p><p style={styles.equivLabel}>Trees needed to offset</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🏠</span><p style={styles.equivValue}>25</p><p style={styles.equivLabel}>Homes energy for 1 year</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>✈️</span><p style={styles.equivValue}>56</p><p style={styles.equivLabel}>Cross-country flights</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>⛽</span><p style={styles.equivValue}>24,900</p><p style={styles.equivLabel}>Gallons of gasoline</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>💡</span><p style={styles.equivValue}>21,200</p><p style={styles.equivLabel}>100W bulbs for 1 year</p></div>
            </div>
          </div>
        </>
      )}

      {/* TIME ANALYSIS TAB */}
      {viewMode === 'time' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Time-Based Emissions Analysis</h3>
          
          <div style={styles.timeSection}>
            <h4 style={styles.subTitle}>Daily Emissions by Day of Week</h4>
            <p style={styles.hint}>Average daily emissions vary based on campus activity</p>
            {dayOfWeekData.map((d, i) => (
              <div key={i} style={{...styles.dayRow, backgroundColor: currentDayOfWeek === i ? '#334155' : 'transparent'}}>
                <span style={styles.dayName}>{d.day} {currentDayOfWeek === i && '(Today)'}</span>
                <div style={styles.dayBarContainer}>
                  <div style={{...styles.dayBar, width: `${d.multiplier * 80}%`}} />
                </div>
                <span style={styles.dayValue}>{(emissionsPerDay * d.multiplier * 1000).toFixed(0)} kg</span>
                <span style={styles.dayLabel}>{d.label}</span>
              </div>
            ))}
          </div>

          <div style={styles.timeSection}>
            <h4 style={styles.subTitle}>Monthly Emissions Pattern</h4>
            <p style={styles.hint}>Emissions vary with heating demand. Months with a green border carry measured BMS data; the rest are seasonal-pattern projections until the BMS export ships.</p>
            <div style={styles.monthGrid}>
              {(() => {
                const measuredKeys = new Set(campusMonthlyTotals().map((r) => r.month));
                return monthlyData.map((m, i) => {
                  const measured = measuredKeys.has(`2026-${String(i + 1).padStart(2, '0')}`);
                  return (
                    <div
                      key={i}
                      style={{
                        ...styles.monthCard,
                        borderColor: measured ? '#22c55e' : (currentMonth === i ? '#fbbf24' : '#334155'),
                        borderStyle: measured ? 'solid' : 'dashed',
                      }}
                    >
                      <p style={styles.monthName}>{m.month}</p>
                      <p style={styles.monthValue}>{m.emissions}</p>
                      <p style={styles.monthUnit}>mtCO2e</p>
                      <p style={styles.monthHeat}>{measured ? 'BMS measured' : `Heating: ${m.heating}`}</p>
                    </div>
                  );
                });
              })()}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10, flexWrap: 'wrap', fontSize: 12 }}>
              <ProvenancePill provenance="measured" />
              <span style={{ color: '#94a3b8' }}>solid green border = BMS month</span>
              <span style={{ width: 8 }} />
              <ProvenancePill provenance="estimated" />
              <span style={{ color: '#94a3b8' }}>dashed border = seasonal-pattern proxy</span>
            </div>
          </div>

          <div style={styles.timeSection}>
            <h4 style={styles.subTitle}>Real-Time Breakdown</h4>
            <div style={styles.realTimeGrid}>
              <div style={styles.realTimeCard}>
                <p style={styles.rtLabel}>Per Second</p>
                <p style={styles.rtValue}>{(emissionsPerSecond * 1000000).toFixed(2)}</p>
                <p style={styles.rtUnit}>grams CO2e</p>
              </div>
              <div style={styles.realTimeCard}>
                <p style={styles.rtLabel}>Per Minute</p>
                <p style={styles.rtValue}>{(emissionsPerMinute * 1000).toFixed(2)}</p>
                <p style={styles.rtUnit}>grams CO2e</p>
              </div>
              <div style={styles.realTimeCard}>
                <p style={styles.rtLabel}>Per Hour</p>
                <p style={styles.rtValue}>{(emissionsPerHour * 1000).toFixed(1)}</p>
                <p style={styles.rtUnit}>kg CO2e</p>
              </div>
              <div style={styles.realTimeCard}>
                <p style={styles.rtLabel}>Per Day</p>
                <p style={styles.rtValue}>{(emissionsPerDay * 1000).toFixed(0)}</p>
                <p style={styles.rtUnit}>kg CO2e</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUILDINGS TAB */}
      {viewMode === 'buildings' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Energy Usage by Building</h3>
          <p style={styles.hint}>Click on each building for details • Data from Envysion (01-27 to 02-25-2026)</p>
          
          <div style={styles.categoryLegend}>
            <span style={styles.legendItem}><span style={{...styles.legendDot, backgroundColor: '#ef4444'}}></span> Academic</span>
            <span style={styles.legendItem}><span style={{...styles.legendDot, backgroundColor: '#3b82f6'}}></span> Athletic</span>
            <span style={styles.legendItem}><span style={{...styles.legendDot, backgroundColor: '#22c55e'}}></span> Dorm</span>
            <span style={styles.legendItem}><span style={{...styles.legendDot, backgroundColor: '#9ca3af'}}></span> Other</span>
          </div>

          {buildingsWithEmissions.map((b, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardHeader} onClick={() => setExpandedBuilding(expandedBuilding === i ? null : i)}>
                <div>
                  <p style={styles.cardName}>
                    <span style={{...styles.categoryDot, backgroundColor: b.category === 'Academic' ? '#ef4444' : b.category === 'Athletic' ? '#3b82f6' : b.category === 'Dorm' ? '#22c55e' : '#9ca3af'}}></span>
                    {b.name}
                  </p>
                  <p style={styles.cardStats}>{b.energyUsed.toLocaleString()} kW-hr | {b.emissions} mtCO2e | {b.percentOfTotal}%</p>
                </div>
                <span style={styles.arrow}>{expandedBuilding === i ? '▼' : '▶'}</span>
              </div>
              <div style={styles.bar}><div style={{...styles.barFill, width: `${parseFloat(b.percentOfTotal) * 3}%`, backgroundColor: b.category === 'Academic' ? '#ef4444' : b.category === 'Athletic' ? '#3b82f6' : b.category === 'Dorm' ? '#22c55e' : '#9ca3af'}} /></div>
              {expandedBuilding === i && (
                <div style={styles.details}>
                  <div style={styles.detailGrid}>
                    <div><strong>Category:</strong> {b.category}</div>
                    <div><strong>Energy Used:</strong> {b.energyUsed.toLocaleString()} kW-hr</div>
                    <div><strong>Current Power:</strong> {b.power} kW</div>
                    <div><strong>Avg Voltage:</strong> {b.avgVoltage} V</div>
                    <div><strong>CO2 Emissions:</strong> {b.emissions} mtCO2e</div>
                    <div><strong>Campus Share:</strong> {b.percentOfTotal}%</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={styles.total}><span>CAMPUS TOTAL</span><span>{totalEnergyKwh.toLocaleString()} kW-hr | {yearlyEmissions.toFixed(2)} mtCO2e</span></div>
        </div>
      )}

      {/* ENERGY SOURCES TAB */}
      {viewMode === 'sources' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Emissions by Energy Source</h3>
          <p style={styles.hint}>Click on each source for details • Based on Liberty Utilities NE System Mix</p>
          
          {emissionsData.map((s, i) => (
            <div key={i} style={styles.sourceCard}>
              <div style={styles.sourceHeader} onClick={() => setExpandedSource(expandedSource === i ? null : i)}>
                <div>
                  <p style={styles.sourceName}>{s.source}</p>
                  <p style={styles.sourceStats}>
                    {s.emissions > 0 ? `${s.emissions} mtCO2e (${s.percentage}% of emissions)` : 'Zero emissions'} • {s.mixPercent}% of grid mix
                  </p>
                </div>
                <span style={styles.arrow}>{expandedSource === i ? '▼' : '▶'}</span>
              </div>
              <div style={styles.bar}><div style={{...styles.barFill, width: `${s.mixPercent * 2}%`, backgroundColor: s.color}} /></div>
              
              {expandedSource === i && (
                <div style={styles.sourceDetails}>
                  <div style={styles.detailBlock}>
                    <h4 style={styles.detailHeader}>⚡ How It Works</h4>
                    <p style={styles.detailText}>{s.howItWorks}</p>
                  </div>

                  <div style={styles.detailBlock}>
                    <h4 style={styles.detailHeader}>🔬 Chemical Process</h4>
                    <p style={styles.detailText}>{s.chemicalProcess}</p>
                  </div>

                  <div style={styles.detailBlock}>
                    <h4 style={styles.detailHeader}>🌍 Environmental Impacts</h4>
                    <ul style={styles.impactList}>
                      {s.environmentalImpacts.map((impact, j) => (
                        <li key={j} style={styles.impactItem}>{impact}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={styles.detailBlock}>
                    <h4 style={styles.detailHeader}>🌐 Regional Context</h4>
                    <p style={styles.detailText}>{s.globalContext}</p>
                  </div>

                  <div style={styles.detailBlock}>
                    <h4 style={styles.detailHeader}>⚙️ Efficiency</h4>
                    <p style={styles.detailText}>{s.efficiency}</p>
                  </div>

                  <div style={styles.detailBlock}>
                    <h4 style={styles.detailHeader}>💰 Cost Comparison</h4>
                    <p style={styles.detailText}>{s.costComparison}</p>
                  </div>

                  <div style={styles.detailBlock}>
                    <h4 style={styles.detailHeader}>📚 History</h4>
                    <p style={styles.detailText}>{s.history}</p>
                  </div>

                  <div style={styles.detailBlock}>
                    <h4 style={styles.detailHeader}>♻️ Cleaner Alternatives</h4>
                    <p style={styles.detailText}>{s.alternatives}</p>
                  </div>

                  <div style={styles.calcBox}>
                    <h4 style={styles.detailHeader}>📈 KUA Calculation</h4>
                    <p>Grid Mix Share: {s.mixPercent}%</p>
                    <p>KUA kWh from this source: {s.kwhUsed.toLocaleString()} kWh</p>
                    <p>Emission Factor: {s.emissionFactor} tonnes/kWh</p>
                    <p>Total Emissions: <strong>{s.emissions} mtCO2e</strong></p>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div style={styles.total}><span>TOTAL ANNUAL EMISSIONS</span><span>{yearlyEmissions} mtCO2e</span></div>

          <div style={styles.gasSection}>
            <h4 style={styles.subTitle}>Understanding Greenhouse Gases</h4>
            <div style={styles.gasGrid}>
              <div style={styles.gasCard}>
                <h5 style={styles.gasName}>CO2 - Carbon Dioxide</h5>
                <p style={styles.gasText}>The most abundant greenhouse gas from human activity. Stays in atmosphere 300-1000 years. Baseline for measuring other gases (GWP = 1).</p>
              </div>
              <div style={styles.gasCard}>
                <h5 style={styles.gasName}>N2O - Nitrous Oxide</h5>
                <p style={styles.gasText}>298x more potent than CO2 (GWP = 298). Stays ~114 years. From combustion and agriculture.</p>
              </div>
              <div style={styles.gasCard}>
                <h5 style={styles.gasName}>CH4 - Methane</h5>
                <p style={styles.gasText}>84x more potent than CO2 over 20 years (GWP = 84). Stays ~12 years. From natural gas leaks and landfills.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px', fontFamily: 'Arial', color: 'white' },
  header: { textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '20px' },
  logo: { width: '60px', height: '60px', backgroundColor: '#b91c1c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' },
  logoText: { color: 'white', fontWeight: 'bold', fontSize: '1.2rem' },
  title: { fontSize: '1.8rem', color: '#22c55e', marginBottom: '5px' },
  subtitle: { fontSize: '1rem', color: '#94a3b8', marginBottom: '10px' },
  liveIndicator: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#22c55e', fontWeight: 'bold' },
  liveDot: { width: '12px', height: '12px', borderRadius: '50%' },
  dataSource: { fontSize: '0.8rem', color: '#64748b', margin: '5px 0' },
  navButtons: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  navButton: { padding: '10px 20px', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.9rem' },
  mainCounter: { textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '16px', padding: '25px', maxWidth: '400px', margin: '0 auto 20px' },
  counterLabel: { fontSize: '0.9rem', color: '#94a3b8' },
  counterValue: { fontSize: '2.5rem', fontWeight: 'bold', color: '#22c55e', fontFamily: 'monospace' },
  counterUnit: { fontSize: '0.9rem', color: '#64748b' },
  toggleButton: { marginTop: '15px', padding: '8px 20px', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  timeCards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', maxWidth: '600px', margin: '0 auto 20px' },
  timeCard: { backgroundColor: '#1e293b', borderRadius: '10px', padding: '15px', textAlign: 'center' },
  timeLabel: { fontSize: '0.75rem', color: '#94a3b8' },
  timeValue: { fontSize: '1.3rem', fontWeight: 'bold', color: '#22c55e' },
  timeUnit: { fontSize: '0.7rem', color: '#64748b' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', maxWidth: '600px', margin: '0 auto 20px' },
  statCard: { backgroundColor: '#1e293b', borderRadius: '10px', padding: '12px', textAlign: 'center' },
  statLabel: { fontSize: '0.7rem', color: '#94a3b8' },
  statValue: { fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e' },
  statUnit: { fontSize: '0.65rem', color: '#64748b' },
  mixSummary: { maxWidth: '600px', margin: '0 auto 20px', backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px' },
  mixGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' },
  mixItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' },
  mixDot: { width: '12px', height: '12px', borderRadius: '50%' },
  equivSection: { maxWidth: '700px', margin: '0 auto 20px', backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px' },
  sectionTitle: { fontSize: '1.2rem', color: '#22c55e', marginBottom: '15px', textAlign: 'center' },
  equivGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' },
  equivCard: { backgroundColor: '#334155', borderRadius: '8px', padding: '12px', textAlign: 'center' },
  equivIcon: { fontSize: '1.5rem' },
  equivValue: { fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e' },
  equivLabel: { fontSize: '0.65rem', color: '#94a3b8' },
  section: { maxWidth: '800px', margin: '0 auto 20px', backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px' },
  hint: { fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginBottom: '15px' },
  subTitle: { fontSize: '1rem', color: '#f97316', marginBottom: '10px' },
  timeSection: { marginBottom: '30px' },
  dayRow: { display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '6px', marginBottom: '5px', flexWrap: 'wrap' },
  dayName: { width: '100px', fontSize: '0.85rem', color: '#e2e8f0' },
  dayBarContainer: { flex: 1, minWidth: '100px', height: '20px', backgroundColor: '#0f172a', borderRadius: '10px', marginRight: '10px' },
  dayBar: { height: '100%', backgroundColor: '#22c55e', borderRadius: '10px' },
  dayValue: { width: '60px', fontSize: '0.8rem', color: '#22c55e', textAlign: 'right' },
  dayLabel: { width: '120px', fontSize: '0.7rem', color: '#64748b', textAlign: 'right' },
  monthGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '8px' },
  monthCard: { backgroundColor: '#334155', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '2px solid' },
  monthName: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '3px' },
  monthValue: { fontSize: '1rem', fontWeight: 'bold', color: '#22c55e' },
  monthUnit: { fontSize: '0.6rem', color: '#64748b' },
  monthHeat: { fontSize: '0.6rem', color: '#f97316', marginTop: '3px' },
  realTimeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '10px' },
  realTimeCard: { backgroundColor: '#334155', borderRadius: '8px', padding: '12px', textAlign: 'center' },
  rtLabel: { fontSize: '0.7rem', color: '#94a3b8' },
  rtValue: { fontSize: '1.1rem', fontWeight: 'bold', color: '#22c55e' },
  rtUnit: { fontSize: '0.6rem', color: '#64748b' },
  categoryLegend: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#94a3b8' },
  legendDot: { width: '10px', height: '10px', borderRadius: '50%' },
  categoryDot: { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' },
  card: { marginBottom: '8px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#334155', borderRadius: '8px', cursor: 'pointer' },
  cardName: { color: '#e2e8f0', fontWeight: 'bold', fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center' },
  cardStats: { color: '#94a3b8', fontSize: '0.75rem', margin: 0 },
  arrow: { color: '#22c55e' },
  bar: { height: '6px', backgroundColor: '#0f172a', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '3px' },
  details: { backgroundColor: '#0f172a', borderRadius: '8px', padding: '15px', marginTop: '8px', border: '1px solid #334155' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' },
  total: { display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '12px', borderTop: '2px solid #22c55e', fontWeight: 'bold', color: '#22c55e', fontSize: '0.9rem' },
  sourceCard: { marginBottom: '12px' },
  sourceHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#334155', borderRadius: '8px', cursor: 'pointer' },
  sourceName: { color: '#e2e8f0', fontWeight: 'bold', fontSize: '0.9rem', margin: 0 },
  sourceStats: { color: '#94a3b8', fontSize: '0.75rem', margin: 0 },
  sourceDetails: { backgroundColor: '#0f172a', borderRadius: '8px', padding: '15px', marginTop: '8px', border: '1px solid #334155' },
  detailBlock: { marginBottom: '15px' },
  detailHeader: { color: '#22c55e', fontSize: '0.9rem', marginBottom: '5px' },
  detailText: { color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 },
  impactList: { margin: '0', paddingLeft: '20px' },
  impactItem: { color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '4px' },
  calcBox: { backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: '#cbd5e1' },
  gasSection: { marginTop: '20px' },
  gasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' },
  gasCard: { backgroundColor: '#334155', padding: '12px', borderRadius: '8px' },
  gasName: { color: '#22c55e', fontSize: '0.85rem', marginBottom: '5px' },
  gasText: { color: '#94a3b8', fontSize: '0.75rem', margin: 0, lineHeight: '1.4' },
  footer: { textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginTop: '30px' },
  adminLink: { display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#334155', color: '#22c55e', textDecoration: 'none', borderRadius: '8px' }
};
