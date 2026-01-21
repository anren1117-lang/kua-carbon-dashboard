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
      howItWorks: 'Natural gas is burned to heat water, creating steam that spins turbines to generate electricity.',
      impacts: ['Cleanest fossil fuel but still releases CO2', 'Methane leaks during extraction', 'Requires fracking which can contaminate groundwater']
    },
    { 
      source: 'Coal Fired Plants', 
      emissions: 119.18, 
      percentage: 38.2, 
      color: '#f97316',
      libertyPercent: 56.75,
      kwhUsed: 1314588,
      howItWorks: 'Coal is burned in large boilers to create steam that drives turbine generators.',
      impacts: ['Highest CO2 emissions of all fossil fuels', 'Releases mercury and sulfur dioxide', 'Mining destroys landscapes', 'Major contributor to climate change']
    },
    { 
      source: 'Oil-Fired Plants', 
      emissions: 25.45, 
      percentage: 8.1, 
      color: '#eab308',
      libertyPercent: 4.38,
      kwhUsed: 101461,
      howItWorks: 'Petroleum oil is burned in boilers or turbines to generate electricity.',
      impacts: ['High CO2 emissions', 'Oil spills devastate ecosystems', 'Releases sulfur dioxide causing acid rain']
    },
    { 
      source: 'Landfill Gas Plants', 
      emissions: 13.56, 
      percentage: 4.3, 
      color: '#22c55e',
      libertyPercent: 3.24,
      kwhUsed: 75054,
      howItWorks: 'Methane gas from decomposing landfill waste is captured and burned to generate electricity.',
      impacts: ['Captures methane that would escape (good!)', 'Methane is 84x more potent than CO2', 'Reduces landfill odors', 'Considered partially renewable']
    },
    { 
      source: 'Municipal Trash Plants', 
      emissions: 13.02, 
      percentage: 4.2, 
      color: '#3b82f6',
      libertyPercent: 1.8,
      kwhUsed: 41696,
      howItWorks: 'Household trash is burned at high temperatures to produce steam for electricity.',
      impacts: ['Reduces landfill volume by 90%', 'High N2O from burning plastics', 'Can release toxic dioxins', 'Destroys recyclable materials']
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
        <h2 style={styles.sectionTitle}>Emissions by Energy Source (All 5 Sources)</h2>
        <p style={styles.clickHint}>Click on each source to learn more about how it works and its environmental impact</p>
        
        {emissionsData.map((item, index) => (
          <div key={index} style={styles.sourceCard}>
            <div style={styles.barContainer} onClick={() => toggleExpand(index)}>
              <div style={styles.barLabel}>
                <span>{item.source} {expandedSource === index ? '▼' : '▶'}</span>
                <span>{item.emissions} mtCO2e ({item.percentage}%)</span>
              </div>
              <div style={styles.barBackground}>
                <div style={{height: '100%', width: (item.percentage * 2) + '%', backgroundColor: item.color, borderRadius: '10px'}} />
              </div>
            </div>
            
            {expandedSource === index && (
              <div style={styles.detailsBox}>
                <div style={styles.detailSection}>
                  <h4 style={styles.detailTitle}>How It Works</h4>
                  <p style={styles.detailText}>{item.howItWorks}</p>
                </div>
                <div style={styles.detailSection}>
                  <h4 style={styles.detailTitle}>Environmental Impact</h4>
                  <ul style={styles.impactList}>
                    {item.impacts.map((impact, i) => (
                      <li key={i} style={styles.impactItem}>{impact}</li>
                    ))}
                  </ul>
                </div>
                <div style={styles.calcBox}>
                  <h4 style={styles.detailTitle}>Calculation</h4>
                  <p style={styles.calcText}>Liberty Electric Mix: {item.libertyPercent}%</p>
                  <p style={styles.calcText}>KUA kWh Used: {item.kwhUsed.toLocaleString()} kWh</p>
                  <p style={styles.calcFormula}>Total: {item.emissions} mtCO2e</p>
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
        <div style={styles.gasCard}>
          <h3 style={styles.gasTitle}>CO2 - Carbon Dioxide</h3>
          <p style={styles.gasText}>The most common greenhouse gas. Stays in atmosphere for 300-1000 years.</p>
        </div>
        <div style={styles.gasCard}>
          <h3 style={styles.gasTitle}>N2O - Nitrous Oxide</h3>
          <p style={styles.gasText}>298 times more potent than CO2. Also depletes the ozone layer.</p>
        </div>
        <div style={styles.gasCard}>
          <h3 style={styles.gasTitle}>CH4 - Methane</h3>
          <p style={styles.gasText}>84 times more potent than CO2 over 20 years.</p>
        </div>
      </div>

      <div style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>KUA Electricity Summary</h2>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <p style={styles.summaryLabel}>Total Electricity</p>
            <p style={styles.summaryValue}>2,316,469 kWh</p>
          </div>
          <div style={styles.summaryItem}>
            <p style={styles.summaryLabel}>Annual Cost</p>
            <p style={styles.summaryValue}>$347,470</p>
          </div>
          <div style={styles.summaryItem}>
            <p style={styles.summaryLabel}>Cost per kWh</p>
            <p style={styles.summaryValue}>$0.15</p>
          </div>
          <div style={styles.summaryItem}>
            <p style={styles.summaryLabel}>Total Emissions</p>
            <p style={styles.summaryValue}>312.40 mtCO2e</p>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>Data Source: Liberty Electric Generation Mix - 2024</p>
      </footer>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px', fontFamily: 'Arial', color: 'white' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '2rem', color: '#22c55e', marginBottom: '5px' },
  subtitle: { fontSize: '1rem', color: '#94a3b8' },
  liveIndicator: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px', color: '#22c55e', fontWeight: 'bold' },
  liveDot: { width: '12px', height: '12px', borderRadius: '50%' },
  mainCounter: { textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '16px', padding: '30px', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px auto' },
  counterLabel: { fontSize: '1rem', color: '#94a3b8', marginBottom: '10px' },
  counterValue: { fontSize: '3rem', fontWeight: 'bold', color: '#22c55e', fontFamily: 'monospace', margin: '0' },
  counterUnit: { fontSize: '1rem', color: '#64748b', marginTop: '5px' },
  toggleButton: { marginTop: '15px', padding: '10px 25px', fontSize: '1rem', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  cardsContainer: { display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' },
  card: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', textAlign: 'center', minWidth: '130px' },
  cardLabel: { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '5px' },
  cardValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e', margin: '0' },
  cardUnit: { fontSize: '0.75rem', color: '#64748b' },
  breakdownSection: { maxWidth: '700px', margin: '0 auto 30px auto', backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px' },
  sectionTitle: { fontSize: '1.3rem', color: '#22c55e', marginBottom: '10px' },
  clickHint: { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' },
  sourceCard: { marginBottom: '15px' },
  barContainer: { cursor: 'pointer', padding: '10px', borderRadius: '8px' },
  barLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#e2e8f0' },
  barBackground: { height: '24px', backgroundColor: '#334155', borderRadius: '12px', overflow: 'hidden' },
  detailsBox: { backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', marginTop: '10px', border: '1px solid #334155' },
  detailSection: { marginBottom: '20px' },
  detailTitle: { color: '#22c55e', marginBottom: '10px', fontSize: '1rem' },
  detailText: { color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', margin: '0' },
  impactList: { margin: '0', paddingLeft: '20px' },
  impactItem: { color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '8px' },
  calcBox: { backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' },
  calcText: { color: '#cbd5e1', fontSize: '0.9rem', margin: '5px 0' },
  calcFormula: { color: '#22c55e', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #22c55e', fontSize: '1.1rem', fontWeight: 'bold', color: '#22c55e' },
  infoSection: { maxWidth: '700px', margin: '0 auto 30px auto', backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px' },
  gasCard: { backgroundColor: '#334155', padding: '15px', borderRadius: '8px', marginBottom: '15px' },
  gasTitle: { color: '#22c55e', marginBottom: '8px', fontSize: '1rem' },
  gasText: { color: '#cbd5e1', fontSize: '0.9rem', margin: '0' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' },
  summaryItem: { backgroundColor: '#334155', padding: '15px', borderRadius: '8px', textAlign: 'center' },
  summaryLabel: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '5px' },
  summaryValue: { color: '#22c55e', fontSize: '1.3rem', fontWeight: 'bold', margin: '0' },
  footer: { textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: '30px' }
};

export default App;
