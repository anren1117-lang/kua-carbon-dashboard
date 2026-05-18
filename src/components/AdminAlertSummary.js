import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../utils/adminFetch.js';

// Inline summary of currently-firing alerts, shown on AdminHome.
// Calls /api/admin/alerts-preview on mount and renders one of:
//   - nothing while loading (no flash)
//   - nothing if 0 alerts (don't add noise when all is well)
//   - red/amber banner with count + top 3 alerts + link to /admin/alerts
//
// Same evaluator the daily cron uses, so what an admin sees here is
// exactly what would email the school. Cheap to compute (a few
// Supabase round-trips, no LLM), so safe to fire every page load.

export function AdminAlertSummary() {
  const [alerts, setAlerts] = useState(null);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await adminFetch('/api/admin/alerts-preview', { method: 'POST' });
        const body = await r.json().catch(() => ({}));
        if (cancelled) return;
        if (!r.ok) { setError(body.error || `HTTP ${r.status}`); setAlerts([]); }
        else setAlerts(body.alerts || []);
      } catch (err) {
        if (!cancelled) { setError(err?.message || 'fetch failed'); setAlerts([]); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Quiet hide while loading + on error + when nothing is wrong.
  // AdminHome already has the FreshnessAlert banner; we only add a
  // separate banner when the evaluator finds a genuine alert event.
  if (alerts === null) return null;
  if (error) return null;
  if (alerts.length === 0) return null;

  const highCount = alerts.filter((a) => a.severity === 'high').length;
  const accent = highCount > 0 ? '#dc2626' : '#d97706';
  const accentBg = highCount > 0 ? '#3a0d12' : '#3a2a0e';
  const accentText = highCount > 0 ? '#fca5a5' : '#fcd34d';

  return (
    <div style={{ ...styles.banner, background: accentBg, borderColor: accent }} className="kua-card-hover">
      <div style={styles.head}>
        <span style={{ ...styles.icon, color: accent }} aria-hidden="true">⚠</span>
        <div style={{ flex: 1 }}>
          <div style={{ ...styles.title, color: accentText }}>
            {alerts.length} alert{alerts.length === 1 ? '' : 's'} would email subscribers right now
          </div>
          <div style={styles.subtitle}>
            {highCount > 0 ? `${highCount} high-severity · ` : ''}
            The next cron run will email anyone subscribed at <Link to="/admin/alerts" style={styles.linkInline}>/admin/alerts</Link>.
          </div>
        </div>
        <Link to="/admin/alerts" style={{ ...styles.cta, borderColor: accent, color: accentText }}>
          Manage →
        </Link>
      </div>
      <ul style={styles.alertList}>
        {alerts.slice(0, 3).map((a) => (
          <li key={a.id} style={styles.alertItem}>
            <span style={{ ...styles.severity, color: a.severity === 'high' ? '#fca5a5' : '#fcd34d' }}>
              {a.severity}
            </span>
            <span style={styles.alertTitle}>{a.title}</span>
          </li>
        ))}
        {alerts.length > 3 && (
          <li style={{ ...styles.alertItem, color: '#94a3b8', fontStyle: 'italic' }}>
            + {alerts.length - 3} more — see /admin/alerts
          </li>
        )}
      </ul>
    </div>
  );
}

const styles = {
  banner: {
    margin: '16px auto',
    maxWidth: 1100,
    padding: '14px 18px',
    border: '1px solid',
    borderLeftWidth: 4,
    borderRadius: 8,
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  icon: { fontSize: 22 },
  title: { fontSize: 15, fontWeight: 700 },
  subtitle: { fontSize: 12, color: '#cbd5e1', marginTop: 2 },
  cta: {
    padding: '6px 12px',
    background: 'transparent',
    border: '1px solid',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    textDecoration: 'none',
  },
  linkInline: { color: '#7dd3fc', textDecoration: 'none' },
  alertList: { margin: '12px 0 0', padding: 0, listStyle: 'none' },
  alertItem: { padding: '4px 0', fontSize: 13, color: '#e5e7eb', display: 'flex', gap: 10, alignItems: 'baseline' },
  severity: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, minWidth: 50 },
  alertTitle: { flex: 1 },
};
