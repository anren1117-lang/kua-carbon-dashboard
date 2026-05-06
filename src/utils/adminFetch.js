// Browser helper that attaches the admin Authorization header.
// Use for any client-side call to /api/admin/* that needs auth.

export function getAdminToken() {
  try {
    const raw = localStorage.getItem('kua_admin_session');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem('kua_admin_session');
      return null;
    }
    return parsed.token;
  } catch {
    return null;
  }
}

/**
 * Fetch wrapper that adds the bearer token. If there's no live token
 * the request is sent unauthenticated and the server will 401 — the
 * caller is expected to handle that by redirecting to the admin gate.
 */
export function adminFetch(input, init = {}) {
  const token = getAdminToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(input, { ...init, headers });
}
