import React, { useEffect, useState, useCallback } from 'react';
import { ModulePage, ModuleSection, Pill } from '../../components/ModuleShell.js';
import { adminFetch } from '../../utils/adminFetch.js';

// /admin/alerts — manage which addresses get notified when the
// dashboard detects something genuinely unusual (stale data tables,
// dead meters, anomalous readings). The auto-detection + cron lives
// in /api/cron/check-alerts (Phase 222). This page is the human
// surface: who's on the list, who's off, and a "send test alert"
// button to confirm Resend is wired up.

export default function AdminAlerts() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [email, setEmail]             = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [flash, setFlash]             = useState(null);
  const [testResult, setTestResult]   = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await adminFetch('/api/alerts/subscribers');
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.error || `HTTP ${r.status}`);
      setSubscribers(body.subscribers || []);
    } catch (err) {
      setError(err.message || 'Could not load subscribers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function onAdd(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setFlash(null);
    try {
      const r = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.error || `HTTP ${r.status}`);
      setFlash({ kind: 'good', text: `Added ${body.email}. They'll be emailed when the dashboard detects something unusual.` });
      setEmail('');
      await refresh();
    } catch (err) {
      setFlash({ kind: 'warn', text: `Could not add: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  }

  async function onRemove(target) {
    if (!window.confirm(`Remove ${target} from alert notifications?`)) return;
    try {
      const r = await fetch('/api/alerts/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: target }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${r.status}`);
      }
      setFlash({ kind: 'good', text: `Removed ${target}.` });
      await refresh();
    } catch (err) {
      setFlash({ kind: 'warn', text: `Could not remove: ${err.message}` });
    }
  }

  async function onSendTest() {
    setTestResult(null);
    try {
      const r = await adminFetch('/api/alerts/subscribers', { method: 'POST' });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.error || `HTTP ${r.status}`);
      setTestResult(body);
    } catch (err) {
      setTestResult({ error: err.message });
    }
  }

  return (
    <ModulePage
      title="Alert notifications"
      subtitle="When the dashboard detects something genuinely unusual — a stale data table, a dead meter, an anomalous reading — these addresses get a short email explaining what happened and what to check. Real alerts only; the cron only fires when a deterministic rule trips."
    >
      <ModuleSection title="Subscribed addresses" hint="Anyone on this list gets emailed on a detected alert. Add the school's sustainability contact, facilities lead, or anyone else who should know.">
        <form onSubmit={onAdd} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="someone@school.edu"
            required
            style={styles.input}
            disabled={submitting}
            autoComplete="email"
          />
          <button type="submit" disabled={submitting || !email.trim()} style={styles.addBtn}>
            {submitting ? 'Adding…' : '+ Add subscriber'}
          </button>
        </form>

        {flash && (
          <div role="status" style={{ ...styles.flash, ...(flash.kind === 'warn' ? styles.flashWarn : styles.flashGood) }}>
            {flash.text}
          </div>
        )}

        {loading && <div style={styles.loading}>Loading…</div>}
        {error && <div role="alert" style={styles.error}>{error}</div>}

        {!loading && !error && subscribers.length === 0 && (
          <div style={styles.empty}>No subscribers yet. Add an address above.</div>
        )}

        {subscribers.length > 0 && (
          <ul style={styles.list}>
            {subscribers.map((s) => (
              <li key={s.email} style={styles.li}>
                <div style={styles.liMain}>
                  <span style={styles.email}>{s.email}</span>
                  <span style={styles.added}>added {new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
                <button type="button" onClick={() => onRemove(s.email)} style={styles.removeBtn}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </ModuleSection>

      <ModuleSection title="Send a test alert" hint="Fires a sample email to every subscriber so you can confirm the delivery pipeline (Resend) is wired up before real alerts start arriving.">
        <button type="button" onClick={onSendTest} disabled={subscribers.length === 0} style={styles.testBtn}>
          ✉ Send test alert now
        </button>
        {testResult && (
          <div style={styles.testResult}>
            {testResult.error ? (
              <span style={{ color: '#fca5a5' }}>Error: {testResult.error}</span>
            ) : (
              <>
                <div style={{ marginBottom: 6 }}>
                  Attempted: <strong>{testResult.attempted}</strong> ·
                  {' '}Delivered: <strong>{testResult.sent}</strong>
                </div>
                {testResult.noProvider && (
                  <div style={{ color: '#fcd34d', fontSize: 12, marginTop: 8 }}>
                    ⚠ RESEND_API_KEY is not set on this deploy. The send was logged to the
                    server console instead. To enable real email delivery, set
                    RESEND_API_KEY in your Vercel project environment.
                  </div>
                )}
                <details style={{ marginTop: 10, fontSize: 12 }}>
                  <summary style={{ cursor: 'pointer', color: '#94a3b8' }}>Per-recipient result</summary>
                  <ul style={{ margin: '8px 0 0', paddingLeft: 20, color: '#cbd5e1' }}>
                    {testResult.results.map((r) => (
                      <li key={r.email}>
                        {r.email} — {r.sent ? <Pill kind="good">delivered</Pill> : <Pill kind="warn">{r.reason}</Pill>}
                      </li>
                    ))}
                  </ul>
                </details>
              </>
            )}
          </div>
        )}
      </ModuleSection>

      <ModuleSection title="What triggers an alert?" hint="The detection logic ships in Phase 222 — until then, only the manual test send fires email. These are the deterministic rules that will run on the daily cron:">
        <ul style={styles.bullets}>
          <li><strong>Stale data table</strong> — when an admin table (heating oil deliveries, fuel bills, meter readings) hasn't been updated past its expected cadence (e.g. nothing in 60+ days during heating season).</li>
          <li><strong>Dead meter</strong> — when a meter that should report hourly has gone silent for 3+ days.</li>
          <li><strong>Anomalous reading</strong> — when a building's electricity spikes more than 3 standard deviations from its own history.</li>
        </ul>
        <p style={styles.note}>
          Only deterministic rules — no LLM-judgment alerts that could fire on noise. The
          email body is composed cleanly so you see <em>what</em> happened, <em>where</em>,
          and <em>what to check</em>, not just "something is wrong."
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  form:        { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  input:       { flex: 1, minWidth: 260, padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 14, fontFamily: 'inherit' },
  addBtn:      { padding: '10px 16px', background: '#0e3a1f', color: '#86efac', border: '1px solid #16a34a', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  flash:       { marginBottom: 14, padding: '8px 12px', borderRadius: 6, fontSize: 13 },
  flashGood:   { background: '#052e16', border: '1px solid #14532d', color: '#86efac' },
  flashWarn:   { background: '#3a0d12', border: '1px solid #7f1d1d', color: '#fca5a5' },
  loading:     { padding: '20px 0', color: '#94a3b8', fontSize: 13 },
  error:       { padding: '10px 14px', background: '#3a0d12', border: '1px solid #7f1d1d', borderRadius: 6, color: '#fca5a5', fontSize: 13, marginBottom: 12 },
  empty:       { padding: '14px 0', color: '#64748b', fontSize: 13, fontStyle: 'italic' },
  list:        { listStyle: 'none', padding: 0, margin: 0 },
  li:          { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1f2937', gap: 12 },
  liMain:      { display: 'flex', flexDirection: 'column', gap: 2 },
  email:       { fontSize: 14, color: '#e5e7eb', fontWeight: 600 },
  added:       { fontSize: 11, color: '#64748b' },
  removeBtn:   { padding: '6px 10px', background: 'transparent', color: '#fca5a5', border: '1px solid #7f1d1d', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  testBtn:     { padding: '10px 16px', background: '#0e3a5f', color: '#22d3ee', border: '1px solid #22d3ee', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  testResult:  { marginTop: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#cbd5e1', fontSize: 13 },
  bullets:     { margin: 0, paddingLeft: 20, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 },
  note:        { marginTop: 12, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 },
};
