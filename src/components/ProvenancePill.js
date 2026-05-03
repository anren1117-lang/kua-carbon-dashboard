import React from 'react';
import { Pill } from './ModuleShell.js';

// Three-state data provenance pill, used everywhere on the dashboard
// that surfaces a number. Same color = same meaning across pages so
// the audience builds a vocabulary:
//
//   measured  — green   — from a real meter or invoice (BMS, fuel
//                         delivery records, utility bills, etc.)
//   cited     — cyan    — published methodology (EPA, IPCC, NREL,
//                         Drawdown, etc.) applied to reasonable KUA
//                         inputs. Defensible to a board / auditor.
//   estimated — amber   — placeholder I (Claude) wrote into the
//                         codebase. Not measured, not cited; needs
//                         replacement before anyone treats it as fact.
//
// Default to 'estimated' when in doubt — never inflate confidence.

const MAP = {
  measured:  { kind: 'good', label: 'Measured' },
  cited:     { kind: 'info', label: 'Cited' },
  estimated: { kind: 'warn', label: 'Estimated' },
};

export function ProvenancePill({ provenance, label }) {
  const cfg = MAP[provenance] || MAP.estimated;
  return <Pill kind={cfg.kind}>{label || cfg.label}</Pill>;
}

export function ProvenanceLegend({ compact }) {
  return (
    <div style={{
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      flexWrap: 'wrap',
      fontSize: 11,
      color: '#94a3b8',
      ...(compact ? {} : { marginTop: 10, marginBottom: 6 }),
    }}>
      <ProvenancePill provenance="measured" /> from a real meter or invoice
      <ProvenancePill provenance="cited" /> published methodology applied to KUA inputs
      <ProvenancePill provenance="estimated" /> placeholder — needs replacement with measured data
    </div>
  );
}
