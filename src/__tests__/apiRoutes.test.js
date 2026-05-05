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
import authLogoutHandler     from '../../api/auth/logout.js';
import teacherLessonsHandler from '../../api/teacher/lessons.js';
import { _resetLessonStoreForTests } from '../storage/lessonStore.js';
import readingsExportHandler from '../../api/meters/readings/export.js';
import healthHandler         from '../../api/health.js';
import cronSyncBmsHandler    from '../../api/cron/sync-bms.js';
import { _resetForTests }    from '../data/quizLedger.js';
import { verifyGoogleIdToken } from '../utils/googleJwt.js';
import { createRateLimit }   from '../utils/rateLimit.js';

function makeRes() {
  let statusCode = 200;
  let body = null;
  let raw = null;
  const headers = {};
  const res = {
    status(code) { statusCode = code; return res; },
    json(payload) { body = payload; return res; },
    setHeader(k, v) { headers[k] = v; return res; },
    send(payload) { raw = payload; return res; },
  };
  return {
    res,
    get statusCode() { return statusCode; },
    get body() { return body; },
    get raw()  { return raw; },
    get headers() { return headers; },
  };
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

  it('filters attempts by lessonId', async () => {
    _resetForTests();
    await call(quizAttemptsHandler, { method: 'POST', body: { userIdHash: 'student_a1b2c3d4', quizId: 'lesson_abc_q0', topic: 'food',   correct: true,  pickedIndex: 1, classId: 'APES-3' } });
    await call(quizAttemptsHandler, { method: 'POST', body: { userIdHash: 'student_a1b2c3d4', quizId: 'lesson_abc_q1', topic: 'food',   correct: false, pickedIndex: 0, classId: 'APES-3' } });
    await call(quizAttemptsHandler, { method: 'POST', body: { userIdHash: 'student_e5f6a7b8', quizId: 'lesson_xyz_q0', topic: 'energy', correct: true,  pickedIndex: 2 } });

    const r = await call(quizAttemptsHandler, { method: 'GET', query: { lessonId: 'lesson_abc' } });
    expect(r.statusCode).toBe(200);
    expect(r.body.lessonId).toBe('lesson_abc');
    expect(r.body.attempts.length).toBe(2);
  });

  it('rolls up student scores per lesson', async () => {
    _resetForTests();
    await call(quizAttemptsHandler, { method: 'POST', body: { userIdHash: 'student_a1b2c3d4', quizId: 'lesson_abc_q0', topic: 'food', correct: true,  pickedIndex: 1, classId: 'APES-3' } });
    await call(quizAttemptsHandler, { method: 'POST', body: { userIdHash: 'student_a1b2c3d4', quizId: 'lesson_abc_q1', topic: 'food', correct: true,  pickedIndex: 1, classId: 'APES-3' } });
    await call(quizAttemptsHandler, { method: 'POST', body: { userIdHash: 'student_a1b2c3d4', quizId: 'lesson_abc_q2', topic: 'food', correct: false, pickedIndex: 0, classId: 'APES-3' } });
    await call(quizAttemptsHandler, { method: 'POST', body: { userIdHash: 'student_e5f6a7b8', quizId: 'lesson_abc_q0', topic: 'food', correct: false, pickedIndex: 0, classId: 'APES-3' } });

    const r = await call(quizAttemptsHandler, { method: 'GET', query: { lessonId: 'lesson_abc', rollup: 'students' } });
    expect(r.statusCode).toBe(200);
    expect(r.body.students.length).toBe(2);
    const s1 = r.body.students.find((s) => s.userIdHash === 'student_a1b2c3d4');
    expect(s1.right).toBe(2);
    expect(s1.total).toBe(3);
    expect(s1.accuracy).toBeCloseTo(2 / 3, 3);
    const s2 = r.body.students.find((s) => s.userIdHash === 'student_e5f6a7b8');
    expect(s2.right).toBe(0);
    expect(s2.total).toBe(1);
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

describe('GET /api/meters/readings/export', () => {
  it('returns CSV text with the standard header', async () => {
    const r = await call(readingsExportHandler, {
      method: 'GET',
      query: {
        buildingId: 'b_miller',
        start: '2026-04-01T00:00:00Z',
        end:   '2026-04-02T00:00:00Z',
      },
    });
    expect(r.statusCode).toBe(200);
    expect(r.headers['Content-Type']).toMatch(/text\/csv/);
    expect(r.raw.startsWith('meter_id,timestamp,value,unit,interval_minutes')).toBe(true);
    // Mock adapter generates 24 hourly readings + header row.
    expect(r.raw.trim().split('\n').length).toBe(25);
  });

  it('400s without start/end', async () => {
    const r = await call(readingsExportHandler, { method: 'GET', query: { buildingId: 'b_miller' } });
    expect(r.statusCode).toBe(400);
  });
});

describe('/api/teacher/lessons', () => {
  it('rejects POST without a hashed teacherIdHash', async () => {
    _resetLessonStoreForTests();
    const r = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.1' },
      body: { teacherIdHash: 'Mr. Smith', title: 'T', topic: 'food', readingLevel: 'novice', sourceMaterial: 'x' },
    });
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toMatch(/hashed/i);
  });

  it('honors numQuestions on the stub generator', async () => {
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    const r = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.20' },
      body: {
        teacherIdHash: 'staff_a1b2c3d4',
        title: '7-question test',
        topic: 'food',
        readingLevel: 'novice',
        sourceMaterial: 'x',
        numQuestions: 7,
      },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.lesson.questions.length).toBe(7);
    for (const q of r.body.lesson.questions) {
      expect(q.options.length).toBe(4);
      expect(q.options.filter((o) => o.correct).length).toBe(1);
      for (const o of q.options) expect(typeof o.explanation).toBe('string');
    }
  });

  it('clamps numQuestions to the 3..10 range', async () => {
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    const big = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.21' },
      body: { teacherIdHash: 'staff_a1b2c3d4', title: 'Too many', topic: 'food', readingLevel: 'novice', sourceMaterial: 'x', numQuestions: 50 },
    });
    expect(big.body.lesson.questions.length).toBe(10);

    const tiny = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.22' },
      body: { teacherIdHash: 'staff_a1b2c3d4', title: 'Too few',  topic: 'food', readingLevel: 'novice', sourceMaterial: 'x', numQuestions: 1 },
    });
    expect(tiny.body.lesson.questions.length).toBe(3);
  });

  it('persists a stub-generated lesson when no API key is set', async () => {
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    const r = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.2' },
      body: {
        teacherIdHash: 'staff_a1b2c3d4',
        title: 'Methane basics',
        topic: 'climate_basics',
        readingLevel: 'novice',
        sourceMaterial: 'Methane is CH4. It traps heat 28x more effectively than CO2 over 100 years.',
        status: 'draft',
      },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.lesson.title).toBe('Methane basics');
    expect(r.body.lesson.questions.length).toBeGreaterThan(0);
    expect(r.body.lesson.status).toBe('draft');
    expect(r.body.lesson.id).toMatch(/^lesson_/);
  });

  it('GET ?id= reads back the lesson', async () => {
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    const created = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.3' },
      body: {
        teacherIdHash: 'staff_a1b2c3d4',
        title: 'Recall test',
        topic: 'food',
        readingLevel: 'intermediate',
        sourceMaterial: 'Beef averages 60 kg CO2e per kg.',
      },
    });
    const id = created.body.lesson.id;
    const r = await call(teacherLessonsHandler, { method: 'GET', query: { id } });
    expect(r.statusCode).toBe(200);
    expect(r.body.lesson.id).toBe(id);
  });

  it('GET filters by createdByHash', async () => {
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.4' },
      body: { teacherIdHash: 'staff_aaaa1111', title: 'Mine',  topic: 'food', readingLevel: 'novice', sourceMaterial: 'x' },
    });
    await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.5' },
      body: { teacherIdHash: 'staff_bbbb2222', title: 'Other', topic: 'food', readingLevel: 'novice', sourceMaterial: 'x' },
    });
    const r = await call(teacherLessonsHandler, { method: 'GET', query: { createdByHash: 'staff_aaaa1111' } });
    expect(r.statusCode).toBe(200);
    expect(r.body.lessons.length).toBe(1);
    expect(r.body.lessons[0].title).toBe('Mine');
  });

  it('PATCH updates an existing lesson', async () => {
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    const created = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.6' },
      body: { teacherIdHash: 'staff_a1b2c3d4', title: 'Draft', topic: 'food', readingLevel: 'novice', sourceMaterial: 'x', status: 'draft' },
    });
    const id = created.body.lesson.id;
    const patched = await call(teacherLessonsHandler, {
      method: 'PATCH',
      body: { id, status: 'published' },
    });
    expect(patched.statusCode).toBe(200);
    expect(patched.body.lesson.status).toBe('published');
  });

  it('PATCH rejects ownership / id / timestamp rewrites silently', async () => {
    // Earlier the whole body was spread into the saved row, so a
    // PATCH body could rewrite createdByHash (transferring ownership
    // to another teacher) or createdAt (forging when it was made).
    // Now those fields are ignored — only the whitelist is honored.
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    const created = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.7' },
      body: { teacherIdHash: 'staff_a1b2c3d4', title: 'Mine', topic: 'food', readingLevel: 'novice', sourceMaterial: 'x', status: 'draft' },
    });
    const original = created.body.lesson;
    const patched = await call(teacherLessonsHandler, {
      method: 'PATCH',
      body: {
        id: original.id,
        title: 'Renamed',
        // Hostile fields below — must be silently dropped.
        createdByHash: 'staff_attacker',
        createdAt: '1970-01-01T00:00:00.000Z',
        sourceFileHash: 'tampered',
      },
    });
    expect(patched.statusCode).toBe(200);
    expect(patched.body.lesson.title).toBe('Renamed');
    expect(patched.body.lesson.createdByHash).toBe(original.createdByHash);
    expect(patched.body.lesson.createdAt).toBe(original.createdAt);
  });

  it('DELETE removes a lesson', async () => {
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    const created = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.7' },
      body: { teacherIdHash: 'staff_a1b2c3d4', title: 'Bye', topic: 'food', readingLevel: 'novice', sourceMaterial: 'x' },
    });
    const id = created.body.lesson.id;
    const del = await call(teacherLessonsHandler, { method: 'DELETE', query: { id } });
    expect(del.statusCode).toBe(200);
    const after = await call(teacherLessonsHandler, { method: 'GET', query: { id } });
    expect(after.statusCode).toBe(404);
  });
});

describe('POST /api/auth/logout', () => {
  it('returns 200 and a clearing Set-Cookie header', async () => {
    const r = await call(authLogoutHandler, { method: 'POST' });
    expect(r.statusCode).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(r.headers['Set-Cookie']).toMatch(/Max-Age=0/);
  });

  it('rejects non-POST', async () => {
    const r = await call(authLogoutHandler, { method: 'GET' });
    expect(r.statusCode).toBe(405);
  });
});

describe('GET /api/health', () => {
  it('returns 200 ok when adapter is reachable', async () => {
    const r = await call(healthHandler, { method: 'GET', query: {} });
    expect(r.statusCode).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(r.body.checks.adapter.ok).toBe(true);
    expect(r.body.checks.adapter.count).toBeGreaterThan(0);
    expect(r.body.checks.factors.ok).toBe(true);
  });
});

describe('POST /api/cron/sync-bms', () => {
  it('rejects requests without CRON_SECRET set', async () => {
    delete process.env.CRON_SECRET;
    const r = await call(cronSyncBmsHandler, { method: 'POST', headers: {}, query: {} });
    expect(r.statusCode).toBe(401);
  });

  it('accepts a Bearer token matching CRON_SECRET and persists readings', async () => {
    process.env.CRON_SECRET = 'test-secret-xyz';
    try {
      const r = await call(cronSyncBmsHandler, {
        method: 'POST',
        headers: { authorization: 'Bearer test-secret-xyz' },
        query: {},
      });
      expect(r.statusCode).toBe(200);
      expect(r.body.inserted).toBeGreaterThanOrEqual(0);
      expect(r.body.windowStart).toBeDefined();
      expect(r.body.windowEnd).toBeDefined();
    } finally {
      delete process.env.CRON_SECRET;
    }
  });

  it('rejects mismatched Bearer tokens', async () => {
    process.env.CRON_SECRET = 'test-secret-xyz';
    try {
      const r = await call(cronSyncBmsHandler, {
        method: 'POST',
        headers: { authorization: 'Bearer wrong' },
        query: {},
      });
      expect(r.statusCode).toBe(401);
    } finally {
      delete process.env.CRON_SECRET;
    }
  });
});

describe('rate limiter', () => {
  it('refuses traffic past capacity', () => {
    const limit = createRateLimit({ capacity: 3, refillPerSec: 0 });
    expect(limit.consume('ip1').allowed).toBe(true);
    expect(limit.consume('ip1').allowed).toBe(true);
    expect(limit.consume('ip1').allowed).toBe(true);
    expect(limit.consume('ip1').allowed).toBe(false);
  });

  it('isolates buckets by key', () => {
    const limit = createRateLimit({ capacity: 1, refillPerSec: 0 });
    expect(limit.consume('ip1').allowed).toBe(true);
    expect(limit.consume('ip2').allowed).toBe(true);
    expect(limit.consume('ip1').allowed).toBe(false);
  });

  it('refills tokens over time', async () => {
    const limit = createRateLimit({ capacity: 1, refillPerSec: 100 }); // 100 per sec
    expect(limit.consume('ip3').allowed).toBe(true);
    expect(limit.consume('ip3').allowed).toBe(false);
    await new Promise((r) => setTimeout(r, 25));
    expect(limit.consume('ip3').allowed).toBe(true);
  });
});

describe('verifyGoogleIdToken', () => {
  it('rejects malformed JWTs', async () => {
    const r = await verifyGoogleIdToken('not.a.jwt');
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/segments|alg|signature/i);
  });

  it('rejects empty input', async () => {
    const r = await verifyGoogleIdToken('');
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/Malformed/);
  });

  it('rejects tokens with the wrong number of segments', async () => {
    const r = await verifyGoogleIdToken('only.two');
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/Malformed/);
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
    expect(r.body.kgco2e).toBeCloseTo(235, 1); // 0.235 kg/kWh effective × 1000
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
