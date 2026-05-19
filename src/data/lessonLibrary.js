// Lesson library — the searchable content backing /teacher.
//
// Each entry is a complete, drop-into-class artifact tagged with the
// metadata teachers actually filter on (department, course name, format,
// grade band, duration). Course names are restricted to those verified
// against the 2025-26 School Profile and live kua.org curriculum pages
// (see docs/classroom-mapping.md appendix for the source audit). Do
// NOT invent courses — a fake course on this page will erode trust
// faster than any other defect.
//
// To add a lesson:
//   1. Pick a unique id (l_<short_slug>)
//   2. Fill every field; learningGoals + studentTask are the load-bearing ones
//   3. List 1–4 dashboardPages with leading slash (e.g. '/scope-2')
//   4. List 1+ KUA course names from the verified set below
//   5. Pick a format from FORMATS and a gradeBand from GRADE_BANDS

export const DEPARTMENTS = [
  'Science',
  'Mathematics',
  'Computer Science',
  'History & Social Sciences',
  'English',
  'Visual Arts',
  'Cross-curricular / Advisory',
  'STEM Scholar Capstone',
];

export const FORMATS = [
  'Lesson plan',
  'Problem set',
  'Lab activity',
  'Project',
  'Discussion',
  'Reading',
  'Writing prompt',
  'Opener',
  'Quiz',
  'Case study',
];

export const GRADE_BANDS = ['9', '10', '11', '12', '11–12', '9–12'];

export const DURATION_BUCKETS = [
  { id: 'short',  label: '< 20 min', maxMin: 19 },
  { id: 'medium', label: '20–40 min', minMin: 20, maxMin: 40 },
  { id: 'long',   label: '> 40 min', minMin: 41 },
];

// Verified KUA courses — sourced from the 2025-26 School Profile and
// live kua.org pages on 2026-05-19. Keep this list as the source of
// truth for any `courses:` field below.
export const VERIFIED_COURSES = [
  // Science
  'Conceptual Physics (H)', 'Biology (H)', 'AP Biology',
  'Chemistry (H)', 'AP Chemistry', 'Physics (H)', 'AP Physics C',
  'Anatomy & Physiology (H)', 'AP Environmental Science',
  'Marine Biology', 'Wildlife Biology',
  'Design Thinking (H)',
  'Environment and Anthropology (Decarbonize Your Life)',
  'Sustainable Food and Agriculture Systems',
  'Environmental Chemistry', 'Environmental Studies', 'Sustainability',
  // Mathematics
  'Algebra II (H)', 'Geometry (H)',
  'Precalculus AB (H)', 'Precalculus BC (H)',
  'AP Calculus AB', 'AP Calculus BC',
  'Multivariable Calculus', 'Linear Algebra',
  'AP Statistics', 'Prob., Stats., and Data Science (H)',
  // Computer Science
  'Introduction to Computer Science', 'AP Computer Science A',
  // History
  'AP US Government & Politics', 'AP US History', 'US History (H)',
  'AP Macroeconomics', 'AP Microeconomics', 'Global Economics',
  'The West and the World (H)', 'Humanities (H)',
  // English
  'AP Language & Composition', 'AP Literature & Composition',
  "Writer's Workshop (H)",
  // Visual Arts
  'Digital Photography I', 'AP Studio Art', 'AP Music Theory',
  'Film and Video Production I',
  // World Languages
  'AP French', 'AP Latin', 'AP Spanish',
  // History (additional)
  'AP Art History',
  // Cross-curricular
  'Advisory', 'Freshman seminar', 'STEM Scholar Seminar',
];

export const lessonLibrary = [
  // ──────────────────────────────────────────────────────────────
  // Ported from the original Teacher.js LESSON_MODULES (preserved
  // verbatim so existing test/curriculum references still match).
  // ──────────────────────────────────────────────────────────────
  {
    id: 'l_intro_climate',
    title: 'Climate change in 5 minutes',
    format: 'Lesson plan',
    department: 'Cross-curricular / Advisory',
    courses: ['Environment and Anthropology (Decarbonize Your Life)', 'AP Environmental Science', 'Advisory'],
    gradeBand: '9–12',
    durationMin: 18,
    summary: 'A non-mathy walkthrough of the greenhouse effect, why CO₂ matters, and how human activity has changed atmospheric concentrations since 1850.',
    learningGoals: [
      'Distinguish between weather and climate',
      'Identify the major greenhouse gases and their sources',
      'Explain why current warming is "different" from past climate cycles',
    ],
    dashboardPages: ['/', '/methodology'],
    studentTask: 'Sketch the campus and label one Scope-1, one Scope-2, and one Scope-3 source. Compare in pairs.',
    teacherPrep: 'Pull up the homepage on the smart-board; have students open /faq#how-is-this-measured on their devices.',
    keyArticles: ['ka_what_is_footprint', 'ka_scopes'],
  },
  {
    id: 'l_scopes_kua',
    title: 'Scope 1 / 2 / 3 — what KUA actually emits',
    format: 'Lesson plan',
    department: 'Science',
    courses: ['AP Environmental Science', 'AP Chemistry', 'Chemistry (H)', 'Environment and Anthropology (Decarbonize Your Life)'],
    gradeBand: '10',
    durationMin: 28,
    summary: 'Walk through the GHG Protocol scope definitions using KUA\'s own preliminary numbers as the worked example.',
    learningGoals: [
      'Define each scope using a concrete KUA source',
      'Estimate which scope drives the largest share of campus emissions',
      'Argue why measurement boundaries matter for accountability',
    ],
    dashboardPages: ['/scope-1', '/scope-2', '/scope-3'],
    studentTask: 'Given KUA\'s rough scope splits (1: ~1,350 mt, 2: ~385 mt, 3: ~2,635 mt), pick the scope most reducible without the school giving anything up. Defend in 3 sentences.',
    teacherPrep: 'Open all three scope pages in tabs; have students rotate through them in groups.',
    keyArticles: ['ka_scopes', 'ka_kua_emissions'],
  },
  {
    id: 'l_food_dining',
    title: 'Food and carbon — the dining-hall lever',
    format: 'Lesson plan',
    department: 'Science',
    courses: ['AP Biology', 'Biology (H)', 'Sustainable Food and Agriculture Systems'],
    gradeBand: '10',
    durationMin: 22,
    summary: 'Why ruminant meat dominates food-related carbon, and what a 20% beef reduction would mean at scale for KUA dining.',
    learningGoals: [
      'Explain why methane from cattle digestion matters',
      'Compute a simple emission delta from a menu change',
      'Critique the trade-offs of swap-based interventions',
    ],
    dashboardPages: ['/scope-3', '/scenarios'],
    studentTask: 'Use the Dining page\'s "Cut beef 20%" scenario. Compute the per-meal cost and per-student annual impact, then debate whether KUA should adopt it.',
    teacherPrep: 'Optional: invite Sodexo dining manager for the debate portion.',
    keyArticles: ['ka_beef_emissions'],
  },
  {
    id: 'l_grid_mix',
    title: 'Reading a grid mix',
    format: 'Lesson plan',
    department: 'Science',
    courses: ['AP Environmental Science', 'AP Chemistry', 'Physics (H)', 'AP Physics C'],
    gradeBand: '11–12',
    durationMin: 35,
    summary: 'How ISO-NE\'s 2024 mix translates to KUA\'s electricity emissions. Students compute kgCO₂/kWh from first principles using the published shares.',
    learningGoals: [
      'Read and interpret a regional grid generation mix',
      'Compute a weighted-average emission factor',
      'Compare against US and global averages',
    ],
    dashboardPages: ['/scope-2', '/methodology'],
    studentTask: 'Recompute the ISO-NE effective output-basis factor (~0.235 kg CO₂/kWh) using the gridMix percentages and per-fuel factors. Discuss why it\'s ~1.5× cleaner than the US average (~0.37 kg/kWh).',
    teacherPrep: 'Print /methodology emission-factor table as a handout; bring calculators.',
    keyArticles: ['ka_grid_clean'],
  },

  // ──────────────────────────────────────────────────────────────
  // New library content — keyed to verified KUA courses.
  // ──────────────────────────────────────────────────────────────
  {
    id: 'l_solar_cf',
    title: 'Solar capacity factor — why 14%, not 100%?',
    format: 'Problem set',
    department: 'Science',
    courses: ['Physics (H)', 'AP Physics C', 'Conceptual Physics (H)'],
    gradeBand: '9–12',
    durationMin: 25,
    summary: 'KUA\'s 220 kW rooftop solar runs at ~14% capacity factor. Students derive the energy delivered per year at 14% vs. 100% and explain the three biggest physical reasons for the gap.',
    learningGoals: [
      'Compute annual energy from power × time × capacity factor',
      'Identify the geometry, weather, and equipment losses',
      'Apply unit conversion (kW → kWh → MWh)',
    ],
    dashboardPages: ['/scope-2', '/scenarios', '/methodology'],
    studentTask: 'Calculate annual kWh for 220 kW at 14% CF and at 100% CF. Then list (and rank) the three biggest physical reasons for the gap.',
    teacherPrep: 'Confirm the 14% CF number on /methodology before class.',
  },
  {
    id: 'l_birdsey_forest',
    title: 'Birdsey forest sequestration — one acre of KUA',
    format: 'Problem set',
    department: 'Science',
    courses: ['AP Biology', 'Biology (H)', 'AP Environmental Science', 'Wildlife Biology'],
    gradeBand: '11–12',
    durationMin: 30,
    summary: 'Using the Birdsey 1992 New England hardwood sequestration table on /methodology, compute how much CO₂ one acre of KUA forest captured in 2025 — then compare to a single trans-Atlantic student flight.',
    learningGoals: [
      'Use a published sequestration rate to estimate carbon storage',
      'Compare ecosystem services against an individual emission source',
      'Understand additionality and why "the forest covers it" isn\'t a complete answer',
    ],
    dashboardPages: ['/sinks-os', '/methodology'],
    studentTask: 'Compute the kg CO₂ stored by 1 acre of mature NE hardwood in one growing year. Then compute how many years that acre would need to offset a single round-trip trans-Atlantic flight (~1.6 tCO₂e). Reflect: how many acres would offset every flight to KUA each year?',
    teacherPrep: 'Have /sinks-os and /methodology open on the smart-board; print the Birdsey table as a handout.',
  },
  {
    id: 'l_combustion_stoich',
    title: 'Combustion stoichiometry from a KUA boiler',
    format: 'Problem set',
    department: 'Science',
    courses: ['AP Chemistry', 'Chemistry (H)'],
    gradeBand: '11–12',
    durationMin: 40,
    summary: 'Balance the combustion equation for cetane (C₁₆H₃₄, a #2 fuel oil proxy). Derive a theoretical kg CO₂/gallon and compare to the EPA Stationary Combustion factor printed on /scope-1.',
    learningGoals: [
      'Balance hydrocarbon combustion equations',
      'Convert mass → moles → moles CO₂ → mass CO₂',
      'Explain why empirical EPA factors differ from a theoretical floor',
    ],
    dashboardPages: ['/scope-1', '/methodology'],
    studentTask: 'Balance C₁₆H₃₄ + O₂ → CO₂ + H₂O. Using fuel density (~0.85 kg/L) and a 3.785 L/gallon conversion, derive theoretical kg CO₂ per gallon. Compare to EPA\'s 10.21 kg CO₂/gallon on /scope-1. Explain the discrepancy.',
    teacherPrep: 'Standard AP Chem combustion unit prereq; pair with the EPA Stationary Combustion factors handout.',
  },
  {
    id: 'l_gwp_refrigerants',
    title: 'GWP and the refrigerant problem',
    format: 'Reading',
    department: 'Science',
    courses: ['AP Chemistry', 'Chemistry (H)', 'AP Environmental Science'],
    gradeBand: '11–12',
    durationMin: 20,
    summary: 'IPCC AR6 GWP values for HFCs: R-410A = 2,088, R-134a = 1,430, R-32 = 675. Why are these numbers so much bigger than CO₂\'s 1, and what does that mean for a 1-pound charge?',
    learningGoals: [
      'Define global warming potential and the 100-year integration window',
      'Compute CO₂-equivalent emissions from a refrigerant leak',
      'Identify why moving to lower-GWP refrigerants matters at building scale',
    ],
    dashboardPages: ['/methodology'],
    studentTask: 'Pre-class reading: /methodology refrigerant section. In class: compute the CO₂-eq impact of a 5-lb R-410A charge loss vs. a 5-lb R-32 charge loss. Recommend the swap.',
  },
  {
    id: 'l_sinusoid_monthly',
    title: 'Sinusoidal model of monthly campus consumption',
    format: 'Problem set',
    department: 'Mathematics',
    courses: ['AP Calculus AB', 'AP Calculus BC', 'Precalculus BC (H)'],
    gradeBand: '11–12',
    durationMin: 35,
    summary: 'Fit a sinusoidal model to the seasonal pattern on /scope-2. Use the derivative to predict the month when daily energy use is changing fastest. Cross-check against the actual data point.',
    learningGoals: [
      'Fit A·sin(B(x − C)) + D to seasonal data',
      'Differentiate to find rate-of-change extrema',
      'Validate a model against held-out observations',
    ],
    dashboardPages: ['/scope-2'],
    studentTask: 'Read 12 months of consumption from /scope-2. Fit A·sin(B(x − C)) + D. Differentiate. Identify the month with the steepest dE/dt. Compare to the data.',
    teacherPrep: 'Optional: download the monthly data from src/data/monthlyConsumption.js for students to import into Desmos or a spreadsheet.',
  },
  {
    id: 'l_linreg_seasonality',
    title: 'Linear regression with a seasonality residual',
    format: 'Problem set',
    department: 'Mathematics',
    courses: ['Algebra II (H)', 'AP Statistics'],
    gradeBand: '11–12',
    durationMin: 30,
    summary: 'Same dataset as the calculus problem, but the question is: why does a straight-line fit fail? Decompose into trend + seasonal residual and discuss when each model is appropriate.',
    learningGoals: [
      'Fit a least-squares line to time-series data',
      'Compute and interpret residuals',
      'Recognize seasonality as a systematic residual pattern',
    ],
    dashboardPages: ['/scope-2'],
    studentTask: 'Fit a linear regression to 12 months of /scope-2 consumption. Compute residuals. Plot residuals over month-of-year. Argue: should KUA use this for forecasting?',
  },
  {
    id: 'l_variance_propagation',
    title: 'Variance propagation on the headline number',
    format: 'Lab activity',
    department: 'Mathematics',
    courses: ['AP Statistics', 'Prob., Stats., and Data Science (H)'],
    gradeBand: '12',
    durationMin: 50,
    summary: 'The dashboard reports KUA\'s net annual footprint as 1,720 mtCO₂e with no uncertainty band. Pick three big inputs, assume each has a ±10–20% uncertainty, and propagate the combined band using the variance-addition rule.',
    learningGoals: [
      'Apply the variance-addition rule for independent errors',
      'Translate a ± percent uncertainty into a standard deviation',
      'Recommend whether to publish a point or a range',
    ],
    dashboardPages: ['/', '/methodology', '/admin/data-quality'],
    studentTask: 'For three inputs (electricity kWh × grid factor, oil gallons × combustion factor, tree growth × Birdsey factor), assume stated ±10–20% uncertainty. Propagate. Recommend.',
    teacherPrep: 'Capstone Priority 5 is open work — strong submissions can be folded into the actual dashboard.',
  },
  {
    id: 'l_macc_curve',
    title: 'Marginal abatement cost curve for KUA',
    format: 'Case study',
    department: 'History & Social Sciences',
    courses: ['AP Macroeconomics', 'AP Microeconomics', 'Global Economics'],
    gradeBand: '11–12',
    durationMin: 45,
    summary: 'At a $50 / $100 / $200 per tCO₂e carbon price, which /scenarios levers become economical? Build a marginal abatement cost curve for KUA at each price and recommend the price that gets KUA to net-zero by 2040 economically.',
    learningGoals: [
      'Construct a marginal abatement cost curve from project data',
      'Compare carbon prices against project NPVs',
      'Argue policy choices using a quantitative framework',
    ],
    dashboardPages: ['/scenarios', '/executive'],
    studentTask: 'Build a MAC curve for the four /scenarios levers. Rank by $/tCO₂e abated. Identify the price needed to incentivize net-zero by 2040.',
  },
  {
    id: 'l_rhetorical_methodology',
    title: 'Rhetorical analysis of /methodology',
    format: 'Writing prompt',
    department: 'English',
    courses: ['AP Language & Composition', "Writer's Workshop (H)"],
    gradeBand: '11–12',
    durationMin: 60,
    summary: 'The dashboard claims KUA\'s net footprint is "about 5 metric tons per student per year." Is this claim well-supported? What rhetorical moves does the dashboard use to establish trust?',
    learningGoals: [
      'Identify ethos / logos / pathos moves in technical writing',
      'Distinguish well-supported claims from rhetorical ones',
      'Write a 750-word rhetorical analysis grounded in primary text',
    ],
    dashboardPages: ['/', '/executive', '/methodology'],
    studentTask: '750-word rhetorical analysis. Is the per-student claim well-supported? What would a hostile reader push back on? What does the dashboard do to establish trust?',
  },
  {
    id: 'l_dorm_chart_port',
    title: 'Recreate the dorm leaderboard chart',
    format: 'Project',
    department: 'Computer Science',
    courses: ['Introduction to Computer Science'],
    gradeBand: '9–12',
    durationMin: 90,
    summary: 'Pick the /dorm-leaderboard chart. Recreate it using a charting library of your choice (Chart.js, Recharts, vanilla Canvas). Compare design decisions and present.',
    learningGoals: [
      'Read source code to understand a chart\'s data structure',
      'Render the same data in a different library',
      'Defend visual design choices (color, ordering, labels)',
    ],
    dashboardPages: ['/dorm-leaderboard'],
    studentTask: 'Fork or read src/data/dormUsage.js + src/pages/DormLeaderboard.js. Recreate the chart in your library of choice. Present.',
    teacherPrep: 'GitHub repo is public — students don\'t need a fork.',
  },
  {
    id: 'l_dashboard_pr',
    title: 'Open a real pull request on the dashboard',
    format: 'Project',
    department: 'Computer Science',
    courses: ['AP Computer Science A', 'Introduction to Computer Science'],
    gradeBand: '11–12',
    durationMin: 120,
    summary: 'Find one bug, one missing test, or one accessibility issue on the live dashboard. Fix it. Open a pull request. Their name lands in the commit history — real open-source contribution.',
    learningGoals: [
      'Read an unfamiliar codebase to find a real defect',
      'Write a fix that passes existing tests',
      'Communicate a change clearly in a PR description',
    ],
    dashboardPages: ['/'],
    studentTask: 'Open the GitHub repo. Find an issue (or a bug you notice). Fix it on a branch. Open a PR with a description that explains what + why.',
    teacherPrep: 'PRs are auto-reviewed; the maintainer will give feedback. Allow ~1 week turnaround.',
  },
  {
    id: 'l_personal_footprint',
    title: 'Decarbonize Your Life — week-1 personal footprint',
    format: 'Project',
    department: 'Science',
    courses: ['Environment and Anthropology (Decarbonize Your Life)'],
    gradeBand: '11–12',
    durationMin: 60,
    summary: 'Every student computes their personal footprint on the dashboard, screenshots it, and writes a 250-word reflection on which row is their biggest reducible source.',
    learningGoals: [
      'Compute a personal carbon footprint from five inputs',
      'Identify the dominant reducible category for your lifestyle',
      'Articulate a 30% reduction plan in writing',
    ],
    dashboardPages: ['/your-footprint'],
    studentTask: 'Use /your-footprint. Screenshot. Write 250 words: which row dominates your footprint, and what 30% cut would you commit to first?',
  },
  {
    id: 'l_campus_photos',
    title: 'Campus building photography submission',
    format: 'Project',
    department: 'Visual Arts',
    courses: ['Digital Photography I', 'Film and Video Production I'],
    gradeBand: '10',
    durationMin: 90,
    summary: 'The dashboard\'s /campus-map page needs better photos of every building. Photos that pass quality review get published with a credit line in the commit.',
    learningGoals: [
      'Shoot architecture in consistent light + composition',
      'Edit for web display (1600×900 JPG)',
      'Submit work for editorial review',
    ],
    dashboardPages: ['/campus-map'],
    studentTask: 'Shoot 3 KUA buildings. Edit to 1600×900 JPG. Submit to the dashboard maintainer.',
    teacherPrep: 'Coordinate with maintainer for credit-line format.',
  },
  {
    id: 'l_netzero_debate',
    title: 'Net-zero by 2040 — policy debate using /scenarios',
    format: 'Discussion',
    department: 'History & Social Sciences',
    courses: ['AP US Government & Politics', 'Global Economics', 'Environment and Anthropology (Decarbonize Your Life)', 'Advisory'],
    gradeBand: '11–12',
    durationMin: 40,
    summary: 'Move four sliders on /scenarios to model a net-zero-by-2040 plan. Defend your slider settings against three classmate proposals. Vote on the winning plan.',
    learningGoals: [
      'Model policy choices as quantitative levers',
      'Defend trade-offs (cost vs. carbon vs. campus disruption)',
      'Negotiate a coalition solution',
    ],
    dashboardPages: ['/scenarios', '/executive'],
    studentTask: 'Build your slider settings. Present in 60 seconds. Vote.',
  },
  {
    id: 'l_dashboard_scavenger',
    title: '⌘K dashboard scavenger hunt',
    format: 'Opener',
    department: 'Cross-curricular / Advisory',
    courses: ['Advisory', 'Freshman seminar'],
    gradeBand: '9',
    durationMin: 15,
    summary: 'Five-minute scavenger hunt to teach students the search-anywhere palette and the structure of the dashboard. Works as a first-week onboarding for any class that will use the dashboard.',
    learningGoals: [
      'Use the ⌘K search palette to navigate',
      'Locate the methodology, dorm leaderboard, scenarios, and FAQ pages',
      'Build a mental model of how the dashboard is organized',
    ],
    dashboardPages: ['/'],
    studentTask: 'Find: (1) KUA\'s net annual footprint, (2) the methodology page citation list, (3) your dorm\'s rank, (4) one reduction scenario, (5) one FAQ answer. Each via ⌘K, no clicking nav.',
  },
  {
    id: 'l_capstone_q3',
    title: 'Tag a real source document for the AI ingestion benchmark',
    format: 'Project',
    department: 'STEM Scholar Capstone',
    courses: ['STEM Scholar Seminar', 'AP Computer Science A'],
    gradeBand: '11–12',
    durationMin: 240,
    summary: 'Capstone Priority 1 Q3 is open: the dashboard needs 5–10 tagged source documents to populate src/data/aiIngestionBenchmark.js. Tag a real heating-oil bill, fuel delivery slip, or flight manifest (PII removed). When committed, /admin/ai-accuracy lights up with a real number.',
    learningGoals: [
      'Apply a ground-truth schema to messy real documents',
      'Decide which fields are safety-critical (require 100%) vs routine (≥95%)',
      'Run an end-to-end benchmark and interpret the accuracy report',
    ],
    dashboardPages: ['/admin/ai-accuracy', '/admin/ai-ingestion'],
    studentTask: 'Pick 1 document type. Strip PII. Tag fields per docs/ai-ingestion-benchmark.md. Commit to src/data/aiIngestionBenchmark.js. Run scripts/runAiBenchmark.mjs.',
    teacherPrep: 'Capstone mentor coordinates with KUA Facilities to source the document set.',
  },
  {
    id: 'l_peer_compare',
    title: 'KUA vs. peers — independent-school carbon ranking',
    format: 'Discussion',
    department: 'Science',
    courses: ['AP Environmental Science', 'Global Economics'],
    gradeBand: '11–12',
    durationMin: 30,
    summary: 'KUA\'s per-student footprint (~5 mtCO₂e) sits in the lower-middle of independent boarding schools that publish data. Why is the ranking what it is, and what would move KUA up?',
    learningGoals: [
      'Read a peer-comparison chart with confidence intervals',
      'Identify school-specific factors driving the ranking',
      'Recommend interventions calibrated to the gap',
    ],
    dashboardPages: ['/peer-comparison', '/executive'],
    studentTask: 'List 3 reasons KUA ranks where it does. List 3 changes that would move KUA into the top quartile. Vote on which is most likely to actually happen.',
  },

  // ──────────────────────────────────────────────────────────────
  // Phase 367+ — comprehensive AP coverage. Every AP course in
  // the 2025-26 School Profile has at least one dedicated lesson
  // below (in addition to whatever it shares with cross-listed
  // lessons above).
  // ──────────────────────────────────────────────────────────────

  {
    id: 'l_apphys_windturbine',
    title: 'Wind turbine power calculus — Charlotte\'s Windmill',
    format: 'Problem set',
    department: 'Science',
    courses: ['AP Physics C', 'Physics (H)'],
    gradeBand: '12',
    durationMin: 50,
    summary: 'Apply the wind-power equation P = ½·ρ·A·v³·Cp to KUA\'s 15 kW Charlotte\'s Windmill (installed 2013). Use calculus to find the cut-in wind speed where output equals losses, and integrate a typical New Hampshire wind distribution to estimate annual kWh.',
    learningGoals: [
      'Derive the cubic dependence of power on wind speed',
      'Integrate a power curve over a Weibull-distributed wind speed',
      'Estimate annual energy output from a probabilistic input',
    ],
    dashboardPages: ['/scope-2', '/methodology', '/scenarios'],
    studentTask: 'Given ρ_air = 1.225 kg/m³, rotor area for a 15 kW turbine, and Cp ≈ 0.35: (1) compute instantaneous P at v = 4, 6, 8, 10, 12 m/s. (2) Assume a Weibull(k=2, λ=6 m/s) wind distribution. Integrate to estimate annual kWh. (3) Compare to KUA\'s published 220 kW solar — which gives more energy per dollar?',
    teacherPrep: 'Pair with the New Hampshire wind atlas for site context (5,500 ft hub-height isn\'t standard for a school).',
  },
  {
    id: 'l_apphys_heatpump_thermo',
    title: 'Heat pump COP from thermodynamic first principles',
    format: 'Problem set',
    department: 'Science',
    courses: ['AP Physics C', 'Physics (H)'],
    gradeBand: '12',
    durationMin: 45,
    summary: 'The /scenarios heat-pump electrification slider assumes COP = 3.0. Derive the Carnot maximum COP for a heat pump moving heat from a 0°C outdoor source to a 20°C indoor sink. Explain why real heat pumps fall short and how that gap shrinks at lower temperature differentials.',
    learningGoals: [
      'Apply Carnot COP formula: COP_max = T_hot / (T_hot − T_cold)',
      'Convert between celsius and Kelvin in efficiency calculations',
      'Reason about why real-world COP < Carnot COP',
    ],
    dashboardPages: ['/scenarios', '/methodology'],
    studentTask: 'Compute Carnot COP for the case 0°C / 20°C. Then for −15°C / 20°C. Then for −30°C / 20°C. Plot. Explain why air-source heat pumps are worse in Vermont winters than the marketing brochures suggest.',
  },
  {
    id: 'l_apcalc_bc_forest_diffeq',
    title: 'Forest carbon growth as a differential equation',
    format: 'Problem set',
    department: 'Mathematics',
    courses: ['AP Calculus BC'],
    gradeBand: '12',
    durationMin: 45,
    summary: 'Model the carbon stock of KUA\'s 1,000-acre forest as a logistic growth ODE: dC/dt = r·C·(1 − C/K). Solve, fit r and K from /sinks-os values, and predict when the forest reaches carrying capacity.',
    learningGoals: [
      'Set up a logistic growth ODE for biomass accumulation',
      'Solve a separable ODE analytically',
      'Fit r and K to two data points',
    ],
    dashboardPages: ['/sinks-os', '/methodology'],
    studentTask: 'Assume KUA\'s forest currently stores C₀ = 200,000 mtCO₂e and sequesters 2,100 mtCO₂e/year, with maximum carrying capacity K = 400,000 mtCO₂e. (1) Write the logistic ODE. (2) Solve. (3) Estimate r. (4) Predict when sequestration drops below 1,000 mtCO₂e/year.',
  },
  {
    id: 'l_apcalc_bc_series',
    title: 'Series convergence — sources vs sinks',
    format: 'Problem set',
    department: 'Mathematics',
    courses: ['AP Calculus BC'],
    gradeBand: '12',
    durationMin: 40,
    summary: 'Model KUA\'s annual net carbon as the sum of two infinite series: one for cumulative sources (with annual growth) and one for cumulative sinks (with logistic saturation). Test for convergence and interpret the limit.',
    learningGoals: [
      'Apply the ratio test to geometric-like series',
      'Recognize when an alternating series converges',
      'Interpret a series limit physically',
    ],
    dashboardPages: ['/', '/sinks-os', '/scope-1', '/scope-2', '/scope-3'],
    studentTask: 'Let S_n = Σ(k=1 to n) sources_k where sources_k = 1500·(0.97)^k (3% annual reduction). Let F_n be a similar series for sinks. Test both for convergence. What does the limiting "net forever" look like? Argue whether the question is even meaningful.',
  },
  {
    id: 'l_apbio_photosynthesis_quant',
    title: 'Quantitative photosynthesis — from leaf to forest',
    format: 'Lab activity',
    department: 'Science',
    courses: ['AP Biology', 'Biology (H)'],
    gradeBand: '11–12',
    durationMin: 50,
    summary: 'Scale up the photosynthesis equation (6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂) from a single leaf\'s gas-exchange rate to KUA\'s 1,000-acre forest. Compare your derived annual CO₂ uptake to the published 2,100 mtCO₂e on /sinks-os.',
    learningGoals: [
      'Stoichiometric calculation across the photosynthesis equation',
      'Scale from leaf-area gas exchange (mol/m²/s) to acreage',
      'Reconcile bottom-up estimates with published ecosystem-level numbers',
    ],
    dashboardPages: ['/sinks-os', '/methodology'],
    studentTask: 'Assume net leaf-level CO₂ uptake of 8 µmol/m²/s during the 6-hour daily growing window for 180 days. Estimate per-acre annual uptake. Multiply by 1,000 acres. Compare to /sinks-os\' 2,100 mtCO₂e. If they disagree, hypothesize why.',
    teacherPrep: 'Background reading: standard AP Bio photosynthesis unit. Pair with a real leaf-area-index estimate for NE hardwoods (~4–6).',
  },
  {
    id: 'l_apchem_hess',
    title: 'Hess\'s law and the enthalpy of combustion',
    format: 'Problem set',
    department: 'Science',
    courses: ['AP Chemistry', 'Chemistry (H)'],
    gradeBand: '11–12',
    durationMin: 35,
    summary: 'Derive the standard enthalpy of combustion ΔH°_c for #2 fuel oil (cetane proxy) using Hess\'s law and tabulated ΔH°_f values. Convert to a kWh-per-gallon "useful heat" estimate and compare to /scope-1\'s assumed boiler efficiency.',
    learningGoals: [
      'Apply Hess\'s law to a multi-step combustion',
      'Use standard enthalpies of formation from a data table',
      'Connect bench-scale thermochemistry to building-scale energy use',
    ],
    dashboardPages: ['/scope-1', '/methodology'],
    studentTask: 'Use ΔH°_f for cetane, CO₂, and H₂O(l) to compute ΔH°_c per mole of cetane. Convert to kWh per gallon of #2 fuel oil (density ≈ 0.85 kg/L, MW ≈ 226 g/mol). Compare to KUA\'s assumed boiler efficiency on /methodology. Does the math line up?',
  },
  {
    id: 'l_apstat_hyp_test',
    title: 'Hypothesis test — is KUA significantly different from peer mean?',
    format: 'Problem set',
    department: 'Mathematics',
    courses: ['AP Statistics'],
    gradeBand: '12',
    durationMin: 40,
    summary: 'KUA\'s per-student footprint is ~5 mtCO₂e. The peer mean (per /peer-comparison) is reported with a confidence interval. Set up and run a two-sample t-test. Is KUA *statistically* different from peers, or just numerically?',
    learningGoals: [
      'Frame a real-world question as a null + alternative hypothesis',
      'Compute a t-statistic for two independent samples',
      'Interpret a p-value and avoid common misreadings',
    ],
    dashboardPages: ['/peer-comparison', '/methodology'],
    studentTask: 'State H₀ and H_a. Compute t-statistic. Find p-value. Reject or fail to reject at α = 0.05. Write one sentence on what you can and cannot conclude.',
    teacherPrep: 'Standard 2-sample t-test unit prereq.',
  },
  {
    id: 'l_aplit_nature_writing',
    title: 'Nature writing — KUA carbon in the voice of Annie Dillard',
    format: 'Writing prompt',
    department: 'English',
    courses: ['AP Literature & Composition'],
    gradeBand: '12',
    durationMin: 90,
    summary: 'Annie Dillard\'s *Pilgrim at Tinker Creek*, Rachel Carson\'s *Silent Spring*, and Aldo Leopold\'s *Sand County Almanac* all turn ecological data into lyric prose. Write 800 words about KUA\'s carbon footprint in the stylistic register of one of those authors.',
    learningGoals: [
      'Read three canonical nature-writing voices closely',
      'Render quantitative data in lyric prose without losing accuracy',
      'Defend a stylistic choice in the margins of your draft',
    ],
    dashboardPages: ['/', '/sinks-os', '/scope-1', '/scope-2', '/methodology'],
    studentTask: '800-word essay on KUA\'s 1,720 mtCO₂e in the voice of Dillard, Carson, or Leopold. Margin notes annotate at least 5 places where you made a stylistic choice + why.',
  },
  {
    id: 'l_apush_energy_history',
    title: 'KUA energy history — 1813 to present',
    format: 'Project',
    department: 'History & Social Sciences',
    courses: ['AP US History', 'US History (H)'],
    gradeBand: '11',
    durationMin: 180,
    summary: 'Trace KUA\'s heating, lighting, and transport energy sources from founding (1813) through the present. Frame as a microhistory of American energy transitions — wood → coal → oil → grid → renewables — through a single institution\'s lens.',
    learningGoals: [
      'Trace the macro arc of US energy transitions through one site\'s sources',
      'Use archival material (KUA Archives, NH state energy records)',
      'Distinguish technological capability from economic + cultural drivers',
    ],
    dashboardPages: ['/scope-1', '/scope-2', '/methodology', '/sinks-os'],
    studentTask: '8–10 page paper. Build a timeline of KUA\'s primary energy sources by decade since 1813. Cite at least 3 archival sources (KUA Archives, NH energy commission, period photographs). Analyze where the institutional choices led the broader American transition vs followed it.',
    teacherPrep: 'KUA Archives contact: librarian@kua.org. Recommended secondary text: David Nye, *Consuming Power* (1998).',
  },
  {
    id: 'l_aparthist_dataviz',
    title: 'Visual rhetoric of climate data — three traditions',
    format: 'Case study',
    department: 'History & Social Sciences',
    courses: ['AP Art History'],
    gradeBand: '11–12',
    durationMin: 50,
    summary: 'Compare the visual rhetoric of three climate-data traditions: editorial (NYT, Bloomberg), academic-neutral (Our World in Data, IPCC), and corporate-marketing (corporate sustainability reports). Where does the KUA dashboard sit in this visual genealogy, and what choices does it make?',
    learningGoals: [
      'Apply formal analysis (color, composition, hierarchy) to data visualization',
      'Identify the rhetorical register of a chart genre',
      'Critique your own institution\'s visual choices with academic distance',
    ],
    dashboardPages: ['/', '/executive', '/scope-2', '/peer-comparison'],
    studentTask: 'Pick 1 NYT climate piece, 1 Our World in Data chart, 1 corporate sustainability report figure. Compare each to a single KUA dashboard page. 5-slide deck or 1,000-word essay: what tradition is KUA borrowing from, what is it doing differently, what does that say about the audience it imagines?',
  },
  {
    id: 'l_apfrench_translate',
    title: 'Translate the KUA user guide for francophone families',
    format: 'Project',
    department: 'Cross-curricular / Advisory',
    courses: ['AP French'],
    gradeBand: '11–12',
    durationMin: 90,
    summary: 'KUA has students from 26 countries. Translate the top sections of docs/user-guide.md into French for prospective francophone families (Québec, France, Senegal, Switzerland). Wrestle with the climate-specific vocabulary that doesn\'t have clean cognates.',
    learningGoals: [
      'Translate technical content while preserving register',
      'Research domain-specific French climate vocabulary',
      'Justify translation choices for ambiguous terms (carbon offset, scope, sequestration)',
    ],
    dashboardPages: ['/'],
    studentTask: 'Translate the "If you\'re a KUA parent" section (~250 words) into French. Produce a glossary of 10 climate terms you had to research (e.g., empreinte carbone, séquestration, périmètre Scope 3). Defend your choice for at least 3 ambiguous terms.',
    teacherPrep: 'Pair with Le Monde Planète section as a stylistic reference. Submit good translations back to the dashboard team for inclusion.',
  },
  {
    id: 'l_aplatin_etymology',
    title: 'Latin roots of climate vocabulary',
    format: 'Reading',
    department: 'Cross-curricular / Advisory',
    courses: ['AP Latin'],
    gradeBand: '11–12',
    durationMin: 35,
    summary: 'Most modern climate-policy vocabulary comes through Latin. Trace the etymology of 12 dashboard-essential terms (carbon, sequester, emission, scope, audit, sustainable, methodology, perennial, equivalent, baseline, mitigate, adaptation) back to their Latin roots, and explain what each etymology reveals about the concept.',
    learningGoals: [
      'Read Latin etymological dictionaries (OED, Lewis & Short) competently',
      'Connect a word\'s Latin root to its modern technical sense',
      'Argue when etymology illuminates a concept vs. misleads about it',
    ],
    dashboardPages: ['/methodology'],
    studentTask: 'For 12 dashboard-essential terms: give the Latin root + literal meaning + modern English sense. Identify the 3 cases where the Latin meaning still actively shapes the modern technical definition, and the 3 cases where it doesn\'t.',
  },
  {
    id: 'l_apspanish_periodismo',
    title: 'Comparative climate journalism — El País vs the KUA dashboard',
    format: 'Case study',
    department: 'Cross-curricular / Advisory',
    courses: ['AP Spanish'],
    gradeBand: '11–12',
    durationMin: 60,
    summary: 'El País (Spain) and El Universal (Mexico) cover climate from very different national stakes than US media. Read three recent Spanish-language climate articles and compare the rhetorical and visual choices to the KUA dashboard\'s English-language editorial register.',
    learningGoals: [
      'Read long-form Spanish climate journalism for stance + framing',
      'Identify regional variations in climate vocabulary (sequía vs aridez, sostenible vs sustentable)',
      'Defend a comparative analysis in Spanish prose',
    ],
    dashboardPages: ['/digest', '/executive', '/methodology'],
    studentTask: 'Read 3 Spanish-language climate pieces (1 Spain, 1 Mexico, 1 Argentina/Chile). Write a 600-word comparative analysis in Spanish: how does each frame responsibility (national vs individual vs corporate), and how does the KUA dashboard\'s framing compare?',
  },
  {
    id: 'l_apstudio_data_art',
    title: 'Data art portfolio piece — KUA carbon as material',
    format: 'Project',
    department: 'Visual Arts',
    courses: ['AP Studio Art'],
    gradeBand: '11–12',
    durationMin: 600,
    summary: 'Make a piece of studio art (painting, sculpture, photo series, mixed media) that uses KUA\'s carbon data as its conceptual or formal foundation. Submit as part of your AP Studio Art Sustained Investigation portfolio.',
    learningGoals: [
      'Translate quantitative information into a visual / material form',
      'Defend conceptual choices in an artist\'s statement',
      'Sustain a single investigation across multiple iterations',
    ],
    dashboardPages: ['/', '/scope-1', '/scope-2', '/scope-3', '/sinks-os'],
    studentTask: 'Produce 3 iterations of one piece that uses KUA dashboard data as source material. Examples: 1 stroke per mtCO₂e on a stretched canvas; a sculpture whose mass equals one student\'s annual footprint; a photo series of the buildings ranked by per-resident emissions. Write 400-word artist\'s statement.',
    teacherPrep: 'Counts toward Sustained Investigation portfolio. Coordinate with the maintainer if the piece deserves dashboard exhibition space.',
  },
  {
    id: 'l_apmusic_sonification',
    title: 'Sonification — monthly campus consumption as melody',
    format: 'Project',
    department: 'Visual Arts',
    courses: ['AP Music Theory'],
    gradeBand: '11–12',
    durationMin: 90,
    summary: 'Translate KUA\'s 12-month electricity consumption time series into a melodic line. Map kWh to pitch, month-of-year to beat. Compose a 16-bar piece in a chosen mode that honors the data\'s seasonal shape.',
    learningGoals: [
      'Map quantitative data to musical parameters defensibly',
      'Compose within a chosen mode while preserving data fidelity',
      'Critique sonification as an analytical vs an emotional medium',
    ],
    dashboardPages: ['/scope-2'],
    studentTask: 'Pull 12 months of consumption data from /scope-2 or src/data/monthlyConsumption.js. Map kWh→pitch using a defensible scaling (linear? log? quantized to mode degrees?). Compose 16 bars. Notate. Perform. Defend mapping choices in 200 words.',
    teacherPrep: 'Optional: pair with Andrea Polli\'s climate sonification work as reference. Submit good compositions for the dashboard\'s asset library.',
  },
];

// Helper: bucket a duration into one of the DURATION_BUCKETS.
export function bucketDuration(min) {
  return DURATION_BUCKETS.find((b) =>
    (b.minMin === undefined || min >= b.minMin) &&
    (b.maxMin === undefined || min <= b.maxMin)
  );
}

// Helper: case-insensitive substring match across the searchable fields.
export function matchesQuery(lesson, q) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    lesson.title.toLowerCase().includes(needle) ||
    lesson.summary.toLowerCase().includes(needle) ||
    lesson.courses.some((c) => c.toLowerCase().includes(needle)) ||
    lesson.format.toLowerCase().includes(needle) ||
    lesson.department.toLowerCase().includes(needle)
  );
}
