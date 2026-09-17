// @vitest-environment jsdom
//
// The three teaching charts on the homepage, and the states they hit before
// the data arrives.
//
// These mock the composer hook rather than Supabase: what the composer does
// with rows is already covered by useMeasuredScopeTotals.test.js, and what
// matters here is the opposite direction — given a shape, does the chart draw
// something honest, or does it draw a frame full of NaN? Every one of these
// components renders on the homepage today with modelled numbers and will
// redraw the moment real invoices land, so the empty and partial states are
// not hypothetical; they are the states the charts will actually pass through.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { SCOPE3_RANGE } from '../data/geographicEstimates.js';

const { hookState } = vi.hoisted(() => ({ hookState: { value: {} } }));
vi.mock('../hooks/useMeasuredScopeTotals.js', () => ({
  useMeasuredScopeTotals: () => hookState.value,
}));

import { ScopeRangeChart } from '../components/ScopeRangeChart.js';
import { NetBalanceWaterfall } from '../components/NetBalanceWaterfall.js';
import { MeasuredShareChart } from '../components/MeasuredShareChart.js';

// Roughly today's inventory: Scope 2 metered, Scope 1 and 3 modelled.
const LOADED = {
  scope1Mt: 1350,
  scope2Mt: 390,
  scope3Mt: 2635,
  sinkMt: 2100,
  grossMt: 4375,
  netMt: 2275,
  scope1Measured: false,
  scope3Measured: false,
  loading: false,
};

const EMPTY = {
  scope1Mt: 0, scope2Mt: 0, scope3Mt: 0, sinkMt: 0,
  grossMt: 0, netMt: 0,
  scope1Measured: false, scope3Measured: false, loading: true,
};

beforeEach(() => { hookState.value = { ...LOADED }; });
afterEach(() => cleanup());

describe('ScopeRangeChart', () => {
  it('draws a row per scope with its estimate', () => {
    const { container } = render(<ScopeRangeChart />);
    expect(screen.getByText('Scope 1')).toBeTruthy();
    expect(screen.getByText('Scope 2')).toBeTruthy();
    expect(screen.getByText('Scope 3')).toBeTruthy();
    expect(container.textContent).toMatch(/2,635/);
  });

  it('marks the modelled scopes as estimated and Scope 2 as measured', () => {
    const { container } = render(<ScopeRangeChart />);
    expect(container.textContent).toMatch(/● measured/);
    expect(container.textContent).toMatch(/○ estimated/);
  });

  it('carries the point of the chart: Scope 3 uncertainty dwarfs Scope 2 entirely', () => {
    // If this ever stops being true the caption is lying, so assert the claim
    // rather than the sentence.
    const spread = SCOPE3_RANGE.high - SCOPE3_RANGE.low;
    expect(spread).toBeGreaterThan(LOADED.scope2Mt);
    const { container } = render(<ScopeRangeChart />);
    expect(container.textContent).toMatch(/Reducing the uncertainty is as much of a job/);
  });

  it('renders nothing while every scope is still zero', () => {
    hookState.value = { ...EMPTY };
    const { container } = render(<ScopeRangeChart />);
    expect(container.firstChild).toBeNull();
  });

  it('never prints NaN when a scope is missing entirely', () => {
    hookState.value = { ...LOADED, scope3Mt: undefined };
    const { container } = render(<ScopeRangeChart />);
    expect(container.textContent).not.toMatch(/NaN|undefined|Infinity/);
  });
});

describe('NetBalanceWaterfall', () => {
  it('walks the three scopes through the forest to the net figure', () => {
    const { container } = render(<NetBalanceWaterfall />);
    expect(screen.getByText('Gross')).toBeTruthy();
    expect(screen.getByText('Forest')).toBeTruthy();
    expect(screen.getByText('Net')).toBeTruthy();
    expect(container.textContent).toMatch(/4,375/);
    expect(container.textContent).toMatch(/2,275/);
  });

  it('shows the forest step as a subtraction, not another addition', () => {
    const { container } = render(<NetBalanceWaterfall />);
    expect(container.textContent).toMatch(/−2,100/);
  });

  it('reads sinkMt — the singular field the hook actually exposes', () => {
    // Regression guard. `sinksMt` is undefined, which fails the finite-number
    // check and renders NOTHING: no crash, no failing assertion elsewhere,
    // just a silently missing chart on the homepage.
    const { sinkMt, ...withoutSink } = LOADED;
    hookState.value = { ...withoutSink, sinksMt: sinkMt };
    const { container } = render(<NetBalanceWaterfall />);
    expect(container.firstChild).toBeNull();
  });

  it('does not present sequestration as a licence to emit', () => {
    const { container } = render(<NetBalanceWaterfall />);
    expect(container.textContent).toMatch(/would absorb this carbon whether or not KUA burned any oil/);
  });

  it('renders nothing before any total exists', () => {
    hookState.value = { ...EMPTY };
    const { container } = render(<NetBalanceWaterfall />);
    expect(container.firstChild).toBeNull();
  });
});

describe('MeasuredShareChart', () => {
  it('reports the measured share against the gross footprint', () => {
    // Scope 2 alone is measured: 390 / 4,375 ≈ 9%.
    const { container } = render(<MeasuredShareChart />);
    expect(container.textContent).toMatch(/9% of 4,375 mtCO₂e rests on meters/);
  });

  it('grows the measured share when a modelled scope flips to measured', () => {
    hookState.value = { ...LOADED, scope1Measured: true };
    const { container } = render(<MeasuredShareChart />);
    // 390 + 1,350 = 1,740 / 4,375 ≈ 40%.
    expect(container.textContent).toMatch(/40% of 4,375 mtCO₂e rests on meters/);
  });

  it('hatches the estimated slices so modelled data is visible as modelled', () => {
    const { container } = render(<MeasuredShareChart />);
    const hatched = [...container.querySelectorAll('rect')]
      .filter((r) => (r.getAttribute('fill') || '').includes('estHatch'));
    expect(hatched.length).toBe(2); // Scope 1 and Scope 3
  });

  it('admits the measured slice is still activity × a published factor', () => {
    const { container } = render(<MeasuredShareChart />);
    expect(container.textContent).toMatch(/nothing here\s+is measured end to end/);
  });

  it('renders nothing when there is no footprint yet', () => {
    hookState.value = { ...EMPTY };
    const { container } = render(<MeasuredShareChart />);
    expect(container.firstChild).toBeNull();
  });
});
