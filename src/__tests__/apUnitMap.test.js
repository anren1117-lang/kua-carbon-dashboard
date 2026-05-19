// AP unit map invariants. Each entry tags a published College Board
// CED unit with a fit rating + (optional) dashboard hook. Wrong unit
// numbers or invented unit names would mislead a teacher worse than
// having no map at all, so we lock the shape with tests.

import { describe, it, expect } from 'vitest';
import {
  apUnitMap,
  AP_COURSES_COVERED,
  FITS,
  countByFit,
  totalCoveredUnits,
} from '../data/apUnitMap.js';
import { VERIFIED_COURSES, lessonLibrary } from '../data/lessonLibrary.js';

describe('apUnitMap — data integrity', () => {
  it('every course is a verified KUA course', () => {
    for (const c of apUnitMap) {
      expect(
        VERIFIED_COURSES,
        `apUnitMap course "${c.courseId}" not in VERIFIED_COURSES`,
      ).toContain(c.courseId);
    }
  });

  it('every course has a units array with sequentially numbered units', () => {
    for (const c of apUnitMap) {
      expect(Array.isArray(c.units), `${c.courseId} units must be array`).toBe(true);
      expect(c.units.length, `${c.courseId} must have ≥1 unit`).toBeGreaterThan(0);
      // CED units are 1-indexed and sequential; catch off-by-one errors.
      for (let i = 0; i < c.units.length; i++) {
        expect(
          c.units[i].num,
          `${c.courseId} unit at index ${i} should be unit ${i + 1}, got ${c.units[i].num}`,
        ).toBe(i + 1);
      }
    }
  });

  it('every unit has a valid fit rating', () => {
    for (const c of apUnitMap) {
      for (const u of c.units) {
        expect(
          FITS,
          `${c.courseId} unit ${u.num} fit "${u.fit}" not in FITS`,
        ).toContain(u.fit);
      }
    }
  });

  it('units with fit=none must NOT have a hook or pages (honest gaps)', () => {
    for (const c of apUnitMap) {
      for (const u of c.units) {
        if (u.fit === 'none') {
          expect(u.hook, `${c.courseId} unit ${u.num} has fit=none but a hook`).toBeNull();
          expect(u.dashboardPages, `${c.courseId} unit ${u.num} has fit=none but pages`).toEqual([]);
          expect(u.linkedLessonIds, `${c.courseId} unit ${u.num} has fit=none but lessons`).toEqual([]);
        }
      }
    }
  });

  it('units with fit=direct or fit=tangential must have a hook', () => {
    for (const c of apUnitMap) {
      for (const u of c.units) {
        if (u.fit === 'direct' || u.fit === 'tangential') {
          expect(u.hook, `${c.courseId} unit ${u.num} fit=${u.fit} but no hook`).toBeTruthy();
        }
      }
    }
  });

  it('every linkedLessonId points to a real lesson in lessonLibrary', () => {
    const validIds = new Set(lessonLibrary.map((l) => l.id));
    for (const c of apUnitMap) {
      for (const u of c.units) {
        for (const id of u.linkedLessonIds) {
          expect(
            validIds.has(id),
            `${c.courseId} unit ${u.num} links to unknown lesson id "${id}"`,
          ).toBe(true);
        }
      }
    }
  });

  it('every dashboard page in a hook starts with /', () => {
    for (const c of apUnitMap) {
      for (const u of c.units) {
        for (const p of u.dashboardPages) {
          expect(p.startsWith('/'), `${c.courseId} unit ${u.num} page "${p}" must start with /`).toBe(true);
        }
      }
    }
  });

  it('AP_COURSES_COVERED matches the apUnitMap entries', () => {
    expect(AP_COURSES_COVERED.length).toBe(apUnitMap.length);
  });

  it('map covers at least 5 AP courses', () => {
    expect(apUnitMap.length).toBeGreaterThanOrEqual(5);
  });

  it('at least 30 units across all courses have a defensible hook (direct or tangential)', () => {
    expect(totalCoveredUnits()).toBeGreaterThanOrEqual(30);
  });
});

describe('apUnitMap — helpers', () => {
  it('countByFit returns counts that sum to the unit count', () => {
    for (const c of apUnitMap) {
      const counts = countByFit(c);
      const sum = counts.direct + counts.tangential + counts.none;
      expect(sum).toBe(c.units.length);
    }
  });
});
