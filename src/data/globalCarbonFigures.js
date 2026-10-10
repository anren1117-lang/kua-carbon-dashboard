/**
 * THE GLOBAL CARBON FIGURES — one source of truth for the numbers that are
 * about the world rather than about KUA.
 *
 * Why this file exists. proseFigures.test.js guards KUA's own headline totals
 * across fifteen surfaces, and guards the grid emission factor. It does not
 * guard the GLOBAL constants — atmospheric CO₂, annual world emissions, the
 * sink split, the remaining carbon budget — and those appear in more places
 * than KUA's figures do, in AP teaching content a student is asked to compute
 * from.
 *
 * The cost of that gap, found in one sweep:
 *
 *   - ~20 sites said "425 ppm (2024)" and "51% above pre-industrial". The
 *     year, the concentration AND the percentage were each wrong, and they
 *     were wrong in mutually inconsistent ways: 425/278 is 53%, not 51%, so
 *     the sentence did not even agree with itself.
 *   - Four sites had been updated to 426 ppm and the rest had not, so the
 *     same course contradicted itself between units.
 *   - The ocean and land sinks had been taught in the WRONG ORDER. GCB 2025
 *     assesses the 2015-2024 ocean sink at 29% and the land sink at 21%; the
 *     content taught ~25% ocean / ~30% land. An ordering claim, not a stale
 *     figure — the class that interpolation does not protect.
 *   - The cumulative airborne fraction (39% of 1850-2024 emissions) was
 *     conflated with the recent decadal one (~50%).
 *   - Cement was added to fossil AND counted separately, double-counting it,
 *     because GCB includes cement process emissions inside the fossil total.
 *
 * THE PAIRING RULE, which is the subtle one: the percentage above
 * pre-industrial is a FUNCTION of the concentration, so a year label, a ppm
 * value and a percentage must move together or the sentence contradicts
 * itself. 422.8 ppm (2024) is 52%; 425.6 ppm (2025) is 53%. Pairing 2024 with
 * 53%, or 2025 with 52%, is wrong even though both numbers are individually
 * real. So the percentage here is DERIVED and never typed.
 *
 * Sources are named per figure. Where two editions disagree, the figure says
 * which edition it came from, because "the current value" is not a stable
 * concept for a number that is re-assessed annually.
 */

/** Atmospheric CO₂. GCB 2025 = Friedlingstein et al., ESSD 18, 3211-3288. */
export const CO2_PPM_EXACT = 425.6;
export const CO2_PPM_YEAR = 2025;
export const CO2_PPM_BASIS = 'Global Carbon Budget 2025 preliminary estimate for the 2025 annual mean';

/** The 2024 annual mean, which GCB and NOAA/GML both give as 422.8 ± 0.1. */
export const CO2_PPM_2024 = 422.8;

/**
 * Pre-industrial baseline. IPCC AR6 WG1 Ch.2 assesses 278.3 ± 2.9 ppm for
 * 1750; GCB uses ~278. "280" is a common rounded shorthand and gives a
 * different percentage, so it is not used here.
 */
export const CO2_PREINDUSTRIAL_PPM = 278;

/** Rounded for prose. 426, not 425 — the 2025 figure, not last year's. */
export const CO2_PPM = Math.round(CO2_PPM_EXACT);

/**
 * DERIVED, never typed. This is the figure that was wrong three different ways
 * at once, and it is wrong the moment it is written down by hand.
 */
export const CO2_PERCENT_ABOVE_PREINDUSTRIAL =
  Math.round(((CO2_PPM_EXACT - CO2_PREINDUSTRIAL_PPM) / CO2_PREINDUSTRIAL_PPM) * 100);

/** The 2024 pairing, for any surface that wants the confirmed year. */
export const CO2_PERCENT_ABOVE_PREINDUSTRIAL_2024 =
  Math.round(((CO2_PPM_2024 - CO2_PREINDUSTRIAL_PPM) / CO2_PREINDUSTRIAL_PPM) * 100);

/** Annual emissions, GCB 2025. GtC converted at 44/12. */
export const C_TO_CO2 = 44 / 12;
export const FOSSIL_GTC_2025 = 10.4;
export const LAND_USE_GTC_2025 = 1.1;
export const TOTAL_GTC_2025 = 11.5;

const toCO2 = (gtc) => Math.round(gtc * C_TO_CO2 * 10) / 10;
export const FOSSIL_GTCO2 = Math.round(toCO2(FOSSIL_GTC_2025));        // 38
export const LAND_USE_GTCO2 = Math.round(toCO2(LAND_USE_GTC_2025));    // 4
export const TOTAL_GTCO2 = Math.round(toCO2(TOTAL_GTC_2025));          // 42

/**
 * Fossil emissions by source, 2024 shares (GCB 2025). Cement here is the
 * PROCESS emission and it sits INSIDE the fossil total — adding it to fossil
 * as a separate line double-counts, which is exactly what one unit did.
 */
export const FOSSIL_SHARES_2024 = [
  { source: 'Coal', percent: 41 },
  { source: 'Oil', percent: 32 },
  { source: 'Natural gas', percent: 21 },
  { source: 'Cement', percent: 4 },
  { source: 'Flaring and other', percent: 2 },
];
export const CEMENT_IS_INSIDE_FOSSIL = true;

/**
 * The carbon sinks over 2015-2024, as a share of TOTAL anthropogenic emissions
 * (fossil + land-use change). The ORDER matters and it reversed: the ocean is
 * now the larger sink.
 */
export const SINK_SHARES_RECENT_DECADE = {
  period: '2015-2024',
  oceanPercent: 29,
  landPercent: 21,
  airbornePercent: 50,
  basis: 'Global Carbon Budget 2025. Shares of TOTAL anthropogenic CO₂ emissions, including land-use change.',
};

/** Which sink is larger — derived, so prose cannot assert the old order. */
export const LARGER_SINK =
  SINK_SHARES_RECENT_DECADE.oceanPercent > SINK_SHARES_RECENT_DECADE.landPercent ? 'ocean' : 'land';

/**
 * The cumulative partition, 1850-2024. Quoted verbatim from GCB 2025:
 * "Emissions during the period 1850-2024 amounted to 745 ± 65 GtC and were
 * partitioned among the atmosphere (290 ± 5 GtC; 39 %), ocean (200 ± 40 GtC;
 * 27 %), and land (175 ± 50 GtC; 24 %)."
 *
 * These sum to 90%, not 100%. The remainder is the budget imbalance, which GCB
 * reports rather than hides, so nothing here should force it to close.
 */
export const CUMULATIVE_1850_2024 = {
  totalGtC: 745,
  atmosphereGtC: 290,
  oceanGtC: 200,
  landGtC: 175,
  atmospherePercent: 39,
  oceanPercent: 27,
  landPercent: 24,
  note: 'Sums to 90%; the remainder is the budget imbalance GCB reports rather than closes.',
};

/**
 * The cumulative airborne fraction (39%) is LOWER than the recent decadal one
 * (~50%), because the sinks absorbed a larger share of the smaller emissions
 * of earlier decades. Conflating the two is the specific error found in the
 * sweep, so the distinction is exported rather than left to prose.
 */
export const AIRBORNE_FRACTION_NOTE =
  `The cumulative airborne fraction since 1850 is ${CUMULATIVE_1850_2024.atmospherePercent}%, `
  + `lower than the ${SINK_SHARES_RECENT_DECADE.airbornePercent}% of the most recent decade, `
  + 'because the sinks took up a larger share of the smaller emissions of earlier years.';

/**
 * Remaining carbon budgets, GCB 2025, from the beginning of 2026, 50%
 * likelihood. The AR6-basis figure differs by method and is named rather than
 * hidden, because a reader who finds the other number elsewhere should be able
 * to tell which they are looking at.
 */
// Stated in GtCO₂ only, deliberately. The GtC and GtCO₂ figures quoted for the
// 1.5 °C budget do not convert into each other at 44/12 — 50 GtC is 183 GtCO₂,
// not 170 — while the 1.7 °C and 2 °C pairs do. Rather than publish a
// conversion I could not reconcile, the carbon column is simply not here;
// nothing in the prose needs it.
export const CARBON_BUDGETS = [
  { target: '1.5 °C', gtCO2: 170 },
  { target: '1.7 °C', gtCO2: 525 },
  { target: '2 °C', gtCO2: 1055 },
];
export const CARBON_BUDGET_AR6_BASIS_GTCO2 = 250;

/**
 * Years left at current emissions — derived, so it moves with the total.
 *
 * FLOOR, not round. For a REMAINING budget, rounding up overstates the time
 * available: 190 GtCO₂ at 42/yr is 4.52 years, and reporting that as 5 gives
 * away half a year the budget does not contain. Floor is the honest operator
 * for a quantity you are running out of.
 */
export const budgetYears = (gtCO2) => Math.floor(gtCO2 / TOTAL_GTCO2);

export const BUDGET_1_5_YEARS = budgetYears(CARBON_BUDGETS[0].gtCO2);

/** Methane, IPCC AR6 WG1 Table 7.15 — split by origin, which AR5's 28 was not. */
export const CH4_GWP100_BIOGENIC = 27;
export const CH4_GWP100_FOSSIL = 29.8;
export const CH4_GWP100_AR5 = 28;
export const CH4_PERTURBATION_LIFETIME_YR = 11.8;
export const CH4_ATMOSPHERIC_LIFETIME_YR = 9.1;

/** Anthropogenic methane, Global Methane Budget 2025 (Saunois et al.). */
export const CH4_ANTHRO_GT = 0.369;
export const CH4_TOTAL_TG = 575;
export const CH4_ANTHRO_SHARE_PERCENT = 65;

// The list of SUPERSEDED figures deliberately does NOT live here — it lives in
// __tests__/globalFigures.test.js, which ships nowhere, so a list of stale
// strings cannot put them back into production.
//
// The first version of this comment justified that by saying "this module ships
// in the bundle". At the time that was FALSE: nothing imported this module, so
// Rollup dropped it entirely and a grep of the built bundle for its own strings
// returned nothing. A "single source of truth" that owns nothing is the same
// defect as a figure that lives only in a comment, restated with an export
// keyword. components/LearnAgent.js now imports it, and
// __tests__/liveDataWiring.test.js fails if any module claiming to be a source
// of truth stops being reachable.
