// The annual report — the one document that goes to a board — said KUA
// compares well, and the comparison was backwards.
//
// It read: "roughly 7.8 per enrolled student. Peer residential schools that
// report figures publicly cluster between 6 and 10 mtCO2e/student/year; KUA's
// lower number is largely a function of measuring our forest, which most peers
// don't."
//
// Three things wrong, in rising order of seriousness:
//
//  1. The band. This repo's four boarding-secondary peers span 8.0-10.0, not
//     6-10.
//
//  2. The provenance. "that report figures publicly" — none of them does.
//     Every peer row carries provenance 'estimated' and a note beginning
//     "ESTIMATED SHAPE, not a published figure", because these schools publish
//     targets and plans, not per-student inventories. /scope-3 already says
//     so; the board-facing document contradicted it.
//
//  3. The direction, which is the real problem. KUA's NET per student (7.8) was
//     set against peer GROSS (8.0-10.0, every one with sinks: 0). On the
//     like-for-like measure KUA is 13.4 mtCO2e/student — ABOVE all four. The
//     entire "lower number" is KUA subtracting a forest sink that no peer
//     counts, which is a boundary difference and not performance.
//
// LearnAgent teaches exactly this error as the Valls-Val & Bovea finding, with
// a quiz whose correct answer is that two identical campuses publish 7.8 and
// 13.4 depending only on whether sinks are subtracted. The annual report then
// made the error the lesson warns about.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BOARDING_PEER_BAND } from '../components/PeerComparison.js';
import { GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { TOTAL_STUDENTS } from '../data/students.js';

const src = readFileSync(resolve(process.cwd(), 'pages/AnnualReport.js'), 'utf8');
const grossPer = GROSS_MT / TOTAL_STUDENTS;
const netPer = (GROSS_MT - ANNUAL_SEQUESTRATION_MT) / TOTAL_STUDENTS;

describe('the annual report compares like with like', () => {
  it('the situation it describes is real: net below, gross above', () => {
    expect(netPer).toBeLessThan(BOARDING_PEER_BAND.minGrossPerStudent);
    expect(grossPer).toBeGreaterThan(BOARDING_PEER_BAND.maxGrossPerStudent);
  });

  it('the peers quantify no sinks, which is what makes the comparison unequal', () => {
    expect(BOARDING_PEER_BAND.anyQuantifySinks).toBe(false);
    expect(BOARDING_PEER_BAND.count).toBeGreaterThanOrEqual(4);
  });

  it('the report states the gross comparison, not only the flattering one', () => {
    expect(src).toMatch(/above every one of them/i);
    expect(src).toMatch(/like-for-like/i);
    expect(src).toContain('GROSS / TOTAL_STUDENTS');
  });

  it('it no longer claims the peers publish what they do not', () => {
    expect(src).not.toMatch(/report figures publicly/);
    expect(src).toMatch(/estimated shapes|publishes a per-student inventory/i);
  });

  it('the band is derived, not typed — 6 to 10 was never the data', () => {
    expect(src).not.toMatch(/between 6 and 10/);
    expect(src).toContain('BOARDING_PEER_BAND.minGrossPerStudent');
    expect(src).toContain('BOARDING_PEER_BAND.maxGrossPerStudent');
  });

  it('it does not read as KUA performing better', () => {
    expect(src).not.toMatch(/KUA's lower number/);
    expect(src).toMatch(/mistake to read that as KUA performing better/i);
  });

  it('the claim survives a reprice, because every figure is derived', () => {
    // nothing in the paragraph may hardcode a per-student value
    const para = src.slice(src.indexOf('That net figure sits below'), src.indexOf('</p>', src.indexOf('That net figure sits below')));
    expect(para).not.toMatch(/\b\d{1,2}\.\d\s*mtCO₂e\/student/);
  });
});
