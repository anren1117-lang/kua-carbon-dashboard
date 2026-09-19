import React from 'react';
import { REPORTING_SCHOOL_YEAR, schoolYearOn } from '../../../data/academicCalendar.js';

const styles = {
  wrap: { marginTop: 8, padding: '10px 14px', borderRadius: 8, border: '1px solid #78350f', background: '#1c1207', color: '#fcd34d', fontSize: 13, lineHeight: 1.5 },
  year: { fontWeight: 700 },
};

// Shown beside a form's school_year / fiscal_year field when the wall-clock
// school year and the period this inventory publishes have drifted apart.
//
// periodStatusOf() compares those labels EXACTLY, so a row saved under the
// clock year is classified 'out' and never reaches a published total — while
// the admin sees a successful save. Phase 439 stopped the forms DEFAULTING to
// the clock year; this says out loud why the default is what it is.
//
// Renders nothing when the two agree, so it costs nothing once the reporting
// period is rolled forward. Both values are props so the behaviour is
// testable without depending on the date the suite happens to run.
export function PeriodNote({ published = REPORTING_SCHOOL_YEAR, clock = schoolYearOn(new Date()) }) {
  if (!published || !clock || clock === published) return null;
  return (
    <div style={styles.wrap} role="status">
      It is now the <span style={styles.year}>{clock}</span> school year, but this inventory
      publishes <span style={styles.year}>{published}</span>. A row saved as {clock} counts as
      outside the reporting period and will not appear in any published total.
    </div>
  );
}
