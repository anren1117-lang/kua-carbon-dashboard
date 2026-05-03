import React from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { EnergyEquivalents } from '../components/EnergyEquivalents.js';
import { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E } from '../data/gridMix.js';
import { reductionActions } from '../data/reductionActions.js';
import { ANNUAL_SEQUESTRATION_MT, TOTAL_FOREST_ACRES } from '../data/sinks.js';
import { SOLAR_ANNUAL_KWH } from '../data/renewables.js';
import { TOTAL_STUDENTS } from '../data/students.js';
import { TOTAL_STAFF } from '../data/staff.js';
import { rankActions } from '../utils/hotspots.js';
import { carbonEquivalents } from '../utils/equivalents.js';
import { monthlyPattern } from '../data/seasonalPatterns.js';
import { Sparkline } from '../components/Sparkline.js';

// Executive Dashboard — what a head of school or trustee should see in
// the first 30 seconds. Aggregates the most-load-bearing numbers from
// every OS module and links to the page that owns each one.

const KG_PER_KWH = (GRID_MIX_TOTAL_MTCO2E * 1000) / GRID_MIX_TOTAL_KWH;

// Rough preliminary scope totals. These match the figures used in
// NetEstimate.js so the executive page lines up with the homepage
// hero. Replace with live aggregations once Supabase is wired.
const SCOPE_TOTALS = {
  scope1Mt:  1250, // heating fuel + refrigerants + fleet
  scope2Mt:  GRID_MIX_TOTAL_MTCO2E, // 222 mt — electricity
  scope3Mt:  2700, // travel, food, waste, procurement, commuting, upstream fuel
};
const GROSS_MT = SCOPE_TOTALS.scope1Mt + SCOPE_TOTALS.scope2Mt + SCOPE_TOTALS.scope3Mt;
const NET_MT = GROSS_MT - ANNUAL_SEQUESTRATION_MT;

export default function Executive() {
  const ranked = rankActions(reductionActions);
  const top3 = ranked.slice(0, 3);
  const totalActionImpact = reductionActions.reduce((s, a) => s + a.expectedReductionMtCO2e, 0);
  const cEq = carbonEquivalents(GROSS_MT);
  const perStudent = NET_MT / TOTAL_STUDENTS;

  return (
    <ModulePage
      title="Executive Dashboard"
      subtitle="The numbers a head of school or trustee should see first. Each card links to the OS module that owns the underlying data."
    >
      <MetricGrid metrics={[
        { label: 'Net annual emissions', value: Math.round(NET_MT).toLocaleString(), unit: 'mtCO₂e', accent: '#fbbf24', note: `${perStudent.toFixed(2)} per student` },
        { label: 'Gross emissions',      value: Math.round(GROSS_MT).toLocaleString(), unit: 'mtCO₂e', accent: '#ef4444' },
        { label: 'Forest sequestration', value: Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString(), unit: 'mtCO₂e/yr', accent: '#22c55e', note: `${TOTAL_FOREST_ACRES.toLocaleString()} acres` },
        { label: 'On-campus solar',      value: SOLAR_ANNUAL_KWH.toLocaleString(), unit: 'kWh/yr', accent: '#86efac', note: 'Whittemore array' },
      ]} />

      <ModuleSection
        title="Where the gross number comes from"
        hint="Click any row to drill into that scope's detail."
      >
        <div style={styles.scopeList}>
          <ScopeRow
            to="/scope-1"
            label="Scope 1 — direct (heating fuel + fleet + refrigerants)"
            mt={SCOPE_TOTALS.scope1Mt}
            share={(SCOPE_TOTALS.scope1Mt / GROSS_MT) * 100}
            color="#fbbf24"
            scopeKey="scope1"
          />
          <ScopeRow
            to="/scope-2"
            label="Scope 2 — purchased electricity"
            mt={SCOPE_TOTALS.scope2Mt}
            share={(SCOPE_TOTALS.scope2Mt / GROSS_MT) * 100}
            color="#22d3ee"
            scopeKey="scope2"
          />
          <ScopeRow
            to="/scope-3"
            label="Scope 3 — travel, food, waste, procurement"
            mt={SCOPE_TOTALS.scope3Mt}
            share={(SCOPE_TOTALS.scope3Mt / GROSS_MT) * 100}
            color="#ef4444"
            scopeKey="scope3"
          />
          <ScopeRow
            to="/sinks-os"
            label="Sinks — forest sequestration (subtracts)"
            mt={-ANNUAL_SEQUESTRATION_MT}
            share={(ANNUAL_SEQUESTRATION_MT / GROSS_MT) * 100}
            color="#22c55e"
            sinks
          />
        </div>
      </ModuleSection>

      <ModuleSection
        title="Top recommended actions"
        hint="Ranked by impact × urgency × confidence. Full list on the Actions page."
      >
        <div style={styles.actionList}>
          {top3.map(({ action }, i) => (
            <Link key={action.id} to="/actions" style={styles.actionRow}>
              <div style={styles.actionRank}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.actionTitle}>{action.title}</div>
                <div style={styles.actionMeta}>
                  ~{action.expectedReductionMtCO2e} mtCO₂e/yr · {action.estimatedCostUsd === 0 ? 'no cost' : `$${action.estimatedCostUsd.toLocaleString()}`} · {action.owner}
                </div>
              </div>
              <Pill kind={action.urgency === 'high' ? 'bad' : action.urgency === 'medium' ? 'warn' : 'neutral'}>
                {action.urgency}
              </Pill>
            </Link>
          ))}
        </div>
        <div style={styles.actionFoot}>
          {reductionActions.length} actions in queue · {totalActionImpact.toFixed(0)} mtCO₂e/yr potential if every action ships
        </div>
      </ModuleSection>

      <ModuleSection
        title="Carbon equivalents"
        hint="Translation layer for the gross emissions figure — useful in trustee + parent communications."
      >
        <div style={styles.eqGrid}>
          <EqCell icon="🚗" value={cEq.carYears.toLocaleString()} label="cars driven for a year" />
          <EqCell icon="🌳" value={cEq.treeYears.toLocaleString()} label="tree-years to absorb" />
          <EqCell icon="🏠" value={cEq.homeYears.toLocaleString()} label="US homes powered for a year" />
          <EqCell icon="✈️" value={cEq.transatFlights.toLocaleString()} label="transatlantic flights" />
          <EqCell icon="⛽" value={cEq.galsGasoline.toLocaleString()} label="gallons of gasoline" />
        </div>
      </ModuleSection>

      <ModuleSection
        title="Population denominators"
        hint="Per-student / per-staff intensity is sensitive to how these are counted. Using the data-layer rosters."
      >
        <MetricGrid metrics={[
          { label: 'Students',         value: TOTAL_STUDENTS,         accent: '#22d3ee' },
          { label: 'Faculty + staff',  value: TOTAL_STAFF,            accent: '#fbbf24' },
          { label: 'mtCO₂e / student', value: perStudent.toFixed(2),  accent: '#86efac', note: 'Net basis' },
          { label: 'kWh / student',    value: Math.round(GRID_MIX_TOTAL_KWH / TOTAL_STUDENTS).toLocaleString(), accent: '#ef4444' },
        ]} />
      </ModuleSection>

      <ModuleSection
        title="Annual electricity equivalents"
        hint="From the kWh side — handy for assemblies and tours."
      >
        <EnergyEquivalents kwh={GRID_MIX_TOTAL_KWH} label="A year of campus electricity is equivalent to" />
      </ModuleSection>

      <ModuleSection title="Direct module links">
        <div style={styles.linkGrid}>
          {[
            { to: '/hotspots', label: 'Hotspots' },
            { to: '/buildings', label: 'Buildings' },
            { to: '/dining', label: 'Dining' },
            { to: '/transportation', label: 'Transportation' },
            { to: '/waste', label: 'Waste' },
            { to: '/procurement', label: 'Procurement' },
            { to: '/renewables-os', label: 'Renewables' },
            { to: '/sinks-os', label: 'Sinks' },
            { to: '/actions', label: 'Actions' },
            { to: '/challenges', label: 'Student Challenges' },
            { to: '/teacher', label: 'Teacher Tools' },
            { to: '/chatbot', label: 'Carbon Chatbot' },
            { to: '/data-admin', label: 'Data Admin' },
          ].map((l) => (
            <Link key={l.to} to={l.to} style={styles.linkCard}>{l.label} →</Link>
          ))}
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

// Approximate the per-scope monthly shape using the same monthly pattern
// the live ticker uses — Scope 2 follows ISO-NE seasonal grid usage, and
// Scope 1 is heavily heating-driven so we accentuate the winter peaks.
function scopeMonthlySeries(scopeKey, total) {
  const baseShape = monthlyPattern.map((m) => m.multiplier);
  let shape = baseShape;
  if (scopeKey === 'scope1') {
    // Steeper winter peak, near-zero summer trough.
    shape = baseShape.map((v) => Math.pow(v, 1.6));
  } else if (scopeKey === 'scope3') {
    // Peaks at fall/spring break travel; minor summer dip.
    shape = baseShape.map((v, i) => {
      const travelBoost = (i === 11 || i === 5 || i === 2) ? 1.18 : 1;
      return v * travelBoost;
    });
  }
  const sum = shape.reduce((s, v) => s + v, 0);
  return shape.map((v) => (v / sum) * total);
}

function ScopeRow({ to, label, mt, share, color, sinks, scopeKey }) {
  const series = scopeKey ? scopeMonthlySeries(scopeKey, Math.abs(mt)) : null;
  return (
    <Link to={to} style={{ ...styles.scopeRow, borderLeftColor: color }}>
      <div style={{ flex: 1 }}>
        <div style={styles.scopeLabel}>{label}</div>
        <div style={styles.scopeBar}>
          <div style={{ ...styles.scopeFill, width: `${Math.min(100, share)}%`, background: color }} />
        </div>
      </div>
      {series && (
        <div style={styles.scopeSpark}>
          <Sparkline data={series} color={color} fill={`${color}26`} width={120} height={32} />
          <div style={styles.scopeSparkLabel}>monthly</div>
        </div>
      )}
      <div style={styles.scopeNums}>
        <div style={{ ...styles.scopeMt, color: sinks ? '#86efac' : '#e5e7eb' }}>
          {sinks ? mt.toFixed(0) : Math.round(mt).toLocaleString()}
        </div>
        <div style={styles.scopeUnit}>mtCO₂e</div>
      </div>
    </Link>
  );
}

function EqCell({ icon, value, label }) {
  return (
    <div style={styles.eqCell}>
      <div style={styles.eqIcon}>{icon}</div>
      <div style={styles.eqValue}>{value}</div>
      <div style={styles.eqLabel}>{label}</div>
    </div>
  );
}

const styles = {
  scopeList: { display: 'grid', gap: 8 },
  scopeRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 8, color: 'inherit', textDecoration: 'none' },
  scopeLabel: { fontSize: 14, color: '#cbd5e1', fontWeight: 600 },
  scopeBar: { marginTop: 8, height: 8, background: '#0f172a', borderRadius: 4, overflow: 'hidden' },
  scopeFill: { height: '100%' },
  scopeSpark: { textAlign: 'center', minWidth: 120 },
  scopeSparkLabel: { fontSize: 10, color: '#64748b', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  scopeNums: { textAlign: 'right', minWidth: 90 },
  scopeMt: { fontSize: 22, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  scopeUnit: { fontSize: 11, color: '#64748b', marginTop: 4 },

  actionList: { display: 'grid', gap: 8 },
  actionRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: 'inherit', textDecoration: 'none' },
  actionRank: { fontSize: 14, color: '#fbbf24', fontWeight: 800, fontVariantNumeric: 'tabular-nums', minWidth: 30 },
  actionTitle: { fontSize: 14, color: '#e5e7eb', fontWeight: 700 },
  actionMeta: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  actionFoot: { marginTop: 12, fontSize: 12, color: '#64748b' },

  eqGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 },
  eqCell: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, textAlign: 'center' },
  eqIcon: { fontSize: 24 },
  eqValue: { fontSize: 22, color: '#e5e7eb', fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums', lineHeight: 1 },
  eqLabel: { fontSize: 11, color: '#94a3b8', marginTop: 6, lineHeight: 1.3 },

  linkGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 },
  linkCard: { padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: '#cbd5e1', textDecoration: 'none', fontSize: 13, fontWeight: 600 },
};
