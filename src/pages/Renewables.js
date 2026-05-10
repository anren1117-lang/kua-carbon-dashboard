import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { useMeasuredRenewables } from '../hooks/useMeasuredRenewables.js';

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  list: { marginTop: 24, display: 'grid', gap: 16 },
  card: { background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12, padding: 20 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  name: { fontSize: 20, fontWeight: 600 },
  pill: (color) => ({ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: color + '22', color, border: `1px solid ${color}55`, textTransform: 'uppercase', letterSpacing: 0.6 }),
  detail: { marginTop: 10, color: '#cbd5e1' },
  metricsRow: { marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 },
  metric: { background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, padding: '10px 12px' },
  metricLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValue: { fontSize: 18, fontWeight: 700, color: '#e5e7eb', marginTop: 4, fontVariantNumeric: 'tabular-nums' },
  metricNote: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  tags: { marginTop: 12, fontSize: 13, color: '#94a3b8', display: 'flex', gap: 8, flexWrap: 'wrap' },
  tag: { padding: '4px 8px', background: '#1e293b', borderRadius: 6 },
};

const fmt = (n) => (Number.isFinite(n) ? Number(n).toLocaleString() : '—');

function ProvenancePill({ measured }) {
  const color = measured ? '#22c55e' : '#94a3b8';
  return <span style={styles.pill(color)}>{measured ? 'Measured' : 'No records yet'}</span>;
}

function StatusPill({ state }) {
  const color = state === 'Operational' ? '#22c55e'
    : state === 'Offline' ? '#f59e0b'
    : '#94a3b8';
  return <span style={styles.pill(color)}>{state}</span>;
}

function Metric({ label, value, unit, note }) {
  return (
    <div style={styles.metric}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}{unit ? ` ${unit}` : ''}</div>
      {note && <div style={styles.metricNote}>{note}</div>}
    </div>
  );
}

function Renewables() {
  const r = useMeasuredRenewables();
  const windStatus = r.wind.latest?.status === 'online' ? 'Operational'
    : r.wind.latest?.status === 'decommissioned' ? 'Decommissioned'
    : 'Offline';

  return (
    <div>
      <h1 style={styles.title}>On-Site Renewable Generation</h1>
      <p style={styles.subtitle}>
        Tracked as a first-class category, not buried inside Scope 2. Self-consumption reduces
        Scope 2 directly; grid exports are tracked separately to avoid double-counting.
      </p>

      <EducationalCard
        title="How three different on-site systems each reduce campus emissions"
        sections={[
          {
            heading: 'Solar PV — direct and exported',
            body: [
              'When the array is producing more than the campus is using, the surplus flows back to Liberty\'s grid. New Hampshire net metering means KUA gets credited at the retail rate.',
              'Self-consumed kWh reduce Scope 2 directly: those electrons never came from the grid, so no fossil generation was needed for them.',
              'Exported kWh are tracked as a separate "avoided emissions" line so we don\'t double-count: Liberty serves them to other customers, who then can\'t claim them as zero-carbon.',
            ],
          },
          {
            heading: 'Geothermal — moving heat, not making it',
            body: [
              'A ground-source heat pump moves heat between the building and the earth. It uses electricity, but for every 1 kWh it consumes it can deliver 3–4 kWh of heat — a coefficient of performance (COP) of 3 to 4.',
              'The carbon benefit is counterfactual: we estimate how much heating oil or propane would have been burned to deliver the same heat, and credit the system for that avoided fossil combustion.',
              'Because it\'s an estimate, geothermal data is flagged "estimated" by default rather than "measured."',
            ],
          },
          {
            heading: 'Why the broken wind turbine is still on the dashboard',
            body: 'Hiding offline equipment misrepresents both reality (we have a turbine — it\'s just down) and history (whoever decides whether to restore it needs the historical baseline). The turbine is documented with status, last operational date, and any historical generation we have records of, with zero current output. The same data model accepts live readings the day it\'s restored.',
            citation: 'GHG Protocol Scope 2 Guidance; IPCC AR6 on radiative forcing for net-metering accounting.',
          },
        ]}
      />

      <div style={styles.list}>
        {/* Solar */}
        <div style={styles.card}>
          <div style={styles.head}>
            <h2 style={{ ...styles.name, margin: 0 }}>Solar PV Array</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <ProvenancePill measured={r.solarMeasured} />
              <StatusPill state="Operational" />
            </div>
          </div>
          <div style={styles.detail}>
            Grid-connected through Liberty Utilities net metering. Self-consumed kWh reduce Scope 2
            directly; exports tracked separately as avoided grid emissions to keep accounting transparent.
          </div>
          {r.solarMeasured ? (
            <div style={styles.metricsRow}>
              <Metric label="Gross generation" value={fmt(r.solar.grossKwh)} unit="kWh" note={`${r.solar.periodCount} record${r.solar.periodCount === 1 ? '' : 's'}`} />
              <Metric label="Self-consumed" value={fmt(r.solar.selfKwh)} unit="kWh" note="Reduces Scope 2" />
              <Metric label="Exported" value={fmt(r.solar.exportKwh)} unit="kWh" note="Net-metered to grid" />
              <Metric label="Avoided emissions" value={r.solar.totalAvoidedMt.toFixed(2)} unit="mtCO₂e" note={`${r.solar.avoidedSelfMt.toFixed(2)} self + ${r.solar.avoidedExportMt.toFixed(2)} export`} />
            </div>
          ) : (
            <div style={styles.tags}>
              <span style={styles.tag}>Instantaneous generation (kW)</span>
              <span style={styles.tag}>Cumulative generation (kWh)</span>
              <span style={styles.tag}>Self-consumed vs exported</span>
              <span style={styles.tag}>Capacity factor</span>
            </div>
          )}
        </div>

        {/* Geothermal */}
        <div style={styles.card}>
          <div style={styles.head}>
            <h2 style={{ ...styles.name, margin: 0 }}>Geothermal Ground-Source Heat Pump</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <ProvenancePill measured={r.geothermalMeasured} />
              <StatusPill state="Operational" />
            </div>
          </div>
          <div style={styles.detail}>
            Displaces heating oil and propane rather than producing electricity. Reported in MMBtu of
            thermal output, derived from metered electricity consumption × design coefficient of performance.
            Avoided Scope 1 emissions are clearly labeled as estimates.
          </div>
          {r.geothermalMeasured ? (
            <div style={styles.metricsRow}>
              <Metric label="Electricity consumed" value={fmt(r.geothermal.kwhInput)} unit="kWh" note={`${r.geothermal.periodCount} record${r.geothermal.periodCount === 1 ? '' : 's'}`} />
              <Metric label="Thermal delivered" value={r.geothermal.thermalMmbtu.toFixed(1)} unit="MMBtu" note="kWh × COP × 3412 BTU/kWh" />
              <Metric label="Avoided fossil emissions" value={r.geothermal.avoidedFossilMt.toFixed(2)} unit="mtCO₂e" note={`Heating oil ${r.geothermal.byFuel.heating_oil.toFixed(2)} · Propane ${r.geothermal.byFuel.propane.toFixed(2)}`} />
            </div>
          ) : (
            <div style={styles.tags}>
              <span style={styles.tag}>Electricity consumption (kWh)</span>
              <span style={styles.tag}>Estimated thermal output (MMBtu)</span>
              <span style={styles.tag}>Avoided Scope 1 emissions (estimate)</span>
            </div>
          )}
        </div>

        {/* Wind */}
        <div style={styles.card}>
          <div style={styles.head}>
            <h2 style={{ ...styles.name, margin: 0 }}>Wind Turbine</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <ProvenancePill measured={r.windMeasured} />
              <StatusPill state={windStatus} />
            </div>
          </div>
          <div style={styles.detail}>
            Currently out of service. Documented as an offline asset with rated capacity and last
            operational date, so a future restoration decision has the historical baseline it needs.
            Live data pipe is pre-wired.
          </div>
          {r.windMeasured && r.wind.latest ? (
            <div style={styles.metricsRow}>
              <Metric label="Status as of" value={r.wind.latest.asOfDate || '—'} />
              <Metric label="Rated capacity" value={r.wind.latest.ratedKw != null ? fmt(r.wind.latest.ratedKw) : '—'} unit={r.wind.latest.ratedKw != null ? 'kW' : ''} />
              <Metric label="Last operational" value={r.wind.latest.lastOperationalDate || '—'} />
              <Metric label="Historical generation" value={r.wind.latest.historicalKwh != null ? fmt(r.wind.latest.historicalKwh) : '—'} unit={r.wind.latest.historicalKwh != null ? 'kWh' : ''} />
            </div>
          ) : (
            <div style={styles.tags}>
              <span style={styles.tag}>Rated capacity</span>
              <span style={styles.tag}>Last operational date</span>
              <span style={styles.tag}>Historical generation (where records permit)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Renewables;
