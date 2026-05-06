// Geography-anchored bottom-up emission estimates for KUA.
//
// The canonical figures in scopeTotals.js are hand-set placeholders
// (Scope 1 = 1,250 mt, Scope 3 = 2,700 mt) that explicitly need
// replacing with measured data. THIS file provides a parallel
// bottom-up estimate computed from KUA's actual building stock,
// fleet, and student composition × published NH/Upper Valley factors.
//
// Two reasons this exists:
//   1. The /admin/methodology page can show admins the geography-
//      anchored estimate next to the placeholder so they can see
//      what the data layer would say if it had real measurements.
//   2. The /api/admin/estimate-action LLM prompt anchors on these
//      same numbers so admin-typed actions get carbon-impact
//      estimates calibrated to a New Hampshire boarding school of
//      KUA's specific size, not a generic average.
//
// Every assumption below is sourced. Replace the input quantities
// with measured values as they land; the methodology here is the
// target endpoint, not a placeholder.
//
// Sources
//   • EPA GHG Emission Factors Hub 2024 (Stationary + Mobile Combustion)
//   • EIA RECS 2020 NH residential heating intensity
//   • ASHRAE 90.1-2019 climate zone 6 commercial energy intensity
//   • NOAA NCEI 1991-2020 normals — Lebanon NH HDD ~7,400
//   • IPCC AR6 GWP100s for refrigerants
//   • ICAO Carbon Emissions Calculator + DEFRA 2024 RF multiplier
//   • Yale-style student-travel methodology (residential boarding)
//   • Birdsey 1992 (USDA WO-59) US-forest sequestration averages
//   • Nowak 2013 urban-tree sequestration (open-grown component)
//   • USDA NH Forest Inventory and Analysis (Morin 2020)

import { buildings } from './buildings.js';
import { fleetVehicles } from './transportation.js';
import { TOTAL_STUDENTS } from './students.js';
import { ANNUAL_SEQUESTRATION_MT } from './sinks.js';

// ─── Climate + geography constants ────────────────────────────────

// Plainfield NH sits in IECC climate zone 6A. Lebanon (closest NOAA
// station) reports 7,400 HDD on the 1991-2020 normals. KUA is at
// slightly higher elevation than Lebanon (700 ft vs 600 ft) so a
// small upward adjustment is justified — using 7,500 HDD as the
// design value, in line with ASHRAE handbook for the upper Connecticut
// River valley.
export const KUA_HDD_BASE_65 = 7500;

// Distance from Plainfield to common student-travel anchors. Used
// by the Scope 3 student-travel estimate. Great-circle for flights;
// road distance for drives.
export const TRAVEL_ANCHORS_MI = {
  // Drive anchors (one-way, road miles)
  Lebanon_NH:    8,
  Hanover_NH:    8,
  Concord_NH:    65,
  Manchester_NH: 95,
  Boston_MA:     130,
  NYC_NY:        300,
  // Air anchors from Boston Logan (BOS, the dominant gateway) —
  // great-circle one-way.
  BOS_to_LAX:    2611,
  BOS_to_DEN:    1754,
  BOS_to_CHI:    867,
  BOS_to_MIA:    1258,
  BOS_to_SFO:    2704,
  // International (one-way great-circle from BOS)
  BOS_to_LHR:    3265,  // London — most-common European hub
  BOS_to_PEK:    6722,  // Beijing — proxy for East Asia
  BOS_to_PVG:    7376,  // Shanghai
  BOS_to_HKG:    8049,
  BOS_to_DEL:    7434,
  BOS_to_SEL:    6845,  // Seoul (ICN)
  BOS_to_NRT:    6707,  // Tokyo (Narita)
};

// ─── Per-fuel emission factors (kg CO2e per unit) ────────────────
// All from EPA GHG Emission Factors Hub 2024 unless noted.

export const FUEL_FACTORS = {
  heating_oil_2:  { kg_per_gal: 10.16, source: 'EPA Stationary Combustion Table 2 (Distillate Fuel Oil #2)', year: 2024 },
  propane:        { kg_per_gal: 5.72,  source: 'EPA Stationary Combustion Table 2 (LPG)',                    year: 2024 },
  natural_gas:    { kg_per_therm: 5.31, source: 'EPA Stationary Combustion (Natural gas)',                   year: 2024 },
  gasoline:       { kg_per_gal: 8.78,  source: 'EPA Mobile Combustion (Motor gasoline)',                     year: 2024 },
  diesel:         { kg_per_gal: 10.21, source: 'EPA Mobile Combustion (Distillate Fuel Oil #2 / diesel)',    year: 2024 },
};

// Heating value of #2 heating oil = 138,500 BTU/gal (EIA Annual Energy
// Outlook). Used to convert building heating-energy demand (BTU) to
// gallons consumed.
export const HEATING_OIL_BTU_PER_GAL = 138500;

// ─── Heating energy intensity by building type ───────────────────
// kBTU per square foot per year of heating demand at KUA's HDD basis.
// These are blended values that assume the building stock at a NH
// boarding school is older than the modern ASHRAE 90.1-2019 baseline:
// dorms run 24/7 with sub-modern envelopes, athletic spaces have high
// ceilings and partial setback, academic spaces have shorter
// occupancy hours.
//
// Anchor: EIA RECS 2020 average NH single-family home = ~95 MMBtu/yr
// over ~2,400 sqft = 40 kBTU/sqft/yr (residential, includes hot
// water). Commercial intensity in CZ-6 typically runs 50-80 kBTU/sqft
// for old stock per ASHRAE handbook benchmarks. We pick midpoints
// scaled by occupancy pattern.
export const HEATING_KBTU_PER_SQFT = {
  Dorm:     75,  // 24/7 occupied, older envelope
  Academic: 55,  // 7am–10pm weekdays, modernized
  Athletic: 45,  // High volume but lower setpoint, partial occupancy
  Dining:   65,  // Kitchen heat recovery offsets some demand
  Other:    55,  // Mixed-use default
};

// ─── Bottom-up: SCOPE 1 heating from building stock ──────────────

const _heating = (() => {
  let totalBtu = 0;
  const perBuilding = [];
  for (const b of buildings) {
    const intensity = HEATING_KBTU_PER_SQFT[b.category] ?? HEATING_KBTU_PER_SQFT.Other;
    const btu = b.sqft * intensity * 1000; // intensity is kBTU/sqft/yr
    totalBtu += btu;
    perBuilding.push({ id: b.id, name: b.name, sqft: b.sqft, kbtuPerSqft: intensity, btuYr: btu });
  }
  // Assume the heating fuel mix is 90% #2 heating oil + 10% propane
  // (typical NH boarding school per public KUA disclosures + Sodexo/
  // facilities references). Update when fuel-delivery records land.
  const oilFraction = 0.90;
  const oilGal = (totalBtu * oilFraction) / HEATING_OIL_BTU_PER_GAL;
  const propaneGal = (totalBtu * (1 - oilFraction)) / 91500; // 91,500 BTU/gal LPG
  const oilMt = (oilGal * FUEL_FACTORS.heating_oil_2.kg_per_gal) / 1000;
  const propaneMt = (propaneGal * FUEL_FACTORS.propane.kg_per_gal) / 1000;
  return {
    totalBtuYr: totalBtu,
    oilGalYr: oilGal,
    propaneGalYr: propaneGal,
    heatingMt: oilMt + propaneMt,
    perBuilding,
    assumption: '90% heating oil + 10% propane mix; replace with measured fuel-delivery records when integrated.',
  };
})();
export const SCOPE1_HEATING_BOTTOM_UP_MT = _heating.heatingMt;
export const SCOPE1_HEATING_DETAIL = _heating;

// ─── Bottom-up: SCOPE 1 fleet ────────────────────────────────────

const _fleet = (() => {
  let mt = 0;
  const perVehicle = [];
  for (const v of fleetVehicles) {
    const factor = v.fuelType === 'diesel' ? FUEL_FACTORS.diesel : FUEL_FACTORS.gasoline;
    const gal = v.annualMiles / v.mpg;
    const v_mt = (gal * factor.kg_per_gal) / 1000;
    mt += v_mt;
    perVehicle.push({ id: v.id, type: v.type, fuelType: v.fuelType, mpg: v.mpg, annualMiles: v.annualMiles, gal, mt: v_mt });
  }
  return { fleetMt: mt, perVehicle };
})();
export const SCOPE1_FLEET_BOTTOM_UP_MT = _fleet.fleetMt;
export const SCOPE1_FLEET_DETAIL = _fleet;

// ─── Bottom-up: SCOPE 1 refrigerants ─────────────────────────────
// Cited estimate: typical NH boarding-school HVAC charge ~80 lb
// total across all systems (per HVAC service literature for
// equivalent campuses). Industry leak rate 5-15%/yr; midpoint 10%.
// Mix R-410A (modern AC, GWP 2256) + R-134a (older/mobile AC, GWP 1530).
// Refresh with technician service-report mass balance when wired.
const _refrigerants = (() => {
  const totalLb = 80;
  const leakFraction = 0.10;
  const r410aShare = 0.7;
  const r134aShare = 0.3;
  const lbToKg = 0.4536;
  const r410aLeakKg = totalLb * leakFraction * r410aShare * lbToKg;
  const r134aLeakKg = totalLb * leakFraction * r134aShare * lbToKg;
  const r410aMt = (r410aLeakKg * 2256) / 1000;
  const r134aMt = (r134aLeakKg * 1530) / 1000;
  return {
    refrigerantsMt: r410aMt + r134aMt,
    assumption: `${totalLb} lb total charge × ${leakFraction*100}% annual leak rate × R-410A (70%, GWP 2256) / R-134a (30%, GWP 1530) mix.`,
  };
})();
export const SCOPE1_REFRIGERANTS_BOTTOM_UP_MT = _refrigerants.refrigerantsMt;
export const SCOPE1_REFRIGERANTS_DETAIL = _refrigerants;

// ─── Total bottom-up SCOPE 1 ────────────────────────────────────
export const SCOPE1_BOTTOM_UP_MT = +(
  SCOPE1_HEATING_BOTTOM_UP_MT +
  SCOPE1_FLEET_BOTTOM_UP_MT +
  SCOPE1_REFRIGERANTS_BOTTOM_UP_MT
).toFixed(0);

// ─── Bottom-up: SCOPE 3 student travel ───────────────────────────
// Yale-style residential-school methodology. Each cohort gets an
// average per-student annual emissions figure based on typical
// home-state distribution + trip frequency.
//
// Cohort breakdown (per KUA enrollment — adjust as roster lands):
//   Day students:     ~100 (local commute, no break flights)
//   US boarders:      ~190 (mostly Northeast + scattered West/South)
//   International:    ~50  (East Asia heavy, also Europe + S. America)
//
// Per-student annual estimates use ICAO calculator + DEFRA 2024
// per-passenger-km factors (with radiative forcing).
const STUDENT_COHORTS = {
  day:           { count: 100, mtPerStudentPerYr: 1.5,  basis: 'Avg 12 mi one-way × 180 school days × 0.351 kg/mi (EPA passenger vehicle)' },
  usBoarder:     { count: 190, mtPerStudentPerYr: 3.0,  basis: 'Avg 3.5 RTs/yr × ~1500 mi avg one-way × mode-mix (drive <500mi, fly above) × ICAO/EPA factors' },
  international: { count: 50,  mtPerStudentPerYr: 5.5,  basis: 'Avg 1.8 RTs/yr × ~5500 mi one-way × DEFRA long-haul with RF (~0.241 kg/passenger-mi)' },
};
const _studentTravel = (() => {
  const breakdown = Object.entries(STUDENT_COHORTS).map(([key, c]) => ({
    cohort: key,
    count: c.count,
    perStudent: c.mtPerStudentPerYr,
    totalMt: c.count * c.mtPerStudentPerYr,
    basis: c.basis,
  }));
  const total = breakdown.reduce((s, b) => s + b.totalMt, 0);
  return { studentTravelMt: total, breakdown };
})();
export const SCOPE3_STUDENT_TRAVEL_BOTTOM_UP_MT = _studentTravel.studentTravelMt;
export const SCOPE3_STUDENT_TRAVEL_DETAIL = _studentTravel;

// ─── Bottom-up: SCOPE 3 dining (food procurement) ────────────────
// 340 students × ~3 meals/day × 36 weeks = ~257K meals/yr.
// Plus faculty/staff/visitor meals: ~50K/yr → ~310K total.
// Average emission factor per institutional meal in mixed-protein US
// dining: ~0.7 kg CO2e/meal (Sodexo institutional benchmark + Poore
// & Nemecek 2018 weighted by typical menu mix). KUA serves more meat
// than the average so scaling to 0.85 kg/meal.
const _dining = (() => {
  const studentMealsPerYr = 340 * 3 * 36 * 7; // 36 weeks × 7 days
  const otherMealsPerYr = 50000;
  const totalMeals = studentMealsPerYr + otherMealsPerYr;
  const kgPerMeal = 0.85;
  return {
    diningMt: (totalMeals * kgPerMeal) / 1000,
    totalMeals,
    kgPerMeal,
    basis: '~310K meals/yr × ~0.85 kgCO2e/meal (Poore & Nemecek 2018 mix scaled for typical NH school menu).',
  };
})();
export const SCOPE3_DINING_BOTTOM_UP_MT = _dining.diningMt;
export const SCOPE3_DINING_DETAIL = _dining;

// ─── Bottom-up: SCOPE 3 waste ────────────────────────────────────
// 340 students + ~80 staff = ~420 people on campus.
// Per-person waste generation in K-12/college environments: ~0.5
// kg/day per EPA Sustainable Materials Management benchmarks.
// Assume 60% landfill / 25% recycling / 15% compost split.
// Net emissions = landfill × +0.467 + recycling × −1.07 + compost ×
// −0.18 (EPA WARM v15.1).
const _waste = (() => {
  const peopleOnCampus = 420;
  const kgPerPersonPerDay = 0.5;
  const daysPerYr = 220; // school days; reduces summer
  const totalKg = peopleOnCampus * kgPerPersonPerDay * daysPerYr;
  const landfillKg = totalKg * 0.60;
  const recyclingKg = totalKg * 0.25;
  const compostKg = totalKg * 0.15;
  const mt =
    (landfillKg * 0.467 + recyclingKg * -1.07 + compostKg * -0.18) / 1000;
  return {
    wasteMt: mt,
    breakdown: { landfillKg, recyclingKg, compostKg, totalKg },
    basis: 'EPA SMM ~0.5 kg/person/day × 220 school-days × 60/25/15 landfill/recycle/compost split × EPA WARM v15.1 net factors.',
  };
})();
export const SCOPE3_WASTE_BOTTOM_UP_MT = _waste.wasteMt;
export const SCOPE3_WASTE_DETAIL = _waste;

// ─── Bottom-up: SCOPE 3 commuting (faculty/staff) ───────────────
// ~52 staff × ~12 mi avg one-way (Upper Valley faculty distribution)
// × 2 (RT) × 180 days × ~0.30 kg/mi (mixed gas/EV/carpool blend).
const _commuting = (() => {
  const staff = 52;
  const oneWayMi = 12;
  const days = 180;
  const kgPerMi = 0.30;
  const mt = (staff * oneWayMi * 2 * days * kgPerMi) / 1000;
  return {
    commutingMt: mt,
    basis: `${staff} staff × ${oneWayMi} mi avg × 2 (RT) × ${days} days × ${kgPerMi} kg/mi (mixed mode).`,
  };
})();
export const SCOPE3_COMMUTING_BOTTOM_UP_MT = _commuting.commutingMt;
export const SCOPE3_COMMUTING_DETAIL = _commuting;

// ─── Bottom-up: SCOPE 3 purchased goods ─────────────────────────
// Order-of-magnitude: typical small private school annual operating
// budget ~$30-40M; ~$3M/yr discretionary procurement (paper, IT,
// cleaning, apparel, etc.). EPA EEIO v2.0 spend-based factor avg
// ~0.4 kg CO2e per $ for educational services / non-energy goods.
const _goods = (() => {
  const annualSpendUsd = 3_000_000;
  const kgPerUsd = 0.40;
  const mt = (annualSpendUsd * kgPerUsd) / 1000;
  return {
    goodsMt: mt,
    basis: `$${annualSpendUsd.toLocaleString()} non-energy procurement × ${kgPerUsd} kg CO2e/$ EPA EEIO v2.0 weighted avg.`,
  };
})();
export const SCOPE3_GOODS_BOTTOM_UP_MT = _goods.goodsMt;
export const SCOPE3_GOODS_DETAIL = _goods;

// ─── Bottom-up: SCOPE 3 upstream fuel ───────────────────────────
// Well-to-pump emissions for the heating + grid + mobile fuels
// already counted in Scopes 1+2. EPA upstream factors typically
// add 15-20% on top of combustion. Use 17% on the bottom-up
// Scope 1 figure.
const _upstream = (() => {
  const upstreamMt = SCOPE1_BOTTOM_UP_MT * 0.17;
  return {
    upstreamMt,
    basis: '17% upstream uplift on bottom-up Scope 1 (EPA Cat 3 / Quantis upstream factors for heating oil + grid + mobile).',
  };
})();
export const SCOPE3_UPSTREAM_FUEL_BOTTOM_UP_MT = _upstream.upstreamMt;
export const SCOPE3_UPSTREAM_FUEL_DETAIL = _upstream;

// ─── Total bottom-up SCOPE 3 ────────────────────────────────────
export const SCOPE3_BOTTOM_UP_MT = +(
  SCOPE3_STUDENT_TRAVEL_BOTTOM_UP_MT +
  SCOPE3_DINING_BOTTOM_UP_MT +
  SCOPE3_WASTE_BOTTOM_UP_MT +
  SCOPE3_COMMUTING_BOTTOM_UP_MT +
  SCOPE3_GOODS_BOTTOM_UP_MT +
  SCOPE3_UPSTREAM_FUEL_BOTTOM_UP_MT
).toFixed(0);

// ─── Composed bottom-up vs canonical comparison helper ──────────
// Components that consumers can show side-by-side with the canonical
// scopeTotals figures. Each component carries its computational basis
// for transparency on the methodology page.
export const BOTTOM_UP_BREAKDOWN = [
  {
    scope: 'Scope 1', component: 'Heating fuel',
    mt: SCOPE1_HEATING_BOTTOM_UP_MT,
    basis: `~${Math.round(SCOPE1_HEATING_DETAIL.oilGalYr).toLocaleString()} gal heating oil + ~${Math.round(SCOPE1_HEATING_DETAIL.propaneGalYr).toLocaleString()} gal propane × EPA Stationary Combustion factors. Building demand from KUA actual sqft (290K total) × NH-CZ6 heating intensity per category (Dorm 75 / Academic 55 / Athletic 45 / Other 55 kBtu/sqft/yr).`,
    citations: ['EPA Hub 2024', 'EIA RECS 2020', 'ASHRAE 90.1 CZ-6'],
  },
  {
    scope: 'Scope 1', component: 'Refrigerants',
    mt: SCOPE1_REFRIGERANTS_BOTTOM_UP_MT,
    basis: SCOPE1_REFRIGERANTS_DETAIL.assumption,
    citations: ['IPCC AR6 GWP100'],
  },
  {
    scope: 'Scope 1', component: 'Fleet vehicles',
    mt: SCOPE1_FLEET_BOTTOM_UP_MT,
    basis: `Computed exactly from src/data/transportation.js fleetVehicles: 5 vehicles × actual annualMiles ÷ mpg × EPA Mobile Combustion factors. ${Math.round(SCOPE1_FLEET_DETAIL.perVehicle.reduce((s,v)=>s+v.gal,0)).toLocaleString()} gal/yr total.`,
    citations: ['EPA Hub 2024 Mobile Combustion'],
  },
  {
    scope: 'Scope 3', component: 'Student travel',
    mt: SCOPE3_STUDENT_TRAVEL_BOTTOM_UP_MT,
    basis: `Yale-style cohort method: Day (${STUDENT_COHORTS.day.count}×${STUDENT_COHORTS.day.mtPerStudentPerYr}) + US boarders (${STUDENT_COHORTS.usBoarder.count}×${STUDENT_COHORTS.usBoarder.mtPerStudentPerYr}) + International (${STUDENT_COHORTS.international.count}×${STUDENT_COHORTS.international.mtPerStudentPerYr}) per-student annual mt × cohort size.`,
    citations: ['ICAO Carbon Calculator', 'DEFRA 2024 with RF', 'EPA Mobile Combustion'],
  },
  {
    scope: 'Scope 3', component: 'Dining (food procurement)',
    mt: SCOPE3_DINING_BOTTOM_UP_MT,
    basis: SCOPE3_DINING_DETAIL.basis,
    citations: ['Poore & Nemecek 2018'],
  },
  {
    scope: 'Scope 3', component: 'Waste',
    mt: SCOPE3_WASTE_BOTTOM_UP_MT,
    basis: SCOPE3_WASTE_DETAIL.basis,
    citations: ['EPA SMM 2020', 'EPA WARM v15.1'],
  },
  {
    scope: 'Scope 3', component: 'Faculty / staff commute',
    mt: SCOPE3_COMMUTING_BOTTOM_UP_MT,
    basis: SCOPE3_COMMUTING_DETAIL.basis,
    citations: ['GHG Protocol Cat 7', 'ICCT US fleet fuel-economy'],
  },
  {
    scope: 'Scope 3', component: 'Purchased goods (Cat 1)',
    mt: SCOPE3_GOODS_BOTTOM_UP_MT,
    basis: SCOPE3_GOODS_DETAIL.basis,
    citations: ['EPA EEIO v2.0'],
  },
  {
    scope: 'Scope 3', component: 'Upstream fuel (Cat 3)',
    mt: SCOPE3_UPSTREAM_FUEL_BOTTOM_UP_MT,
    basis: SCOPE3_UPSTREAM_FUEL_DETAIL.basis,
    citations: ['EPA Cat 3 upstream factors'],
  },
];

// ─── Bottom-up totals ───────────────────────────────────────────
// Scope 2 stays as-measured (composedYtd × ISO-NE per-fuel factors)
// because it's the only scope with real BMS data. Sinks come from
// the forest-stand inventory in sinks.js.
export const BOTTOM_UP_TOTALS = {
  scope1: SCOPE1_BOTTOM_UP_MT,
  scope3: SCOPE3_BOTTOM_UP_MT,
  // Scope 2 + sinks intentionally not duplicated here — they come
  // from the existing measured chains (composedYtd → gridMix and
  // sinks.js forestStands).
  sinks: Math.round(ANNUAL_SEQUESTRATION_MT),
  studentsAtBasis: TOTAL_STUDENTS,
  hddBasis: KUA_HDD_BASE_65,
};
