// Personal carbon-footprint estimator. Pure functions, all assumptions
// inline so a curious student / teacher can audit the math.
//
// Scope: deliberately small + transparent. Five inputs that capture
// the bulk of a KUA student's controllable footprint (commute,
// flights, diet, dorm thermostat, showers). Excludes things they
// can't easily change (heating fuel for the whole campus, food-
// supply-chain emissions that aren't tied to their personal choices).
//
// All factors sourced from data the dashboard already cites:
//   - EPA GHG Emission Factors Hub (gasoline, beef, electricity)
//   - DEFRA / ICAO (aviation per-pax-km)
//   - ISO-NE 2024 grid mix (electricity for hot water / heating)
//
// Output is per-year mtCO₂e + a per-component breakdown so the UI
// can show "your beef-eating accounts for 1.2 mt of your 4.8 mt."

import { KG_PER_KWH } from '../data/gridMix.js';
import { INSTRUCTIONAL_DAYS, STUDENT_RESIDENCY_WEEKS } from '../data/academicCalendar.js';

// Per-mile car emissions. EPA GHG Emission Factors Hub 2025, Table 10
// (Scope 3 Cat 6 Business Travel / Cat 7 Employee Commuting), Passenger
// Car, distance-based: 0.297 kg CO2 + 0.0059 g CH4 + 0.0053 g N2O per
// vehicle-mile = 0.2986 kg CO2e/mi at AR5 GWPs.
//
// Was 0.40, from EPA's "typical passenger vehicle" page (~400 g/mi at
// 22.2 mpg). Both are EPA and both are real; they answer different
// questions — the fleet average ON THE ROAD versus the factor EPA
// publishes for commuting inventories. This file computes a commute, so
// it takes the commuting factor. The gap is stated rather than hidden.
const KG_PER_MILE_CAR = 0.2986;
// Was 170 here while the institutional inventory assumed 180 for the same
// commute — about 6% apart, and both numbers visible to the same student.
// One source now; see academicCalendar.js for why it is two constants, not one.
const SCHOOL_DAYS_PER_YEAR = INSTRUCTIONAL_DAYS;

// Per-round-trip averages. The international figure was 2.5, which sat BELOW
// all four published methods in geographicEstimates.js (4.00 ICAO+DEFRA
// weighted / 3.63 explicit source-country split / 3.13 Yale benchmark / 4.06
// two-RT-plus-summer). 3.7 is the central of that range, so the calculator a
// student audits now agrees with the inventory the school publishes.
// At ~1.6 RTs/yr that implies ~6 mtCO₂e/yr for an international boarder.
const MT_PER_DOMESTIC_FLIGHT = 0.6;
const MT_PER_INTL_FLIGHT     = 3.7;

// Beef per kg: 99.5 kg CO₂e (Poore & Nemecek via OWID, beef herd, full
// supply chain). A "beef serving" is ~150 g — call it ~15 kg CO₂e per
// serving. Was 9, built on the superseded 60 kg/kg figure — Phase 405.
const KG_PER_BEEF_SERVING = 15;
// Was 52 — a full calendar year of campus beef and dorm showers for students
// who go home for summer, winter and spring breaks. The page invites students
// to "audit + push back on" each assumption, so this one is now both smaller
// and stated in the rows it drives. See academicCalendar.js for the bounds.
const WEEKS_PER_YEAR = STUDENT_RESIDENCY_WEEKS;

// Dorm thermostat impact: a degree of setback during winter saves
// ~3% of heating energy. KUA heats ~340 students with ~1,290 mt of
// heating-fuel scope-1 emissions/yr → ~3.8 mt/student. A typical
// dorm setback (2-3°F when not in room) saves ~7%.
const MT_PER_STUDENT_HEATING_BASELINE = 3.8;
const THERMOSTAT_BONUS = { 'always_on': 0, 'turn_down_when_out': -0.07, 'off_when_out': -0.10 };

// Per-shower energy: ~2 kWh electric for a typical 8-min shower (hot water
// heating dominates), priced at the campus grid factor. Imported rather than
// re-typed: the header promises these factors come from what the dashboard
// already cites, and a hardcoded copy is how that promise stops being true.
const KG_PER_SHOWER = 2 * KG_PER_KWH;

/**
 * @param {object} inputs
 * @param {'day'|'us_boarding'|'international'} inputs.studentType
 * @param {number=} inputs.commuteMilesOneWay  Only used for day students.
 * @param {number=} inputs.flightsPerYear      Round trips (not legs).
 * @param {'never'|'weekly'|'few_times_week'|'daily'} inputs.beefFrequency
 * @param {'always_on'|'turn_down_when_out'|'off_when_out'} inputs.thermostatHabit
 * @param {number=} inputs.showersPerWeek      Default 7.
 * @returns {{
 *   totalMt: number,
 *   components: { label: string, mt: number, note: string }[],
 *   suggestions: string[],
 * }}
 */
export function estimatePersonalFootprint(inputs = {}) {
  const studentType = inputs.studentType || 'day';
  const commute = Number.isFinite(Number(inputs.commuteMilesOneWay)) ? Math.max(0, Number(inputs.commuteMilesOneWay)) : 0;
  const flights = Number.isFinite(Number(inputs.flightsPerYear)) ? Math.max(0, Number(inputs.flightsPerYear)) : 0;
  const showers = Number.isFinite(Number(inputs.showersPerWeek)) ? Math.max(0, Number(inputs.showersPerWeek)) : 7;

  // Commute (day students only — boarders walk).
  const commuteKg = studentType === 'day'
    ? commute * 2 * SCHOOL_DAYS_PER_YEAR * KG_PER_MILE_CAR
    : 0;
  const commuteMt = commuteKg / 1000;

  // Flights — international students default to long-haul, US boarders to domestic.
  const flightMt = studentType === 'international'
    ? flights * MT_PER_INTL_FLIGHT
    : studentType === 'us_boarding'
      ? flights * MT_PER_DOMESTIC_FLIGHT
      : flights * MT_PER_DOMESTIC_FLIGHT; // day students who travel still fly domestic-ish

  // Beef.
  const beefServingsPerWeek =
    inputs.beefFrequency === 'never'          ? 0
    : inputs.beefFrequency === 'weekly'         ? 1
    : inputs.beefFrequency === 'few_times_week' ? 3
    : inputs.beefFrequency === 'daily'          ? 7
    : 1;
  const beefMt = (beefServingsPerWeek * WEEKS_PER_YEAR * KG_PER_BEEF_SERVING) / 1000;

  // Thermostat — boarders only (day students don't control campus heating).
  const thermostatPct = THERMOSTAT_BONUS[inputs.thermostatHabit] ?? 0;
  const thermostatMt = (studentType === 'us_boarding' || studentType === 'international')
    ? thermostatPct * MT_PER_STUDENT_HEATING_BASELINE
    : 0;

  // Showers — proxy for personal hot-water + electricity. Default 7/week.
  const showerKg = showers * WEEKS_PER_YEAR * KG_PER_SHOWER;
  const showerMt = showerKg / 1000;

  const components = [
    {
      label: 'Commute (driving to school)',
      mt: round2(commuteMt),
      note: studentType === 'day'
        ? `${commute}-mile one-way commute × ${SCHOOL_DAYS_PER_YEAR} school days × 2 × ${KG_PER_MILE_CAR} kg/mile`
        : 'Boarders walk — no commute emissions',
    },
    {
      label: 'Flights home',
      mt: round2(flightMt),
      note: studentType === 'international'
        ? `${flights} round trip${flights === 1 ? '' : 's'} × ${MT_PER_INTL_FLIGHT} mt (international avg)`
        : `${flights} round trip${flights === 1 ? '' : 's'} × ${MT_PER_DOMESTIC_FLIGHT} mt (domestic avg)`,
    },
    {
      label: 'Beef in your diet',
      mt: round2(beefMt),
      note: `${beefServingsPerWeek} serving${beefServingsPerWeek === 1 ? '' : 's'}/week × ${WEEKS_PER_YEAR} weeks on campus × ~${KG_PER_BEEF_SERVING} kg CO₂e per serving`,
    },
    {
      label: 'Dorm thermostat habit',
      mt: round2(thermostatMt),
      note: studentType === 'day'
        ? 'Day students don\'t control campus heating'
        : thermostatPct === 0
          ? 'No reduction vs baseline ' + MT_PER_STUDENT_HEATING_BASELINE + ' mt per boarder'
          : `${Math.round(Math.abs(thermostatPct) * 100)}% reduction vs baseline ${MT_PER_STUDENT_HEATING_BASELINE} mt per boarder`,
    },
    {
      label: 'Showers (hot water + electricity)',
      mt: round2(showerMt),
      note: `${showers} showers/week × ${WEEKS_PER_YEAR} weeks on campus × ~${(KG_PER_SHOWER).toFixed(2)} kg per shower (term-time only — breaks excluded)`,
    },
  ];

  const totalMt = round2(components.reduce((s, c) => s + c.mt, 0));

  // Suggestions are derived from which components dominate. Show
  // the top 2 reducible items, ignoring rows that are already
  // optimized (e.g. boarder who already shuts off thermostat).
  const reducible = components
    .filter((c) => c.mt > 0.1)
    .filter((c) => {
      if (c.label.includes('Beef') && beefServingsPerWeek === 0) return false;
      if (c.label.includes('thermostat') && inputs.thermostatHabit === 'off_when_out') return false;
      return true;
    })
    .sort((a, b) => b.mt - a.mt)
    .slice(0, 2);

  const suggestionsByLabel = {
    'Commute (driving to school)': commute > 0
      ? `Carpool one day a week — that's ~${round2(commuteMt * (1 / 5))} mt/year off your commute share.`
      : null,
    'Flights home': flights > 0
      ? `One fewer round trip per year cuts ~${round2(studentType === 'international' ? MT_PER_INTL_FLIGHT : MT_PER_DOMESTIC_FLIGHT)} mt.`
      : null,
    'Beef in your diet': beefServingsPerWeek > 1
      ? `Swap two beef meals a week for chicken or beans — saves ~${round2(beefMt * (2 / beefServingsPerWeek))} mt/year.`
      : beefServingsPerWeek === 1
        ? `Skip beef one week a month — saves ~${round2(beefMt / 4)} mt/year.`
        : null,
    'Dorm thermostat habit': (studentType === 'us_boarding' || studentType === 'international') && inputs.thermostatHabit !== 'off_when_out'
      ? `Turn heat off (not just down) when leaving for class — saves ~${round2(MT_PER_STUDENT_HEATING_BASELINE * 0.10)} mt/year.`
      : null,
    'Showers (hot water + electricity)': showers > 5
      ? `Shorter showers (5 min instead of 10) roughly halves this row.`
      : null,
  };

  const suggestions = reducible
    .map((c) => suggestionsByLabel[c.label])
    .filter(Boolean);

  return { totalMt, components, suggestions };
}

function round2(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

// Reference numbers for the UI to compare against.
export const FOOTPRINT_REFERENCE = {
  kuaPerStudentNetMt: 5.0,   // Per-student net (gross - sinks) — from /executive
  usAdultAvgMt: 16,          // US per-capita ~16 mt/yr (EPA / WRI)
  parisAlignedMt: 2,         // 1.5°C-aligned per-capita target by 2030 (IPCC SR1.5)
};

// "Average behavior" inputs per student type — used to compute the
// typical-footprint baseline that the comparison panel renders. These
// are deliberately central, not best-case or worst-case.
const TYPICAL_BEHAVIOR = {
  day: {
    studentType: 'day',
    commuteMilesOneWay: 7,
    flightsPerYear: 0,
    beefFrequency: 'weekly',
    thermostatHabit: 'always_on', // day students don't control campus heating
    showersPerWeek: 7,
  },
  us_boarding: {
    studentType: 'us_boarding',
    commuteMilesOneWay: 0,
    flightsPerYear: 2,
    beefFrequency: 'weekly',
    thermostatHabit: 'turn_down_when_out',
    showersPerWeek: 7,
  },
  international: {
    studentType: 'international',
    commuteMilesOneWay: 0,
    flightsPerYear: 2,
    beefFrequency: 'weekly',
    thermostatHabit: 'turn_down_when_out',
    showersPerWeek: 7,
  },
};

/**
 * Returns the typical/average footprint for a given student type by
 * running the estimator against a central-case behavior profile.
 * Used by /your-footprint to draw the "you vs similar students"
 * comparison.
 *
 * @param {'day'|'us_boarding'|'international'} studentType
 * @returns {{ totalMt: number, label: string }}
 */
export function typicalFootprintFor(studentType) {
  const inputs = TYPICAL_BEHAVIOR[studentType] || TYPICAL_BEHAVIOR.day;
  const { totalMt } = estimatePersonalFootprint(inputs);
  const labels = {
    day:           'Average day student',
    us_boarding:   'Average US boarder',
    international: 'Average international boarder',
  };
  return { totalMt, label: labels[studentType] || labels.day };
}

/** All three typical footprints — useful for showing the full peer spectrum. */
export function allTypicalFootprints() {
  return [
    typicalFootprintFor('day'),
    typicalFootprintFor('us_boarding'),
    typicalFootprintFor('international'),
  ];
}
