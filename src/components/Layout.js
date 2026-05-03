import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

// Three-tier nav:
//   1. Top — the audience-agnostic "what's KUA's number?" set, visible always.
//   2. Categories dropdown — one-click access to every source-specific page.
//      No route is removed; this is the discovery surface for the long tail.
//   3. Right side — the two portals (Teacher + Admin) plus the Ask + Learn
//      tools that have their own UX patterns.

const topItems = [
  { to: '/',          label: 'Overview', end: true },
  { to: '/executive', label: 'Executive' },
  { to: '/hotspots',  label: 'Hotspots' },
  { to: '/plan',      label: 'Plan' },         // Goals + Actions combined
  { to: '/buildings', label: 'Buildings' },
  { to: '/scope-1',   label: 'Scope 1' },
  { to: '/scope-2',   label: 'Scope 2' },
  { to: '/scope-3',   label: 'Scope 3' },
  { to: '/sinks-os',  label: 'Sinks' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/report',    label: 'Report' },
  // /lessons (the published catalog) is reachable via the Learn portal
  // and via the "Open the full catalog" link on /learn. Keeping it out
  // of the top nav so the public bar doesn't grow unbounded.
];

const categoryItems = [
  { to: '/dining',         label: 'Dining' },
  { to: '/transportation', label: 'Transportation' },
  { to: '/waste',          label: 'Waste' },
  { to: '/procurement',    label: 'Procurement' },
  { to: '/drawdown',       label: 'Drawdown — Renewables + Sinks' },
  { to: '/credits',        label: 'Carbon Credits' },
  { to: '/scenarios',      label: 'Scenarios' },
  { to: '/renewables-os',  label: 'Renewables (standalone)' },
  { to: '/goals',          label: 'Goals (standalone)' },
  { to: '/actions',        label: 'Actions (standalone)' },
  { to: '/trends',         label: 'Trend Builder' },
];

const portalItems = [
  { to: '/learn',   label: 'Learn',   color: '#fbbf24' },
  { to: '/ask',     label: 'Ask',     color: '#a855f7' },
  { to: '/teacher', label: 'Teacher', color: '#22c55e' },
  { to: '/admin',   label: 'Admin',   color: '#22d3ee' },
];

const styles = {
  shell: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0b1220', color: '#e5e7eb' },
  header: { borderBottom: '1px solid #1f2937', background: '#0f172a', position: 'sticky', top: 0, zIndex: 10 },
  headerInner: { maxWidth: 1200, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'nowrap' },
  brand: { fontWeight: 700, fontSize: 18, letterSpacing: 0.2, color: '#22d3ee', textDecoration: 'none', whiteSpace: 'nowrap' },
  nav: { display: 'flex', gap: 4, flex: 1, minWidth: 0 },
  link: ({ isActive }) => ({
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 14,
    color: isActive ? '#0b1220' : '#cbd5e1',
    background: isActive ? '#22d3ee' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 400,
    whiteSpace: 'nowrap',
  }),
  catBtn: { padding: '6px 10px', borderRadius: 6, fontSize: 14, color: '#cbd5e1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 400, whiteSpace: 'nowrap' },
  catMenu: { position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8, padding: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.35)', minWidth: 240, zIndex: 100 },
  catItem: ({ isActive }) => ({
    display: 'block',
    padding: '8px 12px',
    borderRadius: 6,
    fontSize: 13,
    color: isActive ? '#22d3ee' : '#cbd5e1',
    background: isActive ? '#1f2937' : 'transparent',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }),
  rightGroup: { display: 'flex', gap: 6, flexShrink: 0 },
  portalLink: (color) => ({ isActive }) => ({
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 14,
    color: isActive ? '#0b1220' : color,
    background: isActive ? color : 'transparent',
    textDecoration: 'none',
    fontWeight: 600,
    border: `1px solid ${color}`,
    whiteSpace: 'nowrap',
  }),
  main: { flex: 1, maxWidth: 1200, margin: '0 auto', padding: '32px 24px', width: '100%', boxSizing: 'border-box' },
  footer: { borderTop: '1px solid #1f2937', padding: '20px 24px', textAlign: 'center', fontSize: 12, color: '#64748b' },
  skipLink: { position: 'absolute', left: -9999, top: 8, padding: '8px 12px', background: '#22d3ee', color: '#0b1220', textDecoration: 'none', borderRadius: 4, fontWeight: 700, zIndex: 100 },
};

function CategoriesMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        style={styles.catBtn}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Categories ▾
      </button>
      {open && (
        <div style={styles.catMenu} role="menu">
          {categoryItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={styles.catItem}
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function Layout() {
  return (
    <div style={styles.shell}>
      <a href="#main" style={styles.skipLink}>Skip to main content</a>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <NavLink to="/" style={styles.brand} aria-label="KUA Carbon — go to overview">KUA Carbon</NavLink>
          <nav style={styles.nav} className="nav-scroll" aria-label="Primary">
            {topItems.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} style={styles.link}>
                {label}
              </NavLink>
            ))}
            <CategoriesMenu />
          </nav>
          <div style={styles.rightGroup}>
            {portalItems.map(({ to, label, color }) => (
              <NavLink key={to} to={to} style={styles.portalLink(color)} aria-label={`${label} portal`}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>
      <main id="main" style={styles.main} tabIndex="-1">
        <Outlet />
      </main>
      <footer style={styles.footer}>
        Kimball Union Academy · Net Carbon Dashboard · methodology and source code public on GitHub
      </footer>
    </div>
  );
}

export default Layout;
