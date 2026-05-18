import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary.js';
import { useIsNarrow } from '../hooks/useViewport.js';
import { Icon } from './Icon.js';
import { BackToTop } from './BackToTop.js';

// Three-tier nav:
//   1. Top — the audience-agnostic "what's KUA's number?" set, visible always.
//   2. Categories dropdown — one-click access to every source-specific page.
//      No route is removed; this is the discovery surface for the long tail.
//   3. Right side — the two portals (Teacher + Admin) plus the Ask + Learn
//      tools that have their own UX patterns.
//
// On narrow viewports (< 720px) all three tiers collapse into a single
// hamburger drawer so the header doesn't horizontally overflow on phones.

// Top nav — kept tight so the public header doesn't overflow.
// Phase 273 trim: dropped Hotspots (rolled up under Executive),
// Sinks (covered by Methodology + Scope rollups), and Report
// (linked from Executive). Scope 1/2/3 still live up here because
// they're the canonical GHG Protocol structure most visitors look for.
const topItems = [
  { to: '/',           label: 'Overview', end: true },
  { to: '/executive',  label: 'Executive' },
  { to: '/plan',       label: 'Plan' },         // Goals + Actions combined
  { to: '/campus-map', label: 'Campus Map' },
  { to: '/buildings',  label: 'Buildings' },
  { to: '/scope-1',    label: 'Scope 1' },
  { to: '/scope-2',    label: 'Scope 2' },
  { to: '/scope-3',    label: 'Scope 3' },
  { to: '/methodology', label: 'Methodology' },
];

// Categories dropdown — Phase 273 cut from 16 items to 5. Now
// strictly the student/staff-facing TOOLS the dashboard ships:
// the calculator, the simulator, the two dorm pages, and the FAQ.
// Everything else moved out:
//   • Dining/Transportation/Waste/Procurement → reachable from /scope-3
//   • Goals/Actions (standalone) → already inside /plan tabs
//   • Drawdown/Renewables/Sinks → reachable from /scope-1 + /methodology
//   • Carbon Credits → from /plan
//   • Trend Builder → power-user, reachable from /admin
//   • Share (QR) → footer + /faq
//   • Hotspots / Sinks / Report → footer + Executive
const categoryItems = [
  { to: '/your-footprint',   label: 'Your footprint (calculator)', icon: Icon.Leaf },
  { to: '/scenarios',        label: 'Reduction simulator',         icon: Icon.Sparkles },
  { to: '/dorm-leaderboard', label: 'Dorm leaderboard',            icon: Icon.Trophy },
  { to: '/challenge',        label: 'Dorm challenge (monthly)',    icon: Icon.Bolt },
  { to: '/carbon-math',      label: 'Carbon math practice',        icon: Icon.Chart },
  { to: '/faq',              label: 'FAQ',                          icon: Icon.HelpCircle },
];

// Routes that moved out of the visible nav in Phase 273. Footer
// renders these in themed columns (Phase 274) so 14 unordered pills
// turn into a scannable site index.
const moreGroups = [
  {
    title: 'Insights',
    icon: Icon.Chart,
    items: [
      { to: '/digest',           label: 'Monthly digest' },
      { to: '/compare',          label: 'Compare two months' },
      { to: '/compare-buildings', label: 'Compare two buildings' },
      { to: '/hotspots',       label: 'Hotspots' },
      { to: '/sinks-os',       label: 'Sinks' },
      { to: '/report',         label: 'Annual report' },
      { to: '/trends',         label: 'Trend Builder' },
    ],
  },
  {
    title: 'Plan & finance',
    icon: Icon.Bolt,
    items: [
      { to: '/goals',          label: 'Goals (standalone)' },
      { to: '/actions',        label: 'Actions (standalone)' },
      { to: '/drawdown',       label: 'Drawdown' },
      { to: '/credits',        label: 'Carbon credits' },
      { to: '/renewables-os',  label: 'Renewables' },
    ],
  },
  {
    title: 'Operations',
    icon: Icon.Refresh,
    items: [
      { to: '/dining',         label: 'Dining' },
      { to: '/transportation', label: 'Transportation' },
      { to: '/waste',          label: 'Waste' },
      { to: '/procurement',    label: 'Procurement' },
      { to: '/share',          label: 'Share (QR)' },
      { to: '/dorm-posters',   label: 'Dorm QR posters' },
    ],
  },
];
// Flat list used by the mobile drawer's "More" section + by the
// pageTitleFor() route lookup.
const moreItems = moreGroups.flatMap((g) => g.items);

const portalItems = [
  { to: '/news',    label: 'News',    color: '#86efac' },
  { to: '/learn',   label: 'Learn',   color: '#fbbf24' },
  { to: '/ask',     label: 'Ask',     color: '#a855f7' },
  { to: '/teacher', label: 'Teacher', color: '#22c55e' },
  { to: '/admin',   label: 'Admin',   color: '#22d3ee' },
];

const styles = {
  shell: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0b1220', color: '#e5e7eb' },
  header: { borderBottom: '1px solid #1f2937', background: '#0f172a', position: 'sticky', top: 0, zIndex: 10, transition: 'background 200ms ease, box-shadow 200ms ease' },
  headerInner: { maxWidth: 1200, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'nowrap' },
  headerInnerNarrow: { maxWidth: 1200, margin: '0 auto', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  brand: { fontWeight: 700, fontSize: 18, letterSpacing: 0.2, color: '#22d3ee', textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 8 },
  brandIcon: { display: 'inline-flex', filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.35))' },
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
  catMenu: { position: 'absolute', top: '100%', left: 0, marginTop: 6, background: 'rgba(15, 23, 42, 0.96)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid #1f2937', borderRadius: 10, padding: 6, boxShadow: '0 12px 32px -4px rgba(0,0,0,0.6), 0 0 0 1px rgba(34, 211, 238, 0.08)', minWidth: 260, zIndex: 100, animation: 'kuaMenuOpen 180ms cubic-bezier(0.22, 1, 0.36, 1)' },
  catItem: ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: 6,
    fontSize: 13,
    color: isActive ? '#22d3ee' : '#cbd5e1',
    background: isActive ? '#1f2937' : 'transparent',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'background 120ms, color 120ms',
  }),
  rightGroup: { display: 'flex', gap: 6, flexShrink: 0 },
  portalLink: (color) => ({ isActive }) => ({
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 14,
    color: isActive ? '#0b1220' : color,
    // Faint tinted background even when inactive — gives the
    // button visible weight without competing with the cyan brand.
    background: isActive ? color : `${color}14`, // hex alpha 0x14 = ~8%
    textDecoration: 'none',
    fontWeight: 600,
    border: `1px solid ${isActive ? color : `${color}66`}`, // 0x66 = ~40%
    whiteSpace: 'nowrap',
    transition: 'background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease',
  }),
  main: { flex: 1, maxWidth: 1200, margin: '0 auto', padding: '32px 24px', width: '100%', boxSizing: 'border-box' },
  mainNarrow: { flex: 1, maxWidth: 1200, margin: '0 auto', padding: '20px 14px', width: '100%', boxSizing: 'border-box' },
  footer: { borderTop: '1px solid #1f2937', padding: '32px 24px 28px', fontSize: 12, color: '#64748b', background: '#0a121f' },
  footerInner: { maxWidth: 1100, margin: '0 auto' },
  footerCols: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, marginBottom: 24 },
  footerCol: { display: 'flex', flexDirection: 'column', gap: 4 },
  footerColTitle: { fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, marginBottom: 6 },
  footerLink: { padding: '4px 0', color: '#94a3b8', textDecoration: 'none', fontSize: 12, transition: 'color 120ms' },
  footerTag: { textAlign: 'center', color: '#64748b', borderTop: '1px solid #1f2937', paddingTop: 18, marginTop: 6 },
  skipLink: { position: 'absolute', left: -9999, top: 8, padding: '10px 16px', background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', color: '#0b1220', textDecoration: 'none', borderRadius: 6, fontWeight: 800, zIndex: 100, fontSize: 13, letterSpacing: 0.4, boxShadow: '0 4px 14px -2px rgba(34, 211, 238, 0.5)' },

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
        Tools ▾
      </button>
      {open && (
        <div style={styles.catMenu} role="menu">
          {categoryItems.map(({ to, label, icon: ItemIcon }) => (
            <NavLink
              key={to}
              to={to}
              style={styles.catItem}
              role="menuitem"
            >
              {ItemIcon && (
                <span style={{ display: 'inline-flex', marginRight: 10, opacity: 0.85 }}>
                  <ItemIcon size={14} />
                </span>
              )}
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
          <div style={styles.drawerSectionLabel}>Tools</div>
          {categoryItems.map(({ to, label, icon: ItemIcon }) => (
            <NavLink key={to} to={to} style={styles.drawerLink}>
              {ItemIcon && (
                <span style={{ display: 'inline-flex', marginRight: 10, opacity: 0.85, verticalAlign: 'middle' }}>
                  <ItemIcon size={14} />
                </span>
              )}
              {label}
            </NavLink>
          ))}
        </div>

        <div>
          <div style={styles.drawerSectionLabel}>More</div>
          {moreItems.map(({ to, label }) => (
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
  const [scrolled, setScrolled]   = useState(false);

  // Track whether the user has scrolled past 60px so the sticky
  // header can swap to a backdrop-blur treatment. Throttled to one
  // update per animation frame to keep scroll cheap.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let raf = null;
    function onScroll() {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
        raf = null;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // sync initial state
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  // Move focus to <main> on route change so screen readers + keyboard
  // users get a fresh reading position. Without this, focus stays on
  // the just-clicked nav link and the new page is silent.
  useEffect(() => {
    if (mainRef.current) mainRef.current.focus({ preventScroll: true });
    // Smooth-scroll the window to top on route change so a deep-
    // scrolled page doesn't preserve its position when the user
    // navigates to a different route. Respects reduced-motion via
    // behavior: 'auto' fallback.
    if (typeof window !== 'undefined') {
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
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
      <header style={styles.header} className={scrolled ? 'kua-header-scrolled' : ''}>
        {isNarrow ? (
          <div style={styles.headerInnerNarrow}>
            <NavLink to="/" style={styles.brand} aria-label="KUA Carbon — go to overview">
              <span style={styles.brandIcon}><Icon.Leaf size={18} /></span>
              KUA Carbon
            </NavLink>
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
            <NavLink to="/" style={styles.brand} aria-label="KUA Carbon — go to overview">
              <span style={styles.brandIcon}><Icon.Leaf size={18} /></span>
              KUA Carbon
            </NavLink>
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
          {/* `key={pathname}` re-mounts the wrapper on route change,
              which retriggers the page-fade-in CSS animation so every
              navigation gets a fresh fade rather than just the first
              page load. */}
          <div key={pathname} className="page-fade-in">
            <Outlet />
          </div>
        </ErrorBoundary>
      </main>
      <BackToTop />
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerCols}>
            {moreGroups.map((g) => (
              <div key={g.title} style={styles.footerCol}>
                <div style={styles.footerColTitle}>
                  {g.icon && (
                    <span style={{ display: 'inline-flex', marginRight: 6, verticalAlign: 'middle' }}>
                      <g.icon size={11} />
                    </span>
                  )}
                  {g.title}
                </div>
                {g.items.map(({ to, label }) => (
                  <NavLink key={to} to={to} style={styles.footerLink}>
                    {label}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
          <div style={styles.footerTag}>
            Kimball Union Academy · Net Carbon Dashboard ·{' '}
            <a
              href="https://github.com/anren1117-lang/kua-carbon-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#94a3b8', textDecoration: 'underline', textUnderlineOffset: 2 }}
            >
              source on GitHub
            </a>
            {' · '}
            <a
              href="https://github.com/anren1117-lang/kua-carbon-dashboard/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#94a3b8', textDecoration: 'underline', textUnderlineOffset: 2 }}
            >
              suggest a feature
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
