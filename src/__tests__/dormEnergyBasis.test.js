// Phase 490 took a dining hall off the dorm leaderboard. This is the same
// question asked of the metric rather than the roster: the leaderboard ranks
// dorms on electricity and nothing else.
//
// No heating fuel is attributed per building anywhere in this repo —
// buildingEmissions.js converts kWh with the grid factor and stops, and Scope 1
// heating is modelled campus-wide. Priced with the NH-CZ6 dorm intensity that
// Scope 1 already uses, heat is about four fifths of a dorm's footprint. So
// /buildings was calling it "Dorm energy comparison" and claiming it "flags the
// heaviest residential users", when it flags the heaviest users of the smaller
// fifth.
//
// The bias has a direction, which is what makes it worth fixing rather than
// just disclosing: an oil-heated dorm keeps its largest source off the board,
// while a dorm running heat pumps shows that heat as electricity and ranks
// worse for having electrified. Kilton — renovated and expanded 14 -> 32 beds —
// ranks heaviest on electricity per resident AND carries the lowest modelled
// heat share of any dorm. That is what partial electrification looks like from
// outside the building.
//
// The modelled heat is deliberately NOT folded into the ranking. It is floor
// area times one constant, identical for every dorm, so at ~80% weight it would
// convert a behaviour leaderboard into a ranking of square feet per resident —
// more complete-looking and less true. Published as context instead.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  DORM_ENERGY_BASIS, DORM_ENERGY_SPLIT, DORM_HEAT_SHARE_PCT,
  MOST_ELECTRIFIED_DORM, modelledHeatMt,
} from '../data/dormEnergyBasis.js';
import { HEATING_KBTU_PER_SQFT } from '../data/geographicEstimates.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');

describe('the dorm comparison says what it measures', () => {
  it('the omitted share is derived, large, and the dominant term', () => {
    expect(DORM_HEAT_SHARE_PCT).toBeGreaterThan(60);
    expect(DORM_HEAT_SHARE_PCT).toBeLessThan(95);
    expect(DORM_ENERGY_BASIS.modelledHeatMt).toBeGreaterThan(DORM_ENERGY_BASIS.electricityMt);
    // derived from the same intensity table Scope 1 uses, not a second copy
    expect(DORM_ENERGY_BASIS.heatMethod).toContain(String(HEATING_KBTU_PER_SQFT.Dorm));
    expect(modelledHeatMt(10000, 'Dorm')).toBeCloseTo(modelledHeatMt(5000, 'Dorm') * 2, 6);
  });

  it('every dorm is heat-dominated, so this is not one outlier', () => {
    expect(DORM_ENERGY_SPLIT.length).toBe(9);
    DORM_ENERGY_SPLIT.forEach((r) => {
      expect(r.heatSharePct, r.name).toBeGreaterThan(50);
      expect(r.elecMt).toBeGreaterThan(0);
    });
  });

  it('the most electrified dorm is the one the ranking punishes', () => {
    // lowest modelled heat share = most of its energy already electric
    expect(MOST_ELECTRIFIED_DORM.id).toBe('d_kilton');
    const worstOnElec = DORM_ENERGY_SPLIT
      .reduce((a, b) => (b.elecMt / b.residents > a.elecMt / a.residents ? b : a));
    // the same dorm tops electricity-per-resident — that is the bias, stated
    expect(worstOnElec.id).toBe(MOST_ELECTRIFIED_DORM.id);
  });

  it('the modelled heat is NOT folded into the ranking', () => {
    expect(DORM_ENERGY_BASIS.heatFoldedIntoRanking).toBe(false);
    expect(DORM_ENERGY_BASIS.whyNotFolded).toMatch(/square feet per resident/i);
    // the ranking surfaces must not import a combined total by the back door
    const sc = read('pages/StudentChallenges.js');
    expect(sc).not.toMatch(/heatMt/);
    const bl = read('pages/Buildings.js');
    expect(bl).not.toMatch(/heatMt/);
  });

  it('neither surface still calls an electricity ranking a carbon ranking', () => {
    const bl = read('pages/Buildings.js');
    expect(bl).not.toMatch(/flags the heaviest residential users/);
    expect(bl).not.toMatch(/title="Dorm energy comparison"/);
    expect(bl).toContain('DORM_HEAT_SHARE_PCT');

    const sc = read('pages/StudentChallenges.js');
    expect(sc).toContain('DORM_HEAT_SHARE_PCT');
    // the disclosure has to name electrification, not just say "electricity only"
    expect(sc).toMatch(/heat pumps/);
    expect(bl).toMatch(/heat pumps/);
  });

  it('the share quoted on the pages is the derived one, not a typed copy', () => {
    for (const rel of ['pages/Buildings.js', 'pages/StudentChallenges.js']) {
      const src = read(rel);
      // interpolated, never a literal percentage next to "footprint"
      expect(src, rel).toMatch(/\$\{DORM_HEAT_SHARE_PCT\}%/);
      expect(src, rel).not.toMatch(/\b\d{2}% of a dorm's estimated footprint/);
    }
  });
});
