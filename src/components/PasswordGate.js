import React, { useState, useEffect } from 'react';

// Reusable password gate. Wraps any subtree; renders the children only
// after the user enters the right password. The check is client-side
// (the password compares against import.meta.env.VITE_<envKey>), and
// the unlock is stored in localStorage under storageKey so it
// persists across refreshes.
//
// IMPORTANT: this is NOT a real auth boundary. Anyone who pulls the
// JS bundle can read the password value. Real protection of
// sensitive data must happen on the server (the Vercel API handlers
// already enforce CRON_SECRET / Google OIDC for the routes that
// matter). This gate exists to keep casual visitors out of the
// teacher / admin UIs.

/**
 * @param {object} props
 * @param {string} props.title          Heading shown on the gate screen
 * @param {string} props.subtitle       Friendly explanation
 * @param {string} props.envKey         Env variable name (without the VITE_ prefix). e.g. "TEACHER_PASSWORD"
 * @param {string} props.storageKey     localStorage key recording the unlock
 * @param {string=} props.defaultPassword Fallback password used when env is unset (dev only)
 * @param {string=} props.accent        Hex color for the unlock button
 * @param {React.ReactNode} props.children
 */
export function PasswordGate({ title, subtitle, envKey, storageKey, defaultPassword, accent = '#22d3ee', children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Accept either 'true' (matches the existing AdminLayout convention)
      // or 'unlocked' (older PasswordGate convention) so a single admin
      // login covers both /admin/* and any PasswordGate-wrapped page.
      const v = localStorage.getItem(storageKey);
      if (v === 'true' || v === 'unlocked') setUnlocked(true);
    } catch {}
  }, [storageKey]);

  function expectedPassword() {
    try {
      const v = import.meta.env[`VITE_${envKey}`];
      if (typeof v === 'string' && v.length > 0) return v;
    } catch {}
    return defaultPassword || '';
  }

  function tryUnlock(e) {
    e.preventDefault();
    if (pw === expectedPassword()) {
      // Write 'true' to match the existing AdminLayout convention so
      // shared keys (e.g. 'adminLoggedIn') keep both gates in sync.
      try { localStorage.setItem(storageKey, 'true'); } catch {}
      setUnlocked(true);
      setError(null);
    } else {
      setError('Incorrect password.');
    }
  }

  function logout() {
    try { localStorage.removeItem(storageKey); } catch {}
    setUnlocked(false);
    setPw('');
  }

  if (!unlocked) {
    return (
      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={{ ...styles.lock, color: accent }} aria-hidden="true">🔒</div>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>{subtitle}</p>
          <form onSubmit={tryUnlock} style={styles.form}>
            <label htmlFor="pw" style={styles.label}>Password</label>
            <input
              id="pw"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              style={styles.input}
              autoComplete="current-password"
              autoFocus
            />
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" style={{ ...styles.submit, background: accent }} disabled={!pw}>
              Unlock
            </button>
          </form>
          <p style={styles.note}>
            This gate keeps casual visitors out of the {title.toLowerCase()}.
            Sensitive operations on this site (cron, auth, BMS sync) are protected
            server-side regardless of this client check.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.bannerBar}>
        <span style={styles.bannerText}>{title}</span>
        <button type="button" onClick={logout} style={styles.logout} aria-label={`Sign out of ${title}`}>
          Sign out
        </button>
      </div>
      {children}
    </div>
  );
}

const styles = {
  wrap: { minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { maxWidth: 460, width: '100%', padding: 32, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12 },
  lock: { fontSize: 36, marginBottom: 12 },
  title: { fontSize: 24, color: '#e5e7eb', margin: 0, fontWeight: 800 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 },
  form: { marginTop: 18 },
  label: { display: 'block', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 },
  input: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 14, fontFamily: 'inherit' },
  error: { marginTop: 10, padding: '6px 10px', background: '#3a0d12', border: '1px solid #7f1d1d', borderRadius: 4, color: '#fca5a5', fontSize: 12 },
  submit: { marginTop: 14, width: '100%', padding: '10px 16px', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  note: { marginTop: 16, fontSize: 11, color: '#64748b', lineHeight: 1.6 },

  bannerBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', background: '#0f172a', borderBottom: '1px solid #1f2937', maxWidth: 1200, margin: '-32px auto 24px', borderRadius: 0 },
  bannerText: { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 },
  logout: { padding: '4px 10px', background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', borderRadius: 4, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
};
