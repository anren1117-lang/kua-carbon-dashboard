// A backwards CT counts down exactly like an exporting solar array.
//
// parseBmsExport flags a meter as generation when its cumulative counter
// decreases. Scope2BmsInsights then counted every feed that was NAMED "Solar"
// and flagged generation as solar output. Two tests, both necessary, and
// together still not enough: in the 2026-08-17 → 09-15 export that admitted
// PM_15_FieldSolarFeed at 6,649 kWh beside the rooftop array's 1,639.
//
//   PM_15_RoofTopSolarFeed   night 0.00 kW   midday 8.26 kW    ratio 0.00
//   PM_15_FieldSolarFeed     night 8.09 kW   midday 10.52 kW   ratio 0.77
//   PM_19_SolarFeed          night 0.42 kW   midday 0.44 kW    ratio 0.96
//
// The field feed runs at 2am about as hard as at noon. Counted solar fell
// 8,288 → 1,639 kWh when the shape test was added: it had been 5.1x
// overstated, and because measured emissions are (consumption − solar) ×
// factor, the campus was reading cleaner than it is.
//
// HOW THIS WAS FOUND, because the near-miss is the lesson. A new Meter Trends
// CSV arrived and I noticed PM_15_FieldSolarFeed logging 6,649 kWh where
// renewables.js (anchored on an April export) called that feed dead. My first
// conclusion was that the dashboard understated campus solar fourfold and
// should be repriced upward — toward KUA's published 16%, which made it feel
// right. The hour-of-day profile is what stopped it. A correction that moves a
// number toward an outside figure you already expect is the one to check
// hardest, not the one to wave through.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { bmsExportMeters } from '../data/bmsExportSep2026.js';
import {
  solarProfile, countsAsSolar, miswiredGenerationSuspects,
  SOLAR_NIGHT_DAY_MAX, NIGHT_HOURS, MIDDAY_HOURS,
} from '../data/meterProfile.js';

const byId = (id) => bmsExportMeters.find((m) => m.id === id);

describe('a solar feed has to look like sunlight', () => {
  it('accepts the array that is dark at night', () => {
    const roof = byId('PM_15_RoofTopSolarFeed');
    const p = solarProfile(roof);
    expect(p.nightKw).toBe(0);
    expect(p.middayKw).toBeGreaterThan(1);
    expect(p.isSolarShaped).toBe(true);
    expect(countsAsSolar(roof)).toBe(true);
  });

  it('rejects the feed that generates at 2am', () => {
    const field = byId('PM_15_FieldSolarFeed');
    // it passes BOTH of the old tests, which is the entire point
    expect(/Solar/i.test(field.id)).toBe(true);
    expect(field.direction).toBe('generation');
    // and fails the new one
    expect(solarProfile(field).nightDayRatio).toBeGreaterThan(SOLAR_NIGHT_DAY_MAX);
    expect(countsAsSolar(field)).toBe(false);
  });

  it('the correction is large and in the unflattering direction', () => {
    const named = bmsExportMeters.filter((m) => /solar/i.test(m.id));
    const before = named.filter((m) => m.direction === 'generation')
      .reduce((s, m) => s + m.totalKwh, 0);
    const after = named.filter(countsAsSolar).reduce((s, m) => s + m.totalKwh, 0);
    expect(after).toBeLessThan(before);
    expect(before / after).toBeGreaterThan(4);
    // less solar means MORE measured emissions, which is why it is credible
    expect(after).toBe(byId('PM_15_RoofTopSolarFeed').totalKwh);
  });

  it('a dead feed is not a solar shape either', () => {
    expect(solarProfile({ hourly: Array(24).fill(0) }).isSolarShaped).toBe(false);
    expect(solarProfile({}).isSolarShaped).toBe(false);
    expect(solarProfile({ hourly: Array(24).fill(0) }).nightDayRatio).toBe(Infinity);
  });

  it('a synthetic perfect array passes and a flat load fails', () => {
    // controls, so the threshold cannot quietly stop discriminating
    const sun = Array(24).fill(0);
    MIDDAY_HOURS.forEach((h) => { sun[h] = 10; });
    expect(solarProfile({ hourly: sun }).isSolarShaped).toBe(true);

    const flat = Array(24).fill(5);
    expect(solarProfile({ hourly: flat }).isSolarShaped).toBe(false);
    expect(solarProfile({ hourly: flat }).nightDayRatio).toBe(1);

    // and a mostly-dark array with a little night leakage still passes
    const leaky = Array(24).fill(0);
    MIDDAY_HOURS.forEach((h) => { leaky[h] = 10; });
    NIGHT_HOURS.forEach((h) => { leaky[h] = 0.5; });
    expect(solarProfile({ hourly: leaky }).isSolarShaped).toBe(true);
  });

  it('names the miswired feeds for facilities instead of silently dropping them', () => {
    const suspects = miswiredGenerationSuspects(bmsExportMeters);
    expect(suspects.length).toBeGreaterThan(0);
    expect(suspects.map((s) => s.id)).toContain('PM_15_FieldSolarFeed');
    suspects.forEach((s) => {
      expect(s.nightDayRatio).toBeGreaterThan(SOLAR_NIGHT_DAY_MAX);
      expect(s.totalKwh).toBeGreaterThan(0);
    });
    // the Kurth dorm main feed reads as daytime-only export — consistent with
    // the 8 kW array on that roof — so it must NOT be flagged as miswired
    expect(suspects.map((s) => s.id)).not.toContain('PM_19_KurthDormMainFeed');
  });

  it('the insights surface uses the three-test rule', () => {
    const src = readFileSync(resolve(process.cwd(), 'components/Scope2BmsInsights.js'), 'utf8');
    expect(src).toContain('countsAsSolar');
    expect(src).not.toMatch(/solarFeedsAll\.filter\(\(m\) => m\.direction === 'generation'\)/);
  });
});
