// What KUA says in public, beside what this dashboard measures.
//
// Every figure here was read off a KUA page or its contractor's project page
// and is quoted verbatim, because the point of the comparison is lost if the
// claim is paraphrased into agreement. Three of them disagree with the meters,
// and in each case the disagreement is informative rather than embarrassing:
// it points at a specific thing someone on campus can go and check.
//
// This is the reverse of the usual direction. Elsewhere the dashboard treats
// published figures as the authority and its own estimates as provisional —
// the campus map settled the dorm registry in Phase 490, kua.org settled the
// boarding percentage. Here the meters are the better evidence for two of the
// three, and a marketing page is the better evidence for the third. Which
// source wins is a question per claim, not a rule.

import { SOLAR_ANNUAL_KWH, solarSites } from './renewables.js';
import { GRID_MIX_TOTAL_KWH } from './gridMix.js';

/**
 * @typedef {Object} PublishedClaim
 * @property {string} id
 * @property {string} claim        Verbatim quote from the source
 * @property {string} source       Where it was published
 * @property {string} url
 * @property {string} measured     What this repo's data says instead
 * @property {'agrees'|'diverges'|'unconfirmed'} status
 * @property {string} reading      What the gap most likely means
 * @property {string} settledBy    The specific check that would resolve it
 */

/** @type {PublishedClaim[]} */
export const PUBLISHED_CLAIMS = [
  {
    id: 'solar_capacity',
    claim: "KUA's 220kw solar energy plant, comprised of panels on roofs and in fields, is a central "
      + 'part of our commitment to environmental sustainability generating around 16% of campus '
      + 'electricity needs.',
    source: 'KUA — Sustainability & Outdoor Life',
    url: 'https://www.kua.org/student-life/sustainability-and-the-outdoors',
    // Lazy: every number here is computed in SOLAR_RECONCILIATION below, so
    // the sentence cannot drift from the figures it describes.
    get measured() {
      const r = SOLAR_RECONCILIATION;
      return `${r.meteredOperationalKw} kW across the arrays that appear in the BMS export, `
        + `producing a derived ${r.derivedAnnualKwh.toLocaleString()} kWh/yr — about `
        + `${r.derivedSharePct}% of campus electricity.`;
    },
    status: 'diverges',
    reading:
      "The two published numbers corroborate EACH OTHER: 16% of campus needs works out near 210,000 "
      + 'kWh, which is roughly 950 kWh/kW/yr for a 220 kW plant — ordinary for New Hampshire rooftop. '
      + 'So the published pair is internally consistent and physically plausible, and this repo is the '
      + 'outlier. Renewables.js already explains most of why: of three solar feeds in the BMS export, '
      + 'one reports real generation, one is stuck at a negative cumulative value and one reads as a '
      + 'net consumer (likely a backwards CT). What the published figure adds is that the shortfall is '
      + 'not only meter health — 220 kW of plant against 60 kW of metered array means there are panels '
      + 'on this campus that the BMS export does not reach at all.',
    settledBy: 'the inverter inventory, and a CT check on the two bad feeds',
  },
  {
    id: 'wind_operating',
    claim: 'A senior capstone project brought a wind turbine to Kimball Union — a 15kW turbine erected '
      + 'in spring 2013 that continues to generate electricity year-round.',
    source: 'KUA — Sustainability & Outdoor Life',
    url: 'https://www.kua.org/student-life/sustainability-and-the-outdoors',
    measured: 'The turbine is carried in the asset record with a status, a last-operational date and '
      + 'zero current output. /renewables has a standing explainer titled "Why the broken wind turbine '
      + 'is still on the dashboard".',
    status: 'diverges',
    reading:
      'Here the dashboard is the better source and the website is the stale one. A page that says a '
      + 'turbine "continues to generate electricity year-round" is a claim a school board or a '
      + 'prospective family may repeat, so it is worth knowing it no longer holds. Either the asset '
      + 'record is out of date or the webpage is, and only one of them is being read by the public.',
    settledBy: 'a facilities check on the turbine, and an edit to whichever source is wrong',
  },
  {
    id: 'geothermal_kilton_welch',
    claim: 'The renovations emphasize energy efficiency, incorporating a geothermal heating and cooling '
      + "system to support KUA's commitment to a greener, more sustainable future.",
    source: 'ReArch Company — KUA student and faculty housing project',
    url: 'https://rearchconstruction.com/projects/kimball-union-academy/',
    measured: "This repo models every dorm's heat as oil and propane at the NH-CZ6 dorm intensity, "
      + 'including Kilton and Welch, and renewables.js records geothermal as feasibility-stage.',
    status: 'unconfirmed',
    reading:
      'If the geothermal system is in service, the heat in those two buildings is electric and is '
      + 'ALREADY inside the metered electricity — so the modelled fossil heat added for them is a '
      + 'double count, and the campus Scope 1 heating line is overstated by the same amount. It would '
      + 'also explain the anomaly that prompted this: Kilton draws 3.5 kWh/sqft where other dorms run '
      + '1.1-2.3. What argues against acting on it yet is that the source is a contractor page, KUA\'s '
      + "own sustainability page does not mention geothermal, and Welch's electricity is NOT elevated "
      + '(1.9 kWh/sqft) — which a shared plant metered at Kilton would explain, but so would the system '
      + 'not being in service. A correction that SHRINKS a footprint deserves more scepticism than one '
      + 'that grows it, so the magnitude is published here and nothing has been moved.',
    settledBy: 'confirmation from facilities that the geothermal loop serves both halls and is running',
  },
];

export const DIVERGING_CLAIMS = PUBLISHED_CLAIMS.filter((c) => c.status === 'diverges');
export const UNCONFIRMED_CLAIMS = PUBLISHED_CLAIMS.filter((c) => c.status === 'unconfirmed');

/** Published solar nameplate, for comparison against the metered arrays. */
export const PUBLISHED_SOLAR_KW = 220;
/** Published share of campus electricity KUA attributes to that plant. */
export const PUBLISHED_SOLAR_SHARE_PCT = 16;
/** Published wind nameplate. */
export const PUBLISHED_WIND_KW = 15;

const operationalKw = solarSites
  .filter((x) => x.status === 'operational')
  .reduce((t, x) => t + (x.capacityKwDc || 0), 0);

// Share of total campus electricity CONSUMPTION — purchased from the grid plus
// whatever is generated on site — which is what "campus electricity needs"
// means. Using purchased alone would flatter the on-site share slightly.
const totalConsumptionKwh = GRID_MIX_TOTAL_KWH + SOLAR_ANNUAL_KWH;

/** The published solar claim against the metered one, every figure derived. */
export const SOLAR_RECONCILIATION = {
  publishedKw: PUBLISHED_SOLAR_KW,
  meteredOperationalKw: operationalKw,
  capacityRatio: +(PUBLISHED_SOLAR_KW / operationalKw).toFixed(1),

  publishedSharePct: PUBLISHED_SOLAR_SHARE_PCT,
  derivedSharePct: +((SOLAR_ANNUAL_KWH / totalConsumptionKwh) * 100).toFixed(1),

  derivedAnnualKwh: SOLAR_ANNUAL_KWH,
  // What the published 16% share implies in kWh, solving for S in
  // S = 0.16 x (purchased + S). Stated so the two published numbers can be
  // checked against each other rather than taken on trust.
  impliedPublishedKwh: Math.round(
    (GRID_MIX_TOTAL_KWH * (PUBLISHED_SOLAR_SHARE_PCT / 100))
    / (1 - PUBLISHED_SOLAR_SHARE_PCT / 100),
  ),
  get impliedPublishedYieldKwhPerKw() {
    return Math.round(this.impliedPublishedKwh / PUBLISHED_SOLAR_KW);
  },
  // NH rooftop runs roughly 1,100-1,300 kWh/kW/yr; a published pair that lands
  // in that band is self-consistent, which is what makes this repo the outlier.
  nhTypicalYieldKwhPerKw: 1300,
  get derivedYieldKwhPerKw() {
    return Math.round(SOLAR_ANNUAL_KWH / operationalKw);
  },
};
