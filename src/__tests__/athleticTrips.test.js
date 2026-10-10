// The first real team-travel activity data this repo has had — one week of
// away games from the athletics schedule, 2026-09-28.
//
// TWO THINGS HAD TO BE DECIDED BEFORE ANY OF IT WAS ENTERED.
//
// 1. It is Scope 1, not Scope 3. The request was to add it to Scope 3, but KUA
//    owns the buses and vans (fleetVehicles), so the fuel is direct combustion
//    and already sits in the "Fleet vehicles" Scope 1 line. Entering it as
//    Scope 3 would count the same diesel twice. Scope 3 would be correct only
//    for a chartered coach — someone else's vehicle, someone else's fuel — and
//    the schedule does not say which trips were chartered.
//
// 2. /transportation already had this error in miniature. "Fleet emissions"
//    and "School trips (ground)" were rendered side by side as peers, but
//    ground school trips are driven BY the fleet: the second is a subset of
//    the first. Nothing on the page said so, so the two read as separate
//    sources a reader would add together.
//
// What the schedule contains: team, home/away, host, game time, departure and
// return. What it does NOT contain: mileage, vehicle assignment, headcount.
// Those three are marked unknown rather than filled in — eight rows of
// "28 passengers" would look like data and be invention.
//
// The payoff is a cross-check on an assumption that was never tested: 1,070
// miles in ONE week against 43,700 modelled for the entire fleet for a year.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  athleticTrips, ATHLETIC_WEEK_MILES, ATHLETIC_TRIPS_BASIS, ATHLETIC_WEEK_DAYS,
  tripSpeedCheck, SPEED_CHECK_PASSES, PLAUSIBLE_MPH,
} from '../data/athleticTrips.js';
import { fleetVehicles } from '../data/transportation.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');

describe('the athletics week is recorded as what it is', () => {
  it('carries every away trip in the schedule, and no home games', () => {
    expect(athleticTrips).toHaveLength(8);
    expect(ATHLETIC_WEEK_DAYS).toBe(3);              // Wed, Fri, Sat
    expect(ATHLETIC_TRIPS_BASIS.homeGames).toBe(7);
    const dates = new Set(athleticTrips.map((t) => t.date));
    expect([...dates].sort()).toEqual(['2026-09-30', '2026-10-02', '2026-10-03']);
  });

  it('every trip carries the fields the schedule actually gave', () => {
    athleticTrips.forEach((t) => {
      expect(t.team, t.date).toBeTruthy();
      expect(t.destination, t.team).toBeTruthy();
      expect(t.departure, t.team).toMatch(/^\d{2}:\d{2}$/);
      expect(t.ret, t.team).toMatch(/^\d{2}:\d{2}$/);
      expect(t.roundTripMi, t.team).toBeGreaterThan(0);
    });
    expect(ATHLETIC_WEEK_MILES).toBe(athleticTrips.reduce((s, t) => s + t.roundTripMi, 0));
  });

  it('does NOT invent what the schedule omits', () => {
    expect(ATHLETIC_TRIPS_BASIS.milesAreEstimated).toBe(true);
    expect(ATHLETIC_TRIPS_BASIS.vehicleAssignmentKnown).toBe(false);
    expect(ATHLETIC_TRIPS_BASIS.passengerCountsKnown).toBe(false);
    // no row may carry a fabricated headcount or vehicle
    athleticTrips.forEach((t) => {
      expect(t.passengerCount, t.team).toBeUndefined();
      expect(t.mode, t.team).toBeUndefined();
    });
  });

  it('is scoped as Scope 1, with the double-count named', () => {
    expect(ATHLETIC_TRIPS_BASIS.scope).toMatch(/Scope 1/);
    expect(ATHLETIC_TRIPS_BASIS.scope).toMatch(/[Nn]ot Scope 3/);
    const src = read('data/athleticTrips.js');
    expect(src).toMatch(/double-count/i);
    expect(src).toMatch(/chartered/i);
  });

  it('the week is big enough to test the fleet assumption', () => {
    const fleetMi = fleetVehicles
      .filter((v) => /bus|van/i.test(v.type))
      .reduce((s, v) => s + v.annualMiles, 0);
    // 20 competition weeks is a conservative floor for a three-season school
    const lowAnnual = ATHLETIC_WEEK_MILES * 20;
    expect(lowAnnual / fleetMi).toBeGreaterThan(0.4);
    // which is the finding: athletics alone plausibly consumes most of it
    expect(ATHLETIC_WEEK_MILES).toBeGreaterThan(1000);
  });

  it('/transportation no longer presents a subset as a peer', () => {
    const src = read('pages/Transportation.js');
    expect(src).toMatch(/already inside fleet emissions/);
    expect(src).toContain('athleticTrips');
    // and the page states the scope rather than leaving it to be assumed
    expect(src).toMatch(/counting it twice|count it twice/i);
  });

  it('the estimated distances survive the schedule own timing', () => {
    // The distances are mine; departure and game time are the school's. A
    // badly wrong distance produces an absurd implied road speed.
    expect(SPEED_CHECK_PASSES).toBe(true);
    tripSpeedCheck.forEach((t) => {
      expect(t.impliedMph, `${t.team} -> ${t.destination}`).toBeGreaterThanOrEqual(PLAUSIBLE_MPH.min);
      expect(t.impliedMph, `${t.team} -> ${t.destination}`).toBeLessThanOrEqual(PLAUSIBLE_MPH.max);
    });
  });

  it('the check would catch a distance that is wrong', () => {
    const inBand = (mph) => mph >= PLAUSIBLE_MPH.min && mph <= PLAUSIBLE_MPH.max;
    expect(inBand(95)).toBe(false);     // mileage far too high
    expect(inBand(12)).toBe(false);     // mileage far too low
    expect(inBand(45)).toBe(true);
  });

  it('a passing speed check is still not a measurement', () => {
    expect(ATHLETIC_TRIPS_BASIS.milesAreEstimated).toBe(true);
    expect(ATHLETIC_TRIPS_BASIS.distancesSpeedChecked).toBe(true);
  });

  it('the long trip is flagged rather than assumed chartered', () => {
    const long = athleticTrips.filter((t) => t.longHaul);
    expect(long).toHaveLength(1);
    expect(long[0].destination).toBe('Wilbraham');
    // it really is the outlier that justifies the flag
    const others = athleticTrips.filter((t) => !t.longHaul).map((t) => t.roundTripMi);
    expect(long[0].roundTripMi).toBeGreaterThan(Math.max(...others) * 1.5);
  });
});

// ─── the long-haul footnote ─────────────────────────────────────────────
//
// The table marks long-haul rows with a `*`, and the footnote explaining it
// was buried in the last sentence of a dense 12px paragraph — the marker
// pointed at nothing a reader could find. Worse, it asserted "Wilbraham is
// the one trip long enough that a charter is plausible", which is a COUNT
// claim hardcoded in prose: add a second long-haul fixture and the sentence
// silently becomes false while every test still passes.
//
// It is derived now, and this is what holds it derived.

describe('the long-haul charter footnote', () => {
  const src = readFileSync(resolve(process.cwd(), 'pages/Transportation.js'), 'utf8');

  it('names no destination as a literal — it reads them from the data', () => {
    const longHaul = athleticTrips.filter((t) => t.longHaul);
    expect(longHaul.length).toBeGreaterThan(0);
    longHaul.forEach((t) => {
      // the destination may appear in the DATA, never typed into the page
      expect(src, `${t.destination} is hardcoded in Transportation.js`)
        .not.toContain(`${t.destination} is the one trip`);
    });
    expect(src).toContain('longHaulTrips');
  });

  it('the singular and plural forms are both present, chosen by count', () => {
    expect(src).toMatch(/longHaulTrips\.length === 1/);
    expect(src).toMatch(/is the one trip long enough/);
    expect(src).toMatch(/are long enough that a charter is plausible/);
  });

  it('the footnote is its own element, not the tail of a paragraph', () => {
    // tied to the table's `*` marker, with a visual rule
    const i = src.indexOf('A chartered coach would be');
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(Math.max(0, i - 900), i);
    expect(block).toContain('borderLeft');
    expect(block).toMatch(/longHaulTrips\.length > 0/);
  });

  it('names the boundary the asterisk exists to flag', () => {
    // a charter is Scope 3, an owned bus is Scope 1 — the whole point
    expect(src).toMatch(/Scope 3/);
    expect(src).toMatch(/Counted here as owned-fleet Scope 1/);
  });

  it('body text is not 12px — this renders on classroom Chromebooks', () => {
    const i = src.indexOf('Mileage is estimated road distance');
    expect(i).toBeGreaterThan(-1);
    const style = src.slice(Math.max(0, i - 220), i);
    expect(style).not.toMatch(/fontSize: 12\b/);
    expect(style).toMatch(/fontSize: 13/);
  });
});
