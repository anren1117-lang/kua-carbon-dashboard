// Knowledge articles for the Carbon Learning Chatbot. Mock content cards
// keyed by topic, with explicit reading levels. The chatbot answer engine
// (rule-based v1) selects an article by intent + reading level.
//
// Headline figures are composed from the same canonical sources the rest
// of the dashboard imports, so the chatbot cannot quote a stale gross or
// net once the underlying data wiring updates.

import { SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT, GROSS_MT } from './scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from './sinks.js';
import { TOTAL_STUDENTS } from './students.js';

const grossMt   = Math.round(GROSS_MT);
const sinksMt   = Math.round(ANNUAL_SEQUESTRATION_MT);
const netMt     = grossMt - sinksMt;
const perStud   = (netMt / TOTAL_STUDENTS).toFixed(1);
const fmt       = (n) => Math.round(n).toLocaleString();

/**
 * @typedef {Object} KnowledgeArticle
 * @property {string} id
 * @property {string} title
 * @property {'climate_basics'|'scopes'|'energy'|'food'|'transport'|'waste'|'sinks'|'kua_specific'|'action'} topic
 * @property {'novice'|'intermediate'|'advanced'} readingLevel
 * @property {string[]} keywords
 * @property {string} body
 * @property {string=} sourceDoc
 */

/** @type {KnowledgeArticle[]} */
export const knowledgeArticles = [
  {
    id: 'ka_what_is_footprint',
    title: 'What is a carbon footprint?',
    topic: 'climate_basics',
    readingLevel: 'novice',
    keywords: ['footprint', 'co2', 'measure', 'emissions'],
    body: 'A carbon footprint is the total amount of greenhouse gases — measured in metric tons of CO2-equivalent — that a person, a school, or an organization is responsible for over a year. We measure it so we can reduce it: you cannot manage what you do not measure.',
    sourceDoc: 'GHG Protocol Corporate Standard',
  },
  {
    id: 'ka_scopes',
    title: 'Scope 1, 2, 3 — what they mean',
    topic: 'scopes',
    readingLevel: 'intermediate',
    keywords: ['scope', 'scope 1', 'scope 2', 'scope 3'],
    body: 'Scope 1 = direct emissions you control (heating fuel, fleet vehicles, refrigerant leaks). Scope 2 = indirect emissions from purchased electricity. Scope 3 = everything else upstream and downstream — student travel, food procurement, waste, commuting. KUA tracks all three.',
    sourceDoc: 'GHG Protocol Corporate Standard',
  },
  {
    id: 'ka_beef_emissions',
    title: 'Why does beef have higher emissions than chicken?',
    topic: 'food',
    readingLevel: 'intermediate',
    keywords: ['beef', 'chicken', 'food', 'meat'],
    body: 'Cattle are ruminants that produce methane during digestion (a greenhouse gas 28× as potent as CO2 over 100 years). They also need more land, feed, and water per pound of meat than chickens. The result: beef averages around 60 kg CO2e per kg, while chicken averages around 6 — about 10× lower.',
    sourceDoc: 'Poore & Nemecek 2018',
  },
  {
    id: 'ka_dorm_actions',
    title: 'How can dorms reduce electricity?',
    topic: 'action',
    readingLevel: 'novice',
    keywords: ['dorm', 'electricity', 'reduce', 'save'],
    body: 'Practical dorm actions: turn off lights when leaving, unplug chargers when not in use, lower the thermostat 1-2°F in winter, take shorter hot showers, and use cold-water laundry. Each is small individually but adds up across the year and across all dorms.',
  },
  {
    id: 'ka_kua_emissions',
    title: 'How big is KUA\'s carbon footprint?',
    topic: 'kua_specific',
    readingLevel: 'intermediate',
    keywords: ['kua', 'kimball union', 'school', 'footprint'],
    body: `KUA's preliminary estimate is about ${fmt(grossMt)} mtCO2e gross emissions per year — roughly ${fmt(SCOPE1_TOTAL_MT)} from heating fuel (Scope 1), ${fmt(SCOPE2_TOTAL_MT)} from purchased electricity (Scope 2), and ${fmt(SCOPE3_TOTAL_MT)} from indirect sources like student travel and food (Scope 3). The campus forest sequesters around ${fmt(sinksMt)} mtCO2e/year, leaving a net footprint near ${fmt(netMt)} mtCO2e/year. Per student that's about ${perStud} mtCO2e/year — lower than peer boarding schools largely because we measure our forest.`,
  },
  {
    id: 'ka_carpool_math',
    title: 'How much carbon does carpooling save?',
    topic: 'transport',
    readingLevel: 'intermediate',
    keywords: ['carpool', 'commute', 'driving', 'gas'],
    body: 'A typical passenger car emits about 0.351 kg CO2 per mile. If you carpool a 10-mile commute with one other person five days a week, you avoid about 17.5 kg/week of CO2 vs solo driving — roughly 0.7 mtCO2e/year per pair. Multiply across a faculty/staff body and the savings are real.',
    sourceDoc: 'EPA Greenhouse Gases from a Typical Passenger Vehicle',
  },
  {
    id: 'ka_grid_clean',
    title: 'Why is New England\'s grid relatively clean?',
    topic: 'energy',
    readingLevel: 'advanced',
    keywords: ['grid', 'electricity', 'iso-ne', 'new england'],
    body: 'ISO-NE\'s 2024 mix is roughly 51% natural gas, 23% nuclear, 12% renewables, 6% hydro, 7% imports (mostly Quebec hydro), and ~1% oil/coal. Nuclear plus hydro plus renewables plus clean imports = ~48% zero-emission. The remaining gas-dominated half makes the system-effective rate about 235 g CO2/kWh on an output basis — cleaner than the US average (~370 g/kWh) but not yet decarbonized.',
    sourceDoc: 'ISO New England 2024 System Mix',
  },
  {
    id: 'ka_what_is_offset',
    title: 'What\'s the difference between a carbon reduction and an offset?',
    topic: 'climate_basics',
    readingLevel: 'advanced',
    keywords: ['offset', 'reduction', 'credit', 'removal'],
    body: 'A reduction is when you emit less CO2 than you would have (e.g., switching to LEDs). An offset is when you pay someone else to either avoid emissions (avoidance credit) or remove existing CO2 (removal credit) on your behalf. Reductions you control are auditable; offsets vary widely in quality. Verified removal credits with permanent storage are the most credible offset class.',
  },
];
