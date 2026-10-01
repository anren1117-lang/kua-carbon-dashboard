// Research phase. KUA publishes claims about its own energy; this compares
// them to what the dashboard measures, and three of them disagree.
//
//   solar     kua.org: "220kw solar energy plant ... generating around 16% of
//             campus electricity needs". Repo: 60 kW of metered array and 1.5%.
//   wind      kua.org: a 15 kW turbine that "continues to generate electricity
//             year-round". Repo: carried as not operating, with a standing
//             explainer about why a broken turbine stays on the dashboard.
//   geothermal ReArch (contractor): the Kilton/Welch renovation incorporates
//             "a geothermal heating and cooling system". Repo: models both as
//             oil-heated and files geothermal as feasibility-stage.
//
// The solar one is the strongest because the two published numbers corroborate
// EACH OTHER: 16% of campus need implies ~210,000 kWh, which is ~957 kWh/kW/yr
// for a 220 kW plant — ordinary for New Hampshire. A self-consistent published
// pair against a repo figure of 280 kWh/kW/yr makes the repo the outlier, and
// renewables.js already documents two of three solar feeds as broken. What the
// published capacity adds is that broken meters are not the whole story: there
// is plant here that the BMS export never sees.
//
// The geothermal one is deliberately NOT acted on. It would shrink Scope 1 by
// removing modelled fossil heat from two buildings, and a correction that makes
// a footprint smaller deserves more scepticism than one that makes it larger —
// especially from a single contractor page that KUA's own site does not echo,
// and with Welch's electricity NOT elevated the way the story predicts.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  PUBLISHED_CLAIMS, DIVERGING_CLAIMS, UNCONFIRMED_CLAIMS,
  SOLAR_RECONCILIATION as R, PUBLISHED_SOLAR_KW, PUBLISHED_SOLAR_SHARE_PCT,
} from '../data/publishedClaims.js';
import { SOLAR_ANNUAL_KWH } from '../data/renewables.js';
import { GRID_MIX_TOTAL_KWH } from '../data/gridMix.js';

describe('published claims are quoted, sourced, and compared', () => {
  it('every claim carries a verbatim quote, a URL and a way to settle it', () => {
    expect(PUBLISHED_CLAIMS.length).toBeGreaterThanOrEqual(3);
    PUBLISHED_CLAIMS.forEach((c) => {
      expect(c.claim.length, c.id).toBeGreaterThan(40);
      expect(c.url, c.id).toMatch(/^https:\/\//);
      expect(c.settledBy, c.id).toBeTruthy();
      expect(['agrees', 'diverges', 'unconfirmed']).toContain(c.status);
      // a comparison with nothing to compare against is not a comparison
      expect(c.measured, c.id).toBeTruthy();
    });
    expect(DIVERGING_CLAIMS.length).toBe(2);
    expect(UNCONFIRMED_CLAIMS.length).toBe(1);
  });

  it("the published solar pair corroborates itself, which is why it outranks ours", () => {
    // 16% of (purchased + solar) solved for solar
    const expected = Math.round(
      (GRID_MIX_TOTAL_KWH * (PUBLISHED_SOLAR_SHARE_PCT / 100)) / (1 - PUBLISHED_SOLAR_SHARE_PCT / 100),
    );
    expect(R.impliedPublishedKwh).toBe(expected);
    // and that implied generation is an ordinary NH yield, not a fantasy
    expect(R.impliedPublishedYieldKwhPerKw).toBeGreaterThan(700);
    expect(R.impliedPublishedYieldKwhPerKw).toBeLessThan(R.nhTypicalYieldKwhPerKw);
  });

  it('the repo figure really is the outlier, by a wide margin', () => {
    expect(R.derivedYieldKwhPerKw).toBeLessThan(R.impliedPublishedYieldKwhPerKw / 2);
    expect(R.derivedSharePct).toBeLessThan(PUBLISHED_SOLAR_SHARE_PCT / 4);
    expect(R.capacityRatio).toBeGreaterThan(2);
    expect(R.publishedKw).toBe(PUBLISHED_SOLAR_KW);
  });

  it('the comparison derives its numbers rather than quoting them', () => {
    expect(R.derivedAnnualKwh).toBe(SOLAR_ANNUAL_KWH);
    const solar = PUBLISHED_CLAIMS.find((c) => c.id === 'solar_capacity');
    // the prose sentence is built from the reconciliation, so it cannot drift
    expect(solar.measured).toContain(String(R.meteredOperationalKw));
    expect(solar.measured).toContain(`${R.derivedSharePct}%`);
    expect(solar.measured).toContain(SOLAR_ANNUAL_KWH.toLocaleString());
  });

  it('the geothermal claim is recorded but NOT acted on', () => {
    const geo = PUBLISHED_CLAIMS.find((c) => c.id === 'geothermal_kilton_welch');
    expect(geo.status).toBe('unconfirmed');
    // the reasoning for inaction has to be on the record, not just in a commit
    expect(geo.reading).toMatch(/double count/i);
    expect(geo.reading).toMatch(/scepticism|skepticism/i);
    expect(geo.source).toMatch(/ReArch/);
  });

  it('the page shows the comparison rather than burying it in data', () => {
    const src = readFileSync(resolve(process.cwd(), 'pages/Renewables.js'), 'utf8');
    expect(src).toContain('PUBLISHED_CLAIMS');
    expect(src).toContain('SOLAR_RECONCILIATION');
    expect(src).toMatch(/What KUA publishes, and what the meters say/);
  });
});
