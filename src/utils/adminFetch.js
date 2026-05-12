// Browser helper that attaches the admin Authorization header.
// Use for any client-side call to /api/admin/* that needs auth.

const SESSION_KEY = 'kua_admin_session';
// Custom event the AdminLayout can subscribe to so they
// can show a "session expired, please log in again" banner without
// each call site having to write their own 401 handler.
export const ADMIN_AUTH_EXPIRED_EVENT = 'kua-admin-auth-expired';

export function getAdminToken() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed.token;
  } catch {
    return null;
  }
}

function clearStoredAdminSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    // Legacy flag kept around from the pre-server-auth era. Clear too
    // so the gate re-prompts cleanly across the codebase.
    localStorage.removeItem('adminLoggedIn');
  } catch {}
}

function dispatchAuthExpired(reason) {
  if (typeof window === 'undefined' || !window.dispatchEvent) return;
  try {
    window.dispatchEvent(new CustomEvent(ADMIN_AUTH_EXPIRED_EVENT, { detail: { reason } }));
  } catch {}
}

/**
 * Fetch wrapper that adds the bearer token. If the response is a 401
 * the local session blob is cleared and a `kua-admin-auth-expired`
 * window event fires — listeners (AdminLayout) can show a
 * "session expired, please sign in again" banner and re-render the
 * password gate without the caller having to handle 401 individually.
 *
 * The request itself is not retried — callers can decide whether to
 * surface the error to the user or kick off a re-login flow.
 */
export async function adminFetch(input, init = {}) {
  const token = getAdminToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(input, { ...init, headers });
  if (res.status === 401) {
    // Best-effort: parse the JSON body to get the server's stated
    // reason ('missing token', 'expired', etc.) so the banner can be
    // specific. Cloning so the caller can still consume res.json().
    let reason = 'unauthorized';
    try { reason = (await res.clone().json()).error || reason; } catch {}
    clearStoredAdminSession();
    dispatchAuthExpired(reason);
  }
  return res;
}
