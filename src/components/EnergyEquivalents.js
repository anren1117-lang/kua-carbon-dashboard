import React from 'react';
import { energyEquivalents } from '../utils/equivalents.js';
import { AnimatedNumber } from './AnimatedNumber.js';

// Eclypse-style "Equal to charging X Teslas / Y iPhones / Z bulbs" card.
// Mirrors the pattern from the campus BMS dashboard so faculty/staff have
// a familiar mental anchor when reading our number.
export function EnergyEquivalents({ kwh, label = 'Equivalent to' }) {
  const safeKwh = Number.isFinite(kwh) ? kwh : 0;
  const eq = energyEquivalents(safeKwh);

  return (
    <div style={styles.wrap}>
      <div style={styles.label}>{label}: <strong style={{ color: '#fbbf24' }}>{Math.round(safeKwh).toLocaleString()} kWh</strong></div>
      <div style={styles.grid}>
        <div style={styles.cell} className="kua-card-hover">
          <div style={styles.icon}>🔋</div>
          <div style={styles.value}><AnimatedNumber value={eq.teslaCharges} duration={900} /></div>
          <div style={styles.unit}>full Tesla Model 3 charges</div>
        </div>
        <div style={styles.cell} className="kua-card-hover">
          <div style={styles.icon}>📱</div>
          <div style={styles.value}><AnimatedNumber value={eq.iphoneCharges} duration={900} /></div>
          <div style={styles.unit}>iPhone 17 Pro Max charges</div>
        </div>
        <div style={styles.cell} className="kua-card-hover">
          <div style={styles.icon}>💡</div>
          <div style={styles.value}><AnimatedNumber value={eq.bulbHours} duration={900} /></div>
          <div style={styles.unit}>hours of a 60 W bulb</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    background: 'linear-gradient(135deg, #2a1a08 0%, #1f1408 100%)',
    border: '1px solid #92400e',
    borderRadius: 12,
    padding: 'clamp(16px, 3vw, 22px)',
    color: '#fef3c7',
  },
  label: { fontSize: 13, color: '#fde68a', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 },
  cell: { background: '#0f0a04', border: '1px solid #78350f', borderRadius: 10, padding: '14px 16px', textAlign: 'center' },
  icon: { fontSize: 28, marginBottom: 4 },
  value: { fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, color: '#fbbf24', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 },
  unit: { fontSize: 11, color: '#fcd34d', marginTop: 6, lineHeight: 1.3 },
};
