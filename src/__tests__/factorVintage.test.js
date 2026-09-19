// Scope 2 has been able to say how stale its grid factor is since Phase 392
// ("eGRID2023 — 3 years older than the 2026 electricity it prices"). Scope 1
// and Scope 3 could not, despite pricing 2026 activity with 2024 editions.
//
// The trap this guards: a naive version announces that Scope 3 runs on
// EIGHT-YEAR-OLD factors, because its food rows say 2018. Three different
// things share the `year` column —
//
//   annual-edition   EPA Hub / eGRID / DEFRA / ISO-NE. A newer edition exists
//                    or will, so the gap is REAL staleness.
//   dataset-version  EPA Supply Chain v1.3 (2022 = USD basis year). The version
//                    is current; there is no edition to fall behind.
//   publication      Poore & Nemecek 2018, IPCC AR6. Current best source; the
//                    year is provenance, not decay.
//
// These assert the CLASSIFICATION, not merely that a year exists —
// factorTableConsistency.test.js already checks presence, and that would pass
// no matter how the years were interpreted.

import { describe, it, expect } from 'vitest';
import {
  emissionFactors, getFactorByKey, vintageKindOf, factorVintageFor,
  describeFactorVintage, SCOPE1_FACTOR_KEYS, SCOPE3_FACTOR_KEYS,
} from '../data/emissionFactors.js';

describe('a factor year means three different things', () => {
  it.each([
    ['fuel', 'heating_oil_no2', 'annual-edition'],
    ['fuel', 'gasoline',        'annual-edition'],
    ['waste', 'landfill_mixed', 'annual-edition'],
    ['travel', 'air_long_haul', 'annual-edition'],
    ['procurement', 'paper',    'dataset-version'],
    ['procurement', 'apparel',  'dataset-version'],
    ['food', 'beef',            'publication'],
    ['food', 'chicken',         'publication'],
    ['refrigerant', 'r410a',    'publication'],
  ])('%s/%s is %s', (cat, sub, kind) => {
    expect(vintageKindOf(getFactorByKey(cat, sub))).toBe(kind);
  });

  it('every row classifies — an unclassified source would be silently dropped', () => {
    const stray = emissionFactors.filter((r) => vintageKindOf(r) === 'unclassified');
    expect(stray.map((r) => `${r.category}/${r.subcategory}: ${r.source}`)).toEqual([]);
  });

  it('IPCC AR6 is dated by its publication year, not the year it was checked', () => {
    // These read 2024 until Phase 437, which would have made the Scope 1 page
    // state a false publication year for AR6 (published 2021).
    expect(getFactorByKey('refrigerant', 'r410a').year).toBe(2021);
    expect(getFactorByKey('refrigerant', 'r134a').year).toBe(2021);
    // ...and the GWP values are untouched, so no emissions figure moved.
    expect(getFactorByKey('refrigerant', 'r410a').kgco2e_per_unit).toBe(2256);
    expect(getFactorByKey('refrigerant', 'r134a').kgco2e_per_unit).toBe(1530);
  });
});

describe('the vintage summary does not overstate staleness', () => {
  it('Scope 3 reports the EDITION gap, not the 2018 study year', () => {
    const v = factorVintageFor(SCOPE3_FACTOR_KEYS, 2026);
    expect(v.oldestEditionYear).toBe(2024);
    expect(v.yearsStale).toBe(2);          // NOT 8
    expect(v.studyYears).toContain(2018);  // stated separately, as provenance
    expect(describeFactorVintage(v)).toMatch(/2 years older/);
    expect(describeFactorVintage(v)).not.toMatch(/8 years/);
  });

  it('Scope 1 reports its own edition gap', () => {
    const v = factorVintageFor(SCOPE1_FACTOR_KEYS, 2026);
    expect(v.yearsStale).toBe(2);
    expect(describeFactorVintage(v)).toMatch(/provenance rather than an edition/);
  });

  it('versioned datasets are counted, not silently dropped', () => {
    // EPA Supply Chain v1.3 is neither an aging edition nor a study. Before
    // this was counted, such a factor vanished from the summary entirely.
    const v = factorVintageFor([['procurement', 'paper'], ['procurement', 'apparel']], 2026);
    expect(v.versionCount).toBe(2);
    expect(v.versionLabels).toContain('v1.3');
    expect(v.oldestEditionYear).toBeNull();
    expect(describeFactorVintage(v)).toMatch(/no annual edition to fall behind/);
  });

  it('says nothing rather than something wrong when there is nothing to say', () => {
    expect(describeFactorVintage(null)).toBeNull();
    expect(describeFactorVintage(factorVintageFor([], 2026))).toBeNull();
  });
});
