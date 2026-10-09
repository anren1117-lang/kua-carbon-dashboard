/**
 * THE ESTIMATE REGISTER — every figure on this dashboard that is modelled
 * rather than measured, what it was modelled from, and what would retire it.
 *
 * Why this file exists. The dashboard carried `provenance: 'estimated'` on 22
 * data rows and a `method:` string on most of them, and surfaced none of it.
 * A reader saw "1,290 mt" in the same typography as a figure read off a meter.
 * The methodology page did not contain the word "estimated".
 *
 * That is the dishonest part of this dashboard, and it is not a small one:
 * on the numbers below, most of the gross inventory rests on modelled activity
 * data. The single measured series is electricity. Scope 1 and Scope 3 are
 * engineering estimates built from floor area, headcount, published
 * intensities and spend — defensible as a first inventory, and not the same
 * kind of number as a meter reading.
 *
 * DESIGN RULE: every figure here is IMPORTED, never transcribed. A register
 * that restates numbers is a register that goes stale, and a stale disclosure
 * is worse than none — it reads as precision while being wrong. The method
 * strings live next to the data they describe, in the module that computes it;
 * this file collects them and derives the totals.
 *
 * TIERS, in the order a reader should trust them:
 *
 *   measured         An instrument or an invoice produced this number.
 *   partly-measured  Measured for part of the period, extrapolated for the
 *                    rest, or measured activity × a published factor.
 *   modelled         No KUA-specific activity record. Built from floor area,
 *                    headcount, spend or published intensities.
 *
 * `retiredBy` is the operational half: the specific document that would move a
 * row up a tier. It is there so the register is a work list and not an
 * apology.
 */

import {
  SCOPE1_PLACEHOLDER_BREAKDOWN,
  SCOPE3_PLACEHOLDER_BREAKDOWN,
  SCOPE1_TOTAL_MT,
  SCOPE2_TOTAL_MT,
  SCOPE3_TOTAL_MT,
  GROSS_MT,
} from './scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT, SEQUESTRATION_BASIS, TOTAL_FOREST_ACRES } from './sinks.js';
import { COMPOSED_YTD_KWH, COMPOSED_YTD_DAYS_COVERED, COMPOSED_YTD_AS_OF, FEED_TO_MASTER_SCALE } from './composedYtd.js';
import { SOLAR_ANNUAL_KWH, SOLAR_ANNUAL_PROVENANCE, SOLAR_ANNUAL_NOTE } from './renewables.js';
import { SCOPE1_RANGE } from './geographicEstimates.js';

export const TIERS = ['measured', 'partly-measured', 'modelled'];

export const TIER_LABEL = {
  measured: 'Measured',
  'partly-measured': 'Partly measured',
  modelled: 'Modelled',
};

export const TIER_MEANING = {
  measured: 'An instrument reading or an invoice produced this number.',
  'partly-measured': 'Measured for part of the period and extrapolated for the rest, or measured activity multiplied by a published emission factor.',
  modelled: 'No KUA-specific activity record exists yet. Built from floor area, headcount, spend or published intensities.',
};

/** Scope 1 — every row is modelled; the method strings come from scopeTotals. */
const scope1Entries = SCOPE1_PLACEHOLDER_BREAKDOWN.map((r) => ({
  id: `s1-${r.source.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}`,
  scope: 'Scope 1',
  label: r.source,
  mt: r.mt,
  tier: 'modelled',
  method: r.method,
  retiredBy: /oil|propane/i.test(r.source)
    ? 'Fuel-delivery invoices (gallons by date and building) from the oil and propane suppliers.'
    : /fleet/i.test(r.source)
      ? 'Fuel-card statements or odometer logs for the five fleet vehicles.'
      : 'HVAC service reports giving refrigerant added by unit, which is the mass-balance input.',
}));

/** Scope 3 — likewise modelled, and the largest block of the inventory. */
const scope3Entries = SCOPE3_PLACEHOLDER_BREAKDOWN.map((r) => ({
  id: `s3-${r.source.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}`,
  scope: 'Scope 3',
  label: r.source,
  mt: r.mt,
  tier: 'modelled',
  method: r.method,
  retiredBy: /purchased goods/i.test(r.source)
    ? 'Business Office annual spend by vendor, mapped to USEEIO sectors.'
    : /travel/i.test(r.source)
      ? 'Travel-office records, or a boarder home-airport survey.'
      : /dining/i.test(r.source)
        ? 'Dining-services invoices giving food purchased by category and weight.'
        : /upstream/i.test(r.source)
          ? 'Nothing: this row is an uplift on Scope 1 and improves only when Scope 1 does.'
          : /commut/i.test(r.source)
            ? 'An HR commute survey — home ZIP and days on campus per week.'
            : 'Hauler invoices giving tons by waste stream.',
}));

/**
 * Scope 2 is the one series with real instrument data behind it, and it is
 * still not wholly measured: the reporting window ends mid-year and the last
 * month in the composition was extrapolated from a partial export.
 */
const scope2Entry = {
  id: 's2-electricity',
  scope: 'Scope 2',
  label: 'Purchased electricity',
  mt: SCOPE2_TOTAL_MT,
  tier: 'partly-measured',
  method: `BMS Meter Trends export: ${COMPOSED_YTD_KWH.toLocaleString()} kWh over ${COMPOSED_YTD_DAYS_COVERED} days to ${COMPOSED_YTD_AS_OF}, feed sums reconciled to the master meter`
    + `${FEED_TO_MASTER_SCALE ? ` at a ${FEED_TO_MASTER_SCALE.toFixed(3)}× scale` : ''}`
    + ', annualised on a degree-day shape and multiplied by ISO-NE 2024 generation-mix factors. The final month of the window is extrapolated from a partial export, not read whole.',
  retiredBy: 'A full-year daily Meter Trends export covering all campus feeds — which also removes the annualisation.',
};

/** On-site solar, which is measured for one month and shaped for the other 11. */
const solarEntry = {
  id: 'solar-generation',
  scope: 'Scope 2 (offset)',
  label: 'On-site solar generation',
  mt: null,
  kwh: SOLAR_ANNUAL_KWH,
  tier: SOLAR_ANNUAL_PROVENANCE === 'cited' ? 'partly-measured' : 'modelled',
  method: SOLAR_ANNUAL_NOTE,
  retiredBy: 'Twelve consecutive months of BMS production data — expected ~April 2027.',
};

/**
 * The forest sink. This is the most consequential estimate on the dashboard,
 * because it is the difference between the gross and net headline, and it is
 * the figure a reader is most likely to take as a measurement — it has acres
 * and a per-acre rate, which looks like survey data. It is a yield-table
 * lookup against a canopy-cover assumption.
 */
const sinkEntry = {
  id: 'forest-sink',
  scope: 'Sink',
  label: 'Forest sequestration',
  mt: -Math.round(ANNUAL_SEQUESTRATION_MT),
  tier: 'modelled',
  method: `${TOTAL_FOREST_ACRES} acres × ${SEQUESTRATION_BASIS.source}, on the basis of ${SEQUESTRATION_BASIS.basis}.`
    + ` Assumes no harvest${SEQUESTRATION_BASIS.excludesSoilCarbon ? ' and excludes soil carbon' : ''};`
    + ` campus canopy cover is itself assumed at ${Math.round(SEQUESTRATION_BASIS.campusCanopyCover * 100)}%.`
    + ' No stand has been cruised and no increment cores have been taken.',
  retiredBy: 'A forest inventory — fixed plots, DBH by species, re-measured on a cycle. A one-off cruise would set the level; the increment needs two visits.',
};

/** Every estimate on the dashboard, largest absolute contribution first. */
export const ESTIMATE_REGISTER = [
  ...scope1Entries,
  scope2Entry,
  ...scope3Entries,
  sinkEntry,
  solarEntry,
].sort((a, b) => Math.abs(b.mt || 0) - Math.abs(a.mt || 0));

const sumOf = (tier) => ESTIMATE_REGISTER
  .filter((e) => e.tier === tier && typeof e.mt === 'number' && e.mt > 0)
  .reduce((s, e) => s + e.mt, 0);

export const MODELLED_MT = sumOf('modelled');
export const PARTLY_MEASURED_MT = sumOf('partly-measured');
export const MEASURED_MT = sumOf('measured');

/**
 * The headline disclosure: how much of the gross inventory is modelled.
 * Derived, so it moves when the data does — if fuel invoices land, this falls
 * without anyone editing a sentence.
 */
export const MODELLED_SHARE_OF_GROSS = GROSS_MT > 0
  ? Math.round((MODELLED_MT / GROSS_MT) * 100)
  : 0;

export const REGISTER_COUNTS = {
  total: ESTIMATE_REGISTER.length,
  modelled: ESTIMATE_REGISTER.filter((e) => e.tier === 'modelled').length,
  partlyMeasured: ESTIMATE_REGISTER.filter((e) => e.tier === 'partly-measured').length,
  measured: ESTIMATE_REGISTER.filter((e) => e.tier === 'measured').length,
};

/**
 * Which scopes are wholly modelled. Stated as a derived fact rather than a
 * remembered one, because it is exactly the sort of claim that survives the
 * data change that falsifies it.
 */
export const WHOLLY_MODELLED_SCOPES = ['Scope 1', 'Scope 3'].filter((s) => {
  const rows = ESTIMATE_REGISTER.filter((e) => e.scope === s);
  return rows.length > 0 && rows.every((e) => e.tier === 'modelled');
});

/** Cross-check that the register accounts for the whole gross figure. */
export const REGISTER_RECONCILIATION = (() => {
  const registered = MODELLED_MT + PARTLY_MEASURED_MT + MEASURED_MT;
  const scopeSum = SCOPE1_TOTAL_MT + SCOPE2_TOTAL_MT + SCOPE3_TOTAL_MT;
  return {
    registeredMt: registered,
    grossMt: GROSS_MT,
    scopeSumMt: scopeSum,
    // placeholder breakdowns are rounded per row, so allow a small gap
    unaccountedMt: Math.round(scopeSum - registered),
    reconciles: Math.abs(scopeSum - registered) <= Math.max(25, scopeSum * 0.02),
  };
})();

/**
 * The sink disclosure, kept separate because it is a different claim.
 *
 * MODELLED_SHARE_OF_GROSS sums emissions only, so it says nothing about the
 * sink — and the sink is the largest single modelled quantity on the whole
 * dashboard, larger than any emitting line. It is also the entire difference
 * between the gross headline and the net one. A reader told "91% of gross is
 * modelled" could still reasonably assume the net figure rests on something
 * firmer. It does not: it rests on that number plus a yield table.
 */
export const SINK_SHARE_OF_GROSS = GROSS_MT > 0
  ? Math.round((ANNUAL_SEQUESTRATION_MT / GROSS_MT) * 100)
  : 0;

export const NET_RESTS_ON_MODELLED_SINK = sinkEntry.tier === 'modelled';

/** One sentence for any surface that needs the caveat without the table. */
export const ESTIMATE_CAVEAT = `About ${MODELLED_SHARE_OF_GROSS}% of the gross figure is modelled from floor area, headcount, spend and published intensities rather than measured. ${WHOLLY_MODELLED_SCOPES.join(' and ')} carry no KUA-specific activity records yet; electricity is the one metered series. Every figure is listed in the estimate register with its method.`;

/** The same caveat for any surface quoting the NET figure. */
export const NET_ESTIMATE_CAVEAT = NET_RESTS_ON_MODELLED_SINK
  ? `The net figure is more uncertain than the gross one, not less. The sink subtracted from it is worth ${SINK_SHARE_OF_GROSS}% of gross emissions — the largest single modelled quantity here — and no stand on this campus has been cruised.`
  : '';

/** The scope-1 spread, as a worked example of how wide a modelled figure is. */
export const MODELLED_SPREAD_EXAMPLE = {
  scope: 'Scope 1',
  low: SCOPE1_RANGE.low,
  central: SCOPE1_RANGE.central,
  high: SCOPE1_RANGE.high,
  note: 'The same model run at three published intensity assumptions. The spread is how much the answer depends on the assumption, not three sources agreeing.',
};
