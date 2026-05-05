import React, { useState, useMemo, useEffect } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { getEffectiveBuildings } from '../data/assetInventory.js';
import { envysionSnapshot } from '../data/envysionSnapshot.js';
import { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E, GRID_MIX_ANNUAL_MTCO2E } from '../data/gridMix.js';
import { monthlyPattern } from '../data/seasonalPatterns.js';
import { campusMonthlyTotals, monthlyReports } from '../data/monthlyConsumption.js';
import { bmsExportMeters } from '../data/bmsExportApr2026.js';
import { getBmsMeterMap } from '../data/bmsExportMapping.js';
import { COMPOSED_ANNUALIZE_FACTOR } from '../data/composedYtd.js';
import { Sparkline } from '../components/Sparkline.js';
import { ProvenancePill } from '../components/ProvenancePill.js';

function useBuildingEnergy(buildingId, enabled) {
  const [state, setState] = useState({ loading: false, data: null, error: null });
  useEffect(() => {
    if (!enabled || !buildingId) return;
    const controller = new AbortController();
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    setState({ loading: true, data: null, error: null });
    fetch(`/api/buildings/${encodeURIComponent(buildingId)}/energy?start=${start.toISOString()}&end=${end.toISOString()}`, {
      signal: controller.signal,
    })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ loading: false, data: null, error: err.message });
      });
    return () => controller.abort();
  }, [buildingId, enabled]);
  return state;
}

const KG_PER_KWH = (GRID_MIX_TOTAL_MTCO2E * 1000) / GRID_MIX_TOTAL_KWH;

const CATEGORY_COLORS = {
  Academic: '#ef4444',
  Athletic: '#3b82f6',
  Dorm:     '#22c55e',
  Dining:   '#fbbf24',
  Other:    '#9ca3af',
};

export default function BuildingsPage() {
  const [sortBy, setSortBy] = useState('kwh');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const rows = useMemo(() => {
    // Per-building energy: prefer BMS-mapped measured data when a PM
    // device is mapped to this building. Fall back to envysionSnapshot
    // (older per-building YTD-through-2026-05-03 snapshot). When neither,
    // surface 0 kWh with a "no data" indicator so the user knows it's
    // unmapped rather than zero-load.
    //
    // Both sources are normalized to the same Year 1 annualized basis
    // before display: BMS gets × COMPOSED_ANNUALIZE_FACTOR (seasonal,
    // ×2.59); snapshot gets the same factor since both windows cover
    // a similarly heating-heavy slice of the year. Mixing YTD with
    // annualized would silently give incomparable numbers across rows.
    const snapshotById = Object.fromEntries(envysionSnapshot.map((r) => [r.buildingId, r]));
    const meterMap = getBmsMeterMap();
    return getEffectiveBuildings().map((b) => {
      const mappedMeters = bmsExportMeters.filter((m) => meterMap[m.id] === b.id && m.direction !== 'stuck');
      let kwh = 0;
      let source = 'none';
      if (mappedMeters.length > 0) {
        const windowKwh = mappedMeters.reduce((s, m) => s + m.totalKwh, 0);
        kwh = windowKwh * COMPOSED_ANNUALIZE_FACTOR;
        source = 'bms';
      } else if (snapshotById[b.id]) {
        const snap = snapshotById[b.id];
        // Annualize the snapshot YTD same as the BMS-mapped figures so
        // the column shows Year 1 across all rows.
        kwh = (snap?.energyUsedKwh ?? 0) * COMPOSED_ANNUALIZE_FACTOR;
        source = 'snapshot';
      }
      const snap = snapshotById[b.id];
      const mt = (kwh * KG_PER_KWH) / 1000;
      return {
        ...b,
        kwh,
        source,
        mappedMeterIds: mappedMeters.map((m) => m.id),
        powerKw: snap?.powerKw ?? null,
        avgVoltage: snap?.avgVoltage ?? null,
        mt,
        kgPerSqft: b.sqft ? (mt * 1000) / b.sqft : 0,
        kgPerOccupant: b.occupants ? (mt * 1000) / b.occupants : 0,
      };
    });
  }, []);

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.category === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'kwh')          return b.kwh - a.kwh;
    if (sortBy === 'sqft')         return b.kgPerSqft - a.kgPerSqft;
    if (sortBy === 'occupant')     return b.kgPerOccupant - a.kgPerOccupant;
    if (sortBy === 'name')         return a.name.localeCompare(b.name);
    return 0;
  });

  const totalKwh = rows.reduce((s, r) => s + r.kwh, 0);
  const totalMt = (totalKwh * KG_PER_KWH) / 1000;
  const totalSqft = rows.reduce((s, r) => s + r.sqft, 0);
  const avgKgPerSqft = totalSqft ? (totalMt * 1000) / totalSqft : 0;

  return (
    <ModulePage
      title="Buildings"
      subtitle="Per-building electricity, intensities, and operational context. Sort by absolute use, by sqft intensity, or by per-occupant intensity to expose different kinds of inefficiency."
    >
      <MetricGrid metrics={[
        { label: 'Buildings monitored', value: rows.length, accent: '#22d3ee' },
        { label: 'Total electricity', value: Math.round(totalKwh).toLocaleString(), unit: 'kWh/yr', accent: '#fbbf24' },
        { label: 'Total emissions', value: totalMt.toFixed(1), unit: 'mtCO₂e', accent: '#ef4444' },
        { label: 'Avg intensity', value: avgKgPerSqft.toFixed(1), unit: 'kg/sqft', accent: '#86efac' },
      ]} />

      <ModuleSection title="Filter & sort">
        <div style={styles.filterRow}>
          <div>
            <div style={styles.label}>Sort by</div>
            <div style={styles.chipRow}>
              {[
                { v: 'kwh', l: 'Absolute kWh' },
                { v: 'sqft', l: 'Intensity (kg/sqft)' },
                { v: 'occupant', l: 'Per occupant' },
                { v: 'name', l: 'Name' },
              ].map((o) => (
                <Chip key={o.v} active={sortBy === o.v} onClick={() => setSortBy(o.v)}>{o.l}</Chip>
              ))}
            </div>
          </div>
          <div>
            <div style={styles.label}>Category</div>
            <div style={styles.chipRow}>
              {['all', 'Academic', 'Athletic', 'Dorm', 'Other'].map((c) => (
                <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>{c === 'all' ? 'All' : c}</Chip>
              ))}
            </div>
          </div>
        </div>
      </ModuleSection>

      <ModuleSection
        title="Campus seasonal pattern"
        hint="Aggregate shape over the year. Winter peaks reflect heating-driven plug load; summer dip is everyone-off-campus. Solid line = months measured from BMS; dashed = months still on the seasonal-pattern proxy."
      >
        {(() => {
          const measuredKeys = new Set(campusMonthlyTotals().map((r) => r.month));
          const measuredCount = measuredKeys.size;
          const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          // monthlyPattern.emissions is calibrated to a legacy ~213 mt
          // annual baseline; rescale so the per-month tooltips match
          // the canonical annual Scope 2 figure.
          const multSum = monthlyPattern.reduce((s, m) => s + m.multiplier, 0);
          const sparkData = monthlyPattern.map((m, i) => ({
            value: +((m.multiplier / multSum) * GRID_MIX_ANNUAL_MTCO2E).toFixed(1),
            measured: measuredKeys.has(`2026-${String(i + 1).padStart(2, '0')}`),
            month: monthLabels[i],
          }));
          return (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <Sparkline
                  data={sparkData}
                  color="#22d3ee"
                  fill="rgba(34, 211, 238, 0.18)"
                  width={420}
                  height={64}
                  strokeWidth={2}
                  showLast
                  formatValue={(v) => `${v.toFixed(1)} mtCO₂e`}
                  formatLabel={(d) => d?.month ?? ''}
                />
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  Jan → Dec, mtCO₂e per month
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                <ProvenancePill provenance="measured" />
                <span style={{ fontSize: 12, color: '#cbd5e1' }}>{measuredCount} month{measuredCount === 1 ? '' : 's'} from KUA Distech Eclypse BMS (solid)</span>
                <span style={{ width: 12 }} />
                <ProvenancePill provenance="estimated" />
                <span style={{ fontSize: 12, color: '#cbd5e1' }}>{12 - measuredCount} month{12 - measuredCount === 1 ? '' : 's'} from seasonal-pattern proxy (dashed)</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
                <span style={{ color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 }}>Today:</span>
                Measured months pull from <code>monthlyConsumption.js</code> (master-meter displayedTotal × ISO-NE 2024 grid factor). Projected months use <code>seasonalPatterns.monthlyPattern</code> — winter heating peak / summer trough shape, scaled to plausible NH magnitudes.
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
                <span style={{ color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 }}>Target:</span>
                Each month flips dashed → solid as its BMS export ships; the seasonal-pattern proxy is removed once a full year is measured (~Jan 2027).
              </div>
            </>
          );
        })()}
      </ModuleSection>

      <ModuleSection
        collapsible
        defaultOpen={false}
        title="Monthly BMS data quality"
        hint='Every captured month from the KUA Distech Eclypse All Meters page carries TWO totals: the master-meter "Totals" row at the bottom, and the sum of the per-building submeter rows. They drift apart from CT calibration, branch overlaps, and untracked load between the main meter and the submeter network. We carry both numbers rather than silently picking one.'
      >
        <div style={styles.qualityList}>
          {monthlyReports.map((r) => {
            const gapPct = ((r.sumOfRows - r.displayedTotal) / r.displayedTotal) * 100;
            const ratio = Math.min(r.displayedTotal, r.sumOfRows) / Math.max(r.displayedTotal, r.sumOfRows);
            // Parse as local date (year, month-1, day) instead of
            // `new Date('YYYY-MM-01')` which is interpreted as UTC
            // midnight. For any user west of UTC (KUA's audience, all
            // ET) that's 7pm the prior day — "January 2026" rendered
            // as "December 2025" off the Buildings page heading.
            const [yyyy, mm] = r.month.split('-').map((s) => parseInt(s, 10));
            const monthName = new Date(yyyy, mm - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
            return (
              <div key={r.month} style={styles.qualityRow}>
                <div style={styles.qualityMonthCol}>
                  <div style={styles.qualityMonth}>{monthName}</div>
                  <div style={styles.qualityCaptured}>captured {r.capturedAt}</div>
                  <div style={{ marginTop: 6 }}><ProvenancePill provenance="measured" /></div>
                </div>
                <div style={styles.qualityBarsCol}>
                  <div style={styles.qualityRowBar}>
                    <div style={styles.qualityBarLabel}>
                      Master-meter total
                      <span style={styles.qualityBarBadge}>source of truth</span>
                    </div>
                    <div style={styles.qualityBarTrack}>
                      <div style={{ ...styles.qualityBarFill, width: '100%', background: '#22c55e' }} />
                      <span style={styles.qualityBarValue}>{r.displayedTotal.toLocaleString()} kWh</span>
                    </div>
                  </div>
                  <div style={styles.qualityRowBar}>
                    <div style={styles.qualityBarLabel}>
                      Sum of {r.rows.length} submeters
                      <span style={{ ...styles.qualityBarBadge, color: '#fbbf24', borderColor: '#92400e' }}>
                        +{gapPct.toFixed(1)}% over master
                      </span>
                    </div>
                    <div style={styles.qualityBarTrack}>
                      <div style={{ ...styles.qualityBarFill, width: `${(r.sumOfRows / Math.max(r.sumOfRows, r.displayedTotal)) * 100}%`, background: '#fbbf24' }} />
                      <span style={styles.qualityBarValue}>{r.sumOfRows.toLocaleString()} kWh</span>
                    </div>
                  </div>
                  <div style={styles.qualityGap}>
                    Gap: {(r.sumOfRows - r.displayedTotal).toLocaleString()} kWh ({gapPct.toFixed(1)}% submeter over master) · agreement {(ratio * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={styles.qualityFooter}>
          <div style={styles.qualityMethodLine}>
            <span style={styles.qualityMethodLabel}>Today:</span>
            Master-meter "displayedTotal" is what the BMS itself reports as the campus total — that's the figure we use for Scope 2 emissions math (gridMix.js GRID_MIX_TOTAL_KWH). The per-building submeter rows are useful for relative ranking (which dorm uses more than which) but the absolute numbers consistently overshoot by 8–10% across all four captured months — a stable, systematic offset, not a one-off anomaly.
          </div>
          <div style={styles.qualityMethodLine}>
            <span style={styles.qualityMethodLabel}>Target:</span>
            Calibrate the CT (current transformer) clamps on each submeter circuit until the sum of submeter rows lands within 3% of the master meter. Investigate branch overlaps where a downstream submeter may be double-counting load from an upstream one. After calibration, both numbers carry MEASURED provenance with no caveat — currently the submeter sum carries a calibration-drift caveat.
          </div>
        </div>
      </ModuleSection>

      <DormEnergySection rows={rows} />
      <CategoryEnergySection rows={rows} category="Academic" denominatorKey="sqft" denominatorLabel="kWh / sqft / yr" defaultOpen={false} />
      <CategoryEnergySection rows={rows} category="Athletic" denominatorKey="sqft" denominatorLabel="kWh / sqft / yr" defaultOpen={false} />
      <CategoryEnergySection rows={rows} category="Dining"   denominatorKey="sqft" denominatorLabel="kWh / sqft / yr" defaultOpen={false} />
      <CategoryEnergySection rows={rows} category="Other"    denominatorKey="sqft" denominatorLabel="kWh / sqft / yr" defaultOpen={false} />

      <ModuleSection
        collapsible
        defaultOpen={false}
        title={`All ${sorted.length} buildings — flat list`}
        hint="Click a row for setpoints, occupancy, and the BMS join number. The category sections above are usually a friendlier entry point."
      >
        <div style={styles.list}>
          {sorted.map((b) => {
            const isOpen = expanded === b.id;
            return (
              <div key={b.id} style={styles.row(CATEGORY_COLORS[b.category])}>
                <button
                  type="button"
                  style={{ ...styles.head, background: 'transparent', border: 'none', width: '100%', textAlign: 'left', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}
                  onClick={() => setExpanded(isOpen ? null : b.id)}
                  aria-expanded={isOpen}
                  aria-controls={`building-detail-${b.id}`}
                  aria-label={`${b.name} — ${isOpen ? 'collapse' : 'expand'} details`}
                >
                  <div style={{ flex: 1 }}>
                    <div style={styles.rowTop}>
                      {b.bmsNumber != null && <span style={styles.bmsTag}>#{b.bmsNumber}</span>}
                      <div style={styles.rowName}>{b.name}</div>
                      <Pill kind="info">{b.category}</Pill>
                    </div>
                    <div style={styles.rowMeta}>
                      {Math.round(b.kwh).toLocaleString()} kWh · {b.mt.toFixed(2)} mtCO₂e · {b.kgPerSqft.toFixed(1)} kg/sqft · {b.kgPerOccupant.toFixed(1)} kg/occupant
                      <span style={{ marginLeft: 8 }}>
                        {b.source === 'bms' && <ProvenancePill provenance="measured" label={`Measured · ${b.mappedMeterIds.length} PM`} />}
                        {b.source === 'snapshot' && <ProvenancePill provenance="cited" label="Snapshot YTD" />}
                        {b.source === 'none' && <ProvenancePill provenance="estimated" label="No meter mapped" />}
                      </span>
                    </div>
                  </div>
                  <span style={styles.arrow} aria-hidden="true">{isOpen ? '▼' : '▶'}</span>
                </button>
                {isOpen && (
                  <div id={`building-detail-${b.id}`}>
                    <div style={styles.detail}>
                      <Field label="Square footage" value={`${b.sqft.toLocaleString()} sqft`} />
                      <Field label="Occupants" value={b.occupants} />
                      {b.dormPopulation > 0 && <Field label="Dorm population" value={b.dormPopulation} />}
                      <Field label="HVAC schedule" value={b.hvacSchedule} />
                      <Field label="Heating setpoint" value={`${b.setpointHeatingF}°F`} />
                      <Field label="Cooling setpoint" value={`${b.setpointCoolingF}°F`} />
                      {b.powerKw != null && <Field label="Last observed demand" value={`${b.powerKw} kW`} />}
                      {b.avgVoltage != null && <Field label="Avg voltage" value={`${b.avgVoltage} V`} />}
                      {b.bmsNumber != null && <Field label="Distech BMS number" value={`#${b.bmsNumber}`} />}
                    </div>
                    <BmsExportPanel buildingId={b.id} />
                    <LivePanel buildingId={b.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ModuleSection>
    </ModulePage>
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

function Field({ label, value }) {
  return (
    <div style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      <span style={styles.fieldValue}>{value}</span>
    </div>
  );
}

// Per-dorm comparative section. Card per dorm with: name, occupancy,
// annual kWh, kWh-per-student-per-day, mt CO2e, daily 30-day mini bar
// chart (when BMS-mapped) or seasonal-projection bar (when not).
function DormEnergySection({ rows }) {
  const [sortBy, setSortBy] = useState('perStudent');
  const dorms = rows.filter((r) => r.category === 'Dorm' && r.dormPopulation > 0);
  if (dorms.length === 0) return null;

  // Compute per-student kWh per day for each dorm (annual ÷ 365 ÷ pop)
  const meterMap = getBmsMeterMap();
  const enriched = dorms.map((d) => {
    const annualKwh = d.kwh;
    const kwhPerStudentPerDay = (annualKwh / 365) / d.dormPopulation;
    const mt = (annualKwh * KG_PER_KWH) / 1000;
    // Daily series for mini chart — only if BMS-mapped.
    let daily = [];
    if (d.source === 'bms') {
      const meterIds = Object.entries(meterMap).filter(([, b]) => b === d.id).map(([m]) => m);
      const meters = meterIds.map((id) => bmsExportMeters.find((m) => m.id === id)).filter(Boolean);
      const map = new Map();
      for (const m of meters) {
        for (const day of (m.daily || [])) {
          map.set(day.date, (map.get(day.date) || 0) + day.kwh);
        }
      }
      daily = Array.from(map.entries()).sort().map(([date, kwh]) => ({ date, kwh }));
    }
    return { ...d, annualKwh, kwhPerStudentPerDay, mt, daily };
  });

  const sorted = [...enriched].sort((a, b) => {
    if (sortBy === 'perStudent') return b.kwhPerStudentPerDay - a.kwhPerStudentPerDay;
    if (sortBy === 'kwh')        return b.annualKwh - a.annualKwh;
    if (sortBy === 'pop')        return b.dormPopulation - a.dormPopulation;
    return 0;
  });

  const maxPerStudent = Math.max(...enriched.map((d) => d.kwhPerStudentPerDay));

  return (
    <ModuleSection
      title="Dorm energy comparison"
      hint="Each dorm's electricity use, ranked. kWh-per-student-per-day flags the heaviest residential users — useful for dorm-cup competitions and targeted setpoint outreach. BMS-mapped dorms show their actual daily kWh trend; the rest show their annual figure as a single bar (no per-day data yet)."
    >
      <div style={styles.dormControls}>
        <span style={styles.dormControlLabel}>Sort by:</span>
        <Chip active={sortBy === 'perStudent'} onClick={() => setSortBy('perStudent')}>kWh / student / day</Chip>
        <Chip active={sortBy === 'kwh'}        onClick={() => setSortBy('kwh')}>Total kWh</Chip>
        <Chip active={sortBy === 'pop'}        onClick={() => setSortBy('pop')}>Population</Chip>
      </div>
      <div style={styles.dormGrid}>
        {sorted.map((d) => (
          <DormCard key={d.id} dorm={d} maxPerStudent={maxPerStudent} />
        ))}
      </div>
    </ModuleSection>
  );
}

// Generic per-category energy comparison. Same card layout as DormCard
// but the denominator is configurable (kWh/sqft/yr for non-residential
// categories, since "per student" only makes sense for dorms).
function CategoryEnergySection({ rows, category, denominatorKey, denominatorLabel, defaultOpen = false }) {
  const buildings = rows.filter((r) => r.category === category);
  if (buildings.length === 0) return null;

  const meterMap = getBmsMeterMap();
  const enriched = buildings.map((b) => {
    const annualKwh = b.kwh;
    const denominator = b[denominatorKey] || 0;
    const intensity = denominator > 0 ? annualKwh / denominator : 0;
    const mt = (annualKwh * KG_PER_KWH) / 1000;
    let daily = [];
    if (b.source === 'bms') {
      const meterIds = Object.entries(meterMap).filter(([, bid]) => bid === b.id).map(([m]) => m);
      const meters = meterIds.map((id) => bmsExportMeters.find((m) => m.id === id)).filter(Boolean);
      const map = new Map();
      for (const m of meters) {
        for (const day of (m.daily || [])) {
          map.set(day.date, (map.get(day.date) || 0) + day.kwh);
        }
      }
      daily = Array.from(map.entries()).sort().map(([date, kwh]) => ({ date, kwh }));
    }
    return { ...b, annualKwh, intensity, mt, daily };
  });

  const sorted = [...enriched].sort((a, b) => b.intensity - a.intensity);
  const maxIntensity = Math.max(...enriched.map((b) => b.intensity), 1);

  const categoryHints = {
    Academic: 'Classroom + lab buildings. Energy intensity (kWh per square foot per year) is the standard comparable for non-residential. Buildings above ~25 kWh/sqft/yr are running heavy — likely from older HVAC schedules or AC season starting.',
    Athletic: 'Gyms, pools, ice rinks (if any), Whittemore. Pool/ice loads dominate when present; lighting + HVAC otherwise.',
    Dining:   'Kitchen + service areas. Kitchen equipment + walk-in refrigeration runs continuously, pushing intensity well above academic average.',
    Other:    'Mixed-use, support, and miscellaneous buildings.',
  };

  return (
    <ModuleSection
      title={`${category} buildings — energy comparison (${sorted.length})`}
      hint={categoryHints[category] || `${category} buildings ranked by energy intensity (kWh per square foot per year).`}
      collapsible
      defaultOpen={defaultOpen}
    >
      <div style={styles.dormGrid}>
        {sorted.map((b) => (
          <BuildingCategoryCard
            key={b.id}
            building={b}
            maxIntensity={maxIntensity}
            denominatorLabel={denominatorLabel}
          />
        ))}
      </div>
    </ModuleSection>
  );
}

function BuildingCategoryCard({ building, maxIntensity, denominatorLabel }) {
  const isMeasured = building.source === 'bms' && building.daily.length > 0;
  const isSnapshot = building.source === 'snapshot';
  const dailyMax = isMeasured ? Math.max(...building.daily.map((d) => d.kwh)) : 0;
  return (
    <div style={styles.dormCard}>
      <div style={styles.dormHead}>
        <div style={styles.dormName}>
          {building.name}
          {building.bmsNumber != null && <span style={styles.dormBms}>#{building.bmsNumber}</span>}
        </div>
        <div style={styles.dormPop}>{building.sqft.toLocaleString()} sqft</div>
      </div>

      <div style={styles.dormStats}>
        <div style={styles.dormStat}>
          <div style={styles.dormStatVal}>{building.intensity.toFixed(1)}</div>
          <div style={styles.dormStatLabel}>{denominatorLabel}</div>
        </div>
        <div style={styles.dormStat}>
          <div style={styles.dormStatVal}>{Math.round(building.annualKwh / 1000)}k</div>
          <div style={styles.dormStatLabel}>kWh / yr</div>
        </div>
        <div style={styles.dormStat}>
          <div style={styles.dormStatVal}>{building.mt.toFixed(1)}</div>
          <div style={styles.dormStatLabel}>mtCO₂e / yr</div>
        </div>
      </div>

      <div style={styles.dormPerStudentBar}>
        <div
          style={{
            ...styles.dormPerStudentFill,
            width: `${Math.min(100, (building.intensity / maxIntensity) * 100)}%`,
            background: isMeasured ? '#22c55e' : isSnapshot ? '#22d3ee' : '#475569',
          }}
        />
      </div>

      {isMeasured ? (
        <>
          <div style={styles.dormChartLabel}>
            Daily kWh — {building.daily.length} days measured
            <span style={{ color: '#64748b', fontWeight: 400, marginLeft: 8, textTransform: 'none', letterSpacing: 0, fontSize: 10 }}>
              {building.daily[0].date.slice(5)} → {building.daily[building.daily.length - 1].date.slice(5)}
              {' · peak '}{Math.round(dailyMax).toLocaleString()} kWh
            </span>
          </div>
          <div style={styles.dormChart}>
            {building.daily.map((d, i) => {
              const dt = new Date(d.date + 'T12:00:00Z');
              const isWeekend = [0, 6].includes(dt.getUTCDay());
              return (
                <div
                  key={d.date}
                  style={{
                    ...styles.dormChartBar,
                    height: `${(d.kwh / dailyMax) * 100}%`,
                    background: isWeekend ? '#0ea5e9' : '#22c55e',
                    opacity: isWeekend ? 0.85 : 1,
                  }}
                  title={`${d.date}${isWeekend ? ' (weekend)' : ''}: ${Math.round(d.kwh).toLocaleString()} kWh`}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div style={styles.dormChartLabel}>
          {isSnapshot ? 'No BMS meter mapped — using YTD snapshot. Map a PM device on /admin/bms-export for daily detail.' : 'No data yet. Map a PM device on /admin/bms-export.'}
        </div>
      )}

      <div style={styles.dormProvRow}>
        {isMeasured && <ProvenancePill provenance="measured" label={`Measured · ${building.mappedMeterIds.length} PM`} />}
        {isSnapshot && <ProvenancePill provenance="cited" label="Snapshot YTD" />}
        {building.source === 'none' && <ProvenancePill provenance="estimated" label="No meter" />}
      </div>
    </div>
  );
}

function DormCard({ dorm, maxPerStudent }) {
  const isMeasured = dorm.source === 'bms' && dorm.daily.length > 0;
  const isSnapshot = dorm.source === 'snapshot';
  const dailyMax = isMeasured ? Math.max(...dorm.daily.map((d) => d.kwh)) : 0;
  return (
    <div style={styles.dormCard}>
      <div style={styles.dormHead}>
        <div style={styles.dormName}>
          {dorm.name}
          {dorm.bmsNumber != null && <span style={styles.dormBms}>#{dorm.bmsNumber}</span>}
        </div>
        <div style={styles.dormPop}>{dorm.dormPopulation} student{dorm.dormPopulation === 1 ? '' : 's'}</div>
      </div>

      <div style={styles.dormStats}>
        <div style={styles.dormStat}>
          <div style={styles.dormStatVal}>{Math.round(dorm.kwhPerStudentPerDay)}</div>
          <div style={styles.dormStatLabel}>kWh / student / day</div>
        </div>
        <div style={styles.dormStat}>
          <div style={styles.dormStatVal}>{Math.round(dorm.annualKwh / 1000)}k</div>
          <div style={styles.dormStatLabel}>kWh / yr</div>
        </div>
        <div style={styles.dormStat}>
          <div style={styles.dormStatVal}>{dorm.mt.toFixed(1)}</div>
          <div style={styles.dormStatLabel}>mtCO₂e / yr</div>
        </div>
      </div>

      {/* Bar showing per-student-per-day relative to peer-dorm max */}
      <div style={styles.dormPerStudentBar}>
        <div
          style={{
            ...styles.dormPerStudentFill,
            width: `${Math.min(100, (dorm.kwhPerStudentPerDay / maxPerStudent) * 100)}%`,
            background: isMeasured ? '#22c55e' : isSnapshot ? '#22d3ee' : '#475569',
          }}
        />
      </div>

      {/* Daily mini chart (BMS) or single annual bar (snapshot/none) */}
      {isMeasured ? (
        <>
          <div style={styles.dormChartLabel}>
            Daily kWh — {dorm.daily.length} days measured
            <span style={{ color: '#64748b', fontWeight: 400, marginLeft: 8, textTransform: 'none', letterSpacing: 0, fontSize: 10 }}>
              {dorm.daily[0].date.slice(5)} → {dorm.daily[dorm.daily.length - 1].date.slice(5)}
              {' · peak '}{Math.round(dailyMax).toLocaleString()} kWh
            </span>
          </div>
          <div style={styles.dormChart}>
            {dorm.daily.map((d) => {
              const dt = new Date(d.date + 'T12:00:00Z');
              const isWeekend = [0, 6].includes(dt.getUTCDay());
              return (
              <div
                key={d.date}
                title={`${d.date}${isWeekend ? ' (weekend)' : ''}: ${Math.round(d.kwh).toLocaleString()} kWh`}
                style={{
                  ...styles.dormChartBar,
                  height: `${(d.kwh / dailyMax) * 100}%`,
                  background: isWeekend ? '#0ea5e9' : '#22c55e',
                  opacity: isWeekend ? 0.85 : 1,
                }}
              />
              );
            })}
          </div>
        </>
      ) : (
        <div style={styles.dormChartLabel}>
          {isSnapshot ? 'No BMS meter mapped — using YTD snapshot. Map a PM device on /admin/bms-export for daily detail.' : 'No data yet. Map a PM device on /admin/bms-export.'}
        </div>
      )}

      <div style={styles.dormProvRow}>
        {isMeasured && <ProvenancePill provenance="measured" label={`Measured · ${dorm.mappedMeterIds.length} PM`} />}
        {isSnapshot && <ProvenancePill provenance="cited" label="Snapshot YTD" />}
        {dorm.source === 'none' && <ProvenancePill provenance="estimated" label="No meter" />}
      </div>
    </div>
  );
}

function BmsExportPanel({ buildingId }) {
  // Look up which PM devices are mapped to this building, sum their
  // daily kWh series, render as a sparkline + total. Renders nothing
  // when no PM is mapped — keeps the row clean for un-mapped buildings.
  const map = getBmsMeterMap();
  const meterIds = Object.entries(map).filter(([, b]) => b === buildingId).map(([m]) => m);
  if (meterIds.length === 0) return null;
  const meters = meterIds.map((id) => bmsExportMeters.find((m) => m.id === id)).filter(Boolean);
  if (meters.length === 0) return null;

  const dailyMap = new Map();
  for (const m of meters) {
    for (const d of (m.daily || [])) {
      dailyMap.set(d.date, (dailyMap.get(d.date) || 0) + d.kwh);
    }
  }
  const daily = Array.from(dailyMap.entries()).sort().map(([date, kwh]) => ({ value: +kwh.toFixed(1), measured: true, date }));
  const totalKwh = daily.reduce((s, d) => s + d.value, 0);
  const peakKw = Math.max(...meters.map((m) => m.peakKw || 0));

  return (
    <div style={styles.bmsPanel}>
      <div style={styles.bmsHeader}>
        <ProvenancePill provenance="measured" />
        <span style={styles.bmsTitle}>BMS export · last 30 days</span>
        <span style={styles.bmsMeta}>{meterIds.length} mapped meter{meterIds.length === 1 ? '' : 's'}</span>
      </div>
      <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <Sparkline
          data={daily}
          color="#22c55e"
          fill="rgba(34, 197, 94, 0.18)"
          width={260}
          height={48}
          strokeWidth={2}
          showLast
          formatValue={(v) => `${Math.round(v).toLocaleString()} kWh`}
          formatLabel={(d) => {
            if (!d?.date) return '';
            // Parse YYYY-MM-DD as a local date; new Date(string) reads
            // it as UTC midnight which back-rolls a day for users west
            // of UTC (Apr 15 → Apr 14 in ET).
            const [yyyy, mm, dd] = d.date.split('-').map((s) => parseInt(s, 10));
            return new Date(yyyy, mm - 1, dd).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          }}
        />
        <div style={{ fontSize: 12, color: '#cbd5e1' }}>
          <div><strong>{Math.round(totalKwh).toLocaleString()}</strong> kWh in window</div>
          <div>peak <strong>{peakKw}</strong> kW</div>
          <div style={{ color: '#64748b' }}>via {meterIds.join(', ')}</div>
        </div>
      </div>
    </div>
  );
}

function LivePanel({ buildingId }) {
  const [enabled, setEnabled] = useState(false);
  const { loading, data, error } = useBuildingEnergy(buildingId, enabled);

  function downloadCsv() {
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 3600 * 1000);
    const url = `/api/meters/readings/export?buildingId=${encodeURIComponent(buildingId)}&start=${start.toISOString()}&end=${end.toISOString()}`;
    window.open(url, '_blank');
  }

  return (
    <div style={styles.live}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          style={styles.liveBtn}
          onClick={() => setEnabled((v) => !v)}
          aria-expanded={enabled}
        >
          {enabled ? '× Hide live data' : '↻ Pull live 30-day energy from API'}
        </button>
        <button
          type="button"
          style={styles.liveBtn}
          onClick={downloadCsv}
          aria-label="Download last 30 days of readings as CSV"
        >
          ↓ Download 30-day CSV
        </button>
      </div>
      {enabled && (
        <div style={styles.liveBody}>
          {loading && <div style={styles.liveStatus}>Loading from /api/buildings/{buildingId}/energy …</div>}
          {error && <div style={{ ...styles.liveStatus, color: '#fca5a5' }}>Error: {error}</div>}
          {data && (
            <div style={styles.liveGrid}>
              <Field label="Live total (30d)" value={`${data.totalKwh.toLocaleString()} kWh`} />
              <Field label="Peak demand" value={`${data.peakKw} kW`} />
              <Field label="Live mtCO₂e" value={data.mtCO2e.toFixed(3)} />
              <Field label="Live kg/sqft" value={data.mtCO2ePerSqft.toFixed(2)} />
              <Field label="Live kg/occupant" value={data.mtCO2ePerOccupant.toFixed(2)} />
              <Field label="Daily samples" value={data.dailyKwh.length} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  qualityList: { display: 'grid', gap: 12 },
  qualityRow: { display: 'grid', gridTemplateColumns: 'minmax(140px, 180px) 1fr', gap: 18, padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  qualityMonthCol: { borderRight: '1px solid #1f2937', paddingRight: 14 },
  qualityMonth: { fontSize: 14, color: '#e5e7eb', fontWeight: 700 },
  qualityCaptured: { fontSize: 11, color: '#64748b', marginTop: 4 },
  qualityBarsCol: { display: 'grid', gap: 10 },
  qualityRowBar: { },
  qualityBarLabel: { fontSize: 12, color: '#cbd5e1', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  qualityBarBadge: { fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#052e1a', color: '#86efac', border: '1px solid #14532d', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 },
  qualityBarTrack: { position: 'relative', height: 22, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 4, overflow: 'hidden' },
  qualityBarFill: { position: 'absolute', top: 0, bottom: 0, left: 0, opacity: 0.4 },
  qualityBarValue: { position: 'absolute', top: 0, bottom: 0, left: 8, display: 'flex', alignItems: 'center', fontSize: 12, fontVariantNumeric: 'tabular-nums', color: '#e5e7eb', fontWeight: 600 },
  qualityGap: { fontSize: 11, color: '#94a3b8', marginTop: 4, fontVariantNumeric: 'tabular-nums' },
  qualityFooter: { marginTop: 14, padding: '12px 14px', background: '#0b1220', border: '1px dashed #334155', borderRadius: 6 },
  qualityMethodLine: { fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, marginTop: 4 },
  qualityMethodLabel: { color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 },

  // Dorm energy section
  dormControls: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' },
  dormControlLabel: { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginRight: 4 },
  dormGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 },
  dormCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  dormHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 10, flexWrap: 'wrap' },
  dormName: { fontSize: 15, color: '#e5e7eb', fontWeight: 700 },
  dormBms: { fontSize: 11, color: '#64748b', marginLeft: 6, fontWeight: 600 },
  dormPop: { fontSize: 12, color: '#94a3b8' },
  dormStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 },
  dormStat: { padding: '8px 10px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, textAlign: 'center' },
  dormStatVal: { fontSize: 18, color: '#e5e7eb', fontWeight: 800, fontVariantNumeric: 'tabular-nums' },
  dormStatLabel: { fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 4 },
  dormPerStudentBar: { height: 6, background: '#0f172a', borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  dormPerStudentFill: { height: '100%', borderRadius: 3 },
  dormChartLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginBottom: 6 },
  dormChart: { display: 'flex', alignItems: 'flex-end', gap: 1, height: 50, marginBottom: 10 },
  dormChartBar: { flex: 1, minHeight: 2, borderRadius: '1px 1px 0 0' },
  dormProvRow: { marginTop: 8 },

  bmsPanel: { marginTop: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22c55e', borderRadius: 6 },
  bmsHeader: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' },
  bmsTitle: { fontSize: 12, color: '#e5e7eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 },
  bmsMeta: { fontSize: 11, color: '#94a3b8' },



  filterRow: { display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' },
  label: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },

  list: { display: 'grid', gap: 8 },
  row: (color) => ({
    padding: '12px 14px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderLeft: `4px solid ${color}`,
    borderRadius: 8,
  }),
  head: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
  rowTop: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  bmsTag: { fontSize: 12, color: '#fbbf24', fontWeight: 700, background: '#3a2a0d', border: '1px solid #92400e', padding: '2px 8px', borderRadius: 6, fontVariantNumeric: 'tabular-nums' },
  rowName: { fontSize: 15, color: '#e5e7eb', fontWeight: 600 },
  rowMeta: { fontSize: 13, color: '#94a3b8', marginTop: 6 },
  arrow: { color: '#64748b' },

  detail: { marginTop: 12, paddingTop: 12, borderTop: '1px solid #1f2937', display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
  field: { display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' },
  fieldLabel: { color: '#64748b', fontWeight: 600 },
  fieldValue: { color: '#cbd5e1', textAlign: 'right' },

  live: { marginTop: 12, paddingTop: 12, borderTop: '1px solid #1f2937' },
  liveBtn: { padding: '8px 14px', background: '#0f172a', color: '#22d3ee', border: '1px solid #0e7490', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: 0.4 },
  liveBody: { marginTop: 12, padding: 12, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6 },
  liveStatus: { fontSize: 12, color: '#94a3b8', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  liveGrid: { display: 'grid', gap: 6, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
};
