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
  'Digital Photography I', 'AP Studio Art',
  'Film and Video Production I',
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
