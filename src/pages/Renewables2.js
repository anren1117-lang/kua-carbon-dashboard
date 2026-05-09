import React from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { EnergyEquivalents } from '../components/EnergyEquivalents.js';
import { solarSites, solarMonthly, SOLAR_ANNUAL_KWH, SOLAR_ANNUAL_EXPORT_KWH } from '../data/renewables.js';
import { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E } from '../data/gridMix.js';
import { getBuilding } from '../data/buildings.js';
import { useMeasuredRenewables } from '../hooks/useMeasuredRenewables.js';

// Renewables OS module — solar generation, exports, avoided emissions.
// Mirrors the "Solar" section of the Eclypse campus dashboard. Lives at
// /renewables-os to avoid colliding with the existing /renewables page
// during transition.

const KG_PER_KWH = (GRID_MIX_TOTAL_MTCO2E * 1000) / GRID_MIX_TOTAL_KWH;

export default function Renewables() {
  const live = useMeasuredRenewables();
  const operational = solarSites.filter((s) => s.status === 'operational');
  const planned     = solarSites.filter((s) => s.status === 'planned');

  // When admins have entered solar records, use those for the
  // headline metrics; otherwise fall back to the model-anchored
  // SOLAR_ANNUAL_KWH (April BMS-anchored × NREL PVWatts seasonal
  // shape) and the cited grid factor.
  const useMeasured = live.solarMeasured && live.solar.grossKwh > 0;
  const annualKwh = useMeasured ? live.solar.grossKwh : SOLAR_ANNUAL_KWH;
  const annualMt = useMeasured ? live.solar.totalAvoidedMt : (SOLAR_ANNUAL_KWH * KG_PER_KWH) / 1000;
  const annualSelfConsumed = useMeasured
    ? live.solar.selfKwh
    : SOLAR_ANNUAL_KWH - SOLAR_ANNUAL_EXPORT_KWH;
  const selfPct = annualKwh > 0 ? Math.round((annualSelfConsumed / annualKwh) * 100) : 0;
  const peak = solarMonthly.reduce((p, m) => Math.max(p, m.kwhGenerated), 0);

  return (
    <ModulePage
      title="Renewables"
      subtitle="On-campus solar, geothermal, and wind. Generation pulls inverter data through the same adapter pattern as electricity meters — currently mock for the Whittemore array, which goes live in 2026."
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Pill kind={useMeasured ? 'good' : 'neutral'}>
          {useMeasured ? `✓ Measured · ${live.solar.periodCount} record${live.solar.periodCount === 1 ? '' : 's'}` : 'Model-anchored projection'}
        </Pill>
        {live.geothermalMeasured && (
          <Pill kind="good">✓ Geothermal measured</Pill>
        )}
        {live.windMeasured && (
          <Pill kind="neutral">Wind documented</Pill>
        )}
      </div>

      <MetricGrid metrics={[
        { label: 'Annual generation',  value: annualKwh.toLocaleString(),  unit: 'kWh', accent: '#22c55e' },
        { label: 'Avoided emissions',  value: annualMt.toFixed(2),         unit: 'mtCO₂e/yr', accent: '#86efac' },
        { label: 'Self-consumed',      value: `${selfPct}%`, accent: '#fbbf24', note: useMeasured ? `${annualSelfConsumed.toLocaleString()} kWh` : 'On-site, no export' },
        { label: 'Operational sites',  value: operational.length, accent: '#22d3ee', note: `${planned.length} more planned` },
      ]} />

      {live.geothermalMeasured && live.geothermal.kwhInput > 0 && (
        <ModuleSection
          title="Geothermal — measured counterfactual"
          hint="Avoided fossil emissions from heat pumps displacing heating oil + propane."
        >
          <MetricGrid metrics={[
            { label: 'Electricity consumed', value: live.geothermal.kwhInput.toLocaleString(), unit: 'kWh', accent: '#22d3ee' },
            { label: 'Thermal delivered',    value: live.geothermal.thermalMmbtu.toFixed(1),   unit: 'MMBtu', accent: '#fbbf24', note: 'kWh × COP × 3412 BTU/kWh' },
            { label: 'Avoided fossil',       value: live.geothermal.avoidedFossilMt.toFixed(2), unit: 'mtCO₂e/yr', accent: '#86efac', note: `Heating oil ${live.geothermal.byFuel.heating_oil.toFixed(2)} · Propane ${live.geothermal.byFuel.propane.toFixed(2)}` },
          ]} />
        </ModuleSection>
      )}

      <ModuleSection
        title="Annual generation as energy equivalents"
        hint="One way to read 'kWh generated': how many of these would the same energy run?"
      >
        <EnergyEquivalents kwh={annualKwh} label={useMeasured ? 'A year of measured campus solar generates roughly' : 'A year of campus solar generates roughly'} />
      </ModuleSection>

      <ModuleSection
        title="Sites"
        hint="Tagged by status. Operational sites are read by the dashboard adapter; planned sites are visible here so timelines stay public."
      >
        <div style={styles.list}>
          {solarSites.map((s) => {
            const b = getBuilding(s.buildingId);
            return (
              <div key={s.id} style={styles.row}>
                <div style={{ flex: 1 }}>
                  <div style={styles.head}>
                    <div style={styles.name}>{s.name}</div>
                    <Pill kind={s.status === 'operational' ? 'good' : s.status === 'planned' ? 'warn' : 'neutral'}>
                      {s.status}
                    </Pill>
                  </div>
                  <div style={styles.meta}>
                    {b?.name ?? s.buildingId} · {s.capacityKwDc} kW DC · commissioned {s.commissionedYear} · {s.provider}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ModuleSection>

      <ModuleSection
        title="Monthly generation pattern"
        hint="NH-latitude solar peaks May–August. Winter generation drops to roughly half summer's output."
      >
        <div style={styles.barList}>
          {solarMonthly.map((m) => (
            <div key={m.month} style={styles.barRow}>
              <div style={styles.barMonth}>{m.month}</div>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${(m.kwhGenerated / peak) * 100}%` }} />
              </div>
              <div style={styles.barNums}>
                <div>{m.kwhGenerated.toLocaleString()} kWh</div>
                <div style={styles.barSub}>CF {(m.capacityFactor * 100).toFixed(1)}% · exported {m.kwhExported}</div>
              </div>
            </div>
          ))}
        </div>
      </ModuleSection>

      <ModuleSection title="Future build-out" hint="What's on KUA's renewables roadmap.">
        <div style={styles.future}>
          <FutureItem
            title="Geothermal field — Bicentennial Hall lawn"
            status="feasibility"
            body="Open-loop or closed-loop ground-source heat pump under the lawn south of Miller. If economics + soil testing work, it would replace ~30% of dorm heating fuel demand."
          />
          <FutureItem
            title="Small-wind turbine — Potato Patch"
            status="feasibility"
            body="A single ~10 kW small-wind unit on the X-Country / mountain-bike land. Marginal kWh contribution, but high educational value and visible from campus."
          />
          <FutureItem
            title="Battery storage on Miller solar"
            status="planned"
            body="Pair the planned Miller solar array with a 50 kWh LFP battery so peak generation displaces evening grid-pull rather than exporting at low rates."
          />
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

function FutureItem({ title, status, body }) {
  return (
    <div style={styles.futureCard}>
      <div style={styles.futureHead}>
        <div style={styles.futureTitle}>{title}</div>
        <Pill kind={status === 'planned' ? 'warn' : 'neutral'}>{status}</Pill>
      </div>
      <div style={styles.futureBody}>{body}</div>
    </div>
  );
}

const styles = {
  list: { display: 'grid', gap: 8 },
  row: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  name: { fontSize: 15, color: '#e5e7eb', fontWeight: 700 },
  meta: { fontSize: 13, color: '#94a3b8', marginTop: 6 },

  barList: { display: 'grid', gap: 6 },
  barRow: { display: 'grid', gridTemplateColumns: '60px 1fr 200px', gap: 10, alignItems: 'center', padding: '6px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  barMonth: { fontSize: 12, color: '#94a3b8', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  barTrack: { height: 12, background: '#0f172a', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', background: 'linear-gradient(90deg, #22c55e, #fbbf24)' },
  barNums: { textAlign: 'right', fontSize: 13, color: '#e5e7eb', fontVariantNumeric: 'tabular-nums' },
  barSub: { fontSize: 11, color: '#64748b', marginTop: 2 },

  future: { display: 'grid', gap: 10 },
  futureCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22c55e', borderRadius: 8 },
  futureHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8 },
  futureTitle: { fontSize: 15, color: '#e5e7eb', fontWeight: 700 },
  futureBody: { fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
};
