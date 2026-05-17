// Unit tests for the personal-footprint estimator. The math is small
// + transparent; tests pin down the contract (right components
// included, right factors applied, suggestions match the dominant
// reducible rows).

import { describe, it, expect } from 'vitest';
import { estimatePersonalFootprint, FOOTPRINT_REFERENCE } from '../utils/personalFootprint.js';

describe('estimatePersonalFootprint — components', () => {
  it('day student gets a commute row, no flights row', () => {
    const r = estimatePersonalFootprint({
      studentType: 'day', commuteMilesOneWay: 10, beefFrequency: 'never',
      thermostatHabit: 'turn_down_when_out', showersPerWeek: 7,
    });
    const commute = r.components.find((c) => c.label.includes('Commute'));
    const flights = r.components.find((c) => c.label.includes('Flights'));
    expect(commute.mt).toBeGreaterThan(0);
    // Day student with no flights specified → 0
    expect(flights.mt).toBe(0);
  });

  it('boarder gets 0 commute, non-zero flights when flightsPerYear > 0', () => {
    const r = estimatePersonalFootprint({
      studentType: 'us_boarding', flightsPerYear: 2, beefFrequency: 'never',
      thermostatHabit: 'turn_down_when_out', showersPerWeek: 7,
    });
    const commute = r.components.find((c) => c.label.includes('Commute'));
    const flights = r.components.find((c) => c.label.includes('Flights'));
    expect(commute.mt).toBe(0);
    expect(flights.mt).toBeCloseTo(2 * 0.6, 1); // 2 trips × 0.6 mt domestic
  });

  it('international student gets the international per-flight factor', () => {
    const r = estimatePersonalFootprint({
      studentType: 'international', flightsPerYear: 2, beefFrequency: 'never',
      thermostatHabit: 'turn_down_when_out',
    });
    const flights = r.components.find((c) => c.label.includes('Flights'));
    expect(flights.mt).toBeCloseTo(2 * 2.5, 1); // 2 × 2.5 mt international
  });

  it('thermostat is zeroed for day students (no campus heating control)', () => {
    const r = estimatePersonalFootprint({
      studentType: 'day', thermostatHabit: 'off_when_out', beefFrequency: 'never',
    });
    const therm = r.components.find((c) => c.label.includes('thermostat'));
    expect(therm.mt).toBe(0);
  });

  it('beef "never" zeroes the beef row', () => {
    const r = estimatePersonalFootprint({ studentType: 'day', beefFrequency: 'never' });
    const beef = r.components.find((c) => c.label.includes('Beef'));
    expect(beef.mt).toBe(0);
  });

  it('beef "daily" scales linearly vs "weekly"', () => {
    const weekly = estimatePersonalFootprint({ studentType: 'day', beefFrequency: 'weekly' })
      .components.find((c) => c.label.includes('Beef')).mt;
    const daily = estimatePersonalFootprint({ studentType: 'day', beefFrequency: 'daily' })
      .components.find((c) => c.label.includes('Beef')).mt;
    expect(daily).toBeCloseTo(weekly * 7, 1);
  });

  it('total = sum of rows', () => {
    const r = estimatePersonalFootprint({
      studentType: 'us_boarding', flightsPerYear: 1,
      beefFrequency: 'few_times_week', thermostatHabit: 'turn_down_when_out', showersPerWeek: 5,
    });
    const sumRows = r.components.reduce((s, c) => s + c.mt, 0);
    expect(r.totalMt).toBeCloseTo(Math.round(sumRows * 100) / 100, 2);
  });
});

describe('estimatePersonalFootprint — input handling', () => {
  it('handles missing/invalid input with sensible defaults', () => {
    const r = estimatePersonalFootprint({});
    expect(Number.isFinite(r.totalMt)).toBe(true);
    expect(r.components.length).toBe(5);
  });

  it('clamps negative numbers to 0', () => {
    const r = estimatePersonalFootprint({
      studentType: 'day', commuteMilesOneWay: -5, flightsPerYear: -2, beefFrequency: 'never',
    });
    const commute = r.components.find((c) => c.label.includes('Commute'));
    expect(commute.mt).toBe(0);
  });

  it('handles non-numeric strings as 0', () => {
    const r = estimatePersonalFootprint({
      studentType: 'day', commuteMilesOneWay: 'lots', flightsPerYear: 'few', beefFrequency: 'never',
    });
    expect(r.totalMt).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(r.totalMt)).toBe(true);
  });
});

describe('estimatePersonalFootprint — suggestions', () => {
  it('suggests carpooling when commute dominates', () => {
    const r = estimatePersonalFootprint({
      studentType: 'day', commuteMilesOneWay: 30, beefFrequency: 'never',
    });
    expect(r.suggestions.some((s) => /carpool/i.test(s))).toBe(true);
  });

  it('suggests fewer flights when flights dominate', () => {
    const r = estimatePersonalFootprint({
      studentType: 'international', flightsPerYear: 4, beefFrequency: 'never',
      thermostatHabit: 'off_when_out',
    });
    expect(r.suggestions.some((s) => /trip|flight/i.test(s))).toBe(true);
  });

  it('does not suggest cutting beef for someone who never eats beef', () => {
    const r = estimatePersonalFootprint({
      studentType: 'us_boarding', flightsPerYear: 4, beefFrequency: 'never',
    });
    expect(r.suggestions.every((s) => !/beef/i.test(s))).toBe(true);
  });

  it('does not suggest a thermostat change for a student already turning it off', () => {
    const r = estimatePersonalFootprint({
      studentType: 'us_boarding', flightsPerYear: 0, beefFrequency: 'daily',
      thermostatHabit: 'off_when_out',
    });
    expect(r.suggestions.every((s) => !/thermostat|heat/i.test(s))).toBe(true);
  });
});

describe('FOOTPRINT_REFERENCE', () => {
  it('exposes the three comparison numbers the UI reads', () => {
    expect(FOOTPRINT_REFERENCE.kuaPerStudentNetMt).toBeGreaterThan(0);
    expect(FOOTPRINT_REFERENCE.usAdultAvgMt).toBeGreaterThan(FOOTPRINT_REFERENCE.kuaPerStudentNetMt);
    expect(FOOTPRINT_REFERENCE.parisAlignedMt).toBeLessThan(FOOTPRINT_REFERENCE.kuaPerStudentNetMt);
  });
});
