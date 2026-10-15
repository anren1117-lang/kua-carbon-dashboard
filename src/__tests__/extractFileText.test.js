// @vitest-environment jsdom
//
// Unit tests for extractFileText — the teacher-upload text extractor
// behind /teacher/create. Covers the non-PDF surface: input-type
// guard, the 5 MB size cap, plain-text/markdown/csv/json extraction,
// null-byte stripping + trim + MAX_CHARS truncation, and the
// unsupported-type reject. The pdfjs path is dynamically imported and
// not exercised here.

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { extractFileText, FILE_LIMITS } from '../utils/extractFileText.js';

// jsdom's Blob in this version doesn't implement .text(); the browser
// and Node both do. Polyfill it via FileReader so the module under
// test runs against a faithful File API.
beforeAll(() => {
  if (typeof Blob.prototype.text !== 'function') {
    Blob.prototype.text = function () {
      return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = () => reject(fr.error);
        fr.readAsText(this);
      });
    };
  }
});

const textFile = (content, name = 'notes.txt', type = 'text/plain') =>
  new File([content], name, { type });

describe('extractFileText — input guards', () => {
  it('rejects a non-Blob input', async () => {
    await expect(extractFileText({ name: 'fake.txt' })).rejects.toThrow(/Expected a File \/ Blob/);
    await expect(extractFileText('just a string')).rejects.toThrow(/Expected a File \/ Blob/);
  });

  it('rejects a file over the 5 MB cap', async () => {
    const f = textFile('small');
    // Shadow the read-only size getter rather than allocating 5 MB.
    Object.defineProperty(f, 'size', { value: FILE_LIMITS.MAX_BYTES + 1 });
    await expect(extractFileText(f)).rejects.toThrow(/too large.*Limit is/);
  });

  it('rejects an unsupported file type', async () => {
    const f = new File(['data'], 'archive.zip', { type: 'application/zip' });
    await expect(extractFileText(f)).rejects.toThrow(/Unsupported file type/);
  });
});

describe('extractFileText — text extraction', () => {
  it('extracts plain text and reports kind + filename', async () => {
    const out = await extractFileText(textFile('Hello lesson material.', 'lesson.txt'));
    expect(out).toMatchObject({
      text: 'Hello lesson material.',
      kind: 'text',
      truncated: false,
      sourceFileName: 'lesson.txt',
    });
  });

  it('accepts markdown / csv / json by mime type', async () => {
    for (const type of ['text/markdown', 'text/csv', 'application/json']) {
      const out = await extractFileText(textFile('content', 'f', type));
      expect(out.kind).toBe('text');
      expect(out.text).toBe('content');
    }
  });

  it('accepts a file by extension even when the browser omits the type', async () => {
    // Some browsers report '' as the type for .md files.
    const out = await extractFileText(textFile('# Heading', 'reading.md', ''));
    expect(out.kind).toBe('text');
    expect(out.text).toBe('# Heading');
  });

  it('strips null bytes and trims surrounding whitespace', async () => {
    const out = await extractFileText(textFile('  \u0000clean\u0000 text  \n'));
    expect(out.text).toBe('clean text');
  });

  it('truncates content longer than MAX_CHARS and sets the flag', async () => {
    const long = 'x'.repeat(FILE_LIMITS.MAX_CHARS + 500);
    const out = await extractFileText(textFile(long));
    expect(out.truncated).toBe(true);
    expect(out.text).toHaveLength(FILE_LIMITS.MAX_CHARS);
  });

  it('does not flag content exactly at MAX_CHARS as truncated', async () => {
    const exact = 'y'.repeat(FILE_LIMITS.MAX_CHARS);
    const out = await extractFileText(textFile(exact));
    expect(out.truncated).toBe(false);
    expect(out.text).toHaveLength(FILE_LIMITS.MAX_CHARS);
  });

  it('falls back to "upload" when the file has no name', async () => {
    const out = await extractFileText(new File(['data'], '', { type: 'text/plain' }));
    expect(out.sourceFileName).toBe('upload');
  });
});

// The PDF branch itself still is not exercised here — it needs a real PDF
// byte stream and a pdfjs worker, which jsdom does not provide. These two
// assertions cover the parts that CAN go wrong silently without it, and both
// would have caught a real defect in the pdfjs 5 -> 6 migration (Phase 528).
describe('extractFileText — pdfjs integration surface', () => {
  it('uses the API the installed pdfjs actually exports', async () => {
    // A major bump that renamed or moved any of these would otherwise fail at
    // runtime, on a user uploading a PDF, with no test having objected.
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    expect(typeof pdfjs.getDocument).toBe('function');
    expect(pdfjs.GlobalWorkerOptions).toBeTruthy();
    expect(typeof pdfjs.version).toBe('string');
  });

  it('the hardcoded worker-version fallback matches the installed pdfjs', async () => {
    // extractPdfText points GlobalWorkerOptions.workerSrc at a CDN copy of
    // the worker pinned to `pdfjs.version || '<literal>'`. If that literal
    // drifts from the installed version, the fallback path pairs a library
    // with a mismatched worker — which is precisely what it exists to avoid.
    // It said 5.7.284 while pdfjs 6 was installed.
    // Resolved from process.cwd(), which is src/ for every path that runs
    // this suite (npm test, npm run verify, and the CI Vitest step all invoke
    // vitest from src/). import.meta.url is NOT usable here: under vitest's
    // jsdom environment it is an http: URL, so readFileSync rejects it
    // outright, and `new URL('./', ...).pathname` collapses to '/'.
    const root = process.cwd();
    const srcPath = resolve(root, 'utils/extractFileText.js');
    expect(existsSync(srcPath), `expected to run from src/, cwd is ${root}`).toBe(true);
    const src = readFileSync(srcPath, 'utf8');
    const literal = src.match(/pdfjs\.version \|\| '([^']+)'/)?.[1];
    expect(literal, 'could not find the fallback literal — update this test').toBeTruthy();

    const installed = JSON.parse(
      readFileSync(resolve(root, 'node_modules/pdfjs-dist/package.json'), 'utf8'),
    ).version;
    expect(literal).toBe(installed);
  });
});
