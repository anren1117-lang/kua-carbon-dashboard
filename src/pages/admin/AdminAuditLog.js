import React, { useEffect, useState } from 'react';
import { fetchAuditLog, fetchAllAuditLog } from '../../utils/adminAudit.js';
import { toCsv, downloadCsv } from '../../utils/csv.js';

// /admin/audit-log — read-only viewer over admin_audit_log.
//
// Pulls the most recent N rows via /api/admin/audit-log GET, with an
// optional table filter. Renders as a compact table with the JSON
// payload behind a click-to-expand so the page doesn't get noisy.
//
// Used by AASHE STARS reviewers + admins debugging a "who changed
// this row" question.

const PAGE_SIZE_OPTIONS = [20, 50, 100, 500];
// Filter options match every table the live measured-data hooks read
// from. If admin writes ever touch a new table, add it here so the
// reviewer can scope the audit log to it.
const TABLE_FILTERS = [
  { value: '', label: 'All tables' },
  // Scope 1
  { value: 'fuel_bills', label: 'fuel_bills' },
  { value: 'scope1_heating_oil', label: 'scope1_heating_oil' },
  { value: 'scope1_propane', label: 'scope1_propane' },
  { value: 'scope1_fleet', label: 'scope1_fleet' },
  { value: 'scope1_refrigerants', label: 'scope1_refrigerants' },
  // Scope 3
  { value: 'day_students', label: 'day_students' },
  { value: 'us_boarding_students', label: 'us_boarding_students' },
  { value: 'international_students', label: 'international_students' },
  { value: 'study_abroad', label: 'study_abroad' },
  { value: 'faculty_travel', label: 'faculty_travel' },
  { value: 'waste', label: 'waste' },
  { value: 'purchased_goods', label: 'purchased_goods' },
  { value: 'commuting', label: 'commuting' },
  // Sinks
  { value: 'forest_stand_actuals', label: 'forest_stand_actuals' },
];

export default function AdminAuditLog() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [tableFilter, setTableFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expanded, setExpanded] = useState(null); // row id
  // Bumping `refreshTick` re-runs the fetch effect — used by the
  // manual "Refresh" button so admins can pull the latest entries
  // after a write in another tab without leaving the page.
  const [refreshTick, setRefreshTick] = useState(0);
  // "Export all" button state. While exporting, `exporting` reflects
  // the current page progress (e.g. "Exporting 1500 of 4200…").
  const [exporting, setExporting] = useState(null); // null | { fetched: number, total: number|null }

  // Reset offset whenever a filter changes — otherwise we'd skip into
  // empty territory of the new result set.
  useEffect(() => { setOffset(0); }, [tableFilter, dateFrom, dateTo, limit]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAuditLog({
      limit,
      offset,
      table: tableFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }).then(({ rows, total, error }) => {
      if (cancelled) return;
      setRows(rows);
      setTotal(total);
      setError(error);
      setLoading(false);
      // Drop the expanded-payload state if the row in question is no
      // longer in the new result set — avoids "expanded id points at
      // ghost row" after pagination / filter changes.
      setExpanded((prev) => (prev && rows.some((r) => r.id === prev) ? prev : null));
    });
    return () => { cancelled = true; };
  }, [limit, offset, tableFilter, dateFrom, dateTo, refreshTick]);

  const page = Math.floor(offset / limit) + 1;
  const lastPage = total !== null ? Math.max(1, Math.ceil(total / limit)) : null;
  const hasPrev = offset > 0;
  const hasNext = total !== null
    ? offset + limit < total
    : rows.length === limit; // optimistic when total unknown

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
        <label style={styles.controlLabel}>
          From
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={styles.dateInput}
          />
        </label>
        <label style={styles.controlLabel}>
          To
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={styles.dateInput}
          />
        </label>
        {(dateFrom || dateTo || tableFilter) && (
          <button
            type="button"
            style={styles.clearBtn}
            onClick={() => { setTableFilter(''); setDateFrom(''); setDateTo(''); }}
          >
            Clear filters
          </button>
        )}
        <button
          type="button"
          style={styles.refreshBtn}
          onClick={() => setRefreshTick((n) => n + 1)}
          disabled={loading}
        >
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
        <button
          type="button"
          style={styles.csvBtn}
          onClick={() => downloadAuditCsv(rows, { tableFilter, dateFrom, dateTo, scope: 'page' })}
          disabled={loading || rows.length === 0 || exporting !== null}
          title={rows.length === 0 ? 'Nothing to export' : `Download ${rows.length} visible row${rows.length === 1 ? '' : 's'} as CSV`}
        >
          ↓ Export page
        </button>
        <button
          type="button"
          style={styles.csvBtn}
          onClick={async () => {
            if (exporting !== null) return;
            setExporting({ fetched: 0, total });
            const result = await fetchAllAuditLog({
              table: tableFilter || undefined,
              dateFrom: dateFrom || undefined,
              dateTo: dateTo || undefined,
              onProgress: (fetched, totalSeen) => setExporting({ fetched, total: totalSeen }),
            });
            setExporting(null);
            if (result.error) {
              setError(`Export failed after ${result.rows.length} row(s): ${result.error}`);
              if (result.rows.length === 0) return;
              // Fall through and offer the partial export — the
              // banner above tells the admin it's incomplete.
            }
            if (result.rows.length === 0) return;
            downloadAuditCsv(result.rows, { tableFilter, dateFrom, dateTo, scope: 'all' });
          }}
          disabled={loading || exporting !== null || total === 0}
          title={
            exporting
              ? `Exporting ${exporting.fetched.toLocaleString()}${exporting.total !== null ? ` of ${exporting.total.toLocaleString()}` : ''}…`
              : (total !== null
                  ? `Download all ${total.toLocaleString()} matching row${total === 1 ? '' : 's'} (paginates 500 at a time)`
                  : 'Download all matching rows (paginates 500 at a time)')
          }
        >
          {exporting !== null
            ? `Exporting ${exporting.fetched.toLocaleString()}${exporting.total !== null ? ` / ${exporting.total.toLocaleString()}` : ''}…`
            : `↓ Export all${total !== null ? ` (${total.toLocaleString()})` : ''}`}
        </button>
      </div>

      {loading && <div style={styles.placeholder}>Loading…</div>}
      {error && <div role="alert" style={styles.error}>{error}</div>}
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
                          aria-expanded={isOpen}
                          aria-controls={`audit-payload-${row.id}`}
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
                        <pre id={`audit-payload-${row.id}`} style={styles.payload}>{JSON.stringify(row.payload, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      {rows.length > 0 && (
        <div style={styles.pager}>
          <div style={styles.pagerInfo}>
            {total !== null
              ? `Showing ${offset + 1}–${Math.min(offset + rows.length, total)} of ${total.toLocaleString()}`
              : `Showing ${offset + 1}–${offset + rows.length}`}
            {lastPage && (
              <span style={styles.pagerPage}> · page {page} of {lastPage}</span>
            )}
          </div>
          <div style={styles.pagerBtns}>
            <button
              type="button"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={!hasPrev}
              style={{ ...styles.pagerBtn, opacity: hasPrev ? 1 : 0.4, cursor: hasPrev ? 'pointer' : 'not-allowed' }}
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => setOffset(offset + limit)}
              disabled={!hasNext}
              style={{ ...styles.pagerBtn, opacity: hasNext ? 1 : 0.4, cursor: hasNext ? 'pointer' : 'not-allowed' }}
            >
              Next →
            </button>
          </div>
        </div>
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

// Shared by both Export-page + Export-all buttons. Builds the CSV
// from a list of audit-log rows and triggers a browser download. The
// `scope` tag goes into the filename so multiple exports don't
// overwrite each other ("page" vs "all" + active filter + date
// range, e.g. admin_audit_log_all_fuel_bills_2026-01-01_to_now.csv).
function downloadAuditCsv(rows, { tableFilter, dateFrom, dateTo, scope }) {
  if (!Array.isArray(rows) || rows.length === 0) return;
  const csv = toCsv(
    rows.map((r) => ({
      created_at: r.created_at,
      action: r.action,
      table_name: r.table_name,
      row_id: r.row_id ?? '',
      note: r.note ?? '',
      payload: r.payload ? JSON.stringify(r.payload) : '',
    })),
    ['created_at', 'action', 'table_name', 'row_id', 'note', 'payload'],
  );
  const filterTag = tableFilter ? `_${tableFilter}` : '';
  const dateTag = dateFrom || dateTo ? `_${dateFrom || 'start'}_to_${dateTo || 'now'}` : '';
  const scopeTag = scope === 'all' ? '_all' : '';
  downloadCsv(`admin_audit_log${scopeTag}${filterTag}${dateTag}.csv`, csv);
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

  dateInput: { padding: '6px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 13, marginLeft: 4, fontFamily: 'inherit', minWidth: 130 },
  clearBtn: { padding: '6px 12px', background: 'transparent', color: '#fbbf24', border: '1px solid #92400e', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 },
  refreshBtn: { padding: '6px 12px', background: 'transparent', color: '#22d3ee', border: '1px solid #155e75', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, marginLeft: 'auto' },
  csvBtn: { padding: '6px 12px', background: 'transparent', color: '#86efac', border: '1px solid #14532d', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 },

  pager: { marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  pagerInfo: { fontSize: 12, color: '#94a3b8' },
  pagerPage: { color: '#64748b', marginLeft: 8 },
  pagerBtns: { display: 'flex', gap: 8 },
  pagerBtn: { padding: '6px 14px', background: 'transparent', color: '#cbd5e1', border: '1px solid #334155', borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: 'inherit' },
};
