import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const sections = [
  { to: '/admin/scope-1', name: 'Scope 1', desc: 'Heating fuel, refrigerants, fleet' },
  { to: '/admin/scope-2', name: 'Scope 2', desc: 'Electricity (campus meter + Liberty bills)' },
  { to: '/admin/scope-3', name: 'Scope 3', desc: 'Travel, waste, commuting, purchased goods' },
  { to: '/admin/renewables', name: 'Renewables', desc: 'Solar, geothermal, wind' },
  { to: '/admin/sinks', name: 'Sinks', desc: 'Tree inventory, soil samples' },
];

const tableMap = [
  { table: 'fuel_bills', label: 'Fuel bills' },
  { table: 'day_students', label: 'Day students' },
  { table: 'us_boarding_students', label: 'US boarding' },
  { table: 'international_students', label: 'International' },
  { table: 'study_abroad', label: 'Study abroad' },
  { table: 'faculty_travel', label: 'Faculty travel' },
  { table: 'waste', label: 'Waste records' },
];

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 720 },
  grid: { marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
  card: { display: 'block', padding: 20, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12, textDecoration: 'none', color: '#e5e7eb' },
  name: { fontSize: 18, fontWeight: 600 },
  desc: { marginTop: 6, color: '#94a3b8', fontSize: 14 },
  countsTitle: { marginTop: 40, fontSize: 18, color: '#e5e7eb' },
  counts: { marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  count: { padding: 14, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8 },
  countLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 },
  countValue: { marginTop: 6, fontSize: 22, fontWeight: 700 },
};

function AdminHome() {
  const [counts, setCounts] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          tableMap.map(({ table }) => supabase.from(table).select('*', { count: 'exact', head: true }))
        );
        if (cancelled) return;
        const next = {};
        results.forEach((r, i) => { next[tableMap[i].table] = r.count ?? '—'; });
        setCounts(next);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Admin Dashboard</h1>
      <p style={styles.subtitle}>
        Pick a section to enter or review data. Each section maps to the same scope structure
        used on the public site, so what you enter here lands directly under the matching
        public view.
      </p>
      <div style={styles.grid}>
        {sections.map((s) => (
          <Link key={s.to} to={s.to} style={styles.card}>
            <div style={styles.name}>{s.name}</div>
            <div style={styles.desc}>{s.desc}</div>
          </Link>
        ))}
      </div>

      <h2 style={styles.countsTitle}>Current record counts</h2>
      {error && <div style={{ marginTop: 8, color: '#fca5a5', fontSize: 13 }}>Error: {error}</div>}
      <div style={styles.counts}>
        {tableMap.map(({ table, label }) => (
          <div key={table} style={styles.count}>
            <div style={styles.countLabel}>{label}</div>
            <div style={styles.countValue}>{counts[table] ?? '…'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminHome;
