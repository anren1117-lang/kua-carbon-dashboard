// Two composer bugs that only appear once real data arrives — found by
// entering a single day-student row into the live database and reading the
// Scope 3 breakdown back.
//
// 1. DINING GOT THE PURCHASED-GOODS FIGURE. The placeholder lookup was
//    `source.toLowerCase().includes(match)`, and 'Purchased goods
//    (non-dining)' CONTAINS "dining". Array.find returns the first hit and
//    purchased goods is first in the array, so placeholderRow('dining')
//    resolved to the 1,315 mt row. Dining reported 1,315 instead of 235 — a
//    1,080 mt overstatement of Scope 3 — from the moment any Scope 3 record
//    existed, because only then does the composer run instead of the
//    straight placeholder path. A dashboard that is correct until you enter
//    data and wrong afterwards.
//
// 2. WASTE REPORTED 0 WHILE QUOTING THE 5 mt METHOD. Every component does
//    `measured ? live : placeholder`. The waste row used the live sum
//    unconditionally for `mt` while still falling back to the placeholder for
//    `method`, so with no waste rows it rendered 0 mt beside the placeholder's
//    own description of how 5 mt was derived.
//
// Both are the same shape: a fallback that is applied to one field of a row
// and not another, or to the wrong row entirely.

import { describe, it, expect } from 'vitest';
import { composeScope3FromRecords, WASTE_FACTORS_MT_PER_TON } from '../data/scopeTotals.js';

const row = (c, name) => c.breakdown.find((b) => b.source.includes(name));
const DAY = [{ zip_code: '03753', school_year: '2026-2027' }];

describe('placeholder components survive the arrival of unrelated data', () => {
  it('dining keeps its own figure when a day student is entered', () => {
    const base = composeScope3FromRecords({});
    const live = composeScope3FromRecords({ dayStudents: DAY });
    expect(row(base, 'Dining').mt).toBe(235);
    expect(row(live, 'Dining').mt).toBe(235);           // was 1315
    expect(row(live, 'Dining').provenance).toBe('estimated');
  });

  it('dining is never handed the purchased-goods figure', () => {
    const live = composeScope3FromRecords({ dayStudents: DAY });
    expect(row(live, 'Dining').mt).not.toBe(row(live, 'Purchased goods').mt);
  });

  it('the substring that caused it is still there — so the fix must not rely on it', () => {
    // 'Purchased goods (non-dining)' genuinely contains "dining"; the lookup
    // has to be anchored rather than the label renamed.
    const base = composeScope3FromRecords({});
    const goods = row(base, 'Purchased goods');
    expect(goods.source.toLowerCase()).toContain('dining');
    expect(goods.source.toLowerCase().startsWith('dining')).toBe(false);
  });

  it('waste keeps its placeholder figure when no waste rows exist', () => {
    const live = composeScope3FromRecords({ dayStudents: DAY });
    const w = row(live, 'Waste');
    expect(w.mt).toBe(5);                                 // was 0
    expect(w.provenance).toBe('estimated');
    // and the number no longer contradicts the method text beside it
    expect(w.method).toMatch(/420 people/);
  });

  it('waste still composes from real rows when they arrive', () => {
    const live = composeScope3FromRecords({
      dayStudents: DAY,
      wasteRecords: [{ waste_type: 'Landfill', amount: 12, unit: 'tons' }],
    });
    const w = row(live, 'Waste');
    expect(w.provenance).toBe('measured');
    expect(w.mt).toBe(Math.round(12 * WASTE_FACTORS_MT_PER_TON.Landfill));   // ~7
  });

  it('student travel holds its placeholder when only waste arrives', () => {
    // The third instance of the same bug, found by proving the live loop with
    // a single 1-ton waste row: Scope 3 fell 2,635 -> 1,871, and 760 of that
    // was student travel being reported as 0 on the strength of data about
    // something else entirely.
    const live = composeScope3FromRecords({
      wasteRecords: [{ waste_type: 'Landfill', amount: 1, unit: 'tons' }],
    });
    const travel = row(live, 'Student travel');
    expect(travel.mt).toBe(760);
    expect(travel.provenance).toBe('estimated');
  });

  it('one row in one table moves one line, not the whole inventory', () => {
    const base = composeScope3FromRecords({});
    const oneWaste = composeScope3FromRecords({
      wasteRecords: [{ waste_type: 'Landfill', amount: 1, unit: 'tons' }],
    });
    // waste 5 -> 1 is the only change, so the total moves by exactly 4
    expect(base.totalMt - oneWaste.totalMt).toBe(4);
  });

  it('only the component with data moves; the rest hold their placeholders', () => {
    const base = composeScope3FromRecords({});
    const live = composeScope3FromRecords({ dayStudents: DAY });
    for (const name of ['Purchased goods', 'Dining', 'Upstream', 'Commuting', 'Waste']) {
      expect(row(live, name).mt, name).toBe(row(base, name).mt);
    }
    // student travel is the one that should change
    expect(row(live, 'Student travel').provenance).toBe('measured');
    expect(row(live, 'Student travel').mt).not.toBe(row(base, 'Student travel').mt);
  });
});
