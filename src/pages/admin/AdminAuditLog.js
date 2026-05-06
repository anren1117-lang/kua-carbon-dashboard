import React, { useEffect, useState } from 'react';
import { fetchAuditLog } from '../../utils/adminAudit.js';

// /admin/audit-log — read-only viewer over admin_audit_log.
//
// Pulls the most recent N rows via /api/admin/audit-log GET, with an
// optional table filter. Renders as a compact table with the JSON
// payload behind a click-to-expand so the page doesn't get noisy.
//
// Used by AASHE STARS reviewers + admins debugging a "who changed
// this row" question.

const PAGE_SIZE_OPTIONS = [20, 50, 100, 200];
const TABLE_FILTERS = [
  { value: '', label: 'All tables' },
  { value: 'fuel_bills', label: 'fuel_bills' },
  { value: 'day_students', label: 'day_students' },
  { value: 'us_boarding_students', label: 'us_boarding_students' },
  { value: 'international_students', label: 'international_students' },
  { value: 'study_abroad', label: 'study_abroad' },
  { value: 'faculty_travel', label: 'faculty_travel' },
  { value: 'waste', label: 'waste' },
  { value: 'scope1_fleet_records', label: 'scope1_fleet_records' },
  { value: 'scope1_refrigerant_logs', label: 'scope1_refrigerant_logs' },
];

export default function AdminAuditLog() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const [tableFilter, setTableFilter] = useState('');
  const [expanded, setExpanded] = useState(null); // row id

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAuditLog({ limit, table: tableFilter || undefined }).then(({ rows, error }) => {
      if (cancelled) return;
      setRows(rows);
      setError(error);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [limit, tableFilter]);

  const actionColor = {
    insert: '#86efac',
    update: '#fbbf24',
    delete: '#fca5a5',
  };

  return (
    <div>
      <h1 style={styles.title}>Audit Log</h1>
      <p style={styles.subtitle}>
        Every admin write recorded for accreditation reporting (AASHE STARS) and debugging.
        Logs flow from the AdminPortal Supabase writes via <code>/api/admin/audit-log</code>.
      </p>

      <div style={styles.controls}>
        <label style={styles.controlLabel}>
          Show
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            style={styles.select}
          >
            {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          rows
        </label>
        <label style={styles.controlLabel}>
          Table
          <select
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            style={styles.select}
          >
            {TABLE_FILTERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
      </div>

      {loading && <div style={styles.placeholder}>Loading…</div>}
      {error && <div style={styles.error}>{error}</div>}
      {!loading && !error && rows.length === 0 && (
        <div style={styles.placeholder}>
          No audit entries yet. Every insert / delete on the canonical admin tables
          will surface here once the migration ships and admins start entering data.
        </div>
      )}

      {rows.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Table</th>
              <th style={styles.th}>Note</th>
              <th style={styles.th}>Payload</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isOpen = expanded === row.id;
              return (
                <React.Fragment key={row.id}>
                  <tr>
                    <td style={styles.tdMono}>{formatDate(row.created_at)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.actionPill, color: actionColor[row.action] || '#94a3b8' }}>
                        {row.action}
                      </span>
                    </td>
                    <td style={styles.tdMono}>{row.table_name}</td>
                    <td style={styles.td}>{row.note || <span style={styles.muted}>—</span>}</td>
                    <td style={styles.td}>
                      {row.payload ? (
                        <button
                          type="button"
                          style={styles.expandBtn}
                          onClick={() => setExpanded(isOpen ? null : row.id)}
                        >
                          {isOpen ? 'Hide' : 'Show'} payload
                        </button>
                      ) : <span style={styles.muted}>—</span>}
                    </td>
                  </tr>
                  {isOpen && row.payload && (
                    <tr>
                      <td colSpan={5} style={styles.payloadCell}>
                        <pre style={styles.payload}>{JSON.stringify(row.payload, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  // YYYY-MM-DD HH:MM:SS in UTC; admins reading the log generally want
  // the same timestamp the server saw, not their local time.
  return d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

const styles = {
  title:    { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760, lineHeight: 1.6 },

  controls: { marginTop: 24, display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' },
  controlLabel: { display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  select: { padding: '6px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 13, marginLeft: 4, marginRight: 4 },

  placeholder: { marginTop: 24, padding: 32, background: '#0f172a', border: '1px dashed #334155', borderRadius: 12, textAlign: 'center', color: '#94a3b8' },
  error: { marginTop: 18, padding: '10px 14px', background: '#3a0d12', border: '1px solid #7f1d1d', borderRadius: 6, color: '#fca5a5', fontSize: 13 },

  table: { width: '100%', marginTop: 18, borderCollapse: 'collapse', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, overflow: 'hidden' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '10px 12px', fontSize: 13, color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  tdMono: { padding: '10px 12px', fontSize: 12, fontFamily: 'ui-monospace, monospace', color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },

  actionPill: { fontSize: 11, padding: '2px 8px', background: '#0b1220', border: '1px solid #334155', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 },
  expandBtn: { fontSize: 11, padding: '4px 10px', background: 'transparent', border: '1px solid #334155', borderRadius: 4, color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit' },
  muted: { color: '#475569' },

  payloadCell: { padding: 0, background: '#0b1220', borderBottom: '1px solid #1f2937' },
  payload: { margin: 0, padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, overflow: 'auto' },
};
