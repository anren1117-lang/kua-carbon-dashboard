// Extract plain text from a teacher-uploaded file. Used by /teacher/create
// to populate the lesson editor's sourceMaterial textarea, after which
// the existing /api/teacher/lessons flow takes over.
//
// Supported types:
//   - text/plain, text/markdown, text/csv, application/json → FileReader
//   - application/pdf → pdfjs-dist (DYNAMICALLY imported so the ~1.5 MB
//     pdf.js library only ships when a teacher actually uploads a PDF)
//
// 5 MB hard cap on input file size to keep the lesson editor predictable
// and the eventual Anthropic prompt under quota.

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_CHARS = 12_000; // Matches /api/teacher/lessons body limit.

const TEXT_TYPES = new Set([
  'text/plain', 'text/markdown', 'text/csv', 'application/json',
  '', // some browsers omit type for .md
]);

const TEXT_EXTENSIONS = ['.txt', '.md', '.markdown', '.csv', '.json'];
const PDF_EXTENSIONS = ['.pdf'];

/**
 * @param {File} file
 * @returns {Promise<{ text: string, kind: 'text'|'pdf', truncated: boolean, sourceFileName: string }>}
 */
export async function extractFileText(file) {
  if (!(file instanceof Blob)) {
    throw new Error('Expected a File / Blob');
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`File is too large (${formatBytes(file.size)}). Limit is ${formatBytes(MAX_BYTES)}.`);
  }

  const name = file.name || 'upload';
  const lower = name.toLowerCase();

  if (TEXT_TYPES.has(file.type) || TEXT_EXTENSIONS.some((e) => lower.endsWith(e))) {
    const raw = await file.text();
    return finalize(raw, 'text', name);
  }

  if (file.type === 'application/pdf' || PDF_EXTENSIONS.some((e) => lower.endsWith(e))) {
    const raw = await extractPdfText(file);
    return finalize(raw, 'pdf', name);
  }

  throw new Error(`Unsupported file type "${file.type || lower}". Supported: .txt, .md, .csv, .json, .pdf`);
}

function finalize(text, kind, sourceFileName) {
  const cleaned = (text || '').replace(/\u0000/g, '').trim();
  const truncated = cleaned.length > MAX_CHARS;
  return {
    text: truncated ? cleaned.slice(0, MAX_CHARS) : cleaned,
    kind,
    truncated,
    sourceFileName,
  };
}

async function extractPdfText(file) {
  // Dynamic import keeps pdfjs out of the main bundle. The legacy build
  // ships an ESM entry that works in Vite without extra config.
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  // Worker setup: Safari rejects an empty workerSrc string with "The
  // string did not match the expected pattern" because it tries to
  // parse it as a URL even when disableWorker is true. Chrome and
  // Firefox tolerate the empty string, but Safari does not.
  //
  // Fix: point workerSrc at the version-pinned CDN copy of the worker.
  // It only loads if pdfjs decides it needs one (it usually does for
  // sandbox isolation), and the version match avoids API drift.
  // The fallback only applies if pdfjs stops exporting `version`. It must
  // track the installed major or the CDN would serve a worker from a
  // different release than the library — Phase 528 moved pdfjs 5 -> 6 and
  // this literal still said 5.7.284, which would have paired a v6 library
  // with a v5 worker in exactly the case the fallback exists to cover.
  // extractFileText.test.js asserts this equals the installed version.
  const workerVersion = pdfjs.version || '6.4.299';
  pdfjs.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${workerVersion}/legacy/build/pdf.worker.min.mjs`;
  const arrayBuf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: arrayBuf, isEvalSupported: false }).promise;

  const pageTexts = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageStr = content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
    pageTexts.push(pageStr);
    if (pageTexts.join('\n').length > MAX_CHARS * 1.2) break;
  }
  return pageTexts.join('\n\n');
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export const FILE_LIMITS = { MAX_BYTES, MAX_CHARS };
