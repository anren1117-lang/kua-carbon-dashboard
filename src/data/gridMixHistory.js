// The New England grid's carbon intensity, by year.
//
// Why this file exists: every electricity figure on the dashboard used to be
// costed at ONE emission factor with no date on it, while gridMix.js recorded
// `GRID_MIX_YEAR = 2024` two lines above `KUA_USAGE_YEAR = 2026` and did
// nothing about the gap. A kWh in 2019 and a kWh in 2023 are not the same
// carbon, and a dashboard that can't say so will attribute the grid's changes
// to the school's behaviour.
//
// WHAT THE SERIES ACTUALLY SHOWS — stated carefully, because the striking
// version of this is a cherry-pick. Carbon per kWh rose about 10% between 2019
// and 2023 (493.8 → 543.2), and it is tempting to headline that. Don't: 2019 is
// the MINIMUM of the series in three independent datasets (eGRID, ISO-NE's own
// operational rate, and EIA six-state), and starting the window at 2016 instead
// reverses the sign. 2019 was an unusually clean year — cheap gas pushed coal
// and oil almost out of dispatch while nuclear held flat (Seabrook skipped a
// refuelling outage and ran its best year ever). Intensity rose afterwards
// because nuclear share fell from 2020, not because the long trend turned.
//
// The defensible summary: down roughly 20–28% since 2010, bottomed in 2019,
// a record low in 2024 (597 lb/MWh generation-only), and ISO-NE's own
// December 2025 recap estimates 2025 ticked back up ~4% on record gas share,
// weak hydro and collapsing imports. The useful point for a school is not a
// direction but a magnitude: the same kWh scores ~10% differently depending on
// which year's grid prices it, which is larger than most efficiency projects.
//
// THREE SERIES, THREE DENOMINATORS — do not mix them:
//
//   EGRID_NEWE        EPA's subregion total output emission rate. This is the
//                     factor GHG Protocol location-based Scope 2 asks for, and
//                     it is what this dashboard reports. Its resource mix is
//                     GENERATION INSIDE New England and has no imports column.
//
//   ISO_NE_ANNUAL     ISO New England's own operational rate. Context and a
//                     sanity check, NOT the reporting factor. Note it carries
//                     TWO denominators of its own: generationLbPerMwh is NE
//                     generation alone, while withImportsLbPerMwh divides by
//                     generation PLUS net imports (~118,900 GWh) — which is not
//                     net energy for load either, since NEL subtracts pumping
//                     load. Imports pull the rate down because they are valued
//                     at Québec ~3, NY ~493 and New Brunswick ~602 lb/MWh.
//
// WHY eGRID READS 100–140 lb/MWh BELOW ISO-NE for the same grid: eGRID subtracts
// biogenic CO2 from biomass and municipal solid waste; ISO-NE's operational rate
// does not. That is a boundary difference, not a disagreement about the grid —
// and it is why splicing the two series together to fill gaps would be wrong.
//
// eGRID was BIENNIAL before 2018, and there is no 2017 or 2024 edition. The
// table below is contiguous 2019–2023, but anything plotting it as a continuous
// annual series should say where the editions actually fall.
//
// Every number below was read out of the cited primary document, not a
// secondary summary. (A search-engine summary of this same series reported
// 2019 as 488.9, which is NEWE's CO2 rate, not its CO2e rate — the two columns
// sit next to each other in the table and are easy to conflate.)

const LB_PER_MWH_TO_KG_PER_KWH = 0.45359237 / 1000;

/**
 * @typedef {Object} GridVintage
 * @property {number} vintage          eGRID data year
 * @property {number} co2LbPerMwh      Subregion CO2 total output emission rate
 * @property {number} co2eLbPerMwh     Subregion CO2e total output emission rate — the Scope 2 factor
 * @property {number} gridLossPct      Subregion grid gross loss
 * @property {number} generationMwh    Subregion annual net generation
 * @property {Object} mix              Percent of generation by fuel (no imports column)
 * @property {string} source           Primary document
 */

/**
 * EPA eGRID, NPCC New England (NEWE) subregion.
 * Read from the "Subregion Output Emission Rates" and "Subregion Resource Mix"
 * tables of each edition's summary tables PDF.
 * @type {GridVintage[]}
 */
export const EGRID_NEWE = [
  {
    vintage: 2019,
    co2LbPerMwh: 488.9,
    co2eLbPerMwh: 493.8,
    gridLossPct: 5.1,
    generationMwh: 100_011_791,
    mix: { coal: 0.5, oil: 0.2, gas: 49.3, otherFossil: 0.1, nuclear: 29.8, hydro: 7.3, biomass: 7.5, wind: 3.7, solar: 1.5, geothermal: 0.0, other: 0.1 },
    source: 'EPA eGRID2019 summary tables',
  },
  {
    vintage: 2020,
    co2LbPerMwh: 528.2,
    co2eLbPerMwh: 533.0,
    gridLossPct: 5.3,
    generationMwh: 96_795_891,
    mix: { coal: 0.2, oil: 0.2, gas: 53.2, otherFossil: 0.1, nuclear: 26.4, hydro: 6.5, biomass: 7.3, wind: 3.9, solar: 2.1, geothermal: 0.0, other: 0.1 },
    source: 'EPA eGRID2020 summary tables',
  },
  {
    vintage: 2021,
    co2LbPerMwh: 539.4,
    co2eLbPerMwh: 544.0,
    gridLossPct: 4.5,
    generationMwh: 103_068_944,
    mix: { coal: 0.6, oil: 0.2, gas: 54.3, otherFossil: 1.7, nuclear: 26.3, hydro: 5.7, biomass: 5.2, wind: 3.7, solar: 2.4, geothermal: 0.0, other: 0.1 },
    source: 'EPA eGRID2021 summary tables',
  },
  {
    vintage: 2022,
    co2LbPerMwh: 536.4,
    co2eLbPerMwh: 540.5,
    gridLossPct: 5.1,
    generationMwh: 105_455_877,
    mix: { coal: 0.3, oil: 1.8, gas: 52.7, otherFossil: 1.6, nuclear: 26.0, hydro: 5.9, biomass: 4.5, wind: 3.8, solar: 3.3, geothermal: 0.0, other: 0.1 },
    source: 'EPA eGRID2022 summary tables',
  },
  {
    vintage: 2023,
    co2LbPerMwh: 539.3,
    co2eLbPerMwh: 543.2,
    gridLossPct: 4.2,
    generationMwh: 102_716_863,
    mix: { coal: 0.2, oil: 0.4, gas: 55.9, otherFossil: 1.6, nuclear: 22.6, hydro: 8.0, biomass: 4.3, wind: 3.4, solar: 3.6, geothermal: 0.0, other: 0.1 },
    source: 'EPA eGRID2023 Rev 2 summary tables (released 12 June 2025)',
  },
];

/**
 * ISO New England's own published operational rates. Context and cross-check,
 * NOT the Scope 2 reporting factor — see the header note on denominators.
 */
export const ISO_NE_ANNUAL = [
  { year: 2023, generationLbPerMwh: 633, withImportsLbPerMwh: 571, totalKilotons: 32_050, source: 'ISO-NE Electric Generator Air Emissions Report / ISO-NE key stats' },
  { year: 2024, generationLbPerMwh: 597, withImportsLbPerMwh: 560, totalKilotons: 32_442, source: 'ISO-NE Electric Generator Air Emissions Report / ISO-NE key stats' },
];

/**
 * ISO-NE resource mix as % of net energy for load, which is what the public
 * page's fuel breakdown shows. Includes imports, so it does NOT line up with
 * eGRID's generation-only percentages.
 */
export const ISO_NE_MIX_NEL = {
  year: 2025,
  preliminary: true,
  shares: { gas: 51, nuclear: 23, renewables: 12, imports: 7, hydro: 6.0, oil: 0.97, coal: 0.23, other: 0.60 },
  // ISO-NE's published NEL breakdown ALSO carries Price-Responsive Demand and a
  // NEGATIVE Pumping/Charging Load of about −1.7%. Those are omitted here
  // because the seven-row public breakdown has no place to show them — but that
  // means these shares must not be renormalised as if they were a complete set:
  // dropping a negative term and rescaling inflates every remaining share.
  //
  // Note too that ISO-NE reports hydro SEPARATELY from renewables on purpose,
  // because hydro is not universally defined as renewable. Merging them (as the
  // public seven-row mix does) is a substantive editorial choice, not a tidy-up.
  omitted: { pumpingChargingLoad: -1.7, priceResponsiveDemand: null },
  source: 'ISO-NE Resource Mix, 2025 preliminary (published 28 January 2026)',
};

/**
 * EPA AVERT avoided emission rates, New England region, DISTRIBUTED PV —
 * the rooftop-scale category, which is what KUA has.
 *
 * WHY THIS IS A DIFFERENT NUMBER FROM THE SCOPE 2 FACTOR, and must stay one:
 *
 * Scope 2 asks "what were the emissions associated with the electricity we
 * consumed?" — an INVENTORY question, answered with a location-based AVERAGE
 * grid factor. Avoided emissions asks "what generation did our solar displace?"
 * — a CONSEQUENTIAL question, and the generation that actually backs down when
 * a New England rooftop exports is the MARGINAL unit, almost always gas. So the
 * marginal rate is roughly double the average, and using the average here
 * understates what the array achieves by about half.
 *
 * GHG Protocol treats avoided emissions as consequential/system-wide impact
 * modelling, explicitly OUTSIDE Scope 2 inventory accounting, with separate
 * guidance. That is the licence for two different factors — and the reason
 * Phase 392's "one kWh, one number" rule does NOT extend to this line. Applying
 * it here was a mistake, corrected in the same phase: the inventory factor made
 * this figure worse than the (wrong) number it replaced.
 *
 * Rates are CO2, not CO2e. lb/MWh, read from EPA's AVERT v4.3 workbook.
 */
export const AVERT_NEW_ENGLAND_DISTRIBUTED_PV = [
  { year: 2017, co2LbPerMwh: 1187.8 },
  { year: 2018, co2LbPerMwh: 1176.8 },
  { year: 2019, co2LbPerMwh: 1120.2 },
  { year: 2020, co2LbPerMwh: 1095.8 },
  { year: 2021, co2LbPerMwh: 1095.1 },
  { year: 2022, co2LbPerMwh: 1117.5 },
  { year: 2023, co2LbPerMwh: 1079.4 },
];

export const AVERT_SOURCE = 'EPA AVERT v4.3 avoided emission rates, New England region, distributed (rooftop-scale) PV, published April 2024';

/** AVERT's own annual capacity factor for New England distributed PV. */
export const AVERT_NE_DISTRIBUTED_PV_CAPACITY_FACTOR = 0.1823;

/** The newest AVERT year we hold. */
export function latestAvertYear() {
  return AVERT_NEW_ENGLAND_DISTRIBUTED_PV
    .reduce((newest, r) => (r.year > newest.year ? r : newest), AVERT_NEW_ENGLAND_DISTRIBUTED_PV[0]);
}

/**
 * kg CO2 avoided per kWh of rooftop solar in New England. ~0.49 — about twice
 * the location-based average, for the reason in the block comment above.
 */
export function avertAvoidedKgPerKwh() {
  return latestAvertYear().co2LbPerMwh * LB_PER_MWH_TO_KG_PER_KWH;
}

/** kg CO2e per kWh for a vintage row. */
export function vintageKgPerKwh(vintage) {
  return vintage && Number.isFinite(vintage.co2eLbPerMwh)
    ? vintage.co2eLbPerMwh * LB_PER_MWH_TO_KG_PER_KWH
    : null;
}

/** The newest eGRID edition we hold. */
export function latestVintage() {
  return EGRID_NEWE.reduce((newest, v) => (v.vintage > newest.vintage ? v : newest), EGRID_NEWE[0]);
}

/**
 * The vintage a given usage year should be costed at: the newest edition whose
 * data year is at or before that usage year.
 *
 * Two different lags, easily conflated — keep them apart. PUBLICATION lag is
 * roughly two years: eGRID2023 was released in mid-2025. DATA-YEAR distance is
 * what actually prices a kWh, and for 2026 usage against eGRID2023 it is three
 * years. reportVintageGap().yearsStale reports the second, not the first.
 *
 * Returns the OLDEST edition for a usage year earlier than anything we hold,
 * and never null, so a caller can always cost a kWh.
 */
export function vintageForUsageYear(usageYear) {
  const year = Number(usageYear);
  if (!Number.isFinite(year)) return latestVintage();
  const eligible = EGRID_NEWE.filter((v) => v.vintage <= year);
  if (eligible.length === 0) return EGRID_NEWE.reduce((o, v) => (v.vintage < o.vintage ? v : o), EGRID_NEWE[0]);
  return eligible.reduce((newest, v) => (v.vintage > newest.vintage ? v : newest), eligible[0]);
}

/** How stale the factor is for a usage year, so a page can say so out loud. */
export function reportVintageGap(usageYear) {
  const v = vintageForUsageYear(usageYear);
  const years = Number(usageYear) - v.vintage;
  return {
    vintage: v.vintage,
    usageYear: Number(usageYear),
    yearsStale: Number.isFinite(years) ? years : null,
    kgPerKwh: vintageKgPerKwh(v),
    source: v.source,
  };
}

/**
 * Change in carbon intensity between two vintages, as a percentage. Positive
 * means the grid got dirtier per kWh — which is what actually happened across
 * 2019–2023, and the number a reader is most likely to disbelieve.
 */
export function intensityChangePct(fromVintage, toVintage) {
  const a = EGRID_NEWE.find((v) => v.vintage === fromVintage);
  const b = EGRID_NEWE.find((v) => v.vintage === toVintage);
  if (!a || !b) return null;
  return +(((b.co2eLbPerMwh - a.co2eLbPerMwh) / a.co2eLbPerMwh) * 100).toFixed(1);
}

export const EGRID_LATEST_KG_PER_KWH = vintageKgPerKwh(latestVintage());
