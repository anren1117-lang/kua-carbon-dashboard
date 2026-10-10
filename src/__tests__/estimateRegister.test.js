// The estimate register exists because the dashboard was quietly dishonest:
// 22 data rows carried provenance:'estimated' and a method string, the
// methodology page did not contain the word "estimated", and the reporting
// principles asserted "Measured values are visually distinguished from
// estimates throughout the UI" — which was simply not true.
//
// Two of those six "principles" described a specification in the present tense.
// That is the flattering-claim failure: a sentence nobody checks because it
// says the thing you want to be true.
//
// These tests hold the register to being complete, derived, and operational.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ESTIMATE_REGISTER, MODELLED_SHARE_OF_GROSS, REGISTER_RECONCILIATION,
  REGISTER_COUNTS, WHOLLY_MODELLED_SCOPES, TIERS, TIER_LABEL, TIER_MEANING,
  NET_ESTIMATE_CAVEAT, SINK_SHARE_OF_GROSS, ESTIMATE_CAVEAT,
} from '../data/estimateRegister.js';
import { GROSS_MT, SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT } from '../data/scopeTotals.js';

const methodologySrc = readFileSync(resolve(process.cwd(), 'pages/Methodology.js'), 'utf8');

describe('the estimate register is complete', () => {
  it('accounts for the whole gross figure, within per-row rounding', () => {
    // The flag must FOLLOW the arithmetic. Hardcoding `reconciles: true` would
    // silently suppress the red warning banner the component renders when the
    // register does not add up.
    //
    // And comparing it to `Math.abs(unaccountedMt) <= 25` DOES NOT CATCH THAT —
    // a control proved it: when the computed answer is also true, true === true
    // either way. Agreement cannot distinguish derived from typed, so the
    // derivation is asserted on the source, as for MODELLED_SHARE_OF_GROSS.
    const regSrc = readFileSync(resolve(process.cwd(), 'data/estimateRegister.js'), 'utf8');
    expect(regSrc).toMatch(/reconciles:\s*Math\.abs\(/);
    expect(regSrc).not.toMatch(/reconciles:\s*(true|false)\b/);
    expect(REGISTER_RECONCILIATION.reconciles).toBe(true);
    expect(Math.abs(REGISTER_RECONCILIATION.unaccountedMt)).toBeLessThanOrEqual(25);
    // and it is reconciling against the real scope sum, not a copy of itself
    expect(REGISTER_RECONCILIATION.scopeSumMt)
      .toBeCloseTo(SCOPE1_TOTAL_MT + SCOPE2_TOTAL_MT + SCOPE3_TOTAL_MT, 5);
  });

  it('covers every scope plus the sink', () => {
    const scopes = new Set(ESTIMATE_REGISTER.map((e) => e.scope));
    ['Scope 1', 'Scope 2', 'Scope 3', 'Sink'].forEach((s) => expect([...scopes]).toContain(s));
  });

  it('every entry states a method and what would replace it', () => {
    const thin = ESTIMATE_REGISTER.filter(
      (e) => !e.method || e.method.length < 40 || !e.retiredBy || e.retiredBy.length < 20,
    );
    expect(thin.map((e) => e.id)).toEqual([]);
  });

  it('every entry carries a known tier with a label and a meaning', () => {
    ESTIMATE_REGISTER.forEach((e) => {
      expect(TIERS, e.id).toContain(e.tier);
      expect(TIER_LABEL[e.tier]).toBeTruthy();
      expect(TIER_MEANING[e.tier]).toBeTruthy();
    });
  });

  it('entry ids are unique — a duplicate key silently drops a row from the table', () => {
    const ids = ESTIMATE_REGISTER.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('the register is derived, not transcribed', () => {
  it('the modelled share is computed from the current gross', () => {
    // VACUOUS AS FIRST WRITTEN, the same way its sibling in globalFigures was:
    // it rebuilt the sumOf filter and divided by GROSS_MT, so both sides ran the
    // same formula. Replacing the export with a literal 91 left all 16 tests and
    // the full suite green. The source text is what carries the claim.
    const src = readFileSync(resolve(process.cwd(), 'data/estimateRegister.js'), 'utf8');
    expect(src).toMatch(/MODELLED_SHARE_OF_GROSS\s*=\s*\n?\s*GROSS_MT\s*>\s*0/);
    expect(src).toMatch(/Math\.round\(\(MODELLED_MT \/ GROSS_MT\)/);
    expect(src).not.toMatch(/MODELLED_SHARE_OF_GROSS\s*=\s*\d/);
    // and the value agrees with the data
    const modelled = ESTIMATE_REGISTER
      .filter((e) => e.tier === 'modelled' && e.mt > 0)
      .reduce((s, e) => s + e.mt, 0);
    expect(MODELLED_SHARE_OF_GROSS).toBe(Math.round((modelled / GROSS_MT) * 100));
  });

  it('names the wholly-modelled scopes by checking, not by remembering', () => {
    WHOLLY_MODELLED_SCOPES.forEach((s) => {
      const rows = ESTIMATE_REGISTER.filter((e) => e.scope === s);
      expect(rows.length).toBeGreaterThan(0);
      expect(rows.every((e) => e.tier === 'modelled')).toBe(true);
    });
    // Scope 2 has instrument data behind it, so it must NOT be in that list
    expect(WHOLLY_MODELLED_SCOPES).not.toContain('Scope 2');
  });

  it('the sink is disclosed separately, because the gross share omits it', () => {
    // the sink is the largest single modelled quantity and the whole
    // gross-to-net difference; a gross-only caveat would understate the net
    const sink = ESTIMATE_REGISTER.find((e) => e.scope === 'Sink');
    expect(sink.tier).toBe('modelled');
    expect(Math.abs(sink.mt)).toBeGreaterThan(
      Math.max(...ESTIMATE_REGISTER.filter((e) => e.mt > 0).map((e) => e.mt)),
    );
    expect(NET_ESTIMATE_CAVEAT).toMatch(/more uncertain than the gross/i);
    expect(NET_ESTIMATE_CAVEAT).toContain(String(SINK_SHARE_OF_GROSS));
  });

  it('the sink figure carries no float noise into the UI', () => {
    // `Number.isInteger(mt * 10)` looked like the right check and is VACUOUS:
    // -1828.8000000000002 * 10 rounds to exactly -18288, so the guard passed
    // against the very value it was written to catch. A reinjection control
    // caught that. The rendered string is the thing that matters, so assert on
    // it: at most one decimal place, which is what the table shows.
    const noisy = ESTIMATE_REGISTER
      .filter((e) => typeof e.mt === 'number')
      .filter((e) => (String(Math.abs(e.mt)).split('.')[1] || '').length > 1)
      .map((e) => `${e.id}=${e.mt}`);
    expect(noisy).toEqual([]);
  });

  it('that float guard is not vacuous — it catches the raw sink value', () => {
    const decimals = (n) => (String(Math.abs(n)).split('.')[1] || '').length;
    expect(decimals(-1828.8000000000002)).toBeGreaterThan(1);   // the real defect
    expect(decimals(-1829)).toBe(0);
    expect(decimals(409.9)).toBe(1);                            // Scope 2, legitimately
    // and the check the control defeated, kept here as evidence
    expect(Number.isInteger(-1828.8000000000002 * 10)).toBe(true);
  });
});

describe('the methodology page actually discloses it', () => {
  it('renders the register', () => {
    expect(methodologySrc).toContain('<EstimateRegister />');
    expect(methodologySrc).toMatch(/What is estimated, and how/);
  });

  it('no longer claims estimates are visually distinguished throughout the UI', () => {
    // the exact sentence that was false
    expect(methodologySrc).not.toMatch(/'Measured values are visually distinguished from estimates throughout the UI\.'/);
    expect(methodologySrc).not.toMatch(/'Every numeric value links back to its source record/);
  });

  it('the remaining unfixed gap is stated as unfixed', () => {
    expect(methodologySrc).toMatch(/NOT YET TRUE/);
  });

  it('the page mentions estimation at all — it previously did not', () => {
    expect(methodologySrc.toLowerCase()).toContain('estimate register');
  });
});

describe('the caveat sentences are usable on their own', () => {
  it('the gross caveat carries a figure and the metered exception', () => {
    expect(ESTIMATE_CAVEAT).toContain(`${MODELLED_SHARE_OF_GROSS}%`);
    expect(ESTIMATE_CAVEAT).toMatch(/electricity is the one metered series/i);
  });

  it('most of the gross figure really is modelled — the claim is not alarmist', () => {
    // if this ever drops below half, the caveat's framing needs rewriting
    expect(MODELLED_SHARE_OF_GROSS).toBeGreaterThan(50);
    expect(MODELLED_SHARE_OF_GROSS).toBeLessThanOrEqual(100);
    expect(REGISTER_COUNTS.modelled).toBeGreaterThan(REGISTER_COUNTS.measured);
  });
});
