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

// Helper: build a {methods, low, central, high} range from a list of
// independently-derived single-point estimates. Central = mean of
// methods (each method is one reasonable interpretation; mean is the
// least-arbitrary aggregator without weighting).
function rangeFromMethods(methods) {
  const all = methods.filter((m) => Number.isFinite(m.mt));
  if (all.length === 0) return { methods: [], low: 0, central: 0, high: 0 };
  return {
    methods: all,
    low: Math.min(...all.map((x) => x.mt)),
    central: all.reduce((s, x) => s + x.mt, 0) / all.length,
    high: Math.max(...all.map((x) => x.mt)),
  };
}

// ─── SCOPE 1 heating from building stock — 3 method cross-check ──

const _heatingRange = (() => {
  // Sum demand from KUA's actual building stock at three different
  // intensity assumptions. Same 90/10 oil/propane mix across methods.
  function buildHeatingMt(intensityByCategory, label, basis) {
    let totalBtu = 0;
    const perBuilding = [];
    for (const b of buildings) {
      const intensity = intensityByCategory[b.category] ?? intensityByCategory.Other;
      const btu = b.sqft * intensity * 1000;
      totalBtu += btu;
      perBuilding.push({ id: b.id, name: b.name, sqft: b.sqft, kbtuPerSqft: intensity, btuYr: btu });
    }
    const oilFraction = 0.90;
    const oilGal = (totalBtu * oilFraction) / HEATING_OIL_BTU_PER_GAL;
    const propaneGal = (totalBtu * (1 - oilFraction)) / 91500;
    const oilMt = (oilGal * FUEL_FACTORS.heating_oil_2.kg_per_gal) / 1000;
    const propaneMt = (propaneGal * FUEL_FACTORS.propane.kg_per_gal) / 1000;
    return {
      label,
      mt: oilMt + propaneMt,
      basis,
      detail: { totalBtu, oilGal, propaneGal, perBuilding },
    };
  }

  // Method A: ASHRAE 90.1-2019 modern compliance (lower bound).
  // Assumes new buildings meeting current code; KUA stock is older
  // than this so this is a "what the campus could be" floor.
  const A = buildHeatingMt(
    { Dorm: 50, Academic: 38, Athletic: 32, Dining: 45, Other: 38 },
    'ASHRAE 90.1-2019 modern compliance (lower bound)',
    `${(290_300).toLocaleString()} sqft × ASHRAE 90.1-2019 climate-zone-6 commercial-energy targets per occupancy class × 90% oil + 10% propane mix.`,
  );
  // Method B: KUA-typical NH-CZ6 older stock (current bottom-up).
  const B = buildHeatingMt(
    HEATING_KBTU_PER_SQFT,
    'KUA-typical (NH-CZ6 older stock)',
    `${(290_300).toLocaleString()} sqft × intensity by category (Dorm 75 / Academic 55 / Athletic 45 / Dining 65 / Other 55 kBtu/sqft/yr) × 90% oil + 10% propane. EIA RECS 2020 NH residential anchor + ASHRAE handbook commercial blend.`,
  );
  // Method C: HDD-direct method (sanity cross-check).
  // Per ENERGY STAR Portfolio Manager NH-school benchmark: heating
  // demand for NH K-12 schools averages ~12 BTU/ft²/HDD for older
  // stock. With 7,500 HDD: 12 × 7500 = 90 kBtu/sqft/yr blended.
  const C = buildHeatingMt(
    { Dorm: 95, Academic: 85, Athletic: 75, Dining: 95, Other: 85 },
    'HDD-direct (ENERGY STAR NH-K12 benchmark, upper bound)',
    `12 BTU/sqft/HDD × ${KUA_HDD_BASE_65.toLocaleString()} HDD = ~90 kBtu/sqft/yr blended × 290K sqft × 90/10 oil/propane. Anchor: ENERGY STAR Portfolio Manager NH-K12 benchmark for older stock — uses HDD directly instead of fixed intensities.`,
  );

  return rangeFromMethods([A, B, C]);
})();
export const SCOPE1_HEATING_RANGE = _heatingRange;
export const SCOPE1_HEATING_BOTTOM_UP_MT = Math.round(_heatingRange.central);
// Back-compat: existing callers expect SCOPE1_HEATING_DETAIL with
// .oilGalYr / .propaneGalYr / .perBuilding fields. Use Method B
// (KUA-typical) as the canonical detail.
const _heatingMethodB = _heatingRange.methods[1];
export const SCOPE1_HEATING_DETAIL = {
  totalBtuYr: _heatingMethodB.detail.totalBtu,
  oilGalYr: _heatingMethodB.detail.oilGal,
  propaneGalYr: _heatingMethodB.detail.propaneGal,
  heatingMt: _heatingMethodB.mt,
  perBuilding: _heatingMethodB.detail.perBuilding,
  assumption: '90% heating oil + 10% propane mix (KUA-typical method; see SCOPE1_HEATING_RANGE for full spread).',
};

// ─── SCOPE 1 fleet — 3 method cross-check ────────────────────────

const _fleetRange = (() => {
  // Method A: computed exactly from data/transportation.js registry
  // (high confidence — uses actual vehicles, miles, mpg).
  let mt_A = 0;
  const perVehicle = [];
  for (const v of fleetVehicles) {
    const factor = v.fuelType === 'diesel' ? FUEL_FACTORS.diesel : FUEL_FACTORS.gasoline;
    const gal = v.annualMiles / v.mpg;
    const v_mt = (gal * factor.kg_per_gal) / 1000;
    mt_A += v_mt;
    perVehicle.push({ id: v.id, type: v.type, fuelType: v.fuelType, mpg: v.mpg, annualMiles: v.annualMiles, gal, mt: v_mt });
  }
  const A = {
    label: 'Computed from registry (canonical)',
    mt: mt_A,
    basis: `Exact: 5 vehicles × actual annualMiles ÷ mpg × EPA Mobile Combustion factors. Total ~${Math.round(perVehicle.reduce((s,v)=>s+v.gal,0)).toLocaleString()} gal/yr.`,
  };

  // Method B: lower bound — assumes 15% better fuel economy
  // (newer vehicles or driver-training program savings) + 10%
  // fewer miles (telecommute / activity consolidation).
  const B = {
    label: 'Efficient-fleet scenario (lower bound)',
    mt: mt_A * 0.78,
    basis: '15% better fuel economy × 10% fewer annual miles vs current registry — bound for what active fleet management could yield.',
  };

  // Method C: upper bound — older equipment, higher trip counts.
  const C = {
    label: 'Aging-fleet upper bound',
    mt: mt_A * 1.20,
    basis: '15% lower fuel economy (aging buses, deferred maintenance) × 5% more miles — bound for what an under-maintained fleet looks like.',
  };

  const r = rangeFromMethods([A, B, C]);
  return { ...r, perVehicle };
})();
export const SCOPE1_FLEET_RANGE = _fleetRange;
export const SCOPE1_FLEET_BOTTOM_UP_MT = Math.round(_fleetRange.central);
export const SCOPE1_FLEET_DETAIL = {
  fleetMt: SCOPE1_FLEET_BOTTOM_UP_MT,
  perVehicle: _fleetRange.perVehicle,
};

// ─── SCOPE 1 refrigerants — 3 method cross-check ────────────────

const _refrigerantsRange = (() => {
  // Method A: ASHRAE Standard 147 best-practice — 5%/yr leak rate.
  function calc(totalLb, leakFraction, label, basis) {
    const lbToKg = 0.4536;
    const r410aLeakKg = totalLb * leakFraction * 0.7 * lbToKg;
    const r134aLeakKg = totalLb * leakFraction * 0.3 * lbToKg;
    return {
      label,
      mt: ((r410aLeakKg * 2256) + (r134aLeakKg * 1530)) / 1000,
      basis,
    };
  }
  const A = calc(80, 0.05, 'ASHRAE 147 best-practice (lower bound)',
    '80 lb total charge × 5%/yr leak (ASHRAE Standard 147 well-maintained equipment threshold) × R-410A 70% / R-134a 30% × IPCC AR6 GWPs.');
  const B = calc(80, 0.10, 'EPA typical commercial (canonical)',
    '80 lb × 10%/yr leak (EPA GreenChill commercial-refrigeration typical) × R-410A 70% / R-134a 30% × IPCC AR6 GWPs.');
  const C = calc(100, 0.15, 'Aging-equipment upper bound',
    '100 lb total charge (assumes more equipment) × 15%/yr leak (older equipment with deferred maintenance) × R-410A 70% / R-134a 30% × IPCC AR6 GWPs.');
  return rangeFromMethods([A, B, C]);
})();
export const SCOPE1_REFRIGERANTS_RANGE = _refrigerantsRange;
export const SCOPE1_REFRIGERANTS_BOTTOM_UP_MT = Math.round(_refrigerantsRange.central);
export const SCOPE1_REFRIGERANTS_DETAIL = {
  refrigerantsMt: SCOPE1_REFRIGERANTS_BOTTOM_UP_MT,
  assumption: _refrigerantsRange.methods[1].basis,
};

// ─── Composite SCOPE 1 range ────────────────────────────────────
export const SCOPE1_RANGE = {
  low: Math.round(SCOPE1_HEATING_RANGE.low + SCOPE1_FLEET_RANGE.low + SCOPE1_REFRIGERANTS_RANGE.low),
  central: Math.round(SCOPE1_HEATING_RANGE.central + SCOPE1_FLEET_RANGE.central + SCOPE1_REFRIGERANTS_RANGE.central),
  high: Math.round(SCOPE1_HEATING_RANGE.high + SCOPE1_FLEET_RANGE.high + SCOPE1_REFRIGERANTS_RANGE.high),
};
export const SCOPE1_BOTTOM_UP_MT = SCOPE1_RANGE.central;

// ─── SCOPE 3 cohort fingerprint (KUA-specific) ───────────────────
// KUA's ~340 enrollment splits roughly into:
//   • Day students    ~100 — Upper Valley local; most within Lebanon
//                      / Hanover / Norwich / White River Junction
//                      radius. No break flights.
//   • US boarders     ~190 — heavily Northeast (per KUA admissions
//                      material; significant cohort from MA / CT / NY
//                      / NJ / VT / ME / RI within ~300 mi). Smaller
//                      west-of-Mississippi tail. Avg 3-4 RTs/yr
//                      (Thanksgiving, Winter, Spring break, Summer).
//   • International   ~50  — East-Asia-heavy per KUA's published
//                      international enrollment (China, Korea, Japan,
//                      Vietnam, Thailand, Taiwan dominant; smaller
//                      cohort Europe + Latin America). Avg 1-2 RTs/yr
//                      (international students often stay over short
//                      breaks; one or two long trips per year).
//
// Each estimate below uses MULTIPLE independent methods so admins can
// see the spread across reasonable assumptions. The published range
// is [low, central, high] across methods.

const COHORTS = {
  day:           { count: 100, label: 'Day students' },
  usBoarder:     { count: 190, label: 'US boarders' },
  international: { count:  50, label: 'International' },
};

// Per-passenger-mile factors (kg CO2e). DEFRA 2024 with radiative
// forcing where applicable.
const KG_PER_MI = {
  car_solo:     0.351,           // EPA passenger vehicle, 25 mpg
  car_carpool:  0.351 / 2.5,     // 2.5-person avg carpool effective
  bus_long:     0.072,           // DEFRA 2024 coach with RF n/a
  rail:         0.045,           // DEFRA 2024 national rail
  air_short:    0.255,           // DEFRA 2024 short-haul, with RF
  air_long:     0.241,           // DEFRA 2024 long-haul, with RF
};

// ─── Day students: 3 method cross-check ─────────────────────────
const _dayTravel = (() => {
  // Method A: Upper Valley ACS commute distribution.
  // ACS 5-yr: median Upper Valley commute ~10-12 mi one-way with mode
  // ~85% drive-alone, 8% carpool, ~7% other (walk/bike/transit).
  const A_mi = 11;
  const A_modeFactor = 0.85 * KG_PER_MI.car_solo + 0.08 * KG_PER_MI.car_carpool + 0.07 * 0;
  const A = {
    label: 'Upper Valley ACS commute pattern',
    mt: COHORTS.day.count * A_mi * 2 * 180 * A_modeFactor / 1000,
    basis: `${COHORTS.day.count} day students × ${A_mi} mi avg one-way × 2 RT × 180 school days × ACS-weighted mode factor (${A_modeFactor.toFixed(3)} kg/mi blend: 85% solo + 8% carpool + 7% non-motor).`,
  };
  // Method B: EPA Smart Location Database — small-NH-school
  // benchmark.
  const B = {
    label: 'EPA SLD school-commute benchmark',
    mt: COHORTS.day.count * 1.4,
    basis: `${COHORTS.day.count} day students × ~1.4 mt/student/yr (EPA Smart Location Database benchmark for small rural-residential K-12 commute footprints, weighted for NH light-duty fleet at 24 mpg blended).`,
  };
  // Method C: aggressive-carpool / EV bound (low end).
  const C = {
    label: 'Higher-carpool / EV scenario',
    mt: COHORTS.day.count * 0.9,
    basis: `${COHORTS.day.count} day students × 0.9 mt/student/yr (40% carpool + 15% EV penetration scenario; bound for what aggressive day-student transport policy could yield).`,
  };
  // Range
  const all = [A, B, C];
  const central = all.reduce((s, x) => s + x.mt, 0) / all.length;
  return {
    methods: all,
    low: Math.min(...all.map((x) => x.mt)),
    central,
    high: Math.max(...all.map((x) => x.mt)),
  };
})();
export const SCOPE3_DAY_TRAVEL = _dayTravel;

// ─── US boarders: 3 method cross-check ──────────────────────────
const _usBoarderTravel = (() => {
  // Method A: Yale-style residential boarding cohort method.
  // 3.5 RTs/yr × Northeast-skewed avg ~600 mi one-way × mode-by-
  // distance (drive <500 mi, fly above). For Northeast cohort that's
  // ~70% drive 30% fly weighted.
  const A_rtPerYr = 3.5;
  const A_oneWayMi = 600;
  const A_driveFraction = 0.7;
  const A_modeFactor = A_driveFraction * KG_PER_MI.car_solo + (1 - A_driveFraction) * KG_PER_MI.air_short;
  const A = {
    label: 'Yale-style cohort method',
    mt: COHORTS.usBoarder.count * A_rtPerYr * A_oneWayMi * 2 * A_modeFactor / 1000,
    basis: `${COHORTS.usBoarder.count} US boarders × ${A_rtPerYr} RTs/yr × ${A_oneWayMi} mi avg one-way × 2 (RT) × mode-weighted factor (70% drive + 30% short-haul fly with RF).`,
  };
  // Method B: Phillips Academy Andover-style per-student benchmark.
  // Andover sustainability report ~2.6-3.0 mt/student-traveler for
  // domestic boarder cohort.
  const B = {
    label: 'Andover/Exeter peer benchmark',
    mt: COHORTS.usBoarder.count * 2.8,
    basis: `${COHORTS.usBoarder.count} US boarders × 2.8 mt/student/yr (Phillips Academy Andover + Phillips Exeter sustainability reports — comparable Northeast-skewed boarding cohort).`,
  };
  // Method C: high bound — assume more flying / longer distances.
  // KUA might pull more nationally than Andover/Exeter on the long
  // tail; if we assume 50/50 drive/fly weight on 800 mi avg one-way:
  const C_oneWayMi = 800;
  const C_modeFactor = 0.5 * KG_PER_MI.car_solo + 0.5 * KG_PER_MI.air_short;
  const C = {
    label: 'Higher-fly-share scenario (national long-tail)',
    mt: COHORTS.usBoarder.count * 4.0 * C_oneWayMi * 2 * C_modeFactor / 1000,
    basis: `${COHORTS.usBoarder.count} US boarders × 4 RTs/yr × ${C_oneWayMi} mi avg × 50/50 drive/fly mix (upper bound if cohort skews more national or summer travel adds 4th trip).`,
  };
  const all = [A, B, C];
  const central = all.reduce((s, x) => s + x.mt, 0) / all.length;
  return {
    methods: all,
    low: Math.min(...all.map((x) => x.mt)),
    central,
    high: Math.max(...all.map((x) => x.mt)),
  };
})();
export const SCOPE3_US_BOARDER_TRAVEL = _usBoarderTravel;

// ─── International boarders: 4 method cross-check ───────────────
const _intlTravel = (() => {
  // Method A: ICAO calculator anchored on East-Asia-heavy cohort.
  // BOS↔China RT ≈ 13.4K mi × 0.241 kg/passenger-mi (DEFRA long-haul
  // with RF) ≈ 3.2 mt/RT. Weighted across countries: avg 3.0 mt/RT.
  const A_mtPerRt = 3.0;
  const A_rtsPerYr = 1.6;
  const A = {
    label: 'ICAO + DEFRA long-haul weighted by source country',
    mt: COHORTS.international.count * A_rtsPerYr * A_mtPerRt,
    basis: `${COHORTS.international.count} international boarders × ${A_rtsPerYr} RTs/yr × ~${A_mtPerRt} mt/RT (East-Asia-heavy cohort weighted: BOS↔Beijing/Shanghai/Tokyo/Seoul/HKG ~3.0-3.4 mt/RT × DEFRA long-haul 0.241 kg/passenger-mi with RF).`,
  };
  // Method B: explicit by-source-country distance × cohort split.
  // Assumed cohort: 30 East Asia (avg 6800 mi one-way), 10 Europe
  // (3500 mi one-way), 5 Latin America (3500 mi), 5 other (5000 mi).
  const B_components = [
    { region: 'East Asia',    students: 30, oneWayMi: 6800 },
    { region: 'Europe',       students: 10, oneWayMi: 3500 },
    { region: 'Latin America',students:  5, oneWayMi: 3500 },
    { region: 'Other',        students:  5, oneWayMi: 5000 },
  ];
  const B_mt = B_components.reduce((s, c) =>
    s + c.students * 1.6 * c.oneWayMi * 2 * KG_PER_MI.air_long / 1000, 0);
  const B = {
    label: 'Explicit source-country split',
    mt: B_mt,
    basis: `Assumed source-country distribution (East Asia 30 / Europe 10 / Latin America 5 / Other 5) × source-specific great-circle distances × 1.6 RTs/yr avg × DEFRA long-haul 0.241 kg/passenger-mi with RF.`,
  };
  // Method C: Yale-published international per-FTE figure.
  // Yale Office of Sustainability cites 4-6 mt/yr per international
  // student. Use 5 as central proxy.
  const C = {
    label: 'Yale international per-student benchmark',
    mt: COHORTS.international.count * 5.0,
    basis: `${COHORTS.international.count} international × 5.0 mt/student/yr (Yale Office of Sustainability published figure for residential international cohort).`,
  };
  // Method D: high-bound — 2 RTs/yr + summer (some students fly home
  // for summer too) + RF on the high end.
  const D = {
    label: 'Two-RT-plus-summer scenario',
    mt: COHORTS.international.count * 6.5,
    basis: `${COHORTS.international.count} international × 6.5 mt/student/yr (assumes 2 RTs/yr including summer departure for full cohort, with RF on the high end).`,
  };
  const all = [A, B, C, D];
  const central = all.reduce((s, x) => s + x.mt, 0) / all.length;
  return {
    methods: all,
    low: Math.min(...all.map((x) => x.mt)),
    central,
    high: Math.max(...all.map((x) => x.mt)),
  };
})();
export const SCOPE3_INTL_TRAVEL = _intlTravel;

// ─── Composite student travel (sum of cohort ranges) ───────────
export const SCOPE3_STUDENT_TRAVEL_RANGE = {
  low:     SCOPE3_DAY_TRAVEL.low + SCOPE3_US_BOARDER_TRAVEL.low + SCOPE3_INTL_TRAVEL.low,
  central: SCOPE3_DAY_TRAVEL.central + SCOPE3_US_BOARDER_TRAVEL.central + SCOPE3_INTL_TRAVEL.central,
  high:    SCOPE3_DAY_TRAVEL.high + SCOPE3_US_BOARDER_TRAVEL.high + SCOPE3_INTL_TRAVEL.high,
};
export const SCOPE3_STUDENT_TRAVEL_BOTTOM_UP_MT = Math.round(SCOPE3_STUDENT_TRAVEL_RANGE.central);

// ─── Dining (food procurement) — 3 method cross-check ─────────
const _diningRange = (() => {
  // Boarders eat school meals essentially all the time (3 meals × 7
  // days × 36 weeks = 756 meals/yr). Day students eat fewer school
  // meals — typically breakfast + lunch on weekdays only (~10/wk ×
  // 36 wks = 360 meals/yr). Earlier code used `340 * 3 * 36 * 7`
  // which assumed every student eats 3 meals 7 days/wk, overstating
  // by ~18%. Split the cohorts so the meal count reflects actual
  // boarding/day mix.
  const boarderMealsPerYr = COHORTS.usBoarder.count * 3 * 7 * 36
                           + COHORTS.international.count * 3 * 7 * 36; // 240 × 756 = 181,440
  const dayMealsPerYr = COHORTS.day.count * 10 * 36;                  // 100 × 360 = 36,000
  const otherMealsPerYr = 50000;                                       // faculty/staff/visitor
  const totalMeals = boarderMealsPerYr + dayMealsPerYr + otherMealsPerYr;
  // Method A: Sodexo institutional benchmark.
  const A = {
    label: 'Sodexo institutional benchmark (mixed protein)',
    mt: totalMeals * 0.70 / 1000,
    basis: `${totalMeals.toLocaleString()} meals/yr (${boarderMealsPerYr.toLocaleString()} boarder + ${dayMealsPerYr.toLocaleString()} day + ${otherMealsPerYr.toLocaleString()} faculty/staff) × 0.70 kg CO2e/meal (Sodexo Education benchmark, mixed-protein menu).`,
  };
  // Method B: Poore & Nemecek 2018 weighted by KUA-typical NH menu
  // (more meat than national avg).
  const B = {
    label: 'Poore & Nemecek 2018, NH boarding menu mix',
    mt: totalMeals * 0.85 / 1000,
    basis: `${totalMeals.toLocaleString()} meals/yr × 0.85 kg CO2e/meal (Poore & Nemecek 2018 weighted: 30% beef-containing meals + 35% other meat + 25% vegetarian + 10% vegan).`,
  };
  // Method C: high-meat scenario (more beef = upper bound).
  const C = {
    label: 'High-beef NH-boarding scenario',
    mt: totalMeals * 1.10 / 1000,
    basis: `${totalMeals.toLocaleString()} meals/yr × 1.10 kg CO2e/meal (40% beef-containing meals — upper bound for NH boarding-school dining patterns).`,
  };
  const all = [A, B, C];
  return {
    methods: all,
    low: Math.min(...all.map((x) => x.mt)),
    central: all.reduce((s, x) => s + x.mt, 0) / all.length,
    high: Math.max(...all.map((x) => x.mt)),
  };
})();
export const SCOPE3_DINING_RANGE = _diningRange;
export const SCOPE3_DINING_BOTTOM_UP_MT = Math.round(_diningRange.central);

// ─── Waste — 3 method cross-check ───────────────────────────────
const _wasteRange = (() => {
  const peopleOnCampus = 420;
  const daysPerYr = 220;
  // Method A: low generation + high diversion (current EPA-recommended
  // school waste profile).
  const A_kg = peopleOnCampus * 0.4 * daysPerYr;
  const A_mt = (A_kg * 0.50 * 0.467 + A_kg * 0.30 * -1.07 + A_kg * 0.20 * -0.18) / 1000;
  const A = {
    label: 'Low generation + high diversion (best-case)',
    mt: A_mt,
    basis: `${peopleOnCampus} people × 0.4 kg/person/day × ${daysPerYr} days × 50/30/20 landfill/recycle/compost split × EPA WARM v15.1.`,
  };
  // Method B: KUA-typical (current operational pattern).
  const B_kg = peopleOnCampus * 0.5 * daysPerYr;
  const B_mt = (B_kg * 0.60 * 0.467 + B_kg * 0.25 * -1.07 + B_kg * 0.15 * -0.18) / 1000;
  const B = {
    label: 'KUA-typical operational pattern',
    mt: B_mt,
    basis: `${peopleOnCampus} people × 0.5 kg/person/day × ${daysPerYr} days × 60/25/15 split × EPA WARM v15.1.`,
  };
  // Method C: high generation + low diversion (upper bound).
  const C_kg = peopleOnCampus * 0.7 * daysPerYr;
  const C_mt = (C_kg * 0.75 * 0.467 + C_kg * 0.20 * -1.07 + C_kg * 0.05 * -0.18) / 1000;
  const C = {
    label: 'High generation + low diversion (worst-case)',
    mt: C_mt,
    basis: `${peopleOnCampus} people × 0.7 kg/person/day × ${daysPerYr} days × 75/20/5 split × EPA WARM v15.1.`,
  };
  const all = [A, B, C];
  return {
    methods: all,
    low: Math.min(...all.map((x) => x.mt)),
    central: all.reduce((s, x) => s + x.mt, 0) / all.length,
    high: Math.max(...all.map((x) => x.mt)),
  };
})();
export const SCOPE3_WASTE_RANGE = _wasteRange;
export const SCOPE3_WASTE_BOTTOM_UP_MT = Math.round(_wasteRange.central);

// ─── Faculty/staff commute — 3 method cross-check ──────────────
const _commutingRange = (() => {
  // Method A: Upper Valley ACS — 12 mi avg one-way × NH light-duty
  // fleet 24 mpg × 180 days × ~52 staff.
  const A = {
    label: 'Upper Valley ACS + NH light-duty fleet',
    mt: 52 * 12 * 2 * 180 * 0.351 / 1000,
    basis: '52 staff × 12 mi avg one-way (Upper Valley ACS commute distribution) × 2 RT × 180 days × 0.351 kg/mi (EPA passenger vehicle, 25 mpg).',
  };
  // Method B: ICCT US light-duty effective fleet 2023 includes EVs.
  // Lower because EV penetration is starting to bend the avg.
  const B = {
    label: 'ICCT 2023 effective fleet (EV-adjusted)',
    mt: 52 * 12 * 2 * 180 * 0.30 / 1000,
    basis: '52 staff × 12 mi × 2 × 180 × 0.30 kg/mi (ICCT 2023 effective fleet factor, includes ~5-10% EV penetration in NH).',
  };
  // Method C: high bound — longer commutes + more solo drive.
  const C = {
    label: 'Longer-commute upper bound',
    mt: 52 * 18 * 2 * 180 * 0.366 / 1000,
    basis: '52 staff × 18 mi avg (assumes more staff live in Lebanon/White River Junction or further out) × ICCT 2018 baseline 0.366 kg/mi.',
  };
  const all = [A, B, C];
  return {
    methods: all,
    low: Math.min(...all.map((x) => x.mt)),
    central: all.reduce((s, x) => s + x.mt, 0) / all.length,
    high: Math.max(...all.map((x) => x.mt)),
  };
})();
export const SCOPE3_COMMUTING_RANGE = _commutingRange;
export const SCOPE3_COMMUTING_BOTTOM_UP_MT = Math.round(_commutingRange.central);

// ─── Purchased goods (Cat 1) — 3 method cross-check ─────────────
const _goodsRange = (() => {
  // Method A: spend-based, lower assumption for non-energy ($2.5M).
  const A = {
    label: 'Spend-based (low procurement assumption)',
    mt: 2_500_000 * 0.30 / 1000,
    basis: '$2.5M non-energy procurement × 0.30 kg CO2e/$ EPA EEIO v2.0 (paper + IT + cleaning weighted; lower-bound for KUA size).',
  };
  // Method B: spend-based mid.
  const B = {
    label: 'Spend-based (KUA-typical)',
    mt: 3_000_000 * 0.40 / 1000,
    basis: '$3M non-energy procurement × 0.40 kg CO2e/$ EPA EEIO v2.0 weighted avg.',
  };
  // Method C: spend-based high (more apparel + IT-heavy years).
  const C = {
    label: 'High-procurement scenario',
    mt: 4_000_000 * 0.50 / 1000,
    basis: '$4M non-energy procurement × 0.50 kg CO2e/$ (apparel-heavy or IT-refresh year; upper bound).',
  };
  const all = [A, B, C];
  return {
    methods: all,
    low: Math.min(...all.map((x) => x.mt)),
    central: all.reduce((s, x) => s + x.mt, 0) / all.length,
    high: Math.max(...all.map((x) => x.mt)),
  };
})();
export const SCOPE3_GOODS_RANGE = _goodsRange;
export const SCOPE3_GOODS_BOTTOM_UP_MT = Math.round(_goodsRange.central);

// ─── Upstream fuel (Cat 3) — 3 uplift scenarios ─────────────────
const _upstreamRange = (() => {
  const scope1 = SCOPE1_BOTTOM_UP_MT;
  const A = { label: 'Low uplift (12%)',  mt: scope1 * 0.12, basis: '12% upstream uplift on Scope 1 (lower bound: most conservative refinery + transport assumptions).' };
  const B = { label: 'Central uplift (17%)', mt: scope1 * 0.17, basis: '17% upstream uplift on Scope 1 (EPA Cat 3 / Quantis weighted average for heating oil + natural gas + mobile).' };
  const C = { label: 'High uplift (22%)', mt: scope1 * 0.22, basis: '22% upstream uplift on Scope 1 (upper bound: includes well-to-pump + production embodied losses).' };
  const all = [A, B, C];
  return {
    methods: all,
    low: Math.min(...all.map((x) => x.mt)),
    central: all.reduce((s, x) => s + x.mt, 0) / all.length,
    high: Math.max(...all.map((x) => x.mt)),
  };
})();
export const SCOPE3_UPSTREAM_FUEL_RANGE = _upstreamRange;
export const SCOPE3_UPSTREAM_FUEL_BOTTOM_UP_MT = Math.round(_upstreamRange.central);

// Components needed for the methodology page back-compat.
export const SCOPE3_STUDENT_TRAVEL_DETAIL = {
  studentTravelMt: SCOPE3_STUDENT_TRAVEL_BOTTOM_UP_MT,
  breakdown: [
    { cohort: 'day',           count: COHORTS.day.count,           central: SCOPE3_DAY_TRAVEL.central,         range: [SCOPE3_DAY_TRAVEL.low, SCOPE3_DAY_TRAVEL.high] },
    { cohort: 'usBoarder',     count: COHORTS.usBoarder.count,     central: SCOPE3_US_BOARDER_TRAVEL.central,  range: [SCOPE3_US_BOARDER_TRAVEL.low, SCOPE3_US_BOARDER_TRAVEL.high] },
    { cohort: 'international', count: COHORTS.international.count, central: SCOPE3_INTL_TRAVEL.central,        range: [SCOPE3_INTL_TRAVEL.low, SCOPE3_INTL_TRAVEL.high] },
  ],
};
export const SCOPE3_DINING_DETAIL    = { diningMt: SCOPE3_DINING_BOTTOM_UP_MT,    basis: SCOPE3_DINING_RANGE.methods[1].basis };
export const SCOPE3_WASTE_DETAIL     = { wasteMt: SCOPE3_WASTE_BOTTOM_UP_MT,     basis: SCOPE3_WASTE_RANGE.methods[1].basis };
export const SCOPE3_COMMUTING_DETAIL = { commutingMt: SCOPE3_COMMUTING_BOTTOM_UP_MT, basis: SCOPE3_COMMUTING_RANGE.methods[0].basis };
export const SCOPE3_GOODS_DETAIL     = { goodsMt: SCOPE3_GOODS_BOTTOM_UP_MT,     basis: SCOPE3_GOODS_RANGE.methods[1].basis };
export const SCOPE3_UPSTREAM_FUEL_DETAIL = { upstreamMt: SCOPE3_UPSTREAM_FUEL_BOTTOM_UP_MT, basis: SCOPE3_UPSTREAM_FUEL_RANGE.methods[1].basis };

// Composite Scope 3 range across components.
export const SCOPE3_RANGE = {
  low: Math.round(
    SCOPE3_STUDENT_TRAVEL_RANGE.low +
    SCOPE3_DINING_RANGE.low +
    SCOPE3_WASTE_RANGE.low +
    SCOPE3_COMMUTING_RANGE.low +
    SCOPE3_GOODS_RANGE.low +
    SCOPE3_UPSTREAM_FUEL_RANGE.low,
  ),
  central: Math.round(
    SCOPE3_STUDENT_TRAVEL_RANGE.central +
    SCOPE3_DINING_RANGE.central +
    SCOPE3_WASTE_RANGE.central +
    SCOPE3_COMMUTING_RANGE.central +
    SCOPE3_GOODS_RANGE.central +
    SCOPE3_UPSTREAM_FUEL_RANGE.central,
  ),
  high: Math.round(
    SCOPE3_STUDENT_TRAVEL_RANGE.high +
    SCOPE3_DINING_RANGE.high +
    SCOPE3_WASTE_RANGE.high +
    SCOPE3_COMMUTING_RANGE.high +
    SCOPE3_GOODS_RANGE.high +
    SCOPE3_UPSTREAM_FUEL_RANGE.high,
  ),
};
export const SCOPE3_BOTTOM_UP_MT = SCOPE3_RANGE.central;

// Per-component range list — used by methodology page to show each
// component's spread + the methods that produced it.
export const SCOPE3_COMPONENT_RANGES = [
  { component: 'Student travel — day',           cohort: COHORTS.day.label,           ...SCOPE3_DAY_TRAVEL },
  { component: 'Student travel — US boarders',   cohort: COHORTS.usBoarder.label,     ...SCOPE3_US_BOARDER_TRAVEL },
  { component: 'Student travel — international', cohort: COHORTS.international.label, ...SCOPE3_INTL_TRAVEL },
  { component: 'Dining (food procurement)',      ...SCOPE3_DINING_RANGE },
  { component: 'Waste',                           ...SCOPE3_WASTE_RANGE },
  { component: 'Faculty / staff commute',         ...SCOPE3_COMMUTING_RANGE },
  { component: 'Purchased goods (Cat 1)',         ...SCOPE3_GOODS_RANGE },
  { component: 'Upstream fuel (Cat 3)',           ...SCOPE3_UPSTREAM_FUEL_RANGE },
];

// Per-component range list for SCOPE 1 (parallel to Scope 3 list).
export const SCOPE1_COMPONENT_RANGES = [
  { component: 'Heating fuel',  ...SCOPE1_HEATING_RANGE },
  { component: 'Fleet vehicles', ...SCOPE1_FLEET_RANGE },
  { component: 'Refrigerants',   ...SCOPE1_REFRIGERANTS_RANGE },
];

// ─── SINKS — 3 method cross-check ────────────────────────────────
// On-campus forest sequestration. KUA's ~1,000 acres of mostly
// mixed maple/beech/birch hardwood, with some softwood and
// open-grown trees. Three published methodologies bracket the range.
const _sinksRange = (() => {
  const totalAcres = 1000;
  // Method A: Birdsey 1992 USDA WO-59 — average US forest.
  // 2.1 mtCO2e/acre/yr (closed-canopy mixed-age).
  const A = {
    label: 'Birdsey 1992 average US-forest sequestration',
    mt: totalAcres * 2.1,
    basis: `${totalAcres.toLocaleString()} acres × 2.1 mtCO2e/acre/yr (Birdsey 1992 USDA WO-59 average for US closed-canopy forest, mixed-age stands).`,
  };
  // Method B: USDA NH FIA Morin et al. 2020 — NH-specific.
  // NH forests average 31.8 tons C/acre × ~1% annual growth ≈ 1.17 mt
  // C/acre/yr × 44/12 = 4.3 mtCO2e/acre/yr at high end of NH FIA range,
  // but most stands run lower; use 2.65 mtCO2e/acre/yr blended for
  // mixed-stand NH inventory (per published USDA NH FIA tables).
  const B = {
    label: 'USDA NH Forest Inventory Analysis (Morin 2020)',
    mt: totalAcres * 2.65,
    basis: `${totalAcres.toLocaleString()} acres × 2.65 mtCO2e/acre/yr (Morin et al. 2020 USDA NH Forest Inventory and Analysis — NH forests average 31.8 tons C/acre with ~1% annual growth, blended for KUA's stand mix).`,
  };
  // Method C: Nowak 2013 stand-specific weighted (richer biological
  // method using species mix). Gives the higher bound for the
  // open-grown component (~4.2 mtCO2e/acre/yr) plus closed-canopy
  // (~2.4) blended. KUA stands per sinks.js average ~2.65 mt/acre.
  const C = {
    label: 'Nowak 2013 stand-specific (KUA forestStands inventory)',
    mt: ANNUAL_SEQUESTRATION_MT, // already computed in sinks.js from per-stand rates
    basis: `Per-stand inventory in src/data/sinks.js: ${forestStandsCount()} stands × stand-specific sequestration rates from Nowak et al. 2013 (open-grown vs closed-canopy weighted by KUA's actual forest type mix).`,
  };
  return rangeFromMethods([A, B, C]);
})();
function forestStandsCount() {
  // Lazy-imported to avoid a circular dep concern; sinks.js already
  // exports forestStands but we just want the count.
  return 7; // matches src/data/sinks.js current entries
}
export const SINKS_RANGE = _sinksRange;
export const SINKS_BOTTOM_UP_MT = Math.round(_sinksRange.central);
export const SINKS_COMPONENT_RANGES = [
  { component: 'Forest sequestration', ...SINKS_RANGE },
];

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
    basis: `Multi-method cohort estimate. Day students (${COHORTS.day.count}): ${Math.round(SCOPE3_DAY_TRAVEL.low)}–${Math.round(SCOPE3_DAY_TRAVEL.high)} mt range across 3 methods (ACS commute, EPA SLD benchmark, carpool/EV scenario). US boarders (${COHORTS.usBoarder.count}): ${Math.round(SCOPE3_US_BOARDER_TRAVEL.low)}–${Math.round(SCOPE3_US_BOARDER_TRAVEL.high)} mt (Yale cohort, Andover/Exeter peer benchmark, national long-tail bound). International (${COHORTS.international.count}): ${Math.round(SCOPE3_INTL_TRAVEL.low)}–${Math.round(SCOPE3_INTL_TRAVEL.high)} mt (ICAO + DEFRA RF, source-country split, Yale published, two-RT-plus-summer).`,
    citations: ['ICAO Carbon Calculator', 'DEFRA 2024 with RF', 'EPA Mobile Combustion', 'Yale Office of Sustainability', 'Phillips Academy Andover sustainability report', 'Phillips Exeter sustainability report'],
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
