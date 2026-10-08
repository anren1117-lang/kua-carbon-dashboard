// The dorm leaderboard ranked 9 of KUA's 11 residences and said nothing.
//
// Phase 490 established that Hall Farm and Frost are real student residences
// with no building, meter or published headcount in this repo, and correctly
// excluded them from per-resident rankings — a dorm with no meter would
// otherwise rank at 0 kWh and read as the greenest house on campus. The
// exclusion was right. The silence was not.
//
// On a COMPETITIVE surface that is the worst place to be silent. A student in
// Hall Farm or Frost opens /student-challenges, finds no dorm of theirs on
// either leaderboard, and is given no reason. The page even contradicted
// itself in the headline: "Active dorms: 11" sat directly above a list of 9.
//
// And the ranked dorms house 169 of 247 boarders — 68%. A leaderboard covering
// two thirds of the boarding population is fine; presenting it as the whole
// school is not.
//
// Both leaderboards now name the missing dorms and state the coverage, derived
// so neither can drift from the registry.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dorms, DORM_REGISTRY_BASIS } from '../data/dorms.js';

const src = readFileSync(resolve(process.cwd(), 'pages/StudentChallenges.js'), 'utf8');

const ranked = dorms.filter((d) => d.modeled !== false);
const unranked = dorms.filter((d) => d.modeled === false);
const rankedResidents = ranked.reduce((t, d) => t + (d.population || 0), 0);

describe('a leaderboard that ranks part of the school says so', () => {
  it('there really is a gap worth disclosing', () => {
    expect(unranked.length).toBeGreaterThan(0);
    expect(ranked.length).toBeLessThan(dorms.length);
    expect(rankedResidents).toBeLessThan(DORM_REGISTRY_BASIS.boarders);
  });

  it('the coverage is a real fraction, not a rounding artefact', () => {
    const pct = (rankedResidents / DORM_REGISTRY_BASIS.boarders) * 100;
    expect(pct).toBeGreaterThan(50);   // most of the school
    expect(pct).toBeLessThan(90);      // but visibly not all of it
  });

  it('the page names the unranked dorms rather than filtering silently', () => {
    expect(src).toContain('unrankedDorms');
    expect(src).toMatch(/not ranked/);
    // and explains why they are absent, not merely that they are
    expect(src).toMatch(/no meter, floor area or headcount/);
  });

  it('it states what share of boarders the ranking covers', () => {
    expect(src).toContain('boarderCoveragePct');
    expect(src).toContain('DORM_REGISTRY_BASIS.boarders');
    expect(src).toMatch(/not all of it/);
  });

  it('the headline count no longer contradicts the list below it', () => {
    // was "Active dorms: 11" above nine ranked rows
    expect(src).not.toMatch(/label: 'Active dorms', value: dorms\.length/);
    expect(src).toMatch(/Dorms ranked/);
    expect(src).toMatch(/\$\{rankedDorms\.length\} of \$\{dorms\.length\}/);
  });

  it('the figures are derived from the registry, not typed', () => {
    for (const literal of ['169', '247', '68%']) {
      // the disclosure must not hardcode what the registry already knows
      const inProse = new RegExp(`>\\s*${literal}\\b`);
      expect(src, literal).not.toMatch(inProse);
    }
  });

  it('excluding an unmeterable dorm from the RANKING is still correct', () => {
    // the fix is disclosure, not inclusion — a dorm with no meter must not
    // be ranked at 0 kWh and appear to be the greenest on campus
    unranked.forEach((d) => {
      expect(d.population).toBeNull();
      expect(d.buildingId).toBeNull();
    });
  });
});
