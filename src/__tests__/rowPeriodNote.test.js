// @vitest-environment jsdom
//
// A fuel delivery entered today saves cleanly and never reaches a total.
//
// The published reporting period is the 2025-2026 school year
// (2025-07-01 → 2026-06-30). The Scope 1 forms default `delivery_date` to
// today(), which on 2026-10-03 is outside it. withinPeriod() then drops the
// row, composeScope1FromBills falls back to the 1,290 mt bottom-up placeholder,
// and the admin sees a green "saved" beside an unchanged number — which looks
// exactly like the app being broken. Measured:
//
//   dated 2026-03-01  ->  102 mt   measured
//   dated 2026-10-03  ->  1,290 mt estimated   (the form's own default)
//   no date           ->  102 mt   measured
//
// PeriodNote already warned about the school-year LABEL on the Scope 3 forms.
// Nothing covered the DATE fields, and Scope 1 is the largest line in the
// inventory.
//
// RowPeriodNote calls periodStatusOf() — the same function withinPeriod()
// filters with — instead of re-deriving the comparison, so the warning cannot
// drift from the behaviour it warns about. It is deliberately NOT wired into
// scope2/MeterReading: the electricity ledger does not filter on period, so a
// warning there would be a false alarm.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { RowPeriodNote } from '../pages/admin/scope3/RowPeriodNote.js';
import { periodStatusOf, withinPeriod, composeScope1FromBills } from '../data/scopeTotals.js';
import { REPORTING_PERIOD } from '../data/academicCalendar.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');
const OUT = { delivery_date: '2026-10-03' };
const IN = { delivery_date: '2026-03-01' };

describe('an out-of-period row is flagged before it is saved', () => {
  it('warns on a date outside the published period', () => {
    render(<RowPeriodNote row={OUT} />);
    expect(screen.getByRole('status').textContent).toMatch(/outside/i);
    expect(screen.getByRole('status').textContent).toContain(REPORTING_PERIOD.startIso);
  });

  it('says nothing for a row inside the period, or an undated one', () => {
    const { container: a } = render(<RowPeriodNote row={IN} />);
    expect(a.innerHTML).toBe('');
    const { container: b } = render(<RowPeriodNote row={{ gallons: 100 }} />);
    expect(b.innerHTML).toBe('');
  });

  it('agrees with the filter it warns about, by construction', () => {
    // the component must not re-derive the comparison
    expect(read('pages/admin/scope3/RowPeriodNote.js')).toContain('periodStatusOf');
    for (const row of [OUT, IN, { gallons: 1 }]) {
      const warned = periodStatusOf(row) === 'out';
      const dropped = withinPeriod([row]).length === 0;
      expect(warned, JSON.stringify(row)).toBe(dropped);
    }
  });

  it('the defect is real: the form default is out of period and loses the row', () => {
    const bill = (date) => [{ fuel_type: 'Heating Oil', gallons: 10000, delivery_date: date }];
    const heat = (rows) => composeScope1FromBills(rows, { fleetRecords: [], refrigerantLogs: [] })
      .breakdown.find((b) => /heat/i.test(b.source));
    expect(heat(bill('2026-03-01')).provenance).toBe('measured');
    // today's date — what the form defaults to — reverts to the placeholder
    expect(heat(bill('2026-10-03')).provenance).toBe('estimated');
    expect(heat(bill('2026-10-03')).mt).toBeGreaterThan(heat(bill('2026-03-01')).mt);
  });

  it('every Scope 1 form renders it — those are the period-filtered ones', () => {
    for (const f of ['HeatingOil', 'Propane', 'Fleet', 'Refrigerants']) {
      const src = read(`pages/admin/scope1/${f}.js`);
      expect(src, f).toContain('RowPeriodNote');
      expect(src, f).toMatch(/<RowPeriodNote row=\{form\} \/>/);
    }
  });

  it('and scope2/MeterReading does NOT — its ledger ignores the period', () => {
    // a warning there would be a false alarm; assert the restraint on purpose
    expect(read('pages/admin/scope2/MeterReading.js')).not.toContain('RowPeriodNote');
  });
});
