import React from 'react';
import { Link } from 'react-router-dom';

const items = [
  { to: '/admin/renewables/solar',      name: 'Solar PV',     table: 'renewables_solar',      status: 'Live form', desc: 'Gross / self-consumed / exported kWh. Self-consumed reduces Scope 2; exports tracked separately.' },
  { to: '/admin/renewables/geothermal', name: 'Geothermal',   table: 'renewables_geothermal', status: 'Live form', desc: 'kWh × COP × 3412 BTU/kWh → counterfactual avoided fossil emissions.' },
  { to: '/admin/renewables/wind',       name: 'Wind turbine', table: 'renewables_wind',       status: 'Live form', desc: 'Offline-asset documentation; same model accepts live data when restored.' },
];

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 720 },
  grid: { marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 },
  card: { display: 'block', padding: 16, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, textDecoration: 'none', color: '#e5e7eb' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  name: { fontSize: 18, fontWeight: 600 },
  table: { fontSize: 11, color: '#64748b', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  status: { fontSize: 11, padding: '3px 8px', borderRadius: 999, background: '#052e1a', color: '#86efac', textTransform: 'uppercase', letterSpacing: 0.4 },
  desc: { marginTop: 8, color: '#94a3b8', fontSize: 13 },
};

function AdminRenewables() {
  return (
    <div>
      <h1 style={styles.title}>Renewables — Generation Tracking</h1>
      <p style={styles.subtitle}>
        First-class category. Self-consumption reduces Scope 2 directly; net-metered exports
        are tracked separately to avoid double-counting under New Hampshire net-metering rules.
      </p>
      <div style={styles.grid}>
        {items.map((it) => (
          <Link key={it.to} to={it.to} style={styles.card}>
            <div style={styles.head}>
              <div>
                <div style={styles.name}>{it.name}</div>
                <div style={styles.table}>{it.table}</div>
              </div>
              <span style={styles.status}>{it.status}</span>
            </div>
            <div style={styles.desc}>{it.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminRenewables;
