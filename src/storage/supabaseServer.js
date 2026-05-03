// Server-side Supabase client. Used only by /api handlers. Reads
// SUPABASE_URL and SUPABASE_SERVICE_KEY from process.env (NOT the
// VITE_-prefixed client envs, which are public).
//
// Returns null when either env is missing — every caller treats that as
// "Supabase not configured, fall back to in-memory".

let _client = null;
let _attemptedInit = false;

export async function getSupabaseServer() {
  if (_attemptedInit) return _client;
  _attemptedInit = true;

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
}

// Test-only escape hatch.
export function _resetSupabaseServer() {
  _client = null;
  _attemptedInit = false;
}
