// Teacher-authored lesson storage. Same write-through pattern as
// quizStore + readingsStore — always write to memory, mirror to
// Supabase when SUPABASE_URL + SUPABASE_SERVICE_KEY are set.
//
// Each lesson contains:
// - title, topic, readingLevel, classId
// - sourceMaterial: what the teacher pasted in
// - generatedReading: AI-rewritten reading at the requested level
// - questions: array of { question, options: [{ text, correct, explanation }] }
// - createdByHash: the teacher's hashUserId
// - status: 'draft' | 'published'

import { getSupabaseServer } from './supabaseServer.js';

const TABLE = 'teacher_lessons';

/** @type {Array<object>} */
const memStore = [];

function rowToLesson(r) {
  return {
    id: r.id,
    createdAt: typeof r.created_at === 'string' ? r.created_at : new Date(r.created_at).toISOString(),
    createdByHash: r.created_by_hash,
    title: r.title,
    topic: r.topic,
    readingLevel: r.reading_level,
    classId: r.class_id ?? undefined,
    sourceMaterial: r.source_material,
    generatedReading: r.generated_reading,
    questions: r.questions || [],
    status: r.status,
  };
}

function lessonToRow(l) {
  return {
    id: l.id,
    created_at: l.createdAt,
    created_by_hash: l.createdByHash,
    title: l.title,
    topic: l.topic,
    reading_level: l.readingLevel,
    class_id: l.classId ?? null,
    source_material: l.sourceMaterial,
    generated_reading: l.generatedReading,
    questions: l.questions,
    status: l.status,
  };
}

/** @param {object} lesson */
export async function saveLesson(lesson) {
  // Build the persisted record. Caller passes a partial; we fill in id + timestamp.
  const persisted = {
    id: lesson.id || `lesson_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: lesson.createdAt || new Date().toISOString(),
    createdByHash: lesson.createdByHash,
    title: lesson.title,
    topic: lesson.topic,
    readingLevel: lesson.readingLevel,
    classId: lesson.classId,
    sourceMaterial: lesson.sourceMaterial,
    generatedReading: lesson.generatedReading,
    questions: lesson.questions || [],
    status: lesson.status || 'draft',
  };

  // Memory: replace if existing id, else push.
  const existingIdx = memStore.findIndex((l) => l.id === persisted.id);
  if (existingIdx >= 0) memStore[existingIdx] = persisted;
  else memStore.push(persisted);

  const sb = await getSupabaseServer();
  if (sb) {
    try {
      const { error } = await sb.from(TABLE).upsert(lessonToRow(persisted), { onConflict: 'id' });
      if (error) console.warn('teacher_lessons upsert failed:', error.message);
    } catch (err) {
      console.warn('teacher_lessons upsert threw:', err.message);
    }
  }
  return persisted;
}

export async function getLesson(id) {
  const sb = await getSupabaseServer();
  if (sb) {
    try {
      const { data, error } = await sb.from(TABLE).select('*').eq('id', id).maybeSingle();
      if (!error && data) return rowToLesson(data);
    } catch (err) {
      console.warn('teacher_lessons read failed, falling back to memory:', err.message);
    }
  }
  return memStore.find((l) => l.id === id) || null;
}

export async function listLessons({ createdByHash, status } = {}) {
  const sb = await getSupabaseServer();
  if (sb) {
    try {
      let q = sb.from(TABLE).select('*').order('created_at', { ascending: false }).limit(200);
      if (createdByHash) q = q.eq('created_by_hash', createdByHash);
      if (status) q = q.eq('status', status);
      const { data, error } = await q;
      if (!error && data) return data.map(rowToLesson);
    } catch (err) {
      console.warn('teacher_lessons list failed, falling back to memory:', err.message);
    }
  }
  let out = memStore.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (createdByHash) out = out.filter((l) => l.createdByHash === createdByHash);
  if (status) out = out.filter((l) => l.status === status);
  return out;
}

export async function deleteLesson(id) {
  const idx = memStore.findIndex((l) => l.id === id);
  if (idx >= 0) memStore.splice(idx, 1);
  const sb = await getSupabaseServer();
  if (sb) {
    try {
      await sb.from(TABLE).delete().eq('id', id);
    } catch (err) {
      console.warn('teacher_lessons delete threw:', err.message);
    }
  }
}

export function _resetLessonStoreForTests() {
  memStore.length = 0;
}
