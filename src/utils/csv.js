// Tiny CSV serialization helper. Used by the admin portal's
// "Download CSV" buttons so admins can export records for AASHE
// STARS reporting / accreditation submissions / external analysis.
//
// Keeps the CSV spec simple but correct:
//   - Comma delimiter, no BOM (Excel auto-detects UTF-8 fine).
//   - Field-quoted only when needed (contains comma, quote, or
//     newline). Embedded quotes are doubled per RFC 4180.
//   - Header row from the union of object keys, in stable insertion
//     order across the rows.
//   - null / undefined render as empty cells (NOT "null" / "undefined").

/**
 * Serialize an array of plain objects to CSV. Returns a string with
 * trailing newline.
 *
 * @param {Array<object>} rows
 * @param {string[]} [columns]  Optional column order. Defaults to the
 *                              union of keys discovered across rows
 *                              in first-seen order.
 */
export function toCsv(rows, columns) {
  if (!Array.isArray(rows) || rows.length === 0) return '';
  const cols = Array.isArray(columns) && columns.length > 0
    ? columns
    : discoverColumns(rows);
  const lines = [cols.map(escapeCell).join(',')];
  for (const row of rows) {
    lines.push(cols.map((c) => escapeCell(row?.[c])).join(','));
  }
  return lines.join('\n') + '\n';
}

function discoverColumns(rows) {
  const seen = new Set();
  const order = [];
  for (const row of rows) {
    if (row && typeof row === 'object') {
      for (const k of Object.keys(row)) {
        if (!seen.has(k)) { seen.add(k); order.push(k); }
      }
    }
  }
  return order;
}

function escapeCell(value) {
  if (value === null || value === undefined) return '';
  // jsonb columns from Supabase come back as objects/arrays — render
  // those as JSON so the CSV stays usable. Numbers + booleans go
  // through their default toString.
  let s = typeof value === 'object' ? JSON.stringify(value) : String(value);
  // RFC 4180: quote when the field contains comma, quote, CR, or LF.
  if (/[",\r\n]/.test(s)) {
    s = '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

/**
 * Parse a CSV string back into an array of plain objects, keyed by
 * the header row. Counterpart to toCsv() — the round-trip on a row
 * with no special characters is lossless.
 *
 * Honors RFC 4180:
 *   - Comma delimiter, optional CRLF or LF line endings.
 *   - Quoted fields can contain commas, newlines, and quotes (the
 *     latter doubled as ""). Whitespace inside quotes is preserved.
 *   - Empty cells render as empty strings (NOT null).
 *
 * Returns { rows, columns, errors } so callers can show a row-by-row
 * preview and surface parse failures without rejecting the whole
 * file.
 *
 * @param {string} text         The full CSV file contents
 * @returns {{ rows: object[], columns: string[], errors: Array<{ row: number, message: string }> }}
 */
export function parseCsv(text) {
  const errors = [];
  if (typeof text !== 'string' || text.length === 0) {
    return { rows: [], columns: [], errors: [] };
  }
  // Normalize line endings; the tokenizer below treats '\n' as the
  // record separator outside quoted fields.
  const src = text.replace(/\r\n?/g, '\n');

  // Single-pass tokenizer: walks the string, accumulating cells and
  // rows. State machine: inField (default) or inQuoted.
  const rawRows = [];
  let cell = '';
  let row = [];
  let inQuoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuoted) {
      if (c === '"') {
        // Doubled quote inside a quoted cell → literal quote.
        if (src[i + 1] === '"') { cell += '"'; i++; }
        else { inQuoted = false; }
      } else {
        cell += c;
      }
    } else {
      if (c === '"') {
        inQuoted = true;
      } else if (c === ',') {
        row.push(cell); cell = '';
      } else if (c === '\n') {
        row.push(cell); cell = '';
        rawRows.push(row); row = [];
      } else {
        cell += c;
      }
    }
  }
  // Trailing cell + row (file may end without newline).
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rawRows.push(row);
  }
  if (rawRows.length === 0) return { rows: [], columns: [], errors };

  // First non-empty row is the header.
  const header = rawRows.find((r) => r.some((c) => c && c.length > 0));
  if (!header) return { rows: [], columns: [], errors };
  const columns = header.map((h) => String(h).trim());
  const dataRows = rawRows.slice(rawRows.indexOf(header) + 1);

  const rows = [];
  for (let idx = 0; idx < dataRows.length; idx++) {
    const r = dataRows[idx];
    // Skip rows that are entirely empty (often a trailing newline).
    if (r.every((c) => !c || c.length === 0)) continue;
    if (r.length !== columns.length) {
      errors.push({
        row: idx + 2, // +1 for 0-indexed → 1-indexed, +1 for header
        message: `expected ${columns.length} cells, got ${r.length}`,
      });
      // Still emit a partial row so the preview shows what was parsed.
    }
    const obj = {};
    for (let j = 0; j < columns.length; j++) {
      obj[columns[j]] = r[j] !== undefined ? r[j] : '';
    }
    rows.push(obj);
  }
  return { rows, columns, errors };
}

/**
 * Trigger a browser download of a CSV file. No-ops on the server.
 *
 * @param {string} filename
 * @param {string} csv         Output of toCsv()
 */
export function downloadCsv(filename, csv) {
  if (typeof document === 'undefined' || typeof URL === 'undefined') return;
  // Lazily build a Blob so we don't keep the string in memory after
  // the download starts. revokeObjectURL after a tick to free the
  // URL once the browser has consumed it.
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    // Some environments (older browsers, jsdom) don't implement
    // revokeObjectURL — skip silently rather than throwing into a
    // setTimeout where no caller can catch it.
    if (typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(url);
  }, 0);
}
