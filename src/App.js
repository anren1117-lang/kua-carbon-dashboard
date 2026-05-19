import React from 'react';
import { Link } from 'react-router-dom';
import { NetEstimate } from './components/NetEstimate';
import { PeerComparison } from './components/PeerComparison';
import { ScopeDonut } from './components/ScopeDonut';
import { ScopeExplainer } from './components/ScopeExplainer';
import { AISummary } from './components/AISummary';
import { NewsStrip } from './components/NewsStrip';
import { DormLeaderboardPreview } from './components/DormLeaderboardPreview';
import { DailyTip } from './components/DailyTip';
import { SectionHeader } from './components/SectionHeader';
import { Icon } from './components/Icon';
import './App.css';

// The homepage is the at-a-glance net-balance view across all scopes.
// The live electricity dashboard (real-time emissions counter, per-building
// data, ISO-NE grid mix breakdown, time analysis) lives on /scope-2 because
// it's all Scope 2 content.
function App() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo} className="kua-logo-enter"><span style={styles.logoText}>KUA</span></div>
        <h1 style={styles.title}>Kimball Union Academy</h1>
        <h2 style={styles.subtitle}>
          <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: 6, color: '#22d3ee' }}>
            <Icon.Leaf size={14} />
          </span>
          Campus Carbon Emissions Dashboard
        </h2>
      </header>

      <SectionHeader label="The number" title="Net annual carbon footprint" icon={Icon.Chart} />
      <NetEstimate />

      <SectionHeader label="Summary" title="In plain English" icon={Icon.Sparkles} />
      <AISummary />

      <SectionHeader label="Breakdown" title="By scope" icon={Icon.Bolt} />
      <ScopeDonut />
      <ScopeExplainer />

      <SectionHeader label="Context" title="How KUA compares" icon={Icon.HelpCircle} />
      <PeerComparison />

      <SectionHeader label="Today" title="One thing you can do" icon={Icon.Sparkles} />
      <DailyTip />

      <SectionHeader label="World" title="What's happening right now" icon={Icon.Leaf} />
      <NewsStrip />

      <SectionHeader label="Dorms" title="Residence-hall energy race" icon={Icon.Trophy} />
      <DormLeaderboardPreview />

      <SectionHeader label="Learn" title="Want a guided walkthrough?" icon={Icon.Map} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        <Link
          to="/learn"
          className="kua-card-hover kua-cta-card kua-spotlight"
          style={{
            display: 'block',
            padding: '24px 28px',
            background: 'linear-gradient(135deg, rgba(8, 51, 68, 0.6) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(11, 18, 32, 1) 100%)',
            border: '1px solid #1f2937',
            borderLeft: '3px solid #06b6d4',
            borderRadius: 14,
            textDecoration: 'none',
            color: '#e5e7eb',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: 11, padding: '4px 10px', borderRadius: 4, background: '#155e75', color: '#a5f3fc', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700, border: '1px solid #0e7490', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon.Sparkles size={12} />
            AI learning agent
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 14, color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: 10 }}>
            Take the interactive tour
            <span className="kua-cta-arrow" style={{ display: 'inline-flex' }}>
              <Icon.ArrowRight size={22} />
            </span>
          </div>
          <div style={{ fontSize: 15, color: '#cbd5e1', marginTop: 8, lineHeight: 1.6 }}>
            Eight short paths with quizzes — Intro paths for any grade, Standard paths
            with KUA's specific data, and AP-level deep dives in chemistry, biology, physics,
            and statistics.
          </div>
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '40px auto 0', padding: '0 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, fontSize: 13 }}>
          {[
            // First pill is the user-guide hook for new visitors. External
            // link because docs/user-guide.md lives in the repo, not as a
            // dashboard route. Distinct cyan tint so it reads as the
            // "start here" affordance.
            { to: 'https://github.com/anren1117-lang/kua-carbon-dashboard/blob/main/docs/user-guide.md', label: 'New here? Start guide', icon: Icon.Sparkles, external: true, primary: true },
            { to: '/faq',              label: 'FAQ',                       icon: Icon.HelpCircle },
            { to: '/your-footprint',   label: 'Calculate your footprint',  icon: Icon.Leaf },
            { to: '/dorm-leaderboard', label: 'Dorm leaderboard',          icon: Icon.Trophy },
            { to: '/scenarios',        label: 'Reduction simulator',       icon: Icon.Sparkles },
            { to: '/digest',           label: 'This month at KUA',         icon: Icon.Bolt },
            { to: '/carbon-math',      label: 'Carbon math practice',      icon: Icon.Chart },
            { to: '/methodology',      label: 'Methodology',               icon: Icon.HelpCircle },
            { to: '/share',            label: 'Share via QR',              icon: Icon.Share },
          ].map((l) => {
            const sharedStyle = {
              padding: '8px 14px',
              background: l.primary ? 'rgba(34, 211, 238, 0.12)' : '#0f172a',
              border: `1px solid ${l.primary ? 'rgba(34, 211, 238, 0.5)' : '#1f2937'}`,
              borderRadius: 999,
              color: l.primary ? '#22d3ee' : '#cbd5e1',
              textDecoration: 'none',
              fontWeight: l.primary ? 700 : 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            };
            if (l.external) {
              return (
                <a key={l.to} href={l.to} target="_blank" rel="noopener noreferrer" className="kua-card-hover" style={sharedStyle}>
                  <l.icon size={14} />
                  {l.label}
                </a>
              );
            }
            return (
              <Link key={l.to} to={l.to} className="kua-card-hover" style={sharedStyle}>
                <l.icon size={14} />
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>

      <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, lineHeight: 1.7, marginTop: 40, paddingTop: 24, borderTop: '1px solid #1f2937', maxWidth: 880, marginLeft: 'auto', marginRight: 'auto' }}>
        Looking for the live electricity counter, the ISO-NE grid mix breakdown, or the
        per-building energy data? It moved to <Link to="/scope-2" style={{ color: '#22d3ee', fontWeight: 600 }}>Scope 2</Link>,
        where it actually belongs in the GHG Protocol scope structure.
      </p>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0b1220', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#e5e7eb' },
  header: { textAlign: 'center', marginBottom: 40, paddingBottom: 28, borderBottom: '1px solid #1f2937' },
  logo: {
    width: 64, height: 64,
    backgroundColor: '#b91c1c',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px',
    boxShadow: '0 4px 16px -4px rgba(185, 28, 28, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
  },
  logoText: { color: 'white', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.02em' },
  title: {
    fontSize: '2rem',
    color: '#22c55e',
    marginBottom: 6,
    fontWeight: 700,
    letterSpacing: '-0.015em',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#94a3b8',
    marginBottom: 0,
    fontWeight: 500,
  },
};

export default App;
