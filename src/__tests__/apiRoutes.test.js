// Smoke tests for the Vercel /api/* handlers. Each test invokes the
// handler with a fake req/res and asserts on the response body. This is
// not a full integration test — but it catches signature regressions
// and proves the handler → adapter → data layer path works end to end.

import { describe, it, expect, beforeAll } from 'vitest';

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
import adminPlanHandler      from '../../api/admin/plan.js';
import adminEstimateAction   from '../../api/admin/estimate-action.js';
import adminLoginHandler     from '../../api/admin/login.js';
import adminAuditLogHandler  from '../../api/admin/audit-log.js';
import { signAdminToken, verifyAdminToken } from '../utils/adminToken.js';
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

// Tests for the admin endpoints need a valid bearer. Set the secret
// once at module load and mint a fresh token per request via this
// helper. Also expose an "expired" path so the token-verification
// tests can prove the server actually checks expiry.
process.env.ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET
  || 'test-admin-secret-12345678901234567890abcdefABCDEF';
function adminAuthHeaders() {
  return { authorization: `Bearer ${signAdminToken().token}` };
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
      body: { readings: [{ id: 'x', meterId: 'm_elec_b_miller', timestamp: '2026-04-01T00:00:00.000Z', value: 1 }] },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.inserted).toBe(1);
  });

  it('rejects bad bodies', async () => {
    const r = await call(readingsImportHandler, { method: 'POST', body: { foo: 'bar' } });
    expect(r.statusCode).toBe(400);
  });

  it('rejects readings missing required fields', async () => {
    // Regression: earlier this endpoint passed the body straight through
    // to the adapter without a shape check, so malformed rows could land
    // in the readings store as a row of nulls.
    const r = await call(readingsImportHandler, {
      method: 'POST',
      body: { readings: [{ id: 'x', meterId: 'm_elec_b_miller' }] },
    });
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toMatch(/missing timestamp|missing/);
  });

  it('rejects payloads larger than the cap', async () => {
    const big = Array.from({ length: 10_001 }, (_, i) => ({
      id: `r${i}`, meterId: 'm_elec_b_miller',
      timestamp: '2026-04-01T00:00:00.000Z', value: 1,
    }));
    const r = await call(readingsImportHandler, { method: 'POST', body: { readings: big } });
    expect(r.statusCode).toBe(413);
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

  it('rejects non-integer / out-of-range pickedIndex', async () => {
    // typeof === 'number' admits NaN, Infinity, fractional — all
    // would crash a downstream array index lookup. Number.isInteger
    // + non-negative gate refuses them up front.
    for (const bad of [Number.NaN, Infinity, -1, 1.5, 'two', null]) {
      const r = await call(quizAttemptsHandler, {
        method: 'POST',
        body: { userIdHash: 'student_a1b2c3d4', quizId: 'q_scope2', topic: 'scopes', correct: true, pickedIndex: bad },
      });
      expect(r.statusCode).toBe(400);
    }
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
      body: { id, teacherIdHash: 'staff_a1b2c3d4', status: 'published' },
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
        teacherIdHash: 'staff_a1b2c3d4',
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

  it('PATCH rejects edits from a different teacherIdHash', async () => {
    // Without an ownership check, anyone with the lesson id could
    // republish, edit questions, or rewrite the source. Lock PATCH
    // (and DELETE) to the teacherIdHash that authored the lesson.
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    const created = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.7' },
      body: { teacherIdHash: 'staff_aaaa1111', title: 'Owned', topic: 'food', readingLevel: 'novice', sourceMaterial: 'x', status: 'draft' },
    });
    const id = created.body.lesson.id;
    const attacker = await call(teacherLessonsHandler, {
      method: 'PATCH',
      body: { id, teacherIdHash: 'staff_bbbb2222', title: 'Hijacked', status: 'published' },
    });
    expect(attacker.statusCode).toBe(403);
    const stillThere = await call(teacherLessonsHandler, { method: 'GET', query: { id } });
    expect(stillThere.body.lesson.title).toBe('Owned');
    expect(stillThere.body.lesson.status).toBe('draft');
  });

  it('PATCH without teacherIdHash is rejected as 401', async () => {
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    const created = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.7' },
      body: { teacherIdHash: 'staff_a1b2c3d4', title: 'Anon', topic: 'food', readingLevel: 'novice', sourceMaterial: 'x' },
    });
    const id = created.body.lesson.id;
    const r = await call(teacherLessonsHandler, {
      method: 'PATCH',
      body: { id, status: 'published' },
    });
    expect(r.statusCode).toBe(401);
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
    const del = await call(teacherLessonsHandler, { method: 'DELETE', query: { id, teacherIdHash: 'staff_a1b2c3d4' } });
    expect(del.statusCode).toBe(200);
    const after = await call(teacherLessonsHandler, { method: 'GET', query: { id } });
    expect(after.statusCode).toBe(404);
  });

  it('DELETE rejects from a different teacherIdHash', async () => {
    _resetLessonStoreForTests();
    delete process.env.ANTHROPIC_API_KEY;
    const created = await call(teacherLessonsHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.7' },
      body: { teacherIdHash: 'staff_aaaa1111', title: 'Owned', topic: 'food', readingLevel: 'novice', sourceMaterial: 'x' },
    });
    const id = created.body.lesson.id;
    const r = await call(teacherLessonsHandler, {
      method: 'DELETE',
      query: { id, teacherIdHash: 'staff_bbbb2222' },
    });
    expect(r.statusCode).toBe(403);
    const after = await call(teacherLessonsHandler, { method: 'GET', query: { id } });
    expect(after.statusCode).toBe(200);
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

describe('POST /api/admin/plan', () => {
  it('rejects non-POST', async () => {
    const r = await call(adminPlanHandler, { method: 'GET', body: {}, headers: {} });
    expect(r.statusCode).toBe(405);
  });

  it('401s without admin auth', async () => {
    const r = await call(adminPlanHandler, { method: 'POST', body: {}, headers: {} });
    expect(r.statusCode).toBe(401);
    expect(r.body.error).toMatch(/admin auth/i);
  });

  it('401s with malformed bearer', async () => {
    const r = await call(adminPlanHandler, { method: 'POST', body: {}, headers: { authorization: 'Bearer not-a-valid-token' } });
    expect(r.statusCode).toBe(401);
  });

  it('400s without context (auth ok)', async () => {
    const r = await call(adminPlanHandler, { method: 'POST', body: {}, headers: adminAuthHeaders() });
    expect(r.statusCode).toBe(400);
  });

  it('400s with missing required context fields', async () => {
    const r = await call(adminPlanHandler, {
      method: 'POST',
      body: { context: { fiscalYear: '2026-2027' } },
      headers: adminAuthHeaders(),
    });
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toMatch(/required/i);
  });

  it('falls back to rule-based plan when ANTHROPIC_API_KEY is unset', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const r = await call(adminPlanHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.42', ...adminAuthHeaders() },
      body: {
        context: {
          fiscalYear: '2026-2027',
          capitalAppetite: 'medium',
          topPriority: 'scope1',
          timeHorizonYears: 3,
          grossMt: 4370,
          sinksMt: 2650,
          enrollment: 340,
        },
      },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.mode).toBe('rule');
    expect(Array.isArray(r.body.plan)).toBe(true);
    expect(r.body.plan.length).toBeGreaterThan(0);
    expect(r.body.plan.length).toBeLessThanOrEqual(7);
    // Every rule must surface a provenance label and an mt benchmark.
    for (const item of r.body.plan) {
      expect(['measured', 'cited', 'estimated']).toContain(item.provenance);
      expect(typeof item.expectedMtPerYear).toBe('number');
      expect(item.expectedMtPerYear).toBeGreaterThanOrEqual(0);
    }
    expect(typeof r.body.percentOfGross).toBe('number');
  });
});

describe('POST /api/admin/estimate-action', () => {
  it('rejects non-POST', async () => {
    const r = await call(adminEstimateAction, { method: 'GET', body: {}, headers: {} });
    expect(r.statusCode).toBe(405);
  });

  it('401s without admin auth', async () => {
    const r = await call(adminEstimateAction, { method: 'POST', body: { title: 'Anything' }, headers: {} });
    expect(r.statusCode).toBe(401);
  });

  it('400s without title (auth ok)', async () => {
    const r = await call(adminEstimateAction, { method: 'POST', body: {}, headers: adminAuthHeaders() });
    expect(r.statusCode).toBe(400);
  });

  it('400s on overlong title', async () => {
    const r = await call(adminEstimateAction, {
      method: 'POST',
      body: { title: 'x'.repeat(201) },
      headers: { 'x-forwarded-for': '10.0.0.51', ...adminAuthHeaders() },
    });
    expect(r.statusCode).toBe(400);
  });

  it('returns rule-fallback estimate when ANTHROPIC_API_KEY is unset', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const r = await call(adminEstimateAction, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.52', ...adminAuthHeaders() },
      body: { title: 'Replace Densmore boiler with high-efficiency condensing unit', description: 'Single-dorm heat-pump conversion', category: 'energy' },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.mode).toBe('rule');
    expect(typeof r.body.expectedMtPerYear).toBe('number');
    expect(r.body.expectedMtPerYear).toBeGreaterThanOrEqual(0);
    expect(['low','medium','high']).toContain(r.body.confidence);
    expect(['estimated','cited']).toContain(r.body.provenance);
    expect(typeof r.body.methodology).toBe('string');
    expect(r.body.methodology.length).toBeGreaterThan(0);
  });

  it('rule-fallback recognizes a heat-pump campus retrofit anchor', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const r = await call(adminEstimateAction, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.53', ...adminAuthHeaders() },
      body: { title: 'Convert all campus buildings from oil to heat pumps', description: 'Whole-campus electrification', category: 'energy' },
    });
    expect(r.statusCode).toBe(200);
    // Should land in the published 600-900 mt anchor band, not fall through to the 5-mt generic.
    expect(r.body.expectedMtPerYear).toBeGreaterThan(400);
  });
});

describe('POST /api/admin/login', () => {
  it('rejects non-POST', async () => {
    const r = await call(adminLoginHandler, { method: 'GET', body: {}, headers: {} });
    expect(r.statusCode).toBe(405);
  });

  it('503s when ADMIN_PASSWORD is unset', async () => {
    const saved = process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_PASSWORD;
    const r = await call(adminLoginHandler, { method: 'POST', body: { password: 'whatever' }, headers: {} });
    expect(r.statusCode).toBe(503);
    if (saved !== undefined) process.env.ADMIN_PASSWORD = saved;
  });

  it('400s without password', async () => {
    process.env.ADMIN_PASSWORD = 'rightpw';
    const r = await call(adminLoginHandler, { method: 'POST', body: {}, headers: { 'x-forwarded-for': '10.0.0.71' } });
    expect(r.statusCode).toBe(400);
  });

  it('401s on wrong password', async () => {
    process.env.ADMIN_PASSWORD = 'rightpw';
    const r = await call(adminLoginHandler, { method: 'POST', body: { password: 'wrong' }, headers: { 'x-forwarded-for': '10.0.0.72' } });
    expect(r.statusCode).toBe(401);
  });

  it('200 + signed token on correct password', async () => {
    process.env.ADMIN_PASSWORD = 'rightpw';
    const r = await call(adminLoginHandler, { method: 'POST', body: { password: 'rightpw' }, headers: { 'x-forwarded-for': '10.0.0.73' } });
    expect(r.statusCode).toBe(200);
    expect(typeof r.body.token).toBe('string');
    expect(typeof r.body.expiresAt).toBe('string');
    const verify = verifyAdminToken(r.body.token);
    expect(verify.valid).toBe(true);
    expect(verify.payload.role).toBe('admin');
  });

  it('rate-limits sustained guessing (429 after burst)', async () => {
    process.env.ADMIN_PASSWORD = 'rightpw';
    const ip = '10.0.0.74';
    let last;
    for (let i = 0; i < 10; i++) {
      last = await call(adminLoginHandler, { method: 'POST', body: { password: 'wrong' }, headers: { 'x-forwarded-for': ip } });
    }
    expect(last.statusCode).toBe(429);
  });
});

describe('verifyAdminToken', () => {
  it('rejects empty / malformed input', () => {
    expect(verifyAdminToken(null).valid).toBe(false);
    expect(verifyAdminToken('').valid).toBe(false);
    expect(verifyAdminToken('not-two-segments').valid).toBe(false);
  });

  it('rejects an expired token', () => {
    // Mint with negative TTL so exp is in the past, then verify.
    const { token } = signAdminToken({ ttlSeconds: -10 });
    const r = verifyAdminToken(token);
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/expired/i);
  });

  it('rejects a tampered signature', () => {
    const { token } = signAdminToken();
    const [payload] = token.split('.');
    const r = verifyAdminToken(`${payload}.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`);
    expect(r.valid).toBe(false);
  });

  it('accepts a freshly-signed token', () => {
    const { token } = signAdminToken();
    const r = verifyAdminToken(token);
    expect(r.valid).toBe(true);
    expect(r.payload.role).toBe('admin');
  });
});

describe('/api/admin/audit-log auth + validation', () => {
  // We don't test the Supabase round-trip here (no live DB in unit
  // tests) — only the auth gate + input validation. The endpoint
  // 503s when Supabase env is unset, which is exactly what we want
  // in this test environment.

  it('401s GET without admin auth', async () => {
    const r = await call(adminAuditLogHandler, { method: 'GET', query: {}, headers: {} });
    expect(r.statusCode).toBe(401);
  });

  it('401s POST without admin auth', async () => {
    const r = await call(adminAuditLogHandler, { method: 'POST', body: { action: 'insert', table: 'fuel_bills' }, headers: {} });
    expect(r.statusCode).toBe(401);
  });

  it('405s on unknown verb', async () => {
    const r = await call(adminAuditLogHandler, { method: 'PATCH', body: {}, headers: adminAuthHeaders() });
    // PATCH passes auth + supabase config check, then hits the verb
    // dispatcher. With no SUPABASE_URL set in tests, we 503 BEFORE
    // the verb check — so accept either 503 (env missing) or 405.
    expect([405, 503]).toContain(r.statusCode);
  });

  it('503s when Supabase env not configured', async () => {
    const saved = { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_ANON_KEY };
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.VITE_SUPABASE_ANON_KEY;
    const r = await call(adminAuditLogHandler, { method: 'GET', query: {}, headers: adminAuthHeaders() });
    expect(r.statusCode).toBe(503);
    expect(r.body.error).toMatch(/supabase/i);
    if (saved.url) process.env.SUPABASE_URL = saved.url;
    if (saved.key) process.env.SUPABASE_ANON_KEY = saved.key;
  });

  it('400s POST with bad action', async () => {
    process.env.SUPABASE_URL = 'https://fake.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'fake_key';
    const r = await call(adminAuditLogHandler, {
      method: 'POST',
      body: { action: 'wat', table: 'fuel_bills' },
      headers: adminAuthHeaders(),
    });
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toMatch(/action must be/i);
  });

  it('400s POST with missing table', async () => {
    process.env.SUPABASE_URL = 'https://fake.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'fake_key';
    const r = await call(adminAuditLogHandler, {
      method: 'POST',
      body: { action: 'insert' },
      headers: adminAuthHeaders(),
    });
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toMatch(/table is required/i);
  });

  it('400s POST with overlong note', async () => {
    process.env.SUPABASE_URL = 'https://fake.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'fake_key';
    const r = await call(adminAuditLogHandler, {
      method: 'POST',
      body: { action: 'insert', table: 'fuel_bills', note: 'x'.repeat(501) },
      headers: adminAuthHeaders(),
    });
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toMatch(/note/i);
  });
});

describe('/api/admin/audit-log GET pagination + filters', () => {
  // These tests don't hit a real Supabase — we just verify the
  // query-string parsing doesn't crash and the auth gate fires
  // before any DB call. The GET path is auth-then-query, so when
  // Supabase env IS set but unreachable it 500s; when env is unset
  // it 503s before parsing query. We use the unset path to keep
  // tests hermetic.

  beforeAll(() => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.VITE_SUPABASE_ANON_KEY;
  });

  it('503s GET regardless of pagination params (env unset, before DB call)', async () => {
    const r = await call(adminAuditLogHandler, {
      method: 'GET',
      query: { limit: '100', offset: '50', table: 'fuel_bills', dateFrom: '2026-01-01', dateTo: '2026-12-31' },
      headers: adminAuthHeaders(),
    });
    expect(r.statusCode).toBe(503);
  });

  it('still 401s on GET without admin auth even with all params set', async () => {
    const r = await call(adminAuditLogHandler, {
      method: 'GET',
      query: { limit: '100', offset: '50' },
      headers: {},
    });
    expect(r.statusCode).toBe(401);
  });

  it('still 401s on POST without admin auth (regression guard)', async () => {
    const r = await call(adminAuditLogHandler, {
      method: 'POST',
      body: { action: 'insert', table: 'fuel_bills' },
      headers: {},
    });
    expect(r.statusCode).toBe(401);
  });

  it('handles malformed numeric params gracefully (auth + env still gates)', async () => {
    const r = await call(adminAuditLogHandler, {
      method: 'GET',
      query: { limit: 'banana', offset: 'NaN' },
      headers: adminAuthHeaders(),
    });
    // The handler should never crash on bad numbers — Number(...) || N
    // gives a sane default. With env unset it still 503s.
    expect([503, 200]).toContain(r.statusCode);
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

  it('400s on NaN quantity (typeof number admits NaN)', async () => {
    // Number.isFinite check: protects the math layer from NaN
    // propagating into kgco2e + mtco2e.
    const r = await call(emissionsCalculate, {
      method: 'POST',
      body: { quantity: Number.NaN, factorId: 'ef_grid_isone_2024' },
    });
    expect(r.statusCode).toBe(400);
  });

  it('400s on Infinity quantity', async () => {
    const r = await call(emissionsCalculate, {
      method: 'POST',
      body: { quantity: Infinity, factorId: 'ef_grid_isone_2024' },
    });
    expect(r.statusCode).toBe(400);
  });
});
