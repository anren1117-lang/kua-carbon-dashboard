// The dorm registry had two buildings in it that are not dorms.
//
// KUA's own campus map — the copy sitting in src/public/kua-campus-map.png,
// whose numbered legend matches buildings.js bmsNumber exactly — lists eleven
// STUDENT RESIDENTIAL buildings: 13 Densmore, 14 Bryant, 15 Dexter-Richards,
// 16 Rowe, 17 Welch, 18 Kilton, 19 Hall Farm, 20 Frost, 21 Kurth, 22 Chellis,
// 23 Mikula. The registry carried Barrette and Baxter instead of Hall Farm and
// Frost:
//
//   #9 Barrette -> "Barrette Campus Center, Doe Dining Common" (ACADEMIC).
//      48 residents. Its meter covers a dining hall, so it ranked FIRST on the
//      student dorm leaderboard at 2,834 kWh/resident and 6.2 kWh/sqft, where
//      every real dorm sits at 1.1-2.3 kWh/sqft. The energy data had been
//      disagreeing with the classification the whole time.
//   #1 Baxter   -> "Baxter: Head of School, Administration" (ADMINISTRATION).
//      14 residents on 1.3 kWh/sqft.
//
// buildingPositions.js already named #9 "Barrette / Doe". One file in the repo
// knew, and the one that drove the leaderboard did not.
//
// These tests pin the classification to the published map so it cannot drift
// back, and pin the headcount gap so that closing it requires a roster.

import { describe, it, expect } from 'vitest';
import { buildings } from '../data/buildings.js';
import { dorms, DORM_REGISTRY_BASIS } from '../data/dorms.js';
import { students } from '../data/students.js';

// KUA campus map legend, STUDENT RESIDENTIAL column, verbatim.
const PUBLISHED_RESIDENTIAL_BMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
// Same legend, buildings that are explicitly NOT residential.
const PUBLISHED_NON_RESIDENTIAL = { 9: 'Barrette Campus Center / Doe Dining', 1: 'Baxter: Head of School, Administration' };

describe('the dorm registry matches KUA published campus map', () => {
  it('no building KUA files as non-residential is categorised as a dorm', () => {
    for (const [bms, label] of Object.entries(PUBLISHED_NON_RESIDENTIAL)) {
      const b = buildings.find((x) => x.bmsNumber === Number(bms));
      expect(b, `building #${bms} (${label}) should exist`).toBeTruthy();
      expect(b.category, `#${bms} is ${label}`).not.toBe('Dorm');
      expect(b.dormPopulation).toBe(0);
    }
  });

  it('every Dorm-categorised building is on the published residential list', () => {
    buildings.filter((b) => b.category === 'Dorm').forEach((b) => {
      expect(PUBLISHED_RESIDENTIAL_BMS, `${b.name} (#${b.bmsNumber})`)
        .toContain(b.bmsNumber);
    });
  });

  it('the registry covers all eleven published residences', () => {
    expect(dorms.length).toBe(PUBLISHED_RESIDENTIAL_BMS.length);
    // nine modeled with a building, two carried as unmodeled
    expect(dorms.filter((d) => d.modeled !== false).length).toBe(9);
    expect(dorms.filter((d) => d.modeled === false).map((d) => d.name).sort())
      .toEqual(['Frost Dorm', 'Hall Farm Dorm']);
  });

  it('a bed count is not treated as a census', () => {
    // kua.org, 22 Nov 2024: Kilton 14 -> 32 beds, Welch -> 18 student beds.
    const kilton = dorms.find((d) => d.id === 'd_kilton');
    expect(kilton.population).toBe(32);
    const welch = dorms.find((d) => d.id === 'd_welch');
    expect(welch.population).toBe(18);
    // and the basis block says plainly that these came from bed counts
    expect(DORM_REGISTRY_BASIS.bedCountSource).toMatch(/kua\.org/);
    expect(DORM_REGISTRY_BASIS.perDormHeadcountsPublished).toBe(false);
  });

  it('the boarding gap is recorded, and correcting the map widened it', () => {
    const modeledSum = dorms.filter((d) => d.modeled !== false)
      .reduce((t, d) => t + d.population, 0);
    expect(modeledSum).toBe(169);
    expect(DORM_REGISTRY_BASIS.publishedBoarders).toBe(258);
    // 228 - 258 was a 30-student gap; removing the dining hall and the admin
    // building took it to 89. A correction that makes a disclosure look worse
    // is the one most likely to be right.
    expect(DORM_REGISTRY_BASIS.publishedBoarders - modeledSum).toBeGreaterThan(30);
  });

  it('no synthetic student is housed in a dorm we cannot model', () => {
    const unmodeled = new Set(dorms.filter((d) => d.modeled === false).map((d) => d.id));
    const stranded = students.filter((s) => unmodeled.has(s.dormId));
    expect(stranded).toEqual([]);
    // and every student still lands in a real dorm
    const ids = new Set(dorms.map((d) => d.id));
    students.forEach((s) => expect(ids.has(s.dormId)).toBe(true));
  });

  it('an unknown headcount never renders as a zero ranking', () => {
    // population null must not survive into a per-resident number. The guards
    // are `> 0` filters and a `?? -1` sort key; this asserts the data shape
    // they depend on rather than trusting them.
    dorms.filter((d) => d.modeled === false).forEach((d) => {
      expect(d.population).toBeNull();
      expect(d.population > 0).toBe(false);
    });
  });
});
