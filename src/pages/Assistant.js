import React from 'react';
import { EnvironmentalAgent } from '../components/EnvironmentalAgent';

const styles = {
  hero: { maxWidth: 880, margin: '0 auto', padding: '0 16px 24px' },
  title: { margin: 0, fontSize: 36, fontWeight: 700, color: '#e5e7eb' },
  subtitle: { marginTop: 10, color: '#94a3b8', fontSize: 17, lineHeight: 1.6, maxWidth: 720 },
};

function Assistant() {
  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.title}>Ask</h1>
        <p style={styles.subtitle}>
          A free-form environmental assistant. Ask about KUA's footprint, global climate science,
          carbon markets, sustainable practices, or anything else in the territory.
        </p>
      </div>
      <EnvironmentalAgent />
    </div>
  );
}

export default Assistant;
