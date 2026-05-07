import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cachedFetch, invalidate, _resetCacheForTests } from '../hooks/measuredCache.js';

beforeEach(() => {
  _resetCacheForTests();
});

describe('cachedFetch', () => {
  it('returns the same promise to a second consumer with the same key', () => {
    const fetcher = vi.fn(() => Promise.resolve({ data: 42 }));
    const a = cachedFetch('foo', fetcher);
    const b = cachedFetch('foo', fetcher);
    expect(a).toBe(b);              // same promise reference
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('calls fetcher again for a different key', () => {
    const fetcher = vi.fn(() => Promise.resolve({ data: 'x' }));
    cachedFetch('foo', fetcher);
    cachedFetch('bar', fetcher);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('respects ttlMs — refetches after expiry', async () => {
    const fetcher = vi.fn(() => Promise.resolve({ data: 'now' }));
    cachedFetch('foo', fetcher, { ttlMs: 1 });
    // Wait long enough for ttl to elapse.
    await new Promise((r) => setTimeout(r, 5));
    cachedFetch('foo', fetcher, { ttlMs: 1 });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('drops cache entry on rejected promise so retry works', async () => {
    let attempt = 0;
    const fetcher = vi.fn(() => {
      attempt++;
      return attempt === 1 ? Promise.reject(new Error('first-fails')) : Promise.resolve('second-wins');
    });
    // First call rejects; we have to await it AND tolerate the
    // rejection so the catch handler in cachedFetch runs.
    await cachedFetch('foo', fetcher).catch(() => {});
    // Second call should re-invoke the fetcher because the failed
    // entry was dropped.
    const second = await cachedFetch('foo', fetcher);
    expect(second).toBe('second-wins');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('invalidate(key) drops one entry so the next fetch is fresh', () => {
    const fetcher = vi.fn(() => Promise.resolve('v'));
    cachedFetch('foo', fetcher);
    invalidate('foo');
    cachedFetch('foo', fetcher);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('invalidate() with no arg drops everything', () => {
    const fetcher = vi.fn(() => Promise.resolve('v'));
    cachedFetch('foo', fetcher);
    cachedFetch('bar', fetcher);
    invalidate();
    cachedFetch('foo', fetcher);
    cachedFetch('bar', fetcher);
    expect(fetcher).toHaveBeenCalledTimes(4); // 2 initial + 2 after wipe
  });
});
