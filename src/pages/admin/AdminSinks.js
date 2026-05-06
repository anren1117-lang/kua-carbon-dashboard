import React from 'react';
import { Link } from 'react-router-dom';

const items = [
  { to: '/admin/sinks/stands', name: 'Forest stands',   table: 'forest_stand_actuals', status: 'Live form', desc: 'Per-stand acreage × Birdsey/Nowak per-acre rate. Flips the Sinks headline from the placeholder inventory to live measured.' },
  { to: '/admin/sinks/trees',  name: 'Tree inventory',  table: 'sinks_trees',          status: 'Live form', desc: 'Per-tree DBH-based row. Jenkins-style biomass preview; USDA UTD allometrics later.' },
  { to: '/admin/sinks/soil',   name: 'Soil samples',    table: 'sinks_soil_samples',   status: 'Live form', desc: 'Inputs for SOC stock = depth × bulk density × OC%. Land-use weighted at report time.' },
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

function AdminSinks() {
  return (
    <div>
      <h1 style={styles.title}>Sinks — Trees & Soils Data Entry</h1>
      <p style={styles.subtitle}>
        On-campus sequestration measured directly rather than estimated, addressing the gap
        identified by Valls-Val and Bovea (2021).
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

export default AdminSinks;
