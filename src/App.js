import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Base data from your spreadsheet
  const yearlyEmissions = 285.82; // mtCO₂e per year
  const yearlyKwh = 2316469;
  const annualCost = 347470;

  // Calculate rates
  const emissionsPerSecond = yearlyEmissions / (365 * 24 * 60 * 60); // mtCO₂e per second
  const emissionsPerHour = yearlyEmissions / (365 * 24);
  const emissionsPerDay = yearlyEmissions / 365;
  const emissionsPerMonth = yearlyEmissions / 12;

  // State for real-time counter
  const [currentEmissions, setCurrentEmissions] = useState(0);
  const [todayEmissions, setTodayEmissions] = useState(0);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time emissions
  useEffect(() => {
    if (!isLive) return;

    // Start today's emissions at a random point in the day
    const hoursIntoDayNow = new Date().getHours() + new Date().getMinutes() / 60;
    const startingTodayEmissions = emissionsPerHour * hoursIntoDayNow;
    setTodayEmissions(startingTodayEmissions);

    // Start yearly counter at a random point in the year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const startingYearEmissions = emissionsPerDay * dayOfYear;
    setCurrentEmissions(startingYearEmissions);

    const interval = setInterval(() => {
      setCurrentEmissions(prev => prev + emissionsPerSecond);
      setTodayEmissions(prev => prev + emissionsPerSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Emissions by source (for breakdown)
  const emissionsData = [
    { source: 'Natural Gas Plants', emissions: 141.19, percentage: 49.4, color: '#ef4444' },
    { source: 'Coal Fired Plants', emissions: 119.18, percentage: 41.7, color: '#f97316' },
    { source: 'Oil-Fired Plants', emissions: 25.45, percentage: 8.9, color: '#eab308' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>🌍 KUA Carbon Monitor</h1>
        <p style={styles.subtitle}>Real-Time CO₂ Emissions Tracking</p>
        <div style={styles.liveIndicator}>
          <span style={{...styles.liveDot, backgroundColor: isLive ? '#22c55e' : '#9ca3af'}}></span>
          <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
        </div>
      </header>

      {/* Main Counter */}
      <div style={styles.mainCounter}>
        <p style={styles.counterLabel}>Year-to-Date CO₂ Emissions</p>
        <p style={styles.counterValue}>
          {currentEmissions.toFixed(4)}
        </p>
        <p style={styles.counterUnit}>metric tonnes CO₂e</p>
        <button 
          style={styles.toggleButton}
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? '⏸ Pause' : '▶ Resume'}
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Today's Emissions</p>
          <p style={styles.cardValue}>{(todayEmissions * 1000).toFixed(2)}</p>
          <p style={styles.cardUnit}>kg CO₂e</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>This Month (Est.)</p>
          <p style={styles.cardValue}>{emissionsPerMonth.toFixed(2)}</p>
          <p style={styles.cardUnit}>mtCO₂e</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Emission Rate</p>
          <p style={styles.cardValue}>{(emissionsPerHour * 1000).toFixed(2)}</p>
          <p style={styles.cardUnit}>kg CO₂e / hour</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Annual Projection</p>
          <p style={styles.cardValue}>{yearlyEmissions.toFixed(2)}</p>
          <p style={styles.cardUnit}>mtCO₂e / year</p>
        </div>
      </div>

      {/* Emissions Breakdown */}
      <div style={styles.breakdownSection}>
        <h2 style={styles.sectionTitle}>Emissions by Source</h2>
        {emissionsData.map((item, index) => (
          <div key={index} style={styles.barContainer}>
            <div style={styles.barLabel}>
              <span>{item.source}</span>
              <span>{item.emissions} mtCO₂e ({item.percentage}%)</span>
            </div>
            <div style={styles.barBackground}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Info */}
      <div style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>⚡ Live Stats</h2>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>CO₂ per second:</span>
            <span style={styles.infoValue}>{(emissionsPerSecond * 1000000).toFixed(2)} g</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>CO₂ per minute:</span>
            <span style={styles.infoValue}>{(emissionsPerSecond * 60 * 1000).toFixed(2)} kg</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>CO₂ per hour:</span>
            <span style={styles.infoValue}>{(emissionsPerHour * 1000).toFixed(2)} kg</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>CO₂ per day:</span>
            <span style={styles.infoValue}>{(emissionsPerDay * 1000).toFixed(2)} kg</span>
          </div>
        </div>
      </div>

      {/* Equivalents */}
      <div style={styles.equivalentsSection}>
        <h2 style={styles.sectionTitle}>Annual Impact Equivalent</h2>
        <div style={styles.equivalentsGrid}>
          <div style={styles.equivalentCard}>
            <p style={styles.equivalentEmoji}>🚗</p>
            <p style={styles.equivalentValue}>62</p>
            <p style={styles.equivalentLabel}>Cars driven for a year</p>
          </div>
          <div style={styles.equivalentCard}>
            <p style={styles.equivalentEmoji}>🌳</p>
            <p style={styles.equivalentValue}>4,726</p>
            <p style={styles.equivalentLabel}>Trees needed to offset</p>
          </div>
          <div style={styles.equivalentCard}>
            <p style={styles.equivalentEmoji}>🏠</p>
            <p style={styles.equivalentValue}>32</p>
            <p style={styles.equivalentLabel}>Homes' energy for a year</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Data source: Liberty Electric Generation Mix • Simulation based on 2024 estimates</p>
        <p style={styles.footerNote}>🔌 Ready for Meteor real-time data connection</p>
      </footer>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: 'white',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#22c55e',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#94a3b8',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '10px',
    fontSize: '0.9rem',
    color: '#22c55e',
    fontWeight: 'bold',
  },
  liveDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    animation: 'pulse 1.5s infinite',
  },
  mainCounter: {
    textAlign: 'center',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  counterLabel: {
    fontSize: '1rem',
    color: '#94a3b8',
    marginBottom: '10px',
  },
  counterValue: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    color: '#22c55e',
    fontFamily: 'monospace',
    margin: '0',
  },
  counterUnit: {
    fontSize: '1rem',
    color: '#64748b',
    marginTop: '5px',
  },
  toggleButton: {
    marginTop: '15px',
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#334155',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    minWidth: '140px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  cardLabel: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginBottom: '5px',
  },
  cardValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#22c55e',
    margin: '0',
  },
  cardUnit: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  breakdownSection: {
    maxWidth: '600px',
    margin: '0 auto 30px auto',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    color: '#22c55e',
    marginBottom: '20px',
  },
  barContainer: {
    marginBottom: '15px',
  },
  barLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    fontSize: '0.85rem',
    color: '#e2e8f0',
  },
  barBackground: {
    height: '20px',
    backgroundColor: '#334155',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
  },
  infoSection: {
    maxWidth: '600px',
    margin: '0 auto 30px auto',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#334155',
    borderRadius: '8px',
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: '0.85rem',
  },
  infoValue: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  equivalentsSection: {
    maxWidth: '600px',
    margin: '0 auto 30px auto',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  equivalentsGrid: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '15px',
  },
  equivalentCard: {
    textAlign: 'center',
    padding: '10px',
  },
  equivalentEmoji: {
    fontSize: '2.5rem',
    margin: '0',
  },
  equivalentValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#22c55e',
    margin: '5px 0',
  },
  equivalentLabel: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    maxWidth: '100px',
  },
  footer: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '0.8rem',
    marginTop: '20px',
  },
  footerNote: {
    color: '#22c55e',
    marginTop: '5px',
  },
};

export default App;