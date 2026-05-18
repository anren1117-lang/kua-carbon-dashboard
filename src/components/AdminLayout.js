import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_AUTH_EXPIRED_EVENT } from '../utils/adminFetch.js';
import { ErrorBoundary } from './ErrorBoundary.js';
import { Icon } from './Icon.js';

// Grouped admin navigation. The flat 14-tab bar that lived here was
// hard to scan; admins had to read every label to find the page they
// wanted. Now: 4 top-level groups, each with a dropdown of related
// pages. Mirrors the public Layout's CategoriesMenu pattern.
//
//   Dashboard   — single link to /admin
//   Plan        — generate + compose reduction plans (Plan Agent,
//                 Stage Planner, Reduction Actions)
//   Data Entry  — per-scope CRUD forms (Scope 1/2/3, Renewables,
//                 Sinks, Framework sandbox)
//   Sources     — ingest layer (Facilities asset inventory,
//                 BMS Export mapping, AI document ingestion)
//   Reference   — Methodology + Legacy CRUD portal
//
// The single source-of-truth NAV_GROUPS array drives both the header
// dropdowns and the AdminHome dashboard tiles, so adding a new admin
// page in one place ships everywhere.
export const NAV_GROUPS = [
  {
    key: 'plan',
    label: 'Plan',
    accent: '#22c55e',
    blurb: 'Generate, compose, and track reduction plans.',
    items: [
      { to: '/admin/plan-agent',    label: 'Plan Agent',         desc: 'AI-driven 5-7 step institutional plan from your fiscal context.' },
      { to: '/admin/stage-planner', label: 'Stage Planner',      desc: 'Compose actions into phased, time-boxed stages of your own.' },
      { to: '/admin/actions',       label: 'Reduction Actions',  desc: 'Library of every action + add-your-own custom items with AI-estimated impact.' },
    ],
  },
  {
    key: 'data',
    label: 'Data entry',
    accent: '#22d3ee',
    blurb: 'Per-scope structured CRUD forms.',
    items: [
      { to: '/admin/scope-1',    label: 'Scope 1',    desc: 'Heating fuel, refrigerants, fleet vehicles.' },
      { to: '/admin/scope-2',    label: 'Scope 2',    desc: 'Electricity meter readings, Liberty Utilities bills.' },
      { to: '/admin/scope-3',    label: 'Scope 3',    desc: 'Tabbed entry hub for student travel, faculty trips, waste, purchased goods, commuting — replaces the legacy portal.' },
      { to: '/admin/renewables', label: 'Renewables', desc: 'Solar, geothermal, wind generation.' },
      { to: '/admin/sinks',      label: 'Sinks',      desc: 'Tree inventory, soil samples.' },
      { to: '/admin/framework',  label: 'Framework sandbox', desc: 'Generic typed-row entry while category-specific forms are still being designed.' },
    ],
  },
  {
    key: 'sources',
    label: 'Sources',
    accent: '#fbbf24',
    blurb: 'Asset inventory + ingestion layer.',
    items: [
      { to: '/admin/facilities',   label: 'Facilities',   desc: 'Buildings, meters, forest stands, soil samples — edit / decommission / add.' },
      { to: '/admin/bms-export',   label: 'BMS Export',   desc: 'Map Distech Eclypse Power-Meter devices to KUA buildings; flips estimates → measured.' },
      { to: '/admin/ai-ingestion', label: 'AI Agent',     desc: 'PDF / spreadsheet / email ingestion pipeline (Phase-3 staging area).' },
    ],
  },
  {
    key: 'reference',
    label: 'Reference',
    accent: '#a855f7',
    blurb: 'Methodology + legacy tools.',
    items: [
      { to: '/admin/methodology',   label: 'Methodology',   desc: 'Every emission factor + framework choice + citation used by the dashboard.' },
      { to: '/admin/data-quality',  label: 'Data Quality',  desc: 'Single-page summary of measured-vs-estimated state across every scope and table.' },
      { to: '/admin/audit-log',     label: 'Audit Log',     desc: 'Every admin write recorded for AASHE STARS reporting and "who-changed-this" debugging.' },
      { to: '/admin/alerts',        label: 'Alerts',        desc: 'Email addresses that get notified when the dashboard detects something unusual (stale data, dead meter, anomaly).' },
    ],
  },
];

const styles = {
  shell: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0b1220', color: '#e5e7eb' },
  // Off-screen until focused — same pattern as Layout.js. The :focus-visible
  // rule in App.css gives it a visible outline when the keyboard user
  // tabs to it as the first focusable element on the page.
  skipLink: { position: 'absolute', left: -9999, top: 8, padding: '8px 12px', background: '#22d3ee', color: '#0b1220', textDecoration: 'none', borderRadius: 4, fontWeight: 700, zIndex: 100 },
  header: { borderBottom: '1px solid #1f2937', background: '#0f172a', position: 'sticky', top: 0, zIndex: 10 },
  headerInner: { maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' },
  brand: { fontWeight: 700, fontSize: 18, letterSpacing: 0.2, color: '#f59e0b', textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' },
  badge: { padding: '2px 8px', fontSize: 11, fontWeight: 600, borderRadius: 4, background: '#f59e0b', color: '#0b1220', textTransform: 'uppercase', letterSpacing: 0.6 },
  nav: { display: 'flex', gap: 4, flex: 1, minWidth: 0, flexWrap: 'wrap' },
  link: ({ isActive }) => ({
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 14,
    color: isActive ? '#0b1220' : '#cbd5e1',
    background: isActive ? '#f59e0b' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 400,
    whiteSpace: 'nowrap',
  }),
  groupBtn: (active) => ({
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 14,
    color: active ? '#0b1220' : '#cbd5e1',
    background: active ? '#f59e0b' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: active ? 600 : 400,
    whiteSpace: 'nowrap',
  }),
  groupMenu: { position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8, padding: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.35)', minWidth: 280, maxWidth: 360, zIndex: 100 },
  groupHeader: { padding: '6px 10px 8px', borderBottom: '1px solid #1f2937', marginBottom: 4 },
  groupTitle: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  groupBlurb: { fontSize: 11, color: '#64748b', marginTop: 4 },
  groupItem: ({ isActive }) => ({
    display: 'block',
    padding: '8px 10px',
    borderRadius: 6,
    color: isActive ? '#22d3ee' : '#cbd5e1',
    background: isActive ? '#1f2937' : 'transparent',
    textDecoration: 'none',
  }),
  groupItemLabel: { fontSize: 13, fontWeight: 600 },
  groupItemDesc: { fontSize: 11, color: '#94a3b8', marginTop: 2, lineHeight: 1.4 },
  publicLink: { padding: '6px 10px', borderRadius: 6, fontSize: 14, color: '#cbd5e1', textDecoration: 'none', border: '1px solid #334155', whiteSpace: 'nowrap' },
  logoutBtn: { padding: '6px 12px', fontSize: 14, color: '#fca5a5', background: 'transparent', border: '1px solid #7f1d1d', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' },
  main: { flex: 1, maxWidth: 1200, margin: '0 auto', padding: '32px 24px', width: '100%', boxSizing: 'border-box' },
  breadcrumb: { fontSize: 12, color: '#64748b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  crumbLink: { color: '#22d3ee', textDecoration: 'none' },
  crumbSep: { color: '#475569' },
  crumbCurrent: { color: '#cbd5e1' },

  loginShell: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1220', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  loginCard: { width: 360, padding: 32, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12 },
  loginTitle: { margin: 0, fontSize: 22, color: '#e5e7eb' },
  loginSub: { marginTop: 6, color: '#94a3b8', fontSize: 14 },
  input: { width: '100%', boxSizing: 'border-box', marginTop: 16, padding: '10px 12px', background: '#0b1220', border: '1px solid #334155', borderRadius: 6, color: '#e5e7eb', fontSize: 14 },
  loginBtn: { width: '100%', marginTop: 12, padding: '10px 12px', background: '#f59e0b', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  err: { marginTop: 10, fontSize: 13, color: '#fca5a5' },
  expiredBanner: { marginTop: 14, padding: '8px 12px', background: '#3a2a0d', border: '1px solid #92400e', borderRadius: 4, color: '#fbbf24', fontSize: 12, lineHeight: 1.5 },
};

// Helper: read the server-issued admin session blob. Returns null if
// missing, malformed, or expired.
function readStoredAdminSession() {
  try {
    const raw = localStorage.getItem('kua_admin_session');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem('kua_admin_session');
      return null;
    }
    return parsed;
  } catch { return null; }
}

function GroupMenu({ group }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const { pathname } = useLocation();
  const isActive = group.items.some(({ to }) => pathname === to || pathname.startsWith(to + '/'));

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
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
        style={styles.groupBtn(isActive)}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {group.label} ▾
      </button>
      {open && (
        <div style={styles.groupMenu} role="menu">
          <div style={styles.groupHeader}>
            <div style={styles.groupTitle}>{group.label}</div>
            <div style={styles.groupBlurb}>{group.blurb}</div>
          </div>
          {group.items.map(({ to, label, desc }) => (
            <NavLink key={to} to={to} style={styles.groupItem} role="menuitem">
              <div style={styles.groupItemLabel}>{label}</div>
              <div style={styles.groupItemDesc}>{desc}</div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

// Breadcrumb resolves the current path against NAV_GROUPS so every
// admin sub-page automatically shows "Admin › <Group> › <Page>"
// without each page having to declare it.
function Breadcrumb() {
  const { pathname } = useLocation();
  if (pathname === '/admin' || pathname === '/admin/') return null;
  for (const group of NAV_GROUPS) {
    const item = group.items.find(({ to }) => pathname === to || pathname.startsWith(to + '/'));
    if (item) {
      return (
        <div style={styles.breadcrumb}>
          <NavLink to="/admin" style={styles.crumbLink}>Admin</NavLink>
          <span style={styles.crumbSep}>›</span>
          <span style={styles.crumbCurrent}>{group.label}</span>
          <span style={styles.crumbSep}>›</span>
          <span style={styles.crumbCurrent}>{item.label}</span>
        </div>
      );
    }
  }
  return null;
}

function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => readStoredAdminSession() !== null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Move focus to <main> on route change so screen readers + keyboard
  // users get a fresh reading position. Mirrors the public Layout.
  useEffect(() => {
    if (mainRef.current) mainRef.current.focus({ preventScroll: true });
  }, [pathname]);

  // Sync document.title on route change. Walks the admin NAV_GROUPS
  // to find the matching item label; fall back to "Admin" so the tab
  // never goes back to the public-site title.
  useEffect(() => {
    let label = null;
    if (pathname === '/admin' || pathname === '/admin/') {
      label = 'Dashboard';
    } else {
      for (const group of NAV_GROUPS) {
        const item = group.items.find(({ to }) => pathname === to || pathname.startsWith(to + '/'));
        if (item) { label = item.label; break; }
      }
    }
    document.title = label
      ? `${label} · KUA Admin`
      : 'KUA Admin';
  }, [pathname]);
  // Banner shown when a previous session expired mid-use (adminFetch
  // detected a 401 and dispatched the event). Cleared as soon as the
  // user successfully logs in again.
  const [expiredNotice, setExpiredNotice] = useState(null);

  useEffect(() => {
    const onStorage = () => setIsLoggedIn(readStoredAdminSession() !== null);
    const onExpired = (e) => {
      setIsLoggedIn(false);
      setExpiredNotice(e?.detail?.reason || 'Your admin session expired. Please sign in again.');
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(ADMIN_AUTH_EXPIRED_EVENT, onExpired);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(ADMIN_AUTH_EXPIRED_EVENT, onExpired);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      let body = {};
      try { body = await r.json(); } catch {}
      if (!r.ok) {
        setError(body.error || `Login failed (HTTP ${r.status})`);
        setSubmitting(false);
        return;
      }
      localStorage.setItem('kua_admin_session', JSON.stringify(body));
      // Legacy flag — harmless on its own (no API trusts it as auth)
      // but kept for any in-flight callers still reading it.
      localStorage.setItem('adminLoggedIn', 'true');
      setIsLoggedIn(true);
      setError('');
      setPassword('');
      setExpiredNotice(null);
    } catch {
      setError('Network error contacting login endpoint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kua_admin_session');
    localStorage.removeItem('adminLoggedIn');
    setIsLoggedIn(false);
    navigate('/admin');
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginShell}>
        <form style={styles.loginCard} onSubmit={handleLogin}>
          <h1 style={styles.loginTitle}>Admin Portal</h1>
          <p style={styles.loginSub}>Enter the admin password to manage emissions data.</p>
          {expiredNotice && (
            <div style={styles.expiredBanner}>
              Session expired — please sign in again.
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Admin password"
            style={styles.input}
            autoFocus
            disabled={submitting}
          />
          <button type="submit" style={styles.loginBtn} disabled={submitting || !password}>
            {submitting ? 'Checking…' : 'Sign in'}
          </button>
          {error && <div role="alert" style={styles.err}>{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      <a href="#admin-main" style={styles.skipLink}>Skip to main content</a>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <NavLink to="/admin" style={styles.brand}>
            <span style={{ display: 'inline-flex', marginRight: 8, filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.35))' }}>
              <Icon.Leaf size={18} />
            </span>
            KUA Carbon <span style={styles.badge}>Admin</span>
          </NavLink>
          <nav style={styles.nav} aria-label="Admin">
            <NavLink to="/admin" end style={styles.link}>Dashboard</NavLink>
            {NAV_GROUPS.map((g) => <GroupMenu key={g.key} group={g} />)}
          </nav>
          <NavLink to="/" style={styles.publicLink}>Public site</NavLink>
          <button type="button" onClick={handleLogout} style={styles.logoutBtn}>Sign out</button>
        </div>
      </header>
      <main id="admin-main" ref={mainRef} tabIndex="-1" style={styles.main}>
        <Breadcrumb />
        <ErrorBoundary>
          {/* Re-mount on route change so the fade animation
              re-triggers — matches the public Layout. */}
          <div key={pathname} className="page-fade-in">
            <Outlet />
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default AdminLayout;
