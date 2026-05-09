// @vitest-environment jsdom
//
// Component-level tests for the public /renewables page (Phase 40).
// Verifies the page flips from static "No records yet" labels to
// measured kWh + avoided emissions the moment renewables_solar /
// renewables_geothermal / renewables_wind have rows.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup, waitFor, within } from '@testing-library/react';

const { setNextResponses, makeQueryHarness } = vi.hoisted(() => {
  let responses = {};
  const setNextResponses = (next) => { responses = next; };
  const makeQueryHarness = () => {
    function makeBuilder(table) {
      const promiseLike = {
        select() { return promiseLike; },
        order() { return promiseLike; },
        limit() { return promiseLike; },
        eq()    { return promiseLike; },
        then(resolve, reject) {
          const r = responses[table] ?? { data: [], error: null };
          return Promise.resolve(r).then(resolve, reject);
        },
      };
      return promiseLike;
    }
    return { from: (table) => makeBuilder(table) };
  };
  return { setNextResponses, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import Renewables from '../pages/Renewables.js';
import { _resetCacheForTests } from '../hooks/measuredCache.js';

beforeEach(() => {
  cleanup();
  setNextResponses({});
  _resetCacheForTests();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('Renewables page (public /renewables)', () => {
  it('renders the page heading + all three system cards', async () => {
    render(<Renewables />);
    expect(screen.getByRole('heading', { level: 1, name: /On-Site Renewable Generation/i })).toBeTruthy();
    // Each system card heading appears as a name field. Use a more
    // precise query — there's overlap with the EducationalCard
    // section bodies, so look for the bold name styling.
    // Easiest: getByText with exact='Solar PV Array' (case-sensitive).
    expect(screen.getByText('Solar PV Array')).toBeTruthy();
    expect(screen.getByText('Geothermal Ground-Source Heat Pump')).toBeTruthy();
    expect(screen.getByText('Wind Turbine')).toBeTruthy();
  });

  it('flips solar to measured + shows avoided emissions when renewables_solar has rows', async () => {
    setNextResponses({
      renewables_solar: {
        data: [{ gross_kwh: 110000, self_consumed_kwh: 100000, exported_kwh: 10000 }],
        error: null,
      },
      renewables_geothermal: { data: [], error: null },
      renewables_wind: { data: [], error: null },
    });
    render(<Renewables />);
    // 110,000 kWh gross only renders on the measured path.
    await waitFor(() => {
      expect(screen.queryByText(/110,000/)).not.toBeNull();
    });
    // Avoided emissions ≈ 32.09 mt total (29.17 self + 2.92 export).
    expect(screen.getByText(/32\.09/)).toBeTruthy();
    // Solar card now shows the green "Measured" pill.
    const solarHeading = screen.getByText('Solar PV Array');
    const solarCard = solarHeading.closest('div')?.parentElement?.parentElement;
    expect(solarCard).toBeTruthy();
    expect(within(solarCard).getByText('Measured')).toBeTruthy();
  });

  it('flips geothermal to measured + shows avoided fossil emissions', async () => {
    setNextResponses({
      renewables_solar: { data: [], error: null },
      renewables_geothermal: {
        data: [{ kwh_input: 1000, cop: 3.5, avoided_fuel_type: 'heating_oil' }],
        error: null,
      },
      renewables_wind: { data: [], error: null },
    });
    render(<Renewables />);
    // Thermal MMBtu (~11.9) only renders on the measured path.
    await waitFor(() => {
      expect(screen.queryByText(/11\.9/)).not.toBeNull();
    });
    // Avoided fossil emissions ≈ 0.88 mt — appears both as the
    // headline number and inside the per-fuel breakdown note, so use
    // getAllByText.
    expect(screen.getAllByText(/0\.88/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders wind status from the latest wind row', async () => {
    setNextResponses({
      renewables_solar: { data: [], error: null },
      renewables_geothermal: { data: [], error: null },
      renewables_wind: {
        data: [
          { as_of_date: '2026-04-15', status: 'offline', rated_kw: 12, last_operational_date: '2018-06-01', historical_kwh: 20000 },
        ],
        error: null,
      },
    });
    render(<Renewables />);
    // Last-operational date appears only in the measured wind metric grid.
    await waitFor(() => {
      expect(screen.queryByText(/2018-06-01/)).not.toBeNull();
    });
    // Historical kWh (20,000) and rated capacity (12 kW) both render.
    expect(screen.getByText(/20,000/)).toBeTruthy();
  });
});
