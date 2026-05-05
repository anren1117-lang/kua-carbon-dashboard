import { describe, it, expect } from 'vitest';
import { buildings, getBuilding, getBuildingByBmsNumber } from '../data/buildings.js';
import { meters, getMeter, listMetersForBuilding } from '../data/meters.js';
import { gridMix, GRID_MIX_TOTAL_MTCO2E, GRID_MIX_TOTAL_KWH } from '../data/gridMix.js';
import { dorms } from '../data/dorms.js';
import { students, TOTAL_STUDENTS } from '../data/students.js';
import { staff, TOTAL_STAFF } from '../data/staff.js';
import { reductionActions } from '../data/reductionActions.js';
import { knowledgeArticles } from '../data/learningContent.js';
import { quantityToKgCO2e, kgToMt, annualElectricityMt } from '../utils/emissions.js';
import { rankActions, buildingHotspots } from '../utils/hotspots.js';
import { trendKind } from '../utils/comparison.js';
import { hashUserId } from '../utils/hash.js';
import { MockMeterAdapter } from '../adapters/meter/MockMeterAdapter.js';
import { BmsMeterAdapter } from '../adapters/meter/BmsMeterAdapter.js';
import { energyEquivalents, carbonEquivalents } from '../utils/equivalents.js';
import { matchQuery, pickQuizForTopic } from '../utils/chatbotMatch.js';
import { parseMeterCsv } from '../utils/csvMeterParser.js';
import { ingestCsv, _resetCsvStore, CsvMeterAdapter } from '../adapters/meter/CsvMeterAdapter.js';
import { forestStands, ANNUAL_SEQUESTRATION_MT, TOTAL_FOREST_ACRES, soilCarbonStored } from '../data/sinks.js';
import { formatMeterCsv } from '../utils/csvMeterFormatter.js';
import { reductionTargets, targetTrajectoryAt, trajectoryStatus } from '../data/targets.js';
import { extractFileText, FILE_LIMITS } from '../utils/extractFileText.js';

describe('data layer integrity', () => {
  it('every electricity meter points to a known building', () => {
    const ids = new Set(buildings.map((b) => b.id));
    const elec = meters.filter((m) => m.type === 'electricity');
    elec.forEach((m) => expect(ids.has(m.buildingId)).toBe(true));
  });

  it('every building has a unique BMS number that round-trips through getBuildingByBmsNumber', () => {
    const seen = new Set();
    for (const b of buildings) {
      if (b.bmsNumber == null) continue;
      expect(seen.has(b.bmsNumber)).toBe(false);
      seen.add(b.bmsNumber);
      expect(getBuildingByBmsNumber(b.bmsNumber)?.id).toBe(b.id);
    }
  });

  it('Barn Field House (#10) is registered', () => {
    expect(getBuildingByBmsNumber(10)?.id).toBe('b_barnfield');
  });

  it('every dorm points to a known building', () => {
    const ids = new Set(buildings.map((b) => b.id));
    dorms.forEach((d) => expect(ids.has(d.buildingId)).toBe(true));
  });

  it('every student profile points to a known dorm', () => {
    const ids = new Set(dorms.map((d) => d.id));
    students.forEach((s) => expect(ids.has(s.dormId)).toBe(true));
  });

  it('grid mix shares add up close to 100%', () => {
    const total = gridMix.reduce((s, g) => s + g.mixPercent, 0);
    expect(total).toBeGreaterThan(99);
    expect(total).toBeLessThan(101);
  });

  it('grid-mix mtCO2e shares sum to the published total within 1 mt', () => {
    const total = gridMix.reduce((s, g) => s + g.mtCO2e, 0);
    expect(Math.abs(total - GRID_MIX_TOTAL_MTCO2E)).toBeLessThan(1);
  });

  it('grid-mix kWh shares sum to the published total within 1%', () => {
    const total = gridMix.reduce((s, g) => s + g.kwhUsed, 0);
    expect(Math.abs(total - GRID_MIX_TOTAL_KWH) / GRID_MIX_TOTAL_KWH).toBeLessThan(0.01);
  });

  it('mock counts match exported totals', () => {
    expect(students.length).toBe(TOTAL_STUDENTS);
    expect(staff.length).toBe(TOTAL_STAFF);
  });

  it('every reduction action has all required fields', () => {
    for (const a of reductionActions) {
      expect(a.id).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.expectedReductionMtCO2e).toBeGreaterThanOrEqual(0);
      expect(['low', 'medium', 'high']).toContain(a.difficulty);
      expect(['low', 'medium', 'high']).toContain(a.urgency);
    }
  });

  it('knowledge articles are non-empty and tagged', () => {
    expect(knowledgeArticles.length).toBeGreaterThan(0);
    knowledgeArticles.forEach((k) => {
      expect(k.title.length).toBeGreaterThan(0);
      expect(k.body.length).toBeGreaterThan(20);
      expect(['novice', 'intermediate', 'advanced']).toContain(k.readingLevel);
    });
  });
});

describe('emission math', () => {
  it('converts kWh to kgCO2e using ISO-NE factor', () => {
    // Per-fuel output factors weighted across ISO-NE 2024 mix → 0.235 kg/kWh.
    const { kgco2e, factor } = quantityToKgCO2e({ quantity: 1000, factorId: 'ef_grid_isone_2024' });
    expect(factor.unit).toBe('kWh');
    expect(kgco2e).toBeCloseTo(235, 1);
  });

  it('annualElectricityMt rolls up large kWh figures correctly', () => {
    expect(annualElectricityMt(1_000_000)).toBeCloseTo(235, 1);
  });

  it('kg → mt conversion', () => {
    expect(kgToMt(2500)).toBe(2.5);
  });

  it('returns null factor for unknown id', () => {
    const r = quantityToKgCO2e({ quantity: 10, factorId: 'ef_does_not_exist' });
    expect(r.kgco2e).toBe(0);
    expect(r.factor).toBeNull();
  });
});

describe('utilities', () => {
  it('trendKind classifies movement', () => {
    expect(trendKind(110, 100)).toBe('worse');
    expect(trendKind(90, 100)).toBe('better');
    expect(trendKind(102, 100)).toBe('flat');
  });

  it('hashUserId produces a stable scoped id', () => {
    const a = hashUserId('student', 'abc');
    const b = hashUserId('student', 'abc');
    const c = hashUserId('staff', 'abc');
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a.startsWith('student_')).toBe(true);
  });

  it('rankActions ranks by impact + urgency + confidence', () => {
    const ranked = rankActions(reductionActions);
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[ranked.length - 1].score);
  });

  it('buildingHotspots produces severity buckets', () => {
    const hs = buildingHotspots(
      [
        { id: 'a', name: 'A', kwh: 1000 },
        { id: 'b', name: 'B', kwh: 100 },
      ],
      1100,
      0.235, // updated to per-fuel output ISO-NE 2024 effective rate
    );
    expect(hs[0].id).toBe('a');
    expect(['low', 'medium', 'high']).toContain(hs[0].severity);
  });
});

describe('MockMeterAdapter', () => {
  it('returns meters via listMeters()', async () => {
    const ms = await MockMeterAdapter.listMeters();
    expect(ms.length).toBeGreaterThan(0);
    expect(ms[0]).toHaveProperty('id');
    expect(ms[0]).toHaveProperty('buildingId');
    expect(ms[0]).toHaveProperty('type');
  });

  it('generates readings within a window', async () => {
    const start = '2026-04-01T00:00:00.000Z';
    const end   = '2026-04-02T00:00:00.000Z';
    const readings = await MockMeterAdapter.getReadings({ buildingId: 'b_miller', start, end });
    expect(readings.length).toBe(24);
    readings.forEach((r) => {
      expect(r.meterType).toBe('electricity');
      expect(r.value).toBeGreaterThan(0);
      expect(r.source).toBe('mock');
    });
  });

  it('returns sane equivalents for a known kWh figure', () => {
    const eq = energyEquivalents(82); // exactly one Tesla charge
    expect(eq.teslaCharges).toBe(1);
    expect(eq.iphoneCharges).toBeGreaterThan(4000);
    expect(eq.bulbHours).toBeGreaterThan(1000);
  });

  it('handles zero / negative kWh gracefully', () => {
    expect(energyEquivalents(0).teslaCharges).toBe(0);
    expect(energyEquivalents(-50).teslaCharges).toBe(0);
  });

  it('carbonEquivalents converts mt to common reference units', () => {
    const eq = carbonEquivalents(46);
    expect(eq.carYears).toBe(10);
    expect(eq.treeYears).toBeGreaterThan(700);
  });

  it('BmsMeterAdapter throws a helpful error when env is missing', async () => {
    await expect(BmsMeterAdapter.listMeters()).rejects.toThrow(/BMS_BASE_URL/);
  });

  it('chatbot matches keyword queries to the right article', () => {
    const r1 = matchQuery('what is a carbon footprint');
    expect(r1.best?.id).toBe('ka_what_is_footprint');

    const r2 = matchQuery('why does beef have higher emissions');
    expect(r2.best?.id).toBe('ka_beef_emissions');

    const r3 = matchQuery('scope 1 vs scope 2');
    expect(r3.best?.id).toBe('ka_scopes');
  });

  it('chatbot returns no match for off-topic queries', () => {
    const r = matchQuery('what is the weather in tokyo');
    expect(r.score).toBeLessThan(2);
  });

  it('chatbot quiz bank has 4 options per question', () => {
    for (const topic of ['scopes', 'food', 'energy', 'kua_specific']) {
      const q = pickQuizForTopic(topic);
      expect(q.options.length).toBe(4);
      expect(q.options.filter((o) => o.correct).length).toBe(1);
    }
  });
});

describe('CSV meter parser', () => {
  it('parses a well-formed CSV', () => {
    const csv = [
      'meter_id,timestamp,value,unit,interval_minutes',
      'm_elec_b_miller,2026-04-01T00:00:00Z,5.2,kWh,60',
      'm_elec_b_miller,2026-04-01T01:00:00Z,5.4,kWh,60',
    ].join('\n');
    const r = parseMeterCsv(csv);
    expect(r.errors).toEqual([]);
    expect(r.readings.length).toBe(2);
    expect(r.readings[0].source).toBe('csv');
    expect(r.readings[0].buildingId).toBe('b_miller');
  });

  it('rejects PII-looking columns', () => {
    const csv = 'meter_id,timestamp,value,unit,interval_minutes,name\nm_elec_b_miller,2026-04-01T00:00:00Z,5.2,kWh,60,Anren';
    const r = parseMeterCsv(csv);
    expect(r.errors[0]).toMatch(/personal data/);
    expect(r.readings.length).toBe(0);
  });

  it('flags unknown meter ids', () => {
    const csv = 'meter_id,timestamp,value,unit,interval_minutes\nm_does_not_exist,2026-04-01T00:00:00Z,5.2,kWh,60';
    const r = parseMeterCsv(csv);
    expect(r.errors[0]).toMatch(/unknown meter_id/);
  });

  it('flags non-numeric values', () => {
    const csv = 'meter_id,timestamp,value,unit,interval_minutes\nm_elec_b_miller,2026-04-01T00:00:00Z,abc,kWh,60';
    const r = parseMeterCsv(csv);
    expect(r.errors[0]).toMatch(/not numeric/);
  });

  it('flags missing required columns', () => {
    const csv = 'meter_id,timestamp,value\nm_elec_b_miller,2026-04-01T00:00:00Z,5.2';
    const r = parseMeterCsv(csv);
    expect(r.errors.some((e) => e.includes('missing required column'))).toBe(true);
  });

  it('strips a leading UTF-8 BOM (Excel exports write one)', () => {
    // ﻿ is the BOM. Without stripping, the first header reads as
    // "﻿meter_id" and the required-columns check would fail.
    const csv = '﻿meter_id,timestamp,value,unit,interval_minutes\nm_elec_b_miller,2026-04-01T00:00:00Z,5.2,kWh,60';
    const r = parseMeterCsv(csv);
    expect(r.errors).toEqual([]);
    expect(r.readings.length).toBe(1);
  });
});

describe('CsvMeterAdapter', () => {
  it('round-trips ingest → getReadings', async () => {
    _resetCsvStore();
    const csv = [
      'meter_id,timestamp,value,unit,interval_minutes',
      'm_elec_b_miller,2026-04-01T00:00:00Z,5.2,kWh,60',
      'm_elec_b_miller,2026-04-01T01:00:00Z,5.4,kWh,60',
    ].join('\n');
    const r = await ingestCsv(csv);
    expect(r.inserted).toBe(2);
    expect(r.errors).toEqual([]);

    const readings = await CsvMeterAdapter.getReadings({
      buildingId: 'b_miller',
      start: '2026-04-01T00:00:00Z',
      end:   '2026-04-02T00:00:00Z',
    });
    expect(readings.length).toBe(2);
  });
});

describe('Sinks data', () => {
  it('every stand has positive acres + sequestration rate', () => {
    for (const s of forestStands) {
      expect(s.acres).toBeGreaterThan(0);
      expect(s.mtco2eAcreYr).toBeGreaterThan(0);
    }
  });

  it('totals are consistent with the per-stand records', () => {
    const acres = forestStands.reduce((s, x) => s + x.acres, 0);
    const seq   = forestStands.reduce((s, x) => s + x.acres * x.mtco2eAcreYr, 0);
    expect(acres).toBe(TOTAL_FOREST_ACRES);
    expect(Math.abs(seq - ANNUAL_SEQUESTRATION_MT)).toBeLessThan(0.01);
  });

  it('soilCarbonStored is monotonic in %OC', () => {
    expect(soilCarbonStored(2, 100)).toBeLessThan(soilCarbonStored(4, 100));
  });
});

describe('CSV round-trip', () => {
  it('formatMeterCsv → parseMeterCsv preserves rows', () => {
    const original = [
      { id: 'm_elec_b_miller_1', meterId: 'm_elec_b_miller', buildingId: 'b_miller', meterType: 'electricity', timestamp: '2026-04-01T00:00:00.000Z', intervalMinutes: 60, value: 5.2, unit: 'kWh', dataQuality: 'actual', source: 'mock' },
      { id: 'm_elec_b_miller_2', meterId: 'm_elec_b_miller', buildingId: 'b_miller', meterType: 'electricity', timestamp: '2026-04-01T01:00:00.000Z', intervalMinutes: 60, value: 5.4, unit: 'kWh', dataQuality: 'actual', source: 'mock' },
    ];
    const csv = formatMeterCsv(original);
    const { readings, errors } = parseMeterCsv(csv);
    expect(errors).toEqual([]);
    expect(readings.length).toBe(original.length);
    expect(readings[0].meterId).toBe('m_elec_b_miller');
    expect(readings[0].value).toBe(5.2);
  });

  it('CSV has header on first line', () => {
    const csv = formatMeterCsv([]);
    expect(csv.split('\n')[0]).toBe('meter_id,timestamp,value,unit,interval_minutes,demand_kw,data_quality');
  });
});

describe('Reduction targets', () => {
  it('every target has consistent baseline + target relationship', () => {
    for (const t of reductionTargets) {
      expect(t.targetYear).toBeGreaterThan(t.baselineYear);
      expect(t.percentReduction).toBeGreaterThan(0);
      expect(t.percentReduction).toBeLessThanOrEqual(100);
      expect(t.baselineValue).toBeGreaterThan(0);
    }
  });

  it('trajectory is monotonically decreasing', () => {
    const t = reductionTargets.find((t) => t.scope === 'gross');
    let prev = Infinity;
    for (let y = t.baselineYear; y <= t.targetYear; y++) {
      const v = targetTrajectoryAt(t, y);
      expect(v).toBeLessThanOrEqual(prev);
      prev = v;
    }
  });

  it('trajectory hits the target at the target year', () => {
    const t = reductionTargets[0];
    const expected = t.baselineValue * (1 - t.percentReduction / 100);
    expect(targetTrajectoryAt(t, t.targetYear)).toBeCloseTo(expected, 3);
  });

  it('trajectory clamps before baseline + after target', () => {
    const t = reductionTargets[0];
    expect(targetTrajectoryAt(t, t.baselineYear - 5)).toBe(t.baselineValue);
    expect(targetTrajectoryAt(t, t.targetYear + 5)).toBeCloseTo(t.baselineValue * (1 - t.percentReduction / 100), 3);
  });

  it('FILE_LIMITS exposes the expected ceilings', () => {
    expect(FILE_LIMITS.MAX_BYTES).toBe(5 * 1024 * 1024);
    expect(FILE_LIMITS.MAX_CHARS).toBe(12000);
  });

  it('extractFileText pulls plain text out of a .txt blob', async () => {
    const blob = new File(['Beef averages 60 kg CO2e/kg.'], 'demo.txt', { type: 'text/plain' });
    const r = await extractFileText(blob);
    expect(r.kind).toBe('text');
    expect(r.text).toContain('60 kg');
    expect(r.truncated).toBe(false);
    expect(r.sourceFileName).toBe('demo.txt');
  });

  it('extractFileText truncates oversize text input', async () => {
    const big = 'x'.repeat(15000);
    const blob = new File([big], 'big.txt', { type: 'text/plain' });
    const r = await extractFileText(blob);
    expect(r.text.length).toBe(12000);
    expect(r.truncated).toBe(true);
  });

  it('extractFileText rejects unsupported types', async () => {
    const blob = new File(['x'], 'demo.dmg', { type: 'application/octet-stream' });
    await expect(extractFileText(blob)).rejects.toThrow(/Unsupported/);
  });

  it('extractFileText rejects oversize files', async () => {
    const huge = 'x'.repeat(6 * 1024 * 1024);
    const blob = new File([huge], 'huge.txt', { type: 'text/plain' });
    await expect(extractFileText(blob)).rejects.toThrow(/too large/);
  });

  it('trajectoryStatus picks the right bucket', () => {
    const t = reductionTargets[0];
    // At baseline year, expected = baseline. So actual === baseline → on track.
    expect(trajectoryStatus(t, t.baselineValue, t.baselineYear)).toBe('on_track');
    // 50% over expected → off track
    const expected2026 = targetTrajectoryAt(t, 2026);
    expect(trajectoryStatus(t, expected2026 * 1.5, 2026)).toBe('off_track');
    // 5% over → lagging
    expect(trajectoryStatus(t, expected2026 * 1.05, 2026)).toBe('lagging');
  });

  it('rolls up building energy summary', async () => {
    const summary = await MockMeterAdapter.getBuildingEnergy({
      buildingId: 'b_miller',
      start: '2026-04-01T00:00:00.000Z',
      end: '2026-04-08T00:00:00.000Z',
    });
    expect(summary.buildingId).toBe('b_miller');
    expect(summary.totalKwh).toBeGreaterThan(0);
    expect(summary.mtCO2e).toBeGreaterThan(0);
    expect(summary.dailyKwh.length).toBe(7);
  });
});

describe('Anomaly detection', () => {
  it('flags a trailing flat run that runs to the end of the readings', async () => {
    const { detectAnomalies } = await import('../utils/anomaly.js');
    // 8 readings, last 7 identical — earlier code only emitted flat
    // issues when a "breaking" different value was seen, so a stuck
    // meter that stays stuck past the query window slipped through.
    const readings = [
      { meterId: 'm1', value: 100, timestamp: '2026-04-01T00:00:00Z', intervalMinutes: 60 },
      { meterId: 'm1', value: 50,  timestamp: '2026-04-01T01:00:00Z', intervalMinutes: 60 },
      { meterId: 'm1', value: 50,  timestamp: '2026-04-01T02:00:00Z', intervalMinutes: 60 },
      { meterId: 'm1', value: 50,  timestamp: '2026-04-01T03:00:00Z', intervalMinutes: 60 },
      { meterId: 'm1', value: 50,  timestamp: '2026-04-01T04:00:00Z', intervalMinutes: 60 },
      { meterId: 'm1', value: 50,  timestamp: '2026-04-01T05:00:00Z', intervalMinutes: 60 },
      { meterId: 'm1', value: 50,  timestamp: '2026-04-01T06:00:00Z', intervalMinutes: 60 },
      { meterId: 'm1', value: 50,  timestamp: '2026-04-01T07:00:00Z', intervalMinutes: 60 },
    ];
    const issues = detectAnomalies(readings);
    const flatIssues = issues.filter((i) => i.kind === 'flat');
    expect(flatIssues.length).toBe(1);
    expect(flatIssues[0].endedAt).toBe('2026-04-01T07:00:00Z');
  });
});

describe('Asset inventory counts', () => {
  // Regression: when a record was both edited and decommissioned via the
  // admin inventory page, the rendered row showed it once as
  // "decommissioned" but the count totals double-counted it as both
  // "decommissioned" and "overridden", and "seeded" was double-subtracted.
  // Locks in the fix in src/data/assetInventory.js.
  it('counts match rendered rows when removed/edited overlap', async () => {
    // Use a fresh localStorage stub for this test only — node env doesn't
    // have one by default, so simulate.
    const store = {};
    const fakeStorage = {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = v; },
      removeItem: (k) => { delete store[k]; },
    };
    globalThis.localStorage = fakeStorage;

    // Pick the buildings inventory; pre-write edits + removed that overlap.
    const seedId = buildings[0].id;
    fakeStorage.setItem('kua_inv_buildings_edits',   JSON.stringify({ [seedId]: { name: 'patched' } }));
    fakeStorage.setItem('kua_inv_buildings_removed', JSON.stringify([seedId]));

    const { getInventoryView } = await import('../data/assetInventory.js');
    const view = getInventoryView('buildings');
    const total = buildings.length;

    // The overlapping record should appear ONCE (as decommissioned), not twice.
    const decommissionedRows = view.rows.filter((r) => r._provenance === 'decommissioned');
    const overriddenRows     = view.rows.filter((r) => r._provenance === 'overridden');
    expect(decommissionedRows.find((r) => r.id === seedId)).toBeTruthy();
    expect(overriddenRows.find((r) => r.id === seedId)).toBeFalsy();

    // Counts must agree with the row totals.
    expect(view.counts.decommissioned).toBe(decommissionedRows.length);
    expect(view.counts.overridden).toBe(overriddenRows.length);
    expect(view.counts.seeded).toBe(total - decommissionedRows.length - overriddenRows.length);

    delete globalThis.localStorage;
  });
});
