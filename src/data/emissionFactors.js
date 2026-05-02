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

/** @type {EmissionFactor[]} */
export const emissionFactors = [
  // Electricity — ISO-NE 2024 system mix average
  { id: 'ef_grid_isone_2024', category: 'electricity', subcategory: 'isone_grid', unit: 'kWh', kgco2e_per_unit: 0.0956, source: 'ISO New England 2024 System Mix', year: 2024 },
  { id: 'ef_grid_natgas',      category: 'electricity', subcategory: 'natural_gas',     unit: 'kWh', kgco2e_per_unit: 0.181,  source: 'ISO-NE generation mix', year: 2024 },
  { id: 'ef_grid_oil',         category: 'electricity', subcategory: 'oil',             unit: 'kWh', kgco2e_per_unit: 0.257,  source: 'ISO-NE generation mix', year: 2024 },
  { id: 'ef_grid_coal',        category: 'electricity', subcategory: 'coal',            unit: 'kWh', kgco2e_per_unit: 0.329,  source: 'ISO-NE generation mix', year: 2024 },

  // Heating fuels (Scope 1)
  { id: 'ef_fuel_oil_2',  category: 'fuel', subcategory: 'heating_oil_no2', unit: 'gallon', kgco2e_per_unit: 10.16, source: 'EPA GHG Emission Factors Hub 2024', year: 2024 },
  { id: 'ef_propane',     category: 'fuel', subcategory: 'propane',         unit: 'gallon', kgco2e_per_unit: 5.72,  source: 'EPA GHG Emission Factors Hub 2024', year: 2024 },
  { id: 'ef_natgas_therm',category: 'fuel', subcategory: 'natural_gas',     unit: 'therm',  kgco2e_per_unit: 5.31,  source: 'EPA GHG Emission Factors Hub 2024', year: 2024 },
  { id: 'ef_gasoline',    category: 'fuel', subcategory: 'gasoline',        unit: 'gallon', kgco2e_per_unit: 8.78,  source: 'EPA GHG Emission Factors Hub 2024', year: 2024 },
  { id: 'ef_diesel',      category: 'fuel', subcategory: 'diesel',          unit: 'gallon', kgco2e_per_unit: 10.21, source: 'EPA GHG Emission Factors Hub 2024', year: 2024 },

  // Refrigerants (selected)
  { id: 'ef_r410a', category: 'refrigerant', subcategory: 'r410a', unit: 'kg', kgco2e_per_unit: 2256, source: 'IPCC AR6 GWP100', year: 2024 },
  { id: 'ef_r134a', category: 'refrigerant', subcategory: 'r134a', unit: 'kg', kgco2e_per_unit: 1530, source: 'IPCC AR6 GWP100', year: 2024 },

  // Travel
  { id: 'ef_air_short', category: 'travel', subcategory: 'air_short_haul',     unit: 'passenger-mile', kgco2e_per_unit: 0.395, source: 'DEFRA 2024 (avg short-haul economy)', year: 2024 },
  { id: 'ef_air_long',  category: 'travel', subcategory: 'air_long_haul',      unit: 'passenger-mile', kgco2e_per_unit: 0.193, source: 'DEFRA 2024 (avg long-haul economy)', year: 2024 },
  { id: 'ef_car_avg',   category: 'travel', subcategory: 'passenger_car_avg',  unit: 'mile',           kgco2e_per_unit: 0.351, source: 'EPA Greenhouse Gases from a Typical Passenger Vehicle', year: 2024 },
  { id: 'ef_bus',       category: 'travel', subcategory: 'school_bus',         unit: 'mile',           kgco2e_per_unit: 1.96,  source: 'EPA medium/heavy duty diesel', year: 2024 },

  // Food (cradle-to-farm-gate, kg CO2e per kg edible food)
  { id: 'ef_food_beef',     category: 'food', subcategory: 'beef',     unit: 'kg', kgco2e_per_unit: 60.0, source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_lamb',     category: 'food', subcategory: 'lamb',     unit: 'kg', kgco2e_per_unit: 24.0, source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_pork',     category: 'food', subcategory: 'pork',     unit: 'kg', kgco2e_per_unit: 7.0,  source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_chicken',  category: 'food', subcategory: 'chicken',  unit: 'kg', kgco2e_per_unit: 6.0,  source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_fish',     category: 'food', subcategory: 'fish',     unit: 'kg', kgco2e_per_unit: 5.0,  source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_dairy',    category: 'food', subcategory: 'dairy',    unit: 'kg', kgco2e_per_unit: 3.2,  source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_eggs',     category: 'food', subcategory: 'eggs',     unit: 'kg', kgco2e_per_unit: 4.5,  source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_rice',     category: 'food', subcategory: 'rice',     unit: 'kg', kgco2e_per_unit: 4.0,  source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_grains',   category: 'food', subcategory: 'grains',   unit: 'kg', kgco2e_per_unit: 1.4,  source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_legumes',  category: 'food', subcategory: 'legumes',  unit: 'kg', kgco2e_per_unit: 0.9,  source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_veg',      category: 'food', subcategory: 'vegetables', unit: 'kg', kgco2e_per_unit: 0.5,  source: 'Poore & Nemecek 2018', year: 2018 },
  { id: 'ef_food_fruit',    category: 'food', subcategory: 'fruit',    unit: 'kg', kgco2e_per_unit: 0.4,  source: 'Poore & Nemecek 2018', year: 2018 },

  // Waste (EPA WARM v15)
  { id: 'ef_waste_landfill_mixed', category: 'waste', subcategory: 'landfill_mixed', unit: 'kg', kgco2e_per_unit: 0.467, source: 'EPA WARM v15', year: 2023 },
  { id: 'ef_waste_recycling',      category: 'waste', subcategory: 'recycling',      unit: 'kg', kgco2e_per_unit: -1.07, source: 'EPA WARM v15 (avoided)', year: 2023 },
  { id: 'ef_waste_compost',        category: 'waste', subcategory: 'compost_food',   unit: 'kg', kgco2e_per_unit: -0.18, source: 'EPA WARM v15 (avoided)', year: 2023 },

  // Procurement (EEIO Cat 1 spend-based, USD-denominated)
  { id: 'ef_proc_paper',     category: 'procurement', subcategory: 'paper',          unit: 'USD', kgco2e_per_unit: 0.420, source: 'US EPA EEIO v2.0', year: 2023 },
  { id: 'ef_proc_it',        category: 'procurement', subcategory: 'it_equipment',   unit: 'USD', kgco2e_per_unit: 0.380, source: 'US EPA EEIO v2.0', year: 2023 },
  { id: 'ef_proc_cleaning',  category: 'procurement', subcategory: 'cleaning',       unit: 'USD', kgco2e_per_unit: 0.330, source: 'US EPA EEIO v2.0', year: 2023 },
  { id: 'ef_proc_uniforms',  category: 'procurement', subcategory: 'apparel',        unit: 'USD', kgco2e_per_unit: 0.510, source: 'US EPA EEIO v2.0', year: 2023 },
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
