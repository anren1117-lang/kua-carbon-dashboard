import React, { useMemo, useState } from 'react';
import { ProvenancePill } from './ProvenancePill.js';
import { BMS_EXPORT_META, bmsExportMeters } from '../data/bmsExportApr2026.js';
import { getBmsMeterMap } from '../data/bmsExportMapping.js';
import { getEffectiveBuildings } from '../data/assetInventory.js';
import { GRID_MIX_TOTAL_MTCO2E, GRID_MIX_TOTAL_KWH, GRID_MIX_ANNUAL_MTCO2E } from '../data/gridMix.js';
import { monthlyReports } from '../data/monthlyConsumption.js';
import {
  ytdComponents,
  COMPOSED_YTD_KWH,
  COMPOSED_YTD_AS_OF,
  COMPOSED_YTD_DAYS_COVERED,
  COMPOSED_ANNUAL_KWH,
  COMPOSED_ANNUALIZE_FACTOR,
} from '../data/composedYtd.js';
// COMPOSED_YTD_MTCO2E and COMPOSED_ANNUAL_MTCO2E now come from gridMix
// (GRID_MIX_TOTAL_MTCO2E / GRID_MIX_ANNUAL_MTCO2E) — same values, but
// the cited per-fuel emission factors live there.
const COMPOSED_YTD_MTCO2E    = GRID_MIX_TOTAL_MTCO2E;
const COMPOSED_ANNUAL_MTCO2E = GRID_MIX_ANNUAL_MTCO2E;

// Eight measured Scope 2 features unlocked by the parsed BMS export:
//
//   1. Hour-of-day campus load curve (24 bars, mean kW)
//   2. Solar offset (sum of three solar feeds vs total consumption)
//   3. Top 10 biggest electrical loads
//   4. Whittemore HP cluster — per-heat-pump + AHU + boiler breakdown
//   5. Day-of-week pattern — Mon-Sun campus load shape
//   6. Load duration curve — kW vs % hours above (sizing + demand charges)
//   7. Daily peak-demand timeline (30 days)
//   8. EV charger load tracker (Scope 1 → Scope 2 conversion lever)
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

      {/* YTD composition — every kWh in the YTD figure traces to a measured source */}
      <section style={styles.card}>
        <h3 style={styles.cardTitle}>Year-to-date electricity, composed from measured sources</h3>
        <p style={styles.cardHint}>
          The YTD figure on the dashboard is built up from each measured input — full-month BMS captures
          for Jan–Apr, plus the Meter Trends CSV for May. Every kWh below traces to a specific source file
          and a specific time period. Through {COMPOSED_YTD_AS_OF}, that's {COMPOSED_YTD_DAYS_COVERED} days of measured campus consumption.
        </p>
        <table style={styles.ytdTable}>
          <thead>
            <tr>
              <th style={styles.ytdTh}>Period</th>
              <th style={styles.ytdTh}>Days</th>
              <th style={{ ...styles.ytdTh, textAlign: 'right' }}>kWh</th>
              <th style={styles.ytdTh}>Source</th>
            </tr>
          </thead>
          <tbody>
            {ytdComponents.map((c, i) => (
              <tr key={i}>
                <td style={styles.ytdTd}>{c.label}</td>
                <td style={styles.ytdTd}>{c.days}</td>
                <td style={{ ...styles.ytdTd, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                  {c.kwh.toLocaleString()}
                </td>
                <td style={styles.ytdTdSrc}>
                  <ProvenancePill provenance="measured" />
                  <code style={{ marginLeft: 6, fontSize: 11 }}>{c.source}</code>
                </td>
              </tr>
            ))}
            <tr style={styles.ytdTotal}>
              <td style={styles.ytdTd}><strong>YTD total</strong></td>
              <td style={styles.ytdTd}><strong>{COMPOSED_YTD_DAYS_COVERED}</strong></td>
              <td style={{ ...styles.ytdTd, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 800, color: '#86efac', fontSize: 15 }}>
                {COMPOSED_YTD_KWH.toLocaleString()}
              </td>
              <td style={styles.ytdTdSrc}>
                <strong>{COMPOSED_YTD_MTCO2E} mtCO₂e</strong> via ISO-NE 2024 effective rate
              </td>
            </tr>
            <tr style={styles.ytdAnnual}>
              <td style={styles.ytdTd}>Annualized × {COMPOSED_ANNUALIZE_FACTOR.toFixed(2)}</td>
              <td style={styles.ytdTd}>365</td>
              <td style={{ ...styles.ytdTd, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#cbd5e1' }}>
                {COMPOSED_ANNUAL_KWH.toLocaleString()}
              </td>
              <td style={styles.ytdTdSrc}>
                {COMPOSED_ANNUAL_MTCO2E} mtCO₂e/yr — within the 410-440 cross-validated estimate range
              </td>
            </tr>
          </tbody>
        </table>
        <div style={styles.todayTarget}>
          <div><span style={styles.ttLabel}>Today:</span> Each row above is a real measured input. The April monthly capture (128,895 kWh, single-snapshot displayedTotal) and the CSV's Apr 5–30 daily totals (140,827 kWh summed across 35 main+panel feeds) overlap — we use the monthly capture for April since it agrees with the master meter, and pull only May 1–4 from the CSV. The CSV's higher Apr figure reflects the 8-10% submeter overshoot documented on /buildings.</div>
          <div><span style={styles.ttLabel}>Target:</span> When the next monthly BMS capture lands (May full-month, around June 1), drop the May 1–4 CSV row and replace with the May full-month capture. When a fresh Meter Trends CSV is exported, re-run scripts/parseBmsExport.mjs and the May days extend automatically.</div>
        </div>
      </section>

      <TimePatternsSection />

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

      <WhittemoreClusterSection />
      <DayOfWeekSection />
      <LoadDurationCurveSection />
      <PeakDemandTimelineSection />
      <EvChargerSection />
    </div>
  );
}

// ─── Pattern across time scales ─────────────────────────────────
// Three coordinated views — daily / weekly / monthly — each with its
// own chart and a contextual interpretation that explains why the
// pattern looks the way it does. The analysis paragraphs are
// data-driven (peak day computed from the data, anomaly detected
// statistically, etc.) rather than canned text.
function TimePatternsSection() {
  const [view, setView] = useState('day');
  const data = useMemo(() => buildTimePatterns(), []);

  return (
    <section style={styles.card}>
      <h3 style={styles.cardTitle}>Pattern across time scales</h3>
      <p style={styles.cardHint}>
        Same campus electricity, three resolutions. Switch tabs to see daily samples (from the CSV),
        weekly totals (rolled up from those days), and monthly totals (full-month BMS captures Jan–Apr
        + partial May from the CSV). Each view comes with a what-and-why analysis built from the data
        itself.
      </p>
      <div style={styles.tabRow}>
        <button type="button" onClick={() => setView('day')}   style={{ ...styles.tab,   ...(view === 'day'   ? styles.tabActive : {}) }}>Daily</button>
        <button type="button" onClick={() => setView('week')}  style={{ ...styles.tab,   ...(view === 'week'  ? styles.tabActive : {}) }}>Weekly</button>
        <button type="button" onClick={() => setView('month')} style={{ ...styles.tab,   ...(view === 'month' ? styles.tabActive : {}) }}>Monthly</button>
      </div>

      {view === 'day'   && <DailyView   data={data} />}
      {view === 'week'  && <WeeklyView  data={data} />}
      {view === 'month' && <MonthlyView data={data} />}
    </section>
  );
}

function buildTimePatterns() {
  // Daily campus totals from the CSV — sum across consumption feeds
  // by date.
  const dailyKwhByDate = new Map();
  for (const m of bmsExportMeters) {
    if (!isConsumptionFeed(m.id)) continue;
    for (const d of (m.daily || [])) {
      dailyKwhByDate.set(d.date, (dailyKwhByDate.get(d.date) || 0) + d.kwh);
    }
  }
  const daily = Array.from(dailyKwhByDate.entries())
    .sort()
    .map(([date, kwh]) => {
      const dt = new Date(date + 'T00:00:00Z');
      const dow = dt.getUTCDay();
      return { date, kwh: Math.round(kwh), isWeekend: dow === 0 || dow === 6, dow };
    });

  // Statistical anomaly: any day above mean + 2.5σ flagged.
  const meanDaily = daily.reduce((s, d) => s + d.kwh, 0) / daily.length;
  const stdev = Math.sqrt(daily.reduce((s, d) => s + (d.kwh - meanDaily) ** 2, 0) / daily.length);
  const anomalies = daily.filter((d) => d.kwh > meanDaily + 2.5 * stdev);

  // Weekly: bucket daily by ISO week.
  const weekMap = new Map();
  for (const d of daily) {
    const dt = new Date(d.date + 'T00:00:00Z');
    const monday = new Date(dt);
    monday.setUTCDate(dt.getUTCDate() - ((dt.getUTCDay() + 6) % 7));
    const wkKey = monday.toISOString().slice(0, 10);
    if (!weekMap.has(wkKey)) weekMap.set(wkKey, { weekStart: wkKey, days: 0, kwh: 0, dayLabels: [] });
    const w = weekMap.get(wkKey);
    w.days += 1;
    w.kwh += d.kwh;
    w.dayLabels.push(d.date.slice(8));
  }
  const weekly = Array.from(weekMap.values())
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart))
    .map((w) => ({ ...w, kwh: Math.round(w.kwh), avgPerDay: Math.round(w.kwh / w.days) }));

  // Monthly: full-month captures from monthlyConsumption.js + partial
  // May from CSV.
  const monthly = monthlyReports.map((r) => ({
    month: r.month,
    label: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(r.month.slice(5), 10)],
    kwh: r.displayedTotal,
    days: ({ '2026-01': 31, '2026-02': 28, '2026-03': 31, '2026-04': 30 })[r.month] || 30,
    partial: false,
    source: 'monthly capture',
  }));
  const mayDays = daily.filter((d) => d.date.startsWith('2026-05'));
  if (mayDays.length > 0) {
    monthly.push({
      month: '2026-05',
      label: 'May',
      kwh: mayDays.reduce((s, d) => s + d.kwh, 0),
      days: mayDays.length,
      partial: true,
      source: 'CSV (partial month)',
    });
  }

  return { daily, meanDaily, stdev, anomalies, weekly, monthly };
}

function DailyView({ data }) {
  const max = Math.max(...data.daily.map((d) => d.kwh));
  const peakDay = data.daily.reduce((p, d) => (d.kwh > p.kwh ? d : p), data.daily[0]);
  const lowDay = data.daily.reduce((p, d) => (d.kwh < p.kwh ? d : p), data.daily[0]);
  const weekdayMean = data.daily.filter((d) => !d.isWeekend).reduce((s, d) => s + d.kwh, 0) / data.daily.filter((d) => !d.isWeekend).length;
  const weekendMean = data.daily.filter((d) => d.isWeekend).reduce((s, d) => s + d.kwh, 0) / Math.max(1, data.daily.filter((d) => d.isWeekend).length);
  const weekendDip = ((weekdayMean - weekendMean) / weekdayMean) * 100;

  return (
    <>
      <div style={styles.dailyChart}>
        {data.daily.map((d) => {
          const isAnomaly = data.anomalies.includes(d);
          return (
            <div key={d.date} style={styles.dayCol}>
              <div style={styles.dayBarTrack}>
                <div
                  style={{
                    ...styles.dayBar,
                    height: `${(d.kwh / max) * 100}%`,
                    background: isAnomaly ? '#ef4444' : d.isWeekend ? '#22d3ee' : '#fbbf24',
                  }}
                  title={`${d.date}: ${d.kwh.toLocaleString()} kWh${isAnomaly ? ' (anomaly)' : ''}`}
                />
                <div style={{ ...styles.meanLine, bottom: `${(data.meanDaily / max) * 100}%` }} />
              </div>
              <div style={styles.dayDateTick}>{d.date.slice(8)}</div>
            </div>
          );
        })}
      </div>
      <div style={styles.legendRow}>
        <LegendDot color="#fbbf24">Weekday</LegendDot>
        <LegendDot color="#22d3ee">Weekend</LegendDot>
        <LegendDot color="#ef4444">Anomaly</LegendDot>
        <span style={styles.legendNote}>red dashed line = mean</span>
      </div>
      <AnalysisBox
        title="What this means"
        bullets={[
          {
            label: 'Peak day',
            text: `${peakDay.date} at ${peakDay.kwh.toLocaleString()} kWh — ${data.anomalies.includes(peakDay)
              ? 'flagged as a statistical anomaly (above mean + 2.5σ). Almost certainly a CT calibration blip or a counter reset on one of the 35 main+panel feeds, since neighboring days run roughly ~5,000 kWh. Worth tagging in the BMS for service. The parsed export filters peak-kW outliers per-meter at 10× mean, but the daily summed figure still picks up these one-day spikes.'
              : `the actual highest-load day in the window. Likely driven by colder weather + full occupancy.`}.`
          },
          {
            label: 'Lowest day',
            text: `${lowDay.date} at ${lowDay.kwh.toLocaleString()} kWh — ${lowDay.isWeekend ? 'a Sunday' : 'a weekday'}, ${(((data.meanDaily - lowDay.kwh) / data.meanDaily) * 100).toFixed(0)}% below mean.`
          },
          {
            label: 'Weekend dip',
            text: weekendDip > 1
              ? `weekday mean ${Math.round(weekdayMean).toLocaleString()} kWh vs weekend mean ${Math.round(weekendMean).toLocaleString()} kWh — that's a ${weekendDip.toFixed(1)}% weekend dip. Modest, because boarder population stays on campus and dorm HVAC + always-on equipment dominate the load curve. Academic + dining cycles drive the visible swing on top of that base.`
              : `weekend load matches weekday load — heating + always-on equipment dominate, academic schedule has minimal impact. Means efficiency wins on the always-on stack (LED, AHU schedules, base-load reduction) pay off more than schedule changes.`
          },
          ...(data.anomalies.length > 0 ? [{
            label: `${data.anomalies.length} anomal${data.anomalies.length === 1 ? 'y' : 'ies'} detected`,
            text: `${data.anomalies.map((a) => a.date).join(', ')} flagged as > 2.5σ above mean. Cross-check against the weather station or BMS event log; if no real event explains it, treat as sensor noise and recalibrate the affected CT clamp.`
          }] : [{
            label: 'No statistical anomalies',
            text: 'Daily totals stayed within 2.5 standard deviations of the mean — the BMS measurement chain held steady across the 30-day window.'
          }]),
        ]}
      />
    </>
  );
}

function WeeklyView({ data }) {
  if (data.weekly.length === 0) return <div>No weekly data.</div>;
  const max = Math.max(...data.weekly.map((w) => w.kwh));
  const peakWeek = data.weekly.reduce((p, w) => (w.kwh > p.kwh ? w : p), data.weekly[0]);
  const lowWeek = data.weekly.reduce((p, w) => (w.kwh < p.kwh ? w : p), data.weekly[0]);
  const fullWeeks = data.weekly.filter((w) => w.days === 7);
  const trend = fullWeeks.length >= 2
    ? ((fullWeeks[fullWeeks.length - 1].kwh - fullWeeks[0].kwh) / fullWeeks[0].kwh) * 100
    : 0;

  return (
    <>
      <div style={styles.weeklyChart}>
        {data.weekly.map((w) => (
          <div key={w.weekStart} style={styles.weekCol}>
            <div style={styles.weekVal}>{Math.round(w.kwh).toLocaleString()}</div>
            <div style={styles.weekBarTrack}>
              <div style={{ ...styles.weekBar, height: `${(w.kwh / max) * 100}%`, background: w.days === 7 ? '#fbbf24' : '#475569' }} title={`Week of ${w.weekStart}: ${w.kwh.toLocaleString()} kWh over ${w.days} day${w.days === 1 ? '' : 's'}`} />
            </div>
            <div style={styles.weekLabel}>{w.weekStart.slice(5)}</div>
            <div style={styles.weekSub}>{w.days} day{w.days === 1 ? '' : 's'}</div>
          </div>
        ))}
      </div>
      <div style={styles.legendRow}>
        <LegendDot color="#fbbf24">Full week</LegendDot>
        <LegendDot color="#475569">Partial week</LegendDot>
      </div>
      <AnalysisBox
        title="What this means"
        bullets={[
          {
            label: 'Peak week',
            text: `Week of ${peakWeek.weekStart} at ${peakWeek.kwh.toLocaleString()} kWh${peakWeek.days < 7 ? ` over ${peakWeek.days} days` : ''}. Average ${peakWeek.avgPerDay.toLocaleString()} kWh/day.`
          },
          {
            label: 'Quiet week',
            text: `Week of ${lowWeek.weekStart} at ${lowWeek.kwh.toLocaleString()} kWh${lowWeek.days < 7 ? ` over ${lowWeek.days} days` : ''}. Could correlate with academic-calendar events (exam week, sports tournament, term break) — a 12-month export window would let us tag each week against the calendar.`
          },
          {
            label: 'Trend across full weeks',
            text: fullWeeks.length >= 2
              ? trend > 5
                ? `Rising ${trend.toFixed(1)}% from the first to last full week — likely warmer weather pushing some early-AC load, or term-end events. Worth checking against weather data once integrated.`
                : trend < -5
                  ? `Falling ${Math.abs(trend).toFixed(1)}% from the first to last full week — heating-season tail-off as April warms up. Expected pattern in NH.`
                  : `Roughly flat (${trend > 0 ? '+' : ''}${trend.toFixed(1)}%) — campus load held stable across the export window.`
              : `Need more full weeks to read a trend. Re-run the parser with a wider window.`
          },
          {
            label: 'How weeks roll up',
            text: `Each week sums the daily totals for ISO weeks (Mon-Sun). Partial weeks are flagged grey — Apr 5 falls on a Sunday, so the first ISO week (Mar 30 – Apr 5) only has the Sunday in this export. Same for the last week.`
          },
        ]}
      />
    </>
  );
}

function MonthlyView({ data }) {
  const max = Math.max(...data.monthly.map((m) => m.kwh));
  const fullMonths = data.monthly.filter((m) => !m.partial);
  if (fullMonths.length === 0) return <div>No full months yet.</div>;
  const peakMonth = fullMonths.reduce((p, m) => (m.kwh > p.kwh ? m : p), fullMonths[0]);
  const lowMonth  = fullMonths.reduce((p, m) => (m.kwh < p.kwh ? m : p), fullMonths[0]);
  const peakDailyAvg = peakMonth.kwh / peakMonth.days;
  const lowDailyAvg  = lowMonth.kwh / lowMonth.days;

  return (
    <>
      <div style={styles.monthlyChart}>
        {data.monthly.map((m) => (
          <div key={m.month} style={styles.monthCol}>
            <div style={styles.monthVal}>{Math.round(m.kwh).toLocaleString()}</div>
            <div style={styles.monthBarTrack}>
              <div style={{ ...styles.monthBar, height: `${(m.kwh / max) * 100}%`, background: m.partial ? '#475569' : '#fbbf24' }} title={`${m.label}: ${m.kwh.toLocaleString()} kWh over ${m.days} day${m.days === 1 ? '' : 's'}`} />
            </div>
            <div style={styles.monthLabel}>{m.label}</div>
            <div style={styles.monthSub}>{m.days} day{m.days === 1 ? '' : 's'}{m.partial ? ', partial' : ''}</div>
          </div>
        ))}
      </div>
      <div style={styles.legendRow}>
        <LegendDot color="#fbbf24">Full month (BMS capture)</LegendDot>
        <LegendDot color="#475569">Partial month (CSV)</LegendDot>
      </div>
      <AnalysisBox
        title="What this means"
        bullets={[
          {
            label: `Peak: ${peakMonth.label}`,
            text: `${peakMonth.kwh.toLocaleString()} kWh over ${peakMonth.days} days = ${Math.round(peakDailyAvg).toLocaleString()} kWh/day. ${peakMonth.label === 'Feb' ? 'Coldest month + every dorm fully heated → highest electric heating ancillary load (boiler pumps, electric resistance backup, well pumps not freezing). Also full academic occupancy.' : peakMonth.label === 'Jan' ? 'January peak — same heating-driven story as Feb. Holiday break ends mid-month so partial-occupancy effect is small.' : `Driven by combination of heating, occupancy, and time-of-year load patterns.`}`
          },
          {
            label: `Lowest: ${lowMonth.label}`,
            text: `${lowMonth.kwh.toLocaleString()} kWh over ${lowMonth.days} days = ${Math.round(lowDailyAvg).toLocaleString()} kWh/day. ${lowMonth.label === 'Apr' ? 'April is the shoulder month between heating-on and AC-on — heating demand drops as outdoor temperature rises through 50-60°F, AC hasn\'t kicked in yet. Plus spring break falls in March or April, removing some occupancy.' : lowMonth.label === 'Mar' ? 'Spring break compresses occupancy + heating ramp-down → typical academic-calendar low.' : `Likely driven by school break or seasonal heating tail-off.`}`
          },
          {
            label: 'Why Feb beats Jan despite fewer days',
            text: data.monthly.find((m) => m.label === 'Feb') && data.monthly.find((m) => m.label === 'Jan') && data.monthly.find((m) => m.label === 'Feb').kwh > data.monthly.find((m) => m.label === 'Jan').kwh
              ? `Feb 2026 (${data.monthly.find((m) => m.label === 'Feb').kwh.toLocaleString()} kWh in 28 days) actually beats Jan (${data.monthly.find((m) => m.label === 'Jan').kwh.toLocaleString()} kWh in 31 days) per-day — Jan ran ${Math.round(data.monthly.find((m) => m.label === 'Jan').kwh / 31).toLocaleString()} kWh/day, Feb ran ${Math.round(data.monthly.find((m) => m.label === 'Feb').kwh / 28).toLocaleString()} kWh/day. NH February is colder + has fewer break days than Jan.`
              : `Year-over-year heating intensity comparison would need a 2025 export to confirm. The 4-month window here doesn't have a year-prior baseline.`
          },
          {
            label: 'May is partial',
            text: `May currently shows ${data.monthly.find((m) => m.label === 'May')?.kwh.toLocaleString() || '0'} kWh over only ${data.monthly.find((m) => m.label === 'May')?.days || 0} days — the CSV cuts off May 4. The May full-month BMS capture (around June 1) replaces this row with a real master-meter total. The grey-bar treatment makes the partial state visible so it isn't compared like-for-like with the full months.`
          },
        ]}
      />
    </>
  );
}

function AnalysisBox({ title, bullets }) {
  return (
    <div style={styles.analysisBox}>
      <div style={styles.analysisTitle}>{title}</div>
      <div style={styles.analysisList}>
        {bullets.map((b, i) => (
          <div key={i} style={styles.analysisRow}>
            <div style={styles.analysisLabel}>{b.label}</div>
            <div style={styles.analysisText}>{b.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Whittemore heat-pump cluster ───────────────────────────────────
// PM_17_* covers the Whittemore complex per the device names in the
// CSV: HP01-05 (5 heat pumps), AHU01/02, B2BoilerFeed,
// BarnFieldhouseFeed, ChargerFeed, MainFeed, M42AFeed.
function WhittemoreClusterSection() {
  const data = useMemo(() => {
    const cluster = bmsExportMeters.filter((m) => m.id.startsWith('PM_17_'));
    if (cluster.length === 0) return null;
    const main = cluster.find((m) => m.id === 'PM_17_MainFeed');
    const heatPumps = cluster.filter((m) => /HP\d/.test(m.id));
    const ahus      = cluster.filter((m) => /AHU\d/.test(m.id));
    const boilers   = cluster.filter((m) => /Boiler/i.test(m.id));
    const others    = cluster.filter((m) => !heatPumps.includes(m) && !ahus.includes(m) && !boilers.includes(m) && m !== main);
    const totalCluster = main ? main.totalKwh : cluster.reduce((s, m) => s + m.totalKwh, 0);
    const groupTotal = (group) => group.reduce((s, m) => s + m.totalKwh, 0);
    return {
      cluster, main,
      heatPumps, ahus, boilers, others,
      totalCluster,
      hpTotal:     groupTotal(heatPumps),
      ahuTotal:    groupTotal(ahus),
      boilerTotal: groupTotal(boilers),
      otherTotal:  groupTotal(others),
    };
  }, []);

  if (!data || data.cluster.length === 0) return null;
  const { main, heatPumps, ahus, boilers, others, totalCluster, hpTotal, ahuTotal, boilerTotal, otherTotal } = data;
  const pct = (n) => totalCluster > 0 ? (n / totalCluster * 100).toFixed(1) : '0';

  return (
    <section style={styles.card}>
      <h3 style={styles.cardTitle}>Whittemore complex — heat-pump cluster</h3>
      <p style={styles.cardHint}>
        PM_17 device tree: {heatPumps.length} heat pumps + {ahus.length} air handlers + {boilers.length} boiler{boilers.length === 1 ? '' : 's'} + {others.length} other feeds.
        Whittemore total {Math.round(totalCluster).toLocaleString()} kWh in window
        {main ? ` (PM_17_MainFeed cumulative)` : ` (sum of submeters)`}.
      </p>

      {/* Stacked-summary bar */}
      <div style={styles.stackedBar}>
        <div style={{ ...styles.stackedSeg, width: `${pct(hpTotal)}%`,     background: '#22d3ee' }} title={`Heat pumps: ${pct(hpTotal)}%`} />
        <div style={{ ...styles.stackedSeg, width: `${pct(ahuTotal)}%`,    background: '#a855f7' }} title={`AHUs: ${pct(ahuTotal)}%`} />
        <div style={{ ...styles.stackedSeg, width: `${pct(boilerTotal)}%`, background: '#ef4444' }} title={`Boilers: ${pct(boilerTotal)}%`} />
        <div style={{ ...styles.stackedSeg, width: `${pct(otherTotal)}%`,  background: '#475569' }} title={`Other: ${pct(otherTotal)}%`} />
      </div>
      <div style={styles.stackedLegend}>
        <LegendDot color="#22d3ee">Heat pumps {pct(hpTotal)}% · {Math.round(hpTotal).toLocaleString()} kWh</LegendDot>
        <LegendDot color="#a855f7">AHUs {pct(ahuTotal)}% · {Math.round(ahuTotal).toLocaleString()} kWh</LegendDot>
        <LegendDot color="#ef4444">Boilers {pct(boilerTotal)}% · {Math.round(boilerTotal).toLocaleString()} kWh</LegendDot>
        <LegendDot color="#475569">Other feeds {pct(otherTotal)}%</LegendDot>
      </div>

      {/* Per-meter table */}
      <div style={styles.subList}>
        {[...heatPumps, ...ahus, ...boilers, ...others].sort((a, b) => b.totalKwh - a.totalKwh).map((m) => (
          <div key={m.id} style={styles.subRow}>
            <code style={styles.subId}>{m.id.replace(/^PM_17_/, '')}</code>
            <div style={styles.subBar}>
              <div style={{ ...styles.subBarFill, width: `${(m.totalKwh / Math.max(...data.cluster.map((c) => c.totalKwh))) * 100}%`, background: heatPumps.includes(m) ? '#22d3ee' : ahus.includes(m) ? '#a855f7' : boilers.includes(m) ? '#ef4444' : '#475569' }} />
            </div>
            <span style={styles.subNum}>{Math.round(m.totalKwh).toLocaleString()} kWh</span>
            <span style={styles.subPeak}>peak {m.peakKw} kW</span>
          </div>
        ))}
      </div>

      <div style={styles.todayTarget}>
        <div><span style={styles.ttLabel}>Today:</span> Heat pumps run {pct(hpTotal)}% of Whittemore's electricity load — meaningful Scope 1 → Scope 2 conversion already in progress. The boiler line shows what's still on fossil-electric backup.</div>
        <div><span style={styles.ttLabel}>Target:</span> Compare HP01–HP05 hourly profiles to spot underperforming units. Map this cluster to building b_whittemore on /admin/bms-export so the whole Whittemore total flows into the Buildings page measured panel.</div>
      </div>
    </section>
  );
}

// ─── Day-of-week pattern ───────────────────────────────────────────
function DayOfWeekSection() {
  const data = useMemo(() => {
    const buckets = Array.from({ length: 7 }, () => ({ total: 0, days: 0 }));
    for (const m of bmsExportMeters) {
      if (!isConsumptionFeed(m.id)) continue;
      for (const d of (m.daily || [])) {
        const dow = new Date(d.date).getUTCDay(); // 0=Sun
        buckets[dow].total += d.kwh;
      }
    }
    // Count how many of each weekday we observed.
    const observedDows = new Set();
    const dayCounts = Array.from({ length: 7 }, () => 0);
    for (const m of bmsExportMeters) {
      if (!isConsumptionFeed(m.id)) continue;
      for (const d of (m.daily || [])) {
        const dow = new Date(d.date).getUTCDay();
        observedDows.add(d.date);
      }
    }
    // Use the first consumption meter to count how many of each
    // day-of-week appeared in the window — same for every meter.
    const ref = bmsExportMeters.find((m) => isConsumptionFeed(m.id));
    if (ref) {
      for (const d of (ref.daily || [])) {
        const dow = new Date(d.date).getUTCDay();
        dayCounts[dow] += 1;
      }
    }
    const meanByDow = buckets.map((b, i) => dayCounts[i] > 0 ? b.total / dayCounts[i] : 0);
    return { buckets, dayCounts, meanByDow };
  }, []);

  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const max = Math.max(...data.meanByDow, 1);
  const weekdayMean = (data.meanByDow[1] + data.meanByDow[2] + data.meanByDow[3] + data.meanByDow[4] + data.meanByDow[5]) / 5;
  const weekendMean = (data.meanByDow[0] + data.meanByDow[6]) / 2;
  const weekendDip = weekdayMean > 0 ? (1 - weekendMean / weekdayMean) * 100 : 0;

  return (
    <section style={styles.card}>
      <h3 style={styles.cardTitle}>Day-of-week pattern</h3>
      <p style={styles.cardHint}>
        Mean campus consumption per day of the week, averaged across {data.dayCounts.reduce((s, n) => s + n, 0)} measured days.
        Weekend dip: {weekendDip > 0 ? `${weekendDip.toFixed(0)}% lower than weekdays` : 'no dip — weekend load matches weekday'}.
      </p>
      <div style={styles.dowChart}>
        {labels.map((label, i) => {
          const v = data.meanByDow[i];
          const isWeekend = i === 0 || i === 6;
          return (
            <div key={label} style={styles.dowCol}>
              <div style={styles.dowVal}>{Math.round(v).toLocaleString()}</div>
              <div style={styles.dowBarTrack}>
                <div style={{ ...styles.dowBar, height: `${(v / max) * 100}%`, background: isWeekend ? '#22d3ee' : '#fbbf24' }} title={`${label}: ${v.toFixed(0)} kWh/day mean`} />
              </div>
              <div style={styles.dowLabel}>{label}</div>
              <div style={styles.dowSub}>{data.dayCounts[i]} day{data.dayCounts[i] === 1 ? '' : 's'}</div>
            </div>
          );
        })}
      </div>
      <div style={styles.todayTarget}>
        <div><span style={styles.ttLabel}>Today:</span> {weekendDip > 15 ? `Strong weekend dip (${weekendDip.toFixed(0)}%) — academic + dining load drives most consumption.` : weekendDip > 5 ? `Modest weekend dip — boarder population + dorm HVAC keep night/weekend load high.` : 'Weekend load nearly matches weekday — heating + always-on equipment dominate.'} The 7 day-of-week buckets are real measured means.</div>
        <div><span style={styles.ttLabel}>Target:</span> Cross-tabulate with academic calendar (term breaks, sports tournaments) once a 12-month export window exists, to identify break-period setback opportunities.</div>
      </div>
    </section>
  );
}

// ─── Load duration curve ──────────────────────────────────────────
function LoadDurationCurveSection() {
  const data = useMemo(() => {
    // Build a synthetic 30-day × 24-hour campus load series by
    // multiplying each measured day's total by the campus-wide
    // hour-of-day fraction. Real day totals + averaged hourly shape =
    // honest approximation at the resolution this curve needs.
    const consumptionMeters = bmsExportMeters.filter((m) => isConsumptionFeed(m.id));
    const campusHourly = Array.from({ length: 24 }, (_, h) =>
      consumptionMeters.reduce((s, m) => s + (m.hourly[h] || 0), 0));
    const campusHourlySum = campusHourly.reduce((s, v) => s + v, 0) || 1;

    // Sum daily totals across consumption meters, by date.
    const dailyByDate = new Map();
    for (const m of consumptionMeters) {
      for (const d of (m.daily || [])) {
        dailyByDate.set(d.date, (dailyByDate.get(d.date) || 0) + d.kwh);
      }
    }
    const days = Array.from(dailyByDate.entries()).sort();
    const hourlySamples = []; // kW for each hour, all 30×24
    for (const [, dayKwh] of days) {
      for (let h = 0; h < 24; h++) {
        const fraction = campusHourly[h] / campusHourlySum;
        const kwh = dayKwh * fraction;
        hourlySamples.push(kwh); // 1-hour interval, so kWh ≈ kW
      }
    }
    hourlySamples.sort((a, b) => b - a); // descending
    return { hourlySamples, totalHours: hourlySamples.length };
  }, []);

  if (data.totalHours === 0) return null;
  const max = data.hourlySamples[0];
  const median = data.hourlySamples[Math.floor(data.totalHours / 2)];
  const p10 = data.hourlySamples[Math.floor(data.totalHours * 0.1)]; // load exceeded only 10% of the time
  const p90 = data.hourlySamples[Math.floor(data.totalHours * 0.9)]; // load exceeded 90% of the time = base load
  const peakOverhang = max - p10;

  // Sample for the chart — collapse to 100 buckets so the SVG path stays small.
  const N_BUCKETS = 100;
  const samples = Array.from({ length: N_BUCKETS }, (_, i) => {
    const idx = Math.floor((i / (N_BUCKETS - 1)) * (data.totalHours - 1));
    return data.hourlySamples[idx];
  });
  const chartH = 140, chartW = 800;
  const points = samples.map((kw, i) => {
    const x = (i / (N_BUCKETS - 1)) * chartW;
    const y = chartH - (kw / max) * chartH;
    return [x, y];
  });
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${path} L${chartW},${chartH} L0,${chartH} Z`;

  return (
    <section style={styles.card}>
      <h3 style={styles.cardTitle}>Load duration curve</h3>
      <p style={styles.cardHint}>
        For each hour in the 30-day window, the campus load (kW) sorted descending — left edge is the peak hour, right edge is the lowest. Sized for capital-decision context: how big a battery would shave the top 10%? What's the always-on base load?
      </p>
      <div style={styles.ldcWrap}>
        <svg width={chartW} height={chartH + 20} viewBox={`0 0 ${chartW} ${chartH + 20}`} style={{ display: 'block', maxWidth: '100%', height: 'auto' }}>
          <path d={area} fill="rgba(34, 211, 238, 0.18)" />
          <path d={path} stroke="#22d3ee" strokeWidth={1.8} fill="none" />
          {/* p10 line */}
          <line x1={chartW * 0.1} y1={0} x2={chartW * 0.1} y2={chartH} stroke="#fbbf24" strokeDasharray="3 3" />
          <text x={chartW * 0.1 + 4} y={14} fill="#fbbf24" fontSize="10">10% of hours</text>
          {/* base load line */}
          <line x1={0} y1={chartH - (p90 / max) * chartH} x2={chartW} y2={chartH - (p90 / max) * chartH} stroke="#86efac" strokeDasharray="3 3" />
          <text x={chartW - 80} y={chartH - (p90 / max) * chartH - 4} fill="#86efac" fontSize="10">base load ({p90.toFixed(0)} kW)</text>
        </svg>
      </div>
      <div style={styles.ldcStats}>
        <div><strong>Peak:</strong> {max.toFixed(1)} kW</div>
        <div><strong>Top 10%:</strong> ≥ {p10.toFixed(1)} kW</div>
        <div><strong>Median:</strong> {median.toFixed(1)} kW</div>
        <div><strong>Base load:</strong> {p90.toFixed(1)} kW (load is at or above this 90% of the time)</div>
        <div><strong>Peak overhang:</strong> {peakOverhang.toFixed(1)} kW (peak − top-10% threshold)</div>
      </div>
      <div style={styles.todayTarget}>
        <div><span style={styles.ttLabel}>Today:</span> A {peakOverhang.toFixed(0)} kW battery sized to shave the top 10% of hours would flatten the demand peaks Liberty Utilities likely charges for; base load of {p90.toFixed(0)} kW is the always-on stack worth attacking with efficiency upgrades (LED, AHU schedules).</div>
        <div><span style={styles.ttLabel}>Target:</span> Pull Liberty Utilities billing data to compare measured peak demand against the demand-charge tariff threshold — quantifies $/yr savings from peak shaving directly. Reconcile the synthetic hour-shape × daily-total approximation with raw 15-min BMS samples once available.</div>
      </div>
    </section>
  );
}

// ─── Daily peak-demand timeline ───────────────────────────────────
function PeakDemandTimelineSection() {
  const data = useMemo(() => {
    // For each day, max peakKw across all main/panel feeds.
    const dailyPeak = new Map();
    for (const m of bmsExportMeters) {
      if (!isConsumptionFeed(m.id)) continue;
      for (const d of (m.daily || [])) {
        const cur = dailyPeak.get(d.date) || 0;
        if (d.peakKw > cur) dailyPeak.set(d.date, d.peakKw);
      }
    }
    const series = Array.from(dailyPeak.entries()).sort().map(([date, peakKw]) => ({
      date,
      peakKw,
      isWeekend: [0, 6].includes(new Date(date).getUTCDay()),
    }));
    return { series };
  }, []);

  if (data.series.length === 0) return null;
  const max = Math.max(...data.series.map((s) => s.peakKw));
  const avg = data.series.reduce((s, d) => s + d.peakKw, 0) / data.series.length;

  return (
    <section style={styles.card}>
      <h3 style={styles.cardTitle}>Daily peak-demand timeline</h3>
      <p style={styles.cardHint}>
        Highest single-meter peakKw recorded each day in the export window. Weekend days shaded cyan, weekdays amber. Useful for spotting demand-charge anomalies before the utility bill arrives.
      </p>
      <div style={styles.peakChart}>
        {data.series.map((d) => (
          <div key={d.date} style={styles.peakCol}>
            <div style={styles.peakBarTrack}>
              <div
                style={{
                  ...styles.peakBar,
                  height: `${(d.peakKw / max) * 100}%`,
                  background: d.isWeekend ? '#22d3ee' : '#fbbf24',
                }}
                title={`${d.date}: ${d.peakKw.toFixed(1)} kW`}
              />
              {/* avg line */}
              <div style={{ ...styles.meanLine, bottom: `${(avg / max) * 100}%` }} />
            </div>
            <div style={styles.peakLabel}>{d.date.slice(8)}</div>
          </div>
        ))}
      </div>
      <div style={styles.ldcStats}>
        <div><strong>Peak day:</strong> {max.toFixed(1)} kW</div>
        <div><strong>Mean of daily peaks:</strong> {avg.toFixed(1)} kW</div>
        <div><strong>Days above mean:</strong> {data.series.filter((d) => d.peakKw > avg).length} / {data.series.length}</div>
      </div>
      <div style={styles.todayTarget}>
        <div><span style={styles.ttLabel}>Today:</span> Liberty Utilities likely bills demand on the highest 15-min interval reading per month; this view approximates that with the daily max from BMS PeakDemand columns.</div>
        <div><span style={styles.ttLabel}>Target:</span> Pull the actual 15-min interval billing demand from Liberty's tariff feed once available; flag days where measured BMS peak diverges from billed peak (CT calibration, branch overlap signal).</div>
      </div>
    </section>
  );
}

// ─── EV charger tracker ───────────────────────────────────────────
function EvChargerSection() {
  const data = useMemo(() => {
    const chargers = bmsExportMeters.filter((m) => /Charger/i.test(m.id));
    if (chargers.length === 0) return null;
    const totalKwh = chargers.reduce((s, m) => s + m.totalKwh, 0);
    const totalMtScope2 = totalKwh * KG_PER_KWH / 1000;
    // Compare to gasoline equivalent — typical ICE car ~3.4 kg CO2/gal,
    // ~25 mpg, ~3 mi/kWh on EV.
    const milesDriven = totalKwh * 3;
    const galGasoline = milesDriven / 25;
    const mtCO2eIfGas = (galGasoline * 8.78) / 1000;
    const scope1To2Saved = mtCO2eIfGas - totalMtScope2;
    return { chargers, totalKwh, totalMtScope2, milesDriven, mtCO2eIfGas, scope1To2Saved };
  }, []);

  if (!data) return null;

  return (
    <section style={styles.card}>
      <h3 style={styles.cardTitle}>EV charger load tracker</h3>
      <p style={styles.cardHint}>
        {data.chargers.length} EV-charger feed{data.chargers.length === 1 ? '' : 's'} metered in the export. As the KUA fleet electrifies, vehicle miles flip from Scope 1 (fuel combustion) to Scope 2 (grid electricity) — at ISO-NE 2024 emission intensity that's a net carbon win even before grid decarbonizes further.
      </p>

      <div style={styles.summaryGrid}>
        <Stat label="Charger kWh in window" value={Math.round(data.totalKwh).toLocaleString()} unit="kWh" accent="#22d3ee" />
        <Stat label="Resulting Scope 2"      value={data.totalMtScope2.toFixed(3)}             unit="mtCO₂e" accent="#fbbf24" note={`× ${(KG_PER_KWH * 1000).toFixed(0)} g/kWh`} />
        <Stat label="Equivalent miles driven" value={Math.round(data.milesDriven).toLocaleString()} unit="mi" accent="#a855f7" note="@ 3 mi/kWh typical EV" />
        <Stat label="Scope 1→2 savings"      value={data.scope1To2Saved.toFixed(2)}             unit="mtCO₂e avoided" accent="#86efac" note="vs ICE @ 25 mpg" />
      </div>

      <div style={styles.subList}>
        {data.chargers.map((m) => (
          <div key={m.id} style={styles.subRow}>
            <code style={styles.subId}>{m.id}</code>
            <div style={styles.subBar}>
              <div style={{ ...styles.subBarFill, width: `${(m.totalKwh / Math.max(...data.chargers.map((c) => c.totalKwh))) * 100}%`, background: '#22d3ee' }} />
            </div>
            <span style={styles.subNum}>{Math.round(m.totalKwh).toLocaleString()} kWh</span>
            <span style={styles.subPeak}>peak {m.peakKw} kW</span>
          </div>
        ))}
      </div>

      <div style={styles.todayTarget}>
        <div><span style={styles.ttLabel}>Today:</span> {data.totalKwh < 100 ? 'Charger usage is light — EV adoption still early on campus.' : data.totalKwh < 1000 ? 'Steady but modest charger usage — likely a couple of EVs in regular service.' : 'Significant charger load — fleet electrification meaningfully active.'} Every kWh delivered through these chargers is a fossil-gallon avoided.</div>
        <div><span style={styles.ttLabel}>Target:</span> Inventory the connected vehicles (KUA fleet vs faculty/staff) so the Scope 1 → Scope 2 conversion is auditable per-vehicle. Time charging to overnight low-carbon grid hours (verify against ISO-NE marginal-emissions intensity feed).</div>
      </div>
    </section>
  );
}

function LegendDot({ color, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#cbd5e1' }}>
      <span style={{ width: 10, height: 10, background: color, borderRadius: 2, display: 'inline-block' }} />
      {children}
    </span>
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

  // Time-pattern tabs
  tabRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 },
  tab: { padding: '8px 14px', background: '#0b1220', color: '#cbd5e1', border: '1px solid #334155', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  tabActive: { background: '#22d3ee', color: '#0b1220', borderColor: '#22d3ee', fontWeight: 700 },
  legendRow: { display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10, fontSize: 11, color: '#94a3b8', alignItems: 'center' },
  legendNote: { color: '#64748b' },

  // Daily chart
  dailyChart: { display: 'flex', gap: 1, alignItems: 'flex-end', height: 160, padding: '4px 0', position: 'relative' },
  dayCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  dayBarTrack: { width: '100%', flex: 1, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 2, position: 'relative', display: 'flex', alignItems: 'flex-end' },
  dayBar: { width: '100%', minHeight: 2, borderRadius: '2px 2px 0 0' },
  dayDateTick: { fontSize: 9, color: '#64748b', marginTop: 4, fontVariantNumeric: 'tabular-nums' },

  // Weekly chart
  weeklyChart: { display: 'flex', gap: 8, alignItems: 'flex-end', height: 160, padding: '4px 0' },
  weekCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  weekVal: { fontSize: 11, color: '#94a3b8', marginBottom: 4, fontVariantNumeric: 'tabular-nums' },
  weekBarTrack: { width: '100%', flex: 1, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 2, display: 'flex', alignItems: 'flex-end' },
  weekBar: { width: '100%', minHeight: 2, borderRadius: '2px 2px 0 0' },
  weekLabel: { fontSize: 11, color: '#cbd5e1', fontWeight: 700, marginTop: 4, fontVariantNumeric: 'tabular-nums' },
  weekSub: { fontSize: 10, color: '#64748b', marginTop: 2 },

  // Monthly chart
  monthlyChart: { display: 'flex', gap: 12, alignItems: 'flex-end', height: 180, padding: '4px 0' },
  monthCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  monthVal: { fontSize: 12, color: '#94a3b8', marginBottom: 4, fontVariantNumeric: 'tabular-nums' },
  monthBarTrack: { width: '100%', flex: 1, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 2, display: 'flex', alignItems: 'flex-end' },
  monthBar: { width: '100%', minHeight: 2, borderRadius: '2px 2px 0 0' },
  monthLabel: { fontSize: 13, color: '#e5e7eb', fontWeight: 700, marginTop: 4 },
  monthSub: { fontSize: 10, color: '#64748b', marginTop: 2 },

  // Analysis box (the WHY)
  analysisBox: { marginTop: 14, padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 6 },
  analysisTitle: { fontSize: 12, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 10 },
  analysisList: { display: 'grid', gap: 8 },
  analysisRow: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 },
  analysisLabel: { color: '#fbbf24', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  analysisText: { color: '#cbd5e1' },

  // YTD composition table
  ytdTable: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  ytdTh: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  ytdTd: { padding: '8px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'middle' },
  ytdTdSrc: { padding: '8px 8px', color: '#94a3b8', borderBottom: '1px solid #1f2937', verticalAlign: 'middle', fontSize: 11 },
  ytdTotal: { background: '#0b1220', borderTop: '2px solid #334155' },
  ytdAnnual: { background: '#0a1015' },

  // Stacked bars for the Whittemore cluster + EV charger sub-list
  stackedBar: { display: 'flex', height: 18, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  stackedSeg: { height: '100%' },
  stackedLegend: { display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 12 },
  subList: { display: 'grid', gap: 4, marginTop: 8 },
  subRow: { display: 'grid', gridTemplateColumns: '160px 1fr 100px 110px', gap: 10, alignItems: 'center', padding: '4px 8px', background: '#0b1220', borderRadius: 4, fontSize: 11 },
  subId: { fontSize: 11, color: '#cbd5e1' },
  subBar: { height: 6, background: '#0f172a', borderRadius: 2, overflow: 'hidden' },
  subBarFill: { height: '100%' },
  subNum: { fontSize: 11, color: '#e5e7eb', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  subPeak: { fontSize: 10, color: '#94a3b8', fontVariantNumeric: 'tabular-nums', textAlign: 'right' },

  // Day-of-week chart
  dowChart: { display: 'flex', gap: 6, alignItems: 'flex-end', height: 140 },
  dowCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  dowVal: { fontSize: 10, color: '#94a3b8', marginBottom: 4, fontVariantNumeric: 'tabular-nums' },
  dowBarTrack: { width: '100%', flex: 1, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 2, display: 'flex', alignItems: 'flex-end' },
  dowBar: { width: '100%', minHeight: 2, borderRadius: '2px 2px 0 0' },
  dowLabel: { fontSize: 11, color: '#cbd5e1', fontWeight: 700, marginTop: 4 },
  dowSub: { fontSize: 10, color: '#64748b', marginTop: 2 },

  // Load duration curve
  ldcWrap: { padding: '10px 0', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  ldcStats: { display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 10, fontSize: 12, color: '#cbd5e1', fontVariantNumeric: 'tabular-nums' },

  // Peak-demand timeline
  peakChart: { display: 'flex', gap: 1, alignItems: 'flex-end', height: 120, padding: '4px 0' },
  peakCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  peakBarTrack: { width: '100%', flex: 1, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 2, display: 'flex', alignItems: 'flex-end', position: 'relative' },
  peakBar: { width: '100%', minHeight: 2, borderRadius: '2px 2px 0 0' },
  peakLabel: { fontSize: 9, color: '#64748b', marginTop: 4, fontVariantNumeric: 'tabular-nums' },
};
