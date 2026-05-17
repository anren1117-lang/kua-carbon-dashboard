// Alert subscribers — who gets emailed when something unusual happens
// (stale data tables, dead meters, anomalous readings).
//
// Same write-through pattern as readingsStore / lessonStore: in-memory
// for development + tests, Supabase table `alert_subscribers` when
// SUPABASE_URL + SUPABASE_SERVICE_KEY are configured. Memory is the
// safety net so the alert flow can be tested + run on a fresh deploy
// without Supabase, but only the Supabase path survives Vercel cold
// starts in production.

import { getSupabaseServer } from './supabaseServer.js';
import { isLikelyEmail } from '../utils/sendEmail.js';

const TABLE = 'alert_subscribers';

/** @type {{ email: string, createdAt: string }[]} */
const memStore = [];

// Normalize to lowercase trimmed so dupes get caught regardless of
// how the admin types the address.
function normalize(email) {
  return String(email || '').trim().toLowerCase();
}

function rowToSubscriber(r) {
  return {
    email: r.email,
    createdAt: typeof r.created_at === 'string' ? r.created_at : new Date(r.created_at).toISOString(),
  };
}

/**
 * Add a subscriber. Returns the persisted record on success or an
 * { error } object the caller can surface.
 * @param {string} email
 */
export async function addSubscriber(email) {
  const normalized = normalize(email);
  if (!isLikelyEmail(normalized)) return { error: 'invalid_email' };

  const record = { email: normalized, createdAt: new Date().toISOString() };

  // Memory: dedupe.
  if (!memStore.some((s) => s.email === normalized)) {
    memStore.push(record);
  }

  const sb = await getSupabaseServer();
  if (sb) {
    try {
      // ON CONFLICT skip so the second-write path is idempotent —
      // the API handler treats "already subscribed" as success.
      const { error } = await sb.from(TABLE).upsert(
        { email: normalized, created_at: record.createdAt },
        { onConflict: 'email', ignoreDuplicates: true },
      );
      if (error) console.warn('alert_subscribers upsert failed:', error.message);
    } catch (err) {
      console.warn('alert_subscribers upsert threw:', err?.message || err);
    }
  }
  return record;
}

/**
 * Remove a subscriber. Idempotent — removing an unknown email is a
 * no-op.
 * @param {string} email
 */
export async function removeSubscriber(email) {
  const normalized = normalize(email);
  if (!normalized) return { removed: false };

  const idx = memStore.findIndex((s) => s.email === normalized);
  if (idx >= 0) memStore.splice(idx, 1);

  const sb = await getSupabaseServer();
  if (sb) {
    try {
      await sb.from(TABLE).delete().eq('email', normalized);
    } catch (err) {
      console.warn('alert_subscribers delete threw:', err?.message || err);
    }
  }
  return { removed: idx >= 0 };
}

/** List every subscribed email. Returns [] on any failure. */
export async function listSubscribers() {
  let sb = null;
  try { sb = await getSupabaseServer(); }
  catch (err) { console.warn('Supabase init threw, falling back to memory:', err?.message); }
  if (sb) {
    try {
      const { data, error } = await sb.from(TABLE).select('*').order('created_at', { ascending: true });
      if (!error && data) {
        try { return data.map(rowToSubscriber); }
        catch (err) { console.warn('alert_subscribers row mapping failed, falling back to memory:', err?.message); }
      }
    } catch (err) {
      console.warn('alert_subscribers list failed, falling back to memory:', err?.message);
    }
  }
  return memStore.slice().sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
}

export function _resetAlertSubscribersForTests() {
  memStore.length = 0;
}
