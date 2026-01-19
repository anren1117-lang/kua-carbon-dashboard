import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const yearlyEmissions = 285.82;

  const emissionsPerSecond = yearlyEmissions / (365 * 24 * 60 * 60);
  const emissionsPerHour = yearlyEmissions / (365 * 24);
  const emissionsPerDay = yearlyEmissions / 365;
  const emissionsPerMonth = yearlyEmissions / 12;

  const [currentEmissions, setCurrentEmissions] = useState(0);
  const [todayEmissions, setTodayEmissions] = useState(0);
  const [isLive, setIsLive] = useState(true);

  const initializeEmissions = useCallback(() => {
    const hoursIntoDayNow = new Date().getHours() + new Date().getMinutes() / 60;
    const startingTodayEmissions = emissionsPerHour * hoursIntoDayNow;
    setTodayEmissions(startingTodayEmissions);

    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const startingYearEmissions = emissionsPerDay * dayOfYear;
    setCurrentEmissions(startingYearEmissions);
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
    { source: 'Natural Gas Plants', emissions: 141.19, percentage: 49.4, color: '#ef4444' },
    { source: 'Coal Fired Plants', emissions: 119.18, percentage: 41.7, color: '#f97316' },
    { source: 'Oil-Fired Plants', emissions: 25.45, percentage: 8.9, color: '#eab308' }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>KUA Carbon Monitor</h1>
        <p style={styles.subtitle}>Real-Time CO2 Emissions Tracking</p>
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
          <p style={styles.cardLabel}>This Month</p>
          <p style={styles.cardValue}>{emissionsPerMonth.toFixed(2)}</p>
          <p style={styles.cardUnit}>mtCO2e</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Per Hour</p>
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
        <h2 style={styles.sectionTitle}>Emissions by Source</h2>
        {emissionsData.map((item, index) => (
          <div key={index} style={styles.barContainer}>
            <div style={styles.barLabel}>
              <span>{item.source}</span>
              <span>{item.emissions} mtCO2e ({item.percentage}%)</span>
            </div>
            <div style={styles.barBackground}>
              <div style={{
                height: '100%',
                width: item.percentage + '%',
                backgroundColor: item.color,
                borderRadius: '10px'
              }} />
            </div>
          </div>
        ))}
      </div>

      <div style={styles.equivalentsSection}>
        <h2 style={styles.sectionTitle}>Annual Impact</h2>
        <div style={styles.equivalentsGrid}>
          <div style={styles.equivalentCard}>
            <p style={styles.equivalentValue}>62</p>
            <p style={styles.equivalentLabel}>Cars for a year</p>
          </div>
          <div style={styles.equivalentCard}>
            <p style={styles.equivalentValue}>4,726</p>
            <p style={styles.equivalentLabel}>Trees to offset</p>
          </div>
          <div style={styles.equivalentCard}>
            <p style={styles.equivalentValue}>32</p>
            <p style={styles.equivalentLabel}>Homes energy</p>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>Data: Liberty Electric Generation Mix - 2024</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: 'white'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '2rem',
    color: '#22c55e',
    marginBottom: '5px'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#94a3b8'
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '10px',
    color: '#22c55e'
  },
  liveDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  mainCounter: {
    textAlign: 'center',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '30px'
  },
  counterLabel: {
    fontSize: '1rem',
    color: '#94a3b8',
    marginBottom: '10px'
  },
  counterValue: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#22c55e',
    fontFamily: 'monospace',
    margin: '0'
  },
  counterUnit: {
    fontSize: '1rem',
    color: '#64748b',
    marginTop: '5px'
  },
  toggleButton: {
    marginTop: '15px',
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#334155',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '30px'
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    minWidth: '120px'
  },
  cardLabel: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginBottom: '5px'
  },
  cardValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#22c55e',
    margin: '0'
  },
  cardUnit: {
    fontSize: '0.75rem',
    color: '#64748b'
  },
  breakdownSection: {
    maxWidth: '600px',
    margin: '0 auto 30px auto',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '25px'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    color: '#22c55e',
    marginBottom: '20px'
  },
  barContainer: {
    marginBottom: '15px'
  },
  barLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    fontSize: '0.85rem',
    color: '#e2e8f0'
  },
  barBackground: {
    height: '20px',
    backgroundColor: '#334155',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  equivalentsSection: {
    maxWidth: '600px',
    margin: '0 auto 30px auto',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '25px'
  },
  equivalentsGrid: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '15px'
  },
  equivalentCard: {
    textAlign: 'center',
    padding: '10px'
  },
  equivalentValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#22c55e',
    margin: '5px 0'
  },
  equivalentLabel: {
    fontSize: '0.8rem',
    color: '#94a3b8'
  },
  footer: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '0.8rem',
    marginTop: '20px'
  }
};

export default App;
