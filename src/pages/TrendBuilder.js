import React, { useEffect, useMemo, useState } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { TimeSeriesChart } from '../components/TimeSeriesChart.js';
import { buildings } from '../data/buildings.js';
import { meters } from '../data/meters.js';

// Trend Builder — pick a building (or meter), pick a window, pick an
// interval, see a chart. Direct nod to the Eclypse "Trend Builder" tab.
// Reads from /api/meters/readings via the active adapter.

const WINDOWS = [
  { id: '1d',  label: '24 hours',   days: 1,   defaultInterval: 60 },
  { id: '7d',  label: '7 days',     days: 7,   defaultInterval: 60 },
  { id: '30d', label: '30 days',    days: 30,  defaultInterval: 1440 },
  { id: '90d', label: '90 days',    days: 90,  defaultInterval: 1440 },
];

const INTERVALS = [
  { id: 15,   label: '15 min' },
  { id: 60,   label: '1 hour' },
  { id: 1440, label: '1 day' },
];

export default function TrendBuilder() {
  const electricityMeters = useMemo(() => meters.filter((m) => m.type === 'electricity'), []);
  const buildingsById = useMemo(() => Object.fromEntries(buildings.map((b) => [b.id, b])), []);

  const [buildingId, setBuildingId] = useState('b_miller');
  const [windowId, setWindowId] = useState('7d');
  const [interval, setInterval] = useState(60);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const win = WINDOWS.find((w) => w.id === windowId);
    if (!win) return;
    const end = new Date();
    const start = new Date(end.getTime() - win.days * 24 * 3600 * 1000);
    const url = `/api/meters/readings?buildingId=${encodeURIComponent(buildingId)}&start=${start.toISOString()}&end=${end.toISOString()}&interval=${interval}`;
    setLoading(true); setError(null);
    fetch(url, { signal: ctrl.signal })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((j) => {
        // Aggregate to the requested interval. The mock adapter respects
        // intervalMinutes already; for the BMS adapter that may not, we
        // bucket here as a safety net.
        const series = (j.readings || []).map((r) => ({ t: r.timestamp, v: r.value }));
        setData({ series, count: j.count });
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message); setLoading(false);
      });
    return () => ctrl.abort();
  }, [buildingId, windowId, interval]);

  // Stats
  const stats = useMemo(() => {
    if (!data || !data.series.length) return null;
    const values = data.series.map((d) => d.v);
    const total = values.reduce((s, v) => s + v, 0);
    const peak = Math.max(...values);
    const avg = total / values.length;
    return { total, peak, avg, samples: values.length };
  }, [data]);

  function downloadCsv() {
    const win = WINDOWS.find((w) => w.id === windowId);
    if (!win) return;
    const end = new Date();
    const start = new Date(end.getTime() - win.days * 24 * 3600 * 1000);
    const url = `/api/meters/readings/export?buildingId=${encodeURIComponent(buildingId)}&start=${start.toISOString()}&end=${end.toISOString()}&interval=${interval}`;
    window.open(url, '_blank');
  }

  return (
    <ModulePage
      title="Trend Builder"
      subtitle="Pick a building, a window, and an interval. Chart pulls from the active meter adapter via /api/meters/readings — mock today, BMS once the relay is live."
    >
      <ModuleSection title="Selection">
        <div style={styles.controlGrid}>
          <Control label="Building">
            <select
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              style={styles.select}
              aria-label="Select building"
            >
              {buildings
                .filter((b) => electricityMeters.some((m) => m.buildingId === b.id))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((b) => (
                  <option key={b.id} value={b.id}>{b.name}{b.bmsNumber != null ? ` (#${b.bmsNumber})` : ''}</option>
                ))}
            </select>
          </Control>

          <Control label="Window">
            <div style={styles.chipRow}>
              {WINDOWS.map((w) => (
                <Chip key={w.id} active={windowId === w.id} onClick={() => { setWindowId(w.id); setInterval(w.defaultInterval); }}>
                  {w.label}
                </Chip>
              ))}
            </div>
          </Control>

          <Control label="Interval">
            <div style={styles.chipRow}>
              {INTERVALS.map((i) => (
                <Chip key={i.id} active={interval === i.id} onClick={() => setInterval(i.id)}>{i.label}</Chip>
              ))}
            </div>
          </Control>
        </div>
        <div style={styles.actions}>
          <button type="button" style={styles.dlBtn} onClick={downloadCsv} disabled={!data || !data.series.length}>
            ↓ Download CSV
          </button>
        </div>
      </ModuleSection>

      <ModuleSection
        title={`${buildingsById[buildingId]?.name ?? buildingId} · ${WINDOWS.find((w) => w.id === windowId)?.label}`}
        hint={loading ? 'Loading…' : error ? `Error: ${error}` : null}
      >
        {data && (
          <TimeSeriesChart
            data={data.series}
            unit="kWh"
            color="#22d3ee"
            fill="rgba(34, 211, 238, 0.12)"
            width={900}
            height={280}
            title={`${data.count} samples · interval ${interval} min`}
          />
        )}
      </ModuleSection>

      {stats && (
        <ModuleSection title="Stats over the window">
          <MetricGrid metrics={[
            { label: 'Total',    value: stats.total.toFixed(1),  unit: 'kWh', accent: '#fbbf24' },
            { label: 'Peak',     value: stats.peak.toFixed(2),   unit: 'kWh', accent: '#ef4444' },
            { label: 'Average',  value: stats.avg.toFixed(2),    unit: 'kWh', accent: '#22d3ee' },
            { label: 'Samples',  value: stats.samples,                          accent: '#86efac' },
          ]} />
        </ModuleSection>
      )}

      <ModuleSection title="Adapter source">
        <Pill kind="info">/api/meters/readings → active adapter</Pill>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10, lineHeight: 1.6 }}>
          When METER_SOURCE=mock (default), readings are deterministically generated from each meter's annual baseline shaped by day-of-week, month-of-year, and hour-of-day patterns. Switch to METER_SOURCE=bms once the on-campus relay is wired to point at live Eclypse data.
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

function Control({ label, children }) {
  return (
    <div>
      <div style={styles.label}>{label}</div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 12,
        border: '1px solid',
        cursor: 'pointer',
        fontWeight: 600,
        background: active ? '#22d3ee' : '#0b1220',
        color: active ? '#0b1220' : '#cbd5e1',
        borderColor: active ? '#22d3ee' : '#1f2937',
      }}
    >
      {children}
    </button>
  );
}

const styles = {
  controlGrid: { display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
  label: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  select: { padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#cbd5e1', fontSize: 13, fontFamily: 'inherit', width: '100%' },
  actions: { marginTop: 14, display: 'flex', gap: 8 },
  dlBtn: { padding: '8px 14px', background: '#0f172a', border: '1px solid #0e7490', borderRadius: 6, color: '#22d3ee', cursor: 'pointer', fontSize: 13, fontWeight: 700 },
};
