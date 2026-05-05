// POST /api/auth/session
//
// Body (production):
//   { idToken: "<google-oidc-id-token>", role?: "student"|"staff"|"parent"|"admin" }
//
// Body (development, when AUTH_DEV_MODE=1 is set):
//   { mockSubject: "test@example.com", role?: "student"|"staff" }
//
// Response:
//   { userIdHash, role, displayHint, expiresAt }
//
// What this does:
// - Verifies the Google ID token against Google's published JWKs (production).
// - Confirms the email belongs to one of the AUTH_ALLOWED_DOMAINS.
// - Hashes the OIDC subject (`sub`) with hashUserId(role, sub) so the
//   client never sees a name or email — only an opaque, role-scoped hash.
// - Returns a `displayHint` (initials only) so the UI can greet the user
//   without knowing their identity.
//
// What this does NOT do (yet):
// - Cookie-based session storage. The current chatbot pulls a session
//   hash from sessionStorage; SSO replaces that with a hash signed by
//   this endpoint that the client stores. A phase-2 upgrade adds an
//   HttpOnly cookie + Supabase row.
//
// Required env (production):
//   AUTH_ALLOWED_DOMAINS  comma-separated, e.g. "kua.org,students.kua.org"
//   AUTH_GOOGLE_AUDIENCE  Google OAuth client ID for KUA
//
// Optional env:
//   AUTH_DEV_MODE         when "1", mockSubject is accepted and no JWT verification runs

import { hashUserId } from '../../src/utils/hash.js';
import { verifyGoogleIdToken } from '../../src/utils/googleJwt.js';

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

function isDevMode() {
  return readEnv('AUTH_DEV_MODE') === '1';
}

function parseAllowedDomains() {
  const raw = readEnv('AUTH_ALLOWED_DOMAINS') || '';
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function emailDomain(email) {
  const at = email.indexOf('@');
  return at >= 0 ? email.slice(at + 1).toLowerCase() : '';
}

function initials(email) {
  if (!email) return '?';
  const localPart = email.split('@')[0] || '';
  const segs = localPart.split(/[._-]+/).filter(Boolean);
  if (segs.length === 0) return localPart.slice(0, 2).toUpperCase();
  if (segs.length === 1) return segs[0].slice(0, 2).toUpperCase();
  return (segs[0][0] + segs[1][0]).toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { idToken, mockSubject, role } = req.body || {};
  const requestedRole = ['student', 'staff', 'parent', 'admin'].includes(role) ? role : 'student';

  // Dev mode shortcut — never enabled in production.
  if (isDevMode() && mockSubject) {
    const userIdHash = hashUserId(requestedRole, mockSubject);
    res.status(200).json({
      userIdHash,
      role: requestedRole,
      displayHint: initials(mockSubject),
      expiresAt: new Date(Date.now() + 8 * 3600_000).toISOString(),
      mode: 'dev',
    });
    return;
  }

  if (!idToken || typeof idToken !== 'string') {
    res.status(400).json({ error: 'idToken (Google OIDC) is required' });
    return;
  }

  // Cryptographic verification against Google's published JWKs. We
  // REQUIRE AUTH_GOOGLE_AUDIENCE — without it any token Google has
  // issued for any other OAuth app would pass signature + issuer +
  // expiry + (eventually) the domain allowlist. With an aud check,
  // only tokens specifically issued for KUA's OAuth client are
  // accepted. This used to fall through quietly when the env var was
  // unset; refuse explicitly so a missing deploy var fails closed
  // instead of silently widening the auth surface.
  const expectedAud = readEnv('AUTH_GOOGLE_AUDIENCE');
  if (!expectedAud) {
    res.status(503).json({
      error: 'AUTH_GOOGLE_AUDIENCE not configured. Set the Google OAuth client ID server-side before issuing sessions.',
    });
    return;
  }
  const verification = await verifyGoogleIdToken(idToken, { audience: expectedAud });
  if (!verification.valid) {
    res.status(401).json({ error: `Token verification failed: ${verification.reason}` });
    return;
  }
  const payload = verification.payload;

  // Google sets email_verified=true when the address has been verified
  // (most consumer/Workspace accounts). An unverified email shouldn't
  // be treated as authoritative for authorization decisions — someone
  // could enroll a Workspace account without verifying ownership.
  if (payload.email && payload.email_verified === false) {
    res.status(403).json({ error: 'Email not verified by Google' });
    return;
  }
  const allowed = parseAllowedDomains();
  const domain = emailDomain(payload.email || '');
  if (allowed.length > 0 && !allowed.includes(domain)) {
    res.status(403).json({ error: 'Email domain not allowed' });
    return;
  }
  if (!payload.sub) {
    res.status(400).json({ error: 'Token missing sub claim' });
    return;
  }

  const userIdHash = hashUserId(requestedRole, payload.sub);
  res.status(200).json({
    userIdHash,
    role: requestedRole,
    displayHint: initials(payload.email || ''),
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
    mode: 'sso',
  });
}
