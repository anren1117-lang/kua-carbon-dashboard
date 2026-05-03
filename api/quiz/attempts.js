// POST /api/quiz/attempts
// Body: { userIdHash, quizId, topic, correct, pickedIndex, classId? }
// GET  /api/quiz/attempts → list (Teacher dashboard rollup)
//
// Uses the quizStore abstraction: writes mirror to Supabase when
// SUPABASE_URL + SUPABASE_SERVICE_KEY are configured, otherwise
// in-memory only. See src/storage/quizStore.js for the contract and
// supabase/migrations/20260503000000_quiz_and_csv_storage.sql for the
// table schema.

import { recordAttempt, listAttempts, attemptsByClass } from '../../src/storage/quizStore.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userIdHash, quizId, topic, correct, pickedIndex, classId } = req.body || {};
    if (!userIdHash || !quizId || !topic || typeof correct !== 'boolean' || typeof pickedIndex !== 'number') {
      res.status(400).json({ error: 'Required: userIdHash, quizId, topic, correct, pickedIndex' });
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
    const rollup = req.query?.rollup === 'class';
    if (rollup) {
      const classes = await attemptsByClass();
      res.status(200).json({ classes });
      return;
    }
    const attempts = await listAttempts();
    res.status(200).json({ attempts });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
