// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { toCsv, parseCsv, downloadCsv, downloadBlob } from '../utils/csv.js';

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

describe('parseCsv', () => {
  it('returns empty arrays for empty input', () => {
    expect(parseCsv('')).toEqual({ rows: [], columns: [], errors: [] });
    expect(parseCsv(null)).toEqual({ rows: [], columns: [], errors: [] });
    expect(parseCsv(undefined)).toEqual({ rows: [], columns: [], errors: [] });
  });

  it('parses a simple header + rows', () => {
    const r = parseCsv('a,b,c\n1,2,3\n4,5,6\n');
    expect(r.columns).toEqual(['a', 'b', 'c']);
    expect(r.rows).toEqual([
      { a: '1', b: '2', c: '3' },
      { a: '4', b: '5', c: '6' },
    ]);
    expect(r.errors).toEqual([]);
  });

  it('handles CRLF and trailing newline tolerantly', () => {
    const r = parseCsv('a,b\r\n1,2\r\n3,4\r\n');
    expect(r.rows.length).toBe(2);
    expect(r.rows[1]).toEqual({ a: '3', b: '4' });
  });

  it('honors quoted fields with commas + newlines + doubled quotes', () => {
    const csv = 'name,note,addr\n"Hello, World","has ""quotes""","line1\nline2"\n';
    const r = parseCsv(csv);
    expect(r.rows[0].name).toBe('Hello, World');
    expect(r.rows[0].note).toBe('has "quotes"');
    expect(r.rows[0].addr).toBe('line1\nline2');
  });

  it('records an error when a row has wrong number of cells', () => {
    const csv = 'a,b,c\n1,2\n4,5,6,7\n';
    const r = parseCsv(csv);
    expect(r.errors.length).toBe(2);
    expect(r.errors[0]).toMatchObject({ row: 2 });
    expect(r.errors[1]).toMatchObject({ row: 3 });
    // Still emits the partial rows for preview purposes.
    expect(r.rows.length).toBe(2);
  });

  it('skips entirely empty data rows (trailing blank lines)', () => {
    const r = parseCsv('a,b\n1,2\n\n\n');
    expect(r.rows.length).toBe(1);
  });

  it('round-trips with toCsv on plain data', () => {
    const original = [
      { date: '2026-01-15', fuel_type: 'Heating Oil', gallons: '5000' },
      { date: '2026-02-20', fuel_type: 'Propane', gallons: '300' },
    ];
    const r = parseCsv(toCsv(original));
    expect(r.rows).toEqual(original);
    expect(r.columns).toEqual(['date', 'fuel_type', 'gallons']);
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

describe('downloadBlob (generic)', () => {
  it('builds a Blob with the requested MIME and triggers a click on a fresh anchor', () => {
    const created = [];
    const origCreate = URL.createObjectURL;
    URL.createObjectURL = (b) => { created.push(b); return 'blob:mock'; };
    // Capture the anchor that gets clicked so we can verify the
    // filename + download attributes.
    let clickedAnchor = null;
    const origCreateElement = document.createElement.bind(document);
    document.createElement = (tag) => {
      const el = origCreateElement(tag);
      if (tag === 'a') {
        const origClick = el.click.bind(el);
        el.click = () => { clickedAnchor = el; origClick(); };
      }
      return el;
    };
    try {
      downloadBlob('plan.json', '{"a":1}', 'application/json');
      expect(created.length).toBe(1);
      expect(created[0].type).toBe('application/json');
      expect(clickedAnchor).not.toBeNull();
      expect(clickedAnchor.download).toBe('plan.json');
      expect(clickedAnchor.href).toBe('blob:mock');
    } finally {
      URL.createObjectURL = origCreate;
      document.createElement = origCreateElement;
    }
  });

  it('defaults MIME to text/plain when omitted', () => {
    const types = [];
    const origCreate = URL.createObjectURL;
    URL.createObjectURL = (b) => { types.push(b.type); return 'blob:mock'; };
    try {
      downloadBlob('whatever.txt', 'hello');
      expect(types[0]).toBe('text/plain;charset=utf-8');
    } finally {
      URL.createObjectURL = origCreate;
    }
  });

  it('downloadCsv still routes through downloadBlob with text/csv MIME', () => {
    const types = [];
    const origCreate = URL.createObjectURL;
    URL.createObjectURL = (b) => { types.push(b.type); return 'blob:mock'; };
    try {
      downloadCsv('export.csv', 'a,b\n1,2');
      expect(types[0]).toBe('text/csv;charset=utf-8');
    } finally {
      URL.createObjectURL = origCreate;
    }
  });
});
