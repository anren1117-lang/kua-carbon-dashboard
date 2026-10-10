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
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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
    // The roster the school supplied is the authority; the published figure is
    // kept beside it because the two disagree and that is worth showing.
    expect(DORM_REGISTRY_BASIS.boarders).toBe(247);
    expect(DORM_REGISTRY_BASIS.publishedBoarders).toBe(258);
    // History: 228 against the published 258 was a 30-student gap; removing
    // the dining hall and the admin building took it to 89; the roster the
    // school supplied (247 boarding, not 258) brings it to 78. A correction
    // that makes a disclosure look worse is the one most likely to be right.
    expect(DORM_REGISTRY_BASIS.boarders - modeledSum).toBeGreaterThan(30);
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

// ─── the headcount gap, disclosed where it matters ──────────────────────
//
// /dorm-leaderboard ranks dorms by kWh PER STUDENT and never mentioned that
// its populations account for 169 of the roster's 247 boarders. The registry
// names two unmodelled dorms, and it is tempting to leave the gap there — but
// the arithmetic refuses: 78 boarders over two farmhouse dorms is 39 each,
// which would make both LARGER than the biggest dorm on campus. So the gap is
// not two missing buildings, it is populations that are themselves low, and a
// population that is too low makes that dorm's per-student figure too HIGH.
//
// The page says so now, with every number derived. This holds it that way.

describe('the dorm headcount gap is disclosed where it matters', () => {
  const page = readFileSync(resolve(process.cwd(), 'pages/DormLeaderboard.js'), 'utf8');
  const modelled = dorms.reduce((t, d) => t + d.population, 0);
  const gap = DORM_REGISTRY_BASIS.boarders - modelled;

  it('the gap is real and large enough to matter', () => {
    expect(gap).toBeGreaterThan(50);
    expect(modelled).toBeLessThan(DORM_REGISTRY_BASIS.boarders);
  });

  it('the two unmodelled dorms genuinely cannot hold it', () => {
    // the claim the disclosure rests on. Assert the arithmetic, not the
    // sentence, so that if it ever stops being true this fails rather than
    // leaving the prose asserting something false.
    const perUnmodelled = gap / DORM_REGISTRY_BASIS.unmodeledDorms.length;
    const largest = Math.max(...dorms.map((d) => d.population));
    expect(perUnmodelled).toBeGreaterThan(largest);
  });

  it('the leaderboard discloses it, derived rather than typed', () => {
    expect(page).toContain('Headcounts are not published per dorm');
    expect(page).toContain('modelledBoarders');
    expect(page).toContain('headcountGap');
    expect(page).toContain('largestDormName');
  });

  it('no figure in the disclosure is a literal', () => {
    for (const n of [String(modelled), String(gap), String(DORM_REGISTRY_BASIS.boarders)]) {
      expect(page, `${n} appears as a literal in the disclosure`)
        .not.toMatch(new RegExp(`sum to ${n}\\b|difference: ${n}\\b`));
    }
  });

  it('names the consequence for the per-student column, not just the gap', () => {
    // a disclosure that states a discrepancy without saying which way it bends
    // the published figure leaves the reader no better off
    expect(page.replace(/\s+/g, ' ')).toMatch(/too low makes a dorm's kWh per student too high/);
    expect(page.replace(/\s+/g, ' ')).toMatch(/comparison between dorms rather than a figure to quote/);
  });

  it('and says what would settle it', () => {
    expect(page).toMatch(/Per-dorm rosters would settle it/);
  });
});
