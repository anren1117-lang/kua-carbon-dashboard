// Smoke tests for the Vercel /api/* handlers. Each test invokes the
// handler with a fake req/res and asserts on the response body. This is
// not a full integration test — but it catches signature regressions
// and proves the handler → adapter → data layer path works end to end.

import { describe, it, expect } from 'vitest';

import metersHandler         from '../../api/meters/index.js';
import readingsHandler       from '../../api/meters/readings.js';
import readingsImportHandler from '../../api/meters/readings/import.js';
import qualityHandler        from '../../api/meters/quality.js';
import buildingEnergyHandler from '../../api/buildings/[id]/energy.js';
import emissionsCalculate    from '../../api/emissions/calculate.js';

function makeRes() {
  let statusCode = 200;
  let body = null;
  const res = {
    status(code) { statusCode = code; return res; },
    json(payload) { body = payload; return res; },
  };
  return { res, get statusCode() { return statusCode; }, get body() { return body; } };
}

async function call(handler, req) {
  const wrap = makeRes();
  await handler(req, wrap.res);
  return wrap;
}

describe('GET /api/meters', () => {
  it('returns the meter registry', async () => {
    const r = await call(metersHandler, { method: 'GET', query: {} });
    expect(r.statusCode).toBe(200);
    expect(Array.isArray(r.body.meters)).toBe(true);
    expect(r.body.meters.length).toBeGreaterThan(15);
  });

  it('filters by building_id', async () => {
    const r = await call(metersHandler, { method: 'GET', query: { building_id: 'b_miller' } });
    expect(r.body.meters.every((m) => m.buildingId === 'b_miller')).toBe(true);
  });

  it('filters by type', async () => {
    const r = await call(metersHandler, { method: 'GET', query: { type: 'electricity' } });
    expect(r.body.meters.every((m) => m.type === 'electricity')).toBe(true);
  });

  it('rejects non-GET', async () => {
    const r = await call(metersHandler, { method: 'POST', query: {} });
    expect(r.statusCode).toBe(405);
  });
});

describe('GET /api/meters/readings', () => {
  it('returns interval readings for a window', async () => {
    const r = await call(readingsHandler, {
      method: 'GET',
      query: {
        buildingId: 'b_miller',
        start: '2026-04-01T00:00:00Z',
        end:   '2026-04-02T00:00:00Z',
      },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.count).toBe(24);
    expect(r.body.readings[0].source).toBe('mock');
  });

  it('400s without start/end', async () => {
    const r = await call(readingsHandler, { method: 'GET', query: {} });
    expect(r.statusCode).toBe(400);
  });
});

describe('POST /api/meters/readings/import', () => {
  it('accepts a readings array', async () => {
    const r = await call(readingsImportHandler, {
      method: 'POST',
      body: { readings: [{ id: 'x', meterId: 'm_elec_b_miller', value: 1 }] },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.inserted).toBe(1);
  });

  it('rejects bad bodies', async () => {
    const r = await call(readingsImportHandler, { method: 'POST', body: { foo: 'bar' } });
    expect(r.statusCode).toBe(400);
  });
});

describe('GET /api/meters/quality', () => {
  it('returns one report per meter', async () => {
    const r = await call(qualityHandler, {
      method: 'GET',
      query: { start: '2026-04-01T00:00:00Z', end: '2026-04-08T00:00:00Z' },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.reports.length).toBeGreaterThan(0);
    for (const rep of r.body.reports) {
      expect(rep.qualityScore).toBeGreaterThanOrEqual(0);
      expect(rep.qualityScore).toBeLessThanOrEqual(100);
    }
  });
});

describe('GET /api/buildings/:id/energy', () => {
  it('rolls up a building over the given window', async () => {
    const r = await call(buildingEnergyHandler, {
      method: 'GET',
      query: { id: 'b_miller', start: '2026-04-01T00:00:00Z', end: '2026-04-08T00:00:00Z' },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.buildingId).toBe('b_miller');
    expect(r.body.totalKwh).toBeGreaterThan(0);
    expect(r.body.dailyKwh.length).toBe(7);
  });

  it('400s on missing id', async () => {
    const r = await call(buildingEnergyHandler, {
      method: 'GET',
      query: { start: '2026-04-01T00:00:00Z', end: '2026-04-08T00:00:00Z' },
    });
    expect(r.statusCode).toBe(400);
  });
});

describe('POST /api/emissions/calculate', () => {
  it('converts kWh via factor id', async () => {
    const r = await call(emissionsCalculate, {
      method: 'POST',
      body: { quantity: 1000, factorId: 'ef_grid_isone_2024' },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.kgco2e).toBeCloseTo(95.6, 1);
    expect(r.body.factor.unit).toBe('kWh');
  });

  it('converts via category + subcategory', async () => {
    const r = await call(emissionsCalculate, {
      method: 'POST',
      body: { quantity: 1, category: 'food', subcategory: 'beef' },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.kgco2e).toBeCloseTo(60, 1);
  });

  it('404s on unknown factor', async () => {
    const r = await call(emissionsCalculate, {
      method: 'POST',
      body: { quantity: 1, factorId: 'ef_does_not_exist' },
    });
    expect(r.statusCode).toBe(404);
  });

  it('400s without quantity', async () => {
    const r = await call(emissionsCalculate, {
      method: 'POST',
      body: { factorId: 'ef_grid_isone_2024' },
    });
    expect(r.statusCode).toBe(400);
  });
});
