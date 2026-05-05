import React, { useMemo } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { dorms } from '../data/dorms.js';
import { students } from '../data/students.js';
import { buildings } from '../data/buildings.js';
import { envysionSnapshot } from '../data/envysionSnapshot.js';
import { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E } from '../data/gridMix.js';
import { bmsExportMeters } from '../data/bmsExportApr2026.js';
import { getBmsMeterMap } from '../data/bmsExportMapping.js';
import { COMPOSED_ANNUALIZE_FACTOR } from '../data/composedYtd.js';

const KG_PER_KWH = (GRID_MIX_TOTAL_MTCO2E * 1000) / GRID_MIX_TOTAL_KWH;

// Privacy-by-design: every public ranking aggregates at dorm level.
// Individual students appear nowhere on this page. Per the project
// privacy model, individual ranking is opt-in only and gated behind a
// future authenticated view.

export default function StudentChallenges() {
  const totalStudents = students.length;
  const totalOptedIn = students.filter((s) => s.optInLeaderboard).length;

  const dormRows = useMemo(() => {
    // Same priority ladder as /buildings: BMS-mapped first (annualized
    // window total), envysionSnapshot fallback (annualized YTD), then
    // 0. All on the same Year 1 basis so dorm rankings are comparable.
    const buildingsById = Object.fromEntries(buildings.map((b) => [b.id, b]));
    const snapshotById  = Object.fromEntries(envysionSnapshot.map((r) => [r.buildingId, r]));
    const meterMap = getBmsMeterMap();
    return dorms.map((d) => {
      const dormStudents = students.filter((s) => s.dormId === d.id);
      const points = dormStudents.reduce((s, st) => s + st.carbonPoints, 0);
      const mappedMeters = bmsExportMeters.filter((m) => meterMap[m.id] === d.buildingId && m.direction !== 'stuck');
      let kwh = 0;
      if (mappedMeters.length > 0) {
        const windowKwh = mappedMeters.reduce((s, m) => s + m.totalKwh, 0);
        kwh = windowKwh * COMPOSED_ANNUALIZE_FACTOR;
      } else {
        const snap = snapshotById[d.buildingId];
        kwh = (snap?.energyUsedKwh ?? 0) * COMPOSED_ANNUALIZE_FACTOR;
      }
      const mt = (kwh * KG_PER_KWH) / 1000;
      const kgPerStudent = d.population ? (mt * 1000) / d.population : 0;
      return {
        ...d,
        carbonPoints: points,
        electricityKwh: kwh,
        electricityMt: mt,
        kgPerStudent,
      };
    });
  }, []);

  const sortedByPoints = [...dormRows].sort((a, b) => b.carbonPoints - a.carbonPoints);
  const sortedByEfficiency = [...dormRows]
    .filter((r) => r.kgPerStudent > 0)
    .sort((a, b) => a.kgPerStudent - b.kgPerStudent);

  const totalPoints = dormRows.reduce((s, d) => s + d.carbonPoints, 0);

  return (
    <ModulePage
      title="Student Challenges"
      subtitle="Dorm-level competition. Personal identifiers are never shown — every leaderboard aggregates at dorm level. Individual progress is opt-in only and viewable behind a private student account."
    >
      <MetricGrid metrics={[
        { label: 'Active dorms', value: dorms.length, accent: '#22d3ee' },
        { label: 'Students enrolled', value: totalStudents, accent: '#22c55e' },
        { label: 'Opted into leaderboard', value: `${totalOptedIn} (${Math.round((totalOptedIn / totalStudents) * 100)}%)`, accent: '#fbbf24', note: 'Default = opt out' },
        { label: 'Carbon points awarded', value: totalPoints.toLocaleString(), accent: '#86efac' },
      ]} />

      <ModuleSection
        title="Dorm leaderboard — carbon points"
        hint="Points are earned by participating in challenges, completing learning paths, and reporting carpool/low-carbon dining. Sums roll up at dorm level."
      >
        <div style={styles.list}>
          {sortedByPoints.map((d, i) => (
            <div key={d.id} style={styles.row}>
              <div style={styles.rowLeft}>
                <span style={styles.rank}>#{i + 1}</span>
                <div>
                  <div style={styles.rowName}>{d.name}</div>
                  <div style={styles.rowMeta}>{d.population} students · <span style={{ textTransform: 'capitalize' }}>{d.type}</span></div>
                </div>
              </div>
              <div style={styles.points}>
                <div style={styles.pointsValue}>{d.carbonPoints.toLocaleString()}</div>
                <div style={styles.pointsLabel}>points</div>
              </div>
            </div>
          ))}
        </div>
      </ModuleSection>

      <ModuleSection
        title="Lowest electricity per student"
        hint="A different lens: which dorm uses the least electricity per resident? Calibrated against ISO-NE 2024 emission factors."
      >
        <div style={styles.list}>
          {sortedByEfficiency.map((d, i) => (
            <div key={d.id} style={styles.row}>
              <div style={styles.rowLeft}>
                <span style={styles.rank}>#{i + 1}</span>
                <div>
                  <div style={styles.rowName}>{d.name}</div>
                  <div style={styles.rowMeta}>
                    {Math.round(d.electricityKwh).toLocaleString()} kWh · {d.electricityMt.toFixed(2)} mtCO₂e
                  </div>
                </div>
              </div>
              <div style={styles.efficiency}>
                <div style={styles.effValue}>{d.kgPerStudent.toFixed(0)}</div>
                <div style={styles.effLabel}>kg / student</div>
              </div>
            </div>
          ))}
        </div>
      </ModuleSection>

      <ModuleSection
        title="Active weekly challenges"
        hint="Phase-1 challenge slate. Customizable per term."
      >
        <div style={styles.challengeGrid}>
          {[
            { name: 'Lights-Off Hour', description: 'Common-room lights off 9–10 PM each weekday. Tracked at dorm level via meter dips.', accent: '#fbbf24', kind: 'good' },
            { name: 'Meatless Monday plate-pledge', description: 'Choose vegetarian for both Monday meals. Self-reported via dining-app QR.', accent: '#22c55e', kind: 'good' },
            { name: 'Carpool to away-game', description: 'Get to off-campus athletic events with 3+ riders. Driver logs trip with passenger hashes.', accent: '#3b82f6', kind: 'info' },
            { name: 'Compost contamination check', description: 'Per-dorm food-waste sort audit. Cleanest stream wins for the week.', accent: '#a855f7', kind: 'info' },
          ].map((c) => (
            <div key={c.name} style={{ ...styles.challengeCard, borderLeftColor: c.accent }}>
              <div style={styles.challengeHead}>
                <div style={styles.challengeName}>{c.name}</div>
                <Pill kind={c.kind}>weekly</Pill>
              </div>
              <div style={styles.challengeBody}>{c.description}</div>
            </div>
          ))}
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  list: { display: 'grid', gap: 8 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  rowLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  rank: { fontSize: 14, color: '#fbbf24', fontWeight: 800, fontVariantNumeric: 'tabular-nums', minWidth: 32 },
  rowName: { fontSize: 15, color: '#e5e7eb', fontWeight: 600 },
  rowMeta: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  points: { textAlign: 'right' },
  pointsValue: { fontSize: 22, color: '#86efac', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  pointsLabel: { fontSize: 11, color: '#64748b', marginTop: 4 },
  efficiency: { textAlign: 'right' },
  effValue: { fontSize: 22, color: '#22d3ee', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  effLabel: { fontSize: 11, color: '#64748b', marginTop: 4 },

  challengeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 },
  challengeCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 8 },
  challengeHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  challengeName: { fontSize: 15, color: '#e5e7eb', fontWeight: 700 },
  challengeBody: { fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
};
