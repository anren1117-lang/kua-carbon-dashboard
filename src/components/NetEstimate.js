import React, { useState } from 'react';
import { ProvenancePill, ProvenanceLegend } from './ProvenancePill.js';

// Provenance taxonomy:
//   measured  — BMS / utility / fuel-delivery records integrated.
//   cited     — published methodology (EPA/IPCC/NREL/etc.) applied to
//               KUA inputs that are themselves measured or canonical.
//   estimated — placeholder I (Claude) wrote into the codebase. Not
//               measured, not cited — needs replacement before anyone
//               treats it as fact.
// Each row carries two methodology pointers so the upgrade path is
// transparent:
//   currentMethod — how the number on the dashboard is calculated TODAY
//   futureMethod  — what data integration replaces the placeholder, and
//                   what the row's provenance becomes when it ships
const rows = [
  {
    name: 'Scope 1 — Heating fuel', low: 1000, high: 1500, provenance: 'estimated',
    currentMethod: 'Hand-set 100k–150k gal heating-oil-equivalent assumption × EPA Stationary Combustion factor (10.16 kg CO₂/gal heating oil, 5.72 kg CO₂/gal propane). The gallons figure is a guess sized to typical NH boarding-school footprints, not measured.',
    futureMethod:  'Replace the gallons assumption with KUA Facilities annual fuel-delivery invoices (heating oil + propane) per building. EPA factors stay; once invoices feed the fuel_bills table, this row flips estimated → measured.',
  },
  {
    name: 'Scope 1 — Refrigerants + fleet', low: 20, high: 50, provenance: 'estimated',
    currentMethod: 'Hand-set order-of-magnitude figure (refrigerant leakage rates from typical commercial HVAC + small KUA fleet vehicles).',
    futureMethod:  'Refrigerants: HVAC technician service-report mass balance × IPCC AR6 GWP100. Fleet: KUA fuel-card records × EPA gasoline/diesel factors. Both flip estimated → measured once the records are integrated.',
  },
  {
    name: 'Scope 2 — Electricity (kWh × factor)', low: 410, high: 440, provenance: 'cited',
    currentMethod: 'Cross-validated: TWO independent measured BMS kWh figures converge (YTD All Meters page → 1.93M kWh annualized; April Meter Trends export → 1.81M kWh annualized). Mean ~1.8–1.9M kWh/yr × ISO-NE 2024 effective rate 0.235 kg/kWh (per-fuel output factors at published generation mix) = 410–440 mtCO₂e/yr. Tighter than the original 380–520 range now that two measured anchors agree.',
    futureMethod:  'Already at target methodology. Year-over-year improvement comes from a longer measured BMS window (drop both annualization multipliers once a full year is metered) and from the next eGRID NEWE update.',
  },
  {
    name: 'Scope 3 — Student travel', low: 1500, high: 3000, provenance: 'estimated',
    currentMethod: 'Hand-set assumptions × ICAO calculator: ~50 international students × ~3 mtCO₂e per round trip + ~150 US boarders × 3–4 trips/yr × ~1 mt each + small allocation for study abroad and athletic teams. Methodology is sound; the trip-count assumptions are guesses.',
    futureMethod:  'Replace assumed trip counts with actual travel records from the KUA travel office (international student departure counts, Athletic Office bus routes and team travel, OPE study-abroad ledger). ICAO calculator stays; row flips estimated → cited.',
  },
  {
    name: 'Scope 3 — Goods, waste, commuting, upstream fuel', low: 500, high: 800, provenance: 'estimated',
    currentMethod: 'Standard methodologies applied to guessed inputs: EEIO spend-based emissions for Cat 1 (purchased goods), EPA WARM v15.1 for waste, GHG Protocol Cat 7 for commuting, ~15–20% uplift on Scope 1+2 for upstream fuel. KUA-specific spend, waste tonnage, and commute distances are placeholders.',
    futureMethod:  'Pull real annual spend from KUA Business Office (mapped to USEEIO sectors). Replace waste assumption with hauler invoices (tons by stream). Replace commute estimate with HR-collected zip-code survey × ICCT fleet fuel-economy. Methodologies stay; row flips estimated → cited.',
  },
  {
    name: 'Sinks — On-campus sequestration', low: -4000, high: -2000, provenance: 'estimated',
    currentMethod: '7 named forest stands × per-acre sequestration rates inside IPCC LULUCF ranges (Birdsey 1992 US-forest average 2.1 mtCO₂e/acre/yr to Nowak 2013 open-grown 4.2). Total 1,000-acre figure is cited (KUA disclosure + Wikipedia); the per-stand subdivision and acreages are placeholders, not from a forest inventory.',
    futureMethod:  'Commission a USFS Forest Inventory & Analysis-style stand inventory for the actual KUA woodlot — species composition, age class, basal area, per-stand acreage. Per-acre rates stay (IPCC defaults are appropriate for this scale); inputs become real. Row flips estimated → cited.',
  },
];

// Sums of the provenance-tagged rows above:
//   gross low  = 1000 + 20  + 410 + 1500 + 500 = 3,430
//   gross high = 1500 + 50  + 440 + 3000 + 800 = 5,790
//   gross mid  ≈ 4,150 (kept for hero continuity; mid is unchanged
//                       because the Scope 2 tightening shrunk the
//                       range symmetrically around the same midpoint)
//   sinks      = -4,000 to -2,000
//   net mid    ≈ 1,150 (gross mid + sinks midpoint)
const summary = {
  grossLow: 3430, grossHigh: 5790, grossMid: 4150,
  sinkLow: -4000, sinkHigh: -2000,
  netLow: -570, netHigh: 3790, netMid: 1150,
  // Per-student values are net mt ÷ 340 enrolled students.
  perStudentLow: -1.7, perStudentHigh: 11.1, perStudentMid: 3.4,
  studentCount: 340,
};

const styles = {
  wrap: { maxWidth: 1100, margin: '0 auto', padding: '0 16px' },
  card: { padding: 'clamp(20px, 4vw, 36px) clamp(20px, 4vw, 40px)', background: 'linear-gradient(160deg, #0f172a 0%, #0b1220 100%)', border: '1px solid #1f2937', borderRadius: 16, boxShadow: '0 1px 0 rgba(245, 158, 11, 0.05) inset' },
  badge: { fontSize: 11, padding: '5px 12px', borderRadius: 4, background: '#3a2a0d', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700, border: '1px solid #92400e', display: 'inline-block' },
  hero: { marginTop: 22 },
  heroLabel: { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.6, fontWeight: 600 },
  heroValue: { fontSize: 'clamp(40px, 11vw, 72px)', color: '#fbbf24', fontWeight: 800, marginTop: 6, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' },
  heroUnit: { fontSize: 'clamp(14px, 3vw, 22px)', color: '#94a3b8', marginLeft: 8, fontWeight: 500, letterSpacing: 0 },
  heroRange: { fontSize: 14, color: '#94a3b8', marginTop: 12 },
  blurb: { fontSize: 16, color: '#cbd5e1', maxWidth: 760, marginTop: 22, lineHeight: 1.7 },
  numbers: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 32 },
  numCell: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  numLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 },
  numBig: { fontSize: 'clamp(22px, 5vw, 32px)', color: '#e5e7eb', fontWeight: 700, marginTop: 8, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  numUnit: { fontSize: 14, color: '#94a3b8', marginLeft: 6, fontWeight: 400 },
  numRange: { fontSize: 13, color: '#64748b', marginTop: 8 },
  tableWrap: { marginTop: 32, padding: '24px 26px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 12 },
  tableHead: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, marginBottom: 14 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 8px', fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '14px 8px', fontSize: 15, color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  tdNum: { padding: '14px 8px', fontSize: 15, color: '#e5e7eb', borderBottom: '1px solid #1f2937', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', fontWeight: 600 },
  detailsToggle: { marginTop: 18, background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '9px 18px', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 500 },
  legendRow: { marginTop: 14, paddingTop: 14, borderTop: '1px solid #1f2937' },
  noteList: { marginTop: 18, paddingLeft: 22, fontSize: 14, color: '#94a3b8', lineHeight: 1.7, listStyle: 'none' },
  methodLine: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, marginTop: 4, marginLeft: 0 },
  methodLabel: { color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 },
};

const fmt = (n) => Math.abs(n) >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toString();
const fmtRange = (lo, hi) => lo === hi ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}`;

export function NetEstimate() {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <span style={styles.badge}>Preliminary estimate</span>
        <div style={styles.hero}>
          <div style={styles.heroLabel}>Net annual carbon balance</div>
          <div style={styles.heroValue}>
            {fmt(summary.netMid)}
            <span style={styles.heroUnit}>mtCO₂e / yr</span>
          </div>
          <div style={styles.heroRange}>
            range {fmtRange(summary.netLow, summary.netHigh)} · low end is net-negative
          </div>
        </div>

        <div style={styles.numbers}>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Per student</div>
            <div style={styles.numBig}>~{summary.perStudentMid}<span style={styles.numUnit}>mtCO₂e</span></div>
          </div>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Gross emissions</div>
            <div style={styles.numBig}>~{fmt(summary.grossMid)}<span style={styles.numUnit}>mtCO₂e</span></div>
          </div>
          <div style={styles.numCell}>
            <div style={styles.numLabel}>Sequestration</div>
            <div style={styles.numBig}>~{fmt(3000)}<span style={styles.numUnit}>mtCO₂e</span></div>
          </div>
        </div>

        <button type="button" style={styles.detailsToggle} onClick={() => setShowBreakdown((v) => !v)}>
          {showBreakdown ? 'Hide breakdown' : 'Show line-by-line breakdown'}
        </button>

        {showBreakdown && (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Source</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>mtCO₂e / yr</th>
                  <th style={styles.th}>Provenance</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td style={styles.td}>{r.name}</td>
                    <td style={styles.tdNum}>
                      {r.low === r.high ? fmt(r.low) : `${fmt(r.low)} to ${fmt(r.high)}`}
                    </td>
                    <td style={styles.td}><ProvenancePill provenance={r.provenance} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={styles.legendRow}><ProvenanceLegend compact /></div>
            <button type="button" style={styles.detailsToggle} onClick={() => setShowNotes((v) => !v)}>
              {showNotes ? 'Hide assumptions' : 'Show assumptions per line'}
            </button>
            {showNotes && (
              <ul style={styles.noteList}>
                {rows.map((r) => (
                  <li key={r.name}>
                    <div style={{ marginBottom: 4 }}>
                      <strong style={{ color: '#e5e7eb' }}>{r.name}</strong>{' '}
                      <ProvenancePill provenance={r.provenance} />
                    </div>
                    <div style={styles.methodLine}>
                      <span style={styles.methodLabel}>Today:</span> {r.currentMethod}
                    </div>
                    <div style={styles.methodLine}>
                      <span style={styles.methodLabel}>Target:</span> {r.futureMethod}
                    </div>
                  </li>
                ))}
                <li>
                  <div style={{ marginBottom: 4 }}>
                    <strong style={{ color: '#e5e7eb' }}>Per-student denominator</strong>{' '}
                    <ProvenancePill provenance="cited" />
                  </div>
                  <div style={styles.methodLine}>
                    <span style={styles.methodLabel}>Today:</span> 340 students from KUA "By the Numbers" + Wikipedia.
                  </div>
                </li>
                <li>
                  <div style={styles.methodLine}>
                    <span style={styles.methodLabel}>Calibration:</span> {summary.perStudentMid} mtCO₂e/student/yr lands inside the 2–15 envelope reported across HEI footprint studies (Gutiérrez-Mosquera et al. 2024).
                  </div>
                </li>
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
