// Server-side Supabase client. Used only by /api handlers. Reads
// SUPABASE_URL and SUPABASE_SERVICE_KEY from process.env (NOT the
// VITE_-prefixed client envs, which are public).
//
// Returns null when either env is missing — every caller treats that as
// "Supabase not configured, fall back to in-memory".

let _client = null;
// Cache the in-flight init *promise* rather than a boolean. The earlier
// version flipped _attemptedInit = true synchronously before the
// dynamic import resolved — so a second concurrent request would see
// _attemptedInit=true, return _client (still null), and skip Supabase
// even though init was about to succeed. Sharing the promise gives all
// concurrent callers the same eventual answer.
let _initPromise = null;

export async function getSupabaseServer() {
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    const url = (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL) || null;
    const key = (typeof process !== 'undefined' && process.env && process.env.SUPABASE_SERVICE_KEY) || null;
    if (!url || !key) return null;
    try {
      const { createClient } = await import('@supabase/supabase-js');
      _client = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      return _client;
    } catch (err) {
      console.warn('Supabase init failed:', err.message);
      return null;
    }
  })();
  return _initPromise;
}

// Test-only escape hatch.
export function _resetSupabaseServer() {
  _client = null;
  _initPromise = null;
}
