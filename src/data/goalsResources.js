// Resource library backing the /goals "Resources & references" section.
// Each entry is one row in the section's grid: title, blurb, href, and
// a `kind` that drives the color pill. `href` strings starting with "/"
// route internally via <Link>; everything else is an external <a>.
//
// Provenance for the URLs: root-domain canonical sources only — every
// entry's URL has been kept to the well-known canonical host so we
// don't link to deep paths that may move. If you want a deeper landing
// page, replace the href here and the rest of the page picks it up.
//
// Categories were chosen so a reader can answer four distinct questions:
//   • What standards should our plan conform to?    (framework)
//   • Who can we model ourselves on?                (peer)
//   • How do we pay for it?                         (funding)
//   • What software / numbers do I plug into?       (tool)
//   • What concrete actions close the gap?          (action)
//   • Where do KUA-specific docs live?              (internal)

export const RESOURCE_CATEGORIES = [
  {
    id: 'framework',
    title: 'Frameworks & standards',
    blurb: 'The accounting + commitment standards every credible climate plan references. KUA targets follow these.',
  },
  {
    id: 'peer',
    title: 'Peer-institution climate plans',
    blurb: 'Schools KUA can model itself on — either ahead of us or matched in scale.',
  },
  {
    id: 'funding',
    title: 'Funding & grants',
    blurb: 'Federal + state + utility programs that defray the capital cost of decarbonization projects.',
  },
  {
    id: 'tool',
    title: 'Calculators & planning tools',
    blurb: 'Software + datasets used to translate goals into project economics.',
  },
  {
    id: 'action',
    title: 'Action levers — concrete reduction options',
    blurb: 'Per-target playbooks: heating, electricity, dining, fleet, transport. These are the actual moves that close the gap on the dials above.',
  },
  {
    id: 'internal',
    title: 'In-dashboard resources',
    blurb: 'Pages on this dashboard that go deeper on the same numbers.',
  },
];

/**
 * @typedef {Object} GoalResource
 * @property {string} title
 * @property {string} blurb
 * @property {string} href              full URL or internal path
 * @property {string} category          one of RESOURCE_CATEGORIES.id
 * @property {string} [scope]           optional — which target this maps to
 */

/** @type {GoalResource[]} */
export const GOAL_RESOURCES = [
  // ─── FRAMEWORKS & STANDARDS ───
  {
    title: 'Science Based Targets initiative (SBTi)',
    blurb: 'Source of the "−50% by 2030 + net-zero by 2050" methodology our top-line targets follow.',
    href: 'https://sciencebasedtargets.org',
    category: 'framework',
  },
  {
    title: 'Second Nature — Presidents\' Climate Leadership Commitments',
    blurb: 'The signatory framework most US colleges + prep schools use to commit publicly. ACUPCC reporting templates live here.',
    href: 'https://secondnature.org',
    category: 'framework',
  },
  {
    title: 'GHG Protocol Corporate Standard',
    blurb: 'The accounting standard that defines Scope 1 / 2 / 3 — the boundary lines our dashboard uses to bucket emissions.',
    href: 'https://ghgprotocol.org',
    category: 'framework',
  },
  {
    title: 'AASHE STARS',
    blurb: 'Sustainability Tracking, Assessment & Rating System. The credit categories are a useful checklist of what a complete sustainability program covers.',
    href: 'https://stars.aashe.org',
    category: 'framework',
  },
  {
    title: 'IPCC Sixth Assessment Report (AR6)',
    blurb: 'The scientific basis for the 1.5 °C pathway and the carbon budgets that justify SBTi targets.',
    href: 'https://www.ipcc.ch',
    category: 'framework',
  },
  {
    title: 'ISO 14064',
    blurb: 'International standard for organization-level GHG quantification + reporting. Reference when our methodology page needs an external citation.',
    href: 'https://www.iso.org',
    category: 'framework',
  },
  {
    title: 'EPA GHG Emission Factors Hub',
    blurb: 'Authoritative US emission factors — the same factors scopeTotals.js cites for heating, electricity, refrigerants, waste.',
    href: 'https://www.epa.gov/climateleadership/ghg-emission-factors-hub',
    category: 'framework',
  },
  {
    title: 'ENERGY STAR Portfolio Manager',
    blurb: 'Free building-level energy benchmarking from EPA. Every KUA building should be tracked here in addition to our BMS.',
    href: 'https://www.energystar.gov/buildings/benchmark',
    category: 'framework',
  },

  // ─── PEER-INSTITUTION CLIMATE PLANS ───
  {
    title: 'Middlebury College Sustainability',
    blurb: 'Carbon-neutral since 2016. Their phased-electrification + biomass-then-heat-pumps roadmap is the closest match for KUA\'s climate + scale.',
    href: 'https://www.middlebury.edu/sustainability',
    category: 'peer',
  },
  {
    title: 'Colby College Carbon Neutral Plan',
    blurb: 'Achieved carbon neutrality in 2013, primarily through biomass + offsets. Honest postmortem on the offset-heavy strategy.',
    href: 'https://www.colby.edu/sustainability',
    category: 'peer',
  },
  {
    title: 'Bowdoin College Sustainability',
    blurb: 'Carbon neutral since 2018. Strong precedent for how a small NE liberal-arts campus structures a climate office + reporting.',
    href: 'https://www.bowdoin.edu/sustainability',
    category: 'peer',
  },
  {
    title: 'Harvard Sustainability — Climate Action',
    blurb: 'Fossil-fuel-neutral target 2026, fossil-fuel-free 2050. Public roadmap with measured progress dashboards — useful as a layout reference.',
    href: 'https://sustainability.harvard.edu',
    category: 'peer',
  },
  {
    title: 'Yale Sustainability',
    blurb: '2050 net-zero with a 2035 interim. Worth reading for how they navigate Scope 3 (food, travel) at university scale.',
    href: 'https://sustainability.yale.edu',
    category: 'peer',
  },
  {
    title: 'Phillips Exeter Academy Sustainability',
    blurb: 'Closest direct peer — a NH boarding school of comparable scale. Their facilities-side roadmap is the cleanest apples-to-apples reference.',
    href: 'https://www.exeter.edu',
    category: 'peer',
  },

  // ─── FUNDING & GRANTS ───
  {
    title: 'DOE Renew America\'s Schools',
    blurb: 'Federal grants specifically for K-12 + secondary energy + decarbonization upgrades. Capital-stack anchor for the heat-pump retrofit case.',
    href: 'https://www.energy.gov/scep/renew-americas-schools',
    category: 'funding',
  },
  {
    title: 'EPA Clean School Bus Program',
    blurb: 'Funds electric + low-emission school-bus replacement. Relevant for KUA\'s small fleet conversion.',
    href: 'https://www.epa.gov/cleanschoolbus',
    category: 'funding',
  },
  {
    title: 'NHSaves',
    blurb: 'New Hampshire utility-funded efficiency incentives — rebates for insulation, heat pumps, LED retrofits, controls. Stack with federal programs.',
    href: 'https://nhsaves.com',
    category: 'funding',
  },
  {
    title: 'IRS Elective Pay (IRA direct-pay)',
    blurb: 'Inflation Reduction Act provision letting nonprofits + schools claim refundable energy tax credits. The mechanism that makes solar economically real for us.',
    href: 'https://www.irs.gov/credits-deductions/elective-pay-and-transferability',
    category: 'funding',
  },
  {
    title: 'DSIRE — Database of State Incentives',
    blurb: 'Searchable index of every renewable + efficiency incentive by state. Filter by New Hampshire to see all stackable programs.',
    href: 'https://www.dsireusa.org',
    category: 'funding',
  },

  // ─── CALCULATORS & PLANNING TOOLS ───
  {
    title: 'EPA Greenhouse Gas Equivalencies Calculator',
    blurb: 'Translate mtCO₂e into cars-off-the-road, homes-powered, trees-grown. Source of the equivalents we surface on the homepage hero.',
    href: 'https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator',
    category: 'tool',
  },
  {
    title: 'CoolClimate Network calculators (UC Berkeley)',
    blurb: 'Household + institutional carbon footprint calculator with peer-comparison baked in. Methodologically the closest match to our /your-footprint page.',
    href: 'https://coolclimate.berkeley.edu',
    category: 'tool',
  },
  {
    title: 'NREL System Advisor Model (SAM)',
    blurb: 'Free industry-standard tool for modeling PV array economics. Use to validate the planned Whittemore + Miller solar capex.',
    href: 'https://sam.nrel.gov',
    category: 'tool',
  },
  {
    title: 'AASHE STARS Technical Manual',
    blurb: 'Methodology behind every STARS credit. Use as a reference when scoping new measurements (e.g. what counts as "renewable" for the credit).',
    href: 'https://stars.aashe.org',
    category: 'tool',
  },

  // ─── ACTION LEVERS (distributed across all 4 targets) ───
  {
    title: 'NEEP cold-climate ASHP guidance',
    blurb: 'Northeast Energy Efficiency Partnerships\' specs + product lists for cold-climate air-source heat pumps. Primary lever for the gross 2030 target.',
    href: 'https://neep.org',
    category: 'action',
    scope: 'gross',
  },
  {
    title: 'EPA Indoor Air Quality (IAQ) tools for schools',
    blurb: 'Weatherization + air-sealing guidance that doubles as efficiency capex. Cheapest mtCO₂e/yr abatement on most school campuses.',
    href: 'https://www.epa.gov/iaq-schools',
    category: 'action',
    scope: 'scope1',
  },
  {
    title: 'DOE Alternative Fuels Data Center',
    blurb: 'Fleet electrification reference — vehicle availability, charging infrastructure, total cost of ownership models.',
    href: 'https://afdc.energy.gov',
    category: 'action',
    scope: 'scope1',
  },
  {
    title: 'DOE Energy Saver — LED + lighting controls',
    blurb: 'Standard reference for LED retrofit specs + payback math. Largest near-term Scope 2 lever for the 2027 target.',
    href: 'https://www.energy.gov/energysaver',
    category: 'action',
    scope: 'scope2',
  },
  {
    title: 'ACEEE — behavioral energy programs',
    blurb: 'American Council for an Energy-Efficient Economy\'s research on dorm-level behavior change. Quantifies what the /challenge page can plausibly deliver.',
    href: 'https://www.aceee.org',
    category: 'action',
    scope: 'scope2',
  },
  {
    title: 'WRI Cool Food Pledge',
    blurb: 'Methodology + commitment framework for cutting dining-related emissions ~25%, primarily via beef-frequency reductions. Direct match for the 2028 dining target.',
    href: 'https://coolfood.org',
    category: 'action',
    scope: 'scope3',
  },
  {
    title: 'EPA Sustainable Management of Food',
    blurb: 'Food Recovery Hierarchy + waste-diversion playbook. Composting + food-waste tracking are the easiest dining-target wins after beef reductions.',
    href: 'https://www.epa.gov/sustainable-management-food',
    category: 'action',
    scope: 'scope3',
  },
  {
    title: 'Project Drawdown',
    blurb: 'Ranked global climate solutions with mt-of-CO₂ abatement potential. Useful for prioritizing which Scope 3 levers actually move the net target.',
    href: 'https://drawdown.org',
    category: 'action',
    scope: 'net',
  },

  // ─── IN-DASHBOARD RESOURCES ───
  {
    title: 'Scenarios simulator',
    blurb: 'Move four sliders (efficiency / heat pumps / solar / trees) and see whether the combined effect closes the gap to each target.',
    href: '/scenarios',
    category: 'internal',
  },
  {
    title: 'Personal footprint calculator',
    blurb: 'Five-input self-tracking tool for students. Frames KUA\'s institutional numbers in terms each visitor controls.',
    href: '/your-footprint',
    category: 'internal',
  },
  {
    title: 'Carbon math practice problems',
    blurb: 'Eight problems at intro / standard / AP difficulty using KUA-specific numbers. Printable as a worksheet.',
    href: '/carbon-math',
    category: 'internal',
  },
  {
    title: 'Methodology',
    blurb: 'Per-scope assumptions, emission factors, cross-check ranges. The audit trail behind every number on this page.',
    href: '/methodology',
    category: 'internal',
  },
  {
    title: 'Learn modules',
    blurb: 'Self-paced explainers of climate science + how it lands on a NH school campus.',
    href: '/learn',
    category: 'internal',
  },
  {
    title: 'Reduction vs offset trade-offs',
    blurb: 'How carbon credits, sequestration, and direct reductions stack against each other when closing the net-zero gap.',
    href: '/credits',
    category: 'internal',
  },
  {
    title: 'Forest sinks (annual sequestration)',
    blurb: 'The campus 1,000-acre forest pulls ~2,650 mtCO₂e/yr. Single largest lever in KUA\'s net carbon balance.',
    href: '/sinks',
    category: 'internal',
  },
];
