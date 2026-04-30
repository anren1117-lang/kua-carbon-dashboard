import React from 'react';
import { EducationalCard } from '../components/EducationalCard';

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

      <EducationalCard
        title="How three different on-site systems each reduce campus emissions"
        sections={[
          {
            heading: 'Solar PV — direct and exported',
            body: [
              'When the array is producing more than the campus is using, the surplus flows back to Liberty\'s grid. New Hampshire net metering means KUA gets credited at the retail rate.',
              'Self-consumed kWh reduce Scope 2 directly: those electrons never came from the grid, so no fossil generation was needed for them.',
              'Exported kWh are tracked as a separate "avoided emissions" line so we don\'t double-count: Liberty serves them to other customers, who then can\'t claim them as zero-carbon.',
            ],
          },
          {
            heading: 'Geothermal — moving heat, not making it',
            body: [
              'A ground-source heat pump moves heat between the building and the earth. It uses electricity, but for every 1 kWh it consumes it can deliver 3–4 kWh of heat — a coefficient of performance (COP) of 3 to 4.',
              'The carbon benefit is counterfactual: we estimate how much heating oil or propane would have been burned to deliver the same heat, and credit the system for that avoided fossil combustion.',
              'Because it\'s an estimate, geothermal data is flagged "estimated" by default rather than "measured."',
            ],
          },
          {
            heading: 'Why the broken wind turbine is still on the dashboard',
            body: 'Hiding offline equipment misrepresents both reality (we have a turbine — it\'s just down) and history (whoever decides whether to restore it needs the historical baseline). The turbine is documented with status, last operational date, and any historical generation we have records of, with zero current output. The same data model accepts live readings the day it\'s restored.',
            citation: 'GHG Protocol Scope 2 Guidance; IPCC AR6 on radiative forcing for net-metering accounting.',
          },
        ]}
      />

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
