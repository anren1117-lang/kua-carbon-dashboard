// Unit tests for the alert-cron dedup state store. Runs against the
// in-memory fallback path (no Supabase env in tests), which is the
// path that survives on a fresh deploy too.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCronState, setCronState, _resetAlertCronStateStoreForTests,
} from '../storage/alertCronState.js';

beforeEach(() => { _resetAlertCronStateStoreForTests(); });

describe('alertCronState — memory fallback', () => {
  it('returns null state on first read', async () => {
    const s = await getCronState();
    expect(s).toEqual({ signature: null, emailedAt: null, source: 'memory' });
  });

  it('round-trips a signature + emailedAt', async () => {
    const r = await setCronState('stale:x|empty:y', '2026-05-17T08:00:00Z');
    expect(r.persisted).toBe(false); // memory only — no Supabase configured
    const s = await getCronState();
    expect(s.signature).toBe('stale:x|empty:y');
    expect(s.emailedAt).toBe('2026-05-17T08:00:00Z');
  });

  it('writes overwrite the previous value', async () => {
    await setCronState('first', '2026-05-16T08:00:00Z');
    await setCronState('second', '2026-05-17T08:00:00Z');
    const s = await getCronState();
    expect(s.signature).toBe('second');
    expect(s.emailedAt).toBe('2026-05-17T08:00:00Z');
  });

  it('reports source: "memory" when Supabase is not configured', async () => {
    await setCronState('x', '2026-05-17T08:00:00Z');
    expect((await getCronState()).source).toBe('memory');
  });

  it('accepts a null emailedAt (used when signature changes but nothing was emailed yet)', async () => {
    await setCronState('sig', null);
    const s = await getCronState();
    expect(s.signature).toBe('sig');
    expect(s.emailedAt).toBeNull();
  });

  it('_resetAlertCronStateStoreForTests clears the memory copy', async () => {
    await setCronState('sig', '2026-05-17T08:00:00Z');
    _resetAlertCronStateStoreForTests();
    expect(await getCronState()).toEqual({ signature: null, emailedAt: null, source: 'memory' });
  });
});
