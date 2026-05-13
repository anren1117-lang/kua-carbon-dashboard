// @vitest-environment jsdom
//
// Unit tests for the session-wide AI usage tally (Phase 167).
// recordUsage accumulates into sessionStorage; getTally reads it
// back; formatTally produces the display string.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordUsage,
  getTally,
  resetTally,
  formatTally,
} from '../utils/aiUsageTally.js';

beforeEach(() => {
  // Each test starts with an empty session tally.
  resetTally();
});

describe('aiUsageTally', () => {
  it('returns an empty tally before any calls', () => {
    const t = getTally();
    expect(t.total.calls).toBe(0);
    expect(t.total.costUsd).toBe(0);
    expect(formatTally(t)).toBeNull();
  });

  it('accumulates one Opus 4.7 call', () => {
    recordUsage({ inputTokens: 1000, outputTokens: 500, cacheReadInputTokens: 0, cacheCreationInputTokens: 0 }, 'claude-opus-4-7', 'plan');
    const t = getTally();
    expect(t.total.calls).toBe(1);
    expect(t.total.inputTokens).toBe(1000);
    expect(t.total.outputTokens).toBe(500);
    // Opus: $15/1M input, $75/1M output → 0.001*15 + 0.0005*75 = 0.0525
    expect(t.total.costUsd).toBeCloseTo(0.0525, 4);
  });

  it('accumulates across multiple calls + models', () => {
    recordUsage({ inputTokens: 2000, outputTokens: 1000 }, 'claude-opus-4-7', 'plan');
    recordUsage({ inputTokens: 500, outputTokens: 200 }, 'claude-sonnet-4-6', 'memo');
    const t = getTally();
    expect(t.total.calls).toBe(2);
    expect(t.total.inputTokens).toBe(2500);
    expect(t.total.outputTokens).toBe(1200);
    // Opus: 0.002*15 + 0.001*75 = 0.105
    // Sonnet: 0.0005*3 + 0.0002*15 = 0.0015 + 0.003 = 0.0045
    // total = 0.1095
    expect(t.total.costUsd).toBeCloseTo(0.1095, 4);
    expect(t.byModel['claude-opus-4-7'].calls).toBe(1);
    expect(t.byModel['claude-sonnet-4-6'].calls).toBe(1);
  });

  it('treats cached input as 10% of normal input cost', () => {
    // 1M cached input on Opus = $1.50 (10% of $15)
    recordUsage({ inputTokens: 0, outputTokens: 0, cacheReadInputTokens: 1_000_000 }, 'claude-opus-4-7');
    expect(getTally().total.costUsd).toBeCloseTo(1.5, 3);
  });

  it('counts cacheCreationInputTokens at full input rate', () => {
    // 1M cache-creation on Sonnet = $3
    recordUsage({ cacheCreationInputTokens: 1_000_000, outputTokens: 0 }, 'claude-sonnet-4-6');
    expect(getTally().total.costUsd).toBeCloseTo(3, 3);
  });

  it('skips when usage is null/undefined (telemetry never blocks)', () => {
    recordUsage(null, 'claude-opus-4-7');
    recordUsage(undefined, 'claude-opus-4-7');
    expect(getTally().total.calls).toBe(0);
  });

  it('formatTally returns a compact summary string when calls > 0', () => {
    recordUsage({ inputTokens: 3000, outputTokens: 2000 }, 'claude-opus-4-7');
    recordUsage({ inputTokens: 1000, outputTokens: 500 }, 'claude-opus-4-7');
    const fmt = formatTally(getTally());
    expect(fmt).toMatch(/6\.5K tok/);
    expect(fmt).toMatch(/2 calls/);
    expect(fmt).toMatch(/\$/);
  });

  it('resetTally zeros everything', () => {
    recordUsage({ inputTokens: 1000, outputTokens: 500 }, 'claude-opus-4-7');
    expect(getTally().total.calls).toBe(1);
    resetTally();
    expect(getTally().total.calls).toBe(0);
    expect(getTally().total.costUsd).toBe(0);
  });
});
