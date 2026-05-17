// Unit tests for the in-memory token-bucket rate limiter behind every
// /api/* handler. The bucket fills to capacity, costs 1 per consume,
// refills at refillPerSec, and returns a retryAfterMs ceiling that
// the handlers pass through as the Retry-After response header.
//
// Mostly small math, but a refill-rate bug here either lets the LLM
// bill run uncapped or 429s legitimate students every other minute,
// so pin it down.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRateLimit, getClientKey } from '../utils/rateLimit.js';

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-05-01T00:00:00Z')); });
afterEach(() => { vi.useRealTimers(); });

describe('createRateLimit — consume()', () => {
  it('starts a fresh key at full capacity', () => {
    const lim = createRateLimit({ capacity: 3, refillPerSec: 0 });
    expect(lim.consume('a').allowed).toBe(true);
    expect(lim.consume('a').allowed).toBe(true);
    expect(lim.consume('a').allowed).toBe(true);
    expect(lim.consume('a').allowed).toBe(false);
  });

  it('keeps separate buckets per key', () => {
    const lim = createRateLimit({ capacity: 1, refillPerSec: 0 });
    expect(lim.consume('alice').allowed).toBe(true);
    expect(lim.consume('alice').allowed).toBe(false);
    // bob still has a full bucket.
    expect(lim.consume('bob').allowed).toBe(true);
  });

  it('refills at refillPerSec, capped at capacity', () => {
    const lim = createRateLimit({ capacity: 5, refillPerSec: 1 });
    // Drain.
    for (let i = 0; i < 5; i++) lim.consume('a');
    expect(lim.consume('a').allowed).toBe(false);
    // Advance 3 seconds → 3 tokens refilled.
    vi.advanceTimersByTime(3000);
    expect(lim.consume('a').allowed).toBe(true);
    expect(lim.consume('a').allowed).toBe(true);
    expect(lim.consume('a').allowed).toBe(true);
    expect(lim.consume('a').allowed).toBe(false);
  });

  it('caps refill at capacity (does not overflow over long idle windows)', () => {
    const lim = createRateLimit({ capacity: 2, refillPerSec: 1 });
    lim.consume('a'); lim.consume('a');
    // 10 minutes idle would refill 600 tokens with no cap — must not.
    vi.advanceTimersByTime(600_000);
    expect(lim.consume('a').allowed).toBe(true);
    expect(lim.consume('a').allowed).toBe(true);
    expect(lim.consume('a').allowed).toBe(false);
  });

  it('returns retryAfterMs that, once waited, allows the next request', () => {
    const lim = createRateLimit({ capacity: 1, refillPerSec: 1 });
    lim.consume('a');
    const denied = lim.consume('a');
    expect(denied.allowed).toBe(false);
    expect(denied.retryAfterMs).toBeGreaterThan(0);
    vi.advanceTimersByTime(denied.retryAfterMs);
    expect(lim.consume('a').allowed).toBe(true);
  });

  it('returns retryAfterMs: 0 on allowed requests', () => {
    const lim = createRateLimit({ capacity: 1, refillPerSec: 0 });
    expect(lim.consume('a').retryAfterMs).toBe(0);
  });

  it('honors a custom cost > 1', () => {
    const lim = createRateLimit({ capacity: 5, refillPerSec: 0 });
    expect(lim.consume('a', 3).allowed).toBe(true);   // 5 → 2
    expect(lim.consume('a', 3).allowed).toBe(false);  // need 3, have 2
    expect(lim.consume('a', 2).allowed).toBe(true);   // 2 → 0
  });
});

describe('createRateLimit — reset()', () => {
  it('clears a single key', () => {
    const lim = createRateLimit({ capacity: 1, refillPerSec: 0 });
    lim.consume('a');
    expect(lim.consume('a').allowed).toBe(false);
    lim.reset('a');
    expect(lim.consume('a').allowed).toBe(true);
  });

  it('clears every key when called without an argument', () => {
    const lim = createRateLimit({ capacity: 1, refillPerSec: 0 });
    lim.consume('a'); lim.consume('b');
    expect(lim.consume('a').allowed).toBe(false);
    expect(lim.consume('b').allowed).toBe(false);
    lim.reset();
    expect(lim.consume('a').allowed).toBe(true);
    expect(lim.consume('b').allowed).toBe(true);
  });
});

describe('getClientKey', () => {
  it('prefers x-forwarded-for and takes the first comma-separated entry', () => {
    expect(getClientKey({ headers: { 'x-forwarded-for': '1.2.3.4, 10.0.0.1' } })).toBe('1.2.3.4');
  });

  it('trims whitespace around the picked entry', () => {
    expect(getClientKey({ headers: { 'x-forwarded-for': '  1.2.3.4  , 10.0.0.1' } })).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip when x-forwarded-for is absent', () => {
    expect(getClientKey({ headers: { 'x-real-ip': '9.9.9.9' } })).toBe('9.9.9.9');
  });

  it('falls back to socket.remoteAddress when no proxy headers are set', () => {
    expect(getClientKey({ headers: {}, socket: { remoteAddress: '8.8.8.8' } })).toBe('8.8.8.8');
  });

  it('returns "unknown" when nothing identifies the client (one shared bucket beats no limit at all)', () => {
    expect(getClientKey({ headers: {} })).toBe('unknown');
    expect(getClientKey({})).toBe('unknown');
  });
});
