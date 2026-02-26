import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [currentEmissions, setCurrentEmissions] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [expandedSource, setExpandedSource] = useState(null);
  const [expandedBuilding, setExpandedBuilding] = useState(null);
  const [viewMode, setViewMode] = useState('overview');

  const buildingsData = [
    { name: 'Miller Bicentennial Hall', energyUsed: 44695, power: 72.7, avgVoltage: 209 },
    { name: 'Whittemore Athletic Center', energyUsed: 43193, power: 74.7, avgVoltage: 205 },
    { name: 'Barrette', energyUsed: 35365, power: 28.1, avgVoltage: 209 },
    { name: 'Kilton House', energyUsed: 20069, power: 20.1, avgVoltage: 121 },
    { name: 'Fitch', energyUsed: 15427, power: 21.0, avgVoltage: 209 },
    { name: 'Alumni Silver Gym', energyUsed: 11407, power: 10.2, avgVoltage: 208 },
    { name: 'Flickinger Arts Center', energyUsed: 9717, power: 17.2, avgVoltage: 210 },
    { name: 'Chellis Hall', energyUsed: 5217, power: 7.1, avgVoltage: 240 },
    { name: 'Welch House', energyUsed: 5511, power: 12.0, avgVoltage: 121 },
    { name: 'Dexter-Richards Hall', energyUsed: 5105, power: 0.6, avgVoltage: 209 },
    { name: 'Densmore Hall', energyUsed: 4768, power: 11.0, avgVoltage: 209 },
    { name: 'Kurth Hall', energyUsed: 3784, power: 2.8, avgVoltage: 243 },
    { name: 'Baxter', energyUsed: 2403, power: 1.9, avgVoltage: 209 },
    { name: 'Bryant Hall', energyUsed: 2288, power: 3.9, avgVoltage: 209 },
    { name: 'Rowe Hall', energyUsed: 2072, power: 2.2, avgVoltage: 208 },
    { name: 'Bishop Alumni House', energyUsed: 1826, power: 1.6, avgVoltage: 239 },
    { name: 'Child Care Center', energyUsed: 1738, power: 0.6, avgVoltage: 209 },
    { name: 'Mikula Hall', energyUsed: 1595, power: 1.6, avgVoltage: 240 }
  ];

  const totalEnergyKwh = buildingsData.reduce((sum, b) => sum + b.energyUsed, 0);
  const totalPowerKw = buildingsData.reduce((sum, b) => sum + b.power, 0);
  const emissionFactor = 0.000135;
  const totalEmissions = totalEnergyKwh * emissionFactor;

  const buildingsWithEmissions = buildingsData.map(b => ({
    ...b,
    emissions: (b.energyUsed * emissionFactor).toFixed(2),
    percentOfTotal: ((b.energyUsed / totalEnergyKwh) * 100).toFixed(1)
  }));

  const emissionsData = [
    { source: 'Natural Gas Plants', percentage: 45.2, emissions: (totalEmissions * 0.452).toFixed(2), color: '#ef4444', howItWorks: 'Natural gas is burned to heat water, creating steam that spins turbines.', impacts: ['Cleanest fossil fuel but still releases CO2', 'Methane leaks during extraction', 'Requires fracking'] },
    { source: 'Coal Fired Plants', percentage: 38.2, emissions: (totalEmissions * 0.382).toFixed(2), color: '#f97316', howItWorks: 'Coal is burned in large boilers to create steam that drives turbines.', impacts: ['Highest CO2 emissions', 'Releases mercury and sulfur dioxide', 'Mining destroys landscapes'] },
    { source: 'Oil-Fired Plants', percentage: 8.1, emissions: (totalEmissions * 0.081).toFixed(2), color: '#eab308', howItWorks: 'Petroleum oil is burned in boilers or turbines to generate electricity.', impacts: ['High CO2 emissions', 'Oil spills devastate ecosystems'] },
    { source: 'Landfill Gas Plants', percentage: 4.3, emissions: (totalEmissions * 0.043).toFixed(2), color: '#22c55e', howItWorks: 'Methane from landfills is captured and burned to generate electricity.', impacts: ['Captures methane (good!)', 'Considered partially renewable'] },
    { source: 'Municipal Trash Plants', percentage: 4.2, emissions: (totalEmissions * 0.042).toFixed(2), color: '#3b82f6', howItWorks: 'Trash is burned at high temperatures to produce steam for electricity.', impacts: ['Reduces landfill volume by 90%', 'Can release toxic dioxins'] }
  ];

  const emissionsPerSecond = totalEmissions / (30 * 24 * 60 * 60);

  const initializeEmissions = useCallback(() => {
    const dayOfMonth = new Date().getDate();
    const hoursToday = new Date().getHours();
    const startingEmissions = (totalEmissions / 30) * dayOfMonth + (totalEmissions / 30 / 24) * hoursToday;
    setCurrentEmissions(startingEmissions);
  }, [totalEmissions]);

  useEffect(() => {
    if (!isLive) return;
    initializeEmissions();
    const interval = setInterval(() => {
      setCurrentEmissions(prev => prev + emissionsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive, initializeEmissions, emissionsPerSecond]);

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
        <p style={styles.dataSource}>Data Source: Envysion Energy Monitor (10.1.1.27)</p>
        <p style={styles.dateRange}>Date Range: 01-27-2026 / 02-25-2026</p>
      </header>

      <div style={styles.navButtons}>
        <button style={{...styles.navButton, backgroundColor: viewMode === 'overview' ? '#22c55e' : '#334155'}} onClick={() => setViewMode('overview')}>Overview</button>
        <button style={{...styles.navButton, backgroundColor: viewMode === 'buildings' ? '#22c55e' : '#334155'}} onClick={() => setViewMode('buildings')}>Buildings</button>
        <button style={{...styles.navButton, backgroundColor: viewMode === 'sources' ? '#22c55e' : '#334155'}} onClick={() => setViewMode('sources')}>Energy Sources</button>
      </div>

      {viewMode === 'overview' && (
        <>
          <div style={styles.mainCounter}>
            <p style={styles.counterLabel}>Current Month CO2 Emissions</p>
            <p style={styles.counterValue}>{currentEmissions.toFixed(4)}</p>
            <p style={styles.counterUnit}>metric tonnes CO2e</p>
            <button style={styles.toggleButton} onClick={() => setIsLive(!isLive)}>{isLive ? 'Pause' : 'Resume'}</button>
          </div>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}><p style={styles.statLabel}>Total Energy Used</p><p style={styles.statValue}>{totalEnergyKwh.toLocaleString()}</p><p style={styles.statUnit}>kW-hr</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Current Power</p><p style={styles.statValue}>{totalPowerKw.toFixed(1)}</p><p style={styles.statUnit}>kW</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Total Emissions</p><p style={styles.statValue}>{totalEmissions.toFixed(2)}</p><p style={styles.statUnit}>mtCO2e</p></div>
            <div style={styles.statCard}><p style={styles.statLabel}>Buildings</p><p style={styles.statValue}>{buildingsData.length}</p><p style={styles.statUnit}>monitored</p></div>
          </div>
          <div style={styles.equivSection}>
            <h3 style={styles.sectionTitle}>Environmental Impact</h3>
            <div style={styles.equivGrid}>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🚗</span><p style={styles.equivValue}>{Math.round(totalEmissions / 4.6)}</p><p style={styles.equivLabel}>Cars for a year</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🌳</span><p style={styles.equivValue}>{Math.round(totalEmissions * 16.5)}</p><p style={styles.equivLabel}>Trees to offset</p></div>
              <div style={styles.equivCard}><span style={styles.equivIcon}>🏠</span><p style={styles.equivValue}>{Math.round(totalEmissions / 8.9)}</p><p style={styles.equivLabel}>Homes energy</p></div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'buildings' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Energy Usage by Building</h3>
          <p style={styles.hint}>Click on each building for details</p>
          {buildingsWithEmissions.map((b, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardHeader} onClick={() => setExpandedBuilding(expandedBuilding === i ? null : i)}>
                <div><p style={styles.cardName}>{b.name}</p><p style={styles.cardStats}>{b.energyUsed.toLocaleString()} kW-hr | {b.emissions} mtCO2e</p></div>
                <span style={styles.arrow}>{expandedBuilding === i ? '▼' : '▶'}</span>
              </div>
              <div style={styles.bar}><div style={{...styles.barFill, width: b.percentOfTotal * 3 + '%', backgroundColor: b.percentOfTotal > 15 ? '#ef4444' : '#22c55e'}} /></div>
              {expandedBuilding === i && (
                <div style={styles.details}>
                  <p>Power: {b.power} kW | Voltage: {b.avgVoltage} V | Campus Share: {b.percentOfTotal}%</p>
                </div>
              )}
            </div>
          ))}
          <div style={styles.total}><span>TOTAL</span><span>{totalEnergyKwh.toLocaleString()} kW-hr | {totalEmissions.toFixed(2)} mtCO2e</span></div>
        </div>
      )}

      {viewMode === 'sources' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Emissions by Energy Source</h3>
          <p style={styles.hint}>Click on each source to learn more</p>
          {emissionsData.map((s, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardHeader} onClick={() => setExpandedSource(expandedSource === i ? null : i)}>
                <div><p style={styles.cardName}>{s.source}</p><p style={styles.cardStats}>{s.emissions} mtCO2e ({s.percentage}%)</p></div>
                <span style={styles.arrow}>{expandedSource === i ? '▼' : '▶'}</span>
              </div>
              <div style={styles.bar}><div style={{...styles.barFill, width: s.percentage * 2 + '%', backgroundColor: s.color}} /></div>
              {expandedSource === i && (
                <div style={styles.details}>
                  <p><strong>How it works:</strong> {s.howItWorks}</p>
                  <p><strong>Environmental impact:</strong></p>
                  <ul>{s.impacts.map((imp, j) => <li key={j}>{imp}</li>)}</ul>
                </div>
              )}
            </div>
          ))}
          <div style={styles.total}><span>TOTAL</span><span>{totalEmissions.toFixed(2)} mtCO2e</span></div>
          <div style={styles.gasInfo}>
            <h4 style={styles.gasTitle}>Understanding Greenhouse Gases</h4>
            <p><strong>CO2:</strong> Most common, stays 300-1000 years</p>
            <p><strong>N2O:</strong> 298x more potent than CO2</p>
            <p><strong>CH4:</strong> 84x more potent over 20 years</p>
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <p>Kimball Union Academy Carbon Dashboard</p>
        <p>Data: Envysion (10.1.1.27) | Liberty Electric 2024</p>
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
  dateRange: { fontSize: '0.8rem', color: '#f97316' },
  navButtons: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' },
  navButton: { padding: '10px 20px', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '1rem' },
  mainCounter: { textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '16px', padding: '25px', maxWidth: '400px', margin: '0 auto 20px' },
  counterLabel: { fontSize: '0.9rem', color: '#94a3b8' },
  counterValue: { fontSize: '2.5rem', fontWeight: 'bold', color: '#22c55e', fontFamily: 'monospace' },
  counterUnit: { fontSize: '0.9rem', color: '#64748b' },
  toggleButton: { marginTop: '15px', padding: '8px 20px', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', maxWidth: '600px', margin: '0 auto 20px' },
  statCard: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '15px', textAlign: 'center' },
  statLabel: { fontSize: '0.8rem', color: '#94a3b8' },
  statValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' },
  statUnit: { fontSize: '0.75rem', color: '#64748b' },
  equivSection: { maxWidth: '600px', margin: '0 auto 20px', backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px' },
  sectionTitle: { fontSize: '1.2rem', color: '#22c55e', marginBottom: '15px', textAlign: 'center' },
  equivGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' },
  equivCard: { backgroundColor: '#334155', borderRadius: '8px', padding: '15px', textAlign: 'center' },
  equivIcon: { fontSize: '2rem' },
  equivValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' },
  equivLabel: { fontSize: '0.75rem', color: '#94a3b8' },
  section: { maxWidth: '700px', margin: '0 auto 20px', backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px' },
  hint: { fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', marginBottom: '15px' },
  card: { marginBottom: '10px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#334155', borderRadius: '8px', cursor: 'pointer' },
  cardName: { color: '#e2e8f0', fontWeight: 'bold', fontSize: '0.9rem', margin: 0 },
  cardStats: { color: '#94a3b8', fontSize: '0.8rem', margin: 0 },
  arrow: { color: '#22c55e' },
  bar: { height: '8px', backgroundColor: '#1e293b', borderRadius: '4px', marginTop: '5px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '4px' },
  details: { backgroundColor: '#0f172a', borderRadius: '8px', padding: '15px', marginTop: '10px', border: '1px solid #334155', color: '#cbd5e1', fontSize: '0.85rem' },
  total: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #22c55e', fontWeight: 'bold', color: '#22c55e' },
  gasInfo: { marginTop: '20px', backgroundColor: '#334155', borderRadius: '8px', padding: '15px' },
  gasTitle: { color: '#22c55e', marginBottom: '10px' },
  footer: { textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginTop: '30px' },
  adminLink: { display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#334155', color: '#22c55e', textDecoration: 'none', borderRadius: '8px' }
};

export default App;
