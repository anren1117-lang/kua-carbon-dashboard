import React, { useMemo } from 'react';
import { ModulePage, ModuleSection, MetricGrid } from '../components/ModuleShell.js';
import { fleetVehicles, fleetFuelLogs, carpoolTrips, schoolTrips, airTravelRecords } from '../data/transportation.js';
import { staff } from '../data/staff.js';
import { getFactor } from '../data/emissionFactors.js';

export default function Transportation() {
  // Fleet rollup
  const fleetMt = useMemo(() => {
    let mt = 0;
    for (const log of fleetFuelLogs) {
      const v = fleetVehicles.find((vv) => vv.id === log.vehicleId);
      const factorId = v?.fuelType === 'diesel' ? 'ef_diesel' : 'ef_gasoline';
      const f = getFactor(factorId);
      if (f) mt += (log.fuelGallons * f.kgco2e_per_unit) / 1000;
    }
    return mt;
  }, []);
  const fleetGallons = fleetFuelLogs.reduce((s, l) => s + l.fuelGallons, 0);
  const fleetMiles = fleetFuelLogs.reduce((s, l) => s + l.miles, 0);

  // Carpool savings
  const carpoolSavedMt = carpoolTrips.reduce((s, t) => s + t.estimatedKgCO2eAvoided, 0) / 1000;
  const carpoolMiles = carpoolTrips.reduce((s, t) => s + t.avoidedVehicleMiles, 0);
  const carpoolTripsCount = carpoolTrips.length;
  const carpoolPeopleCount = new Set(carpoolTrips.flatMap((t) => [t.driverUserIdHash, ...t.passengerUserIdHashes])).size;

  // Commute mix from staff (since per-staff commute mode is in the staff data)
  const commuteMix = useMemo(() => {
    const out = {};
    for (const s of staff) out[s.commuteMode] = (out[s.commuteMode] || 0) + 1;
    return out;
  }, []);
  const totalCommuters = staff.length;

  // Air travel mt
  const airShortFactor = getFactor('ef_air_short');
  const airLongFactor = getFactor('ef_air_long');
  const airMt = airTravelRecords.reduce((s, r) => {
    const f = r.haul === 'long_haul' ? airLongFactor : airShortFactor;
    return f ? s + (r.passengerMiles * f.kgco2e_per_unit) / 1000 : s;
  }, 0);

  // School trip (bus/van) mt
  const carFactor = getFactor('ef_car_avg');
  const busFactor = getFactor('ef_bus');
  const schoolTripMt = schoolTrips.reduce((s, t) => {
    if (t.mode === 'air') return s; // counted under airTravelRecords
    const factor = t.mode === 'bus' ? busFactor : carFactor;
    return factor ? s + (t.miles * factor.kgco2e_per_unit) / 1000 : s;
  }, 0);

  return (
    <ModulePage
      title="Transportation"
      subtitle="School fleet, school trips, faculty/staff commute, carpool, and student air travel — all the ways KUA's emissions move on wheels and wings."
    >
      <MetricGrid metrics={[
        { label: 'Fleet emissions', value: fleetMt.toFixed(1), unit: 'mtCO₂e/yr', accent: '#3b82f6', note: `${Math.round(fleetGallons).toLocaleString()} gal · ${Math.round(fleetMiles).toLocaleString()} mi` },
        { label: 'Carpool avoided', value: carpoolSavedMt.toFixed(2), unit: 'mtCO₂e', accent: '#86efac', note: `${carpoolTripsCount} trips · ${carpoolPeopleCount} unique people` },
        { label: 'Air travel', value: airMt.toFixed(1), unit: 'mtCO₂e', accent: '#ef4444', note: `${airTravelRecords.length} flight records` },
        { label: 'School trips (ground)', value: schoolTripMt.toFixed(2), unit: 'mtCO₂e', accent: '#fbbf24' },
      ]} />

      <ModuleSection title="Fleet vehicles">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Vehicle</th>
              <th style={styles.th}>Fuel</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>MPG</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Annual miles</th>
            </tr>
          </thead>
          <tbody>
            {fleetVehicles.map((v) => (
              <tr key={v.id}>
                <td style={styles.td}>{v.type}</td>
                <td style={{ ...styles.td, textTransform: 'capitalize' }}>{v.fuelType}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{v.mpg}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{v.annualMiles.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ModuleSection>

      <ModuleSection
        title="Faculty / staff commute mix"
        hint="Aggregated across the staff roster. Individual identities never displayed — staffIdHash only. Solo-drive share is the lever the carpool challenge moves."
      >
        <div style={styles.commuteGrid}>
          {Object.entries(commuteMix)
            .sort(([, a], [, b]) => b - a)
            .map(([mode, count]) => {
              const pct = totalCommuters ? (count / totalCommuters) * 100 : 0;
              return (
                <div key={mode} style={styles.commuteCell}>
                  <div style={styles.commuteMode}>{mode.replace('_', ' ')}</div>
                  <div style={styles.commuteCount}>{count}</div>
                  <div style={styles.commutePct}>{pct.toFixed(0)}%</div>
                  <div style={styles.commuteBar}>
                    <div style={{ ...styles.commuteFill, width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
        </div>
      </ModuleSection>

      <ModuleSection
        title="Recent school trips"
        hint="Air-travel rows are tracked separately so they roll into the air-travel total above."
      >
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Purpose</th>
              <th style={styles.th}>Mode</th>
              <th style={styles.th}>Route</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Miles</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Pax</th>
            </tr>
          </thead>
          <tbody>
            {schoolTrips.map((t) => (
              <tr key={t.tripId}>
                <td style={styles.td}>{t.date}</td>
                <td style={{ ...styles.td, textTransform: 'capitalize' }}>{t.purpose.replace('_', ' ')}</td>
                <td style={{ ...styles.td, textTransform: 'uppercase', fontSize: 11, color: '#94a3b8' }}>{t.mode}</td>
                <td style={styles.td}>{t.origin} → {t.destination}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{t.miles}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{t.passengerCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },

  commuteGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 },
  commuteCell: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  commuteMode: { fontSize: 12, color: '#64748b', textTransform: 'capitalize', fontWeight: 700, letterSpacing: 0.5 },
  commuteCount: { fontSize: 22, color: '#e5e7eb', fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums' },
  commutePct: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  commuteBar: { marginTop: 8, height: 6, background: '#0f172a', borderRadius: 3, overflow: 'hidden' },
  commuteFill: { height: '100%', background: '#22d3ee' },
};
