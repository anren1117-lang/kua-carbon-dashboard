// Browser side of /api/admin/records — the one write path for the admin
// data-entry tables. See api/admin/records.js for why it exists.
//
// Each helper resolves to `{ error }` with `error` null on success or an
// Error carrying the server's message, the same shape supabase-js returns.
// That keeps every former `const { error } = await supabase.from(t).insert(r)`
// call site a one-line change, and it means a failed write still reaches the
// admin as a message rather than being swallowed.

import { adminFetch } from './adminFetch.js';

const ENDPOINT = '/api/admin/records';

async function send(method, body) {
  try {
    const res = await adminFetch(ENDPOINT, { method, body: JSON.stringify(body) });
    if (res.ok) return { error: null };
    let message = `Save failed (HTTP ${res.status})`;
    try { message = (await res.json()).error || message; } catch { /* non-JSON error page */ }
    return { error: new Error(message) };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export const adminInsert = (table, rows) =>
  send('POST', { table, rows: Array.isArray(rows) ? rows : [rows] });

export const adminUpdate = (table, id, fields) => send('PATCH', { table, id, fields });

export const adminDelete = (table, id) => send('DELETE', { table, id });
