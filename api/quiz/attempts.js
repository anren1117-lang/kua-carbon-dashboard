// POST /api/quiz/attempts
// Body: { userIdHash, quizId, topic, correct, pickedIndex, classId? }
// GET  /api/quiz/attempts → list (Teacher dashboard rollup)
//
// In phase 1 the ledger is in-memory inside the serverless function,
// so it resets between cold starts. Phase 2 swaps the ledger for a
// Supabase table — see src/data/quizLedger.js for the schema.

import { recordAttempt, listAttempts, attemptsByClass } from '../../src/data/quizLedger.js';

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
    const attempt = recordAttempt({ userIdHash, quizId, topic, correct, pickedIndex, classId });
    res.status(200).json({ attempt });
    return;
  }

  if (req.method === 'GET') {
    const rollup = req.query?.rollup === 'class';
    if (rollup) {
      res.status(200).json({ classes: attemptsByClass() });
      return;
    }
    res.status(200).json({ attempts: listAttempts() });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
