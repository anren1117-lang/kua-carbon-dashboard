// Unit tests for the real-world equivalents helpers — energyEquivalents
// (kWh → Tesla charges / iPhone charges / bulb-hours) and
// carbonEquivalents (mtCO2e → car-years / tree-years / etc). These
// drive the EnergyEquivalents card and the Executive hero, so the
// negative/zero guards and the rounding need pinning.

import { describe, it, expect } from 'vitest';
import { energyEquivalents, carbonEquivalents } from '../utils/equivalents.js';

describe('energyEquivalents', () => {
  it('converts kWh into each equivalent and rounds', () => {
    const e = energyEquivalents(8200);
    expect(e.teslaCharges).toBe(100);          // 8200 / 82
    expect(e.iphoneCharges).toBe(Math.round(8200 / 0.0197));
    expect(e.bulbHours).toBe(Math.round(8200 / 0.06));
  });

  it('zeroes everything for 0 / negative / falsy input', () => {
    const zero = { teslaCharges: 0, iphoneCharges: 0, bulbHours: 0 };
    expect(energyEquivalents(0)).toEqual(zero);
    expect(energyEquivalents(-500)).toEqual(zero);
    expect(energyEquivalents(NaN)).toEqual(zero);
    expect(energyEquivalents(undefined)).toEqual(zero);
  });

  it('scales linearly', () => {
    const one = energyEquivalents(82);
    const ten = energyEquivalents(820);
    expect(ten.teslaCharges).toBe(one.teslaCharges * 10);
  });
});

describe('carbonEquivalents', () => {
  it('converts mtCO2e into each equivalent and rounds', () => {
    const c = carbonEquivalents(46);
    expect(c.carYears).toBe(10);               // 46 / 4.6
    expect(c.treeYears).toBe(Math.round(46 / 0.0605));
    expect(c.homeYears).toBe(Math.round(46 / 8.81));
    expect(c.transatFlights).toBe(Math.round(46 / 1.4));
    expect(c.galsGasoline).toBe(Math.round(46 / 0.00878));
  });

  it('zeroes every field for 0 / negative / falsy input', () => {
    const zero = {
      carYears: 0, treeYears: 0, homeYears: 0,
      transatFlights: 0, galsGasoline: 0, bulbsPerYear: 0,
    };
    expect(carbonEquivalents(0)).toEqual(zero);
    expect(carbonEquivalents(-12)).toEqual(zero);
    expect(carbonEquivalents(NaN)).toEqual(zero);
  });

  it('produces a positive integer bulbsPerYear for a real mt figure', () => {
    const c = carbonEquivalents(1720);
    expect(Number.isInteger(c.bulbsPerYear)).toBe(true);
    expect(c.bulbsPerYear).toBeGreaterThan(0);
  });

  it('scales linearly', () => {
    const small = carbonEquivalents(4.6);
    const big = carbonEquivalents(46);
    expect(big.carYears).toBe(small.carYears * 10);
  });
});
