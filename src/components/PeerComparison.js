import React, { useState } from 'react';
import { useIsNarrow } from '../hooks/useViewport.js';
import { useSpotlight } from '../hooks/useSpotlight.js';
import { GRID_MIX_TOTAL_MTCO2E, GRID_MIX_ANNUAL_MTCO2E } from '../data/gridMix.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { TOTAL_STUDENTS } from '../data/students.js';
import { useMeasuredScopeTotals } from '../hooks/useMeasuredScopeTotals.js';
import { useMeasuredScope2 } from '../hooks/useMeasuredScope2.js';

// Per-student mtCO2e breakdown drawn from publicly disclosed sustainability reports.
// Cross-institutional comparison has real limits (Valls-Val & Bovea 2021): Scope 3
// inclusion, denominators, and reporting years differ. Each row is a defensible
// order-of-magnitude shape, not a precise claim.
//
// scope1 = on-site combustion (heating fuel, refrigerants, fleet)
// scope2 = purchased electricity (location-based)
// scope3 = supply chain, travel, waste, commuting
// sinks  = on-campus sequestration (trees and soils) — a natural drawdown
// offsets = purchased carbon credits / RECs — a financial drawdown

// KUA's row is derived from the same canonical totals the Executive page
// uses, so the bars can't drift from the headline numbers. Peer rows
// stay hand-typed because they come from external reports.
// Pull from the single-source scope totals so peer-comparison numbers
// auto-update when measured data lands.
import { SCOPE1_TOTAL_MT as KUA_SCOPE1_TOTAL_MT, SCOPE3_TOTAL_MT as KUA_SCOPE3_TOTAL_MT } from '../data/scopeTotals.js';
// Use the canonical annualized scope-2 export so the comparison
// against peers' annual scope-2 figures is apples-to-apples.
const KUA_SCOPE2_ANNUAL_MT = GRID_MIX_ANNUAL_MTCO2E;
const round1 = (n) => Math.round(n * 10) / 10;

const peers = [
  { name: 'KUA',                          type: 'boarding-secondary', isUs: true, provenance: 'cited', sinksQuantified: true,
    scope1:  round1(KUA_SCOPE1_TOTAL_MT / TOTAL_STUDENTS),
    scope2:  round1(KUA_SCOPE2_ANNUAL_MT / TOTAL_STUDENTS),
    scope3:  round1(KUA_SCOPE3_TOTAL_MT / TOTAL_STUDENTS),
    sinks:   round1(-ANNUAL_SEQUESTRATION_MT / TOTAL_STUDENTS),
    offsets: 0,
    note: `Preliminary per-student figures from KUA gross/sinks ÷ ${TOTAL_STUDENTS} enrolled students (Wikipedia + KUA "By the Numbers"). Scope 1 = ${KUA_SCOPE1_TOTAL_MT.toLocaleString()} mt heating fuel + refrigerants + fleet. Scope 2 = ${Math.round(KUA_SCOPE2_ANNUAL_MT).toLocaleString()} mt — Year 1 projection from BMS-measured kWh × ISO-NE 2024 per-fuel factors (${GRID_MIX_TOTAL_MTCO2E.toFixed(1)} mt YTD seasonally extrapolated). Scope 3 = ${KUA_SCOPE3_TOTAL_MT.toLocaleString()} mt — dominated by international + US-boarder term-break travel. Sinks = ${Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()} mt from ~1,000 acres of campus forest (campus is 1,300 acres total; ~1,000 forested) at mid-estimate sequestration.` },
  { name: 'Phillips Exeter Academy (NH)', type: 'boarding-secondary', provenance: 'estimated', sinksQuantified: false,
    scope1: 4.0, scope2: 1.5, scope3: 4.5, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE, not a published figure. Exeter publishes a 2023 plan ("Building from Strength Toward a Zero Carbon Future") with targets — 75% cut in Scope 1+2 from a 2005 baseline by 2031, zero by 2050, and roughly 60% achieved since 2005 — but no per-student inventory and no Scope 3 breakdown we could locate. The split above is an order-of-magnitude sketch for a larger boarding cohort in older buildings on heating oil. Sinks: not quantified in their reporting, which is not the same as zero.' },
  { name: 'Phillips Academy Andover (MA)',type: 'boarding-secondary', provenance: 'estimated', sinksQuantified: false,
    scope1: 3.5, scope2: 1.5, scope3: 4.0, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE, not a published figure. Andover publishes a Climate Action Plan 2019–2030 (adopted 2018) with a 30% mtCO₂e reduction target plus water and 90%-diversion waste goals, and annual FY tracking — but no per-student inventory we could locate. Sinks: not quantified, which is not the same as zero.' },
  { name: 'Lawrenceville School (NJ)',    type: 'boarding-secondary', provenance: 'estimated', sinksQuantified: false,
    scope1: 3.0, scope2: 2.0, scope3: 4.0, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE. We did not locate a published inventory for Lawrenceville and did not research it directly — treat this row as an illustrative boarding-school profile only. Sinks: not quantified.' },
  { name: 'Choate Rosemary Hall (CT)',    type: 'boarding-secondary', provenance: 'estimated', sinksQuantified: false,
    scope1: 3.0, scope2: 1.5, scope3: 3.5, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE. We did not locate a published inventory for Choate and did not research it directly — illustrative peer profile only. Sinks: not quantified.' },
  { name: 'Middlebury College',           type: 'college', provenance: 'estimated', sinksQuantified: false,
    scope1: 2.0, scope2: 1.0, scope3: 2.5, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE for the scope split. The neutrality story, however, is documented and was previously described incorrectly here: Middlebury reached carbon neutrality in 2016 mostly through REAL REDUCTIONS — a $12M biomass plant cut No. 6 fuel oil by 91% (2M → ~185,000 gal), three solar arrays totalling 1,150 kW supply ~8% of electricity, and 87 Efficiency Vermont projects saved 4.52M kWh. The residual was closed with carbon credits quantified from their OWN 2,100 acres of Bread Loaf forestland, preserved in perpetuity under a Vermont Land Trust easement. The old drawdown figure of −5.5 was unsourced and is removed rather than guessed at.' },
  { name: 'Williams College',             type: 'college', provenance: 'estimated', sinksQuantified: false,
    scope1: 2.5, scope2: 1.0, scope3: 2.5, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE. We did not locate a published inventory for Williams and did not research it directly — illustrative cold-climate residential-college profile. Sinks: not quantified.' },
  { name: 'Yale University',              type: 'university', provenance: 'estimated', sinksQuantified: false,
    scope1: 1.5, scope2: 1.0, scope3: 1.5, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE, not a published per-capita figure. Yale publishes progress in PERCENTAGES (Scope 1+2 down ~28% against a 2015 baseline; a 2005 baseline of 263,119 mtCO₂e; Scope 3 category trends against 2020) rather than a per-FTE number we could cite. Sinks: not quantified.' },
];

const segColors = {
  scope1:  '#ef4444', // red — direct combustion
  scope2:  '#f59e0b', // amber — purchased electricity
  scope3:  '#8b5cf6', // purple — indirect / supply chain / travel
  sinks:   '#22c55e', // green — natural sequestration (negative)
  offsets: '#06b6d4', // cyan — purchased credits (negative)
};
const segLabels = {
  scope1:  'Scope 1 — direct',
  scope2:  'Scope 2 — electricity',
  scope3:  'Scope 3 — indirect',
  sinks:   'On-campus sinks',
  offsets: 'Purchased offsets',
};

const typeLabels = {
  'boarding-secondary': 'Boarding secondary',
  'college':            'Liberal arts college',
  'university':         'Research university',
};

// KUA's row follows measured data as it lands — Scope 2 recomposes from the
// electricity ledger. Peer rows stay hand-typed from their published reports.
function buildLivePeers(live, s2) {
  return peers.map((p) => {
    if (!p.isUs) return p;
    const scope1 = live?.scope1Mt ?? KUA_SCOPE1_TOTAL_MT;
    const scope2 = live?.scope2Mt ?? KUA_SCOPE2_ANNUAL_MT;
    const scope3 = live?.scope3Mt ?? KUA_SCOPE3_TOTAL_MT;
    const ytdMt = s2?.ytdMt ?? GRID_MIX_TOTAL_MTCO2E;
    return {
      ...p,
      scope1: round1(scope1 / TOTAL_STUDENTS),
      scope2: round1(scope2 / TOTAL_STUDENTS),
      scope3: round1(scope3 / TOTAL_STUDENTS),
      note: `Preliminary per-student figures from KUA gross/sinks ÷ ${TOTAL_STUDENTS} enrolled students (Wikipedia + KUA "By the Numbers"). Scope 1 = ${Math.round(scope1).toLocaleString()} mt heating fuel + refrigerants + fleet. Scope 2 = ${Math.round(scope2).toLocaleString()} mt — Year 1 projection from BMS-measured kWh × ISO-NE 2024 per-fuel factors (${ytdMt.toFixed(1)} mt YTD seasonally extrapolated). Scope 3 = ${Math.round(scope3).toLocaleString()} mt — dominated by international + US-boarder term-break travel. Sinks = ${Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()} mt from ~1,000 acres of campus forest (campus is 1,300 acres total; ~1,000 forested) at mid-estimate sequestration.`,
    };
  });
}

const sumGross = (p) => p.scope1 + p.scope2 + p.scope3;
const sumNet = (p) => sumGross(p) + p.sinks + p.offsets; // sinks/offsets are stored negative

// Find the global maximum across both gross emissions and absolute drawdown so the
// scale of the positive and negative axes look balanced.
const maxGross = Math.max(...peers.map(sumGross));
const maxDrawdown = Math.max(...peers.map((p) => Math.abs(p.sinks + p.offsets)));
const axisMax = Math.max(maxGross, 1);
const axisMin = -Math.max(maxDrawdown, 0.5);
const axisRange = axisMax - axisMin;
const zeroPct = (-axisMin / axisRange) * 100;

const styles = {
  wrap: { maxWidth: 1100, margin: '24px auto 0', padding: '0 16px' },
  card: { padding: '24px 28px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 14 },
  head: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 700, color: '#e5e7eb', margin: 0 },
  blurb: { fontSize: 14, color: '#94a3b8', maxWidth: 760, marginTop: 6 },
  legend: { display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap', fontSize: 12, color: '#94a3b8' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
  swatch: (color) => ({ width: 12, height: 12, borderRadius: 3, background: color }),
  rows: { marginTop: 22, display: 'grid', gap: 10 },
  row: { display: 'grid', gridTemplateColumns: 'minmax(140px, 210px) 1fr minmax(80px, 130px)', alignItems: 'center', gap: 10 },
  rowNarrow: { display: 'flex', flexDirection: 'column', gap: 6, padding: '6px 0', borderBottom: '1px solid #1f2937' },
  rowNarrowHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 },
  rowSelf: { background: '#1e293b', padding: '10px', borderRadius: 6, marginLeft: -10, marginRight: -10 },
  name: { fontSize: 13, color: '#e5e7eb', fontWeight: 500 },
  nameSelf: { fontSize: 13, color: '#fbbf24', fontWeight: 700 },
  nameType: { fontSize: 11, color: '#64748b', marginTop: 2 },
  axisRow: { display: 'grid', gridTemplateColumns: 'minmax(140px, 210px) 1fr minmax(80px, 130px)', alignItems: 'center', gap: 10, marginTop: 8 },
  axis: { position: 'relative', height: 14, fontSize: 11, color: '#64748b' },
  axisLabel: { position: 'absolute', top: 0, transform: 'translateX(-50%)', whiteSpace: 'nowrap' },
  barTrack: { position: 'relative', height: 28, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 4, overflow: 'hidden' },
  zeroLine: { position: 'absolute', top: 0, bottom: 0, width: 1, background: '#475569', zIndex: 2 },
  seg: (leftPct, widthPct, color) => ({
    position: 'absolute', top: 0, bottom: 0,
    left: leftPct + '%', width: widthPct + '%',
    background: color,
  }),
  netMarker: (leftPct, isSelf) => ({
    position: 'absolute', top: -2, bottom: -2,
    left: leftPct + '%', width: 2,
    background: isSelf ? '#fcd34d' : '#e5e7eb',
    zIndex: 3,
  }),
  netCol: { fontSize: 13, color: '#e5e7eb', fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  netColSelf: { fontSize: 13, color: '#fbbf24', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontWeight: 700 },
  caveat: { marginTop: 20, padding: '12px 16px', background: '#0b1220', border: '1px dashed #334155', borderRadius: 8, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
  notesTitle: { marginTop: 16, fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  noteList: { paddingLeft: 18, fontSize: 12, color: '#94a3b8', lineHeight: 1.7, margin: 0 },
};

const valToPct = (v) => ((v - axisMin) / axisRange) * 100;

function PeerNotes({ peers }) {
  const [open, setOpen] = useState(false);
  const toggleStyle = { marginTop: 18, background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '8px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer' };
  return (
    <>
      <button type="button" style={toggleStyle} onClick={() => setOpen((v) => !v)}>
        {open ? 'Hide caveats and source notes' : 'Show caveats and source notes'}
      </button>
      {open && (
        <>
          <div style={styles.caveat}>
            <strong style={{ color: '#fbbf24' }}>Caveat:</strong> Cross-institutional comparison is
            harder than these bars suggest. Valls-Val &amp; Bovea (2021) reviewed 35 university
            footprint studies and found that Scope 3 inclusion, denominators, and offset treatment
            vary enough that absolute numbers are often not directly comparable. Middlebury's 2016
            neutrality came mostly from real reductions — a biomass plant that cut fuel oil 91%, plus
            solar and efficiency work — with the residual closed by credits quantified from their own
            2,100-acre Bread Loaf forest. An earlier version of this page called that "purchasing
            offsets equal to gross emissions", which was wrong. Sinks at most peer schools are not
            quantified at all, and a zero in this chart means unmeasured, not absent.
          </div>
          <div style={styles.notesTitle}>Per-row notes</div>
          <ul style={styles.noteList}>
            {peers.map((p) => (
              <li key={p.name}><strong style={{ color: '#cbd5e1' }}>{p.name}.</strong> {p.note}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function Bar({ p }) {
  // Positive segments stack from zero rightward.
  const segs = [];
  let cursor = 0;
  ['scope1', 'scope2', 'scope3'].forEach((k) => {
    const v = p[k];
    if (v > 0) {
      segs.push({ key: k, value: v, leftPct: valToPct(cursor), widthPct: (v / axisRange) * 100 });
      cursor += v;
    }
  });
  // Negative segments stack from zero leftward (sinks first, then offsets).
  let neg = 0;
  ['sinks', 'offsets'].forEach((k) => {
    const v = p[k];
    if (v < 0) {
      neg += v;
      segs.push({ key: k, value: v, leftPct: valToPct(neg), widthPct: (-v / axisRange) * 100 });
    }
  });
  const netPct = valToPct(sumNet(p));
  return (
    <div style={styles.barTrack}>
      <div style={{ ...styles.zeroLine, left: zeroPct + '%' }} />
      {segs.map((s) => (
        <div
          key={s.key}
          style={styles.seg(s.leftPct, s.widthPct, segColors[s.key])}
          title={`${segLabels[s.key]}: ${s.value > 0 ? '+' : ''}${s.value.toFixed(1)} mt/student`}
        />
      ))}
      <div
        style={styles.netMarker(netPct, p.isUs)}
        title={`Net: ${sumNet(p).toFixed(1)} mt/student`}
      />
    </div>
  );
}

export function PeerComparison() {
  const isNarrow = useIsNarrow();
  const spotRef = useSpotlight();
  const live = useMeasuredScopeTotals();
  const s2 = useMeasuredScope2();
  const livePeers = buildLivePeers(live, s2);
  // Axis tick values for context.
  const ticks = [Math.ceil(axisMin), 0, Math.round(axisMax / 2), Math.round(axisMax)];

  return (
    <div style={styles.wrap}>
      <section ref={spotRef} style={{ ...styles.card, position: 'relative' }} className="kua-card-hover kua-spotlight">
        <div style={styles.head}>
          <h2 style={styles.title}>Per-student emissions by scope, with offsets and sinks</h2>
          <p style={styles.blurb}>
            Each bar splits one school's per-student annual footprint into Scope 1, 2, and 3
            contributions (right of zero) and any drawdowns from on-campus sequestration or
            purchased offsets (left of zero). The vertical line marks the net.
            {' '}<strong style={{ color: '#fbbf24' }}>Read the peer bars as illustrative shapes, not
            published data:</strong> none of these schools publishes a per-student inventory we could
            cite. Exeter and Andover publish reduction targets, Yale publishes percentage progress,
            and for several we found no inventory at all. Only KUA's row is computed from this
            dashboard's own figures — which is exactly why it should not be read as a ranking.
          </p>
          <div style={styles.legend}>
            {Object.entries(segLabels).map(([k, label]) => (
              <div key={k} style={styles.legendItem}>
                <div style={styles.swatch(segColors[k])} />
                <span>{label}</span>
              </div>
            ))}
            <div style={styles.legendItem}>
              <div style={{ ...styles.swatch('#fcd34d'), width: 2, height: 14 }} />
              <span>Net (after sinks &amp; offsets)</span>
            </div>
          </div>
        </div>

        {/* Axis — hidden on narrow viewports where the row layout stacks. */}
        {!isNarrow && (
          <div style={styles.axisRow}>
            <div />
            <div style={styles.axis}>
              {ticks.map((t) => (
                <span key={t} style={{ ...styles.axisLabel, left: valToPct(t) + '%' }}>{t}</span>
              ))}
            </div>
            <div />
          </div>
        )}

        <div style={styles.rows}>
          {livePeers
            .slice()
            .sort((a, b) => sumNet(b) - sumNet(a))
            .map((p) => {
              const net = sumNet(p);
              if (isNarrow) {
                return (
                  <div key={p.name} style={p.isUs ? { ...styles.rowNarrow, ...styles.rowSelf } : styles.rowNarrow}>
                    <div style={styles.rowNarrowHead}>
                      <div>
                        <div style={p.isUs ? styles.nameSelf : styles.name}>{p.name}</div>
                        <div style={styles.nameType}>{typeLabels[p.type]}</div>
                      </div>
                      <div style={p.isUs ? styles.netColSelf : styles.netCol}>
                        net {net.toFixed(1)} mt
                      </div>
                    </div>
                    <Bar p={p} />
                  </div>
                );
              }
              return (
                <div key={p.name} style={p.isUs ? { ...styles.row, ...styles.rowSelf } : styles.row}>
                  <div>
                    <div style={p.isUs ? styles.nameSelf : styles.name}>{p.name}</div>
                    <div style={styles.nameType}>{typeLabels[p.type]}</div>
                  </div>
                  <Bar p={p} />
                  <div style={p.isUs ? styles.netColSelf : styles.netCol}>
                    net {net.toFixed(1)} mt
                  </div>
                </div>
              );
            })}
        </div>

        <PeerNotes peers={livePeers} />
      </section>
    </div>
  );
}
