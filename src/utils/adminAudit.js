// Client-side helper for the admin audit log.
//
// Fire-and-forget: every AdminPortal Supabase write should call
// `logAdminWrite(...)` immediately after a successful insert/delete.
// We never await the result on the user-visible path — a logging
// failure must NOT block the actual data write or surface as an
// error to the admin. Failures are logged to console.warn so they
// can be diagnosed if audits look incomplete.
//
// Reads (`fetchAuditLog`) DO surface errors so the audit-log viewer
// page can show an empty/error state.

import { adminFetch } from './adminFetch.js';

/**
 * Record an audit entry. Fire-and-forget — does not throw, does not
 * return a promise the caller should await.
 *
 * @param {object} entry
 * @param {'insert'|'update'|'delete'} entry.action
 * @param {string} entry.table         Supabase table name
 * @param {object} [entry.payload]     The row inserted, or { id } for deletes
 * @param {string} [entry.note]        Optional human-readable note
 */
export function logAdminWrite(entry) {
  // Use Promise.resolve so the entire call is async-clean — we don't
  // want a synchronous throw from JSON serialization to bubble into
  // the admin's Save click handler.
  Promise.resolve()
    .then(() =>
      adminFetch('/api/admin/audit-log', {
        method: 'POST',
        body: JSON.stringify(entry),
      })
    )
    .then(async (r) => {
      if (!r.ok) {
        // 401/503 is a config issue, not a code bug. Quiet console.
        const body = await r.json().catch(() => ({}));
        // eslint-disable-next-line no-console
        console.warn('Admin audit log skipped:', body.error || `HTTP ${r.status}`);
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Admin audit log failed:', err?.message || err);
    });
}

/**
 * Read audit-log entries. Returns { rows, total, offset, limit, error }
 * — never throws. The caller decides how to surface errors.
 *
 * @param {{
 *   limit?: number,
 *   offset?: number,
 *   table?: string,
 *   dateFrom?: string,    // ISO date e.g. '2026-01-01'
 *   dateTo?: string,      // ISO date e.g. '2026-12-31'
 * }} [opts]
 */
export async function fetchAuditLog(opts = {}) {
  const params = new URLSearchParams();
  if (opts.limit)    params.set('limit',    String(opts.limit));
  if (opts.offset)   params.set('offset',   String(opts.offset));
  if (opts.table)    params.set('table',    opts.table);
  if (opts.dateFrom) params.set('dateFrom', opts.dateFrom);
  if (opts.dateTo)   params.set('dateTo',   opts.dateTo);
  const qs = params.toString();
  try {
    const r = await adminFetch(`/api/admin/audit-log${qs ? `?${qs}` : ''}`);
    const body = await r.json().catch(() => ({}));
    if (!r.ok) return { rows: [], total: null, offset: 0, limit: 0, error: body.error || `HTTP ${r.status}` };
    return {
      rows: Array.isArray(body.rows) ? body.rows : [],
      total: typeof body.total === 'number' ? body.total : null,
      offset: typeof body.offset === 'number' ? body.offset : 0,
      limit: typeof body.limit === 'number' ? body.limit : 0,
      error: null,
    };
  } catch (err) {
    return { rows: [], total: null, offset: 0, limit: 0, error: err?.message || 'fetch failed' };
  }
}
