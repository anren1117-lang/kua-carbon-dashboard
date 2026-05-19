// AI ingestion benchmark — ground-truth-tagged source documents used
// to measure the accuracy of the /admin/ai-ingestion agent (Capstone
// research question Q3).
//
// Each entry represents one source document. To answer Q3, populate
// this file with 5-10 real KUA documents (heating-oil invoice, dining
// invoice, travel itinerary, waste hauler report, etc.), then run:
//
//   node scripts/runAiBenchmark.mjs
//
// The runner posts each entry's `sourceText` to /api/admin/ai-ingestion,
// scores the extracted rows against `expected`, and writes a JSON
// summary to docs/ai-ingestion-benchmark-results.json.
//
// See docs/ai-ingestion-benchmark.md for the tagging protocol.

/**
 * @typedef {Object} BenchmarkField
 * @property {string} key                       Field name on the extracted row (e.g. 'gallons')
 * @property {string|number|boolean} expected   Ground-truth value
 * @property {'exact'|'numeric'|'date'|'fuzzy'} matchType  How to compare
 * @property {number} [tolerance]               For numeric: ± fraction (e.g. 0.02 = ±2%). For date: ± days.
 * @property {boolean} [safetyCritical]         If true, scored against the 100% target (account_number, unit, etc.)
 */

/**
 * @typedef {Object} BenchmarkRow
 * @property {string} table                     Canonical admin table the row belongs in (e.g. 'fuel_bills')
 * @property {BenchmarkField[]} fields          One entry per expected field
 */

/**
 * @typedef {Object} BenchmarkCase
 * @property {string} id                        Stable identifier — used as the runner output row key
 * @property {string} docType                   Free-text category: 'heating_oil_invoice' | 'dining_invoice' | 'travel_itinerary' | 'waste_report' | 'electricity_bill' | etc.
 * @property {string} description               One-line human description of the document
 * @property {string} sourceText                The full text content of the document (PDF stripped to text, etc.). Strip any PII.
 * @property {string} [sourceFile]              Optional reference to a sanitized copy in the repo (e.g. 'docs/benchmark-samples/heating-oil-2025-12.txt')
 * @property {BenchmarkRow[]} expected          One entry per row the agent SHOULD extract from this document
 * @property {Object} [hints]                   Optional context to pass to the agent (e.g. { vendor: 'Dead River' })
 */

/** @type {BenchmarkCase[]} */
export const benchmarkCases = [
  // Populate this array as documents are tagged. Example shape:
  //
  // {
  //   id: 'heating_oil_2025_12_dead_river',
  //   docType: 'heating_oil_invoice',
  //   description: 'Dead River Company heating oil delivery, December 2025',
  //   sourceText: '... full text of the invoice, PII stripped ...',
  //   sourceFile: 'docs/benchmark-samples/heating-oil-2025-12.txt',
  //   expected: [
  //     {
  //       table: 'fuel_bills',
  //       fields: [
  //         { key: 'fuel_type',       expected: 'heating_oil',  matchType: 'exact' },
  //         { key: 'gallons',         expected: 2480,           matchType: 'numeric', tolerance: 0.01 },
  //         { key: 'delivery_date',   expected: '2025-12-14',   matchType: 'date',    tolerance: 1 },
  //         { key: 'unit',            expected: 'gallons',      matchType: 'exact',   safetyCritical: true },
  //         { key: 'vendor',          expected: 'Dead River Company', matchType: 'fuzzy' },
  //         { key: 'account_number',  expected: 'KUA-04-2398',  matchType: 'exact',   safetyCritical: true },
  //       ],
  //     },
  //   ],
  // },
];

// Field match logic shared by the runner script. Lives here so the
// scoring rules are a code artifact, not just prose in the docs.

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** Compare an extracted value against an expected field. Returns true / false. */
export function fieldMatches(extracted, expected) {
  if (extracted === undefined || extracted === null) return false;
  const { matchType, tolerance } = expected;
  const e = expected.expected;
  if (matchType === 'exact') {
    if (typeof e === 'string') {
      return String(extracted).trim().toLowerCase() === e.trim().toLowerCase();
    }
    return extracted === e;
  }
  if (matchType === 'numeric') {
    const ex = Number(extracted);
    const ev = Number(e);
    if (!Number.isFinite(ex) || !Number.isFinite(ev)) return false;
    if (ev === 0) return ex === 0;
    const pctDiff = Math.abs(ex - ev) / Math.abs(ev);
    return pctDiff <= (tolerance ?? 0.01);
  }
  if (matchType === 'date') {
    const ex = new Date(extracted);
    const ev = new Date(e);
    if (Number.isNaN(ex.getTime()) || Number.isNaN(ev.getTime())) return false;
    const diffDays = Math.abs(ex.getTime() - ev.getTime()) / ONE_DAY_MS;
    return diffDays <= (tolerance ?? 0);
  }
  if (matchType === 'fuzzy') {
    // Case-insensitive substring match in either direction. Loose
    // because vendor names + addresses vary across documents
    // ("Dead River Co." vs "Dead River Company" vs "DEAD RIVER CO").
    const a = String(extracted).trim().toLowerCase();
    const b = String(e).trim().toLowerCase();
    return a.includes(b) || b.includes(a);
  }
  return false;
}

/** Roll up a single case's results into per-field correctness flags. */
export function scoreCase(extractedRows, benchmarkCase) {
  const perRowResults = benchmarkCase.expected.map((expectedRow, rowIdx) => {
    // The agent may return rows in a different order. For each expected
    // row, find the best-matching extracted row by counting field matches.
    let bestMatch = null;
    let bestMatchCount = -1;
    for (const er of (extractedRows || [])) {
      if (er.table !== expectedRow.table) continue;
      let matches = 0;
      for (const f of expectedRow.fields) {
        if (fieldMatches(er.fields?.[f.key], f)) matches += 1;
      }
      if (matches > bestMatchCount) {
        bestMatchCount = matches;
        bestMatch = er;
      }
    }
    const fieldResults = expectedRow.fields.map((f) => ({
      key: f.key,
      expected: f.expected,
      extracted: bestMatch?.fields?.[f.key],
      correct: bestMatch ? fieldMatches(bestMatch.fields?.[f.key], f) : false,
      safetyCritical: !!f.safetyCritical,
      matchType: f.matchType,
    }));
    return {
      rowIdx,
      table: expectedRow.table,
      matchedExtractedRow: !!bestMatch,
      fields: fieldResults,
    };
  });

  const allFields = perRowResults.flatMap((r) => r.fields);
  const correctCount = allFields.filter((f) => f.correct).length;
  const totalCount = allFields.length;
  const safetyCriticalFields = allFields.filter((f) => f.safetyCritical);
  const safetyCriticalCorrect = safetyCriticalFields.filter((f) => f.correct).length;

  return {
    id: benchmarkCase.id,
    docType: benchmarkCase.docType,
    overallAccuracy: totalCount > 0 ? correctCount / totalCount : 0,
    correctFields: correctCount,
    totalFields: totalCount,
    safetyCriticalAccuracy: safetyCriticalFields.length > 0
      ? safetyCriticalCorrect / safetyCriticalFields.length
      : null,
    safetyCriticalCorrect,
    safetyCriticalTotal: safetyCriticalFields.length,
    perRow: perRowResults,
  };
}
