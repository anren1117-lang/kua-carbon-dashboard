// Lesson library invariants. These exist because the library is a
// reference document teachers will judge by — a fake course on a
// lesson card destroys credibility faster than any other defect.
// Lock the data shape and the verified-course set with tests so a
// future edit can't introduce one accidentally.

import { describe, it, expect } from 'vitest';
import {
  lessonLibrary,
  DEPARTMENTS,
  FORMATS,
  DURATION_BUCKETS,
  VERIFIED_COURSES,
  bucketDuration,
  matchesQuery,
} from '../data/lessonLibrary.js';

describe('lessonLibrary — data integrity', () => {
  it('every lesson has the required fields', () => {
    for (const l of lessonLibrary) {
      expect(l.id, `lesson missing id: ${l.title}`).toBeTruthy();
      expect(l.title, `lesson ${l.id} missing title`).toBeTruthy();
      expect(typeof l.durationMin, `lesson ${l.id} durationMin must be number`).toBe('number');
      expect(l.durationMin, `lesson ${l.id} duration must be > 0`).toBeGreaterThan(0);
      expect(Array.isArray(l.courses), `lesson ${l.id} courses must be array`).toBe(true);
      expect(l.courses.length, `lesson ${l.id} must list ≥1 course`).toBeGreaterThan(0);
      expect(Array.isArray(l.dashboardPages), `lesson ${l.id} pages must be array`).toBe(true);
      expect(l.dashboardPages.length, `lesson ${l.id} must list ≥1 page`).toBeGreaterThan(0);
      expect(Array.isArray(l.learningGoals), `lesson ${l.id} goals must be array`).toBe(true);
      expect(l.learningGoals.length, `lesson ${l.id} must list ≥1 goal`).toBeGreaterThan(0);
      expect(l.studentTask, `lesson ${l.id} missing studentTask`).toBeTruthy();
      expect(l.summary, `lesson ${l.id} missing summary`).toBeTruthy();
    }
  });

  it('every lesson uses a known department', () => {
    for (const l of lessonLibrary) {
      expect(DEPARTMENTS, `lesson ${l.id} dept ${l.department} not in DEPARTMENTS`).toContain(l.department);
    }
  });

  it('every lesson uses a known format', () => {
    for (const l of lessonLibrary) {
      expect(FORMATS, `lesson ${l.id} format ${l.format} not in FORMATS`).toContain(l.format);
    }
  });

  it('every course tag is in the VERIFIED_COURSES set (no fake courses)', () => {
    for (const l of lessonLibrary) {
      for (const c of l.courses) {
        expect(
          VERIFIED_COURSES,
          `lesson ${l.id} cites unverified course "${c}" — add to VERIFIED_COURSES or remove`,
        ).toContain(c);
      }
    }
  });

  it('every dashboard page starts with /', () => {
    for (const l of lessonLibrary) {
      for (const p of l.dashboardPages) {
        expect(p.startsWith('/'), `lesson ${l.id} page "${p}" must start with /`).toBe(true);
      }
    }
  });

  it('lesson ids are unique', () => {
    const ids = lessonLibrary.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('library covers at least 5 departments', () => {
    const depts = new Set(lessonLibrary.map((l) => l.department));
    expect(depts.size).toBeGreaterThanOrEqual(5);
  });

  it('library covers at least 6 formats', () => {
    const fmts = new Set(lessonLibrary.map((l) => l.format));
    expect(fmts.size).toBeGreaterThanOrEqual(6);
  });

  it('every AP course in VERIFIED_COURSES is covered by at least one lesson', () => {
    const apCourses = VERIFIED_COURSES.filter((c) => c.startsWith('AP '));
    const taggedCourses = new Set(lessonLibrary.flatMap((l) => l.courses));
    const uncovered = apCourses.filter((c) => !taggedCourses.has(c));
    expect(
      uncovered,
      `AP courses without any lesson: ${uncovered.join(', ')} — add a lesson or remove from VERIFIED_COURSES`,
    ).toEqual([]);
  });

  it('library has at least 25 lessons (regression guard against accidental deletion)', () => {
    expect(lessonLibrary.length).toBeGreaterThanOrEqual(25);
  });
});

describe('lessonLibrary — helper functions', () => {
  it('bucketDuration assigns a bucket to every plausible duration', () => {
    expect(bucketDuration(10).id).toBe('short');
    expect(bucketDuration(19).id).toBe('short');
    expect(bucketDuration(20).id).toBe('medium');
    expect(bucketDuration(40).id).toBe('medium');
    expect(bucketDuration(41).id).toBe('long');
    expect(bucketDuration(240).id).toBe('long');
  });

  it('every lesson buckets cleanly into a duration bucket', () => {
    for (const l of lessonLibrary) {
      const b = bucketDuration(l.durationMin);
      expect(b, `lesson ${l.id} duration ${l.durationMin} has no bucket`).toBeTruthy();
      expect(DURATION_BUCKETS).toContain(b);
    }
  });

  it('matchesQuery returns true on empty query', () => {
    expect(matchesQuery(lessonLibrary[0], '')).toBe(true);
    expect(matchesQuery(lessonLibrary[0], null)).toBe(true);
    expect(matchesQuery(lessonLibrary[0], undefined)).toBe(true);
  });

  it('matchesQuery matches title case-insensitively', () => {
    const l = lessonLibrary.find((x) => x.title.toLowerCase().includes('climate'));
    expect(l).toBeTruthy();
    expect(matchesQuery(l, 'CLIMATE')).toBe(true);
    expect(matchesQuery(l, 'climate')).toBe(true);
  });

  it('matchesQuery matches course name', () => {
    const l = lessonLibrary.find((x) => x.courses.includes('AP Environmental Science'));
    expect(l).toBeTruthy();
    expect(matchesQuery(l, 'environmental')).toBe(true);
  });

  it('matchesQuery returns false when nothing matches', () => {
    expect(matchesQuery(lessonLibrary[0], 'xyzzy-nonsense-string')).toBe(false);
  });
});
