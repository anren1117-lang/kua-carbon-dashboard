// Meter adapter factory. The single source the rest of the codebase imports
// from. Decides which concrete adapter to use based on env (METER_SOURCE),
// defaulting to mock so the app runs out-of-the-box.

import { MockMeterAdapter }       from './MockMeterAdapter.js';
import { CsvMeterAdapter }        from './CsvMeterAdapter.js';
import { UtilityApiMeterAdapter } from './UtilityApiMeterAdapter.js';
import { BmsMeterAdapter }        from './BmsMeterAdapter.js';
import { BmsExportMeterAdapter }  from './BmsExportMeterAdapter.js';

const SOURCES = {
  mock: MockMeterAdapter,
  csv: CsvMeterAdapter,
  utility_api: UtilityApiMeterAdapter,
  bms: BmsMeterAdapter,
  bms_export: BmsExportMeterAdapter,
};

function readEnv(key) {
  // Vite client (import.meta.env) and Node serverless (process.env) both
  // need to work. Probe both.
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {}
  return undefined;
}

let cached = null;

/** @returns {import('./MeterDataAdapter.js').MeterDataAdapter} */
export function getMeterAdapter() {
  if (cached) return cached;
  const source = readEnv('METER_SOURCE') || readEnv('VITE_METER_SOURCE') || 'bms_export';
  cached = SOURCES[source] || BmsExportMeterAdapter;
  return cached;
}

/** Reset the factory cache. Useful when the admin maps a new meter
 *  and wants the next API call to pick it up. */
export function resetMeterAdapterCache() { cached = null; }

// Convenience re-exports so callers can opt out of the factory.
export { MockMeterAdapter, CsvMeterAdapter, UtilityApiMeterAdapter, BmsMeterAdapter, BmsExportMeterAdapter };
