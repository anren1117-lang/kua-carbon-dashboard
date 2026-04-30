import React from 'react';
import { Link } from 'react-router-dom';

const groups = [
  {
    heading: 'GHG Protocol categories',
    items: [
      { to: '/admin/scope-3/cat-1', cat: 'Cat 1', name: 'Purchased Goods & Services', status: 'Schema preview', desc: 'Spend-based using EPA Supply Chain (EEIO) factors.' },
      { to: '/admin/scope-3/cat-3', cat: 'Cat 3', name: 'Upstream Fuel & Energy', status: 'Derived', desc: 'Computed from Scope 1 and 2 quantities × upstream factors.' },
      { to: '/admin/scope-3/cat-5', cat: 'Cat 5', name: 'Waste in Operations', status: 'Live form', desc: 'Landfill, recycling, composting via EPA WARM.' },
      { to: '/admin/scope-3/cat-6', cat: 'Cat 6', name: 'Business Travel', status: 'Live form', desc: 'Faculty/staff flights, trains, hotels, mileage.' },
      { to: '/admin/scope-3/cat-7', cat: 'Cat 7', name: 'Employee Commuting', status: 'Schema preview', desc: 'Annual survey of non-resident faculty and staff.' },
    ],
  },
  {
    heading: 'Student travel (Yale-style addition)',
    items: [
      { to: '/admin/scope-3/student-day', cat: 'Day', name: 'Day Students', status: 'Live form', desc: 'Local commuters by ZIP.' },
      { to: '/admin/scope-3/student-us-boarding', cat: 'US', name: 'US Boarding Students', status: 'Live form', desc: 'Term-break round-trips by ZIP + state.' },
      { to: '/admin/scope-3/student-international', cat: 'Intl', name: 'International Students', status: 'Live form', desc: 'Long-haul flights by home country.' },
      { to: '/admin/scope-3/study-abroad', cat: 'SA', name: 'Study Abroad', status: 'Live form', desc: 'School-organized international programs.' },
    ],
  },
];

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  excluded: { marginTop: 16, padding: 12, background: '#0f172a', border: '1px dashed #334155', borderRadius: 8, color: '#94a3b8', fontSize: 13 },
  section: { marginTop: 32 },
  sectionHead: { fontSize: 14, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 },
  card: { display: 'block', padding: 16, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, textDecoration: 'none', color: '#e5e7eb' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  cat: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 },
  name: { fontSize: 17, fontWeight: 600, marginTop: 2 },
  status: (s) => ({ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: s === 'Live form' ? '#052e1a' : s === 'Derived' ? '#1e293b' : '#3a2a0d', color: s === 'Live form' ? '#86efac' : s === 'Derived' ? '#94a3b8' : '#fbbf24', textTransform: 'uppercase', letterSpacing: 0.4 }),
  desc: { marginTop: 8, color: '#94a3b8', fontSize: 13 },
};

function AdminScope3() {
  return (
    <div>
      <h1 style={styles.title}>Scope 3 — Category Data Entry</h1>
      <p style={styles.subtitle}>
        One page per Scope 3 category. Categories with backing tables in Supabase have working
        forms; the rest expose a planned schema until their tables are added.
      </p>
      <div style={styles.excluded}>
        Cat 9 (downstream transportation) and Cat 12 (end-of-life of sold products) are excluded
        from the inventory by design — schools do not sell physical products.
      </div>

      {groups.map((g) => (
        <section key={g.heading} style={styles.section}>
          <div style={styles.sectionHead}>{g.heading}</div>
          <div style={styles.grid}>
            {g.items.map((it) => (
              <Link key={it.to} to={it.to} style={styles.card}>
                <div style={styles.head}>
                  <div>
                    <div style={styles.cat}>{it.cat}</div>
                    <div style={styles.name}>{it.name}</div>
                  </div>
                  <span style={styles.status(it.status)}>{it.status}</span>
                </div>
                <div style={styles.desc}>{it.desc}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default AdminScope3;
