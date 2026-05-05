import React, { useMemo, useState } from 'react';
import { ProvenancePill } from './ProvenancePill.js';
import { BMS_EXPORT_META, bmsExportMeters } from '../data/bmsExportApr2026.js';
import { getBmsMeterMap } from '../data/bmsExportMapping.js';
import { getEffectiveBuildings } from '../data/assetInventory.js';
import { GRID_MIX_TOTAL_MTCO2E, GRID_MIX_TOTAL_KWH } from '../data/gridMix.js';

// Three measured Scope 2 features unlocked by the parsed BMS export:
//
//   1. Hour-of-day campus load curve (24 bars, mean kW)
//   2. Solar offset (sum of three solar feeds vs total consumption)
//   3. Top 10 biggest electrical loads
//
// Every number on this panel is MEASURED — kWh comes from BMS
// cumulative-counter diffs across the 30-day export window.

const KG_PER_KWH = (GRID_MIX_TOTAL_MTCO2E * 1000) / GRID_MIX_TOTAL_KWH;
const HOURS_PER_DAY = 24;

// Heuristic: which feeds count toward "consumption"? Main feeds and
// panel feeds. Submeters under main feeds would double-count.
function isConsumptionFeed(meterId) {
  return /MainFeed$|PanelFeed$|MDPFeed$|MDP$|^PM_\d+_Feed$|^PM_\d+_LP$|^PM_\d+_MainFeed$/.test(meterId);
}
function isSolarFeed(meterId) {
  return /Solar/i.test(meterId);
}

export function Scope2BmsInsights() {
  const [topLimit, setTopLimit] = useState(10);

  const insights = useMemo(() => {
    // Hour-of-day curve: average across all main/panel feeds (excludes
    // solar to keep it consumption-side only).
    const hourly = Array.from({ length: HOURS_PER_DAY }, () => 0);
    let consumptionMeterCount = 0;
    let totalConsumptionKwh = 0;
    for (const m of bmsExportMeters) {
      if (!isConsumptionFeed(m.id)) continue;
      consumptionMeterCount += 1;
      totalConsumptionKwh += m.totalKwh;
      for (let h = 0; h < HOURS_PER_DAY; h++) {
        hourly[h] += m.hourly[h] || 0;
      }
    }
    // hourly[h] is now the sum-across-feeds mean kW for that hour.

    // Solar generation: three feeds in the export.
    const solarFeeds = bmsExportMeters.filter((m) => isSolarFeed(m.id));
    const solarKwh = solarFeeds.reduce((s, m) => s + m.totalKwh, 0);
    const solarPeakKw = solarFeeds.reduce((s, m) => Math.max(s, m.peakKw), 0);
    const solarOffsetPct = totalConsumptionKwh > 0 ? (solarKwh / totalConsumptionKwh) * 100 : 0;

    // Total measured emissions in window.
    const totalMt = (totalConsumptionKwh - solarKwh) * KG_PER_KWH / 1000;

    // Hour-of-day kW range and base load.
    const hourMax = Math.max(...hourly);
    const hourMin = Math.min(...hourly);
    const hourMean = hourly.reduce((s, v) => s + v, 0) / HOURS_PER_DAY;
    const peakHourIdx = hourly.indexOf(hourMax);
    const baseHourIdx = hourly.indexOf(hourMin);
    const peakToBaseRatio = hourMin > 0 ? hourMax / hourMin : 0;

    // Top loads ranked by total kWh.
    const topMeters = [...bmsExportMeters]
      .sort((a, b) => b.totalKwh - a.totalKwh)
      .slice(0, topLimit);

    return {
      hourly,
      hourMax, hourMin, hourMean,
      peakHourIdx, baseHourIdx, peakToBaseRatio,
      consumptionMeterCount,
      totalConsumptionKwh,
      solarFeeds,
      solarKwh, solarPeakKw, solarOffsetPct,
      totalMt,
      topMeters,
      windowDays: BMS_EXPORT_META.hoursCovered / 24,
    };
  }, [topLimit]);

  const buildings = useMemo(() => getEffectiveBuildings(), []);
  const buildingNameById = Object.fromEntries(buildings.map((b) => [b.id, b.name]));
  const map = getBmsMeterMap();

  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <h2 style={styles.title}>Live operational insights — BMS export window</h2>
        <p style={styles.subtitle}>
          Real measured electricity data from the parsed Distech Eclypse Meter Trends export
          ({BMS_EXPORT_META.windowStartIso.slice(0, 10)} → {BMS_EXPORT_META.windowEndIso.slice(0, 10)},
          {' '}{insights.windowDays.toFixed(0)} days, {bmsExportMeters.length} power meters). Every figure below is{' '}
          <ProvenancePill provenance="measured" />
          {' '}— sourced from BMS cumulative-kWh counters at hourly resolution.
        </p>
      </header>

      {/* Window summary cards */}
      <div style={styles.summaryGrid}>
        <Stat label="Total kWh consumed"  value={Math.round(insights.totalConsumptionKwh).toLocaleString()} unit="kWh" accent="#fbbf24" />
        <Stat label="Solar generated"      value={Math.round(insights.solarKwh).toLocaleString()}            unit="kWh" accent="#86efac" note={`${insights.solarOffsetPct.toFixed(1)}% of consumption`} />
        <Stat label="Net Scope 2 in window" value={insights.totalMt.toFixed(2)}                              unit="mtCO₂e" accent="#ef4444" note={`× ${(KG_PER_KWH * 1000).toFixed(0)} g/kWh ISO-NE`} />
        <Stat label="Peak hour load"        value={insights.hourMax.toFixed(1)}                              unit="kW" accent="#a855f7" note={`hour ${insights.peakHourIdx}:00`} />
        <Stat label="Base load"             value={insights.hourMin.toFixed(1)}                              unit="kW" accent="#22d3ee" note={`hour ${insights.baseHourIdx}:00`} />
        <Stat label="Peak / base ratio"     value={insights.peakToBaseRatio.toFixed(2) + '×'}                unit=""    accent="#f97316" note="lower = more efficient" />
      </div>

      {/* Hour-of-day load curve */}
      <section style={styles.card}>
        <h3 style={styles.cardTitle}>Hour-of-day campus load curve</h3>
        <p style={styles.cardHint}>
          Sum of {insights.consumptionMeterCount} main- and panel-feed meters, averaged hour-by-hour
          across {insights.windowDays.toFixed(0)} days. Real shape — not the seasonal-pattern proxy.
          Daytime hours (06:00–17:59) shaded amber, nighttime grey. Peak at hour {insights.peakHourIdx}:00,
          base at hour {insights.baseHourIdx}:00.
        </p>
        <HourlyChart hourly={insights.hourly} max={insights.hourMax} mean={insights.hourMean} />
        <div style={styles.todayTarget}>
          <div><span style={styles.ttLabel}>Today:</span> Real measured load shape over 30 days. The {insights.peakToBaseRatio.toFixed(1)}× peak/base ratio means {insights.peakToBaseRatio < 2 ? 'load is mostly baseline (always-on equipment) — efficiency wins are in the always-on stack.' : 'load shifts substantially with occupancy — schedule + setpoint tweaks pay off.'}</div>
          <div><span style={styles.ttLabel}>Target:</span> Cross-reference peak hours with ISO-NE marginal-emissions intensity to identify carbon-shifting windows. Pre-cooling at 04:00–06:00 (low-carbon grid hours) shifts load away from {insights.peakHourIdx}:00 (likely high-carbon peak).</div>
        </div>
      </section>

      {/* Solar offset breakout */}
      {insights.solarFeeds.length > 0 && (
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>On-campus solar offset</h3>
          <p style={styles.cardHint}>
            {insights.solarFeeds.length} solar feed{insights.solarFeeds.length === 1 ? '' : 's'} metered in the BMS export.
            Together they offset {insights.solarOffsetPct.toFixed(1)}% of the campus consumption in this window.
          </p>
          <div style={styles.solarGrid}>
            {insights.solarFeeds.map((s) => {
              const pctOfTotalSolar = insights.solarKwh > 0 ? (s.totalKwh / insights.solarKwh) * 100 : 0;
              return (
                <div key={s.id} style={styles.solarCard}>
                  <div style={styles.solarHeader}>
                    <ProvenancePill provenance="measured" />
                    <code style={styles.solarId}>{s.id}</code>
                  </div>
                  <div style={styles.solarValue}>{Math.round(s.totalKwh).toLocaleString()}<span style={styles.solarUnit}>kWh</span></div>
                  <div style={styles.solarMeta}>
                    peak {s.peakKw} kW · {pctOfTotalSolar.toFixed(0)}% of campus solar
                  </div>
                  <div style={styles.solarMeta}>
                    avoided ~{((s.totalKwh * KG_PER_KWH) / 1000).toFixed(2)} mtCO₂e in window
                  </div>
                </div>
              );
            })}
          </div>
          <div style={styles.todayTarget}>
            <div><span style={styles.ttLabel}>Today:</span> Real measured generation from the existing arrays. {insights.solarOffsetPct < 5 ? 'Offset is small — Phase-2 capacity expansion has high marginal value.' : 'Meaningful offset already — additional capacity has decreasing marginal value.'}</div>
            <div><span style={styles.ttLabel}>Target:</span> Update SOLAR_ANNUAL_KWH on the Executive page to use this measured 30-day generation × 12 (annualized), flips that figure from cited → measured. Track variance vs NREL PVWatts prediction for inverter health.</div>
          </div>
        </section>
      )}

      {/* Top loads */}
      <section style={styles.card}>
        <h3 style={styles.cardTitle}>Top {topLimit} largest electrical loads</h3>
        <p style={styles.cardHint}>
          Ranked by total kWh in the export window. Mapped buildings inherit measured data on /buildings;
          unmapped meters need a building assignment on /admin/bms-export.
        </p>
        <div style={styles.topControls}>
          {[10, 20, 30].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setTopLimit(n)}
              style={{ ...styles.chip, ...(topLimit === n ? styles.chipActive : {}) }}
            >
              Top {n}
            </button>
          ))}
        </div>
        <div style={styles.topList}>
          {insights.topMeters.map((m, i) => {
            const buildingId = map[m.id];
            const buildingName = buildingId ? buildingNameById[buildingId] : null;
            const pctOfCampus = insights.totalConsumptionKwh > 0 ? (m.totalKwh / insights.totalConsumptionKwh) * 100 : 0;
            return (
              <div key={m.id} style={styles.topRow}>
                <div style={styles.topRank}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.topId}>
                    <code>{m.id}</code>
                    {buildingName && <span style={styles.topBuilding}>→ {buildingName}</span>}
                    {!buildingId && <span style={styles.topUnmapped}>unmapped</span>}
                  </div>
                  <div style={styles.topMeta}>
                    {pctOfCampus.toFixed(1)}% of campus · peak {m.peakKw} kW · avg {m.avgKw} kW
                  </div>
                </div>
                <div style={styles.topNum}>
                  {Math.round(m.totalKwh).toLocaleString()}
                  <span style={styles.topNumUnit}>kWh</span>
                </div>
                <div style={styles.topBar}>
                  <div style={{ ...styles.topBarFill, width: `${(m.totalKwh / insights.topMeters[0].totalKwh) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={styles.todayTarget}>
          <div><span style={styles.ttLabel}>Today:</span> Top 3 loads make up roughly {((insights.topMeters.slice(0, 3).reduce((s, m) => s + m.totalKwh, 0) / insights.totalConsumptionKwh) * 100).toFixed(0)}% of measured campus consumption. Efficiency interventions concentrated on the top 10 meters compound faster than spreading effort across the long tail.</div>
          <div><span style={styles.ttLabel}>Target:</span> Map every PM device to a building on /admin/bms-export — once 100% mapped, the dashboard shows MEASURED scope-2 data per building, replacing the seasonal-pattern proxy on /buildings entirely.</div>
        </div>
      </section>
    </div>
  );
}

function HourlyChart({ hourly, max, mean }) {
  const cap = max || 1;
  return (
    <div style={styles.hourChart}>
      {hourly.map((kw, h) => {
        const isDay = h >= 6 && h < 18;
        return (
          <div key={h} style={styles.hourCol}>
            <div style={styles.hourBarTrack}>
              <div
                style={{
                  ...styles.hourBar,
                  height: `${Math.round((kw / cap) * 100)}%`,
                  background: isDay ? '#fbbf24' : '#475569',
                }}
                title={`${h}:00 — ${kw.toFixed(1)} kW`}
              />
              <div style={{ ...styles.meanLine, bottom: `${(mean / cap) * 100}%` }} />
            </div>
            <div style={styles.hourLabel}>{h}</div>
          </div>
        );
      })}
    </div>
  );
}

function Stat({ label, value, unit, accent, note }) {
  return (
    <div style={{ ...styles.stat, borderLeftColor: accent }}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color: accent }}>
        {value}{unit && <span style={styles.statUnit}>{unit}</span>}
      </div>
      {note && <div style={styles.statNote}>{note}</div>}
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 1100, margin: '24px auto 0', padding: '0 16px' },
  header: { padding: '0 0 16px', borderBottom: '1px solid #1f2937', marginBottom: 18 },
  title: { fontSize: 22, color: '#e5e7eb', fontWeight: 700, margin: 0 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 },

  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, marginBottom: 18 },
  stat: { padding: '12px 14px', background: '#0f172a', border: '1px solid #1f2937', borderLeft: '4px solid #fbbf24', borderRadius: 8 },
  statLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 },
  statValue: { fontSize: 22, fontWeight: 800, lineHeight: 1, marginTop: 6, fontVariantNumeric: 'tabular-nums' },
  statUnit: { fontSize: 11, color: '#94a3b8', marginLeft: 4, fontWeight: 600 },
  statNote: { fontSize: 11, color: '#64748b', marginTop: 4 },

  card: { padding: '18px 20px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12, marginBottom: 14 },
  cardTitle: { fontSize: 17, color: '#e5e7eb', fontWeight: 700, margin: 0, marginBottom: 6 },
  cardHint: { fontSize: 13, color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.6 },

  hourChart: { display: 'flex', gap: 2, alignItems: 'flex-end', height: 140, padding: '8px 0' },
  hourCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  hourBarTrack: { width: '100%', flex: 1, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 2, position: 'relative', display: 'flex', alignItems: 'flex-end' },
  hourBar: { width: '100%', borderRadius: '2px 2px 0 0', minHeight: 2 },
  meanLine: { position: 'absolute', left: 0, right: 0, height: 1, background: 'rgba(248,113,113,0.6)' },
  hourLabel: { fontSize: 10, color: '#64748b', marginTop: 4, fontVariantNumeric: 'tabular-nums' },

  solarGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 },
  solarCard: { padding: '12px 14px', background: '#0b1220', border: '1px solid #14532d', borderLeft: '4px solid #22c55e', borderRadius: 6 },
  solarHeader: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' },
  solarId: { fontSize: 11, color: '#cbd5e1' },
  solarValue: { fontSize: 24, color: '#86efac', fontWeight: 800, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 4 },
  solarUnit: { fontSize: 11, color: '#94a3b8', fontWeight: 600 },
  solarMeta: { fontSize: 11, color: '#94a3b8', marginTop: 4 },

  topControls: { display: 'flex', gap: 6, marginBottom: 10 },
  chip: { padding: '6px 12px', background: 'transparent', color: '#cbd5e1', border: '1px solid #334155', borderRadius: 999, fontSize: 12, cursor: 'pointer' },
  chipActive: { background: '#22d3ee', color: '#0b1220', borderColor: '#22d3ee', fontWeight: 700 },

  topList: { display: 'grid', gap: 4 },
  topRow: { display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 10, alignItems: 'center', padding: '8px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, position: 'relative' },
  topRank: { fontSize: 12, color: '#94a3b8', fontWeight: 800, fontVariantNumeric: 'tabular-nums' },
  topId: { fontSize: 12, color: '#e5e7eb', fontWeight: 600, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'baseline' },
  topBuilding: { color: '#86efac', fontSize: 11 },
  topUnmapped: { color: '#fbbf24', fontSize: 10, padding: '2px 6px', background: '#3a2a0d', borderRadius: 3, border: '1px solid #92400e' },
  topMeta: { fontSize: 11, color: '#94a3b8', marginTop: 2, fontVariantNumeric: 'tabular-nums' },
  topNum: { fontSize: 14, color: '#e5e7eb', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  topNumUnit: { fontSize: 10, color: '#94a3b8', marginLeft: 3 },
  topBar: { gridColumn: '1 / -1', height: 3, background: '#0f172a', borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  topBarFill: { height: '100%', background: '#fbbf24' },

  todayTarget: { marginTop: 14, padding: '10px 12px', background: '#0b1220', border: '1px dashed #334155', borderRadius: 6, fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, display: 'grid', gap: 4 },
  ttLabel: { color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 },
};
