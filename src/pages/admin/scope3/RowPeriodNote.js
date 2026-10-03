import React from 'react';
import { periodStatusOf } from '../../../data/scopeTotals.js';
import { REPORTING_PERIOD } from '../../../data/academicCalendar.js';

const styles = {
  wrap: {
    marginTop: 8, padding: '10px 14px', borderRadius: 8,
    border: '1px solid #7f1d1d', background: '#2a0d10',
    color: '#fca5a5', fontSize: 13, lineHeight: 1.55,
  },
  strong: { fontWeight: 700, color: '#fecaca' },
  hint: { color: '#94a3b8', marginTop: 6 },
};

// Warns BEFORE a save that this row's date falls outside the reporting period,
// because the save will succeed and the row will still never reach a total.
//
// PeriodNote covers the school-year LABEL on the Scope 3 forms. Nothing covered
// the DATE fields, and the Scope 1 forms — heating oil, propane, fleet,
// refrigerants, the 1,290 mt line — default `delivery_date` to today(). On
// 2026-10-03 that default is outside the published 2025-2026 period, so a fuel
// delivery entered today saves cleanly, is filtered out by withinPeriod(), and
// the dashboard keeps showing the bottom-up placeholder. The admin sees a green
// "saved" and an unchanged number, which is indistinguishable from the app
// being broken.
//
// It calls periodStatusOf() — the same function withinPeriod() filters with —
// rather than re-deriving the comparison, so the warning cannot disagree with
// the behaviour it is warning about.
export function RowPeriodNote({ row, period = REPORTING_PERIOD }) {
  if (periodStatusOf(row, period) !== 'out') return null;
  return (
    <div style={styles.wrap} role="status">
      This row falls <span style={styles.strong}>outside {period.label}</span>{' '}
      ({period.startIso} to {period.endIso}). It will save, and it will be
      excluded from every published total.
      <div style={styles.hint}>
        Either date it within the reporting period, or roll the period forward in
        <code> src/data/academicCalendar.js</code> if this inventory should now
        publish the current year.
      </div>
    </div>
  );
}
