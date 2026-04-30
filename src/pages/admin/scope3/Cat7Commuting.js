import React from 'react';
import { formStyles as s } from './formStyles';

const schema = [
  { col: 'employee_role', type: 'enum', note: 'faculty · staff · other' },
  { col: 'home_zip', type: 'text', note: 'Home ZIP, used to estimate one-way distance from campus' },
  { col: 'mode', type: 'enum', note: 'car_solo · carpool · transit · bike · walk · ev' },
  { col: 'days_per_week', type: 'integer', note: 'Average days per week on campus during the school year' },
  { col: 'survey_date', type: 'date', note: 'When this entry was collected; commuting is re-surveyed annually' },
  { col: 'school_year', type: 'text', note: 'e.g. 2025-2026' },
];

const styles = {
  schemaTable: { width: '100%', marginTop: 12, borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '8px 10px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937', background: '#0b1220' },
  td: { padding: '8px 10px', fontSize: 13, borderBottom: '1px solid #1f2937', color: '#cbd5e1', verticalAlign: 'top' },
  mono: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: '#22d3ee' },
};

function Cat7Commuting() {
  return (
    <div>
      <div style={s.cat}>Scope 3 · Category 7</div>
      <h1 style={s.title}>Employee Commuting</h1>
      <p style={s.subtitle}>
        Daily travel of non-resident faculty and staff to campus. Smaller for a residential
        boarding school than for a comparable day school, but still required for a complete
        Scope 3 inventory.
      </p>
      <div style={s.factor}>
        Factor source: EPA Emission Factors Hub — per-passenger-mile by mode
      </div>

      <div style={s.card}>
        <h2 style={s.h2}>Planned schema · <code style={styles.mono}>commuting</code></h2>
        <table style={styles.schemaTable}>
          <thead>
            <tr>
              <th style={styles.th}>Column</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {schema.map((c) => (
              <tr key={c.col}>
                <td style={{ ...styles.td, ...styles.mono }}>{c.col}</td>
                <td style={styles.td}>{c.type}</td>
                <td style={styles.td}>{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cat7Commuting;
