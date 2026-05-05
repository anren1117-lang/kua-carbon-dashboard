// Teacher lessons API.
//
// POST /api/teacher/lessons
//   Body: { teacherIdHash, title, topic, readingLevel, classId?, sourceMaterial, status? }
//   Calls Anthropic to convert sourceMaterial into a student-facing
//   reading + 4-option questions. Persists the result.
//   Returns { lesson }.
//
// GET /api/teacher/lessons?createdByHash=...&status=...
//   Returns { lessons: [...] }
//
// GET /api/teacher/lessons?id=lesson_xxx
//   Returns a single lesson (for the student view + the editor).
//
// PATCH /api/teacher/lessons
//   Body: { id, ...partial fields }  (used to publish or edit a draft)
//
// DELETE /api/teacher/lessons?id=...
//
// The system prompt enforces the same grounding rules as the chatbot
// endpoint: use ONLY the provided material, do not invent KUA-specific
// facts, output strict JSON shaped to the lesson schema.

import { saveLesson, getLesson, listLessons, deleteLesson } from '../../src/storage/lessonStore.js';
import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';

// Generation is paid; throttle to 6 generations/min/IP. Reads + writes
// of already-generated content aren't rate-limited.
const generateLimiter = createRateLimit({ capacity: 6, refillPerSec: 0.1 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 10;
const DEFAULT_QUESTIONS = 5;

function buildSystemPrompt(numQuestions) {
  return `You are an instructional designer for KUA's carbon-literacy curriculum. A teacher has pasted in source material and asked you to turn it into a student-facing lesson.

Strict rules:
1. Use ONLY the source material the teacher provided. Do not invent facts about KUA, do not invent numbers, do not pull in claims that don't appear in the source. If the material is too thin to support a lesson, say so in the "reading" field and produce zero questions.
2. Match the requested reading level: novice = 6-10 short sentences, plain language, no jargon. intermediate = 10-15 sentences, can use scope/GWP/kgCO2e terms. advanced = 15-25 sentences with calculations and quantitative reasoning.
3. Generate exactly ${numQuestions} four-option multiple-choice questions. Each question must:
   - Test a fact or inference from the source material (not your prior knowledge).
   - Have exactly 4 options.
   - Have exactly 1 correct option.
   - Include a per-option explanation that teaches WHY the option is right or wrong (not just "yes/no").
4. Output strict JSON, nothing else, matching this schema:
{
  "reading": "string — the rewritten reading at the requested level",
  "questions": [
    {
      "question": "string",
      "options": [
        { "text": "string", "correct": true, "explanation": "string" },
        { "text": "string", "correct": false, "explanation": "string" },
        { "text": "string", "correct": false, "explanation": "string" },
        { "text": "string", "correct": false, "explanation": "string" }
      ]
    }
  ]
}

No markdown, no preamble, no trailing commentary. Pure JSON.`;
}

function buildUserMessage({ title, topic, readingLevel, sourceMaterial }) {
  return `Title: ${title}
Topic: ${topic}
Reading level: ${readingLevel}

Source material:
"""
${sourceMaterial}
"""`;
}

function isHashedId(s) {
  return typeof s === 'string' && /^[a-z]+_[0-9a-f]+$/.test(s);
}

function validateGenerated(parsed, expectedCount) {
  if (!parsed || typeof parsed.reading !== 'string') return 'missing reading';
  if (!Array.isArray(parsed.questions)) return 'missing questions array';
  if (expectedCount && parsed.questions.length !== expectedCount) {
    return `expected ${expectedCount} questions, got ${parsed.questions.length}`;
  }
  for (let i = 0; i < parsed.questions.length; i++) {
    const q = parsed.questions[i];
    if (!q || typeof q.question !== 'string') return `question ${i + 1} malformed`;
    if (!Array.isArray(q.options) || q.options.length !== 4) return `question ${i + 1} must have 4 options`;
    const correctCount = q.options.filter((o) => o && o.correct === true).length;
    if (correctCount !== 1) return `question ${i + 1} must have exactly 1 correct option`;
    for (let j = 0; j < q.options.length; j++) {
      const o = q.options[j];
      if (!o || typeof o.text !== 'string' || typeof o.explanation !== 'string') {
        return `question ${i + 1} option ${j + 1} malformed`;
      }
    }
  }
  return null;
}

async function generateLesson({ title, topic, readingLevel, sourceMaterial, numQuestions }) {
  const apiKey = readEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    // No key — fall back to a minimal local stub. Generate `numQuestions`
    // placeholder items so the editor preview + student report shape is
    // realistic during development.
    const stubQuestions = Array.from({ length: numQuestions }, (_, i) => ({
      question: `Stub question ${i + 1} — placeholder. Set ANTHROPIC_API_KEY for real AI generation.`,
      options: [
        { text: 'Option A', correct: true,  explanation: 'Always correct in the stub.' },
        { text: 'Option B', correct: false, explanation: 'Stub distractor.' },
        { text: 'Option C', correct: false, explanation: 'Stub distractor.' },
        { text: 'Option D', correct: false, explanation: 'Stub distractor.' },
      ],
    }));
    return {
      reading: `[Stub — set ANTHROPIC_API_KEY for AI generation.]\n\n${sourceMaterial.slice(0, 600)}`,
      questions: stubQuestions,
    };
  }

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: Math.min(8000, 800 + numQuestions * 600),
      system: buildSystemPrompt(numQuestions),
      messages: [{ role: 'user', content: buildUserMessage({ title, topic, readingLevel, sourceMaterial }) }],
    }),
  });
  if (!r.ok) {
    // Surface the actual Anthropic error rather than a status-only message.
    // 400s in particular often look like "model: \"...\" does not match
    // expected pattern" or "messages.0.content: string does not match",
    // and the teacher needs to see that to know what to change.
    let detail = '';
    try {
      const body = await r.json();
      detail = body?.error?.message || body?.message || JSON.stringify(body);
    } catch {
      try { detail = await r.text(); } catch {}
    }
    throw new Error(`Anthropic API ${r.status}${detail ? ` — ${detail}` : ''}`);
  }
  const j = await r.json();
  const text = (j.content || [])
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n')
    .trim();

  // Strip any markdown fence the model might add.
  const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/```$/i, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Generated output is not valid JSON: ${err.message}`);
  }
  const reason = validateGenerated(parsed, numQuestions);
  if (reason) throw new Error(`Generated lesson is malformed: ${reason}`);
  return parsed;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const limit = generateLimiter.consume(getClientKey(req));
      if (!limit.allowed) {
        if (typeof res.setHeader === 'function') {
          res.setHeader('Retry-After', String(Math.ceil(limit.retryAfterMs / 1000)));
        }
        res.status(429).json({ error: 'Too many lesson generations', retryAfterMs: limit.retryAfterMs });
        return;
      }

      const { teacherIdHash, title, topic, readingLevel, classId, sourceMaterial, status, numQuestions: rawNum } = req.body || {};
      if (!isHashedId(teacherIdHash)) {
        res.status(400).json({ error: 'teacherIdHash must be a hashed id (e.g. staff_a1b2c3d4)' });
        return;
      }
      // Type-check the strings explicitly. Earlier code used truthy
      // checks, so a body like {title: 123, sourceMaterial: ['a','b']}
      // would slip past and crash deeper in (.length on a number, or
      // get serialized as a number into the prompt).
      const stringFields = { title, topic, readingLevel, sourceMaterial };
      for (const [k, v] of Object.entries(stringFields)) {
        if (typeof v !== 'string' || v.length === 0) {
          res.status(400).json({ error: `${k} must be a non-empty string` });
          return;
        }
      }
      if (!['novice', 'intermediate', 'advanced'].includes(readingLevel)) {
        res.status(400).json({ error: 'readingLevel must be novice / intermediate / advanced' });
        return;
      }
      if (sourceMaterial.length > 12000) {
        res.status(400).json({ error: 'sourceMaterial cannot exceed 12000 characters' });
        return;
      }
      if (status && !['draft', 'published'].includes(status)) {
        res.status(400).json({ error: 'status must be draft or published' });
        return;
      }

      // Question count: default 5, accept 3..10. Out-of-range values get
      // clamped silently rather than 400'd so a teacher's typo doesn't
      // discard their pasted material.
      let numQuestions = Number.isFinite(Number(rawNum)) ? Math.round(Number(rawNum)) : DEFAULT_QUESTIONS;
      numQuestions = Math.max(MIN_QUESTIONS, Math.min(MAX_QUESTIONS, numQuestions));

      const generated = await generateLesson({ title, topic, readingLevel, sourceMaterial, numQuestions });
      const lesson = await saveLesson({
        createdByHash: teacherIdHash,
        title, topic, readingLevel, classId,
        sourceMaterial,
        generatedReading: generated.reading,
        questions: generated.questions,
        status: status || 'draft',
      });
      res.status(200).json({ lesson });
      return;
    }

    if (req.method === 'GET') {
      const { id, createdByHash, status } = req.query || {};
      if (id) {
        const lesson = await getLesson(id);
        if (!lesson) { res.status(404).json({ error: 'Not found' }); return; }
        res.status(200).json({ lesson });
        return;
      }
      const lessons = await listLessons({ createdByHash, status });
      res.status(200).json({ lessons });
      return;
    }

    if (req.method === 'PATCH') {
      const { id, ...rawPatch } = req.body || {};
      if (!id) { res.status(400).json({ error: 'id required' }); return; }
      const existing = await getLesson(id);
      if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
      // Whitelist patchable fields. Earlier the entire body was spread
      // into the saved row, which would have let a malicious request
      // rewrite createdByHash (transferring ownership), id (rename and
      // collide with another lesson), or createdAt (forge timestamps).
      const ALLOWED = ['title', 'topic', 'readingLevel', 'classId', 'sourceMaterial', 'status', 'generatedReading', 'questions'];
      const patch = {};
      for (const k of ALLOWED) if (k in rawPatch) patch[k] = rawPatch[k];
      if ('status' in patch && !['draft', 'published'].includes(patch.status)) {
        res.status(400).json({ error: 'status must be draft or published' });
        return;
      }
      const merged = { ...existing, ...patch };
      const lesson = await saveLesson(merged);
      res.status(200).json({ lesson });
      return;
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id;
      if (!id) { res.status(400).json({ error: 'id required' }); return; }
      await deleteLesson(id);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
