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
