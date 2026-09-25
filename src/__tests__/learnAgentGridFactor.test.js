// LearnAgent taught students to compute from "the ISO-NE 2024 grid emission
// factor is 643 lb CO2 per MWh" in two worked problems.
//
// scopeTotals.js:855 says, in the repo's own words: "MISLABELLED — 643.0 is
// NOT ISO-NE's 2024 rate. ISO-NE published 597 lb/MWh generation-only for
// 2024... 643 is a stale figure, most likely 2022." LearnAgent:441 states 597
// correctly, five lines before the math scenario that uses 643.
//
// Both problems were wrong, and in opposite directions:
//
//   DORM  80,000 kWh CONSUMED. That is an inventory question, so the rate is
//         the dashboard's 0.246391 kg/kWh (543 lb/MWh) = 19.7 mt. The quiz
//         taught 23.3 — 24% high.
//
//   SOLAR 245,000 kWh DISPLACED. That is a consequential question, so the
//         rate is AVERT marginal 0.489608 kg/kWh (1,079 lb/MWh) = 120 mt.
//         The quiz taught 71.5 — 40% low AND on the wrong factor class,
//         the exact distinction the heat-pump question 40 lines later gets
//         right.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { KG_PER_KWH } from '../data/gridMix.js';
import { avertAvoidedKgPerKwh } from '../data/gridMixHistory.js';

const src = readFileSync(resolve(process.cwd(), 'components/LearnAgent.js'), 'utf8');
const LB = 0.45359237;

describe('the teaching problems use the rates the dashboard publishes', () => {
  it('no scenario calls 643 the ISO-NE 2024 factor', () => {
    expect(src).not.toMatch(/ISO-NE 2024 grid (emission )?factor is 643/);
    expect(src).not.toMatch(/643 lb CO₂ ?\/ ?MWh/);
  });

  it('the dorm problem prices CONSUMPTION at the inventory rate', () => {
    const inventoryLb = Math.round((KG_PER_KWH * 1000) / LB);
    expect(inventoryLb).toBe(543);
    expect(src).toMatch(new RegExp(`${inventoryLb} lb`));
    // 80 MWh x 543 lb x 0.4536 = 19,704 kg
    const mt = (80 * inventoryLb * LB) / 1000;
    // 18.8 on the per-fuel reconstruction; 19.7 on the published rate
    // adopted in task #5.
    expect(mt).toBeCloseTo(19.7, 1);
    expect(src).toMatch(/~19\.7 mtCO₂e/);
    expect(src).not.toMatch(/~23\.3 mtCO₂e/);
  });

  it('the solar problem prices DISPLACEMENT at the marginal rate', () => {
    const marginalLb = Math.round((avertAvoidedKgPerKwh() * 1000) / LB);
    expect(marginalLb).toBe(1079);
    // 245 MWh x 1,079 lb x 0.4536 = 119,911 kg
    const mt = (245 * marginalLb * LB) / 1000;
    expect(mt).toBeCloseTo(120, 0);
    expect(src).toMatch(/~120 mtCO₂e\/yr/);
    expect(src).not.toMatch(/~71 mtCO₂e\/yr/);
  });

  it('the solar explanation names why the rate differs', () => {
    // A corrected number with no reason invites the same mistake back.
    const i = src.indexOf('avoided grid emissions from that solar');
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 1800);
    expect(block).toMatch(/margin/i);
    expect(block).toMatch(/AVERT/);
  });

  it('597 — the real ISO-NE 2024 figure — is still stated correctly', () => {
    // It was already right at :441; pin it so this fix does not disturb it.
    expect(src).toMatch(/597/);
  });
});
