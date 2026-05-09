// Hydrate the public Renewables page from the three Supabase tables
// admins write to: renewables_solar, renewables_geothermal,
// renewables_wind.
//
// Falls back to "no records yet" (provenance: 'estimated') when each
// table is empty or doesn't exist — the public page renders the
// static description + zero/placeholder metrics in that case. Each
// system flips estimated → measured independently.
//
// Why we don't subtract self-consumed solar from Scope 2 here: the
// BMS feeds in composedYtd.js measure post-meter grid pull, which
// is already net of behind-the-meter solar. Subtracting again would
// double-count. The composers expose avoided-emission lines for
// transparency but the dashboard's Scope 2 total is unchanged.

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import {
  composeSolarFromRecords,
  composeGeothermalFromRecords,
  composeWindFromRecords,
} from '../data/scopeTotals.js';
import { cachedFetch } from './measuredCache.js';

const EMPTY_SOLAR = composeSolarFromRecords([]);
const EMPTY_GEO = composeGeothermalFromRecords([]);
const EMPTY_WIND = composeWindFromRecords([]);

/**
 * @returns {{
 *   solar: ReturnType<typeof composeSolarFromRecords>,
 *   geothermal: ReturnType<typeof composeGeothermalFromRecords>,
 *   wind: ReturnType<typeof composeWindFromRecords>,
 *   solarMeasured: boolean,
 *   geothermalMeasured: boolean,
 *   windMeasured: boolean,
 *   measured: boolean,
 *   loading: boolean,
 *   error: string | null,
 * }}
 */
export function useMeasuredRenewables() {
  const [state, setState] = useState(() => ({
    solar: EMPTY_SOLAR,
    geothermal: EMPTY_GEO,
    wind: EMPTY_WIND,
    solarMeasured: false,
    geothermalMeasured: false,
    windMeasured: false,
    measured: false,
    loading: true,
    error: null,
  }));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [solarRes, geoRes, windRes] = await cachedFetch('renewables', () => Promise.all([
          supabase
            .from('renewables_solar')
            .select('period_start, period_end, gross_kwh, self_consumed_kwh, exported_kwh, data_quality')
            .then((r) => r, () => ({ data: [], error: null })),
          supabase
            .from('renewables_geothermal')
            .select('period_start, period_end, kwh_input, cop, avoided_fuel_type, data_quality')
            .then((r) => r, () => ({ data: [], error: null })),
          supabase
            .from('renewables_wind')
            .select('status, as_of_date, last_operational_date, rated_kw, historical_kwh')
            .then((r) => r, () => ({ data: [], error: null })),
        ]));
        if (cancelled) return;

        const firstError = [solarRes, geoRes, windRes].find((r) => r.error)?.error;
        if (firstError) {
          setState((prev) => ({ ...prev, loading: false, error: firstError.message || 'Supabase error' }));
          return;
        }

        const solarRows = solarRes.data || [];
        const geoRows = geoRes.data || [];
        const windRows = windRes.data || [];
        const solar = composeSolarFromRecords(solarRows);
        const geothermal = composeGeothermalFromRecords(geoRows);
        const wind = composeWindFromRecords(windRows);
        setState({
          solar,
          geothermal,
          wind,
          solarMeasured: solarRows.length > 0,
          geothermalMeasured: geoRows.length > 0,
          windMeasured: windRows.length > 0,
          measured: solarRows.length + geoRows.length + windRows.length > 0,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setState((prev) => ({ ...prev, loading: false, error: err.message || 'fetch failed' }));
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return state;
}
