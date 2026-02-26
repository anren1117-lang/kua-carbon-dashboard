import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [currentEmissions, setCurrentEmissions] = useState(0);
  const [todayEmissions, setTodayEmissions] = useState(0);
  const [monthEmissions, setMonthEmissions] = useState(0);
  const [yearEmissions, setYearEmissions] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [expandedSource, setExpandedSource] = useState(null);
  const [expandedBuilding, setExpandedBuilding] = useState(null);
  const [viewMode, setViewMode] = useState('overview');

  // Original spreadsheet data - 312.40 mtCO2e annual
  const yearlyEmissions = 312.40;
  const emissionsPerSecond = yearlyEmissions / (365 * 24 * 60 * 60);
  const emissionsPerMinute = yearlyEmissions / (365 * 24 * 60);
  const emissionsPerHour = yearlyEmissions / (365 * 24);
  const emissionsPerDay = yearlyEmissions / 365;
  const emissionsPerMonth = yearlyEmissions / 12;

  // Building data from Envysion
  const buildingsData = [
    { name: 'Miller Bicentennial Hall', energyUsed: 44695, power: 72.7, avgVoltage: 209, category: 'Academic' },
    { name: 'Whittemore Athletic Center', energyUsed: 43193, power: 74.7, avgVoltage: 205, category: 'Athletic' },
    { name: 'Barrette', energyUsed: 35365, power: 28.1, avgVoltage: 209, category: 'Dorm' },
    { name: 'Kilton House', energyUsed: 20069, power: 20.1, avgVoltage: 121, category: 'Dorm' },
    { name: 'Fitch', energyUsed: 15427, power: 21.0, avgVoltage: 209, category: 'Academic' },
    { name: 'Alumni Silver Gym', energyUsed: 11407, power: 10.2, avgVoltage: 208, category: 'Athletic' },
    { name: 'Flickinger Arts Center', energyUsed: 9717, power: 17.2, avgVoltage: 210, category: 'Academic' },
    { name: 'Chellis Hall', energyUsed: 5217, power: 7.1, avgVoltage: 240, category: 'Dorm' },
    { name: 'Welch House', energyUsed: 5511, power: 12.0, avgVoltage: 121, category: 'Dorm' },
    { name: 'Dexter-Richards Hall', energyUsed: 5105, power: 0.6, avgVoltage: 209, category: 'Dorm' },
    { name: 'Densmore Hall', energyUsed: 4768, power: 11.0, avgVoltage: 209, category: 'Dorm' },
    { name: 'Kurth Hall', energyUsed: 3784, power: 2.8, avgVoltage: 243, category: 'Dorm' },
    { name: 'Baxter', energyUsed: 2403, power: 1.9, avgVoltage: 209, category: 'Dorm' },
    { name: 'Bryant Hall', energyUsed: 2288, power: 3.9, avgVoltage: 209, category: 'Dorm' },
    { name: 'Rowe Hall', energyUsed: 2072, power: 2.2, avgVoltage: 208, category: 'Dorm' },
    { name: 'Bishop Alumni House', energyUsed: 1826, power: 1.6, avgVoltage: 239, category: 'Dorm' },
    { name: 'Child Care Center', energyUsed: 1738, power: 0.6, avgVoltage: 209, category: 'Other' },
    { name: 'Mikula Hall', energyUsed: 1595, power: 1.6, avgVoltage: 240, category: 'Dorm' }
  ];

  const totalEnergyKwh = buildingsData.reduce((sum, b) => sum + b.energyUsed, 0);
  const totalPowerKw = buildingsData.reduce((sum, b) => sum + b.power, 0);

  // Comprehensive energy source data with detailed information
  const emissionsData = [
    { 
      source: 'Natural Gas Plants', 
      emissions: 141.19, 
      percentage: 45.2, 
      color: '#ef4444',
      libertyMix: 33.83,
      kwhUsed: 783699,
      // Emission Factors (tonnes per kWh)
      co2Factor: 0.00018,
      n2oFactor: 0.0000001,
      ch4Factor: 0.00000007,
      // Detailed Information
      howItWorks: 'Natural gas (primarily methane, CH4) is extracted from underground reservoirs and transported via pipelines to power plants. In combined-cycle plants, gas is burned in combustion turbines, and the hot exhaust drives steam turbines for additional power generation.',
      chemicalProcess: 'CH4 + 2O2 → CO2 + 2H2O + Heat. The combustion of methane releases carbon dioxide and water vapor, along with trace amounts of nitrogen oxides (NOx) from high-temperature combustion.',
      environmentalImpacts: [
        'Produces about 50% less CO2 than coal per kWh',
        'Methane leaks during extraction (2-3% of production) significantly increase warming impact',
        'Hydraulic fracturing (fracking) can contaminate groundwater',
        'Lower particulate and sulfur emissions than coal or oil',
        'Water usage for cooling affects local water systems',
        'Land disruption from drilling operations'
      ],
      globalContext: 'Natural gas provides about 24% of world electricity. Usage is increasing as countries transition away from coal. The US is the worlds largest producer due to shale gas revolution.',
      efficiency: '40-60% efficient in combined-cycle plants (best among fossil fuels). Simple cycle plants are only 30-35% efficient.',
      costComparison: 'Moderate cost at $0.05-0.08 per kWh. Price volatile due to market fluctuations. Generally cheaper than oil but more expensive than coal.',
      alternatives: 'Renewable natural gas (from landfills/farms), hydrogen blending, transition to wind/solar with battery storage, geothermal for baseload power.',
      history: 'First used for electricity in 1940s. Became major source after 1970s oil crisis. Shale gas boom since 2008 made it dominant fuel in US power generation.'
    },
    { 
      source: 'Coal Fired Plants', 
      emissions: 119.18, 
      percentage: 38.2, 
      color: '#f97316',
      libertyMix: 56.75,
      kwhUsed: 1314588,
      co2Factor: 0.00032,
      n2oFactor: 0.00000148,
      ch4Factor: 0.00000007,
      howItWorks: 'Coal is mined (surface or underground), transported by rail/ship, and pulverized into fine powder. This powder is blown into boilers where it burns at 1,400°C, heating water into high-pressure steam that spins turbine generators.',
      chemicalProcess: 'C + O2 → CO2 + Heat. Coal also contains sulfur (S + O2 → SO2) and nitrogen compounds that form NOx. Incomplete combustion releases carbon monoxide and particulates.',
      environmentalImpacts: [
        'Highest CO2 emissions of any fuel (2x natural gas)',
        'Releases mercury, arsenic, and other toxic heavy metals',
        'Sulfur dioxide causes acid rain',
        'Particulate matter (PM2.5) causes respiratory diseases',
        'Coal ash ponds contain toxic waste that can leak',
        'Mining destroys ecosystems and displaces communities',
        'Black lung disease in miners',
        'Largest single source of global CO2 emissions'
      ],
      globalContext: 'Coal provides 36% of world electricity but declining in developed nations. China and India still building new plants. Coal power peaked in US in 2007.',
      efficiency: 'Only 33-40% efficient. Supercritical plants reach 45%. Most energy lost as waste heat.',
      costComparison: 'Cheapest fuel at $0.03-0.05 per kWh, but environmental costs not included. Carbon pricing makes it uneconomical.',
      alternatives: 'Direct replacement with solar/wind. Natural gas for baseload. Nuclear for 24/7 power. Battery storage for reliability.',
      history: 'First coal power plant built 1882 (Edison). Dominated 20th century electricity. Now being phased out due to climate concerns.'
    },
    { 
      source: 'Oil-Fired Plants', 
      emissions: 25.45, 
      percentage: 8.1, 
      color: '#eab308',
      libertyMix: 4.38,
      kwhUsed: 101461,
      co2Factor: 0.00025,
      n2oFactor: 0.00000064,
      ch4Factor: 0.00000022,
      howItWorks: 'Petroleum is refined into heavy fuel oil or diesel, then burned in boilers or combustion turbines. Oil plants often serve as peaking plants due to quick startup times (minutes vs hours for coal).',
      chemicalProcess: 'CxHy + O2 → CO2 + H2O + Heat. Petroleum hydrocarbons combust to form CO2 and water. Sulfur impurities create SO2; nitrogen forms NOx at high temperatures.',
      environmentalImpacts: [
        'CO2 emissions between gas and coal',
        'Oil spills during transport devastate marine ecosystems',
        'Refining process creates additional pollution',
        'Sulfur content causes acid rain',
        'Offshore drilling threatens ocean habitats',
        'Geopolitical conflicts over oil resources',
        'Groundwater contamination from storage tanks'
      ],
      globalContext: 'Oil provides only 3% of world electricity (down from 25% in 1970s). Mostly used in island nations and for backup power. Being replaced by natural gas and renewables.',
      efficiency: '35-45% efficient. Combined-cycle oil plants can reach 50%.',
      costComparison: 'Most expensive fossil fuel at $0.10-0.20 per kWh. Price highly volatile based on global markets.',
      alternatives: 'Solar + batteries ideal for islands. Biodiesel as transition fuel. LNG for remote areas.',
      history: 'Peaked in 1970s during oil embargo. Rapidly declined as prices rose. Now mainly backup power.'
    },
    { 
      source: 'Landfill Gas Plants', 
      emissions: 13.56, 
      percentage: 4.3, 
      color: '#22c55e',
      libertyMix: 3.24,
      kwhUsed: 75054,
      co2Factor: 0.00018,
      n2oFactor: 0.00000067,
      ch4Factor: 0.00000023,
      howItWorks: 'Organic waste in landfills decomposes anaerobically (without oxygen), producing landfill gas (50-60% methane, 40-50% CO2). This gas is collected through wells and pipes, cleaned of impurities, and burned in engines or turbines.',
      chemicalProcess: 'Organic matter → CH4 + CO2 (anaerobic decomposition). Then: CH4 + 2O2 → CO2 + 2H2O + Heat. Converting methane to CO2 reduces warming impact by 84x over 20 years.',
      environmentalImpacts: [
        'POSITIVE: Captures methane that would escape to atmosphere',
        'Methane is 84x more potent than CO2 over 20 years',
        'Reduces landfill odors and explosion risks',
        'Still produces CO2 when burned',
        'Extends useful life of landfills',
        'Creates local jobs at waste facilities',
        'Considered carbon-neutral by some standards'
      ],
      globalContext: 'Landfill gas provides less than 1% of world electricity. US has 500+ landfill gas projects. Growing as waste management improves.',
      efficiency: '25-35% efficient. Lower than fossil fuels due to gas impurities.',
      costComparison: 'Low cost at $0.04-0.07 per kWh. Often subsidized as renewable energy.',
      alternatives: 'Composting reduces waste. Anaerobic digesters more efficient. Zero-waste policies eliminate need.',
      history: 'First commercial landfill gas plant 1975. EPA regulations in 1990s required gas capture at large landfills.'
    },
    { 
      source: 'Municipal Trash Plants', 
      emissions: 13.02, 
      percentage: 4.2, 
      color: '#3b82f6',
      libertyMix: 1.8,
      kwhUsed: 41696,
      co2Factor: 0.00031,
      n2oFactor: 0.00000444,
      ch4Factor: 0.00000229,
      howItWorks: 'Municipal solid waste (MSW) is burned at 850-1100°C in specialized incinerators with air pollution controls. Heat produces steam for electricity generation. Modern plants include filters for particulates and scrubbers for acid gases.',
      chemicalProcess: 'Mixed waste + O2 → CO2 + H2O + ash + pollutants. Plastics release more CO2 per pound than biomass. Incomplete combustion creates dioxins and furans.',
      environmentalImpacts: [
        'Reduces landfill volume by 90%',
        'High N2O emissions from burning plastics',
        'Can release toxic dioxins and furans',
        'Heavy metals concentrate in ash',
        'Ash disposal requires special handling',
        'Destroys materials that could be recycled',
        'Air pollution concerns near facilities',
        'Environmental justice issues (plants often in low-income areas)'
      ],
      globalContext: 'Waste-to-energy provides 2% of world electricity. Popular in Europe and Japan where land is scarce. Controversial in environmental community.',
      efficiency: '20-30% efficient. Combined heat and power systems reach 80% energy recovery.',
      costComparison: 'High cost at $0.08-0.15 per kWh. Tipping fees from waste provide additional revenue.',
      alternatives: 'Zero-waste policies, enhanced recycling, composting, chemical recycling of plastics.',
      history: 'First US plant 1975. Growth in 1980s during landfill crisis. Now controversial as recycling improves.'
    }
  ];

  // Day of week averages (estimated based on school patterns)
  const dayOfWeekData = [
    { day: 'Monday', multiplier: 1.15, label: 'High - Week starts' },
    { day: 'Tuesday', multiplier: 1.12, label: 'High - Full operations' },
    { day: 'Wednesday', multiplier: 1.10, label: 'High - Mid-week peak' },
    { day: 'Thursday', multiplier: 1.08, label: 'Moderate - Winding down' },
    { day: 'Friday', multiplier: 0.95, label: 'Lower - Weekend prep' },
    { day: 'Saturday', multiplier: 0.75, label: 'Low - Weekend' },
    { day: 'Sunday', multiplier: 0.70, label: 'Lowest - Weekend' }
  ];

  // Monthly patterns (estimated based on seasons)
  const monthlyData = [
    { month: 'Jan', emissions: 32.5, heating: 'High' },
    { month: 'Feb', emissions: 30.8, heating: 'High' },
    { month: 'Mar', emissions: 28.2, heating: 'Moderate' },
    { month: 'Apr', emissions: 24.5, heating: 'Low' },
    { month: 'May', emissions: 22.1, heating: 'None' },
    { month: 'Jun', emissions: 18.5, heating: 'None' },
    { month: 'Jul', emissions: 15.2, heating: 'None' },
    { month: 'Aug', emissions: 16.8, heating: 'None' },
    { month: 'Sep', emissions: 23.4, heating: 'Low' },
    { month: 'Oct', emissions: 26.7, heating: 'Moderate' },
    { month: 'Nov', emissions: 29.8, heating: 'High' },
    { month: 'Dec', emissions: 31.2, heating: 'High' }
  ];

  const initializeEmissions = useCallback(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const msInYear = now - startOfYear;
    const msInMonth = now - startOfMonth;
    const msInDay = now - startOfDay;
    
    const msPerYear = 365 * 24 * 60 * 60 * 1000;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const msPerMonth = daysInMonth * 24 * 60 * 60 * 1000;
    const msPerDay = 24 * 60 * 60 * 1000;
    
    setYearEmissions((msInYear / msPerYear) * yearlyEmissions);
    setMonthEmissions((msInMonth / msPerMonth) * emissionsPerMonth);
    setTodayEmissions((msInDay / msPerDay) * emissionsPerDay);
    setCurrentEmissions((msInYear / msPerYear) * yearlyEmissions);
  }, [yearlyEmissions, emissionsPerMonth, emissionsPerDay]);

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

  const buildingsWithEmissions = buildingsData.map(b => ({
    ...b,
    emissions: (b.energyUsed * 0.000135).toFixed(2),
    percentOfTotal: ((b.energyUsed / totalEnergyKwh) * 100).toFixed(1)
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
        <p style={styles.dataSource}>Data Source: Liberty Electric Generation Mix 2024</p>
      </header>

      <div style={styles.navButtons}>
        <button style={{...styles.navButton, backgroundColor: viewMode === 'overview' ? '#22c55e' : '#334155'}} onClick={() => setViewMode('overview')}>Overview</button>
        <button style={{...styles.navButton, backgroundColor: viewMode === 'time' ? '#22c55e' : '#334155'}} onClick={() => setViewMode('time')}>Time Analysis</button>
        <button style={{...styles.navButton, backgroundColor: viewMode === 'buildings' ? '#22c55e' : '#334155'}} onClick={() => setViewMode('buildings')}>Buildings</button>
        <button style={{...styles.navButton, backgroundColor: viewMode === 'sources' ? '#22c55e' : '#334155'}} onClick={() => setViewMode('sources')}>Energy Sources</button>
      </div>

      {/* OVERVIEW TAB */}
      {viewMode === 'overview' && (
        <>
          <div style={styles.mainCounter}>
            <p style={styles.counterLabel}>Year-to-Date CO2 Emissions</p>
            <p style={styles.counterValue}>{yearEmissions.toFixed(4)}</p>
            <p style={styles.counterUnit}>metric tonnes CO2e</p>
            <button style={styles.toggleButton} onClick={() => setIsLive(!isLive)}>{isLive ? 'Pause' : 'Resume'}</button>
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
            <div style={styles.statCard}><p style={styles.statLabel}>Total Electricity</p><p style={styles.statValue}>2,316,469</p><p style={styles.statUnit}>kWh/year</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Annual Cost</p><p style={styles.statValue}>$347,470</p><p style={styles.statUnit}>per year</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Buildings</p><p style={styles.statValue}>{buildingsData.length}</p><p style={styles.statUnit}>monitored</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Energy Sources</p><p style={styles.statValue}>5</p><p style={styles.statUnit}>types</p></div>
          </div>

          <div style={styles.equivSection}>
            <h3 style={styles.sectionTitle}>Environmental Impact Equivalents</h3>
            <div style={styles.equivGrid}>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🚗</span><p style={styles.equivValue}>68</p><p style={styles.equivLabel}>Cars driven for 1 year</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🌳</span><p style={styles.equivValue}>5,155</p><p style={styles.equivLabel}>Trees needed to offset</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🏠</span><p style={styles.equivValue}>35</p><p style={styles.equivLabel}>Homes energy for 1 year</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>✈️</span><p style={styles.equivValue}>78</p><p style={styles.equivLabel}>Cross-country flights</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>⛽</span><p style={styles.equivValue}>35,100</p><p style={styles.equivLabel}>Gallons of gasoline</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>💡</span><p style={styles.equivValue}>23,164</p><p style={styles.equivLabel}>100W bulbs for 1 year</p></div>
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
            <p style={styles.hint}>Emissions vary with heating demand throughout the year</p>
            <div style={styles.monthGrid}>
              {monthlyData.map((m, i) => (
                <div key={i} style={{...styles.monthCard, borderColor: currentMonth === i ? '#22c55e' : '#334155'}}>
                  <p style={styles.monthName}>{m.month}</p>
                  <p style={styles.monthValue}>{m.emissions}</p>
                  <p style={styles.monthUnit}>mtCO2e</p>
                  <p style={styles.monthHeat}>Heating: {m.heating}</p>
                </div>
              ))}
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
          <div style={styles.total}><span>CAMPUS TOTAL</span><span>{totalEnergyKwh.toLocaleString()} kW-hr | {(totalEnergyKwh * 0.000135).toFixed(2)} mtCO2e</span></div>
        </div>
      )}

      {/* ENERGY SOURCES TAB */}
      {viewMode === 'sources' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Emissions by Energy Source</h3>
          <p style={styles.hint}>Click on each source for comprehensive details • Based on Liberty Electric generation mix</p>
          
          {emissionsData.map((s, i) => (
            <div key={i} style={styles.sourceCard}>
              <div style={styles.sourceHeader} onClick={() => setExpandedSource(expandedSource === i ? null : i)}>
                <div>
                  <p style={styles.sourceName}>{s.source}</p>
                  <p style={styles.sourceStats}>{s.emissions} mtCO2e ({s.percentage}%) • {s.libertyMix}% of Liberty mix</p>
                </div>
                <span style={styles.arrow}>{expandedSource === i ? '▼' : '▶'}</span>
              </div>
              <div style={styles.bar}><div style={{...styles.barFill, width: `${s.percentage * 2}%`, backgroundColor: s.color}} /></div>
              
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
                    <h4 style={styles.detailHeader}>📊 Emission Factors (per kWh)</h4>
                    <div style={styles.factorGrid}>
                      <div style={styles.factorItem}><span>CO2:</span> <span>{s.co2Factor} tonnes</span></div>
                      <div style={styles.factorItem}><span>N2O:</span> <span>{s.n2oFactor} tonnes</span></div>
                      <div style={styles.factorItem}><span>CH4:</span> <span>{s.ch4Factor} tonnes</span></div>
                    </div>
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
                    <h4 style={styles.detailHeader}>🌐 Global Context</h4>
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
                    <h4 style={styles.detailHeader}>♻️ Cleaner Alternatives</h4>
                    <p style={styles.detailText}>{s.alternatives}</p>
                  </div>

                  <div style={styles.detailBlock}>
                    <h4 style={styles.detailHeader}>📚 History</h4>
                    <p style={styles.detailText}>{s.history}</p>
                  </div>

                  <div style={styles.calcBox}>
                    <h4 style={styles.detailHeader}>📈 KUA Calculation</h4>
                    <p>Liberty Electric Mix: {s.libertyMix}%</p>
                    <p>KUA kWh from this source: {s.kwhUsed.toLocaleString()} kWh</p>
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
                <p style={styles.gasText}>298x more potent than CO2 (GWP = 298). Stays ~114 years. From combustion and agriculture. Also depletes ozone layer.</p>
              </div>
              <div style={styles.gasCard}>
                <h5 style={styles.gasName}>CH4 - Methane</h5>
                <p style={styles.gasText}>84x more potent than CO2 over 20 years (GWP = 84). Stays ~12 years. From natural gas leaks, landfills, livestock.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <p>Kimball Union Academy - Campus Carbon Emissions Dashboard</p>
        <p>Data: Liberty Electric Generation Mix 2024 | Total: {yearlyEmissions} mtCO2e/year</p>
        <Link to="/admin" style={styles.adminLink}>🔐 Admin Portal</Link>
      </footer>
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
  dayRow: { display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '6px', marginBottom: '5px' },
  dayName: { width: '100px', fontSize: '0.85rem', color: '#e2e8f0' },
  dayBarContainer: { flex: 1, height: '20px', backgroundColor: '#0f172a', borderRadius: '10px', marginRight: '10px' },
  dayBar: { height: '100%', backgroundColor: '#22c55e', borderRadius: '10px' },
  dayValue: { width: '60px', fontSize: '0.8rem', color: '#22c55e', textAlign: 'right' },
  dayLabel: { width: '120px', fontSize: '0.7rem', color: '#64748b', textAlign: 'right' },
  monthGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '8px' },
  monthCard: { backgroundColor: '#334155', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '2px solid' },
  monthName: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '3px' },
  monthValue: { fontSize: '1rem', fontWeight: 'bold', color: '#22c55e' },
  monthUnit: { fontSize: '0.6rem', color: '#64748b' },
  monthHeat: { fontSize: '0.6rem', color: '#f97316', marginTop: '3px' },
  realTimeGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
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
  factorGrid: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  factorItem: { backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1' },
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

export default App;
