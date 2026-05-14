// Unit tests for the meter-adapter factory (adapters/meter/index.js) —
// "the single source the rest of the codebase imports from". It
// selects a concrete adapter from METER_SOURCE / VITE_METER_SOURCE,
// caches the choice, and falls back safely on an unknown value.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getMeterAdapter, resetMeterAdapterCache,
  MockMeterAdapter, CsvMeterAdapter, UtilityApiMeterAdapter,
  BmsMeterAdapter, BmsExportMeterAdapter,
} from '../adapters/meter/index.js';

const ENV_KEYS = ['METER_SOURCE', 'VITE_METER_SOURCE'];
let saved;

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  for (const k of ENV_KEYS) delete process.env[k];
  resetMeterAdapterCache();
});
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  resetMeterAdapterCache();
});

describe('getMeterAdapter — selection', () => {
  it('defaults to BmsExportMeterAdapter when no env is set', () => {
    expect(getMeterAdapter()).toBe(BmsExportMeterAdapter);
  });

  it('selects each known source by METER_SOURCE', () => {
    const cases = {
      mock: MockMeterAdapter,
      csv: CsvMeterAdapter,
      utility_api: UtilityApiMeterAdapter,
      bms: BmsMeterAdapter,
      bms_export: BmsExportMeterAdapter,
    };
    for (const [source, adapter] of Object.entries(cases)) {
      process.env.METER_SOURCE = source;
      resetMeterAdapterCache();
      expect(getMeterAdapter()).toBe(adapter);
    }
  });

  it('honors VITE_METER_SOURCE when METER_SOURCE is unset', () => {
    process.env.VITE_METER_SOURCE = 'csv';
    expect(getMeterAdapter()).toBe(CsvMeterAdapter);
  });

  it('prefers METER_SOURCE over VITE_METER_SOURCE', () => {
    process.env.METER_SOURCE = 'mock';
    process.env.VITE_METER_SOURCE = 'csv';
    expect(getMeterAdapter()).toBe(MockMeterAdapter);
  });

  it('falls back to BmsExportMeterAdapter for an unknown source', () => {
    process.env.METER_SOURCE = 'not-a-real-source';
    expect(getMeterAdapter()).toBe(BmsExportMeterAdapter);
  });
});

describe('getMeterAdapter — caching', () => {
  it('caches the first resolution — later env changes are ignored until reset', () => {
    process.env.METER_SOURCE = 'mock';
    expect(getMeterAdapter()).toBe(MockMeterAdapter);
    process.env.METER_SOURCE = 'csv';        // changed, but cache still holds
    expect(getMeterAdapter()).toBe(MockMeterAdapter);
  });

  it('resetMeterAdapterCache lets the next call re-read the env', () => {
    process.env.METER_SOURCE = 'mock';
    expect(getMeterAdapter()).toBe(MockMeterAdapter);
    process.env.METER_SOURCE = 'csv';
    resetMeterAdapterCache();
    expect(getMeterAdapter()).toBe(CsvMeterAdapter);
  });
});
