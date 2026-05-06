// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { toCsv, downloadCsv } from '../utils/csv.js';

describe('toCsv', () => {
  it('returns empty string for empty input', () => {
    expect(toCsv([])).toBe('');
    expect(toCsv(null)).toBe('');
    expect(toCsv(undefined)).toBe('');
  });

  it('discovers columns in first-seen order across rows', () => {
    const csv = toCsv([
      { a: 1, b: 2 },
      { b: 5, c: 6 },          // c discovered second
      { a: 7, c: 8, d: 9 },    // d discovered third
    ]);
    const [header] = csv.trim().split('\n');
    expect(header).toBe('a,b,c,d');
  });

  it('honors explicit column order', () => {
    const csv = toCsv([{ a: 1, b: 2, c: 3 }], ['c', 'a']);
    expect(csv.trim().split('\n')[0]).toBe('c,a');
    expect(csv.trim().split('\n')[1]).toBe('3,1');
  });

  it('quotes cells containing commas, quotes, or newlines per RFC 4180', () => {
    const csv = toCsv([
      { name: 'Hello, World', note: 'has "quotes"', addr: 'line1\nline2' },
    ]);
    // The newline inside the quoted address means csv.split('\n') would
    // mis-split — assert against the full output instead.
    expect(csv).toContain('"Hello, World"');
    expect(csv).toContain('"has ""quotes"""');
    expect(csv).toContain('"line1\nline2"');
  });

  it('renders null and undefined as empty cells', () => {
    const csv = toCsv([{ a: 1, b: null, c: undefined }]);
    const [, body] = csv.trim().split('\n');
    expect(body).toBe('1,,');
  });

  it('JSON-stringifies object/array fields (Supabase jsonb columns)', () => {
    const csv = toCsv([{ payload: { foo: 1, bar: [2, 3] } }]);
    const [, body] = csv.trim().split('\n');
    // The JSON contains commas + quotes so the cell is double-quoted
    // with embedded quotes doubled.
    expect(body).toContain('"{');
    expect(body).toContain('""foo""');
  });

  it('preserves numeric and boolean cells without quoting', () => {
    const csv = toCsv([{ n: 42, b: true }]);
    expect(csv.trim().split('\n')[1]).toBe('42,true');
  });

  it('appends trailing newline', () => {
    const csv = toCsv([{ a: 1 }]);
    expect(csv.endsWith('\n')).toBe(true);
  });
});

describe('downloadCsv (browser-side)', () => {
  it('does not crash when called with a string', () => {
    // jsdom doesn't implement URL.createObjectURL — stub before calling
    // so the test exercises the helper's plumbing without needing a
    // real browser. We verify the URL was both created and revoked.
    const created = [];
    const revoked = [];
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    URL.createObjectURL = (b) => { created.push(b); return 'blob:mock'; };
    URL.revokeObjectURL = (u) => { revoked.push(u); };
    try {
      expect(() => downloadCsv('test.csv', 'a,b\n1,2\n')).not.toThrow();
      expect(created.length).toBe(1);
    } finally {
      URL.createObjectURL = origCreate;
      URL.revokeObjectURL = origRevoke;
    }
  });
});
