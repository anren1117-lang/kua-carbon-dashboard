import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/framework', label: 'Framework' },
  { to: '/admin/ai-ingestion', label: 'AI Agent' },
  { to: '/admin/scope-1', label: 'Scope 1' },
  { to: '/admin/scope-2', label: 'Scope 2' },
  { to: '/admin/scope-3', label: 'Scope 3' },
  { to: '/admin/renewables', label: 'Renewables' },
  { to: '/admin/sinks', label: 'Sinks' },
  { to: '/admin/methodology', label: 'Methodology' },
  { to: '/admin/legacy', label: 'Legacy Portal' },
];

const styles = {
  shell: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0b1220', color: '#e5e7eb' },
  header: { borderBottom: '1px solid #1f2937', background: '#0f172a', position: 'sticky', top: 0, zIndex: 10 },
  headerInner: { maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' },
  brand: { fontWeight: 700, fontSize: 18, letterSpacing: 0.2, color: '#f59e0b', textDecoration: 'none' },
  badge: { padding: '2px 8px', fontSize: 11, fontWeight: 600, borderRadius: 4, background: '#f59e0b', color: '#0b1220', textTransform: 'uppercase', letterSpacing: 0.6 },
  nav: { display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1 },
  link: ({ isActive }) => ({
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 14,
    color: isActive ? '#0b1220' : '#cbd5e1',
    background: isActive ? '#f59e0b' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 400,
  }),
  publicLink: { padding: '6px 10px', borderRadius: 6, fontSize: 14, color: '#cbd5e1', textDecoration: 'none', border: '1px solid #334155' },
  logoutBtn: { padding: '6px 12px', fontSize: 14, color: '#fca5a5', background: 'transparent', border: '1px solid #7f1d1d', borderRadius: 6, cursor: 'pointer' },
  main: { flex: 1, maxWidth: 1200, margin: '0 auto', padding: '32px 24px', width: '100%', boxSizing: 'border-box' },
  loginShell: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1220', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  loginCard: { width: 360, padding: 32, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12 },
  loginTitle: { margin: 0, fontSize: 22, color: '#e5e7eb' },
  loginSub: { marginTop: 6, color: '#94a3b8', fontSize: 14 },
  input: { width: '100%', boxSizing: 'border-box', marginTop: 16, padding: '10px 12px', background: '#0b1220', border: '1px solid #334155', borderRadius: 6, color: '#e5e7eb', fontSize: 14 },
  loginBtn: { width: '100%', marginTop: 12, padding: '10px 12px', background: '#f59e0b', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  err: { marginTop: 10, fontSize: 13, color: '#fca5a5' },
};

const ADMIN_PASSWORD = 'KUA2026';

function AdminLayout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('adminLoggedIn') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const onStorage = () => setIsLoggedIn(localStorage.getItem('adminLoggedIn') === 'true');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true');
      setIsLoggedIn(true);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.loginBtn}>Sign in</button>
          {error && <div style={styles.err}>{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <NavLink to="/admin" style={styles.brand}>
            KUA Carbon <span style={styles.badge}>Admin</span>
          </NavLink>
          <nav style={styles.nav}>
            {navItems.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} style={styles.link}>
                {label}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/" style={styles.publicLink}>Public site</NavLink>
          <button type="button" onClick={handleLogout} style={styles.logoutBtn}>Sign out</button>
        </div>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
