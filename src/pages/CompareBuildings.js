import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { AnimatedNumber } from '../components/AnimatedNumber.js';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';

// /compare-buildings — side-by-side comparison of any two
// buildings. Answers questions like "Welch vs Kilton — which dorm
// is more efficient?" or "Miller (academic) vs Whittemore
// (athletic) — which has higher per-sqft intensity?"
//
// Default selection: top two by mtCO2e so visitors see a
// meaningful comparison immediately.

export default function CompareBuildings() {
  const { rows } = useMemo(() => computeBuildingEmissions(), []);
  const sorted = useMemo(() => [...rows].sort((a, b) => b.mtCO2e - a.mtCO2e), [rows]);

  const defaultA = sorted[0]?.id || null;
  const defaultB = sorted[1]?.id || null;

  const [aId, setAId] = useState(defaultA);
  const [bId, setBId] = useState(defaultB);

  const a = rows.find((r) => r.id === aId) || null;
  const b = rows.find((r) => r.id === bId) || null;

  return (
    <ModulePage
      title="Compare two buildings"
      subtitle="Pick any two of KUA's tracked buildings + see them side-by-side. Useful for dorm vs dorm comparisons, academic vs athletic intensity, or just curiosity."
      toolbar={
        <button
          type="button"
          onClick={() => window.print()}
          style={styles.printBtn}
          title="Print this comparison"
        >
          🖨 Print
        </button>
      }
    >
      <ModuleSection title="Pick two buildings" hint="">
        <div style={styles.pickerRow}>
          <BuildingPicker label="Building A" value={aId} onChange={setAId} rows={rows} />
          <span style={styles.pickerSep}>vs</span>
          <BuildingPicker label="Building B" value={bId} onChange={setBId} rows={rows} />
        </div>
      </ModuleSection>

      {a && b ? (
        <ModuleSection title="Head-to-head" hint="">
          <div style={styles.grid}>
            <BuildingCard b={a} winner={chooseWinner(a, b)} />
            <BuildingCard b={b} winner={chooseWinner(b, a)} />
          </div>
        </ModuleSection>
      ) : (
        <ModuleSection title="Pick two buildings to compare">
          <p style={styles.fineprint}>Use the dropdowns above.</p>
        </ModuleSection>
      )}

      {a && b && (
        <ModuleSection title="Side-by-side metrics" hint="Each row shows which building wins on that metric (lower is better for energy intensity; higher is better for sqft).">
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '40%' }}>Metric</th>
                <th style={styles.th}>{a.name}</th>
                <th style={styles.th}>{b.name}</th>
                <th style={{ ...styles.th, width: 110 }}>Winner</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Category"      av={a.category}                              bv={b.category}                              type="text" />
              <CompareRow label="Square feet"   av={a.sqft}                                  bv={b.sqft}                                  unit="sqft" higherIsBetter />
              <CompareRow label="Daily occupants" av={a.occupants}                           bv={b.occupants}                             unit="" />
              <CompareRow label="Annual electricity" av={a.annualKwh}                        bv={b.annualKwh}                             unit="kWh" />
              <CompareRow label="Annual emissions" av={a.mtCO2e}                             bv={b.mtCO2e}                                unit="mtCO₂e" decimals={1} />
              <CompareRow label="Intensity" av={a.kgPerSqft}                                 bv={b.kgPerSqft}                             unit="kg/sqft/yr" decimals={1} lowerIsBetter />
              <CompareRow label="Share of campus" av={a.sharePercent}                        bv={b.sharePercent}                          unit="%" decimals={1} />
            </tbody>
          </table>
        </ModuleSection>
      )}

      {a && b && (
        <ModuleSection title="Drill into either building" hint="">
          <div style={styles.linkRow}>
            <Link to={`/buildings/${a.id}`} style={styles.deepLink}>
              {a.name} detail →
            </Link>
            <Link to={`/buildings/${b.id}`} style={styles.deepLink}>
              {b.name} detail →
            </Link>
          </div>
        </ModuleSection>
      )}
    </ModulePage>
  );
}

// Lower intensity (kg/sqft/yr) = winner. Returns 'A', 'B', or 'tie'.
function chooseWinner(self, other) {
  if (!self || !other) return null;
  if (self.kgPerSqft === other.kgPerSqft) return 'tie';
  return self.kgPerSqft < other.kgPerSqft ? 'A' : 'B';
}

function BuildingPicker({ label, value, onChange, rows }) {
  // Group options by category for easier scanning when picking
  // among 19 buildings.
  const grouped = useMemo(() => {
    const m = {};
    for (const r of rows) {
      if (!m[r.category]) m[r.category] = [];
      m[r.category].push(r);
    }
    for (const cat of Object.keys(m)) {
      m[cat].sort((a, b) => a.name.localeCompare(b.name));
    }
    return m;
  }, [rows]);
  return (
    <label style={styles.pickerLabel}>
      {label}:
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={styles.picker}>
        {Object.entries(grouped).map(([cat, items]) => (
          <optgroup key={cat} label={cat}>
            {items.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function BuildingCard({ b, winner }) {
  const isWinner = winner === 'A';
  return (
    <div style={{ ...styles.bldgCard, ...(isWinner ? styles.bldgCardWin : {}) }} className="kua-card-hover">
      <div style={styles.bldgHead}>
        <div style={{ flex: 1 }}>
          <Link to={`/buildings/${b.id}`} style={styles.bldgName}>{b.name}</Link>
          <div style={styles.bldgCategory}>{b.category}</div>
        </div>
        {isWinner && <Pill kind="good">✓ More efficient</Pill>}
      </div>
      <div style={styles.bldgStat}>
        <div style={styles.bldgStatLabel}>Annual emissions</div>
        <div style={styles.bldgStatValue}>
          <AnimatedNumber value={b.mtCO2e} decimals={1} duration={1100} />
          <span style={styles.bldgStatUnit}> mtCO₂e</span>
        </div>
      </div>
      <div style={styles.bldgStat}>
        <div style={styles.bldgStatLabel}>Per-sqft intensity</div>
        <div style={styles.bldgStatValue}>
          <AnimatedNumber value={b.kgPerSqft} decimals={1} duration={1100} />
          <span style={styles.bldgStatUnit}> kg/sqft/yr</span>
        </div>
      </div>
      <div style={styles.bldgStat}>
        <div style={styles.bldgStatLabel}>Square footage</div>
        <div style={styles.bldgStatValue}>
          <AnimatedNumber value={b.sqft} duration={1100} />
          <span style={styles.bldgStatUnit}> sqft</span>
        </div>
      </div>
    </div>
  );
}

function CompareRow({ label, av, bv, unit, decimals = 0, lowerIsBetter, higherIsBetter, type }) {
  if (type === 'text') {
    return (
      <tr>
        <td style={styles.td}>{label}</td>
        <td style={styles.tdNum}>{av}</td>
        <td style={styles.tdNum}>{bv}</td>
        <td style={styles.tdNum}>—</td>
      </tr>
    );
  }
  const fmt = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  let winner = '—';
  if (lowerIsBetter) {
    winner = av < bv ? 'A' : av > bv ? 'B' : 'Tie';
  } else if (higherIsBetter) {
    winner = av > bv ? 'A' : av < bv ? 'B' : 'Tie';
  } else {
    winner = av === bv ? 'Tie' : (av < bv ? 'B' : 'A'); // default: smaller = lower load = good
  }
  return (
    <tr>
      <td style={styles.td}>{label}</td>
      <td style={{ ...styles.tdNum, color: winner === 'A' ? '#86efac' : '#cbd5e1', fontWeight: winner === 'A' ? 700 : 400 }}>
        {fmt(av)} {unit && <span style={styles.tdUnit}>{unit}</span>}
      </td>
      <td style={{ ...styles.tdNum, color: winner === 'B' ? '#86efac' : '#cbd5e1', fontWeight: winner === 'B' ? 700 : 400 }}>
        {fmt(bv)} {unit && <span style={styles.tdUnit}>{unit}</span>}
      </td>
      <td style={styles.tdNum}>
        {winner === 'Tie' ? <Pill kind="neutral">Tie</Pill> : winner === '—' ? '—' : <Pill kind="good">{winner === 'A' ? 'A wins' : 'B wins'}</Pill>}
      </td>
    </tr>
  );
}

const styles = {
  printBtn: { padding: '8px 14px', background: '#0e7490', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' },

  pickerRow: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  pickerLabel: { fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 10 },
  picker: { padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 14, fontFamily: 'inherit', minWidth: 200 },
  pickerSep: { color: '#475569', fontSize: 16, fontWeight: 800, letterSpacing: 1 },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 },
  bldgCard: { padding: '18px 20px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  bldgCardWin: { background: 'linear-gradient(135deg, rgba(8, 51, 24, 0.4) 0%, #0b1220 70%)', border: '1px solid #16a34a', borderLeft: '4px solid #86efac' },
  bldgHead: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  bldgName: { fontSize: 18, fontWeight: 700, color: '#22d3ee', textDecoration: 'none', display: 'block' },
  bldgCategory: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  bldgStat: { marginBottom: 10 },
  bldgStatLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  bldgStatValue: { fontSize: 22, color: '#e5e7eb', fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginTop: 4 },
  bldgStatUnit: { fontSize: 13, color: '#94a3b8', fontWeight: 500 },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, fontSize: 11, borderBottom: '1px solid #1f2937' },
  td: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },
  tdNum: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937', fontVariantNumeric: 'tabular-nums', textAlign: 'left' },
  tdUnit: { color: '#64748b', fontSize: 11, marginLeft: 4 },

  linkRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  deepLink: { padding: '10px 16px', background: '#0f172a', color: '#22d3ee', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: 'none' },

  fineprint: { fontSize: 13, color: '#94a3b8' },
};
