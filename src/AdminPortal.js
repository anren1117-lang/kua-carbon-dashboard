import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === 'KUA2026') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <div style={styles.logo}><span style={styles.logoText}>KUA</span></div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>Enter password to access</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} style={styles.loginBtn}>Login</button>
          {error && <p style={styles.error}>{error}</p>}
          <Link to="/" style={styles.backLink}>← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}><span style={styles.logoText}>KUA</span></div>
        <h1 style={styles.title}>Admin Portal</h1>
        <p style={styles.subtitle}>Select a section to manage data</p>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </header>

      <div style={styles.menuGrid}>
        <Link to="/admin/fuel" style={styles.menuCard}>
          <span style={styles.menuIcon}>⛽</span>
          <h2 style={styles.menuTitle}>Fuel Bills</h2>
          <p style={styles.menuDesc}>Propane, heating oil, diesel</p>
        </Link>

        <Link to="/admin/students" style={styles.menuCard}>
          <span style={styles.menuIcon}>🎓</span>
          <h2 style={styles.menuTitle}>Students</h2>
          <p style={styles.menuDesc}>Day, boarding, international</p>
        </Link>

        <Link to="/admin/travel" style={styles.menuCard}>
          <span style={styles.menuIcon}>✈️</span>
          <h2 style={styles.menuTitle}>Travel</h2>
          <p style={styles.menuDesc}>Study abroad, faculty trips</p>
        </Link>

        <Link to="/admin/waste" style={styles.menuCard}>
          <span style={styles.menuIcon}>🗑️</span>
          <h2 style={styles.menuTitle}>Waste</h2>
          <p style={styles.menuDesc}>Landfill, recycling, compost</p>
        </Link>
      </div>

      <footer style={styles.footer}>
        <Link to="/" style={styles.backLink}>← Back to Dashboard</Link>
      </footer>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px', fontFamily: 'Arial', color: 'white' },
  loginBox: { maxWidth: '400px', margin: '100px auto', textAlign: 'center', backgroundColor: '#1e293b', padding: '40px', borderRadius: '16px' },
  header: { textAlign: 'center', marginBottom: '40px', position: 'relative' },
  logo: { width: '60px', height: '60px', backgroundColor: '#b91c1c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' },
  logoText: { color: 'white', fontWeight: 'bold', fontSize: '1.2rem' },
  title: { fontSize: '2rem', color: '#22c55e', marginBottom: '10px' },
  subtitle: { fontSize: '1rem', color: '#94a3b8' },
  logoutBtn: { position: 'absolute', top: '0', right: '20px', padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '1rem', marginBottom: '15px', boxSizing: 'border-box' },
  loginBtn: { width: '100%', padding: '12px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', marginBottom: '20px' },
  error: { color: '#ef4444', marginBottom: '15px' },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto' },
  menuCard: { backgroundColor: '#1e293b', borderRadius: '16px', padding: '30px', textAlign: 'center', textDecoration: 'none', color: 'white', transition: 'transform 0.2s, background-color 0.2s', cursor: 'pointer', border: '2px solid transparent' },
  menuIcon: { fontSize: '3rem', marginBottom: '15px', display: 'block' },
  menuTitle: { fontSize: '1.3rem', color: '#22c55e', marginBottom: '10px' },
  menuDesc: { fontSize: '0.9rem', color: '#94a3b8', margin: 0 },
  footer: { textAlign: 'center', marginTop: '40px' },
  backLink: { color: '#22c55e', textDecoration: 'none', fontSize: '1rem' }
};

export default AdminPortal;
