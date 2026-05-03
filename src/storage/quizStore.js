// Quiz attempt storage abstraction. Picks Supabase when configured,
// in-memory otherwise. The /api/quiz/attempts handler talks to this
// instead of quizLedger.js directly.

import { getSupabaseServer } from './supabaseServer.js';
import { recordAttempt as memRecord, listAttempts as memList, attemptsByClass as memByClass, _resetForTests as memReset } from '../data/quizLedger.js';

/**
 * @param {Omit<import('../data/quizLedger.js').QuizAttempt, 'id'|'submittedAt'>} attempt
 */
export async function recordAttempt(attempt) {
  // Always write to memory for sync read paths (e.g. tests).
  const persisted = memRecord(attempt);

  // Mirror to Supabase when available. Failure is logged but not thrown
  // — the API call has already returned 200 to the client by the time
  // we get here under normal flow, so a Supabase outage shouldn't break
  // user-facing logging.
  const sb = await getSupabaseServer();
  if (sb) {
    try {
      const { error } = await sb.from('quiz_attempts').insert({
        id: persisted.id.startsWith('qa_') ? undefined : persisted.id,
        user_id_hash: persisted.userIdHash,
        class_id: persisted.classId ?? null,
        quiz_id: persisted.quizId,
        topic: persisted.topic,
        correct: persisted.correct,
        picked_index: persisted.pickedIndex,
        submitted_at: persisted.submittedAt,
      });
      if (error) console.warn('quiz_attempts write failed:', error.message);
    } catch (err) {
      console.warn('quiz_attempts write threw:', err.message);
    }
  }
  return persisted;
}

export async function listAttempts() {
  const sb = await getSupabaseServer();
  if (sb) {
    try {
      const { data, error } = await sb.from('quiz_attempts').select('*').order('submitted_at', { ascending: false }).limit(500);
      if (error) throw error;
      return data.map((r) => ({
        id: r.id,
        submittedAt: r.submitted_at,
        userIdHash: r.user_id_hash,
        classId: r.class_id ?? undefined,
        quizId: r.quiz_id,
        topic: r.topic,
        correct: r.correct,
        pickedIndex: r.picked_index,
      }));
    } catch (err) {
      console.warn('quiz_attempts read failed, falling back to memory:', err.message);
    }
  }
  return memList();
}

export async function attemptsByClass() {
  const sb = await getSupabaseServer();
  if (sb) {
    try {
      const { data, error } = await sb.from('quiz_attempts').select('class_id, correct, topic');
      if (error) throw error;
      const out = {};
      for (const r of data) {
        const key = r.class_id || 'unassigned';
        if (!out[key]) out[key] = { total: 0, correct: 0, topics: new Set() };
        out[key].total += 1;
        if (r.correct) out[key].correct += 1;
        out[key].topics.add(r.topic);
      }
      return Object.entries(out).map(([classId, v]) => ({
        classId,
        total: v.total,
        correct: v.correct,
        accuracy: v.total ? v.correct / v.total : 0,
        topics: Array.from(v.topics),
      }));
    } catch (err) {
      console.warn('quiz_attempts rollup failed, falling back to memory:', err.message);
    }
  }
  return memByClass();
}

/**
 * Returns every attempt whose quizId starts with `<lessonId>_q`. Used by
 * the teacher results view (/teacher/results/:lessonId) to roll up
 * per-student scores on a single lesson.
 *
 * @param {string} lessonId
 */
export async function attemptsForLesson(lessonId) {
  const prefix = `${lessonId}_q`;
  const all = await listAttempts();
  return all.filter((a) => a.quizId.startsWith(prefix));
}

/**
 * Roll up per-student scores on a single lesson. Returns one row per
 * unique userIdHash with their right/total/percent.
 *
 * @param {string} lessonId
 */
export async function lessonResults(lessonId) {
  const attempts = await attemptsForLesson(lessonId);
  /** @type {Map<string, { right: number, total: number, last: string, classId?: string }>} */
  const byUser = new Map();
  for (const a of attempts) {
    const cur = byUser.get(a.userIdHash) || { right: 0, total: 0, last: a.submittedAt, classId: a.classId };
    cur.total += 1;
    if (a.correct) cur.right += 1;
    if (a.submittedAt > cur.last) cur.last = a.submittedAt;
    cur.classId = cur.classId || a.classId;
    byUser.set(a.userIdHash, cur);
  }
  return [...byUser.entries()].map(([userIdHash, v]) => ({
    userIdHash,
    right: v.right,
    total: v.total,
    accuracy: v.total ? v.right / v.total : 0,
    lastAttemptAt: v.last,
    classId: v.classId,
  })).sort((a, b) => b.lastAttemptAt.localeCompare(a.lastAttemptAt));
}

export function _resetStoreForTests() {
  memReset();
}
