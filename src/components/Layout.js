import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/scope-1', label: 'Scope 1' },
  { to: '/scope-2', label: 'Scope 2' },
  { to: '/scope-3', label: 'Scope 3' },
  { to: '/renewables', label: 'Renewables' },
  { to: '/sinks', label: 'Sinks' },
  { to: '/scenarios', label: 'Scenarios' },
  { to: '/methodology', label: 'Methodology' },
];

const styles = {
  shell: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0b1220', color: '#e5e7eb' },
  header: { borderBottom: '1px solid #1f2937', background: '#0f172a', position: 'sticky', top: 0, zIndex: 10 },
  headerInner: { maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' },
  brand: { fontWeight: 700, fontSize: 18, letterSpacing: 0.2, color: '#22d3ee', textDecoration: 'none' },
  nav: { display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1 },
  link: ({ isActive }) => ({
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 14,
    color: isActive ? '#0b1220' : '#cbd5e1',
    background: isActive ? '#22d3ee' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 400,
  }),
  adminLink: { padding: '6px 10px', borderRadius: 6, fontSize: 14, color: '#cbd5e1', textDecoration: 'none', border: '1px solid #334155' },
  main: { flex: 1, maxWidth: 1200, margin: '0 auto', padding: '32px 24px', width: '100%', boxSizing: 'border-box' },
  footer: { borderTop: '1px solid #1f2937', padding: '20px 24px', textAlign: 'center', fontSize: 12, color: '#64748b' },
};

function Layout() {
  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <NavLink to="/" style={styles.brand}>KUA Carbon</NavLink>
          <nav style={styles.nav}>
            {navItems.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} style={styles.link}>
                {label}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/admin" style={styles.adminLink}>Admin</NavLink>
        </div>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
      <footer style={styles.footer}>
        Kimball Union Academy · Net Carbon Dashboard · methodology and source code public on GitHub
      </footer>
    </div>
  );
}

export default Layout;
