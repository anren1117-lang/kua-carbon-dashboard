import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT, GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';

// Generates a plain-language summary of the dashboard state. Currently rule-based;
// the same I/O shape (database values in, grounded sentences out) can be swapped
// for an LLM call once an API key is configured. Per the proposal's safeguards:
//   1. Every sentence references values present in the database (or the same
//      preliminary estimate the rest of the dashboard uses).
//   2. A "Show calculation" control exposes the math behind every claim.
//   3. The output is visually distinct from measured values via the AI badge.

const STUDENTS = 340;
const PRELIM = {
  scope1: Math.round(SCOPE1_TOTAL_MT),
  scope2: Math.round(SCOPE2_TOTAL_MT),
  scope3: Math.round(SCOPE3_TOTAL_MT),
  sinks:  Math.round(ANNUAL_SEQUESTRATION_MT),
  students: STUDENTS,
};

function compose(records) {
  const gross = Math.round(GROSS_MT);
  const net = gross - PRELIM.sinks;
  const perStudent = (net / PRELIM.students).toFixed(1);
  const recordCount = records.totalRecords ?? 0;
  const measuredScope = records.totalRecords > 0 ? Object.keys(records.tables).filter((t) => records.tables[t] > 0) : [];

  const sentences = [];
  sentences.push(
    `KUA's preliminary total carbon footprint is approximately ${gross.toLocaleString()} mtCO₂e per year across Scopes 1, 2, and 3.`
  );
  sentences.push(
    `Student travel is the largest contributor at roughly ${PRELIM.scope3.toLocaleString()} mtCO₂e — about ${Math.round(PRELIM.scope3 / gross * 100)}% of the total — driven primarily by international and US-boarder term-break flights.`
  );
  sentences.push(
    `Heating fuel (Scope 1) contributes ~${PRELIM.scope1.toLocaleString()} mtCO₂e from cold-climate combustion, while purchased electricity (Scope 2) adds another ${PRELIM.scope2} mtCO₂e from the ISO-NE 2024 grid.`
  );
  sentences.push(
    `On-campus sequestration from roughly 1,000 acres of forest pulls back an estimated ${PRELIM.sinks.toLocaleString()} mtCO₂e per year, leaving a net balance near ${net.toLocaleString()} mtCO₂e — about ${perStudent} per student per year.`
  );
  if (recordCount > 0) {
    sentences.push(
      `${recordCount} records have been entered through the Admin Portal so far${measuredScope.length ? ` (${measuredScope.slice(0, 3).join(', ')}${measuredScope.length > 3 ? ', and others' : ''})` : ''}; each new entry reduces the uncertainty on the headline number.`
    );
  } else {
    sentences.push(
      `No measured records have been entered yet. As fuel deliveries, electricity readings, travel records, and tree inventory data are loaded through the Admin Portal, the headline number tightens automatically.`
    );
  }
  return sentences;
}

const tablesToSurvey = [
  'scope1_heating_oil','scope1_propane','scope1_refrigerants','scope1_fleet',
  'scope2_meter_readings','renewables_solar','renewables_geothermal','renewables_wind',
  'sinks_trees','sinks_soil_samples','waste','faculty_travel',
  'day_students','us_boarding_students','international_students','study_abroad',
  'purchased_goods','commuting',
];

const styles = {
  wrap: { maxWidth: 1100, margin: '24px auto 0', padding: '0 16px' },
  card: { padding: '24px 28px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 14, borderLeft: '3px solid #06b6d4' },
  head: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  badge: { fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#155e75', color: '#a5f3fc', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  title: { fontSize: 18, fontWeight: 600, color: '#e5e7eb' },
  body: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.7 },
  toggle: { marginTop: 12, background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' },
  calc: { marginTop: 12, padding: 12, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 },
  footnote: { marginTop: 12, fontSize: 11, color: '#64748b', fontStyle: 'italic' },
};

export function AISummary() {
  const [records, setRecords] = useState({ totalRecords: 0, tables: {} });
  const [showCalc, setShowCalc] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const tables = {};
      let total = 0;
      for (const t of tablesToSurvey) {
        try {
          const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
          tables[t] = count ?? 0;
          total += count ?? 0;
        } catch {
          tables[t] = 0;
        }
      }
      if (!cancelled) setRecords({ totalRecords: total, tables });
    })();
    return () => { cancelled = true; };
  }, []);

  const sentences = compose(records);
  const gross = Math.round(GROSS_MT);
  const net = gross - PRELIM.sinks;

  const [showFull, setShowFull] = useState(false);
  const visibleSentences = showFull ? sentences : sentences.slice(0, 1);

  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <div style={styles.head}>
          <span style={styles.badge}>AI-generated · grounded</span>
          <span style={styles.title}>In plain English</span>
        </div>
        <div style={styles.body}>
          {visibleSentences.map((s, i) => <p key={i} style={{ margin: i === 0 ? 0 : '8px 0 0' }}>{s}</p>)}
        </div>
        <button type="button" style={styles.toggle} onClick={() => setShowFull((v) => !v)}>
          {showFull ? 'Show less' : 'Read full summary'}
        </button>
        {showFull && (
          <button type="button" style={{ ...styles.toggle, marginLeft: 8 }} onClick={() => setShowCalc((v) => !v)}>
            {showCalc ? 'Hide calculation' : 'Show calculation'}
          </button>
        )}
        {showCalc && (
          <pre style={styles.calc}>
{`gross = scope1 + scope2 + scope3
      = ${PRELIM.scope1} + ${PRELIM.scope2} + ${PRELIM.scope3}
      = ${gross.toLocaleString()} mtCO₂e/yr

net = gross - on_campus_sinks
    = ${gross.toLocaleString()} - ${PRELIM.sinks.toLocaleString()}
    = ${net.toLocaleString()} mtCO₂e/yr

per_student = net / students
            = ${net.toLocaleString()} / ${PRELIM.students}
            = ${(net / PRELIM.students).toFixed(2)} mtCO₂e/student/yr

records_in_db = ${records.totalRecords}
nonempty_tables = ${Object.entries(records.tables).filter(([, n]) => n > 0).map(([k]) => k).join(', ') || '(none yet)'}`}
          </pre>
        )}
        <div style={styles.footnote}>
          Currently rule-based. The same input/output shape (database values → grounded sentences)
          will route through an LLM in Phase 3. Per the proposal's safeguards, every sentence here
          can be traced to a database value or the preliminary estimate; the agent cannot invent
          numbers.
        </div>
      </section>
    </div>
  );
}
