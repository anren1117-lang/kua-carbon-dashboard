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
    const { kgco2e, factor } = quantityToKgCO2e({ quantity: 1000, factorId: 'ef_grid_isone_2024' });
    expect(factor.unit).toBe('kWh');
    expect(kgco2e).toBeCloseTo(95.6, 1);
  });

  it('annualElectricityMt rolls up large kWh figures correctly', () => {
    expect(annualElectricityMt(1_000_000)).toBeCloseTo(95.6, 1);
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
      0.0956,
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
