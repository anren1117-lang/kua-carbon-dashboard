// Unit tests for the hash-ID helpers. quickHash/hashUserId give every
// submitted record a non-PII "submitted_by" field; api/auth/session.js
// and four pages depend on the output being stable and the per-role
// domain prefix actually preventing cross-record-type collisions.

import { describe, it, expect } from 'vitest';
import { quickHash, hashUserId } from '../utils/hash.js';

describe('quickHash', () => {
  it('is deterministic for the same input', () => {
    expect(quickHash('hello')).toBe(quickHash('hello'));
  });

  it('always returns exactly 8 lowercase hex chars', () => {
    for (const input of ['', 'a', 'a much longer string with spaces', '日本語', '12345']) {
      expect(quickHash(input)).toMatch(/^[0-9a-f]{8}$/);
    }
  });

  it('produces different hashes for different inputs', () => {
    expect(quickHash('alice')).not.toBe(quickHash('bob'));
    expect(quickHash('a')).not.toBe(quickHash('b'));
  });

  it('handles the empty string without throwing', () => {
    expect(quickHash('')).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe('hashUserId', () => {
  it('prefixes the hash with the role', () => {
    expect(hashUserId('student', 'sub-123')).toMatch(/^student_[0-9a-f]{8}$/);
    expect(hashUserId('admin', 'sub-123')).toMatch(/^admin_[0-9a-f]{8}$/);
  });

  it('is deterministic for the same role + id', () => {
    expect(hashUserId('staff', 'sub-9')).toBe(hashUserId('staff', 'sub-9'));
  });

  it('gives the same canonical id different hashes per role (domain prefix)', () => {
    // The whole point of the `${role}:` prefix on the hash input — a
    // student and a staff member with the same SSO sub must not
    // collide into the same submitted_by id.
    const id = 'shared-sso-subject';
    const hashes = ['student', 'staff', 'parent', 'admin'].map((r) => hashUserId(r, id));
    expect(new Set(hashes).size).toBe(4);
  });

  it('gives different ids different hashes within a role', () => {
    expect(hashUserId('student', 'sub-1')).not.toBe(hashUserId('student', 'sub-2'));
  });
});
