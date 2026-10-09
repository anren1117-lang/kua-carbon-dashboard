// The annual report goes to a board, and it has now been wrong about peers
// twice — in opposite directions.
//
//   v1  "Peer residential schools that report figures publicly cluster between
//        6 and 10 ... KUA's lower number is largely a function of measuring our
//        forest." Compared KUA's NET to peer GROSS, and called peers published.
//
//   v2  "On the like-for-like measure KUA is 13.4, ABOVE every one of them."
//        Correct about the boundary, but it read a STRICTER ranking off the
//        SAME four numbers, two of which carry the note "ESTIMATED SHAPE. We
//        did not locate a published inventory ... and did not research it
//        directly." A ranking is not available from figures nobody researched,
//        in either direction. v2 was the more confident error.
//
// v3 states the boundary arithmetic, which needs no peer at all, and declines
// to rank.
//
// AND THIS TEST WAS ITSELF THE PROBLEM. The v2 commit claimed "the test asserts
// no per-student literal survives in the paragraph". It did not. A critic
// reinjected the original defect twice and all seven assertions passed:
//   - the literal regex required a decimal point, and the real defect was
//     integer-valued ("between 6 and 10");
//   - the paragraph was located with indexOf and sliced without checking for
//     -1, so any reword made the slice empty and the assertion vacuous.
// Both are fixed below, and both have a control that fails on the old text.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BOARDING_PEER_BAND, PEER_USE_CAVEAT } from '../data/peerSchools.js';
import { GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { TOTAL_STUDENTS } from '../data/students.js';

const src = readFileSync(resolve(process.cwd(), 'pages/AnnualReport.js'), 'utf8');
const grossPer = GROSS_MT / TOTAL_STUDENTS;
const netPer = (GROSS_MT - ANNUAL_SEQUESTRATION_MT) / TOTAL_STUDENTS;

// Any per-student quantity, integer OR decimal. The v1 defect was "6 and 10".
const PER_STUDENT_LITERAL = /\b\d{1,2}(\.\d)?\s*mtCO₂e\s*\/\s*student/i;
// Ranking vocabulary of any kind, in either direction.
const RANKING_CLAIM = /above every|below every|lower than (its |our )?peers|ahead of (its|our) peers|outperform|cluster between|(lower|higher) (number|figure) is/i;

/** Slice a paragraph, refusing to return an empty string on a missed anchor. */
function paragraphFrom(text, anchor) {
  const i = text.indexOf(anchor);
  expect(i, `anchor not found — the test would otherwise pass vacuously: ${anchor}`).toBeGreaterThan(-1);
  const j = text.indexOf('</p>', i);
  expect(j).toBeGreaterThan(i);
  return text.slice(i, j);
}

describe('the annual report states the boundary and declines to rank', () => {
  it('the underlying situation is real', () => {
    // net below the band, gross above it — both true, which is exactly why
    // quoting either one alone is a choice rather than a finding
    expect(netPer).toBeLessThan(Number(BOARDING_PEER_BAND.minGrossPerStudent));
    expect(grossPer).toBeGreaterThan(Number(BOARDING_PEER_BAND.maxGrossPerStudent));
  });

  it('the peer figures cannot support a ranking, and the data says so', () => {
    expect(BOARDING_PEER_BAND.anyPublishPerStudent).toBe(false);
    expect(BOARDING_PEER_BAND.anyQuantifySinks).toBe(false);
    expect(PEER_USE_CAVEAT).toMatch(/cannot rank/i);
  });

  it('so the report makes no ranking claim, in either direction', () => {
    const para = paragraphFrom(src, 'That net figure is not evidence');
    expect(para).not.toMatch(RANKING_CLAIM);
    expect(src).not.toMatch(/above every one of them/i);
    expect(src).not.toMatch(/KUA's lower number/);
  });

  it('it names the SECOND boundary, which the sink framing hid', () => {
    // the gross gap is Scope 3 coverage, not the forest: KUA 8.0 against
    // peer shapes of 3.5-4.5, while Scope 1+2 is comparable
    expect(src).toContain('kuaScope3PerStudent');
    expect(src).toContain('kuaScope12PerStudent');
    expect(Number(BOARDING_PEER_BAND.kuaScope12PerStudent))
      .toBeLessThan(Number(BOARDING_PEER_BAND.maxScope12PerStudent) + 0.5);
  });

  it('no per-student figure is typed — integer or decimal', () => {
    const para = paragraphFrom(src, 'That net figure is not evidence');
    expect(para).not.toMatch(PER_STUDENT_LITERAL);
  });

  it('the literal guard catches BOTH defects it missed before', () => {
    // 1a: the original was integer-valued and slipped a decimal-only regex
    expect(PER_STUDENT_LITERAL.test('cluster between 6 and 10 mtCO₂e/student/year')).toBe(true);
    expect(PER_STUDENT_LITERAL.test('KUA is 13.4 mtCO₂e/student')).toBe(true);
    expect(PER_STUDENT_LITERAL.test('{(GROSS / TOTAL_STUDENTS).toFixed(1)} mtCO₂e/student')).toBe(false);
    // 1b: a missed anchor must fail, not slice to ''
    expect(() => paragraphFrom('no such text here', 'That net figure is not evidence')).toThrow();
  });

  it('the ranking guard catches the wording of both previous versions', () => {
    expect(RANKING_CLAIM.test("KUA's lower number is largely a function of measuring our forest")).toBe(true);
    expect(RANKING_CLAIM.test('KUA is 13.4 mtCO₂e/student, above every one of them')).toBe(true);
    expect(RANKING_CLAIM.test('Peer schools cluster between 6 and 10')).toBe(true);
    expect(RANKING_CLAIM.test('What the forest changes is KUA’s own figure')).toBe(false);
  });

  it('the band renders at one decimal, like the chart', () => {
    // "7.8 sits below 8" read as a rounding artefact next to a 13.4
    for (const k of ['minGrossPerStudent', 'maxGrossPerStudent', 'kuaScope3PerStudent']) {
      expect(BOARDING_PEER_BAND[k], k).toMatch(/^\d+\.\d$/);
    }
  });
});
