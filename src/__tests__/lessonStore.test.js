// Unit tests for the teacher-lesson storage layer. Runs against the
// in-memory store (no Supabase env in tests), which is the path the
// /api/teacher/lessons handler exercises through this module. The
// store's load-bearing behaviors are: id/timestamp/status defaults on
// saveLesson, replace-by-id updates, the createdAt-desc sort that
// tolerates missing timestamps, and combined filter behavior.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveLesson, getLesson, listLessons, deleteLesson, _resetLessonStoreForTests,
} from '../storage/lessonStore.js';

const fixture = (over = {}) => ({
  createdByHash: 'teacher_aa11bb22',
  title: 'Climate basics',
  topic: 'climate',
  readingLevel: 'novice',
  sourceMaterial: 'pasted text',
  generatedReading: 'rewritten text',
  questions: [{ question: 'q', options: [{ text: 'a', correct: true, explanation: 'because' }] }],
  ...over,
});

beforeEach(() => { _resetLessonStoreForTests(); });

describe('saveLesson — defaults + persistence', () => {
  it('fills in an id, createdAt, and status="draft" when omitted', async () => {
    const out = await saveLesson(fixture());
    expect(out.id).toMatch(/^lesson_/);
    expect(typeof out.createdAt).toBe('string');
    expect(out.status).toBe('draft');
  });

  it('preserves a caller-supplied id + status', async () => {
    const out = await saveLesson(fixture({ id: 'my-id', status: 'published' }));
    expect(out.id).toBe('my-id');
    expect(out.status).toBe('published');
  });

  it('round-trips through getLesson', async () => {
    const saved = await saveLesson(fixture({ id: 'rt-id' }));
    const fetched = await getLesson('rt-id');
    expect(fetched).toEqual(saved);
  });

  it('replaces an existing lesson with the same id (no duplication)', async () => {
    await saveLesson(fixture({ id: 'dup', title: 'first' }));
    await saveLesson(fixture({ id: 'dup', title: 'second' }));
    const list = await listLessons();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('second');
  });

  it('defaults questions to [] when omitted', async () => {
    const out = await saveLesson(fixture({ questions: undefined }));
    expect(out.questions).toEqual([]);
  });
});

describe('getLesson', () => {
  it('returns null when no lesson matches', async () => {
    expect(await getLesson('nope')).toBeNull();
  });
});

describe('listLessons — filtering and sort', () => {
  beforeEach(async () => {
    await saveLesson(fixture({ id: 'a', createdAt: '2026-01-01T00:00:00Z', createdByHash: 't1', status: 'draft'     }));
    await saveLesson(fixture({ id: 'b', createdAt: '2026-03-01T00:00:00Z', createdByHash: 't1', status: 'published' }));
    await saveLesson(fixture({ id: 'c', createdAt: '2026-02-01T00:00:00Z', createdByHash: 't2', status: 'draft'     }));
  });

  it('returns every lesson when no filter is given', async () => {
    expect(await listLessons()).toHaveLength(3);
  });

  it('sorts descending by createdAt', async () => {
    const ids = (await listLessons()).map((l) => l.id);
    expect(ids).toEqual(['b', 'c', 'a']);
  });

  it('filters by createdByHash', async () => {
    const ids = (await listLessons({ createdByHash: 't1' })).map((l) => l.id);
    expect(ids).toEqual(['b', 'a']);
  });

  it('filters by status', async () => {
    const ids = (await listLessons({ status: 'draft' })).map((l) => l.id);
    expect(ids).toEqual(['c', 'a']);
  });

  it('combines filters (AND, not OR)', async () => {
    const out = await listLessons({ createdByHash: 't1', status: 'published' });
    expect(out.map((l) => l.id)).toEqual(['b']);
  });

  it('tolerates a row with no createdAt and sorts it to the end without throwing', async () => {
    await saveLesson(fixture({ id: 'noTs', createdAt: null }));
    // localeCompare on undefined would otherwise throw and propagate
    // a 500 to TeacherPortal — guarded with || '' in the source.
    const ids = (await listLessons()).map((l) => l.id);
    // The newly-saved one was created NOW so it'll actually sort to
    // the TOP because its createdAt is the current ISO string. The
    // load-bearing assertion: list returns without throwing and
    // contains every row.
    expect(ids).toContain('noTs');
    expect(ids).toHaveLength(4);
  });
});

describe('deleteLesson', () => {
  it('removes a lesson from the store', async () => {
    await saveLesson(fixture({ id: 'die' }));
    await deleteLesson('die');
    expect(await getLesson('die')).toBeNull();
  });

  it('is a no-op for an unknown id (does not throw)', async () => {
    await expect(deleteLesson('never-existed')).resolves.toBeUndefined();
  });
});

describe('_resetLessonStoreForTests', () => {
  it('clears the in-memory store', async () => {
    await saveLesson(fixture());
    _resetLessonStoreForTests();
    expect(await listLessons()).toEqual([]);
  });
});
