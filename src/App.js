import React from 'react';
import { Link } from 'react-router-dom';
import { NetEstimate } from './components/NetEstimate';
import { PeerComparison } from './components/PeerComparison';
import { ScopeDonut } from './components/ScopeDonut';
import { ScopeExplainer } from './components/ScopeExplainer';
import { AISummary } from './components/AISummary';
import { NewsStrip } from './components/NewsStrip';
import { DormLeaderboardPreview } from './components/DormLeaderboardPreview';
import { SectionHeader } from './components/SectionHeader';
import './App.css';

// The homepage is the at-a-glance net-balance view across all scopes.
// The live electricity dashboard (real-time emissions counter, per-building
// data, ISO-NE grid mix breakdown, time analysis) lives on /scope-2 because
// it's all Scope 2 content.
function App() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}><span style={styles.logoText}>KUA</span></div>
        <h1 style={styles.title}>Kimball Union Academy</h1>
        <h2 style={styles.subtitle}>Campus Carbon Emissions Dashboard</h2>
      </header>

      <SectionHeader label="The number" title="Net annual carbon footprint" />
      <NetEstimate />

      <SectionHeader label="Summary" title="In plain English" />
      <AISummary />

      <SectionHeader label="Breakdown" title="By scope" />
      <ScopeDonut />
      <ScopeExplainer />

      <SectionHeader label="Context" title="How KUA compares" />
      <PeerComparison />

      <SectionHeader label="World" title="What's happening right now" />
      <NewsStrip />

      <SectionHeader label="Dorms" title="Residence-hall energy race" />
      <DormLeaderboardPreview />

      <SectionHeader label="Learn" title="Want a guided walkthrough?" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        <Link
          to="/learn"
          style={{
            display: 'block',
            padding: '24px 28px',
            background: 'linear-gradient(160deg, #0f172a 0%, #0b1220 100%)',
            border: '1px solid #1f2937',
            borderLeft: '3px solid #06b6d4',
            borderRadius: 14,
            textDecoration: 'none',
            color: '#e5e7eb',
          }}
        >
          <div style={{ fontSize: 11, padding: '4px 10px', borderRadius: 4, background: '#155e75', color: '#a5f3fc', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700, border: '1px solid #0e7490', display: 'inline-block' }}>
            AI learning agent
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 14, color: '#e5e7eb' }}>
            Take the interactive tour →
          </div>
          <div style={{ fontSize: 15, color: '#cbd5e1', marginTop: 8, lineHeight: 1.6 }}>
            Eight short paths with quizzes — Intro paths for any grade, Standard paths
            with KUA's specific data, and AP-level deep dives in chemistry, biology, physics,
            and statistics.
          </div>
        </Link>
      </div>

      <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, lineHeight: 1.7, marginTop: 56, paddingTop: 24, borderTop: '1px solid #1f2937', maxWidth: 880, marginLeft: 'auto', marginRight: 'auto' }}>
        Looking for the live electricity counter, the ISO-NE grid mix breakdown, or the
        per-building energy data? It moved to <Link to="/scope-2" style={{ color: '#22d3ee', fontWeight: 600 }}>Scope 2</Link>,
        where it actually belongs in the GHG Protocol scope structure.
      </p>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0b1220', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#e5e7eb' },
  header: { textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #1f2937' },
  logo: { width: 60, height: 60, backgroundColor: '#b91c1c', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' },
  logoText: { color: 'white', fontWeight: 700, fontSize: '1.2rem' },
  title: { fontSize: '1.8rem', color: '#22c55e', marginBottom: 5 },
  subtitle: { fontSize: '1rem', color: '#94a3b8', marginBottom: 0 },
};

export default App;
