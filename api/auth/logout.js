// POST /api/auth/logout
//
// Companion to /api/auth/session. The session hash is currently held
// in the browser's sessionStorage (no server-side state yet), so the
// server's job here is minimal: acknowledge the logout, set a clearing
// header for any future cookie session, and return 200. The client
// drops its cached hash on receipt.
//
// Phase 2 (when cookies are wired): Set-Cookie header clears the auth
// cookie with Max-Age=0 + Secure + HttpOnly + SameSite=Lax, and the
// active session row in Supabase is marked revoked.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (typeof res.setHeader === 'function') {
    // Future cookie-clearing header. No-op today (no cookie set), but
    // makes the contract clear for whatever client calls it.
    res.setHeader('Set-Cookie', 'kua_session=; Max-Age=0; Path=/; SameSite=Lax');
  }
  res.status(200).json({ ok: true });
}
