import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const QUICK_LINKS = [
  { to: '/',            label: 'Home — net carbon balance' },
  { to: '/scope-2',     label: 'Scope 2 — live electricity dashboard' },
  { to: '/buildings',   label: 'Buildings — per-building energy' },
  { to: '/hotspots',    label: 'Hotspots — where emissions concentrate' },
  { to: '/plan',        label: 'Plan — goals + reduction actions' },
  { to: '/learn',       label: 'Learn — guided walkthroughs' },
  { to: '/methodology', label: 'Methodology — every emission factor' },
  { to: '/admin',       label: 'Admin portal' },
];

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.badge}>404 · route not found</div>
        <h1 style={styles.title}>That page isn't here.</h1>
        <p style={styles.body}>
          No KUA dashboard route matches <code style={styles.code}>{pathname}</code>.
          The dashboard's URL scheme follows the GHG Protocol scopes plus a few action
          surfaces — pick one of these to get back on track:
        </p>
        <ul style={styles.list}>
          {QUICK_LINKS.map(({ to, label }) => (
            <li key={to} style={styles.item}>
              <Link to={to} style={styles.link}>{label}</Link>
              <span style={styles.path}>{to}</span>
            </li>
          ))}
        </ul>
        <p style={styles.hint}>
          If you got here from a link inside the dashboard, that's a bug — it means a
          page is pointing somewhere that no longer exists. Mention the URL you came
          from so it can be tracked down.
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 760, margin: '40px auto', padding: '0 16px' },
  card: { background: '#0f172a', border: '1px solid #1f2937', borderRadius: 14, padding: '32px 36px', borderLeft: '3px solid #ef4444' },
  badge: { display: 'inline-block', fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#7f1d1d', color: '#fecaca', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 14 },
  title: { margin: 0, fontSize: 26, fontWeight: 700, color: '#e5e7eb' },
  body: { marginTop: 14, color: '#cbd5e1', fontSize: 15, lineHeight: 1.7 },
  code: { background: '#0b1220', border: '1px solid #1f2937', padding: '1px 6px', borderRadius: 4, color: '#fbbf24', fontSize: 13, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  list: { marginTop: 18, listStyle: 'none', padding: 0, display: 'grid', gap: 6 },
  item: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, gap: 16 },
  link: { color: '#22d3ee', textDecoration: 'none', fontWeight: 600, fontSize: 14 },
  path: { color: '#64748b', fontSize: 11, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  hint: { marginTop: 18, color: '#64748b', fontSize: 12, lineHeight: 1.6, fontStyle: 'italic' },
};
