// POST /api/quiz/attempts
// Body: { userIdHash, quizId, topic, correct, pickedIndex, classId? }
// GET  /api/quiz/attempts → list (Teacher dashboard rollup)
//
// Uses the quizStore abstraction: writes mirror to Supabase when
// SUPABASE_URL + SUPABASE_SERVICE_KEY are configured, otherwise
// in-memory only. See src/storage/quizStore.js for the contract and
// supabase/migrations/20260503000000_quiz_and_csv_storage.sql for the
// table schema.

import { recordAttempt, listAttempts, attemptsByClass, attemptsForLesson, lessonResults } from '../../src/storage/quizStore.js';

export default async function handler(req, res) {
  // Top-level try/catch — without this, any throw from the storage
  // layer (Supabase init reject, network blip mid-query, malformed
  // row in lessonResults) bubbled up as a Vercel-default 500 with no
  // body. Teacher.js + TeacherLessonResults read those fetches and
  // surfaced "Error loading lessons: HTTP 500" with no detail. Catch
  // and degrade to a 200 with empty payload so the UI renders its
  // empty-state branch.
  try {
    if (req.method === 'POST') {
      const { userIdHash, quizId, topic, correct, pickedIndex, classId } = req.body || {};
      if (!userIdHash || !quizId || !topic || typeof correct !== 'boolean' || !Number.isInteger(pickedIndex) || pickedIndex < 0) {
        res.status(400).json({ error: 'Required: userIdHash, quizId, topic, correct (boolean), pickedIndex (non-negative integer)' });
        return;
      }
      if (!/^[a-z]+_[0-9a-f]+$/.test(userIdHash)) {
        // Don't accept raw names or SIS IDs. The hashUserId() output looks like
        // "student_a1b2c3d4". Reject anything else so PII can't slip through.
        res.status(400).json({ error: 'userIdHash must be a hashed identifier (e.g. student_a1b2c3d4)' });
        return;
      }
      const attempt = await recordAttempt({ userIdHash, quizId, topic, correct, pickedIndex, classId });
      res.status(200).json({ attempt });
      return;
    }

    if (req.method === 'GET') {
      const { rollup, lessonId } = req.query || {};
      if (lessonId && rollup === 'students') {
        const results = await lessonResults(lessonId);
        res.status(200).json({ lessonId, students: results });
        return;
      }
      if (lessonId) {
        const attempts = await attemptsForLesson(lessonId);
        res.status(200).json({ lessonId, attempts });
        return;
      }
      if (rollup === 'class') {
        const classes = await attemptsByClass();
        res.status(200).json({ classes });
        return;
      }
      const attempts = await listAttempts();
      res.status(200).json({ attempts });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.warn('quiz_attempts handler failed:', err.message);
    // GET → return the empty-payload shape the caller expects so UI
    // renders cleanly. POST → admit the storage failure so the
    // client knows the attempt didn't persist.
    if (req.method === 'GET') {
      const { rollup, lessonId } = req.query || {};
      if (lessonId && rollup === 'students') { res.status(200).json({ lessonId, students: [], warning: err.message }); return; }
      if (lessonId)                            { res.status(200).json({ lessonId, attempts: [], warning: err.message }); return; }
      if (rollup === 'class')                  { res.status(200).json({ classes: [], warning: err.message }); return; }
      res.status(200).json({ attempts: [], warning: err.message });
      return;
    }
    res.status(500).json({ error: err.message });
  }
}
