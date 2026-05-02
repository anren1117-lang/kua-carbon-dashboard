// Hash-ID generator. Used to give every submitted record a non-PII
// "submitted_by" field. The hashing is deliberately lightweight and
// deterministic for development; production should swap in a salted
// SHA-256 keyed by school SSO subject.

/**
 * Stable mock hash function. djb2-style, 8 hex chars.
 * @param {string} input
 */
export function quickHash(input) {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h) ^ input.charCodeAt(i);
  return ('00000000' + ((h >>> 0).toString(16))).slice(-8);
}

/**
 * Build a stable hashed ID for a user. Adds a domain prefix so different
 * record types cannot collide.
 * @param {'student'|'staff'|'parent'|'admin'} role
 * @param {string} canonicalId  School-side stable identifier (e.g. SSO sub)
 */
export function hashUserId(role, canonicalId) {
  return `${role}_${quickHash(`${role}:${canonicalId}`)}`;
}
