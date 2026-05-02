// Dining & food-system data. Mock POS records, vendors, ingredient purchases,
// food-waste logs, and menu scenarios. The dashboard uses these for the
// dining module and supplier/Scope-3 food estimates.

/**
 * @typedef {Object} DiningMenuItem
 * @property {string} id
 * @property {string} date          ISO date
 * @property {string} itemName
 * @property {'beef'|'pork'|'chicken'|'fish'|'vegetarian'|'vegan'|'mixed'} category
 * @property {string=} proteinType
 * @property {number} servingsServed
 * @property {number} kgco2ePerServing
 */

const mealCategories = /** @type {const} */ ([
  { category: 'beef',       proteinType: 'beef',     factorPerServing: 6.0 },
  { category: 'pork',       proteinType: 'pork',     factorPerServing: 1.4 },
  { category: 'chicken',    proteinType: 'chicken',  factorPerServing: 1.2 },
  { category: 'fish',       proteinType: 'fish',     factorPerServing: 1.0 },
  { category: 'vegetarian', proteinType: 'eggs',     factorPerServing: 0.45 },
  { category: 'vegan',      proteinType: 'legumes',  factorPerServing: 0.30 },
]);

/** @type {DiningMenuItem[]} */
export const diningMenuItems = (() => {
  const out = [];
  const start = new Date('2026-01-01').getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  // Last 90 days, three meals per day, distributed across categories
  for (let d = 0; d < 90; d++) {
    const date = new Date(start + d * dayMs).toISOString().slice(0, 10);
    mealCategories.forEach((m, i) => {
      const baseServings = [120, 80, 90, 50, 70, 40][i];
      const dayOfWeek = (new Date(date).getDay());
      const weekendShift = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0;
      out.push({
        id: `dmi_${d}_${m.category}`,
        date,
        itemName: `${m.category} entrée`,
        category: m.category,
        proteinType: m.proteinType,
        servingsServed: Math.round(baseServings * weekendShift * (0.9 + ((d * 7) % 21) / 100)),
        kgco2ePerServing: m.factorPerServing,
      });
    });
  }
  return out;
})();

/**
 * @typedef {Object} DiningVendor
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string[]} certifications
 * @property {number} deliveryDistanceMiles
 * @property {string} region
 */

/** @type {DiningVendor[]} */
export const diningVendors = [
  { id: 'v_sysco_neng',    name: 'Sysco New England',           category: 'broadline',  certifications: [],                       deliveryDistanceMiles: 110, region: 'New England' },
  { id: 'v_localfarms',    name: 'Upper Valley Farms Co-op',    category: 'produce',    certifications: ['Local', 'Sustainable'], deliveryDistanceMiles:  18, region: 'NH/VT' },
  { id: 'v_northcountry',  name: 'North Country Smokehouse',    category: 'meat',       certifications: ['Humane'],               deliveryDistanceMiles:  72, region: 'NH' },
  { id: 'v_organicvalley', name: 'Organic Valley',              category: 'dairy',      certifications: ['USDA Organic'],         deliveryDistanceMiles: 140, region: 'NE/Midwest' },
  { id: 'v_seafood',       name: 'Boston Seafood Direct',       category: 'seafood',    certifications: ['MSC'],                  deliveryDistanceMiles: 130, region: 'MA' },
  { id: 'v_baker',         name: 'King Arthur Baking',          category: 'bakery',     certifications: ['Local'],                deliveryDistanceMiles:  35, region: 'VT' },
];

/**
 * @typedef {Object} IngredientPurchase
 * @property {string} poId
 * @property {string} vendorId
 * @property {string} ingredient
 * @property {number} quantityKg
 * @property {string} origin
 * @property {number} priceUsd
 * @property {string} factorId  Reference to emissionFactors.id
 */

/** @type {IngredientPurchase[]} */
export const ingredientPurchases = [
  { poId: 'po_2026_001', vendorId: 'v_sysco_neng',   ingredient: 'beef ground 80/20', quantityKg: 320, origin: 'IA',  priceUsd: 2880, factorId: 'ef_food_beef' },
  { poId: 'po_2026_002', vendorId: 'v_northcountry', ingredient: 'pork loin',         quantityKg: 180, origin: 'NH',  priceUsd: 1620, factorId: 'ef_food_pork' },
  { poId: 'po_2026_003', vendorId: 'v_sysco_neng',   ingredient: 'chicken breast',    quantityKg: 410, origin: 'NC',  priceUsd: 2870, factorId: 'ef_food_chicken' },
  { poId: 'po_2026_004', vendorId: 'v_seafood',      ingredient: 'salmon filet',      quantityKg: 90,  origin: 'ME',  priceUsd: 1620, factorId: 'ef_food_fish' },
  { poId: 'po_2026_005', vendorId: 'v_organicvalley',ingredient: 'milk',              quantityKg: 1200,origin: 'WI',  priceUsd: 2400, factorId: 'ef_food_dairy' },
  { poId: 'po_2026_006', vendorId: 'v_localfarms',   ingredient: 'mixed greens',      quantityKg: 220, origin: 'NH/VT', priceUsd: 880,  factorId: 'ef_food_veg' },
  { poId: 'po_2026_007', vendorId: 'v_localfarms',   ingredient: 'apples',            quantityKg: 340, origin: 'NH',  priceUsd: 950,  factorId: 'ef_food_fruit' },
  { poId: 'po_2026_008', vendorId: 'v_baker',        ingredient: 'whole-wheat flour', quantityKg: 280, origin: 'VT',  priceUsd: 560,  factorId: 'ef_food_grains' },
];

/**
 * @typedef {Object} FoodWasteLog
 * @property {string} date
 * @property {'kitchen'|'serving_line'|'plate_scrape'} location
 * @property {number} preConsumerKg
 * @property {number} postConsumerKg
 * @property {number} compostedKg
 * @property {number} landfillKg
 */

/** @type {FoodWasteLog[]} */
export const foodWasteLogs = (() => {
  const out = [];
  const start = new Date('2026-02-01').getTime();
  for (let d = 0; d < 60; d++) {
    const date = new Date(start + d * 86400000).toISOString().slice(0, 10);
    const dow = new Date(date).getDay();
    const weekend = dow === 0 || dow === 6;
    out.push({
      date,
      location: 'plate_scrape',
      preConsumerKg: weekend ? 18 : 32,
      postConsumerKg: weekend ? 22 : 41,
      compostedKg: weekend ? 32 : 58,
      landfillKg: weekend ? 8 : 15,
    });
  }
  return out;
})();

/**
 * @typedef {Object} MenuScenario
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} beefReductionPct
 * @property {number} vegetarianIncreasePct
 * @property {number} estimatedAnnualReductionMt
 */

/** @type {MenuScenario[]} */
export const menuScenarios = [
  { id: 'ms_meatlessmonday',   name: 'Meatless Mondays',           description: 'Replace all beef on Mondays with vegetarian/vegan options.',          beefReductionPct: 14, vegetarianIncreasePct: 14, estimatedAnnualReductionMt: 38 },
  { id: 'ms_beef20',           name: 'Cut beef 20%',                description: 'Reduce beef portions and frequency by 20% across the week.',         beefReductionPct: 20, vegetarianIncreasePct: 12, estimatedAnnualReductionMt: 56 },
  { id: 'ms_beef50',           name: 'Beef → chicken 50% swap',     description: 'Swap half of beef entrées for chicken; preserve protein servings.',  beefReductionPct: 50, vegetarianIncreasePct:  0, estimatedAnnualReductionMt: 138 },
  { id: 'ms_localproduce',     name: '50% local produce sourcing',  description: 'Shift produce procurement to within-100-mile vendors.',              beefReductionPct:  0, vegetarianIncreasePct:  0, estimatedAnnualReductionMt: 12 },
];
