// Freshness helpers for the data-quality dashboard.
//
// "Stale" data is a real GHG-protocol concern: an annual emissions
// report whose underlying records stopped landing 6 months ago is
// likely undercounting (or missing entirely) recent activity.
//
// Phase 42 used a single uniform 60/180-day bucket. Phase 48 makes
// the buckets cadence-aware: a fuel bill is stale at 120 days
// (monthly cadence — past one missed cycle is aging, past two is
// stale), but a student roster at 540 days is just one cycle past
// (annual cadence). 'irregular' tables (refrigerant service logs,
// faculty trips, forest stand walks) opt out of the staleness check
// entirely — they're event-driven, not cadence-driven.

// Default thresholds when a table doesn't declare a cadence —
// matches the original Phase 42 buckets so behavior is unchanged
// for any caller that hasn't migrated.
export const FRESHNESS_THRESHOLDS = {
  fresh: 60,     // < 60 days → fresh
  aging: 180,    // 60–180 days → aging
  // > 180 days → stale
};

/**
 * Per-cadence freshness buckets in days. Picked so:
 *   - "fresh" = inside the expected cycle
 *   - "aging" = one cycle past expected (admin notices something's off)
 *   - "stale" = two+ cycles past (data is genuinely missing)
 *
 *   monthly:    fresh < 60d,   aging 60–120d,    stale > 120d
 *   quarterly:  fresh < 120d,  aging 120–365d,   stale > 365d
 *   annual:     fresh < 540d,  aging 540–720d,   stale > 720d (1.5y / 2y)
 *
 * 'irregular' is a sentinel — these tables don't have a cadence at
 * all (event-driven). freshnessBucket short-circuits to a special
 * 'irregular' bucket when it sees this cadence.
 */
export const CADENCE_THRESHOLDS = {
  monthly:   { fresh: 60,  aging: 120 },
  quarterly: { fresh: 120, aging: 365 },
  annual:    { fresh: 540, aging: 720 },
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
 *   'empty'     — no rows yet
 *   'fresh'     — most recent row inside the expected cadence window
 *   'aging'     — one cadence cycle past expected
 *   'stale'     — two+ cycles past expected
 *   'irregular' — event-driven table; we don't grade staleness
 *   'unknown'   — has rows but no parseable timestamp
 *
 * The optional `cadence` argument selects the bucket thresholds. When
 * omitted (or unrecognized), falls back to the legacy uniform 60/180
 * buckets in FRESHNESS_THRESHOLDS so existing callers keep working.
 *
 * @param {{ count: number, lastUpdated?: string|Date|null }} stats
 * @param {Date | undefined | string} [nowOrCadence]
 *   Backward compat: if a Date is passed (legacy 2-arg form), it's
 *   treated as `now`. If a string, it's treated as `cadence`.
 * @param {Date} [now]
 */
export function freshnessBucket(stats, nowOrCadence, now) {
  // Resolve overload: 1-arg, 2-arg(now), 2-arg(cadence), 3-arg.
  let cadence;
  let resolvedNow;
  if (nowOrCadence instanceof Date) {
    resolvedNow = nowOrCadence;
    cadence = undefined;
  } else {
    cadence = nowOrCadence;
    resolvedNow = now instanceof Date ? now : new Date();
  }

  if (!stats || (stats.count ?? 0) === 0) return 'empty';
  if (cadence === 'irregular') return 'irregular';
  const days = daysSince(stats.lastUpdated, resolvedNow);
  if (days === null) return 'unknown';
  const t = (cadence && CADENCE_THRESHOLDS[cadence]) || FRESHNESS_THRESHOLDS;
  if (days < t.fresh) return 'fresh';
  if (days < t.aging) return 'aging';
  return 'stale';
}

/**
 * Visual styling for each freshness bucket — same shape across the
 * data-quality dashboard so the bucket → pill mapping stays in one
 * place. Caller renders the pill however it likes.
 */
export const FRESHNESS_PILL_STYLES = {
  fresh:     { label: 'Fresh',     bg: '#0e3a1f', fg: '#86efac', border: '#16a34a' },
  aging:     { label: 'Aging',     bg: '#3a2a0e', fg: '#fcd34d', border: '#ca8a04' },
  stale:     { label: 'Stale',     bg: '#3a0d0d', fg: '#fca5a5', border: '#7f1d1d' },
  empty:     { label: 'Empty',     bg: '#1f2937', fg: '#94a3b8', border: '#475569' },
  irregular: { label: 'Irregular', bg: '#0f172a', fg: '#a5b4fc', border: '#3730a3' },
  unknown:   { label: 'No date',   bg: '#1f2937', fg: '#94a3b8', border: '#475569' },
};
