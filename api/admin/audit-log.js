// /api/admin/audit-log
//
// POST  body: { action, table, payload?, note? }   → 200 { id, created_at }
// GET   query: ?limit=20&table=fuel_bills           → 200 { rows: [...] }
//
// Both verbs require a valid admin bearer token via verifyAdminRequest.
// The audit_log Supabase table accepts anon writes per its RLS, but
// the actual auth gate is this endpoint — admins write/read THROUGH
// the API, never directly.
//
// Records every admin write so AASHE STARS accreditation can show a
// verifiable data-entry trail. AdminPortal calls this fire-and-forget
// after each Supabase insert/delete so a logging failure never
// blocks the actual data write.

import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';

// Server-side Supabase client. Uses the same publishable anon key as
// the browser — the audit_log table's RLS allows anon writes, and
// this endpoint's verifyAdminRequest is the real auth boundary. If
// SUPABASE_URL is missing (e.g. local dev without env), 503 the
// request rather than failing in a confusing way.
function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

// We don't cache the client across requests so env-var changes (in
// dev / tests) take effect on the next request without a server
// restart. Supabase client construction is cheap (no I/O until you
// actually call a query method) so the per-request cost is negligible.
function getSupabase() {
  const url = readEnv('SUPABASE_URL') || readEnv('VITE_SUPABASE_URL');
  const key = readEnv('SUPABASE_ANON_KEY') || readEnv('VITE_SUPABASE_ANON_KEY');
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const ALLOWED_ACTIONS = ['insert', 'update', 'delete'];
// Free-text but capped to prevent runaway payloads from filling the
// table.
const MAX_TABLE_NAME = 100;
const MAX_NOTE = 500;
const MAX_PAYLOAD_BYTES = 4096;

export default async function handler(req, res) {
  const auth = verifyAdminRequest(req);
  if (!auth.valid) {
    res.status(401).json({ error: `admin auth required: ${auth.reason}` });
    return;
  }

  const sb = getSupabase();
  if (!sb) {
    res.status(503).json({ error: 'Supabase not configured (SUPABASE_URL + SUPABASE_ANON_KEY env vars missing)' });
    return;
  }

  if (req.method === 'POST') {
    const { action, table, payload, note } = req.body || {};
    if (!ALLOWED_ACTIONS.includes(action)) {
      res.status(400).json({ error: `action must be one of ${ALLOWED_ACTIONS.join(', ')}` });
      return;
    }
    if (!table || typeof table !== 'string' || table.length === 0 || table.length > MAX_TABLE_NAME) {
      res.status(400).json({ error: `table is required (1-${MAX_TABLE_NAME} chars)` });
      return;
    }
    if (note && (typeof note !== 'string' || note.length > MAX_NOTE)) {
      res.status(400).json({ error: `note must be a string up to ${MAX_NOTE} chars` });
      return;
    }
    if (payload !== undefined && payload !== null) {
      let json;
      try { json = JSON.stringify(payload); }
      catch { res.status(400).json({ error: 'payload is not JSON-serializable' }); return; }
      if (json.length > MAX_PAYLOAD_BYTES) {
        res.status(400).json({ error: `payload exceeds ${MAX_PAYLOAD_BYTES} bytes` });
        return;
      }
    }

    // No actor_hash field yet — the shared-password admin gate has no
    // per-user identity. When SSO admin auth ships, populate from the
    // verified token's payload.
    const row = {
      action,
      table_name: table,
      payload: payload ?? null,
      note: note ?? null,
    };
    const { data, error } = await sb.from('admin_audit_log').insert(row).select('id, created_at').single();
    if (error) {
      res.status(500).json({ error: error.message || 'audit insert failed' });
      return;
    }
    res.status(200).json(data);
    return;
  }

  if (req.method === 'GET') {
    // Pagination via offset (Supabase .range is inclusive on both
    // ends, so 0..49 returns 50 rows). Caps preserved so a malicious
    // caller can't ask for the entire table in one shot.
    const limit  = Math.min(Math.max(Number(req.query?.limit)  || 50, 1), 500);
    const offset = Math.max(Number(req.query?.offset) || 0, 0);
    const table  = req.query?.table;
    const dateFrom = req.query?.dateFrom; // ISO date string, optional
    const dateTo   = req.query?.dateTo;   // ISO date string, optional

    let q = sb
      .from('admin_audit_log')
      .select('id, created_at, action, table_name, payload, note, actor_hash', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (table && typeof table === 'string') q = q.eq('table_name', table);
    if (dateFrom && typeof dateFrom === 'string') q = q.gte('created_at', dateFrom);
    if (dateTo   && typeof dateTo   === 'string') q = q.lte('created_at', dateTo);

    const { data, error, count } = await q;
    if (error) {
      res.status(500).json({ error: error.message || 'audit read failed' });
      return;
    }
    res.status(200).json({
      rows: data || [],
      total: typeof count === 'number' ? count : null,
      offset,
      limit,
    });
    return;
  }

  res.setHeader('Allow', 'POST, GET');
  res.status(405).json({ error: 'Method not allowed' });
}
