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

  // ──────────────────────────────────────────────────────────────
  // Phase 370 — extended unit-by-unit coverage for every AP that
  // has a clean CED unit structure. AP Latin (text-based CED) and
  // AP Studio Art (portfolio-based) are intentionally NOT mapped
  // here; their full lessons in lessonLibrary are the right unit.
  // ──────────────────────────────────────────────────────────────

  {
    courseId: 'AP Calculus AB',
    cedYear: 2026,
    overallFit: 'medium — strongest on Units 4, 6, 7, 8 (applications). Foundational units have only weak dashboard ties.',
    units: [
      { num: 1, name: 'Limits and Continuity', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [], note: 'Foundational unit. Teach from the textbook; dashboard hooks appear in Unit 4.' },
      { num: 2, name: 'Differentiation: Definition and Fundamental Properties', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 3, name: 'Differentiation: Composite, Implicit, and Inverse Functions', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 4, name: 'Contextual Applications of Differentiation', fit: 'direct', hook: 'Open /scope-2. The instantaneous-load counter (kW) is the derivative of cumulative energy (kWh). Find when dE/dt is largest in a typical day.', dashboardPages: ['/scope-2'], linkedLessonIds: ['l_sinusoid_monthly'] },
      { num: 5, name: 'Analytical Applications of Differentiation', fit: 'tangential', hook: 'Maximize the simulator output on /scenarios using the sliders as a constrained-optimization problem. Frame as a Lagrange multiplier setup.', dashboardPages: ['/scenarios'], linkedLessonIds: [] },
      { num: 6, name: 'Integration and Accumulation of Change', fit: 'direct', hook: 'Open /scope-2. Integrate the kW load curve over 24 hours to recover daily kWh. Compare to the published daily total.', dashboardPages: ['/scope-2', '/methodology'], linkedLessonIds: ['l_sinusoid_monthly'] },
      { num: 7, name: 'Differential Equations', fit: 'direct', hook: 'Forest carbon stock grows logistically: dC/dt = rC(1 − C/K). Set up the ODE for KUA\'s 1,000-acre forest using values from /sinks-os.', dashboardPages: ['/sinks-os'], linkedLessonIds: ['l_apcalc_bc_forest_diffeq'] },
      { num: 8, name: 'Applications of Integration', fit: 'direct', hook: 'Annual KUA emissions = ∫(sources − sinks) dt over a year. Use /scope-1, /scope-2, /scope-3, /sinks-os to bound the integral.', dashboardPages: ['/', '/sinks-os'], linkedLessonIds: [] },
    ],
  },

  {
    courseId: 'AP Calculus BC',
    cedYear: 2026,
    overallFit: 'high — adds Unit 9 (parametric/polar) and Unit 10 (series), both of which have direct dashboard hooks on top of every AB unit.',
    units: [
      { num: 1, name: 'Limits and Continuity', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 2, name: 'Differentiation: Definition and Fundamental Properties', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 3, name: 'Differentiation: Composite, Implicit, and Inverse Functions', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 4, name: 'Contextual Applications of Differentiation', fit: 'direct', hook: 'Same as Calc AB Unit 4: power = dEnergy/dt on /scope-2.', dashboardPages: ['/scope-2'], linkedLessonIds: ['l_sinusoid_monthly'] },
      { num: 5, name: 'Analytical Applications of Differentiation', fit: 'tangential', hook: 'Constrained optimization on /scenarios — find the slider settings that maximize abatement subject to a cost ceiling.', dashboardPages: ['/scenarios'], linkedLessonIds: [] },
      { num: 6, name: 'Integration and Accumulation of Change', fit: 'direct', hook: 'Same as Calc AB Unit 6: integrate the kW load curve to recover kWh.', dashboardPages: ['/scope-2'], linkedLessonIds: ['l_sinusoid_monthly'] },
      { num: 7, name: 'Differential Equations', fit: 'direct', hook: 'Logistic ODE for forest carbon stock — full lesson exists.', dashboardPages: ['/sinks-os'], linkedLessonIds: ['l_apcalc_bc_forest_diffeq'] },
      { num: 8, name: 'Applications of Integration', fit: 'direct', hook: 'Annual emissions as the integral of (sources − sinks).', dashboardPages: ['/', '/sinks-os'], linkedLessonIds: [] },
      { num: 9, name: 'Parametric Equations, Polar Coordinates, and Vector-Valued Functions', fit: 'tangential', hook: 'Solar panel sun-tracking: position parametrized as r(t) = (cos θ(t), sin θ(t)). Connect to the Earth-Sun geometry on /methodology.', dashboardPages: ['/scope-2'], linkedLessonIds: [] },
      { num: 10, name: 'Infinite Sequences and Series', fit: 'direct', hook: 'Model cumulative annual emissions as a convergent (or divergent) series. Full lesson exists.', dashboardPages: ['/', '/sinks-os'], linkedLessonIds: ['l_apcalc_bc_series'] },
    ],
  },

  {
    courseId: 'AP Computer Science A',
    cedYear: 2026,
    overallFit: 'high — the dashboard codebase IS the material. Every unit can be illustrated with real React/JavaScript on the live site, then ported by students to Java for AP-aligned practice.',
    units: [
      { num: 1, name: 'Primitive Types', fit: 'tangential', hook: 'Browse src/data/scopeTotals.js. Identify which fields are doubles, ints, booleans. Discuss precision (why is a 0.235 grid factor a double, not a float?).', dashboardPages: ['/scope-2'], linkedLessonIds: [] },
      { num: 2, name: 'Using Objects', fit: 'direct', hook: 'Open src/data/scopeTotals.js. Every scope is an object with named fields. Port one (e.g. Scope 1) to a Java class with getters.', dashboardPages: ['/scope-1'], linkedLessonIds: ['l_dashboard_pr'] },
      { num: 3, name: 'Boolean Expressions and if Statements', fit: 'direct', hook: 'Open src/data/aiIngestionBenchmark.js (fieldMatches function). Trace the if/else logic that decides whether an extracted field counts as correct.', dashboardPages: ['/admin/ai-accuracy'], linkedLessonIds: ['l_capstone_q3'] },
      { num: 4, name: 'Iteration', fit: 'direct', hook: 'Open any dashboard component that .map()s over an array (e.g. DormLeaderboard). Rewrite the JavaScript .map as a Java for-loop.', dashboardPages: ['/dorm-leaderboard'], linkedLessonIds: ['l_dorm_chart_port'] },
      { num: 5, name: 'Writing Classes', fit: 'direct', hook: 'Design a Java class for a CarbonRecord with constructors, instance variables, and methods (getCO2eq, toString). Compare to how the dashboard models the same data in JavaScript.', dashboardPages: ['/scope-1', '/scope-2', '/scope-3'], linkedLessonIds: ['l_dashboard_pr'] },
      { num: 6, name: 'Array', fit: 'direct', hook: 'monthlyConsumption[] in src/data/. Sort it, find max, find mean. All AP-style traversal problems.', dashboardPages: ['/scope-2'], linkedLessonIds: [] },
      { num: 7, name: 'ArrayList', fit: 'tangential', hook: 'Most dashboard arrays are static. Discuss when ArrayList (dynamic resizing) would be needed (live BMS feed appending each hour).', dashboardPages: ['/admin/bms-export'], linkedLessonIds: [] },
      { num: 8, name: '2D Array', fit: 'tangential', hook: 'Per-building × per-month kWh matrix. Discuss why the dashboard uses a different data shape (array of objects, not a 2D primitive array).', dashboardPages: ['/scope-2'], linkedLessonIds: [] },
      { num: 9, name: 'Inheritance', fit: 'tangential', hook: 'Design a class hierarchy: Emission → Scope1Emission, Scope2Emission, Scope3Emission. Discuss whether inheritance or composition is better here.', dashboardPages: ['/scope-1', '/scope-2', '/scope-3'], linkedLessonIds: [] },
      { num: 10, name: 'Recursion', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [], note: 'Dashboard avoids recursion (React state model fights it). Teach this unit from the textbook.' },
    ],
  },

  {
    courseId: 'AP US Government & Politics',
    cedYear: 2026,
    overallFit: 'medium — Unit 4 (ideologies) and Unit 5 (participation) have direct climate-policy connections. Earlier foundational units less so.',
    units: [
      { num: 1, name: 'Foundations of American Democracy', fit: 'tangential', hook: 'Federalism applied to environmental regulation: EPA vs state agencies vs municipal zoning. The dashboard uses EPA factors — discuss why federal standards exist at all.', dashboardPages: ['/methodology'], linkedLessonIds: [] },
      { num: 2, name: 'Interactions Among Branches of Government', fit: 'tangential', hook: 'Clean Power Plan litigation as a case study in branch interaction. Brief framing — not a full lesson.', dashboardPages: [], linkedLessonIds: [] },
      { num: 3, name: 'Civil Liberties and Civil Rights', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [], note: 'No direct dashboard tie.' },
      { num: 4, name: 'American Political Ideologies and Beliefs', fit: 'direct', hook: 'Open /scenarios. Run a "conservative" plan (no new taxes), a "progressive" plan (heat-pump mandate), and a "moderate" plan. Discuss how the same data supports different policy conclusions.', dashboardPages: ['/scenarios', '/executive'], linkedLessonIds: ['l_netzero_debate'] },
      { num: 5, name: 'Political Participation', fit: 'direct', hook: 'KUA students can\'t vote yet but can pledge on /your-footprint and lobby the school directly. Discuss the difference between formal and informal political participation.', dashboardPages: ['/your-footprint', '/challenge'], linkedLessonIds: [] },
    ],
  },

  {
    courseId: 'AP Macroeconomics',
    cedYear: 2026,
    overallFit: 'low-to-medium — climate is a long-run negative externality. Best fit on Unit 5 (long-run stabilization) and Unit 6 (open economy).',
    units: [
      { num: 1, name: 'Basic Economic Concepts', fit: 'tangential', hook: 'Carbon as an externality. Opportunity cost of decarbonization vs. status quo. Brief framing.', dashboardPages: ['/scenarios'], linkedLessonIds: [] },
      { num: 2, name: 'Economic Indicators and the Business Cycle', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 3, name: 'National Income and Price Determination', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 4, name: 'Financial Sector', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [], note: 'No direct dashboard tie.' },
      { num: 5, name: 'Long-Run Consequences of Stabilization Policies', fit: 'direct', hook: 'Carbon pricing as a long-run macro intervention. Build a MAC curve from /scenarios — full lesson exists.', dashboardPages: ['/scenarios', '/executive'], linkedLessonIds: ['l_macc_curve'] },
      { num: 6, name: 'Open Economy—International Trade and Finance', fit: 'tangential', hook: 'Border carbon adjustments (EU CBAM). KUA imports embodied carbon via purchased goods — open question whether the dashboard\'s Scope 3 should include trade adjustments.', dashboardPages: ['/scope-3'], linkedLessonIds: [] },
    ],
  },

  {
    courseId: 'AP Microeconomics',
    cedYear: 2026,
    overallFit: 'medium — Unit 6 (market failure) is the canonical climate-econ unit. Earlier units have only setup-style hooks.',
    units: [
      { num: 1, name: 'Basic Economic Concepts', fit: 'tangential', hook: 'Opportunity cost of cutting electricity vs. installing solar.', dashboardPages: ['/scenarios'], linkedLessonIds: [] },
      { num: 2, name: 'Supply and Demand', fit: 'tangential', hook: 'Electricity demand curve at KUA. Why does the BMS show a flat load profile during academic terms but spike during winter?', dashboardPages: ['/scope-2'], linkedLessonIds: [] },
      { num: 3, name: 'Production, Cost, and the Perfect Competition Model', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 4, name: 'Imperfect Competition', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 5, name: 'Factor Markets', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 6, name: 'Market Failure and the Role of Government', fit: 'direct', hook: 'Carbon = textbook negative externality. Apply the deadweight loss + Pigouvian tax framework to KUA\'s 1,720 mtCO₂e. Connect to the MAC curve lesson.', dashboardPages: ['/scenarios', '/executive', '/'], linkedLessonIds: ['l_macc_curve', 'l_peer_compare'] },
    ],
  },

  {
    courseId: 'AP Language & Composition',
    cedYear: 2026,
    overallFit: 'high — the dashboard is a corpus of real-world arguments + technical writing. Every Big Idea can be exercised on a dashboard page.',
    units: [
      { num: 1, name: 'Rhetorical Situation', fit: 'direct', hook: 'Read /methodology as a primary text. Identify the rhetorical situation: who is the writer (a 17-year-old capstone student), who is the audience (KUA faculty + reviewers), what is the exigence (capstone defense)?', dashboardPages: ['/methodology', '/'], linkedLessonIds: ['l_rhetorical_methodology'] },
      { num: 2, name: 'Claims and Evidence', fit: 'direct', hook: 'Open /executive. Every headline claim links to a source file. Have students audit one claim: is the evidence sufficient, relevant, and credible?', dashboardPages: ['/executive', '/methodology'], linkedLessonIds: ['l_rhetorical_methodology'] },
      { num: 3, name: 'Reasoning and Organization', fit: 'direct', hook: 'Outline the argument structure of /executive vs. /digest. One is a board-ready briefing; the other is a monthly summary. How does organization differ when the audience changes?', dashboardPages: ['/executive', '/digest'], linkedLessonIds: [] },
      { num: 4, name: 'Style', fit: 'direct', hook: 'Compare diction: /methodology (technical), /your-footprint (motivational), /faq (conversational). Same data, three styles. Discuss when each is appropriate.', dashboardPages: ['/methodology', '/your-footprint', '/faq'], linkedLessonIds: [] },
    ],
  },

  {
    courseId: 'AP Literature & Composition',
    cedYear: 2026,
    overallFit: 'low — AP Lit is text-driven, not data-driven. Best fit on poetry units where nature writing fits. Most fiction/drama units are honest gaps.',
    units: [
      { num: 1, name: 'Short Fiction I', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 2, name: 'Poetry I', fit: 'tangential', hook: 'Pair Frost\'s "Birches" or Oliver\'s "Wild Geese" with /sinks-os. Discuss how 20th-c American nature poetry shaped our intuitions about NH forests.', dashboardPages: ['/sinks-os'], linkedLessonIds: [] },
      { num: 3, name: 'Longer Fiction or Drama I', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 4, name: 'Short Fiction II', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 5, name: 'Poetry II', fit: 'tangential', hook: 'Climate-era poetry: Camille Dungy, Craig Santos Perez. Read alongside /executive — what can poetry do that a dashboard cannot?', dashboardPages: ['/'], linkedLessonIds: [] },
      { num: 6, name: 'Longer Fiction or Drama II', fit: 'tangential', hook: 'Cli-fi as a genre: Kim Stanley Robinson\'s *Ministry for the Future* opens with a scenario the /scenarios simulator could model. Discuss the limits of fiction as policy argument.', dashboardPages: ['/scenarios'], linkedLessonIds: ['l_aplit_nature_writing'] },
      { num: 7, name: 'Short Fiction III', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 8, name: 'Poetry III', fit: 'tangential', hook: 'Annie Dillard\'s *Pilgrim at Tinker Creek* as lyric prose-poetry. Use as a stylistic model for the nature-writing lesson.', dashboardPages: ['/sinks-os'], linkedLessonIds: ['l_aplit_nature_writing'] },
      { num: 9, name: 'Longer Fiction or Drama III', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
    ],
  },

  {
    courseId: 'AP US History',
    cedYear: 2026,
    overallFit: 'medium — periods 6, 7, 8, 9 (industrialization → present) tie directly to American energy + environmental history. Earlier periods are honest gaps.',
    units: [
      { num: 1, name: 'Period 1: 1491–1607', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 2, name: 'Period 2: 1607–1754', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 3, name: 'Period 3: 1754–1800', fit: 'tangential', hook: 'KUA was founded in 1813. Discuss the energy economy of late-colonial New England (wood + water power). Sets up Period 4.', dashboardPages: ['/sinks-os'], linkedLessonIds: ['l_apush_energy_history'] },
      { num: 4, name: 'Period 4: 1800–1848', fit: 'tangential', hook: 'KUA\'s first decades. Wood as the primary heating fuel; the Upper Valley\'s timber economy. Frame as the prologue to industrial energy transitions.', dashboardPages: ['/scope-1', '/sinks-os'], linkedLessonIds: ['l_apush_energy_history'] },
      { num: 5, name: 'Period 5: 1844–1877', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 6, name: 'Period 6: 1865–1898', fit: 'direct', hook: 'Coal age. American institutions including boarding schools electrified during this period. Trace KUA\'s likely first coal year using archival sources.', dashboardPages: ['/scope-1', '/methodology'], linkedLessonIds: ['l_apush_energy_history'] },
      { num: 7, name: 'Period 7: 1890–1945', fit: 'direct', hook: 'Oil age. KUA\'s shift from coal to #2 fuel oil. The Birdsey forest reference period also begins here (early 20th-c silviculture data is the baseline).', dashboardPages: ['/scope-1', '/sinks-os', '/methodology'], linkedLessonIds: ['l_apush_energy_history'] },
      { num: 8, name: 'Period 8: 1945–1980', fit: 'direct', hook: 'Postwar grid expansion + Clean Air Act (1970). EPA established 1970 — every dashboard emission factor traces to a post-1970 regulatory framework.', dashboardPages: ['/methodology', '/scope-2'], linkedLessonIds: ['l_apush_energy_history'] },
      { num: 9, name: 'Period 9: 1980–Present', fit: 'direct', hook: 'Climate becomes a policy issue (IPCC 1988, Kyoto 1997, Paris 2015). The dashboard\'s entire framing — Scopes 1/2/3, GHG Protocol — comes from this period. Trace.', dashboardPages: ['/methodology', '/news', '/'], linkedLessonIds: ['l_apush_energy_history', 'l_netzero_debate'] },
    ],
  },

  {
    courseId: 'AP Art History',
    cedYear: 2026,
    overallFit: 'low — AP Art History is content-area driven. Only Content Area 10 (Global Contemporary) has direct climate-art connections. Everything else is an honest gap.',
    units: [
      { num: 1, name: 'Global Prehistory', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 2, name: 'Ancient Mediterranean', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 3, name: 'Early Europe and Colonial Americas', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 4, name: 'Later Europe and Americas', fit: 'tangential', hook: 'Hudson River School landscape paintings idealize American wilderness. Compare to the actual measured value of NH forests on /sinks-os. What does each tradition leave out?', dashboardPages: ['/sinks-os'], linkedLessonIds: [] },
      { num: 5, name: 'Indigenous Americas', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 6, name: 'Africa', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 7, name: 'West and Central Asia', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 8, name: 'South, East, and Southeast Asia', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 9, name: 'The Pacific', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 10, name: 'Global Contemporary', fit: 'direct', hook: 'Olafur Eliasson, Andrea Polli, Maya Lin all make climate-data art. Compare formal strategies. Where does the KUA dashboard sit in this visual genealogy?', dashboardPages: ['/', '/executive', '/scope-2'], linkedLessonIds: ['l_aparthist_dataviz', 'l_apstudio_data_art'] },
    ],
  },

  {
    courseId: 'AP Music Theory',
    cedYear: 2026,
    overallFit: 'very low — AP Music Theory is technical music study. The only defensible dashboard tie is sonification (Unit 1 melodic shape, Unit 8 form). Most units are honest gaps.',
    units: [
      { num: 1, name: 'Music Fundamentals I: Pitch, Scales, Rhythm, Meter, Expressive Elements', fit: 'tangential', hook: 'Sonification ground: map dashboard values to pitch. Set up the full sonification lesson.', dashboardPages: ['/scope-2'], linkedLessonIds: ['l_apmusic_sonification'] },
      { num: 2, name: 'Music Fundamentals II: Minor Scales, Melody, Timbre, Texture', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 3, name: 'Music Fundamentals III: Triads and Seventh Chords', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 4, name: 'Harmony and Voice Leading I: Chord Function, Cadence, Phrase', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 5, name: 'Harmony and Voice Leading II: Chord Progressions and Predominant Function', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 6, name: 'Harmony and Voice Leading III: Embellishments, Motives, Melodic Devices', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 7, name: 'Harmony and Voice Leading IV: Secondary Function', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 8, name: 'Modes and Form', fit: 'tangential', hook: 'When sonifying a year of consumption (12 months → 16 bars), what musical form fits best? Through-composed? Binary? Discuss form as a structural choice for data-driven composition.', dashboardPages: ['/scope-2'], linkedLessonIds: ['l_apmusic_sonification'] },
    ],
  },

  {
    courseId: 'AP French',
    cedYear: 2026,
    overallFit: 'medium-low — French AP is thematic. Themes 4 (Science) and 6 (Global Challenges) have direct climate-vocabulary fit. Other themes are tangential.',
    units: [
      { num: 1, name: 'Les familles et les communautés (Families and Communities)', fit: 'tangential', hook: 'Translate one community-level pledge on /your-footprint into French. Discuss collective vs individual responsibility in French climate discourse.', dashboardPages: ['/your-footprint'], linkedLessonIds: ['l_apfrench_translate'] },
      { num: 2, name: "L'identité personnelle et publique (Personal and Public Identities)", fit: 'tangential', hook: 'How does French environmental identity (e.g. les écologistes, the Green Party) differ from American? Brief framing.', dashboardPages: [], linkedLessonIds: [] },
      { num: 3, name: 'La beauté et l\'esthétique (Beauty and Aesthetics)', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 4, name: 'La science et la technologie (Science and Technology)', fit: 'direct', hook: 'Read /methodology in English. Translate the GHG Protocol section into French. Wrestle with terms (sequestration → séquestration, scope → périmètre).', dashboardPages: ['/methodology'], linkedLessonIds: ['l_apfrench_translate'] },
      { num: 5, name: 'La vie contemporaine (Contemporary Life)', fit: 'tangential', hook: 'French daily climate habits: cycling-as-default in Paris, nuclear-heavy grid. Compare to NH. Brief discussion in French.', dashboardPages: ['/your-footprint'], linkedLessonIds: [] },
      { num: 6, name: 'Les défis mondiaux (Global Challenges)', fit: 'direct', hook: 'The full /executive page translated into French for francophone families. The user-guide translation lesson lives here.', dashboardPages: ['/executive', '/'], linkedLessonIds: ['l_apfrench_translate'] },
    ],
  },

  {
    courseId: 'AP Spanish',
    cedYear: 2026,
    overallFit: 'medium-low — same structure as AP French. Themes 4 (Science) and 6 (Global Challenges) have direct fit; comparative journalism (Spain vs Mexico vs South America) gives a unique angle.',
    units: [
      { num: 1, name: 'Las familias y las comunidades (Families and Communities)', fit: 'tangential', hook: 'Translate the /your-footprint reduction pledge into Spanish for hispanophone KUA families.', dashboardPages: ['/your-footprint'], linkedLessonIds: ['l_apspanish_periodismo'] },
      { num: 2, name: 'Las identidades personales y públicas (Personal and Public Identities)', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 3, name: 'La belleza y la estética (Beauty and Aesthetics)', fit: 'none', hook: null, dashboardPages: [], linkedLessonIds: [] },
      { num: 4, name: 'La ciencia y la tecnología (Science and Technology)', fit: 'direct', hook: 'Read El País climate technology section in Spanish. Compare to /methodology\'s English technical register.', dashboardPages: ['/methodology'], linkedLessonIds: ['l_apspanish_periodismo'] },
      { num: 5, name: 'La vida contemporánea (Contemporary Life)', fit: 'tangential', hook: 'Compare daily climate choices in Spain, Mexico, and Argentina (water scarcity, energy poverty, urban transit) to KUA\'s very different context.', dashboardPages: ['/your-footprint'], linkedLessonIds: [] },
      { num: 6, name: 'Los desafíos globales (Global Challenges)', fit: 'direct', hook: 'Full /executive page translated for hispanophone families + comparative journalism lesson.', dashboardPages: ['/executive', '/'], linkedLessonIds: ['l_apspanish_periodismo'] },
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
