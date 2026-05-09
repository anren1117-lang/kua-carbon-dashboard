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
import { invalidate as invalidateMeasuredCache } from '../hooks/measuredCache.js';

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
  // Wipe the live-data cache so the public dashboard re-fetches on
  // the next mount. Without this, admins would see their own write
  // reflected up to 30s late on Executive / Goals / NetEstimate /
  // AdminDataQuality pages.
  invalidateMeasuredCache();
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

/**
 * Page through fetchAuditLog to gather ALL rows for the supplied
 * filter (table / dateFrom / dateTo). The audit-log API caps each
 * request at 500 rows, so for archives we walk offsets until either
 * we've fetched the announced total or a page comes back short.
 *
 * The optional `onProgress(fetched, total)` callback fires after
 * each successful page so callers can render "Exporting X of Y…".
 *
 * Stops early on error — returns whatever rows were collected so
 * far plus the error so callers can decide whether to use the
 * partial export or surface the failure.
 *
 * @param {{ table?: string, dateFrom?: string, dateTo?: string, pageSize?: number, onProgress?: (fetched: number, total: number|null) => void, maxRows?: number }} [opts]
 * @returns {Promise<{ rows: object[], total: number|null, error: string | null }>}
 */
export async function fetchAllAuditLog(opts = {}) {
  const pageSize = Math.max(1, Math.min(opts.pageSize || 500, 500));
  // Hard ceiling so a runaway loop or a server bug can't pin the
  // browser. 50,000 rows × 500/page = 100 round-trips, plenty.
  const maxRows = Math.max(0, opts.maxRows ?? 50_000);
  const all = [];
  let total = null;
  let offset = 0;
  while (offset < maxRows) {
    const page = await fetchAuditLog({
      limit: pageSize,
      offset,
      table: opts.table,
      dateFrom: opts.dateFrom,
      dateTo: opts.dateTo,
    });
    if (page.error) return { rows: all, total, error: page.error };
    if (page.total !== null) total = page.total;
    if (page.rows.length === 0) break;
    all.push(...page.rows);
    if (typeof opts.onProgress === 'function') opts.onProgress(all.length, total);
    // If we've reached the announced total, or the server returned a
    // short page (signaling no more data), we're done.
    if (total !== null && all.length >= total) break;
    if (page.rows.length < pageSize) break;
    offset += pageSize;
  }
  return { rows: all, total, error: null };
}
