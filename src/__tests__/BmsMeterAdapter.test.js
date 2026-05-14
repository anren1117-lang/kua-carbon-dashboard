// Unit tests for BmsMeterAdapter — the live Distech Eclypse REST
// adapter. The network paths need the campus BMS, but the
// configuration contract and the read-only guarantee are testable in
// isolation: the adapter must fail loud-and-clear when its env vars
// are missing rather than silently returning empty data.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BmsMeterAdapter } from '../adapters/meter/BmsMeterAdapter.js';

const ENV_KEYS = ['BMS_BASE_URL', 'BMS_USERNAME', 'BMS_PASSWORD', 'BMS_POINT_MAP'];
let saved;

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  for (const k of ENV_KEYS) delete process.env[k];
});
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  vi.unstubAllGlobals();
});

function configure({ pointMap = { m_oil_campus: 'analog-value,5/present-value' } } = {}) {
  process.env.BMS_BASE_URL = 'https://bms.example.test/';
  process.env.BMS_USERNAME = 'svc';
  process.env.BMS_PASSWORD = 'secret';
  process.env.BMS_POINT_MAP = JSON.stringify(pointMap);
}

describe('BmsMeterAdapter — configuration contract', () => {
  it('rejects listMeters with a clear message when env vars are missing', async () => {
    await expect(BmsMeterAdapter.listMeters())
      .rejects.toThrow(/not configured — missing env vars: BMS_BASE_URL, BMS_USERNAME, BMS_PASSWORD/);
  });

  it('rejects getReadings when env vars are missing', async () => {
    await expect(BmsMeterAdapter.getReadings({ start: '2026-04-01', end: '2026-04-02' }))
      .rejects.toThrow(/not configured — missing env vars/);
  });

  it('names only the env vars that are actually missing', async () => {
    process.env.BMS_BASE_URL = 'https://bms.example.test';
    await expect(BmsMeterAdapter.listMeters())
      .rejects.toThrow(/missing env vars: BMS_USERNAME, BMS_PASSWORD/);
  });

  it('rejects when BMS_POINT_MAP is present but not valid JSON', async () => {
    process.env.BMS_BASE_URL = 'https://bms.example.test';
    process.env.BMS_USERNAME = 'svc';
    process.env.BMS_PASSWORD = 'secret';
    process.env.BMS_POINT_MAP = '{not json';
    await expect(BmsMeterAdapter.listMeters())
      .rejects.toThrow(/BMS_POINT_MAP is not valid JSON/);
  });
});

describe('BmsMeterAdapter — read-only guarantee', () => {
  it('importReadings always throws — the Eclypse adapter never writes', async () => {
    // No env needed: the read-only guard is unconditional.
    await expect(BmsMeterAdapter.importReadings([{ meterId: 'x', value: 1 }]))
      .rejects.toThrow(/read-only/);
  });
});

describe('BmsMeterAdapter — listMeters (configured)', () => {
  it('sanity-pings the BMS then returns only meters present in the point map', async () => {
    configure({ pointMap: { m_oil_campus: 'analog-value,5/present-value' } });
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({}) }));
    vi.stubGlobal('fetch', fetchMock);

    const list = await BmsMeterAdapter.listMeters();

    // Sanity ping happened, against the configured base URL (trailing
    // slash stripped) and the bacnet discovery path.
    expect(fetchMock).toHaveBeenCalled();
    expect(fetchMock.mock.calls[0][0]).toBe('https://bms.example.test/api/rest/v1/protocols/bacnet/local');
    // Basic-auth header is attached.
    expect(fetchMock.mock.calls[0][1].headers.Authorization)
      .toBe(`Basic ${Buffer.from('svc:secret').toString('base64')}`);
    // Only the mapped meter is returned, in adapter shape.
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: 'm_oil_campus', provider: 'Distech Eclypse' });
  });

  it('surfaces a non-OK sanity-ping response as an error', async () => {
    configure();
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 503, statusText: 'Service Unavailable', json: async () => ({}) })));
    await expect(BmsMeterAdapter.listMeters()).rejects.toThrow(/503 Service Unavailable/);
  });
});
