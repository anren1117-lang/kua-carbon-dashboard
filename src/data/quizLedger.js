// In-memory quiz attempt ledger. Phase 1 — process-local; the ledger
// drops on cold restart of the serverless function. Good enough for
// development and the Teacher dashboard demo. Phase 2: replace the
// `attempts` array with a Supabase `quiz_attempts` table:
//
//   create table quiz_attempts (
//     id uuid primary key default uuid_generate_v4(),
//     submitted_at timestamptz default now(),
//     user_id_hash text not null,
//     class_id text,
//     quiz_id text not null,
//     topic text not null,
//     correct boolean not null,
//     picked_index int not null
//   );
//
// The handler in api/quiz/attempts.js stays unchanged — only the
// recordAttempt() implementation switches.

/**
 * @typedef {Object} QuizAttempt
 * @property {string} id
 * @property {string} submittedAt   ISO 8601
 * @property {string} userIdHash    From hashUserId() — never a real ID
 * @property {string=} classId
 * @property {string} quizId
 * @property {string} topic
 * @property {boolean} correct
 * @property {number} pickedIndex
 */

/** @type {QuizAttempt[]} */
const attempts = [];

/**
 * Record a quiz attempt. Returns the persisted record (with id).
 * @param {Omit<QuizAttempt, 'id' | 'submittedAt'>} attempt
 * @returns {QuizAttempt}
 */
export function recordAttempt(attempt) {
  const persisted = {
    id: `qa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: new Date().toISOString(),
    ...attempt,
  };
  attempts.push(persisted);
  return persisted;
}

/** Read all attempts (for tests + Teacher dashboard rollup). */
export function listAttempts() {
  return attempts.slice();
}

/** Roll up by class for the Teacher dashboard. */
export function attemptsByClass() {
  const out = {};
  for (const a of attempts) {
    const key = a.classId || 'unassigned';
    if (!out[key]) out[key] = { total: 0, correct: 0, topics: new Set() };
    out[key].total += 1;
    if (a.correct) out[key].correct += 1;
    out[key].topics.add(a.topic);
  }
  return Object.entries(out).map(([classId, v]) => ({
    classId,
    total: v.total,
    correct: v.correct,
    accuracy: v.total ? v.correct / v.total : 0,
    topics: Array.from(v.topics),
  }));
}

// Test-only escape hatch.
export function _resetForTests() {
  attempts.length = 0;
}
