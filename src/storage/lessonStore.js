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
  const id = lesson.id || `lesson_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const existingIdx = memStore.findIndex((l) => l.id === id);
  // Preserve the original createdAt across updates — "createdAt" is a
  // creation timestamp, not "lastSaved." If a caller saves an edited
  // lesson without re-passing createdAt, the earlier `lesson.createdAt
  // || new Date()` reset it to "now" on every edit. Same fix pattern
  // as saveStagePlan + saveCustomAction.
  const createdAt = existingIdx >= 0
    ? memStore[existingIdx].createdAt
    : (lesson.createdAt || new Date().toISOString());
  const persisted = {
    id,
    createdAt,
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
  // Same defensive ladder as listLessons — getSupabaseServer reject,
  // a Supabase query throw, or a rowToLesson throw on a malformed
  // timestamp all need to fall through to the memStore lookup
  // instead of propagating as a 500.
  let sb = null;
  try { sb = await getSupabaseServer(); }
  catch (err) { console.warn('Supabase init threw, falling back to memory:', err.message); }
  if (sb) {
    try {
      const { data, error } = await sb.from(TABLE).select('*').eq('id', id).maybeSingle();
      if (!error && data) {
        try { return rowToLesson(data); }
        catch (err) { console.warn('teacher_lessons row mapping failed, falling back to memory:', err.message); }
      }
    } catch (err) {
      console.warn('teacher_lessons read failed, falling back to memory:', err.message);
    }
  }
  return memStore.find((l) => l.id === id) || null;
}

export async function listLessons({ createdByHash, status } = {}) {
  // Wrap getSupabaseServer too — a misconfigured Supabase URL or a
  // dynamic-import failure inside the cached _initPromise would
  // otherwise reject here and propagate as an HTTP 500 to the
  // TeacherPortal "My lessons" panel.
  let sb = null;
  try { sb = await getSupabaseServer(); }
  catch (err) { console.warn('Supabase init threw, falling back to memory:', err.message); }
  if (sb) {
    try {
      let q = sb.from(TABLE).select('*').order('created_at', { ascending: false }).limit(200);
      if (createdByHash) q = q.eq('created_by_hash', createdByHash);
      if (status) q = q.eq('status', status);
      const { data, error } = await q;
      if (!error && data) {
        // rowToLesson can throw on a malformed timestamp (Invalid
        // time value). Defend the .map so a single bad row doesn't
        // sink the whole list.
        try { return data.map(rowToLesson); }
        catch (err) { console.warn('teacher_lessons row mapping failed, falling back to memory:', err.message); }
      }
    } catch (err) {
      console.warn('teacher_lessons list failed, falling back to memory:', err.message);
    }
  }
  // Sort defensively — undefined createdAt would throw .localeCompare
  // on undefined and propagate as a 500 even after the Supabase paths
  // were hardened above. Coerce to '' so bad rows sort to the end.
  let out = memStore.slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
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
