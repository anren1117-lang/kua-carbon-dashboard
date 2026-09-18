// @vitest-environment jsdom
//
// The composers have always returned a per-component `breakdown` — Scope 1:
// heating 1,290 / fleet 54 / refrigerants 7; Scope 3: goods 1,315 / travel 760
// / dining 235 / upstream 230 / commuting 90 / waste 5 — each with its own
// provenance. Scope1.js read it ZERO times and Scope3.js rendered only its
// cohort table, so a reader could see a scope total but never its parts.
//
// UNGATED on purpose: cohortDetail is undefined on the placeholder path (so
// gating THAT behind isMeasured is right), but breakdown is always present,
// and per-row provenance is the point of showing it before live rows exist.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROUTER_FUTURE } from './routerFuture.js';

const { makeQueryHarness } = vi.hoisted(() => {
  const makeQueryHarness = () => {
    const promiseLike = {
      select() { return promiseLike; },
      order()  { return promiseLike; },
      limit()  { return promiseLike; },
      eq()     { return promiseLike; },
      then(resolve, reject) { return Promise.resolve({ data: [], error: null }).then(resolve, reject); },
    };
    return { from: () => promiseLike };
  };
  return { makeQueryHarness };
});
vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import Scope1 from '../pages/Scope1.js';
import Scope3 from '../pages/Scope3.js';
import { ScopeBreakdownPanel } from '../components/ScopeBreakdownPanel.js';

const mount = (C) => render(<MemoryRouter future={ROUTER_FUTURE}><C /></MemoryRouter>);
beforeEach(cleanup);
afterEach(cleanup);

describe('per-component breakdown is visible', () => {
  // Scoped to the panel's own region, NOT getAllByText. These component names
  // legitimately repeat elsewhere on the page — Scope 1 has a "Fleet Vehicles"
  // category card, Scope 3's thirdMetric says "Purchased goods" — so a
  // page-wide getAllByText would stay green even if this panel rendered
  // nothing and only the category card matched.
  it('Scope 1 names its three components with figures', () => {
    mount(Scope1);
    const panel = screen.getByRole('region', { name: /Where Scope 1 comes from/i });
    expect(within(panel).getByText(/Heating oil \+ propane/i)).toBeTruthy();
    expect(within(panel).getByText(/Fleet vehicles/i)).toBeTruthy();
    expect(within(panel).getByText(/Refrigerant leakage/i)).toBeTruthy();
    expect(within(panel).getByText('1,290')).toBeTruthy();   // heating, the dominant line
    expect(within(panel).getByText('54')).toBeTruthy();
    expect(within(panel).getByText('7')).toBeTruthy();
  });

  it('Scope 3 shows purchased goods — the biggest line in the inventory', () => {
    mount(Scope3);
    const panel = screen.getByRole('region', { name: /Where Scope 3 comes from/i });
    expect(within(panel).getByText(/Purchased goods/i)).toBeTruthy();
    expect(within(panel).getByText('1,315')).toBeTruthy();
    expect(within(panel).getByText('760')).toBeTruthy();     // student travel
    // 1,315 of 2,635 is ~50% — the share column must agree with the figures.
    expect(within(panel).getByText('50%')).toBeTruthy();
  });

  it('shares are computed from the rows, so they sum to 100%', () => {
    const rows = [
      { source: 'A', mt: 750, provenance: 'measured', method: 'm' },
      { source: 'B', mt: 250, provenance: 'estimated', method: 'm' },
    ];
    render(<ScopeBreakdownPanel breakdown={rows} title="T" />);
    const panel = screen.getByRole('region', { name: 'T' });
    expect(within(panel).getByText('75%')).toBeTruthy();
    expect(within(panel).getByText('25%')).toBeTruthy();
  });

  it('renders nothing rather than an empty shell when there is no breakdown', () => {
    const { container } = render(<ScopeBreakdownPanel breakdown={[]} title="T" />);
    expect(container.firstChild).toBeNull();
    const { container: c2 } = render(<ScopeBreakdownPanel breakdown={undefined} title="T" />);
    expect(c2.firstChild).toBeNull();
  });
});
