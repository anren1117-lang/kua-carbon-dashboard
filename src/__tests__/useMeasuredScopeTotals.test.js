// @vitest-environment jsdom
//
// Tests for the useMeasuredScopeTotals composer hook — the single
// measured-aware view Executive, Goals, NetEstimate, AdminHome,
// AdminDataQuality, AdminMethodology, and AnnualReport all read from.
// The three per-scope hooks already have their own coverage
// (useMeasuredScope.test.js); this proves the composer folds them
// together correctly: gross = s1+s2+s3, net = gross - sinks, the
// measuredScopes counter starts at 1 (Scope 2 is permanently cited),
// and scope3CohortDetail passes through as an array.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { GRID_MIX_ANNUAL_MTCO2E } from '../data/gridMix.js';

// Reuse the same supabase harness pattern as useMeasuredScope.test.js
// so the composer's three child hooks fall through to their
// placeholders unless we explicitly inject measured rows.
const { setNextResponses, makeQueryHarness } = vi.hoisted(() => {
  let responses = {};
  const setNextResponses = (next) => { responses = next; };
  const makeQueryHarness = () => {
    function makeBuilder(table) {
      const promiseLike = {
        select() { return promiseLike; },
        order()  { return promiseLike; },
        limit()  { return promiseLike; },
        eq()     { return promiseLike; },
        then(resolve, reject) {
          const r = responses[table] ?? { data: [], error: null };
          return Promise.resolve(r).then(resolve, reject);
        },
      };
      return promiseLike;
    }
    return { from: (table) => makeBuilder(table) };
  };
  return { setNextResponses, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import { useMeasuredScopeTotals } from '../hooks/useMeasuredScopeTotals.js';

beforeEach(() => { setNextResponses({}); });
afterEach(() => { vi.clearAllMocks(); });

describe('useMeasuredScopeTotals — composed view', () => {
  it('returns a synchronous placeholder shape on first render', () => {
    const { result } = renderHook(() => useMeasuredScopeTotals());
    expect(typeof result.current.scope1Mt).toBe('number');
    expect(typeof result.current.scope2Mt).toBe('number');
    expect(typeof result.current.scope3Mt).toBe('number');
    expect(typeof result.current.sinkMt).toBe('number');
    expect(Array.isArray(result.current.scope3CohortDetail)).toBe(true);
  });

  it('computes grossMt = scope1 + scope2 + scope3', async () => {
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const c = result.current;
    expect(c.grossMt).toBe(c.scope1Mt + c.scope2Mt + c.scope3Mt);
  });

  it('computes netMt = grossMt − sinkMt', async () => {
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const c = result.current;
    expect(c.netMt).toBe(c.grossMt - c.sinkMt);
  });

  it('uses the GRID_MIX_ANNUAL_MTCO2E constant for Scope 2 (always measured)', async () => {
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.scope2Mt).toBe(Math.round(GRID_MIX_ANNUAL_MTCO2E));
  });

  it('starts measuredScopes at 1 (Scope 2 always counts) when nothing else has measured rows', async () => {
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.measuredScopes).toBe(1);
    expect(result.current.scope1Measured).toBe(false);
    expect(result.current.scope3Measured).toBe(false);
    expect(result.current.sinksMeasured).toBe(false);
  });

  it('measuredScopes always lands in [1, 4] — Scope 2 floor, scope1+3+sinks ceiling', async () => {
    // The exact per-hook measured-flip thresholds belong to the
    // individual hook tests; the composer just sums them. Assert the
    // bounds the composer is responsible for.
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.measuredScopes).toBeGreaterThanOrEqual(1);
    expect(result.current.measuredScopes).toBeLessThanOrEqual(4);
  });

  it('exposes scope3CohortDetail as an array even when the underlying value is missing', async () => {
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(Array.isArray(result.current.scope3CohortDetail)).toBe(true);
  });

  it('flips loading to false once every child hook settles', async () => {
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.loading).toBe(false);
  });
});
