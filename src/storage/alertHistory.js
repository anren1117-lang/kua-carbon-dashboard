// Alert history store — append-only log of every email batch the
// daily cron successfully dispatches. Write-through pattern: in-
// memory ring for the test path + dev deploys, Supabase table
// alert_history for production durability across cold starts.
//
// Read surface: /api/admin/alert-history → AdminAlerts page so the
// admin can see the audit trail.

import { getSupabaseServer } from './supabaseServer.js';

const TABLE = 'alert_history';
const MEM_CAP = 100; // Keep the memory log bounded.

/** @type {Array<HistoryEntry>} */
const memStore = [];

/**
 * @typedef {Object} HistoryEntry
 * @property {string} sentAt           ISO 8601
 * @property {string} signature        The alert-set signature that triggered this send
 * @property {number} alertCount
 * @property {Array<object>} alerts    Snapshot of the alerts at send time
 * @property {number} subscriberCount
 * @property {number} deliveredCount
 * @property {boolean} noProvider      True if RESEND_API_KEY wasn't set
 */

function rowToEntry(r) {
  return {
    sentAt: typeof r.sent_at === 'string' ? r.sent_at : new Date(r.sent_at).toISOString(),
    signature: r.signature,
    alertCount: r.alert_count,
    alerts: Array.isArray(r.alerts) ? r.alerts : (r.alerts || []),
    subscriberCount: r.subscriber_count,
    deliveredCount: r.delivered_count,
    noProvider: !!r.no_provider,
  };
}

/**
 * Append one entry. Returns { recorded, persisted } — recorded is
 * always true (memory write); persisted reflects whether the
 * Supabase write succeeded.
 *
 * @param {HistoryEntry} entry
 */
export async function recordAlertSend(entry) {
  const normalized = {
    sentAt: entry.sentAt || new Date().toISOString(),
    signature: String(entry.signature || ''),
    alertCount: Number(entry.alertCount) || 0,
    alerts: Array.isArray(entry.alerts) ? entry.alerts : [],
    subscriberCount: Number(entry.subscriberCount) || 0,
    deliveredCount: Number(entry.deliveredCount) || 0,
    noProvider: !!entry.noProvider,
  };

  memStore.unshift(normalized);
  if (memStore.length > MEM_CAP) memStore.length = MEM_CAP;

  const sb = await getSupabaseServer();
  if (sb) {
    try {
      const { error } = await sb.from(TABLE).insert({
        sent_at: normalized.sentAt,
        signature: normalized.signature,
        alert_count: normalized.alertCount,
        alerts: normalized.alerts,
        subscriber_count: normalized.subscriberCount,
        delivered_count: normalized.deliveredCount,
        no_provider: normalized.noProvider,
      });
      if (!error) return { recorded: true, persisted: true };
      console.warn('[alertHistory] insert failed, memory only:', error.message);
    } catch (err) {
      console.warn('[alertHistory] insert threw, memory only:', err?.message || err);
    }
  }
  return { recorded: true, persisted: false };
}

/**
 * Recent history, newest first.
 * @param {number} [limit=50]
 */
export async function listAlertHistory(limit = 50) {
  const cap = Math.max(1, Math.min(limit, 200));
  const sb = await getSupabaseServer();
  if (sb) {
    try {
      const { data, error } = await sb
        .from(TABLE)
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(cap);
      if (!error && Array.isArray(data)) {
        return data.map(rowToEntry);
      }
    } catch (err) {
      console.warn('[alertHistory] list failed, falling back to memory:', err?.message || err);
    }
  }
  return memStore.slice(0, cap);
}

export function _resetAlertHistoryForTests() {
  memStore.length = 0;
}
