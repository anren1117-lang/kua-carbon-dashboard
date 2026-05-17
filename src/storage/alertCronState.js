// Persistent state for the alert cron's dedup logic — what was the
// signature of the last alert set we emailed about, and when.
// Process-memory cache is the safety net (so the cron works on any
// deploy), Supabase table `alert_cron_state` is the durable store
// that survives Vercel cold starts (so subscribers don't get a fresh
// "your meter is dead" email every time the function spins back up
// because of unrelated traffic).
//
// To enable durable dedup in production, create the table:
//
//   create table alert_cron_state (
//     key text primary key,
//     signature text not null default '',
//     emailed_at timestamptz
//   );
//
// Without the table, get/set both work via memory only — the cron
// still functions, it just falls back to "may resend on cold start"
// behavior. That's the v1 default; the table upgrades it to strict.

import { getSupabaseServer } from './supabaseServer.js';

const TABLE = 'alert_cron_state';
const ROW_KEY = 'last';

// Process-memory fallback. Set on every read + write so the
// in-memory shape stays consistent even when Supabase is around.
let memSignature = null;
let memEmailedAt = null;

/** Test-only escape hatch. */
export function _resetAlertCronStateStoreForTests() {
  memSignature = null;
  memEmailedAt = null;
}

/**
 * @returns {Promise<{ signature: string|null, emailedAt: string|null, source: 'supabase' | 'memory' }>}
 */
export async function getCronState() {
  const sb = await getSupabaseServer();
  if (sb) {
    try {
      const { data, error } = await sb
        .from(TABLE)
        .select('signature, emailed_at')
        .eq('key', ROW_KEY)
        .maybeSingle();
      if (!error && data) {
        memSignature = data.signature ?? null;
        memEmailedAt = data.emailed_at ?? null;
        return { signature: memSignature, emailedAt: memEmailedAt, source: 'supabase' };
      }
    } catch (err) {
      // Table missing, network error, etc — fall through to memory.
      console.warn('[alertCronState] read failed, falling back to memory:', err?.message || err);
    }
  }
  return { signature: memSignature, emailedAt: memEmailedAt, source: 'memory' };
}

/**
 * @param {string} signature  The current alert-set signature to remember.
 * @param {string|null} emailedAt  ISO timestamp of the email send, or null if we just cleared state without sending.
 * @returns {Promise<{ persisted: boolean }>}
 */
export async function setCronState(signature, emailedAt) {
  memSignature = signature;
  memEmailedAt = emailedAt;

  const sb = await getSupabaseServer();
  if (sb) {
    try {
      const { error } = await sb
        .from(TABLE)
        .upsert(
          { key: ROW_KEY, signature, emailed_at: emailedAt },
          { onConflict: 'key' },
        );
      if (!error) return { persisted: true };
    } catch (err) {
      console.warn('[alertCronState] write failed, kept memory only:', err?.message || err);
    }
  }
  return { persisted: false };
}
