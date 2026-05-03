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
import quizAttemptsHandler   from '../../api/quiz/attempts.js';
import chatbotHandler        from '../../api/chatbot.js';
import authSessionHandler    from '../../api/auth/session.js';
import { _resetForTests }    from '../data/quizLedger.js';

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

describe('POST /api/quiz/attempts', () => {
  it('records a valid attempt and rejects raw identifiers', async () => {
    _resetForTests();

    const ok = await call(quizAttemptsHandler, {
      method: 'POST',
      body: { userIdHash: 'student_a1b2c3d4', quizId: 'q_scope2', topic: 'scopes', correct: true, pickedIndex: 1, classId: 'APES-3' },
    });
    expect(ok.statusCode).toBe(200);
    expect(ok.body.attempt.quizId).toBe('q_scope2');

    const reject = await call(quizAttemptsHandler, {
      method: 'POST',
      body: { userIdHash: 'Anren Wei', quizId: 'q_food', topic: 'food', correct: false, pickedIndex: 0 },
    });
    expect(reject.statusCode).toBe(400);
  });

  it('rolls up attempts by class', async () => {
    _resetForTests();
    await call(quizAttemptsHandler, { method: 'POST', body: { userIdHash: 'student_aaaa1111', quizId: 'q_scope2', topic: 'scopes', correct: true, pickedIndex: 1, classId: 'APES-3' } });
    await call(quizAttemptsHandler, { method: 'POST', body: { userIdHash: 'student_aaaa2222', quizId: 'q_food',   topic: 'food',   correct: false, pickedIndex: 0, classId: 'APES-3' } });
    await call(quizAttemptsHandler, { method: 'POST', body: { userIdHash: 'student_aaaa3333', quizId: 'q_food',   topic: 'food',   correct: true,  pickedIndex: 2, classId: 'Bio-5'  } });

    const r = await call(quizAttemptsHandler, { method: 'GET', query: { rollup: 'class' } });
    expect(r.statusCode).toBe(200);
    const apes = r.body.classes.find((c) => c.classId === 'APES-3');
    expect(apes.total).toBe(2);
    expect(apes.correct).toBe(1);
    expect(apes.accuracy).toBe(0.5);
    expect(apes.topics.sort()).toEqual(['food', 'scopes']);
  });
});

describe('POST /api/chatbot', () => {
  it('returns rule-mode answer for a high-confidence query (no API key needed)', async () => {
    const r = await call(chatbotHandler, {
      method: 'POST',
      body: { query: 'what is a carbon footprint', readingLevel: 'novice' },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.mode).toBe('rule');
    expect(r.body.confidence).toBe('high');
    expect(r.body.title).toMatch(/carbon footprint/i);
  });

  it('returns low-confidence message for off-topic queries', async () => {
    const r = await call(chatbotHandler, {
      method: 'POST',
      body: { query: 'who won the super bowl in 2023' },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.confidence).toBe('low');
  });

  it('400s without a query', async () => {
    const r = await call(chatbotHandler, { method: 'POST', body: {} });
    expect(r.statusCode).toBe(400);
  });
});

describe('POST /api/auth/session', () => {
  it('rejects requests without an idToken when AUTH_DEV_MODE is unset', async () => {
    delete process.env.AUTH_DEV_MODE;
    const r = await call(authSessionHandler, { method: 'POST', body: {} });
    expect(r.statusCode).toBe(400);
  });

  it('returns a hashed identity in dev mode', async () => {
    process.env.AUTH_DEV_MODE = '1';
    try {
      const r = await call(authSessionHandler, {
        method: 'POST',
        body: { mockSubject: 'jane.doe@kua.org', role: 'student' },
      });
      expect(r.statusCode).toBe(200);
      expect(r.body.userIdHash).toMatch(/^student_[0-9a-f]+$/);
      expect(r.body.role).toBe('student');
      expect(r.body.displayHint).toBe('JD');
      expect(r.body.mode).toBe('dev');
    } finally {
      delete process.env.AUTH_DEV_MODE;
    }
  });

  it('produces stable hashes across calls', async () => {
    process.env.AUTH_DEV_MODE = '1';
    try {
      const a = await call(authSessionHandler, { method: 'POST', body: { mockSubject: 'alice@kua.org', role: 'student' } });
      const b = await call(authSessionHandler, { method: 'POST', body: { mockSubject: 'alice@kua.org', role: 'student' } });
      expect(a.body.userIdHash).toBe(b.body.userIdHash);
    } finally {
      delete process.env.AUTH_DEV_MODE;
    }
  });

  it('produces different hashes for different roles', async () => {
    process.env.AUTH_DEV_MODE = '1';
    try {
      const student = await call(authSessionHandler, { method: 'POST', body: { mockSubject: 'alice@kua.org', role: 'student' } });
      const staff   = await call(authSessionHandler, { method: 'POST', body: { mockSubject: 'alice@kua.org', role: 'staff'   } });
      expect(student.body.userIdHash).not.toBe(staff.body.userIdHash);
    } finally {
      delete process.env.AUTH_DEV_MODE;
    }
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
