// Numbers moved a long way this session; two sentences describing their SCALE
// did not, and both were calibrated to a net that no longer exists.
//
// Over tasks #16 and #5 the headline net went 1,725 -> 2,566, a 49% rise: the
// forest sink was repriced to a net basis (2,650 -> 1,829) and Scope 2 moved to
// EPA's published rate (390 -> 410). Every interpolated figure followed. These
// did not, because they are adjectives:
//
//   "that gap is the single biggest reason KUA's net footprint reads near zero"
//   "KUA's net is already low because of the campus forest"
//
// The forest offsets about 42% of gross. The net that remains is 58% of gross,
// and at ~7.5 mtCO2e per student it sits ABOVE the 2.67 mean across the 35
// higher-education inventories in Valls-Val & Bovea (2021) — a comparison this
// dashboard makes itself, elsewhere, in the same breath as calling the number
// low.
//
// This is the Phase 475 lesson at the scale of the whole story: interpolation
// protects the number, not the claim about it. A reprice sweep looks for stale
// FIGURES and comes back clean while the adjectives around them rot.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { TOTAL_STUDENTS } from '../data/students.js';
import { FOOTPRINT_REFERENCE } from '../utils/personalFootprint.js';
import { reductionTargets } from '../data/targets.js';

const netMt = GROSS_MT - ANNUAL_SEQUESTRATION_MT;
const offsetShare = ANNUAL_SEQUESTRATION_MT / GROSS_MT;
const PEER_MEAN_PER_STUDENT = 2.67;   // Valls-Val & Bovea (2021), 35 inventories

describe('claims about how small the net is match how small it is', () => {
  it('the forest offsets a large minority of gross, not almost all of it', () => {
    expect(offsetShare).toBeGreaterThan(0.35);
    expect(offsetShare).toBeLessThan(0.50);
    // so the net left over is the majority of gross
    expect(netMt / GROSS_MT).toBeGreaterThan(0.5);
  });

  it('net per student sits above the published higher-education mean', () => {
    const perStudent = netMt / TOTAL_STUDENTS;
    expect(perStudent).toBeGreaterThan(PEER_MEAN_PER_STUDENT);
    // and still well under a US adult year, which is the other anchor used
    expect(perStudent).toBeLessThan(FOOTPRINT_REFERENCE.usAdultAvgMt);
  });

  it('no surface says the net reads near zero', () => {
    const FILES = [
      'pages/Sinks.js', 'pages/Sinks2.js', 'pages/Executive.js', 'pages/Faq.js',
      'components/NetEstimate.js', 'components/DailyTip.js', 'data/targets.js',
    ];
    const NEAR_ZERO = /(reads|is|sits)\s+(?:very\s+)?near(?:ly)?\s+zero|approach\w*\s+(?:net\s+)?zero|close to (?:net[- ])?zero/i;
    const offenders = [];
    for (const rel of FILES) {
      readFileSync(resolve(process.cwd(), rel), 'utf8').split('\n').forEach((line, i) => {
        if (line.trimStart().startsWith('//')) return;
        if (NEAR_ZERO.test(line)) offenders.push(`${rel}:${i + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it('the net-zero target does not call the current net low', () => {
    const net2050 = reductionTargets.find((t) => t.id === 'tg_net_2050');
    expect(net2050).toBeTruthy();
    expect(net2050.description).not.toMatch(/net is already low/i);
    // it should say what the forest actually does instead
    expect(net2050.description).toMatch(/forest/i);
  });

  it('the guard would catch the claim it was written for', () => {
    const NEAR_ZERO = /(reads|is|sits)\s+(?:very\s+)?near(?:ly)?\s+zero|approach\w*\s+(?:net\s+)?zero|close to (?:net[- ])?zero/i;
    expect(NEAR_ZERO.test("KUA's net footprint reads near zero")).toBe(true);
    expect(NEAR_ZERO.test('the forest offsets about 42% of gross, not all of it')).toBe(false);
  });
});
