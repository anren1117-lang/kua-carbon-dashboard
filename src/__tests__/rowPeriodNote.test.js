// @vitest-environment jsdom
//
// A fuel delivery entered today saved cleanly and never reached a total.
//
// The published period was the 2025-2026 school year (2025-07-01 → 2026-06-30)
// while the Scope 1 forms default `delivery_date` to today(). On 2026-10-03
// that default was outside it: withinPeriod() dropped the row,
// composeScope1FromBills fell back to the 1,290 mt bottom-up placeholder, and
// the admin saw a green "saved" beside an unchanged number — indistinguishable
// from the app being broken. Measured at the time:
//
//   dated 2026-03-01  ->  102 mt   measured
//   dated 2026-10-03  ->  1,290 mt estimated   (the form's own default)
//   no date           ->  102 mt   measured
//
// Phase 500 rolled the period to 2026-2027, so the default now composes. This
// component stays, because the failure returns the moment the clock passes the
// published window again — which is every July unless someone rolls it.
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
// Phase 500 rolled the published period to 2026-2027, so these swap: a date
// in the PRIOR school year is now the out-of-period case. Both are explicit
// rather than derived from the clock, so the test asserts the mechanism and
// not whichever period happens to be published.
const OUT = { delivery_date: '2026-03-01' };   // prior school year
const IN = { delivery_date: '2026-10-03' };    // current period

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

  it('an out-of-period row really is dropped, not merely flagged', () => {
    const bill = (date) => [{ fuel_type: 'Heating Oil', gallons: 10000, delivery_date: date }];
    const heat = (rows) => composeScope1FromBills(rows, { fleetRecords: [], refrigerantLogs: [] })
      .breakdown.find((b) => /heat/i.test(b.source));
    // in period: the row composes, 10,000 gal ~ 102 mt
    expect(heat([{ ...bill(IN.delivery_date)[0] }]).provenance).toBe('measured');
    // out of period: reverts to the 1,290 mt bottom-up placeholder
    expect(heat(bill(OUT.delivery_date)).provenance).toBe('estimated');
    expect(heat(bill(OUT.delivery_date)).mt).toBeGreaterThan(heat(bill(IN.delivery_date)).mt);
  });

  it('what the Scope 1 forms default to is now INSIDE the period', () => {
    // the bug this component was written for: the forms default
    // delivery_date to today(), which fell outside a stale period and was
    // silently discarded. After the roll the default composes.
    const todayIso = new Date().toISOString().slice(0, 10);
    expect(periodStatusOf({ delivery_date: todayIso })).toBe('in');
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
