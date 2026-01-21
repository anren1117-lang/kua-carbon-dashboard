import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const yearlyEmissions = 312.40;
  const emissionsPerSecond = yearlyEmissions / (365 * 24 * 60 * 60);
  const emissionsPerHour = yearlyEmissions / (365 * 24);
  const emissionsPerDay = yearlyEmissions / 365;
  const emissionsPerMonth = yearlyEmissions / 12;

  const [currentEmissions, setCurrentEmissions] = useState(0);
  const [todayEmissions, setTodayEmissions] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [expandedSource, setExpandedSource] = useState(null);

  const initializeEmissions = useCallback(() => {
    const hoursIntoDayNow = new Date().getHours() + new Date().getMinutes() / 60;
    setTodayEmissions(emissionsPerHour * hoursIntoDayNow);
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    setCurrentEmissions(emissionsPerDay * dayOfYear);
  }, [emissionsPerHour, emissionsPerDay]);

  useEffect(() => {
    if (!isLive) return;
    initializeEmissions();
    const interval = setInterval(() => {
      setCurrentEmissions(prev => prev + emissionsPerSecond);
      setTodayEmissions(prev => prev + emissionsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive, initializeEmissions, emissionsPerSecond]);

  const emissionsData = [
    { 
      source: 'Natural Gas Plants', 
      emissions: 141.19, 
      percentage: 45.2, 
      color: '#ef4444',
      libertyPercent: 33.83,
      kwhUsed: 783699,
      co2Factor: 0.00018,
      n2oFactor: 0.0000001,
      ch4Factor: 0.00000007,
      howItWorks: 'Natural gas (mainly methane) is extracted from underground and piped to power plants. It is burned in combustion turbines or boilers to heat water into steam, which spins turbines connected to generators to produce electricity.',
      environmentalImpact: [
        'Cleanest fossil fuel but still releases significant CO2',
        'Methane leaks during extraction contribute to warming',
        'Requires fracking which can contaminate groundwater',
        'Less particulate pollution than coal or oil',
        'Water usage for cooling systems affects local ecosystems'
      ],
      co2Details: 'Produces about 0.18 kg CO2 per kWh - roughly half of coal',
      n2oDetails: 'Very low N2O emissions from high-temperature combustion',
      ch4Details: 'Small CH4 emissions from incomplete combustion and upstream leaks'
    },
    { 
      source: 'Coal Fired Plants', 
      emissions: 119.18, 
      percentage: 38.2, 
      color: '#f97316',
      libertyPercent: 56.75,
      kwhUsed: 1314588,
      co2Factor: 0.00032,
      n2oFactor: 0.00000148,
      ch4Factor: 0.00000007,
      howItWorks: 'Coal is mined and transported to power plants where it is pulverized and burned in large boilers. The heat converts water to high-pressure steam, which drives turbine generators. Exhaust gases pass through pollution control equipment before release.',
      environmentalImpact: [
        'Highest CO2 emissions of all fossil fuels',
        'Releases mercury, sulfur dioxide, and particulates',
        'Mining destroys landscapes and habitats',
        'Coal ash contains toxic heavy metals',
        'Acid rain from sulfur and nitrogen emissions',
        'Major contributor to climate change'
      ],
      co2Details: 'Produces about 0.32 kg CO2 per kWh - the highest of all sources',
      n2oDetails: 'Significant N2O from high-temperature coal combustion',
      ch4Details: 'CH4 released during coal mining and combustion'
    },
    { 
      source: 'Oil-Fired Plants', 
      emissions: 25.45, 
      percentage: 8.1, 
      color: '#eab308',
      libertyPercent: 4.38,
      kwhUsed: 101461,
      co2Factor: 0.00025,
      n2oFactor: 0.00000064,
      ch4Factor: 0.00000022,
      howItWorks: 'Petroleum oil is refined and burned in boilers or combustion turbines. The heat generates steam to drive turbines, or hot gases directly spin gas turbines. Oil plants are often used for peak demand due to quick startup times.',
      environmentalImpact: [
        'High CO2 emissions, between gas and coal',
        'Oil spills during transport devastate ecosystems',
        'Releases sulfur dioxide causing acid rain',
        'Particulate emissions harm air quality',
        'Offshore drilling threatens marine life',
        'Refining process creates additional pollution'
      ],
      co2Details: 'Produces about 0.25 kg CO2 per kWh - moderate emissions',
      n2oDetails: 'Moderate N2O from petroleum combustion',
      ch4Details: 'CH4 from incomplete combustion and refining process'
    },
    { 
      source: 'Landfill Gas Plants', 
      emissions: 13.56, 
      percentage: 4.3, 
      color: '#22c55e',
      libertyPercent: 3.24,
      kwhUsed: 75054,
      co2Factor: 0.00018,
      n2oFactor: 0.00000067,
      ch4Factor: 0.00000023,
      howItWorks: 'Decomposing organic waste in landfills produces methane gas. This gas is captured through pipes and wells, then cleaned and burned in engines or turbines to generate electricity. This prevents methane from escaping into the atmosphere.',
      environmentalImpact: [
        'Captures methane that would otherwise escape (good!)',
        'Methane is 84x more potent than CO2 over 20 years',
        'Reduces landfill odors and explosion risks',
        'Still produces CO2 when burned',
        'Considered partially renewable energy',
        'Helps extend landfill lifespan'
      ],
      co2Details: 'Produces CO2 when burned, but prevents worse methane release',
      n2oDetails: 'Some N2O from combustion of landfill gas',
      ch4Details: 'Captures and destroys CH4 - a net positive for climate'
    },
    { 
      source: 'Municipal Trash Plants', 
      emissions: 13.02, 
      percentage: 4.2, 
      color: '#3b82f6',
      libertyPercent: 1.8,
      kwhUsed: 41696,
      co2Factor: 0.00031,
      n2oFactor: 0.00000444,
      ch4Factor: 0.00000229,
      howItWorks: 'Municipal solid waste (household and commercial trash) is burned at high temperatures in specially designed incinerators. The heat produces steam to generate electricity. Modern plants have pollution controls to reduce emissions.',
      environmentalImpact: [
        'Reduces landfill volume by up to 90%',
        'High N2O emissions from burning plastics',
        'Can release toxic dioxins and furans',
        'Ash residue may contain heavy metals',
        'Destroys materials that could be recycled',
        'Controversial - some consider it renewable'
      ],
      co2Details: 'High CO2 from burning mixed materials including plastics',
      n2oDetails: 'Highest N2O emissions due to varied waste composition',
      ch4Details: 'Significant CH4 from incomplete combustion of organic waste'
    }
  ];

  const toggleExpand = (index) => {
    setExpandedSource(expandedSource === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>KUA Carbon Monitor</h1>
        <p style={styles.subtitle}>Real-Time CO2 Emissions from Electricity Use</p>
        <div style={styles.liveIndicator}>
          <span style={{...styles.liveDot, backgroundColor: isLive ? '#22c55e' : '#9ca3af'}}></span>
          <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
        </div>
      </header>

      <div style={styles.mainCounter}>
        <p style={styles.counterLabel}>Year-to-Date CO2 Emissions</p>
        <p style={styles.counterValue}>{currentEmissions.toFixed(4)}</p>
        <p style={styles.counterUnit}>metric tonnes CO2e</p>
        <button style={styles.toggleButton} onClick={() => setIsLive(!isLive)}>
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Today</p>
          <p style={styles.cardValue}>{(todayEmissions * 1000).toFixed(2)}</p>
          <p style={styles.cardUnit}>kg CO2e</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Monthly</p>
          <p style={styles.cardValue}>{emissionsPerMonth.toFixed(2)}</p>
          <p style={styles.cardUnit}>mtCO2e</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Hourly</p>
          <p style={styles.cardValue}>{(emissionsPerHour * 1000).toFixed(2)}</p>
          <p style={styles.cardUnit}>kg CO2e</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Annual</p>
          <p style={styles.cardValue}>{yearlyEmissions.toFixed(2)}</p>
          <p style={styles.cardUnit}>mtCO2e</p>
        </div>
      </div>

      <div style={styles.breakdownSection}>
        <h2 style={styles.sectionTitle}>Emissions by Energy Source</h2>
        <p style={styles.sectionSubtitle}>Click on each source to learn more about how it works and its environmental impact</p>
        
        {emissionsData.map((item, index) => (
          <div key={index} style={styles.sourceCard}>
            <div style={styles.barContainer} onClick={() => toggleExpand(index)}>
              <div style={styles.barLabel}>
                <span style={styles.sourceName}>{item.source} {expandedSource === index ? '▼' : '▶'}</span>
                <span>{item.emissions} mtCO2e ({item.percentage}%)</span>
              </div>
              <div style={styles.barBackground}>
                <div style={{height: '100%', width: (item.percentage * 2) + '%', backgroundColor: item.color, borderRadius: '10px'}} />
              </div>
            </div>
            
            {expandedSource === index && (
              <div style={styles.detailsBox}>
                <div style={styles.section}>
                  <h4 style={styles.detailTitle}>How It Works</h4>
                  <p style={styles.detailText}>{item.howItWorks}</p>
                </div>

                <div style={styles.section}>
                  <h4 style={styles.detailTitle}>Environmental Impact</h4>
                  <ul style={styles.impactList}>
                    {item.environmentalImpact.map((impact, i) => (
                      <li key={i} style={styles.impactItem}>{impact}</li>
                    ))}
                  </ul>
                </div>

                <div style={styles.section}>
                  <h4 style={styles.detailTitle}>Greenhouse Gas Breakdown</h4>
                  <div style={styles.gasGrid}>
                    <div style={styles.gasCard}>
                      <span style={styles.gasName}>CO2</span>
                      <span style={styles.gasValue}>{item.co2Factor} tonnes/kWh</span>
                      <p style={styles.gasDesc}>{item.co2Details}</p>
                    </div>
                    <div style={styles.gasCard}>
                      <span style={styles.gasName}>N2O</span>
                      <span style={styles.gasValue}>{item.n2oFactor} tonnes/kWh</span>
                      <p style={styles.gasDesc}>{item.n2oDetails}</p>
                    </div>
                    <div style={styles.gasCard}>
                      <span style={styles.gasName}>CH4</span>
                      <span style={styles.gasValue}>{item.ch4Factor} tonnes/kWh</span>
                      <p style={styles.gasDesc}>{item.ch4Details}</p>
                    </div>
                  </div>
                </div>

                <div style={styles.calculationBox}>
                  <h4 style={styles.calcTitle}>Emission Calculation</h4>
                  <div style={styles.calcRow}>
                    <span>Liberty Electric Mix:</span>
                    <span style={styles.calcValue}>{item.libertyPercent}%</span>
                  </div>
                  <div style={styles.calcRow}>
                    <span>KUA Electricity Used:</span>
                    <span style={styles.calcValue}>{item.kwhUsed.toLocaleString()} kWh</span>
                  </div>
                  <div style={styles.calcRow}>
                    <span>Total Emissions:</span>
                    <span style={styles.calcValueBig}>{item.emissions} mtCO2e</span>
                  </div>
                  <p style={styles.formula}>Formula: 2,316,469 kWh × {item.libertyPercent}% × emission factors = {item.emissions} mtCO2e</p>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div style={styles.totalRow}>
          <span>TOTAL ANNUAL EMISSIONS</span>
          <span>312.40 mtCO2e</span>
        </div>
      </div>

      <div style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>Understanding Greenhouse Gases</h2>
        
        <div style={styles.gasInfoCard}>
          <h3 style={styles.gasInfoTitle}>CO2 - Carbon Dioxide</h3>
          <p style={styles.gasInfoText}>The most common greenhouse gas from burning fossil fuels. It stays in the atmosphere for 300-1000 years, trapping heat and warming the planet. CO2 is the baseline for measuring other greenhouse gases.</p>
        </div>
        
        <div style={styles.gasInfoCard}>
          <h3 style={styles.gasInfoTitle}>N2O - Nitrous Oxide</h3>
          <p style={styles.gasInfoText}>298 times more potent than CO2 at trapping heat. It stays in the atmosphere for about 114 years. Major sources include burning fossil fuels, agricultural activities, and industrial processes. Also depletes the ozone layer.</p>
        </div>
        
        <div style={styles.gasInfoCard}>
          <h3 style={styles.gasInfoTitle}>CH4 - Methane</h3>
          <p style={styles.gasInfoText}>84 times more potent than CO2 over a 20-year period. Though it only stays in the atmosphere for about 12 years, its short-term warming effect is severe. Sources include natural gas leaks, landfills, and livestock.</p>
        </div>
      </div>

      <div style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>KUA Electricity Data Summary</h2>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Total Electricity Usage</p>
            <p style={styles.summaryValue}>2,316,469 kWh</p>
            <p style={styles.summaryNote}>Annual consumption (2024 estimate)</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Annual Cost</p>
            <p style={styles.summaryValue}>$347,470</p>
            <p style={styles.summaryNote}>At $0.15 per kWh average</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Carbon Footprint</p>
            <p style={styles.summaryValue}>312.40 mtCO2e</p>
            <p style={styles.summaryNote}>Total greenhouse gas emissions</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Emission Intensity</p>
            <p style={styles.summaryValue}>0.135 kg/kWh</p>
            <p style={styles.summaryNote}>CO2e per kilowatt-hour</p>
          </div>
        </div>
      </div>

      <div style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>What Can We Do?</h2>
        <div style={styles.actionGrid}>
          <div style={styles.actionCard}>
            <span style={styles.actionIcon}>💡</span>
            <h4 style={styles.actionTitle}>Energy Efficiency</h4>
            <p style={styles.actionText}>LED lighting, efficient HVAC, and smart building controls can reduce electricity use by 20-30%.</p>
          </div>
          <div style={styles.actionCard}>
            <span style={styles.actionIcon}>☀️</span>
            <h4 style={styles.actionTitle}>Solar Power</h4>
            <p style={styles.actionText}>On-site solar panels can offset grid electricity and reduce emissions to near zero for that portion.</p>
          </div>
          <div style={styles.actionCard}>
            <span style={styles.actionIcon}>🌱</span>
            <h4 style={styles.actionTitle}>Green Energy</h4>
            <p style={styles.actionText}>Purchasing renewable energy credits or switching to green power programs reduces your carbon footprint.</p>
          </div>
          <div style={styles.actionCard}>
            <span style={styles.actionIcon}>📊</span>
            <h4 style={styles.actionTitle}>Monitor & Track</h4>
            <p style={styles.actionText}>Regular monitoring helps identify waste and measure the impact of efficiency improvements.</p>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>Data Source: Liberty Electric Generation Mix - 2024</p>
        <p>KUA Campus Carbon Emissions Dashboard</p>
      </footer>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px', fontFamily: 'Arial, sans-serif', color: 'white' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '2.2rem', color: '#22c55e', marginBottom: '5px' },
  subtitle: { fontSize: '1rem', color: '#94a3b8' },
  liveIndicator: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px', color: '#22c55e', fontWeight: 'bold' },
  liveDot: { width: '12px', height: '12px', borderRadius: '50%', animation: 'pulse 2s infinite' },
  mainCounter: { textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '16px', padding: '30px', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px auto' },
  counterLabel: { fontSize: '1rem', color: '#94a3b8', marginBottom: '10px' },
  counterValue: { fontSize: '3rem', fontWeight: 'bold', color: '#22c55e', fontFamily: 'monospace', margin: '0' },
  counterUnit: { fontSize: '1rem', color: '#64748b', marginTop: '5px' },
  toggleButton: { marginTop: '15px', padding: '10px 25px', fontSize: '1rem', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  cardsContainer: { display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' },
  card: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', textAlign: 'center', minWidth: '130px' },
  cardLabel: { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '5px' },
  cardValue: { fontSize: '1.6rem', fontWeight: 'bold', color: '#22c55e', margin: '0' },
  cardUnit: { fontSize: '0.75rem', color: '#64748b' },
  breakdownSection: { maxWidth: '800px', margin: '0 auto 30px auto', backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px' },
  sectionTitle: { fontSize: '1.3rem', color: '#22c55e', marginBottom: '10px' },
  sectionSubtitle: { fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' },
  sourceCard: { marginBottom: '15px' },
  barContainer: { cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background 0.2s' },
  barLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#e2e8f0' },
  sourceName: { fontWeight: 'bold' },
  barBackground: { height: '24px', backgroundColor: '#334155', borderRadius: '12px', overflow: 'hidden' },
  detailsBox: { backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', marginTop: '15px', border: '1px solid #334155' },
  section: { marginBottom: '20px' },
  detailTitle: { color: '#22c55e', marginBottom: '10px', fontSize: '1rem', borderBottom: '1px solid #334155', paddingBottom: '5px' },
  detailText: { color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' },
  impactList: { margin: '0', paddingLeft: '20px' },
  impactItem: { color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '8px', lineHeight: '1.4' },
  gasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' },
  gasCard: { backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' },
  gasName: { display: 'block', color: '#22c55e', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' },
  gasValue: { display: 'block', color: '#f97316', fontSize: '0.85rem', marginBottom: '8px' },
  gasDesc: { color: '#94a3b8', fontSize: '0.8rem', margin: '0', lineHeight: '1.4' },
  calculationBox: { backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' },
  calcTitle: { color: '#22c55e', marginBottom: '15px', fontSize: '1rem' },
  calcRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' },
  calcValue: { color: '#22c55e', fontWeight: 'bold' },
  calcValueBig: { color: '#22c55e', fontWeight: 'bold', fontSize: '1.1rem' },
  formula: { backgroundColor: '#0f172a', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '25px', paddingTop: '20px', borderTop: '2px solid #22c55e', fontSize: '1.1rem', fontWeight: 'bold', color: '#22c55e' },
  infoSection: { maxWidth: '800px', margin: '0 auto 30px auto', backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px' },
  gasInfoCard: { backgroundColor: '#334155', padding: '15px', borderRadius: '8px', marginBottom: '15px' },
  gasInfoTitle: { color: '#22c55e', marginBottom: '8px', fontSize: '1rem' },
  gasInfoText: { color: '#cbd5e1', fontSize: '0.9rem', margin: '0', lineHeight: '1.5' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' },
  summaryCard: { backgroundColor: '#334155', padding: '20px', borderRadius: '8px', textAlign: 'center' },
  summaryLabel: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '5px' },
  summaryValue: { color: '#22c55e', fontSize: '1.5rem', fontWeight: 'bold', margin: '5px 0' },
  summaryNote: { color: '#64748b', fontSize: '0.75rem' },
  actionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' },
  actionCard: { backgroundColor: '#334155', padding: '20px', borderRadius: '8px', textAlign: 'center' },
  actionIcon: { fontSize: '2rem', display: 'block', marginBottom: '10px' },
  actionTitle: { color: '#22c55e', fontSize: '1rem', marginBottom: '8px' },
  actionText: { color: '#94a3b8', fontSize: '0.85rem', margin: '0', lineHeight: '1.4' },
  footer: { textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #334155' }
};

export default App;
```