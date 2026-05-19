// teachingResources invariants. This is the general (non-carbon)
// AP teaching content library. Locking the data shape and the
// CED-alignment with tests so a future edit can't silently break it.

import { describe, it, expect } from 'vitest';
import {
  teachingResources,
  SUBJECTS,
  RESOURCE_FORMATS,
  resourceMatches,
  countByFormat,
  countBySubject,
} from '../data/teachingResources.js';

describe('teachingResources — data integrity', () => {
  it('every resource has the required fields', () => {
    for (const r of teachingResources) {
      expect(r.id, `resource missing id: ${r.title}`).toBeTruthy();
      expect(r.title, `resource ${r.id} missing title`).toBeTruthy();
      expect(r.subject, `resource ${r.id} missing subject`).toBeTruthy();
      expect(r.course, `resource ${r.id} missing course`).toBeTruthy();
      expect(r.cedUnit, `resource ${r.id} missing cedUnit`).toBeTruthy();
      expect(r.format, `resource ${r.id} missing format`).toBeTruthy();
      expect(typeof r.durationMin, `resource ${r.id} durationMin must be number`).toBe('number');
      expect(r.summary, `resource ${r.id} missing summary`).toBeTruthy();
      expect(r.content, `resource ${r.id} missing content`).toBeTruthy();
      expect(r.content.length, `resource ${r.id} content too short`).toBeGreaterThan(100);
    }
  });

  it('every resource uses a known subject', () => {
    for (const r of teachingResources) {
      expect(SUBJECTS, `resource ${r.id} subject "${r.subject}" not in SUBJECTS`).toContain(r.subject);
    }
  });

  it('every resource uses a known format', () => {
    for (const r of teachingResources) {
      expect(RESOURCE_FORMATS, `resource ${r.id} format "${r.format}" not in RESOURCE_FORMATS`).toContain(r.format);
    }
  });

  it('resource ids are unique', () => {
    const ids = teachingResources.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('library has at least 30 resources', () => {
    expect(teachingResources.length).toBeGreaterThanOrEqual(30);
  });

  it('library covers at least 5 subjects', () => {
    const subjects = new Set(teachingResources.map((r) => r.subject));
    expect(subjects.size).toBeGreaterThanOrEqual(5);
  });

  it('library covers at least 6 distinct formats', () => {
    const formats = new Set(teachingResources.map((r) => r.format));
    expect(formats.size).toBeGreaterThanOrEqual(6);
  });

  it('library covers at least 10 distinct AP courses', () => {
    const courses = new Set(teachingResources.map((r) => r.course));
    expect(courses.size).toBeGreaterThanOrEqual(10);
  });
});

describe('teachingResources — helpers', () => {
  it('resourceMatches returns true on empty query', () => {
    expect(resourceMatches(teachingResources[0], '')).toBe(true);
    expect(resourceMatches(teachingResources[0], null)).toBe(true);
    expect(resourceMatches(teachingResources[0], undefined)).toBe(true);
  });

  it('resourceMatches matches title case-insensitively', () => {
    const r = teachingResources.find((x) => x.title.toLowerCase().includes('stoichiometry'));
    expect(r).toBeTruthy();
    expect(resourceMatches(r, 'STOICHIOMETRY')).toBe(true);
    expect(resourceMatches(r, 'stoichiometry')).toBe(true);
  });

  it('resourceMatches returns false when nothing matches', () => {
    expect(resourceMatches(teachingResources[0], 'xyzzy-nonsense-string')).toBe(false);
  });

  it('countByFormat sums to total resources', () => {
    const counts = countByFormat();
    let sum = 0;
    for (const f of RESOURCE_FORMATS) sum += counts[f] || 0;
    expect(sum).toBe(teachingResources.length);
  });

  it('countBySubject sums to total resources', () => {
    const counts = countBySubject();
    let sum = 0;
    for (const s of SUBJECTS) sum += counts[s] || 0;
    expect(sum).toBe(teachingResources.length);
  });
});
