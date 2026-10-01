// Phase 491 corrected the dorm leaderboard. The same roll-up feeds /campus-map
// and /compare-buildings for every building, and there the error is not merely
// an omission — it is a reordering.
//
// Heating intensity varies by category (Dorm 75, Academic 55, Athletic 45,
// Dining 65 kBtu/sqft/yr), so dropping heat does not scale buildings down by a
// common factor. "Top 5 by total emissions — where the absolute most carbon
// comes from" named Miller first when counting heat puts Whittemore first, and
// listed Fitch fifth where Flickinger belongs.
//
// The corroboration that this heat model is the same one the inventory already
// uses, rather than a second invention: it sums to within ~6% of the campus
// Scope 1 heating figure scopeTotals.js derives independently.
//
// Note the opposite call from Phase 491, deliberately. The dorm leaderboard
// does NOT fold heat in, because it is competitive and the heat term is floor
// area times one constant — it would rank square footage. The map DOES publish
// the total, because it is descriptive, heat varies by category and area, and
// omitting three quarters of the answer is the bigger error. Same data, two
// surfaces, two answers, and the reason is what each surface is for.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BUILDING_ENERGY_BASIS, BUILDING_ENERGY_SPLIT, CAMPUS_HEAT_SHARE_PCT,
  TOP5_BY_ELECTRICITY, TOP5_BY_TOTAL, TOP5_DISAGREEMENT, modelledHeatMt,
} from '../data/buildingEnergyBasis.js';
import { modelledHeatMt as dormCopy } from '../data/dormEnergyBasis.js';
import { SCOPE1_HEATING_MT } from '../data/scopeTotals.js';
import { HEATING_KBTU_PER_SQFT } from '../data/geographicEstimates.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');

describe('the campus map says what it measures', () => {
  it('there is ONE heat model, not two', () => {
    expect(dormCopy).toBe(modelledHeatMt);
    expect(read('data/dormEnergyBasis.js')).not.toMatch(/export function modelledHeatMt/);
  });

  it('the modelled heat agrees with the inventory it came from', () => {
    // same method as Scope 1 campus heating, so it must land close to it
    const delta = Math.abs(BUILDING_ENERGY_BASIS.modelledHeatMt - SCOPE1_HEATING_MT) / SCOPE1_HEATING_MT;
    expect(delta).toBeLessThan(0.15);
    expect(BUILDING_ENERGY_BASIS.heatIsModelled).toBe(true);
    expect(BUILDING_ENERGY_BASIS.electricityIsMetered).toBe(true);
  });

  it('heat is the dominant term campus-wide', () => {
    expect(CAMPUS_HEAT_SHARE_PCT).toBeGreaterThan(60);
    expect(BUILDING_ENERGY_BASIS.modelledHeatMt)
      .toBeGreaterThan(BUILDING_ENERGY_BASIS.meteredElectricityMt);
  });

  it('counting heat really does reorder the ranking', () => {
    // the whole argument rests on this, so assert it rather than assume it
    expect(TOP5_DISAGREEMENT.firstPlaceDiffers).toBe(true);
    expect(TOP5_BY_ELECTRICITY[0].id).not.toBe(TOP5_BY_TOTAL[0].id);
    expect(TOP5_DISAGREEMENT.withHeat.length).toBeGreaterThan(0);
    expect(TOP5_DISAGREEMENT.electricityOnly.length).toBeGreaterThan(0);
  });

  it('it reorders BECAUSE intensities differ by category', () => {
    // if every category shared an intensity, heat would be a constant multiple
    // of sqft and could not change any ranking that sqft did not already set
    const distinct = new Set(Object.values(HEATING_KBTU_PER_SQFT));
    expect(distinct.size).toBeGreaterThan(1);
    // two equal-area buildings of different category must differ in heat
    expect(modelledHeatMt(10000, 'Dorm')).not.toBeCloseTo(modelledHeatMt(10000, 'Athletic'), 3);
  });

  it('every building carries both terms', () => {
    expect(BUILDING_ENERGY_SPLIT.length).toBeGreaterThan(10);
    BUILDING_ENERGY_SPLIT.forEach((r) => {
      expect(r.heatMt, r.name).toBeGreaterThan(0);
      // the published parts must add to the published total, exactly
      expect(r.totalMt).toBe(+(r.elecMt + r.heatMt).toFixed(1));
    });
  });

  it('no surface still calls an electricity figure total carbon', () => {
    const cm = read('pages/CampusMap.js');
    expect(cm).not.toMatch(/Where the absolute most carbon comes from/);
    expect(cm).not.toMatch(/title="Top 5 by total emissions"/);
    expect(cm).not.toMatch(/title="Campus map — emissions distribution"/);
    expect(cm).not.toMatch(/'Annual emissions'/);
    expect(cm).toContain('CAMPUS_HEAT_SHARE_PCT');
    // and the disclosure names the reordering, not just the omission
    expect(cm).toContain('TOP5_DISAGREEMENT');

    const cb = read('pages/CompareBuildings.js');
    expect(cb).not.toMatch(/label="Annual emissions"/);
    expect(cb).not.toMatch(/>Annual emissions</);

    // Found by the commit gate, not by this list: /buildings/:id labelled the
    // same electricity figure "Annual emissions" too. A repo-wide sweep is
    // bounded by the repo; a test's file list is bounded by what I noticed.
    const bd = read('pages/BuildingDetail.js');
    expect(bd).not.toMatch(/label="Annual emissions"/);
  });

  it('the omitted share is interpolated, never typed', () => {
    const cm = read('pages/CampusMap.js');
    expect(cm).toMatch(/\$\{CAMPUS_HEAT_SHARE_PCT\}%/);
    expect(cm).not.toMatch(/\b\d{2}% of the campus building footprint/);
  });
});
