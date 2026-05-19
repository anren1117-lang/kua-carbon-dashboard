// Per-CED-unit dashboard content for the highest-fit AP courses.
//
// Complements lessonLibrary.js — lessons are atomic teaching artifacts,
// unit maps are course-structured indexes (Course → Unit → relevant
// dashboard pages + suggested 5-min hooks + links to full lessons).
//
// Honest framing: not every CED unit has a defensible dashboard tie-
// in. A unit with fit='none' should be skipped on the dashboard, not
// shoe-horned into a forced fit. Saying "skip this on the dashboard"
// is more useful to a teacher than inventing an activity that doesn't
// belong.
//
// To add a course: copy one of the existing entries below, replace
// the units list, and add the courseId to AP_COURSES_COVERED. Unit
// numbers + names must come from the official College Board CED.

export const FITS = ['direct', 'tangential', 'none'];

// Shape:
//   {
//     courseId: 'AP Environmental Science',     // must be in lessonLibrary VERIFIED_COURSES
//     cedYear: 2026,                            // year of the CED we mapped against
//     units: [
//       {
//         num: 1,
//         name: 'The Living World: Ecosystems',
//         fit: 'direct' | 'tangential' | 'none',
//         hook: '5-min classroom hook using a dashboard page' | null,
//         dashboardPages: ['/sinks-os'] | [],
//         linkedLessonIds: ['l_birdsey_forest'] | [],
//         note: 'optional teacher-facing caveat' | undefined,
//       },
//     ],
//   }

export const apUnitMap = [
  {
    courseId: 'AP Environmental Science',
    cedYear: 2026,
    overallFit: 'highest — every CED unit has a defensible dashboard tie-in',
    units: [
      {
        num: 1,
        name: 'The Living World: Ecosystems',
        fit: 'direct',
        hook: 'Open /sinks-os. Identify KUA\'s forest as a working temperate-deciduous ecosystem. Have students name 3 abiotic + 3 biotic factors that determine its sequestration rate.',
        dashboardPages: ['/sinks-os', '/methodology'],
        linkedLessonIds: ['l_birdsey_forest'],
      },
      {
        num: 2,
        name: 'The Living World: Biodiversity',
        fit: 'tangential',
        hook: 'Discuss what the dashboard does NOT measure: KUA\'s 1,300 acres host biodiversity value (Meriden Bird Sanctuary adjacency) that doesn\'t appear in a carbon-only accounting. Open question: should it?',
        dashboardPages: ['/sinks-os', '/methodology'],
        linkedLessonIds: [],
        note: 'Honest gap — KUA\'s carbon dashboard has no biodiversity layer today. Frame as a critique of carbon-only metrics.',
      },
      {
        num: 3,
        name: 'Populations',
        fit: 'direct',
        hook: 'Open /executive. KUA has 339 students. Compute per-capita carbon. Discuss why per-capita is the only fair comparison metric for institutions of different sizes.',
        dashboardPages: ['/executive', '/peer-comparison'],
        linkedLessonIds: ['l_peer_compare'],
      },
      {
        num: 4,
        name: 'Earth Systems and Resources',
        fit: 'direct',
        hook: 'Open /scope-1 (oil + propane) and /sinks-os (forest). Trace the carbon cycle from geological reservoir → atmospheric flux → biological reservoir. KUA spans all three.',
        dashboardPages: ['/scope-1', '/sinks-os'],
        linkedLessonIds: [],
      },
      {
        num: 5,
        name: 'Land and Water Use',
        fit: 'direct',
        hook: 'Open /scope-3 (food). Sustainable Food and Agriculture connection: KUA Farm Team manages livestock + hydroponics. Compute the land + water footprint of dining-hall beef vs. plant protein.',
        dashboardPages: ['/scope-3', '/scenarios'],
        linkedLessonIds: ['l_food_dining'],
      },
      {
        num: 6,
        name: 'Energy Resources and Consumption',
        fit: 'direct',
        hook: 'Open /scope-2. ISO-NE grid mix as a worked example of regional generation portfolios. Compare to US average and to a coal-heavy state.',
        dashboardPages: ['/scope-2', '/methodology'],
        linkedLessonIds: ['l_grid_mix'],
      },
      {
        num: 7,
        name: 'Atmospheric Pollution',
        fit: 'direct',
        hook: 'Open /methodology refrigerant section. HFCs (R-410A GWP 2,088) are atmospheric pollutants by definition. Discuss the Kigali Amendment + Montreal Protocol context.',
        dashboardPages: ['/methodology', '/scope-1'],
        linkedLessonIds: ['l_gwp_refrigerants'],
      },
      {
        num: 8,
        name: 'Aquatic and Terrestrial Pollution',
        fit: 'tangential',
        hook: 'Compare what the dashboard measures (CO₂, CH₄, refrigerants) against what it doesn\'t (NOx from boilers, particulate matter, wastewater). Frame as the boundary problem of carbon-only metrics.',
        dashboardPages: ['/methodology'],
        linkedLessonIds: [],
        note: 'Dashboard doesn\'t cover non-carbon pollutants. Use as a "what\'s missing" discussion.',
      },
      {
        num: 9,
        name: 'Global Change',
        fit: 'direct',
        hook: 'Open /scenarios. Use the simulator to show how local action (one school, 1,720 mtCO₂e) scales to global context. 1 KUA = 0.00003% of global emissions — discuss whether that fact discourages or motivates action.',
        dashboardPages: ['/scenarios', '/executive', '/news'],
        linkedLessonIds: ['l_netzero_debate', 'l_macc_curve'],
      },
    ],
  },

  {
    courseId: 'AP Chemistry',
    cedYear: 2026,
    overallFit: 'partial — strongest fit on units 4 (reactions), 6 (thermo), 7 (equilibrium). Atomic structure + bonding units have no defensible dashboard hook.',
    units: [
      {
        num: 1,
        name: 'Atomic Structure and Properties',
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
        note: 'No direct dashboard tie. Teach this unit from the textbook; come back to the dashboard in Unit 4.',
      },
      {
        num: 2,
        name: 'Molecular and Ionic Compound Structure and Properties',
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
        note: 'No direct dashboard tie.',
      },
      {
        num: 3,
        name: 'Intermolecular Forces and Properties',
        fit: 'tangential',
        hook: 'Brief connection: H-bonding in water → high specific heat → why oceans absorb 90% of excess heat from climate change. Cite /methodology atmospheric chemistry section briefly.',
        dashboardPages: ['/methodology'],
        linkedLessonIds: [],
      },
      {
        num: 4,
        name: 'Chemical Reactions',
        fit: 'direct',
        hook: 'Open /scope-1. Combustion is the canonical chemical reaction. Balance the equation for #2 fuel oil → CO₂ + H₂O. Use to set up Unit 6 thermodynamics.',
        dashboardPages: ['/scope-1', '/methodology'],
        linkedLessonIds: ['l_combustion_stoich'],
      },
      {
        num: 5,
        name: 'Kinetics',
        fit: 'tangential',
        hook: 'Rate of CO₂ removal by KUA\'s forest. First-order approximation: dC/dt = −k·C where C is atmospheric excess. Useful for setting up the calculus connection.',
        dashboardPages: ['/sinks-os', '/methodology'],
        linkedLessonIds: [],
      },
      {
        num: 6,
        name: 'Thermodynamics',
        fit: 'direct',
        hook: 'Open /scope-1 + /methodology. Apply Hess\'s law to derive ΔH°_c for #2 fuel oil. Compare to the EPA factor on the dashboard. Discuss the difference between thermodynamic potential and useful work.',
        dashboardPages: ['/scope-1', '/methodology'],
        linkedLessonIds: ['l_apchem_hess', 'l_combustion_stoich'],
      },
      {
        num: 7,
        name: 'Equilibrium',
        fit: 'tangential',
        hook: 'Ocean–atmosphere CO₂ equilibrium: CO₂(g) ⇌ CO₂(aq) ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺. Use to set up Unit 8 acids and bases. Briefly cite the atmospheric chemistry section of /methodology.',
        dashboardPages: ['/methodology'],
        linkedLessonIds: [],
      },
      {
        num: 8,
        name: 'Acids and Bases',
        fit: 'direct',
        hook: 'Ocean acidification — same equilibrium as Unit 7, now quantitative. Compute ΔpH from a 100-ppm rise in atmospheric CO₂. Connect back to KUA\'s 1,720 mtCO₂e contribution.',
        dashboardPages: ['/methodology', '/'],
        linkedLessonIds: [],
      },
      {
        num: 9,
        name: 'Applications of Thermodynamics',
        fit: 'direct',
        hook: 'Open /scenarios. Heat-pump COP is an applied-thermo problem. Carnot efficiency for the four heat-pump scenarios in /scenarios. Why does electrification "amplify" each unit of electricity into 2-4 units of delivered heat?',
        dashboardPages: ['/scenarios', '/methodology'],
        linkedLessonIds: ['l_apphys_heatpump_thermo'],
      },
    ],
  },

  {
    courseId: 'AP Biology',
    cedYear: 2026,
    overallFit: 'partial — strongest fit on Unit 3 (cellular energetics) and Unit 8 (ecology). Genetics + heredity units have no dashboard hook.',
    units: [
      {
        num: 1,
        name: 'Chemistry of Life',
        fit: 'tangential',
        hook: 'Briefly: the carbon cycle starts and ends with C-H bonds. Cite /sinks-os as the "carbon you can see" on KUA campus.',
        dashboardPages: ['/sinks-os'],
        linkedLessonIds: [],
      },
      {
        num: 2,
        name: 'Cell Structure and Function',
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
        note: 'No direct dashboard tie. Standard textbook unit.',
      },
      {
        num: 3,
        name: 'Cellular Energetics',
        fit: 'direct',
        hook: 'Open /sinks-os. Photosynthesis is the quantitative entry point. Scale from leaf gas-exchange (µmol/m²/s) to KUA\'s 1,000-acre forest\'s annual mtCO₂e on the dashboard. Reconcile your bottom-up math with the published Birdsey number.',
        dashboardPages: ['/sinks-os', '/methodology'],
        linkedLessonIds: ['l_apbio_photosynthesis_quant', 'l_birdsey_forest'],
      },
      {
        num: 4,
        name: 'Cell Communication and Cell Cycle',
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
      },
      {
        num: 5,
        name: 'Heredity',
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
      },
      {
        num: 6,
        name: 'Gene Expression and Regulation',
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
      },
      {
        num: 7,
        name: 'Natural Selection',
        fit: 'tangential',
        hook: 'Climate-driven natural selection in the Upper Valley: trees adapting to warming, species range shifts northward. Brief cite of /sinks-os as KUA\'s observable forest.',
        dashboardPages: ['/sinks-os'],
        linkedLessonIds: [],
      },
      {
        num: 8,
        name: 'Ecology',
        fit: 'direct',
        hook: 'Open /sinks-os + /executive. KUA\'s forest as a working temperate ecosystem with measurable energy flow, nutrient cycling, and disturbance regime. The /scenarios "additional trees" lever lets students explore succession + climax community dynamics quantitatively.',
        dashboardPages: ['/sinks-os', '/scenarios', '/executive'],
        linkedLessonIds: ['l_birdsey_forest', 'l_peer_compare'],
      },
    ],
  },

  {
    courseId: 'AP Statistics',
    cedYear: 2026,
    overallFit: 'high — the dashboard is a real-world dataset. 6 of 9 units have direct hooks.',
    units: [
      {
        num: 1,
        name: 'Exploring One-Variable Data',
        fit: 'direct',
        hook: 'Open /dorm-leaderboard. 11 dorms, 1 metric (kWh per resident per year). Compute mean, median, IQR, standard deviation. Are there outliers? Identify them.',
        dashboardPages: ['/dorm-leaderboard', '/scope-2'],
        linkedLessonIds: [],
      },
      {
        num: 2,
        name: 'Exploring Two-Variable Data',
        fit: 'direct',
        hook: 'Pull dorm size (number of residents) and total kWh from /dorm-leaderboard. Plot. Compute correlation. Discuss why per-resident (the dashboard\'s default) is the right normalization.',
        dashboardPages: ['/dorm-leaderboard'],
        linkedLessonIds: ['l_linreg_seasonality'],
      },
      {
        num: 3,
        name: 'Collecting Data',
        fit: 'direct',
        hook: 'Open /methodology + /admin/data-quality. Discuss measurement vs. estimation. Scope 2 is measured (BMS data). Scope 1 and Scope 3 are estimated from emission factors. Frame this as sampling vs census.',
        dashboardPages: ['/methodology'],
        linkedLessonIds: [],
        note: '/admin/data-quality requires a teacher login token; alternative is the provenance pills throughout the public site.',
      },
      {
        num: 4,
        name: 'Probability, Random Variables, and Probability Distributions',
        fit: 'tangential',
        hook: 'Wind speed at KUA follows a Weibull distribution. Use the AP Physics C wind-turbine lesson as a worked example of integrating a power function across a probability distribution.',
        dashboardPages: ['/methodology'],
        linkedLessonIds: ['l_apphys_windturbine'],
      },
      {
        num: 5,
        name: 'Sampling Distributions',
        fit: 'direct',
        hook: 'Open /peer-comparison. KUA reports 1 value. Peer schools as a sample → what is the sampling distribution of the mean per-student footprint across all NEPSAC schools? Build the CI for that sample.',
        dashboardPages: ['/peer-comparison', '/executive'],
        linkedLessonIds: [],
      },
      {
        num: 6,
        name: 'Inference for Categorical Data: Proportions',
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
        note: 'Dashboard data is mostly continuous. Skip on the dashboard for this unit.',
      },
      {
        num: 7,
        name: 'Inference for Quantitative Data: Means',
        fit: 'direct',
        hook: 'Two-sample t-test: is KUA\'s per-student footprint significantly different from the peer mean on /peer-comparison?',
        dashboardPages: ['/peer-comparison', '/executive'],
        linkedLessonIds: ['l_apstat_hyp_test'],
      },
      {
        num: 8,
        name: 'Inference for Categorical Data: Chi-Square',
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
      },
      {
        num: 9,
        name: 'Inference for Quantitative Data: Slopes',
        fit: 'direct',
        hook: 'Fit a linear regression to monthly /scope-2 consumption. Test whether the slope (annual trend) is significantly different from zero. Interpret what that test answers and what it doesn\'t.',
        dashboardPages: ['/scope-2'],
        linkedLessonIds: ['l_linreg_seasonality'],
      },
    ],
  },

  {
    courseId: 'AP Physics C',
    cedYear: 2026,
    overallFit: 'partial (Mechanics) — 4 of 7 units have direct hooks. E&M units would need a different mapping (not built here yet).',
    units: [
      {
        num: 1,
        name: 'Kinematics',
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
        note: 'No direct dashboard tie. Standard mechanics unit.',
      },
      {
        num: 2,
        name: "Newton's Laws of Motion",
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
      },
      {
        num: 3,
        name: 'Work, Energy, and Power',
        fit: 'direct',
        hook: 'Open /scope-2. Power (kW) × time (h) = energy (kWh). The dashboard\'s instantaneous-load counter is a live P(t) measurement. Integrate to recover the day\'s kWh. Compare to the dashboard\'s daily total.',
        dashboardPages: ['/scope-2', '/methodology'],
        linkedLessonIds: ['l_apphys_heatpump_thermo'],
      },
      {
        num: 4,
        name: 'Systems of Particles and Linear Momentum',
        fit: 'none',
        hook: null,
        dashboardPages: [],
        linkedLessonIds: [],
      },
      {
        num: 5,
        name: 'Rotation',
        fit: 'tangential',
        hook: 'Wind turbine blades. Rotational kinematics + power transfer to the electrical generator. Use as a setup for the wind-turbine power lesson.',
        dashboardPages: ['/scope-2'],
        linkedLessonIds: ['l_apphys_windturbine'],
      },
      {
        num: 6,
        name: 'Oscillations',
        fit: 'tangential',
        hook: 'Monthly consumption on /scope-2 is approximately sinusoidal — a forced, damped oscillation driven by the annual temperature cycle. Set up the calculus connection for Unit 6 of Calc AB.',
        dashboardPages: ['/scope-2'],
        linkedLessonIds: ['l_sinusoid_monthly'],
      },
      {
        num: 7,
        name: 'Gravitation',
        fit: 'direct',
        hook: 'Solar capacity factor and the Earth-Sun geometry. Why is NH solar at ~14% CF vs Arizona at ~22%? Tilt angle, atmospheric path length, day length — all gravitational geometry.',
        dashboardPages: ['/scope-2', '/methodology'],
        linkedLessonIds: ['l_solar_cf'],
      },
    ],
  },
];

export const AP_COURSES_COVERED = apUnitMap.map((c) => c.courseId);

// Helper: count units by fit category across a course.
export function countByFit(courseEntry) {
  const counts = { direct: 0, tangential: 0, none: 0 };
  for (const u of courseEntry.units) counts[u.fit] = (counts[u.fit] || 0) + 1;
  return counts;
}

// Helper: total units with a defensible dashboard hook across the
// entire map (direct + tangential, excluding none).
export function totalCoveredUnits() {
  let total = 0;
  for (const c of apUnitMap) {
    for (const u of c.units) {
      if (u.fit !== 'none') total++;
    }
  }
  return total;
}
