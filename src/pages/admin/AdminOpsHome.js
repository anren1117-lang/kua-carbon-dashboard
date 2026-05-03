import React from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection } from '../../components/ModuleShell.js';

// Operations & Data hub for the admin portal. Sits next to the existing
// CRUD admin tree (AdminHome) and groups the operational tools that
// previously lived as standalone public routes (Data Admin, Trend
// Builder, etc.) without removing those routes.

const dataCards = [
  {
    to: '/data-admin',
    icon: '🩺',
    title: 'Data Admin',
    body: 'Live health probe (adapter / Supabase / factors), CSV upload + parse preview, emission-factor registry with citations, full meter registry with BMS join numbers.',
    stat: 'Health · Quality · Imports',
  },
  {
    to: '/trends',
    icon: '📈',
    title: 'Trend Builder',
    body: 'Pick a building, a window, an interval. Renders a time-series chart with hover tooltip. Reads through /api/meters/readings — works against any adapter.',
    stat: 'Mock today · BMS once relay is wired',
  },
  {
    to: '/admin/legacy',
    icon: '🗂',
    title: 'Legacy Admin Portal',
    body: 'The original password-gated CRUD UI for fuel bills, students, travel, and waste. Still functional during the data-layer transition.',
    stat: 'Supabase-backed',
  },
];

const editCards = [
  { to: '/admin/scope-1', label: 'Scope 1 — Heating, propane, refrigerants, fleet' },
  { to: '/admin/scope-2', label: 'Scope 2 — Meter readings' },
  { to: '/admin/scope-3', label: 'Scope 3 — Travel, commuting, waste, purchased goods' },
  { to: '/admin/renewables', label: 'Renewables — Solar, geothermal, wind' },
  { to: '/admin/sinks', label: 'Sinks — Tree inventory, soil samples' },
  { to: '/admin/methodology', label: 'Methodology' },
  { to: '/admin/framework', label: 'Framework' },
  { to: '/admin/ai-ingestion', label: 'AI ingestion' },
];

export default function AdminOpsHome() {
  return (
    <ModulePage
      title="Admin & Ops"
      subtitle="Every operational + data-management tool. Data quality, manual edits, and the structured CRUD admin tree."
    >
      <ModuleSection title="Operations">
        <div style={styles.grid}>
          {dataCards.map((c) => (
            <Link key={c.to} to={c.to} style={styles.card}>
              <div style={styles.cardIcon} aria-hidden="true">{c.icon}</div>
              <div style={styles.cardTitle}>{c.title}</div>
              <div style={styles.cardBody}>{c.body}</div>
              <div style={styles.cardStat}>{c.stat}</div>
            </Link>
          ))}
        </div>
      </ModuleSection>

      <ModuleSection title="Data entry by category" hint="Structured admin forms for each emissions source. Same CRUD tree the legacy admin portal exposed.">
        <div style={styles.editGrid}>
          {editCards.map((c) => (
            <Link key={c.to} to={c.to} style={styles.editCard}>
              <span style={styles.editArrow} aria-hidden="true">→</span>
              {c.label}
            </Link>
          ))}
        </div>
      </ModuleSection>

      <ModuleSection title="Note on access">
        <p style={styles.note}>
          The legacy admin portal at <Link to="/admin/legacy" style={{ color: '#22d3ee' }}>/admin/legacy</Link> is password-gated.
          The structured admin pages above don't have the gate yet — phase-2 will plumb school SSO so per-section permissions can be enforced (sustainability staff can edit fuel + meters, dining director can edit dining, etc.).
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 },
  card: { display: 'block', padding: '18px 20px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, color: 'inherit', textDecoration: 'none' },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardTitle: { fontSize: 17, color: '#e5e7eb', fontWeight: 700, marginBottom: 8 },
  cardBody: { fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
  cardStat: { fontSize: 11, color: '#22d3ee', marginTop: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 },

  editGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 },
  editCard: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: '#cbd5e1', textDecoration: 'none', fontSize: 14 },
  editArrow: { color: '#22d3ee', fontWeight: 700 },

  note: { fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.7 },
};
