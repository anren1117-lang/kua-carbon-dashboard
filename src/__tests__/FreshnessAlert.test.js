// @vitest-environment jsdom
//
// Component-level tests for the FreshnessAlert banner on AdminHome
// (Phase 49). Banner suppression rules + headline severity are easy
// to break with a careless edit, so lock them in here.
//
//   - null   freshness (still loading)         → renders nothing
//   - all-fresh freshness                      → renders nothing
//   - any stale                                → red banner, "X stale" headline
//   - any aging (no stale)                     → amber banner, "Y aging" headline
//   - any empty (no stale, no aging)           → gray banner, "Z empty" headline
//   - stale list shown when populated, capped at first 5

import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FreshnessAlert } from '../pages/admin/AdminHome.js';

beforeEach(() => { cleanup(); });

function wrap(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('FreshnessAlert (AdminHome banner)', () => {
  it('renders nothing while freshness is still loading (null)', () => {
    const { container } = wrap(<FreshnessAlert freshness={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when every table is fresh', () => {
    const { container } = wrap(<FreshnessAlert freshness={{
      fresh: 17, aging: 0, stale: 0, empty: 0, irregular: 0, unknown: 0, staleTables: [],
    }} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the banner + irregular table count when any non-fresh exists', () => {
    wrap(<FreshnessAlert freshness={{
      fresh: 13, aging: 0, stale: 0, empty: 1, irregular: 3, unknown: 0, staleTables: [],
    }} />);
    expect(screen.getByText(/Data freshness/i)).toBeTruthy();
    expect(screen.getByText(/13\/17 fresh/)).toBeTruthy();
    expect(screen.getByText(/3 irregular/)).toBeTruthy();
  });

  it('shows "stale" headline + warning glyph when any table is stale', () => {
    wrap(<FreshnessAlert freshness={{
      fresh: 10, aging: 1, stale: 3, empty: 1, irregular: 2, unknown: 0,
      staleTables: ['Heating oil deliveries', 'Propane deliveries', 'Faculty/staff commute (Cat 7)'],
    }} />);
    expect(screen.getByText(/3 tables stale/i)).toBeTruthy();
    expect(screen.getByText(/⚠/)).toBeTruthy();
    // Stale table list visible
    expect(screen.getByText(/Heating oil deliveries/i)).toBeTruthy();
    expect(screen.getByText(/Propane deliveries/i)).toBeTruthy();
  });

  it('shows "aging" headline when only aging (no stale)', () => {
    wrap(<FreshnessAlert freshness={{
      fresh: 13, aging: 2, stale: 0, empty: 0, irregular: 2, unknown: 0, staleTables: [],
    }} />);
    expect(screen.getByText(/2 tables aging/i)).toBeTruthy();
    // No warning glyph (stale only)
    expect(screen.queryByText(/⚠/)).toBeNull();
  });

  it('shows "empty" headline when only empty (no stale, no aging)', () => {
    wrap(<FreshnessAlert freshness={{
      fresh: 14, aging: 0, stale: 0, empty: 1, irregular: 2, unknown: 0, staleTables: [],
    }} />);
    expect(screen.getByText(/1 table empty/i)).toBeTruthy();
  });

  it('caps the stale-table list at 5 with a "+N more" suffix', () => {
    wrap(<FreshnessAlert freshness={{
      fresh: 5, aging: 0, stale: 7, empty: 0, irregular: 0, unknown: 0,
      staleTables: ['T1','T2','T3','T4','T5','T6','T7'],
    }} />);
    // First 5 names appear individually + "+2 more"
    for (const t of ['T1','T2','T3','T4','T5']) {
      expect(screen.getByText(t)).toBeTruthy();
    }
    expect(screen.getByText(/\+2 more/)).toBeTruthy();
    expect(screen.queryByText('T6')).toBeNull();
    expect(screen.queryByText('T7')).toBeNull();
  });

  it('renders each stale table as a deep link when staleTables carries {label, cta}', () => {
    wrap(<FreshnessAlert freshness={{
      fresh: 14, aging: 0, stale: 2, empty: 0, irregular: 0, unknown: 0,
      staleTables: [
        { label: 'Propane deliveries', cta: '/admin/scope-1/propane' },
        { label: 'Solar PV records',   cta: '/admin/renewables/solar' },
      ],
    }} />);
    const propane = screen.getByRole('link', { name: /Propane deliveries/i });
    expect(propane.getAttribute('href')).toBe('/admin/scope-1/propane');
    const solar = screen.getByRole('link', { name: /Solar PV records/i });
    expect(solar.getAttribute('href')).toBe('/admin/renewables/solar');
  });

  it('grammar: 1 stale singular, 2+ stale plural', () => {
    wrap(<FreshnessAlert freshness={{
      fresh: 16, aging: 0, stale: 1, empty: 0, irregular: 0, unknown: 0, staleTables: ['Solo'],
    }} />);
    expect(screen.getByText(/1 table stale/)).toBeTruthy();
    // The plural variant shouldn't appear in the singular case
    expect(screen.queryByText(/1 tables stale/)).toBeNull();
  });

  it('links to the data-quality page', () => {
    wrap(<FreshnessAlert freshness={{
      fresh: 0, aging: 0, stale: 17, empty: 0, irregular: 0, unknown: 0, staleTables: [],
    }} />);
    const link = screen.getByRole('link', { name: /Review on Data Quality/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/admin/data-quality');
  });
});
