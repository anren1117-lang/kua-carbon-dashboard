// @vitest-environment jsdom
//
// The two new charts, and the states that only appear when data is missing.
//
// A chart that looks right with today's data and breaks on a partial month, an
// empty year, or a newly published vintage is a chart that will break exactly
// when someone enters data — which is the moment it most needs to work. These
// tests exercise those paths now, while they are cheap to fix.

import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { DegreeDayChart } from '../components/DegreeDayChart.js';
import { GridVintageChart } from '../components/GridVintageChart.js';
import { compareToNormal, HDD_ACTUAL } from '../data/degreeDays.js';
import { scope2MtAtVintage } from '../data/gridMix.js';

afterEach(() => cleanup());

describe('DegreeDayChart', () => {
  it('renders a bar pair for every month it has', () => {
    const { container } = render(<DegreeDayChart year={2026} />);
    const months = Object.keys(HDD_ACTUAL[2026].hdd).length;
    // One "normal" bar and one "actual" bar per month.
    expect(container.querySelectorAll('rect').length).toBeGreaterThanOrEqual(months * 2);
  });

  it('draws the partial month but gives it no percentage', () => {
    const { container } = render(<DegreeDayChart year={2026} />);
    const titles = [...container.querySelectorAll('title')].map((t) => t.textContent);
    const sep = titles.find((t) => /Sep 2026/.test(t));
    expect(sep).toBeDefined();
    expect(sep).toMatch(/incomplete/i);
    // A percentage on a half-month would read as a real comparison.
    expect(sep).not.toMatch(/%/);
  });

  it('states the comparison over whole months only', () => {
    render(<DegreeDayChart year={2026} />);
    const c = compareToNormal(2026);
    expect(screen.getByText(new RegExp(`${c.monthsCompared} whole months`))).toBeTruthy();
  });

  it('returns nothing at all for a year with no data', () => {
    // Not an empty frame, not a zero bar — nothing.
    const { container } = render(<DegreeDayChart year={1999} />);
    expect(container.firstChild).toBeNull();
  });

  it('survives a year where every month is partial', () => {
    // Defensive: if a capture ever lands mid-month across the board, the
    // summary has nothing to compare and must not throw or print NaN.
    const { container } = render(<DegreeDayChart year={2025} />);
    expect(container.textContent).not.toMatch(/NaN|undefined|Infinity/);
  });
});

describe('GridVintageChart', () => {
  it('draws one bar per published vintage', () => {
    const { container } = render(<GridVintageChart kwh={1_663_697} />);
    const vintages = scope2MtAtVintage(1_663_697).length;
    expect(container.querySelectorAll('rect').length).toBe(vintages);
  });

  it('marks the reporting vintage rather than hardcoding a year', () => {
    render(<GridVintageChart kwh={1_663_697} />);
    expect(screen.getByText('reported')).toBeTruthy();
  });

  it('shows the same kWh producing different emissions', () => {
    const rows = scope2MtAtVintage(1_663_697);
    const lo = Math.min(...rows.map((r) => r.mtCO2e));
    const hi = Math.max(...rows.map((r) => r.mtCO2e));
    // The whole point: identical electricity, different answer.
    expect(hi).toBeGreaterThan(lo * 1.05);
    render(<GridVintageChart kwh={1_663_697} />);
    expect(screen.getByText(String(hi))).toBeTruthy();
    expect(screen.getByText(String(lo))).toBeTruthy();
  });

  it('says the axis is truncated, because a silent one overstates the spread', () => {
    render(<GridVintageChart kwh={1_663_697} />);
    expect(screen.getByText(/axis starts below the lowest bar/i)).toBeTruthy();
  });

  it('renders nothing for zero or invalid kWh', () => {
    for (const bad of [0, -5, NaN, undefined]) {
      const { container } = render(<GridVintageChart kwh={bad} />);
      expect(container.firstChild).toBeNull();
      cleanup();
    }
  });

  it('never prints NaN when the electricity total is small', () => {
    // This asserted on textContent only, which showed "0" and passed while
    // the SVG y/height ATTRIBUTES were NaN and the bars rendered nowhere.
    // Checking the wrong surface is not a guard. Phase 421.
    const { container } = render(<GridVintageChart kwh={1} />);
    expect(container.textContent).not.toMatch(/NaN|undefined|Infinity/);
    for (const el of container.querySelectorAll('*')) {
      for (const attr of el.attributes) {
        expect(attr.value, `${el.tagName}.${attr.name}`).not.toMatch(/NaN|Infinity/);
      }
    }
  });

  it('declines to draw when every vintage rounds to the same figure', () => {
    // No spread means no comparison to make; a flat row of bars would imply
    // one. Below ~100 kWh all five vintages round to 0.0 mtCO2e.
    const { container } = render(<GridVintageChart kwh={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('still renders bars, with finite geometry, at a realistic total', () => {
    const { container } = render(<GridVintageChart kwh={1_663_697} />);
    const rects = [...container.querySelectorAll('rect')];
    expect(rects.length).toBeGreaterThan(0);
    for (const r of rects) {
      expect(Number.isFinite(parseFloat(r.getAttribute('y')))).toBe(true);
      expect(Number.isFinite(parseFloat(r.getAttribute('height')))).toBe(true);
    }
  });
});
