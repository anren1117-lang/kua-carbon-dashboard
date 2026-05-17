import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// /unsubscribe?token=… — one-click landing for the "Unsubscribe" link
// in every alert email. Hits /api/alerts/unsubscribe-via-token with
// the token, shows a friendly confirmation. No login, no form to
// fill in — the user already approved this action by clicking the
// link in their inbox.

function readTokenFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

export default function Unsubscribe() {
  const [state, setState] = useState('pending'); // 'pending' | 'success' | 'invalid' | 'error'
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = readTokenFromUrl();
    if (!token) {
      setState('invalid');
      setError('No token in the URL. Open this page from the link inside an alert email.');
      return;
    }
    (async () => {
      try {
        const r = await fetch('/api/alerts/unsubscribe-via-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const body = await r.json().catch(() => ({}));
        if (r.ok) {
          setState('success');
          setEmail(body.email);
        } else if (r.status === 400) {
          setState('invalid');
          setError(body.error === 'signature_mismatch' || body.error === 'malformed_token'
            ? 'This unsubscribe link doesn\'t look valid. It may have been mistyped or modified.'
            : `Could not unsubscribe: ${body.error}`);
        } else {
          setState('error');
          setError(`HTTP ${r.status}`);
        }
      } catch (err) {
        setState('error');
        setError(err?.message || 'Network error');
      }
    })();
  }, []);

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {state === 'pending' && (
          <>
            <div style={styles.icon}>📬</div>
            <h1 style={styles.title}>Unsubscribing…</h1>
            <p style={styles.subtitle}>One moment.</p>
          </>
        )}
        {state === 'success' && (
          <>
            <div style={{ ...styles.icon, color: '#86efac' }}>✓</div>
            <h1 style={styles.title}>You've been unsubscribed</h1>
            <p style={styles.subtitle}>
              <strong>{email}</strong> will no longer receive KUA Dashboard alert emails.
              Changed your mind? An admin can add the address back at <Link to="/admin/alerts" style={styles.link}>/admin/alerts</Link>.
            </p>
          </>
        )}
        {state === 'invalid' && (
          <>
            <div style={{ ...styles.icon, color: '#fbbf24' }}>⚠</div>
            <h1 style={styles.title}>Invalid unsubscribe link</h1>
            <p style={styles.subtitle}>{error}</p>
          </>
        )}
        {state === 'error' && (
          <>
            <div style={{ ...styles.icon, color: '#fca5a5' }}>✕</div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.subtitle}>
              {error || 'Couldn\'t reach the server.'} Try reloading, or contact the school to be removed manually.
            </p>
          </>
        )}
        <div style={styles.footer}>
          <Link to="/" style={styles.linkBold}>Go to the dashboard →</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    maxWidth: 520,
    width: '100%',
    padding: 36,
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 12,
    textAlign: 'center',
  },
  icon: { fontSize: 42, marginBottom: 16, color: '#cbd5e1' },
  title: { fontSize: 24, color: '#e5e7eb', fontWeight: 800, margin: 0 },
  subtitle: { marginTop: 14, fontSize: 14, color: '#94a3b8', lineHeight: 1.7 },
  footer: { marginTop: 28, paddingTop: 18, borderTop: '1px solid #1f2937' },
  link: { color: '#22d3ee', textDecoration: 'none' },
  linkBold: { color: '#22d3ee', textDecoration: 'none', fontSize: 13, fontWeight: 700 },
};
