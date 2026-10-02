// Two ingestion defects, both found by handing the parser a real partial
// export (MeterTrends_20261002: hourly, 12 meters, Sep 3 – Oct 2).
//
// 1. NOT EXPORTED read as CONSUMED NOTHING. parseBmsExport emitted a meter
//    with totalKwh 0 whether its kWh channel was absent from the CSV or
//    present-but-unusable. Comparing two exports, PM_17_HP03Feed went 2,695
//    kWh -> 0 and I reported to the user that the meter had "stopped
//    reporting". It had not. That export simply has no TotalKilowattHours
//    column for it, only peak demand — a column nobody ticked. The two have
//    different fixes (a facilities ticket vs re-pulling the trend) and now
//    carry different flags: direction 'stuck' vs 'unmeasured'.
//
//    totalKwh stays 0 rather than null on purpose: three render paths call
//    m.totalKwh.toLocaleString() directly, and a null there is a crash.
//
// 2. A NARROW UPLOAD SILENTLY REPLACED A WIDE ONE. useBmsExport takes the
//    newest stored window, full stop. Uploading this 12-meter file would have
//    replaced the committed 104-meter capture and collapsed every per-building
//    figure to the dozen feeds in it, with nothing on screen saying so. The
//    admin still wins — a narrower capture can be legitimate — but the loss is
//    now visible instead of silent.

import { describe, it, expect } from 'vitest';
import { parseMeterTrendsHourly } from '../data/parseBmsExport.js';
import { coverageWarning, COVERAGE_WARN_RATIO } from '../hooks/useBmsExport.js';

// A meter with a kWh channel that never moves, and one trended for peak
// demand only — the exact pair the real export contains.
const csv = [
  'timestamp,PM_01_MainFeed_TotalKilowattHours,PM_02_DeadFeed_TotalKilowattHours,PM_03_PeakOnlyFeed_TotalPeakDemand',
  '2026-09-03T00:00:00.000,1000,500,4.2',
  '2026-09-03T01:00:00.000,1010,500,4.3',
  '2026-09-03T02:00:00.000,1020,500,4.1',
].join('\n');

const meters = parseMeterTrendsHourly(csv, 'fixture.csv').meters;
const byId = (id) => meters.find((m) => m.id === id);

describe('an absent kWh channel is not a zero reading', () => {
  it('a meter trended for peak demand only is flagged unmeasured', () => {
    const peakOnly = byId('PM_03_PeakOnlyFeed');
    expect(peakOnly, 'peak-only meter should still appear').toBeTruthy();
    expect(peakOnly.kwhChannel).toBe(false);
    expect(peakOnly.direction).toBe('unmeasured');
  });

  it('a present-but-frozen counter is still stuck, not unmeasured', () => {
    const dead = byId('PM_02_DeadFeed');
    expect(dead.kwhChannel).toBe(true);
    expect(dead.direction).toBe('stuck');
  });

  it('the two are distinguishable, which is the whole point', () => {
    expect(byId('PM_03_PeakOnlyFeed').direction)
      .not.toBe(byId('PM_02_DeadFeed').direction);
    // and both still read 0 kWh, so no arithmetic or render path changes
    expect(byId('PM_03_PeakOnlyFeed').totalKwh).toBe(0);
    expect(byId('PM_02_DeadFeed').totalKwh).toBe(0);
  });

  it('a working meter is marked as having a channel', () => {
    const main = byId('PM_01_MainFeed');
    expect(main.kwhChannel).toBe(true);
    expect(main.totalKwh).toBeGreaterThan(0);
  });

  it('totalKwh is never null — three render paths call .toLocaleString() on it', () => {
    meters.forEach((m) => {
      expect(typeof m.totalKwh, m.id).toBe('number');
      expect(() => m.totalKwh.toLocaleString()).not.toThrow();
    });
  });
});

describe('a narrow upload cannot quietly replace a campus capture', () => {
  const mk = (n) => Array.from({ length: n }, (_, i) => ({ id: `PM_${i}` }));

  it('warns when coverage collapses, as the real 12-vs-104 file would', () => {
    const warning = coverageWarning(mk(12), mk(104));
    expect(warning).toBeTruthy();
    expect(warning).toContain('12');
    expect(warning).toContain('104');
  });

  it('stays quiet for a comparable or better capture', () => {
    expect(coverageWarning(mk(104), mk(104))).toBeNull();
    expect(coverageWarning(mk(95), mk(104))).toBeNull();
    expect(coverageWarning(mk(200), mk(104))).toBeNull();
  });

  it('fires exactly at the stated threshold, not by accident', () => {
    const seed = mk(100);
    expect(coverageWarning(mk(Math.ceil(100 * COVERAGE_WARN_RATIO)), seed)).toBeNull();
    expect(coverageWarning(mk(Math.floor(100 * COVERAGE_WARN_RATIO) - 1), seed)).toBeTruthy();
  });

  it('does not block the upload — it only makes the loss visible', () => {
    // the warning is a string for a surface to render, never a refusal
    expect(typeof coverageWarning(mk(1), mk(104))).toBe('string');
    expect(coverageWarning([], mk(104))).toBeNull();      // nothing to judge
    expect(coverageWarning(mk(12), [])).toBeNull();
  });
});
