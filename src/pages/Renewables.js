import React from 'react';

const systems = [
  {
    name: 'Solar PV Array',
    state: 'Operational',
    color: '#22c55e',
    detail: 'Grid-connected through Liberty Utilities net metering. Self-consumed kWh reduce Scope 2 directly; exports tracked separately as avoided grid emissions to keep accounting transparent.',
    metrics: ['Instantaneous generation (kW)', 'Cumulative generation (kWh)', 'Self-consumed vs exported', 'Capacity factor'],
  },
  {
    name: 'Geothermal Ground-Source Heat Pump',
    state: 'Operational',
    color: '#22c55e',
    detail: 'Displaces heating oil and propane rather than producing electricity. Reported in MMBtu of thermal output, derived from metered electricity consumption × design coefficient of performance. Avoided Scope 1 emissions are clearly labeled as estimates.',
    metrics: ['Electricity consumption (kWh)', 'Estimated thermal output (MMBtu)', 'Avoided Scope 1 emissions (estimate)'],
  },
  {
    name: 'Wind Turbine',
    state: 'Offline',
    color: '#f59e0b',
    detail: 'Currently out of service. Documented as an offline asset with rated capacity and last operational date, so a future restoration decision has the historical baseline it needs. Live data pipe is pre-wired.',
    metrics: ['Rated capacity', 'Last operational date', 'Historical generation (where records permit)'],
  },
];

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  list: { marginTop: 24, display: 'grid', gap: 16 },
  card: { background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12, padding: 20 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  name: { fontSize: 20, fontWeight: 600 },
  pill: (color) => ({ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: color + '22', color, border: `1px solid ${color}55`, textTransform: 'uppercase', letterSpacing: 0.6 }),
  detail: { marginTop: 10, color: '#cbd5e1' },
  metrics: { marginTop: 12, fontSize: 13, color: '#94a3b8', display: 'flex', gap: 8, flexWrap: 'wrap' },
  metric: { padding: '4px 8px', background: '#1e293b', borderRadius: 6 },
};

function Renewables() {
  return (
    <div>
      <h1 style={styles.title}>On-Site Renewable Generation</h1>
      <p style={styles.subtitle}>
        Tracked as a first-class category, not buried inside Scope 2. Self-consumption reduces
        Scope 2 directly; grid exports are tracked separately to avoid double-counting.
      </p>
      <div style={styles.list}>
        {systems.map((s) => (
          <div key={s.name} style={styles.card}>
            <div style={styles.head}>
              <div style={styles.name}>{s.name}</div>
              <span style={styles.pill(s.color)}>{s.state}</span>
            </div>
            <div style={styles.detail}>{s.detail}</div>
            <div style={styles.metrics}>
              {s.metrics.map((m) => <span key={m} style={styles.metric}>{m}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Renewables;
