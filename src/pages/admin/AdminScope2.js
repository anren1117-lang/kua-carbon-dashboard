import React from 'react';
import { Link } from 'react-router-dom';

const items = [
  { to: '/admin/scope-2/meter', name: 'Campus meter readings', table: 'scope2_meter_readings', status: 'Live form', desc: 'Source of truth for kWh. ISO-NE 2024 factor: 643 lb CO₂/MWh location-based.' },
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

function AdminScope2() {
  return (
    <div>
      <h1 style={styles.title}>Scope 2 — Purchased Electricity</h1>
      <p style={styles.subtitle}>
        Quantity comes from the campus real-time meter — the single source of truth.
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

export default AdminScope2;
