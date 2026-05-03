import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const opsCards = [
  {
    to: '/data-admin',
    icon: '🩺',
    title: 'Data Admin',
    body: 'Live health probe (adapter / Supabase / factors), CSV upload + parse preview, full emission-factor registry, meter registry with BMS join numbers.',
    stat: 'Health · Quality · Imports',
  },
  {
    to: '/trends',
    icon: '📈',
    title: 'Trend Builder',
    body: 'Pick a building, a window, an interval. Renders a time-series chart with hover tooltip. Reads through /api/meters/readings.',
    stat: 'Mock today · BMS once relay is wired',
  },
  {
    to: '/admin/legacy',
    icon: '🗂',
    title: 'Legacy admin (Supabase CRUD)',
    body: 'The original password-gated CRUD UI for fuel bills, students, travel, and waste. Still functional during the data-layer transition.',
    stat: 'Supabase-backed',
  },
];

const sections = [
  { to: '/admin/scope-1',    name: 'Scope 1',    desc: 'Heating fuel, refrigerants, fleet' },
  { to: '/admin/scope-2',    name: 'Scope 2',    desc: 'Electricity (campus meter + Liberty bills)' },
  { to: '/admin/scope-3',    name: 'Scope 3',    desc: 'Travel, waste, commuting, purchased goods' },
  { to: '/admin/renewables', name: 'Renewables', desc: 'Solar, geothermal, wind' },
  { to: '/admin/sinks',      name: 'Sinks',      desc: 'Tree inventory, soil samples' },
];

const tableMap = [
  { table: 'fuel_bills',           label: 'Fuel bills' },
  { table: 'day_students',         label: 'Day students' },
  { table: 'us_boarding_students', label: 'US boarding' },
  { table: 'international_students', label: 'International' },
  { table: 'study_abroad',         label: 'Study abroad' },
  { table: 'faculty_travel',       label: 'Faculty travel' },
  { table: 'waste',                label: 'Waste records' },
];

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 720 },

  sectionTitle: { marginTop: 32, marginBottom: 12, fontSize: 16, color: '#22d3ee', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 },

  opsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 },
  opsCard: { display: 'block', padding: '18px 20px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, color: 'inherit', textDecoration: 'none' },
  opsIcon: { fontSize: 28, marginBottom: 8 },
  opsName: { fontSize: 17, color: '#e5e7eb', fontWeight: 700, marginBottom: 8 },
  opsBody: { fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
  opsStat: { fontSize: 11, color: '#22d3ee', marginTop: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 },
  card: { display: 'block', padding: 18, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, textDecoration: 'none', color: '#e5e7eb' },
  name: { fontSize: 17, fontWeight: 600 },
  desc: { marginTop: 6, color: '#94a3b8', fontSize: 14 },

  counts: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
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
      <h1 style={styles.title}>Admin & Ops Portal</h1>
      <p style={styles.subtitle}>
        Operational tools and data management. The cards below cover live health, CSV imports,
        the Trend Builder, and the structured CRUD admin tree for every emissions category.
      </p>

      <div style={styles.sectionTitle}>Operations</div>
      <div style={styles.opsGrid}>
        {opsCards.map((c) => (
          <Link key={c.to} to={c.to} style={styles.opsCard}>
            <div style={styles.opsIcon} aria-hidden="true">{c.icon}</div>
            <div style={styles.opsName}>{c.title}</div>
            <div style={styles.opsBody}>{c.body}</div>
            <div style={styles.opsStat}>{c.stat}</div>
          </Link>
        ))}
      </div>

      <div style={styles.sectionTitle}>Data entry by category</div>
      <div style={styles.grid}>
        {sections.map((s) => (
          <Link key={s.to} to={s.to} style={styles.card}>
            <div style={styles.name}>{s.name}</div>
            <div style={styles.desc}>{s.desc}</div>
          </Link>
        ))}
      </div>

      <div style={styles.sectionTitle}>Current record counts</div>
      {error && <div style={{ marginTop: 8, color: '#fca5a5', fontSize: 13, marginBottom: 8 }}>Error: {error}</div>}
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
