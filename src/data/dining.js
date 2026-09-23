import { getFactorByKey } from './emissionFactors.js';
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

// Per-serving figures rescaled in Phase 405 by each protein's own
// correction ratio, so whatever portion size was originally assumed is
// preserved rather than re-guessed. See emissionFactors.js for why the
// per-kg factors moved.
const mealCategories = /** @type {const} */ ([
  { category: 'beef',       proteinType: 'beef',     factorPerServing: 9.95 },
  { category: 'pork',       proteinType: 'pork',     factorPerServing: 2.46 },
  { category: 'chicken',    proteinType: 'chicken',  factorPerServing: 1.98 },
  { category: 'fish',       proteinType: 'fish',     factorPerServing: 2.72 },
  { category: 'vegetarian', proteinType: 'eggs',     factorPerServing: 0.47 },
  { category: 'vegan',      proteinType: 'legumes',  factorPerServing: 0.33 },
]);

/**
 * TWO PORTION SIZES FOR ONE SERVING, published rather than quietly averaged.
 *
 * The per-serving factors above divide by their own per-kg factor to imply a
 * portion: beef 100 g, pork/chicken/fish 200 g, eggs 100 g, legumes 330 g.
 * `utils/personalFootprint.js` separately states that "a beef serving is
 * ~150 g" and prices it at 15 kg CO2e. So the same repo values one beef
 * serving at 9.95 and at 15 — a 51% gap on the same quantity, from the same
 * Poore & Nemecek per-kg factor.
 *
 * Neither is obviously wrong. The dining figures were RESCALED in Phase 405
 * "so whatever portion size was originally assumed is preserved rather than
 * re-guessed" — meaning the 100 g was inherited, never chosen. The 150 g in
 * the footprint tool was chosen deliberately and documented.
 *
 * Reconciling them moves a published total (dining ~243 mtCO2e), so it is a
 * decision, not a fix — the same posture as FACTOR_RECONCILIATION and
 * SINKS_RECONCILIATION. What is NOT acceptable is leaving a reader to meet
 * both numbers on different pages with nothing saying they disagree.
 */
// Implied portion size per category, DERIVED from the per-serving figure and
// the canonical per-kg factor rather than asserted. This is what exposed that
// the table carries four different assumptions, not the two the note used to
// name: beef and eggs at 100 g, pork/chicken/fish at 200 g, legumes at 330 g.
//
// Same cause as task #18: Phase 405 rescaled each row by its own protein's
// correction ratio, which preserved whatever portion was assumed underneath
// instead of re-deriving it. A rescale carries its errors forward.
const CATEGORY_PROTEIN = {
  beef: 'beef', pork: 'pork', chicken: 'chicken',
  fish: 'fish', vegetarian: 'eggs', vegan: 'legumes',
};
const _servingKgByCategory = Object.fromEntries(
  mealCategories.map((m) => [m.category, m.factorPerServing]),
);
const _impliedGramsByCategory = Object.fromEntries(
  mealCategories.map((m) => {
    const perKg = getFactorByKey('food', CATEGORY_PROTEIN[m.category]).kgco2e_per_unit;
    return [m.category, +((m.factorPerServing / perKg) * 1000).toFixed(0)];
  }),
);

// What reconciling would actually cost, so the open decision can be judged
// rather than just noted. Beef is ~68% of the menu's emissions, so any uniform
// portion raises the total — 150 g because that is the size the
// personal-footprint tool already states, 200 g because that is what three of
// the four meats already imply.
// Computed lazily: diningMenuItems is declared below this object, so running
// it at module init would hit the temporal dead zone. Memoised on first read.
let _standardiseCache = null;
const _computeStandardisePct = () => {
  const base = { cur: 0, at150: 0, at200: 0 };
  for (const item of diningMenuItems) {
    const perKg = getFactorByKey('food', CATEGORY_PROTEIN[item.category])?.kgco2e_per_unit;
    if (!perKg) continue;
    const s = item.servingsServed || 0;
    base.cur += s * item.kgco2ePerServing;
    base.at150 += s * perKg * 0.150;
    base.at200 += s * perKg * 0.200;
  }
  const pct = (v) => +(((v - base.cur) / base.cur) * 100).toFixed(0);
  return { at150: pct(base.at150), at200: pct(base.at200) };
};

export const PORTION_RECONCILIATION = {
  impliedGramsByCategory: _impliedGramsByCategory,
  servingKgByCategory: _servingKgByCategory,
  distinctPortionSizes: new Set(Object.values(_impliedGramsByCategory)).size,
  get standardisePct() {
    if (!_standardiseCache) _standardiseCache = _computeStandardisePct();
    return _standardiseCache;
  },
  diningBeefKgPerServing: 9.95,
  footprintBeefKgPerServing: 15,
  diningImpliedGrams: 100,
  footprintStatedGrams: 150,
  otherMeatsImpliedGrams: 200,
  gapPct: +(((15 - 9.95) / 9.95) * 100).toFixed(0),
  aligned: false,
  note: 'A beef serving is priced at 9.95 kg CO2e on the dining page (implying a 100 g portion) and 15 kg CO2e in the personal-footprint tool (a stated 150 g). Beef is also the only meat here implying a 100 g portion; pork, chicken and fish all imply 200 g. Both trace to the same Poore & Nemecek per-kg figure, so the gap is portion size, not sourcing. Reconciling it moves the published dining total, so it is held for a deliberate decision.',
};

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

// Reduction totals rescaled in Phase 415 by the beef-factor correction
// (x1.658). Phase 405 moved factorPerServing from 6.0 to 9.95 but left these
// hardcoded, so this file disagreed with itself for ten phases. The
// local-produce scenario is unchanged — it does not derive from the beef
// factor.
/** @type {MenuScenario[]} */
export const menuScenarios = [
  { id: 'ms_meatlessmonday',   name: 'Meatless Mondays',           description: 'Replace all beef on Mondays with vegetarian/vegan options.',          beefReductionPct: 14, vegetarianIncreasePct: 14, estimatedAnnualReductionMt: 63 },
  { id: 'ms_beef20',           name: 'Cut beef 20%',                description: 'Reduce beef portions and frequency by 20% across the week.',         beefReductionPct: 20, vegetarianIncreasePct: 12, estimatedAnnualReductionMt: 93 },
  { id: 'ms_beef50',           name: 'Beef → chicken 50% swap',     description: 'Swap half of beef entrées for chicken; preserve protein servings.',  beefReductionPct: 50, vegetarianIncreasePct:  0, estimatedAnnualReductionMt: 229 },
  { id: 'ms_localproduce',     name: '50% local produce sourcing',  description: 'Shift produce procurement to within-100-mile vendors.',              beefReductionPct:  0, vegetarianIncreasePct:  0, estimatedAnnualReductionMt: 12 },
];
