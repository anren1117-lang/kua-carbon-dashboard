import React from 'react';
import { LearnAgent } from '../components/LearnAgent';

const styles = {
  hero: { maxWidth: 880, margin: '0 auto', padding: '0 16px 24px' },
  title: { margin: 0, fontSize: 36, fontWeight: 700, color: '#e5e7eb' },
  subtitle: { marginTop: 10, color: '#94a3b8', fontSize: 17, lineHeight: 1.6, maxWidth: 720 },
};

function Learn() {
  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.title}>Learn</h1>
        <p style={styles.subtitle}>
          Interactive lessons with quizzes — the fastest way to understand what the dashboard is
          measuring and why it matters. Pick any path; each is a few minutes.
        </p>
      </div>
      <LearnAgent />
    </div>
  );
}

export default Learn;
