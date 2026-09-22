// The personal-footprint estimator priced a dorm thermostat habit from an
// unsourced rate: "a degree of setback during winter saves ~3% of heating
// energy ... a typical dorm setback (2-3 degF when not in room) saves ~7%".
//
// DOE publishes ~10% annual heating saving for a 7-10 degF setback held 8 h a
// day — about 0.147% per degF-hour/day. Phase 460 already corrected the lesson
// content to that rule; this is the same inflated rate in the code that
// produces the number a student is SHOWN ("7% reduction vs baseline 3.8 mt").
//
//   turn_down_when_out  2.5 degF x 12 h  ->  4.4%   (was 7%)
//   off_when_out        6   degF x 12 h  -> 10.6%   (was 10% — already right)
//
// Both are now derived from one DOE-based rate rather than typed in, so the
// assumption is visible and a change to either the rate or the assumed hours
// moves both together.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { estimatePersonalFootprint } from '../utils/personalFootprint.js';

const src = readFileSync(resolve(process.cwd(), 'utils/personalFootprint.js'), 'utf8');
const PER_DEGF_HOUR = 0.10 / (8.5 * 8);

const boarder = (habit) => estimatePersonalFootprint({
  studentType: 'us_boarding', beefFrequency: 'weekly', showersPerWeek: 7,
  flightsPerYear: 0, thermostatHabit: habit,
});
const thermoMt = (habit) => {
  const r = boarder(habit);
  const row = r.components.find((c) => /thermostat/i.test(c.label));
  return row ? row.mt : 0;
};

describe('the thermostat bonus derives from the DOE setback rule', () => {
  it('the rate is stated, not assumed', () => {
    expect(src).toMatch(/DOE/);
    expect(src).not.toMatch(/saves\s*~3% of heating energy/);
    expect(src).not.toMatch(/saves ~7%/);
  });

  it('both habits are computed, not hardcoded percentages', () => {
    expect(src).not.toMatch(/'turn_down_when_out':\s*-0\.07/);
    expect(src).toMatch(/PCT_PER_DEGF_HOUR|setback\(/);
  });

  it('turning down while out is ~4%, not 7%', () => {
    const pct = PER_DEGF_HOUR * 2.5 * 12;
    expect(pct).toBeGreaterThan(0.04);
    expect(pct).toBeLessThan(0.05);
    // 3.8 mt heating baseline per boarder
    expect(Math.abs(thermoMt('turn_down_when_out'))).toBeCloseTo(pct * 3.8, 2);
  });

  it('turning it off is the bigger saving, and was already about right', () => {
    const off = PER_DEGF_HOUR * 6 * 12;
    expect(off).toBeGreaterThan(0.10);
    expect(Math.abs(thermoMt('off_when_out'))).toBeGreaterThan(Math.abs(thermoMt('turn_down_when_out')));
  });

  it('always_on still contributes nothing', () => {
    expect(thermoMt('always_on')).toBe(0);
  });

  // The same habit is priced in two places a student sees: the estimator on
  // /personal-footprint and the homepage tip of the day. The tip stated the
  // retired 7% long after the lesson content had been corrected, so it is now
  // computed from the exported rate rather than typed in.
  it('the homepage tip derives its saving instead of stating one', () => {
    const tip = readFileSync(resolve(process.cwd(), 'components/DailyTip.js'), 'utf8');
    expect(tip).toMatch(/heatingSetbackSaving/);
    expect(tip).not.toMatch(/saves ~7% of heating energy/);
    expect(tip).not.toMatch(/0\.27 mt/);
    const pct = PER_DEGF_HOUR * 2 * 12;
    expect((pct * 100).toFixed(1)).toBe('3.5');
    expect((pct * 3.8).toFixed(2)).toBe('0.13');
  });
});
