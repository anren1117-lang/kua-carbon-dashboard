// Unit tests for hotspot ranking — buildingHotspots (magnitude +
// share + severity) and rankActions (impact × urgency × confidence −
// difficulty penalty). Both feed dashboard prioritization, so the
// ordering and the severity cutoffs need pinning down.
//
// Regression: rankActions previously had no fallback for an unknown
// `difficulty`, so diffPenalty[undefined] turned the score into NaN.

import { describe, it, expect } from 'vitest';
import { buildingHotspots, rankActions } from '../utils/hotspots.js';

describe('buildingHotspots', () => {
  const buildings = [
    { id: 'a', name: 'Big Hall',   kwh: 100_000 },
    { id: 'b', name: 'Mid House',  kwh: 40_000 },
    { id: 'c', name: 'Small Shed', kwh: 10_000 },
  ];
  const TOTAL = 150_000;
  const KG_PER_KWH = 0.3;

  it('converts kWh to metric tons CO2e', () => {
    const [big] = buildingHotspots(buildings, TOTAL, KG_PER_KWH);
    // 100,000 kWh × 0.3 kg / 1000 = 30 mt
    expect(big.mtCO2eAnnual).toBe(30);
  });

  it('computes percent-of-total share', () => {
    const rows = buildingHotspots(buildings, TOTAL, KG_PER_KWH);
    const mid = rows.find((r) => r.id === 'b');
    // 40,000 / 150,000 = 26.7%
    expect(mid.percentOfTotal).toBe(26.7);
  });

  it('assigns severity by share: >=8 high, >=3 medium, else low', () => {
    // Shares: a 66.7%, b 26.7%, c 6.7%. Add a tiny one under 3%.
    const withTiny = [...buildings, { id: 'd', name: 'Closet', kwh: 3_000 }];
    const rows = buildingHotspots(withTiny, 153_000, KG_PER_KWH);
    const sev = Object.fromEntries(rows.map((r) => [r.id, r.severity]));
    expect(sev.a).toBe('high');    // 65%
    expect(sev.b).toBe('high');    // 26%
    expect(sev.c).toBe('medium');  // 6.5%
    expect(sev.d).toBe('low');     // 1.96%
  });

  it('sorts descending by mtCO2eAnnual', () => {
    const rows = buildingHotspots(buildings, TOTAL, KG_PER_KWH);
    expect(rows.map((r) => r.id)).toEqual(['a', 'b', 'c']);
  });

  it('treats a zero total as 0% share rather than dividing by zero', () => {
    const rows = buildingHotspots(buildings, 0, KG_PER_KWH);
    expect(rows.every((r) => r.percentOfTotal === 0)).toBe(true);
  });

  it('returns [] for an empty building list', () => {
    expect(buildingHotspots([], TOTAL, KG_PER_KWH)).toEqual([]);
  });
});

describe('rankActions', () => {
  const action = (over) => ({
    expectedReductionMtCO2e: 10,
    urgency: 'medium',
    confidence: 'medium',
    difficulty: 'low',
    ...over,
  });

  it('scores impact × urgency × confidence − difficulty penalty', () => {
    // 10 × 3 (high urgency) × 3 (high conf) − 10 (high difficulty) = 80
    const [{ score }] = rankActions([action({ urgency: 'high', confidence: 'high', difficulty: 'high' })]);
    expect(score).toBe(80);
  });

  it('ranks higher-scoring actions first', () => {
    const ranked = rankActions([
      action({ expectedReductionMtCO2e: 1,  urgency: 'low' }),
      action({ expectedReductionMtCO2e: 50, urgency: 'high', confidence: 'high' }),
      action({ expectedReductionMtCO2e: 5 }),
    ]);
    expect(ranked.map((r) => r.action.expectedReductionMtCO2e)).toEqual([50, 5, 1]);
  });

  it('does not mutate the input array', () => {
    const input = [action({ expectedReductionMtCO2e: 1 }), action({ expectedReductionMtCO2e: 9 })];
    const before = input.map((a) => a.expectedReductionMtCO2e);
    rankActions(input);
    expect(input.map((a) => a.expectedReductionMtCO2e)).toEqual(before);
  });

  it('falls back to weight 1 for unknown urgency / confidence', () => {
    // 10 × 1 × 1 − 0 = 10
    const [{ score }] = rankActions([action({ urgency: 'bogus', confidence: undefined })]);
    expect(score).toBe(10);
  });

  it('does not produce NaN when difficulty is missing or unknown (regression)', () => {
    const ranked = rankActions([
      action({ difficulty: undefined }),
      action({ difficulty: 'extreme' }),
    ]);
    expect(ranked.every((r) => Number.isFinite(r.score))).toBe(true);
    // Both fall back to a 0 penalty: 10 × 2 × 2 − 0 = 40.
    expect(ranked.every((r) => r.score === 40)).toBe(true);
  });
});
