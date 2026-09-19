// Emission factors keyed by category. Values are kgCO2e per unit. Each factor
// records the source it was pulled from so the audit trail is preserved when
// numbers are surfaced in the UI.

/**
 * @typedef {Object} EmissionFactor
 * @property {string} id            Stable identifier
 * @property {string} category      'electricity' | 'fuel' | 'food' | 'travel' | 'waste' | 'refrigerant' | 'procurement'
 * @property {string} subcategory   Free-form key (e.g. 'beef', 'natural_gas', 'jet_fuel_economy')
 * @property {string} unit          The denominator (e.g. 'kWh', 'gallon', 'kg', 'passenger-mile')
 * @property {number} kgco2e_per_unit
 * @property {string} source        Citation
 * @property {number} year
 */

import { KG_PER_KWH } from './gridMix.js';

/** @type {EmissionFactor[]} */
export const emissionFactors = [
  // Electricity — per-fuel emission factors per kWh of electricity OUTPUT
  // (NOT per kWh of fuel BTU input). These match src/data/gridMix.js
  // and yield an effective system rate of ~0.2344 kg/kWh weighted across the
  // ISO-NE 2024 generation mix. That sits ~5% BELOW EPA's published eGRID NEWE
  // rate for the reporting vintage (0.2464) — see FACTOR_RECONCILIATION in
  // gridMix.js, which publishes the gap rather than quietly closing it.
  // Not a literal: this catalog row records the factor the dashboard actually
  // applies, so it derives from the same composition every page uses. A typed
  // copy here would drift the audit trail away from the arithmetic it documents.
  { id: 'ef_grid_isone_2024', category: 'electricity', subcategory: 'isone_grid', unit: 'kWh', kgco2e_per_unit: KG_PER_KWH, source: 'ISO-NE 2024 mix × per-fuel output factors (composed in gridMix.js)', year: 2024 },
  { id: 'ef_grid_natgas',      category: 'electricity', subcategory: 'natural_gas',     unit: 'kWh', kgco2e_per_unit: 0.400, source: 'ISO-NE generation mix (combined-cycle output)', year: 2024 },
  { id: 'ef_grid_oil',         category: 'electricity', subcategory: 'oil',             unit: 'kWh', kgco2e_per_unit: 0.780, source: 'EPA eGRID NEWE oil-fired typical', year: 2024 },
  { id: 'ef_grid_coal',        category: 'electricity', subcategory: 'coal',            unit: 'kWh', kgco2e_per_unit: 0.950, source: 'EPA eGRID NEWE coal-fired typical', year: 2024 },
  { id: 'ef_grid_imports',     category: 'electricity', subcategory: 'imports',         unit: 'kWh', kgco2e_per_unit: 0.300, source: 'NYISO + Quebec hydro blend midpoint', year: 2024 },

  // Heating fuels (Scope 1)
  { id: 'ef_fuel_oil_2',  category: 'fuel', subcategory: 'heating_oil_no2', unit: 'gallon', kgco2e_per_unit: 10.21, source: 'EPA GHG Emission Factors Hub 2025', year: 2025 },
  { id: 'ef_propane',     category: 'fuel', subcategory: 'propane',         unit: 'gallon', kgco2e_per_unit: 5.72,  source: 'EPA GHG Emission Factors Hub 2024', year: 2024 },
  { id: 'ef_natgas_therm',category: 'fuel', subcategory: 'natural_gas',     unit: 'therm',  kgco2e_per_unit: 5.31,  source: 'EPA GHG Emission Factors Hub 2024', year: 2024 },
  { id: 'ef_gasoline',    category: 'fuel', subcategory: 'gasoline',        unit: 'gallon', kgco2e_per_unit: 8.78,  source: 'EPA GHG Emission Factors Hub 2024', year: 2024 },
  { id: 'ef_diesel',      category: 'fuel', subcategory: 'diesel',          unit: 'gallon', kgco2e_per_unit: 10.21, source: 'EPA GHG Emission Factors Hub 2024', year: 2024 },

  // Refrigerants (selected)
  { id: 'ef_r410a', category: 'refrigerant', subcategory: 'r410a', unit: 'kg', kgco2e_per_unit: 2256, source: 'IPCC AR6 WG1 Ch.7 GWP100 (blend: R-32 + R-125, 50/50 by mass)', year: 2021 },
  { id: 'ef_r134a', category: 'refrigerant', subcategory: 'r134a', unit: 'kg', kgco2e_per_unit: 1530, source: 'IPCC AR6 WG1 Ch.7 GWP100 (pure compound; AR5 gave 1300 — do not mix vintages)', year: 2021 },

  // Travel
  // Corrected in Phase 404. These read 0.395 short / 0.193 long, on two
  // DIFFERENT bases: 0.193 is the long-haul economy figure EXCLUDING
  // non-CO2 effects (0.11812 kg/pkm x 1.609), while 0.395 matched no
  // published row at all. Both now come from one basis — DEFRA 2024
  // economy, including indirect non-CO2 effects, per passenger-mile.
  // Note long-haul is the HIGHER of the two.
  { id: 'ef_air_short', category: 'travel', subcategory: 'air_short_haul',     unit: 'passenger-mile', kgco2e_per_unit: 0.294, source: 'DEFRA 2024 short-haul economy, incl. non-CO2 effects (0.18287 kg/passenger-km)', year: 2024 },
  { id: 'ef_air_long',  category: 'travel', subcategory: 'air_long_haul',      unit: 'passenger-mile', kgco2e_per_unit: 0.322, source: 'DEFRA 2024 long-haul economy, incl. non-CO2 effects (0.20011 kg/passenger-km)', year: 2024 },
  // Phase 406: was 0.351 while citing EPA's "Typical Passenger Vehicle"
  // page, which actually publishes ~400 g CO2/mi at 22.2 mpg. 0.351 matched
  // neither that nor the Hub. Now the Hub's own Scope 3 Cat 6/7 factor.
  { id: 'ef_car_avg',   category: 'travel', subcategory: 'passenger_car_avg',  unit: 'mile',           kgco2e_per_unit: 0.2986, source: 'EPA GHG Emission Factors Hub 2025, Table 10 (Scope 3 Cat 6/7), Passenger Car — 0.297 kg CO2 + CH4/N2O per vehicle-mile, CO2e at AR5', year: 2025 },
  { id: 'ef_bus',       category: 'travel', subcategory: 'school_bus',         unit: 'mile',           kgco2e_per_unit: 1.96,  source: 'EPA medium/heavy duty diesel', year: 2024 },

  // Food — kg CO2e per kg of product, FULL SUPPLY CHAIN (land-use change
  // + feed + farm + processing + transport + retail + packaging + losses).
  //
  // Corrected in Phase 405. The comment here previously said
  // "cradle-to-farm-gate", which the data does not support: farm-gate for
  // beef (beef herd) is 82.15 and the full chain is 99.48, while this file
  // carried 60. Meanwhile the plant rows sat at the FULL-chain values
  // (rice 4.0 vs 4.45, peas 0.9 vs 0.98, vegetables 0.5 vs 0.53). It was
  // not one slice applied consistently — it was the older circulated
  // "beef 60 / chicken 6" teaching set mixed with current totals, so the
  // meat rows understated by 40-170%.
  //
  // Values are OWID's per-kg compilation of Poore & Nemecek (2018). Worth
  // citing that way: the paper reported per 100 g protein and per 1,000
  // kcal, and OWID derived the per-kg figures.
  //
  // Beef is the beef-herd figure (99.48). Dairy-herd beef is 33.3 — US
  // supply is a mix, so this is deliberately the conservative-high end
  // rather than an unsourced blend. Fruit uses Apples (0.43), the only
  // fruit in KUA's purchase records.
  { id: 'ef_food_beef',     category: 'food', subcategory: 'beef',     unit: 'kg', kgco2e_per_unit: 99.5, source: 'Poore & Nemecek 2018 via OWID per-kg (beef herd, full supply chain)', year: 2018 },
  { id: 'ef_food_lamb',     category: 'food', subcategory: 'lamb',     unit: 'kg', kgco2e_per_unit: 39.7, source: 'Poore & Nemecek 2018 via OWID per-kg (lamb & mutton, full supply chain)', year: 2018 },
  { id: 'ef_food_pork',     category: 'food', subcategory: 'pork',     unit: 'kg', kgco2e_per_unit: 12.3, source: 'Poore & Nemecek 2018 via OWID per-kg (pig meat, full supply chain)', year: 2018 },
  { id: 'ef_food_chicken',  category: 'food', subcategory: 'chicken',  unit: 'kg', kgco2e_per_unit: 9.9,  source: 'Poore & Nemecek 2018 via OWID per-kg (poultry meat, full supply chain)', year: 2018 },
  { id: 'ef_food_fish',     category: 'food', subcategory: 'fish',     unit: 'kg', kgco2e_per_unit: 13.6, source: 'Poore & Nemecek 2018 via OWID per-kg (farmed fish, full supply chain)', year: 2018 },
  { id: 'ef_food_dairy',    category: 'food', subcategory: 'dairy',    unit: 'kg', kgco2e_per_unit: 3.2,  source: 'Poore & Nemecek 2018 via OWID per-kg (milk, full supply chain)', year: 2018 },
  { id: 'ef_food_eggs',     category: 'food', subcategory: 'eggs',     unit: 'kg', kgco2e_per_unit: 4.7,  source: 'Poore & Nemecek 2018 via OWID per-kg (eggs, full supply chain)', year: 2018 },
  { id: 'ef_food_rice',     category: 'food', subcategory: 'rice',     unit: 'kg', kgco2e_per_unit: 4.5,  source: 'Poore & Nemecek 2018 via OWID per-kg (rice, full supply chain)', year: 2018 },
  { id: 'ef_food_grains',   category: 'food', subcategory: 'grains',   unit: 'kg', kgco2e_per_unit: 1.6,  source: 'Poore & Nemecek 2018 via OWID per-kg (wheat & rye, full supply chain)', year: 2018 },
  { id: 'ef_food_legumes',  category: 'food', subcategory: 'legumes',  unit: 'kg', kgco2e_per_unit: 1.0,  source: 'Poore & Nemecek 2018 via OWID per-kg (peas, full supply chain)', year: 2018 },
  { id: 'ef_food_veg',      category: 'food', subcategory: 'vegetables', unit: 'kg', kgco2e_per_unit: 0.5,  source: 'Poore & Nemecek 2018 via OWID per-kg (other vegetables, full supply chain)', year: 2018 },
  { id: 'ef_food_fruit',    category: 'food', subcategory: 'fruit',    unit: 'kg', kgco2e_per_unit: 0.43, source: 'Poore & Nemecek 2018 via OWID per-kg (apples, full supply chain)', year: 2018 },

  // Waste — EPA GHG Emission Factors Hub 2025, Table 9 (Scope 3 Category 5:
  // Waste Generated in Operations), AR4 GWPs, converted from metric tons
  // CO2e/short ton to kg/kg (x 1.10231). Avoided emissions are EXCLUDED per
  // EPA's own note, so recycling and composting are positive here: they are
  // smaller emissions than landfilling, not credits. Phase 407.
  { id: 'ef_waste_landfill_mixed', category: 'waste', subcategory: 'landfill_mixed', unit: 'kg', kgco2e_per_unit: 0.639, source: 'EPA GHG Emission Factors Hub 2025, Table 9 — Mixed MSW landfilled (0.58 MT CO2e/short ton)', year: 2025 },
  { id: 'ef_waste_recycling',      category: 'waste', subcategory: 'recycling',      unit: 'kg', kgco2e_per_unit: 0.099, source: 'EPA GHG Emission Factors Hub 2025, Table 9 — Mixed Recyclables recycled (0.09 MT CO2e/short ton, avoided emissions excluded)', year: 2025 },
  { id: 'ef_waste_compost',        category: 'waste', subcategory: 'compost_food',   unit: 'kg', kgco2e_per_unit: 0.121, source: 'EPA GHG Emission Factors Hub 2025, Table 9 — Food Waste composted (0.11 MT CO2e/short ton, avoided emissions excluded)', year: 2025 },

  // Procurement (Cat 1 spend-based, USD-denominated). Corrected in Phase
  // 404: these were hand-set round numbers cited to "US EPA EEIO v2.0",
  // which is a model rather than a published factor set. Each row now
  // carries the EPA Supply Chain GHG Emission Factors v1.3 value for the
  // NAICS-6 commodity the purchases actually are (kg CO2e per 2022 USD at
  // purchaser prices, with margins, AR5 GWP100). IT was overstated ~6.5x
  // and apparel ~4.25x; cleaning was slightly understated.
  { id: 'ef_proc_paper',     category: 'procurement', subcategory: 'paper',          unit: 'USD', kgco2e_per_unit: 0.296, source: 'EPA Supply Chain GHG Emission Factors v1.3, NAICS 322230 Stationery Product Mfg (kg CO2e/2022 USD, purchaser price)', year: 2022 },
  { id: 'ef_proc_it',        category: 'procurement', subcategory: 'it_equipment',   unit: 'USD', kgco2e_per_unit: 0.058, source: 'EPA Supply Chain GHG Emission Factors v1.3, NAICS 334111 Electronic Computer Mfg (kg CO2e/2022 USD, purchaser price)', year: 2022 },
  { id: 'ef_proc_cleaning',  category: 'procurement', subcategory: 'cleaning',       unit: 'USD', kgco2e_per_unit: 0.355, source: 'EPA Supply Chain GHG Emission Factors v1.3, NAICS 325611 Soap & Detergent Mfg (kg CO2e/2022 USD, purchaser price)', year: 2022 },
  { id: 'ef_proc_uniforms',  category: 'procurement', subcategory: 'apparel',        unit: 'USD', kgco2e_per_unit: 0.120, source: 'EPA Supply Chain GHG Emission Factors v1.3, NAICS 315 Apparel Mfg (kg CO2e/2022 USD, purchaser price)', year: 2022 },
];

// ─── What a factor's `year` actually means ──────────────────────────────
//
// Three different things share that column, and treating them alike produces a
// misleading headline. Scope 2 can already say "eGRID2023 — 3 years older than
// the 2026 electricity it prices" (VINTAGE_GAP, rendered on Scope2.js). Doing
// the same for Scope 1 and 3 naively would announce that Scope 3 runs on
// "8-year-old factors" because the food rows say 2018. That would be wrong:
//
//   annual-edition   EPA Hub 2024/2025, eGRID, DEFRA 2024, ISO-NE. A newer
//                    edition exists or will. The gap to the usage year is REAL
//                    staleness — you are pricing 2026 activity with another
//                    year's data.
//   dataset-version  EPA Supply Chain GHG Emission Factors v1.3 (year 2022).
//                    The VERSION is current; 2022 is the USD basis year of the
//                    spend data. "4 years stale" would be wrong twice over.
//   publication      Poore & Nemecek 2018 via OWID; IPCC AR6 GWP100. One-off
//                    works that remain the current best source. The year is
//                    provenance, not decay — beef's per-kg footprint does not
//                    decarbonise the way a grid does.
//
// Classified from the source string rather than hand-tagged on 35 rows, so the
// kind cannot drift away from the citation it is derived from.
//
// The refrigerant rows read `year: 2024` until Phase 437 while citing IPCC AR6,
// which was published in 2021 — a FOURTH meaning for this column ("verified
// current as of"). Left alone, the Scope 1 page would have rendered "published
// studies (2024)" and stated a false publication year. Corrected to 2021; the
// GWP values themselves are untouched, so no emissions figure moves.
const ANNUAL_EDITION = /(Hub|eGRID|DEFRA|ISO-NE|medium\/heavy duty|NYISO)/i;
const DATASET_VERSION = /Supply Chain GHG Emission Factors v/i;
const PUBLICATION = /(Poore\s*&\s*Nemecek|IPCC|OWID)/i;

export function vintageKindOf(factor) {
  const src = String(factor?.source || '');
  if (PUBLICATION.test(src)) return 'publication';
  if (DATASET_VERSION.test(src)) return 'dataset-version';
  if (ANNUAL_EDITION.test(src)) return 'annual-edition';
  return 'unclassified';
}

/**
 * How out of date the factors pricing a scope are, for the kinds where that
 * question is meaningful.
 *
 * Returns the worst ANNUAL-EDITION gap (the only kind that ages), plus the
 * publication-year factors listed separately as provenance. A caller that
 * blends the two is making the mistake this function exists to prevent.
 */
export function factorVintageFor(keys, usageYear) {
  const rows = keys
    .map(([category, subcategory]) => getFactorByKey(category, subcategory))
    .filter(Boolean);
  const editions = rows.filter((r) => vintageKindOf(r) === 'annual-edition' && Number.isFinite(r.year));
  const studies = rows.filter((r) => vintageKindOf(r) === 'publication' && Number.isFinite(r.year));
  const oldestEdition = editions.length
    ? editions.reduce((o, r) => (r.year < o.year ? r : o), editions[0])
    : null;
  const versions = rows.filter((r) => vintageKindOf(r) === 'dataset-version');
  return {
    usageYear,
    oldestEditionYear: oldestEdition ? oldestEdition.year : null,
    yearsStale: oldestEdition ? usageYear - oldestEdition.year : null,
    editionCount: editions.length,
    studyYears: [...new Set(studies.map((r) => r.year))].sort(),
    studyCount: studies.length,
    // Counted separately rather than dropped: a scope priced entirely on
    // versioned datasets has no edition gap, and reporting null with no
    // explanation would read as "no vintage information".
    versionCount: versions.length,
    versionLabels: [...new Set(versions.map((r) => (String(r.source).match(/v\d+(?:\.\d+)*/) || ['version'])[0]))],
  };
}

/**
 * One sentence a page can render. Built here, not per page, so the wording
 * cannot drift the way five copies of one figure did in Phase 425.
 */
export function describeFactorVintage(v) {
  if (!v || v.oldestEditionYear === null) {
    if (v && v.versionCount > 0) {
      return `Priced on versioned datasets (${v.versionLabels.join(', ')}), which carry no annual edition to fall behind.`;
    }
    return null;
  }
  const head = v.yearsStale === 0
    ? `Oldest annual factor edition is ${v.oldestEditionYear}, the same year as the activity it prices.`
    : `Oldest annual factor edition is ${v.oldestEditionYear} — ${v.yearsStale} year${v.yearsStale === 1 ? '' : 's'} older than the ${v.usageYear} activity it prices.`;
  const tail = v.studyCount > 0
    ? ` ${v.studyCount} factor${v.studyCount === 1 ? '' : 's'} come from published studies (${v.studyYears.join(', ')}), where the year is provenance rather than an edition that has aged.`
    : '';
  return head + tail;
}

/** The factors that actually price each scope, for the vintage summary. */
export const SCOPE1_FACTOR_KEYS = [
  ['fuel', 'heating_oil_no2'], ['fuel', 'propane'],
  ['fuel', 'gasoline'], ['fuel', 'diesel'],
  ['refrigerant', 'r410a'], ['refrigerant', 'r134a'],
];
export const SCOPE3_FACTOR_KEYS = [
  ['waste', 'landfill_mixed'], ['waste', 'recycling'], ['waste', 'compost_food'],
  ['travel', 'passenger_car_avg'], ['travel', 'air_short_haul'], ['travel', 'air_long_haul'],
  ['food', 'beef'], ['food', 'chicken'],
  ['procurement', 'paper'], ['procurement', 'it_equipment'],
];

const factorsById = Object.fromEntries(emissionFactors.map((f) => [f.id, f]));
const factorsByCategorySub = Object.fromEntries(
  emissionFactors.map((f) => [`${f.category}:${f.subcategory}`, f]),
);

export function getFactor(id) {
  return factorsById[id] || null;
}

export function getFactorByKey(category, subcategory) {
  return factorsByCategorySub[`${category}:${subcategory}`] || null;
}
