// Tiny module-level promise cache shared across the useMeasuredScope*
// hooks. Without this, every component that mounts a hook fires its
// own Supabase round-trip — three pages on the dashboard might each
// fetch fuel_bills + 6 student/travel tables = 21 round-trips per nav
// even though all the data is identical.
//
// Behavior:
//   - cachedFetch(key, fetcher) returns the in-flight or recent
//     promise for `key` if it's < TTL old; otherwise calls fetcher()
//     and caches the new promise.
//   - resetCache() (test-only) clears the cache so each test starts
//     fresh.
//   - invalidate(key?) wipes one entry (or all) when data changes —
//     called by admin write paths so the next read re-fetches.
//
// Why a promise cache and not a value cache: simpler concurrency.
// If hook A starts a fetch and hook B mounts before it resolves,
// B awaits the same promise instead of starting a parallel fetch.

const DEFAULT_TTL_MS = 30 * 1000;

// Map<key, { promise, ts }>. The promise resolves to whatever the
// fetcher returned; we never coerce it.
const cache = new Map();

/**
 * Fetch-with-dedupe. Pass a stable key (e.g. table name or a
 * comma-joined list of tables) and a fetcher that returns a promise.
 *
 * @param {string} key
 * @param {() => Promise<any>} fetcher
 * @param {{ ttlMs?: number }} [opts]
 * @returns {Promise<any>}
 */
export function cachedFetch(key, fetcher, opts = {}) {
  const ttl = opts.ttlMs ?? DEFAULT_TTL_MS;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && (now - hit.ts) < ttl) return hit.promise;
  // Call fetcher synchronously so the cache entry exists before the
  // next consumer gets here. Promise.resolve() coerces non-promise
  // returns. If the fetcher synchronously throws, wrap it in a
  // rejected promise so behavior matches the async-throw case.
  let promise;
  try { promise = Promise.resolve(fetcher()); }
  catch (err) { promise = Promise.reject(err); }
  cache.set(key, { promise, ts: now });
  // If the fetcher rejects, drop the cache entry so the next caller
  // can retry instead of being permanently wedged on the failure.
  promise.catch(() => {
    if (cache.get(key)?.promise === promise) cache.delete(key);
  });
  return promise;
}

/** Wipe one entry (or all when called with no arg). */
export function invalidate(key) {
  if (key === undefined) cache.clear();
  else cache.delete(key);
}

/** Test-only escape hatch. */
export function _resetCacheForTests() {
  cache.clear();
}
