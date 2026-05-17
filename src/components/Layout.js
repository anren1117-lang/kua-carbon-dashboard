import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary.js';
import { useIsNarrow } from '../hooks/useViewport.js';

// Three-tier nav:
//   1. Top — the audience-agnostic "what's KUA's number?" set, visible always.
//   2. Categories dropdown — one-click access to every source-specific page.
//      No route is removed; this is the discovery surface for the long tail.
//   3. Right side — the two portals (Teacher + Admin) plus the Ask + Learn
//      tools that have their own UX patterns.
//
// On narrow viewports (< 720px) all three tiers collapse into a single
// hamburger drawer so the header doesn't horizontally overflow on phones.

const topItems = [
  { to: '/',          label: 'Overview', end: true },
  { to: '/executive', label: 'Executive' },
  { to: '/hotspots',  label: 'Hotspots' },
  { to: '/plan',      label: 'Plan' },         // Goals + Actions combined
  { to: '/buildings', label: 'Buildings' },
  { to: '/campus-map', label: 'Campus Map' },
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
  { to: '/your-footprint', label: 'Your footprint (calculator)' },
  { to: '/dorm-leaderboard', label: 'Dorm leaderboard' },
  { to: '/challenge',        label: 'Dorm challenge (monthly)' },
  { to: '/faq',              label: 'FAQ' },
];

const portalItems = [
  { to: '/news',    label: 'News',    color: '#86efac' },
  { to: '/learn',   label: 'Learn',   color: '#fbbf24' },
  { to: '/ask',     label: 'Ask',     color: '#a855f7' },
  { to: '/teacher', label: 'Teacher', color: '#22c55e' },
  { to: '/admin',   label: 'Admin',   color: '#22d3ee' },
];

const styles = {
  shell: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0b1220', color: '#e5e7eb' },
  header: { borderBottom: '1px solid #1f2937', background: '#0f172a', position: 'sticky', top: 0, zIndex: 10 },
  headerInner: { maxWidth: 1200, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'nowrap' },
  headerInnerNarrow: { maxWidth: 1200, margin: '0 auto', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
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
  catBtn: (active) => ({
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 14,
    color: active ? '#0b1220' : '#cbd5e1',
    background: active ? '#22d3ee' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: active ? 600 : 400,
    whiteSpace: 'nowrap',
  }),
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
  mainNarrow: { flex: 1, maxWidth: 1200, margin: '0 auto', padding: '20px 14px', width: '100%', boxSizing: 'border-box' },
  footer: { borderTop: '1px solid #1f2937', padding: '20px 24px', textAlign: 'center', fontSize: 12, color: '#64748b' },
  skipLink: { position: 'absolute', left: -9999, top: 8, padding: '8px 12px', background: '#22d3ee', color: '#0b1220', textDecoration: 'none', borderRadius: 4, fontWeight: 700, zIndex: 100 },

  // Hamburger + drawer
  hamburger: {
    padding: '10px 12px',
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 6,
    color: '#cbd5e1',
    fontSize: 18,
    fontFamily: 'inherit',
    cursor: 'pointer',
    minHeight: 44,
    minWidth: 44,
  },
  drawer: {
    position: 'fixed',
    top: 0, right: 0, bottom: 0,
    width: 'min(82vw, 320px)',
    background: '#0f172a',
    borderLeft: '1px solid #1f2937',
    boxShadow: '-8px 0 24px rgba(0,0,0,0.45)',
    padding: '14px 14px 24px',
    zIndex: 200,
    overflowY: 'auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  drawerBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    zIndex: 150,
  },
  drawerHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottom: '1px solid #1f2937',
  },
  drawerSectionLabel: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontWeight: 700,
    margin: '4px 4px 6px',
  },
  drawerLink: ({ isActive }) => ({
    display: 'block',
    padding: '12px 12px',
    borderRadius: 6,
    fontSize: 15,
    color: isActive ? '#0b1220' : '#cbd5e1',
    background: isActive ? '#22d3ee' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 700 : 500,
    minHeight: 44,
    boxSizing: 'border-box',
  }),
  drawerPortal: (color) => ({ isActive }) => ({
    display: 'block',
    padding: '12px 12px',
    borderRadius: 6,
    fontSize: 15,
    color: isActive ? '#0b1220' : color,
    background: isActive ? color : 'transparent',
    textDecoration: 'none',
    fontWeight: 700,
    border: `1px solid ${color}`,
    marginBottom: 6,
    minHeight: 44,
    boxSizing: 'border-box',
  }),
  drawerClose: {
    padding: '8px 10px',
    background: 'transparent',
    border: '1px solid #1f2937',
    borderRadius: 6,
    color: '#cbd5e1',
    fontSize: 14,
    fontFamily: 'inherit',
    cursor: 'pointer',
    minHeight: 36,
  },
};

function CategoriesMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const { pathname } = useLocation();
  // Highlight the parent button when the user is on one of the inner routes.
  const insideCategories = categoryItems.some(({ to }) => pathname === to || pathname.startsWith(to + '/'));

  // Close on outside click + Escape so click-to-toggle is touch-friendly
  // without trapping the menu open if the user navigates elsewhere.
  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Auto-close on route change.
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        style={styles.catBtn(insideCategories)}
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

// Mobile-only: every nav route flattened into one scrollable drawer,
// grouped by tier so the visual hierarchy from the desktop bar isn't
// lost. Auto-closes on route change so taps actually navigate away
// instead of leaving the drawer hanging open.
function MobileDrawer({ open, onClose }) {
  const { pathname } = useLocation();
  useEffect(() => { onClose(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div style={styles.drawerBackdrop} onClick={onClose} aria-hidden="true" />
      <nav style={styles.drawer} aria-label="Mobile primary">
        <div style={styles.drawerHead}>
          <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Menu</span>
          <button type="button" style={styles.drawerClose} onClick={onClose} aria-label="Close menu">Close</button>
        </div>

        <div>
          <div style={styles.drawerSectionLabel}>Portals</div>
          {portalItems.map(({ to, label, color }) => (
            <NavLink key={to} to={to} style={styles.drawerPortal(color)} aria-label={`${label} portal`}>
              {label}
            </NavLink>
          ))}
        </div>

        <div>
          <div style={styles.drawerSectionLabel}>Dashboard</div>
          {topItems.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} style={styles.drawerLink}>
              {label}
            </NavLink>
          ))}
        </div>

        <div>
          <div style={styles.drawerSectionLabel}>Categories</div>
          {categoryItems.map(({ to, label }) => (
            <NavLink key={to} to={to} style={styles.drawerLink}>
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

// Best-effort page title lookup. Most routes have an explicit
// label in topItems/categoryItems/portalItems; the few that don't
// (e.g. /lessons/:id, /admin/*) fall back to the static base title.
function pageTitleFor(pathname) {
  const all = [...topItems, ...categoryItems, ...portalItems];
  // Exact match first; then deepest prefix match for nested routes.
  const exact = all.find((it) => it.to === pathname);
  if (exact) return exact.label;
  const prefix = all
    .filter((it) => it.to !== '/' && pathname.startsWith(it.to + '/'))
    .sort((a, b) => b.to.length - a.to.length)[0];
  return prefix ? prefix.label : null;
}

function Layout() {
  const mainRef = useRef(null);
  const { pathname } = useLocation();
  const isNarrow = useIsNarrow();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Move focus to <main> on route change so screen readers + keyboard
  // users get a fresh reading position. Without this, focus stays on
  // the just-clicked nav link and the new page is silent.
  useEffect(() => {
    if (mainRef.current) mainRef.current.focus({ preventScroll: true });
  }, [pathname]);

  // Sync document.title on route change so the browser tab + screen-
  // reader announcement reflect the page the user is on.
  useEffect(() => {
    const label = pageTitleFor(pathname);
    document.title = label
      ? `${label} · KUA Carbon Dashboard`
      : 'KUA Carbon Dashboard';
  }, [pathname]);

  return (
    <div style={styles.shell}>
      <a href="#main" style={styles.skipLink}>Skip to main content</a>
      <header style={styles.header}>
        {isNarrow ? (
          <div style={styles.headerInnerNarrow}>
            <NavLink to="/" style={styles.brand} aria-label="KUA Carbon — go to overview">KUA Carbon</NavLink>
            <button
              type="button"
              style={styles.hamburger}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
            >
              ☰
            </button>
          </div>
        ) : (
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
        )}
      </header>
      {isNarrow && <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />}
      <main id="main" ref={mainRef} style={isNarrow ? styles.mainNarrow : styles.main} tabIndex="-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <footer style={styles.footer}>
        Kimball Union Academy · Net Carbon Dashboard · methodology and source code public on GitHub
      </footer>
    </div>
  );
}

export default Layout;
