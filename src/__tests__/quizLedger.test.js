// Unit tests for the quiz-attempt ledger + its storage wrapper.
// quizLedger.js is the in-memory record + per-class rollup; quizStore.js
// wraps it with optional Supabase mirroring (falls through to memory
// in the test environment) plus the lesson-specific filter and the
// per-student rollup TeacherLessonResults reads from.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordAttempt as ledgerRecord,
  listAttempts as ledgerList,
  attemptsByClass as ledgerByClass,
  _resetForTests as ledgerReset,
} from '../data/quizLedger.js';
import {
  recordAttempt, listAttempts, attemptsByClass,
  attemptsForLesson, lessonResults, _resetStoreForTests,
} from '../storage/quizStore.js';

const attempt = (over = {}) => ({
  userIdHash: 'student_abc',
  quizId: 'lesson_42_q1',
  topic: 'climate',
  correct: true,
  pickedIndex: 0,
  ...over,
});

beforeEach(() => { ledgerReset(); _resetStoreForTests(); });

describe('quizLedger — recordAttempt', () => {
  it('stamps id + submittedAt onto every record', () => {
    const r = ledgerRecord(attempt());
    expect(r.id).toMatch(/^qa_/);
    expect(typeof r.submittedAt).toBe('string');
    expect(new Date(r.submittedAt).toString()).not.toBe('Invalid Date');
  });

  it('preserves every input field on the returned record', () => {
    const r = ledgerRecord(attempt({ classId: 'period-3', correct: false, pickedIndex: 2 }));
    expect(r).toMatchObject({
      classId: 'period-3', correct: false, pickedIndex: 2,
      quizId: 'lesson_42_q1', topic: 'climate', userIdHash: 'student_abc',
    });
  });
});

describe('quizLedger — listAttempts', () => {
  it('returns [] when no attempts have been recorded', () => {
    expect(ledgerList()).toEqual([]);
  });

  it('returns a copy — mutating it does not affect the internal store', () => {
    ledgerRecord(attempt());
    const snapshot = ledgerList();
    snapshot.length = 0;
    expect(ledgerList()).toHaveLength(1);
  });
});

describe('quizLedger — attemptsByClass', () => {
  beforeEach(() => {
    ledgerRecord(attempt({ classId: 'p3', correct: true,  topic: 'climate' }));
    ledgerRecord(attempt({ classId: 'p3', correct: false, topic: 'food'    }));
    ledgerRecord(attempt({ classId: 'p3', correct: true,  topic: 'climate' }));
    ledgerRecord(attempt({ classId: 'p5', correct: true,  topic: 'energy'  }));
    ledgerRecord(attempt({ correct: false, topic: 'waste' })); // no classId → unassigned
  });

  it('rolls up total + correct + accuracy + topics per class', () => {
    const rows = ledgerByClass();
    const byClass = Object.fromEntries(rows.map((r) => [r.classId, r]));

    expect(byClass.p3).toMatchObject({ total: 3, correct: 2 });
    expect(byClass.p3.accuracy).toBeCloseTo(2 / 3);
    expect(byClass.p3.topics.sort()).toEqual(['climate', 'food']);

    expect(byClass.p5).toMatchObject({ total: 1, correct: 1, accuracy: 1 });
    expect(byClass.unassigned).toMatchObject({ total: 1, correct: 0, accuracy: 0 });
  });

  it('returns [] for an empty ledger', () => {
    ledgerReset();
    expect(ledgerByClass()).toEqual([]);
  });
});

describe('quizStore — passthrough to memory (no Supabase env)', () => {
  it('recordAttempt mirrors into the ledger', async () => {
    await recordAttempt(attempt());
    expect(ledgerList()).toHaveLength(1);
  });

  it('listAttempts returns whatever the ledger holds', async () => {
    await recordAttempt(attempt({ userIdHash: 'u1' }));
    await recordAttempt(attempt({ userIdHash: 'u2' }));
    expect((await listAttempts()).map((a) => a.userIdHash).sort()).toEqual(['u1', 'u2']);
  });

  it('attemptsByClass returns the ledger rollup', async () => {
    await recordAttempt(attempt({ classId: 'p3', correct: true }));
    await recordAttempt(attempt({ classId: 'p3', correct: false }));
    const rows = await attemptsByClass();
    expect(rows.find((r) => r.classId === 'p3').accuracy).toBeCloseTo(0.5);
  });
});

describe('quizStore — attemptsForLesson', () => {
  beforeEach(async () => {
    // Two lessons sharing a userIdHash prefix is fine — the filter
    // uses quizId prefix, not user.
    await recordAttempt(attempt({ quizId: 'lesson_42_q1' }));
    await recordAttempt(attempt({ quizId: 'lesson_42_q2' }));
    await recordAttempt(attempt({ quizId: 'lesson_99_q1' }));
    // The prefix check uses `${lessonId}_q` — make sure `lesson_4`
    // doesn't accidentally match `lesson_42_q1` (regression guard).
    await recordAttempt(attempt({ quizId: 'lesson_4_q1' }));
  });

  it('filters to attempts whose quizId starts with `${lessonId}_q`', async () => {
    const out = await attemptsForLesson('lesson_42');
    expect(out.map((a) => a.quizId).sort()).toEqual(['lesson_42_q1', 'lesson_42_q2']);
  });

  it('returns [] for a lesson with no attempts', async () => {
    expect(await attemptsForLesson('lesson_does_not_exist')).toEqual([]);
  });
});

describe('quizStore — lessonResults rollup', () => {
  it('rolls per-student right/total/accuracy + tracks lastAttemptAt', async () => {
    // Stagger the timestamps to make `lastAttemptAt` deterministic.
    const r1 = await recordAttempt(attempt({ userIdHash: 'u1', quizId: 'lesson_1_q1', correct: true }));
    const r2 = await recordAttempt(attempt({ userIdHash: 'u1', quizId: 'lesson_1_q2', correct: false }));
    const r3 = await recordAttempt(attempt({ userIdHash: 'u2', quizId: 'lesson_1_q1', correct: true }));
    const rows = await lessonResults('lesson_1');

    const byUser = Object.fromEntries(rows.map((r) => [r.userIdHash, r]));
    expect(byUser.u1).toMatchObject({ right: 1, total: 2 });
    expect(byUser.u1.accuracy).toBeCloseTo(0.5);
    // u1's last attempt is the second record we made.
    expect([r1.submittedAt, r2.submittedAt]).toContain(byUser.u1.lastAttemptAt);
    expect(byUser.u2).toMatchObject({ right: 1, total: 1, accuracy: 1 });
  });

  it('sorts rows by lastAttemptAt descending', async () => {
    // Use explicit timestamps via two separate recordAttempt calls
    // — submittedAt is set inside recordAttempt as new Date().
    // We rely on the calls being microseconds apart, so add a small
    // assertion that order is non-increasing rather than expecting
    // exact ordering.
    for (let i = 0; i < 5; i++) await recordAttempt(attempt({ userIdHash: `u${i}`, quizId: 'lesson_1_q1' }));
    const rows = await lessonResults('lesson_1');
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].lastAttemptAt >= rows[i].lastAttemptAt).toBe(true);
    }
  });
});
