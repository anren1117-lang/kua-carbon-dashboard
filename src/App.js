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

  // NEW Liberty NE System Mix - 242.22 mtCO2e annual
  const yearlyEmissions = 242.22;
  const totalKwh = 2316469;
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

  // NEW Liberty NE System Mix Energy Sources
  const emissionsData = [
    { 
      source: 'Natural Gas', 
      emissions: 197.02, 
      percentage: 81.3,
      mixPercent: 47.25,
      kwhUsed: 1094532,
      color: '#ef4444',
      emissionFactor: 0.00018,
      howItWorks: 'Natural gas (primarily methane, CH4) is extracted from underground reservoirs and transported via pipelines to power plants. In combined-cycle plants, gas is burned in combustion turbines, and the hot exhaust drives steam turbines for additional power generation.',
      chemicalProcess: 'CH4 + 2O2 → CO2 + 2H2O + Heat. The combustion of methane releases carbon dioxide and water vapor, along with trace amounts of nitrogen oxides (NOx).',
      environmentalImpacts: [
        'Produces about 50% less CO2 than coal per kWh',
        'Methane leaks during extraction (2-3%) increase warming impact',
        'Hydraulic fracturing (fracking) can contaminate groundwater',
        'Lower particulate and sulfur emissions than coal or oil',
        'Dominant fuel source in New England grid'
      ],
      globalContext: 'Natural gas provides about 50% of New England electricity. ISO-NE relies heavily on natural gas due to pipeline infrastructure and coal plant retirements.',
      efficiency: '40-60% efficient in combined-cycle plants (best among fossil fuels).',
      costComparison: 'Moderate cost at $0.05-0.08 per kWh. Price volatile due to market fluctuations and pipeline constraints in winter. Generally cheaper than oil but prices spike during cold snaps.',
      history: 'First used for electricity in 1940s. Became major source after 1970s oil crisis. Shale gas boom since 2008 made it dominant fuel in US power generation. Now provides nearly half of New England electricity.',
      alternatives: 'Renewable natural gas, hydrogen blending, wind/solar with battery storage.'
    },
    { 
      source: 'Oil', 
      emissions: 30.92, 
      percentage: 12.8,
      mixPercent: 5.34,
      kwhUsed: 123699,
      color: '#f97316',
      emissionFactor: 0.00025,
      howItWorks: 'Petroleum is refined into heavy fuel oil or diesel, then burned in boilers or combustion turbines. Oil plants often serve as peaking plants due to quick startup times.',
      chemicalProcess: 'CxHy + O2 → CO2 + H2O + Heat. Petroleum hydrocarbons combust to form CO2 and water.',
      environmentalImpacts: [
        'Higher CO2 emissions than natural gas',
        'Oil spills during transport devastate ecosystems',
        'Used mainly for backup/peak demand in New England',
        'Sulfur content causes acid rain',
        'Being phased out in favor of cleaner sources'
      ],
      globalContext: 'Oil provides about 5% of New England electricity, mainly during peak demand or when natural gas is constrained.',
      efficiency: '35-45% efficient.',
      costComparison: 'Most expensive fossil fuel at $0.10-0.20 per kWh. Price highly volatile based on global markets. Used mainly when other sources unavailable.',
      history: 'Peaked in 1970s during oil embargo. Rapidly declined as prices rose. Now mainly backup power and peak demand in New England.',
      alternatives: 'Battery storage for peak demand, demand response programs.'
    },
    { 
      source: 'Biomass', 
      emissions: 8.63, 
      percentage: 3.6,
      mixPercent: 1.62,
      kwhUsed: 37527,
      color: '#22c55e',
      emissionFactor: 0.00023,
      howItWorks: 'Organic materials (wood chips, agricultural waste, dedicated energy crops) are burned to produce steam that drives turbines. Some plants use gasification to convert biomass to gas first.',
      chemicalProcess: 'Biomass + O2 → CO2 + H2O + Heat. Carbon released was recently absorbed from atmosphere, making it carbon-neutral in theory.',
      environmentalImpacts: [
        'Considered carbon-neutral (CO2 absorbed during growth)',
        'Can use waste materials that would decompose anyway',
        'Reduces landfill waste',
        'Land use concerns if using dedicated crops',
        'Air quality impacts from burning',
        'Sustainable forestry practices important'
      ],
      globalContext: 'Biomass provides about 2% of New England electricity. NH has several biomass plants using wood from sustainable forestry.',
      efficiency: '20-25% efficient for direct combustion.',
      costComparison: 'Moderate cost at $0.06-0.10 per kWh. Fuel costs depend on local wood supply. Often receives renewable energy subsidies.',
      history: 'Used since early electricity generation. Modern biomass plants emerged in 1980s. NH has long history of forest products industry supporting biomass energy.',
      alternatives: 'Improved forestry practices, agricultural waste utilization.'
    },
    { 
      source: 'Municipal Solid Waste (MSW)', 
      emissions: 3.95, 
      percentage: 1.6,
      mixPercent: 0.55,
      kwhUsed: 12741,
      color: '#3b82f6',
      emissionFactor: 0.00031,
      howItWorks: 'Municipal solid waste (household trash) is burned at 850-1100°C in specialized incinerators. Heat produces steam for electricity. Modern plants include pollution controls.',
      chemicalProcess: 'Mixed waste + O2 → CO2 + H2O + ash + pollutants. Plastics release more CO2; organic matter releases biogenic CO2.',
      environmentalImpacts: [
        'Reduces landfill volume by 90%',
        'Generates energy from waste',
        'Can release dioxins and furans if not controlled',
        'Heavy metals concentrate in ash',
        'Competes with recycling programs',
        'Environmental justice concerns'
      ],
      globalContext: 'MSW provides less than 1% of New England electricity. Several waste-to-energy plants operate in the region.',
      efficiency: '20-30% efficient.',
      costComparison: 'High cost at $0.08-0.15 per kWh. However, tipping fees from waste disposal provide additional revenue, making it economically viable.',
      history: 'First US waste-to-energy plant 1975. Growth in 1980s during landfill crisis. Now controversial as recycling improves. Some plants closing due to competition from cheap natural gas.',
      alternatives: 'Zero-waste policies, enhanced recycling, composting.'
    },
    { 
      source: 'Coal', 
      emissions: 1.70, 
      percentage: 0.7,
      mixPercent: 0.23,
      kwhUsed: 5328,
      color: '#6b7280',
      emissionFactor: 0.00032,
      howItWorks: 'Coal is burned in boilers to create steam that drives turbines. New England has largely phased out coal power.',
      chemicalProcess: 'C + O2 → CO2 + Heat. Coal also releases sulfur dioxide, mercury, and particulates.',
      environmentalImpacts: [
        'Highest CO2 emissions of any fuel',
        'Releases mercury and toxic heavy metals',
        'Causes acid rain from sulfur dioxide',
        'Mining destroys ecosystems',
        'New England has closed most coal plants',
        'Merrimack Station (NH) closed in 2024'
      ],
      globalContext: 'Coal now provides less than 1% of New England electricity. The region has successfully transitioned away from coal.',
      efficiency: '33-40% efficient.',
      costComparison: 'Was cheapest fuel at $0.03-0.05 per kWh, but environmental regulations and carbon costs made it uneconomical. No longer competitive in New England.',
      history: 'First coal power plant built 1882 (Edison). Dominated 20th century electricity. New England began phasing out in 2000s. Merrimack Station (NH) - last coal plant in New England - closed in 2024.',
      alternatives: 'Already being replaced by natural gas and renewables.'
    },
    { 
      source: 'Renewables & Other', 
      emissions: 0, 
      percentage: 0,
      mixPercent: 45.01,
      kwhUsed: 1042642,
      color: '#10b981',
      emissionFactor: 0,
      howItWorks: 'Includes nuclear, hydro, solar, wind, and other zero-emission sources. Hydro from Canada is significant. Solar and wind growing rapidly.',
      chemicalProcess: 'No combustion. Nuclear: fission. Solar: photovoltaic effect. Wind: kinetic energy. Hydro: gravitational potential energy.',
      environmentalImpacts: [
        'Zero direct CO2 emissions',
        'Nuclear has waste disposal challenges',
        'Hydro can affect fish migration',
        'Wind/solar have land use considerations',
        'Critical for meeting climate goals',
        'Growing rapidly in New England'
      ],
      globalContext: '45% of New England electricity comes from zero-emission sources. Nuclear (Seabrook, Millstone) provides baseload. Canadian hydro provides imports. Solar/wind growing.',
      efficiency: 'Nuclear: 90%+, Hydro: 90%, Wind: 35-45%, Solar: 20-25%.',
      costComparison: 'Nuclear: $0.03-0.05/kWh (existing plants). Hydro: $0.02-0.04/kWh. Wind: $0.02-0.05/kWh. Solar: $0.03-0.06/kWh. Renewables now cost-competitive or cheaper than fossil fuels.',
      history: 'Nuclear plants built 1970s-80s. Hydro imports from Canada since 1990s. Solar/wind boom since 2010. Massachusetts, Rhode Island, Connecticut have aggressive renewable mandates driving growth.',
      alternatives: 'Continue expanding renewables, battery storage, grid modernization.'
    }
  ];

  // Day of week averages
  const dayOfWeekData = [
    { day: 'Monday', multiplier: 1.15, label: 'High - Week starts' },
    { day: 'Tuesday', multiplier: 1.12, label: 'High - Full operations' },
    { day: 'Wednesday', multiplier: 1.10, label: 'High - Mid-week peak' },
    { day: 'Thursday', multiplier: 1.08, label: 'Moderate - Winding down' },
    { day: 'Friday', multiplier: 0.95, label: 'Lower - Weekend prep' },
    { day: 'Saturday', multiplier: 0.75, label: 'Low - Weekend' },
    { day: 'Sunday', multiplier: 0.70, label: 'Lowest - Weekend' }
  ];

  // Monthly patterns
  const monthlyData = [
    { month: 'Jan', emissions: 25.2, heating: 'High' },
    { month: 'Feb', emissions: 23.9, heating: 'High' },
    { month: 'Mar', emissions: 21.9, heating: 'Moderate' },
    { month: 'Apr', emissions: 19.0, heating: 'Low' },
    { month: 'May', emissions: 17.2, heating: 'None' },
    { month: 'Jun', emissions: 14.4, heating: 'None' },
    { month: 'Jul', emissions: 11.8, heating: 'None' },
    { month: 'Aug', emissions: 13.0, heating: 'None' },
    { month: 'Sep', emissions: 18.2, heating: 'Low' },
    { month: 'Oct', emissions: 20.7, heating: 'Moderate' },
    { month: 'Nov', emissions: 23.1, heating: 'High' },
    { month: 'Dec', emissions: 24.2, heating: 'High' }
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

  const emissionFactorPerKwh = yearlyEmissions / totalKwh;
  const buildingsWithEmissions = buildingsData.map(b => ({
    ...b,
    emissions: (b.energyUsed * emissionFactorPerKwh).toFixed(2),
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
        <p style={styles.dataSource}>Data Source: Liberty Utilities NE System Mix 2024</p>
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
            <div style={styles.statCard}><p style={styles.statLabel}>Renewables</p><p style={styles.statValue}>45%</p><p style={styles.statUnit}>of grid mix</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Buildings</p><p style={styles.statValue}>{buildingsData.length}</p><p style={styles.statUnit}>monitored</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Emission Factor</p><p style={styles.statValue}>0.105</p><p style={styles.statUnit}>kg CO2/kWh</p></div>
          </div>

          <div style={styles.mixSummary}>
            <h3 style={styles.sectionTitle}>Liberty NE System Mix</h3>
            <div style={styles.mixGrid}>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#10b981'}}></span>Renewables & Other: 45.01%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#ef4444'}}></span>Natural Gas: 47.25%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#f97316'}}></span>Oil: 5.34%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#22c55e'}}></span>Biomass: 1.62%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#3b82f6'}}></span>MSW: 0.55%</div>
              <div style={styles.mixItem}><span style={{...styles.mixDot, backgroundColor: '#6b7280'}}></span>Coal: 0.23%</div>
            </div>
          </div>

          <div style={styles.equivSection}>
            <h3 style={styles.sectionTitle}>Environmental Impact Equivalents</h3>
            <div style={styles.equivGrid}>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🚗</span><p style={styles.equivValue}>53</p><p style={styles.equivLabel}>Cars driven for 1 year</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🌳</span><p style={styles.equivValue}>4,000</p><p style={styles.equivLabel}>Trees needed to offset</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🏠</span><p style={styles.equivValue}>27</p><p style={styles.equivLabel}>Homes energy for 1 year</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>✈️</span><p style={styles.equivValue}>61</p><p style={styles.equivLabel}>Cross-country flights</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>⛽</span><p style={styles.equivValue}>27,200</p><p style={styles.equivLabel}>Gallons of gasoline</p></div>
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

      <footer style={styles.footer}>
        <p>Kimball Union Academy - Campus Carbon Emissions Dashboard</p>
        <p>Data: Liberty Utilities NE System Mix 2024 | Total: {yearlyEmissions} mtCO2e/year</p>
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

export default App;
