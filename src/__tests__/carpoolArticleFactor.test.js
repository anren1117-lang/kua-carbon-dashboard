// The carpool knowledge article priced a car mile at 0.351 kg CO2 and cited
// "EPA Greenhouse Gases from a Typical Passenger Vehicle" for it.
//
// emissionFactors.js records that exact pairing as the thing Phase 406 fixed:
// 0.351 was carried "while citing EPA's Typical Passenger Vehicle page, which
// actually publishes ~400 g CO2/mi at 22.2 mpg. 0.351 matched neither that nor
// the Hub." The factor moved to the Hub's 0.2986 kg/vehicle-mile; the article
// kept both the retired number and the citation that never supported it.
//
// 0.351 does still live in geographicEstimates.js — but labelled there as what
// it is: 8.78 kg/gal / 25 mpg, "ASSUMPTION — not an EPA published factor".
// Stating that to a reader as what "a typical passenger car emits" is the
// defect; the internal sensitivity input is not.
//
// Everything downstream of the factor is recomputed, because the worked
// arithmetic was built on 0.351: 17.5 kg/week and 0.7 mt/year no longer follow.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { knowledgeArticles } from '../data/learningContent.js';
import { getFactorByKey } from '../data/emissionFactors.js';
import { STAFF_WORK_DAYS } from '../data/academicCalendar.js';

const article = knowledgeArticles.find((a) => a.id === 'ka_carpool_math');
const KG_PER_MILE = getFactorByKey('travel', 'passenger_car_avg').kgco2e_per_unit;

describe('the carpool article prices a mile the way the dashboard does', () => {
  it('uses the canonical factor, not the retired 0.351', () => {
    expect(article).toBeTruthy();
    expect(KG_PER_MILE).toBeCloseTo(0.2986, 4);
    expect(article.body).not.toMatch(/0\.351/);
    expect(article.body).toContain(String(KG_PER_MILE));
  });

  it('no longer cites the page that does not publish this figure', () => {
    expect(article.sourceDoc).not.toMatch(/Typical Passenger Vehicle/i);
    expect(article.sourceDoc).toMatch(/Emission Factors Hub/i);
  });

  it('the worked arithmetic follows from the factor', () => {
    // 10-mile one-way commute = 20 vehicle-miles a day; carpooling with one
    // other person halves what each of them drives.
    const soloDaily = 20 * KG_PER_MILE;
    const perPersonWeek = (soloDaily / 2) * 5;
    const perPairYear = (soloDaily * STAFF_WORK_DAYS) / 1000;

    expect(perPersonWeek).toBeCloseTo(14.93, 2);
    expect(perPairYear).toBeCloseTo(1.07, 2);

    expect(article.body).toContain(perPersonWeek.toFixed(1));
    expect(article.body).toContain(perPairYear.toFixed(1));
    // the figures 0.351 produced
    expect(article.body).not.toMatch(/17\.5\s*kg/);
    expect(article.body).not.toMatch(/0\.7\s*mtCO2e\/year/);
  });
});

// Three phases in a row fixed the same shape of defect: teaching prose that
// restates a per-unit factor the code already defines, and drifts from it.
// This is the tripwire for the car factor specifically — the one that has now
// gone stale twice (Phase 406 in the factor table, Phase 469 in this article).
//
// Matched on CONTEXT, not proximity, for the reason proseFigures.test.js gives:
// a number close to 0.2986 proves nothing, but a sentence saying "N kg per
// mile" is claiming to BE the car factor.
describe('no prose file states a car per-mile factor of its own', () => {
  const PROSE_FILES = [
    'pages/Faq.js', 'pages/CarbonMath.js', 'components/DailyTip.js',
    'components/LearnAgent.js', 'data/learningContent.js', 'data/lessonLibrary.js',
  ];
  const CLAIM = /(\d+\.\d+)\s*kg\s*(?:CO2e?|CO₂e?)?\s*(?:per|\/)\s*(?:vehicle-|passenger-)?mile/gi;

  it('every stated per-mile figure equals the canonical factor', () => {
    const offenders = [];
    for (const rel of PROSE_FILES) {
      const text = readFileSync(resolve(process.cwd(), rel), 'utf8');
      text.split('\n').forEach((line, i) => {
        if (line.trimStart().startsWith('//')) return;   // comments explain, they do not teach
        for (const m of line.matchAll(CLAIM)) {
          if (Math.abs(Number(m[1]) - KG_PER_MILE) > 0.0005) {
            offenders.push(`${rel}:${i + 1} states ${m[1]} kg/mile, canonical is ${KG_PER_MILE}`);
          }
        }
      });
    }
    expect(offenders).toEqual([]);
  });

  it('the sweep actually fires on the figure this phase retired', () => {
    // negative control: a guard that cannot catch the defect proves nothing
    const defect = 'A typical passenger car emits about 0.351 kg CO2 per mile.';
    const hit = [...defect.matchAll(CLAIM)].some((m) => Math.abs(Number(m[1]) - KG_PER_MILE) > 0.0005);
    expect(hit).toBe(true);
    const fixed = 'A typical passenger car emits about 0.2986 kg CO2e per vehicle-mile.';
    const miss = [...fixed.matchAll(CLAIM)].some((m) => Math.abs(Number(m[1]) - KG_PER_MILE) > 0.0005);
    expect(miss).toBe(false);
  });
});
