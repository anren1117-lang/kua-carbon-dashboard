// Freshness helpers for the data-quality dashboard.
//
// "Stale" data is a real GHG-protocol concern: an annual emissions
// report whose underlying records stopped landing 6 months ago is
// likely undercounting (or missing entirely) recent activity.
//
// The thresholds below are uniform across all admin tables — they
// could be per-table cadence-aware (fuel bills come monthly, student
// rosters yearly, etc.) but the current admin workflow doesn't
// distinguish, and a single set of buckets keeps the dashboard
// readable.

export const FRESHNESS_THRESHOLDS = {
  fresh: 60,     // < 60 days → fresh
  aging: 180,    // 60–180 days → aging
  // > 180 days → stale
};

/**
 * Return whole calendar days between `dateLike` and `now`, or null
 * when the input can't be parsed (missing, empty string, malformed
 * timestamp).
 *
 * @param {string|Date|null|undefined} dateLike
 * @param {Date} [now]
 * @returns {number | null}
 */
export function daysSince(dateLike, now = new Date()) {
  if (dateLike == null || dateLike === '') return null;
  const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
  const ms = d.getTime();
  if (!Number.isFinite(ms)) return null;
  const diff = now.getTime() - ms;
  if (diff < 0) return 0;
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}

/**
 * Bucket a row count + last-updated timestamp into one of:
 *   'empty'   — no rows yet
 *   'fresh'   — most recent row < 60 days old
 *   'aging'   — 60–180 days old
 *   'stale'   — > 180 days old
 *   'unknown' — has rows but no parseable timestamp
 *
 * @param {{ count: number, lastUpdated?: string|Date|null }} stats
 * @param {Date} [now]
 */
export function freshnessBucket(stats, now = new Date()) {
  if (!stats || (stats.count ?? 0) === 0) return 'empty';
  const days = daysSince(stats.lastUpdated, now);
  if (days === null) return 'unknown';
  if (days < FRESHNESS_THRESHOLDS.fresh) return 'fresh';
  if (days < FRESHNESS_THRESHOLDS.aging) return 'aging';
  return 'stale';
}

/**
 * Visual styling for each freshness bucket — same shape across the
 * data-quality dashboard so the bucket → pill mapping stays in one
 * place. Caller renders the pill however it likes.
 */
export const FRESHNESS_PILL_STYLES = {
  fresh:   { label: 'Fresh',    bg: '#0e3a1f', fg: '#86efac', border: '#16a34a' },
  aging:   { label: 'Aging',    bg: '#3a2a0e', fg: '#fcd34d', border: '#ca8a04' },
  stale:   { label: 'Stale',    bg: '#3a0d0d', fg: '#fca5a5', border: '#7f1d1d' },
  empty:   { label: 'Empty',    bg: '#1f2937', fg: '#94a3b8', border: '#475569' },
  unknown: { label: 'No date',  bg: '#1f2937', fg: '#94a3b8', border: '#475569' },
};
