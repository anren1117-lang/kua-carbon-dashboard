// Real-browser verification of the KUA Carbon Dashboard against the
// PRODUCTION build, driven by an isolated Chromium.
//
// Covers navigation, client-side routing, PDF upload + extraction,
// PowerPoint export, and KaTeX math rendering — the paths vitest cannot
// reach, because pdfjs needs a worker and pptxgenjs needs a real download.
//
// HOW TO RUN (not part of `npm run verify`: it needs a running server and a
// browser, so it would make the pre-push gate slow and network-dependent):
//
//   cd src && npm run build && npx vite preview --port 5177 --strictPort &
//   npm i -D playwright            # or run from a scratch dir
//   node scripts/browser/verify-browser.mjs
//
// Uses `channel: 'chrome'` — the system Google Chrome — rather than
// Playwright's bundled build, so it needs no browser download.
//
// It last ran 18/18 green against the production build, and it is the only
// thing that has ever exercised utils/pptGenerator.js end to end.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const BASE = 'http://localhost:5177';
const results = [];
const pass = (name, detail = '') => results.push({ ok: true, name, detail });
const fail = (name, detail = '') => results.push({ ok: false, name, detail });

// ---------------------------------------------------------------------------
// A minimal, valid single-page PDF with real text, with a correct xref table
// so pdfjs parses it without falling back to recovery.
function makePdf(text) {
  const objs = [
    '<</Type/Catalog/Pages 2 0 R>>',
    '<</Type/Pages/Kids[3 0 R]/Count 1>>',
    '<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 200]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>',
    null, // content stream, built below
    '<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>',
  ];
  const stream = `BT /F1 18 Tf 20 100 Td (${text}) Tj ET`;
  objs[3] = `<</Length ${stream.length}>>stream\n${stream}\nendstream`;

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}

const PDF_TEXT = 'Carbon audit sample page';
const pdfPath = '/tmp/kua-sample.pdf';
writeFileSync(pdfPath, makePdf(PDF_TEXT));

// ---------------------------------------------------------------------------
// Use the system Google Chrome rather than Playwright's bundled build: the
// local ms-playwright cache holds chromium-1223 while playwright@latest wants
// 1248, and downloading a browser is not worth it when Chrome is installed.
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ acceptDownloads: true });
const page = await ctx.newPage();

const pageErrors = [];
const consoleErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200));
});

// The teacher gate compares against VITE_TEACHER_PASSWORD or the in-source
// default "kua-teach" (pages/AP*Content.js:33). It is a deliberate speed bump,
// not a secret — it ships in the bundle — so using it here is legitimate.
const TEACHER_PW = 'kua-teach';
async function unlockTeacherGate() {
  const pwInput = page.locator('input[type=password]').first();
  if (!(await pwInput.count())) return true; // already unlocked
  await pwInput.fill(TEACHER_PW);
  const unlock = page.locator('button', { hasText: /unlock|sign in|continue/i }).first();
  if (await unlock.count()) await unlock.click();
  else await pwInput.press('Enter');
  await page.waitForTimeout(900);
  return (await page.locator('input[type=password]').count()) === 0;
}

async function visit(path) {
  const before = pageErrors.length;
  const resp = await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForTimeout(500);
  const status = resp?.status();
  const bodyLen = (await page.locator('body').innerText().catch(() => '')).trim().length;
  const newErrors = pageErrors.slice(before);
  return { status, bodyLen, newErrors };
}

// ---- 1. NAVIGATION -------------------------------------------------------
const routes = [
  '/', '/executive', '/carbon-math', '/faq', '/methodology',
  '/scope-1', '/scope-2', '/scope-3', '/goals', '/buildings',
  '/teacher', '/teacher/ap/apchem', '/teacher/ap/apphys2', '/teacher/create',
];
for (const r of routes) {
  try {
    const { status, bodyLen, newErrors } = await visit(r);
    if (status !== 200) fail(`nav ${r}`, `HTTP ${status}`);
    else if (bodyLen < 50) fail(`nav ${r}`, `rendered only ${bodyLen} chars of text`);
    else if (newErrors.length) fail(`nav ${r}`, `pageerror: ${newErrors[0].slice(0, 140)}`);
    else pass(`nav ${r}`, `${bodyLen} chars`);
  } catch (e) {
    fail(`nav ${r}`, String(e.message).slice(0, 140));
  }
}

// ---- 2. CLIENT-SIDE ROUTING (not just direct loads) ----------------------
try {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const link = page.locator('a[href="/methodology"]').first();
  if (await link.count()) {
    await link.click();
    await page.waitForURL('**/methodology', { timeout: 15_000 });
    pass('spa routing', 'clicked a link and the URL + view changed without reload');
  } else {
    fail('spa routing', 'no /methodology link found on the homepage to click');
  }
} catch (e) {
  fail('spa routing', String(e.message).slice(0, 140));
}

// ---- 3. MATH RENDERING (KaTeX) -------------------------------------------
// ONLY pages that actually contain LaTeX.
//
// This list first included /teacher/ap/apphys2 and /carbon-math and reported
// two failures. Neither was a defect: apphys2-unit-1.js contains zero '$'
// delimiters (unit 1 is fluids, written in prose), and pages/CarbonMath.js
// does not import MathText at all — its arithmetic is plain text. A check
// that demands math where the content has none measures the test, not the app.
for (const r of ['/teacher/ap/apchem']) {
  try {
    await visit(r);
    await unlockTeacherGate();
    await page.waitForTimeout(600);
    const katex = await page.locator('.katex').count();
    // A KaTeX failure renders .katex-error with the raw source instead.
    const katexErrors = await page.locator('.katex-error').count();
    if (katex === 0) fail(`math ${r}`, 'no .katex elements rendered');
    else if (katexErrors > 0) fail(`math ${r}`, `${katexErrors} .katex-error nodes`);
    else {
      // Assert it produced real typeset output, not an empty shell.
      const html = await page.locator('.katex').first().innerHTML();
      const hasMathml = html.includes('katex-mathml') || html.includes('katex-html');
      hasMathml
        ? pass(`math ${r}`, `${katex} formulas, 0 errors`)
        : fail(`math ${r}`, 'katex node has no katex-html/mathml child');
    }
  } catch (e) {
    fail(`math ${r}`, String(e.message).slice(0, 140));
  }
}

// ---- 4. PDF UPLOAD + EXTRACTION -----------------------------------------
try {
  await visit('/teacher/create');
  await unlockTeacherGate();
  await page.waitForTimeout(600);
  const input = page.locator('input[type="file"]').first();
  if (!(await input.count())) {
    fail('pdf upload', 'no file input on /teacher/create');
  } else {
    await input.setInputFiles(pdfPath);
    // The extractor is async (dynamic import of pdfjs + worker fetch).
    // ASSERT ON THE TEXTAREA VALUE, not body.innerText.
    //
    // The first version of this check waited for document.body.innerText to
    // contain the extracted string and reported a FAILURE. The upload was
    // working the whole time: extractFileText writes into the "Paste source
    // material" textarea, and a textarea's value is not part of innerText.
    // The assertion was pointed at the wrong surface, which is the same
    // mistake as asserting on textContent for an SVG chart.
    const found = await page
      .waitForFunction(
        (needle) => Array.from(document.querySelectorAll('textarea'))
          .some((t) => t.value.includes(needle)),
        PDF_TEXT,
        { timeout: 60_000 },
      )
      .then(() => true)
      .catch(() => false);
    if (found) pass('pdf upload', `extracted "${PDF_TEXT}" from a real PDF`);
    else {
      const body = (await page.locator('body').innerText()).slice(0, 300).replace(/\s+/g, ' ');
      fail('pdf upload', `text not found after upload. Page said: ${body}`);
    }
  }
} catch (e) {
  fail('pdf upload', String(e.message).slice(0, 200));
}

// ---- 5. POWERPOINT EXPORT ------------------------------------------------
try {
  await visit('/teacher/ap/apphys2');
  await unlockTeacherGate();
  await page.waitForTimeout(600);
  const btn = page
    .locator('button', { hasText: /ppt|powerpoint|deck|slides/i })
    .first();
  if (!(await btn.count())) {
    fail('pptx export', 'no PPT/deck button found on /teacher/ap/apphys2');
  } else {
    const label = (await btn.innerText()).replace(/\s+/g, ' ').slice(0, 40);
    const dl = page.waitForEvent('download', { timeout: 90_000 }).catch(() => null);
    await btn.click();
    const download = await dl;
    if (!download) {
      const err = await page.locator('body').innerText();
      const m = err.match(/PPT[^\n]{0,80}/i);
      fail('pptx export', `no download fired from "${label}". ${m ? m[0] : ''}`);
    } else {
      const p = '/tmp/kua-export.pptx';
      await download.saveAs(p);
      const { statSync, readFileSync } = await import('node:fs');
      const size = statSync(p).size;
      // .pptx is a zip: must start with PK
      const magic = readFileSync(p).subarray(0, 2).toString('latin1');
      magic === 'PK' && size > 5000
        ? pass('pptx export', `"${label}" → ${download.suggestedFilename()}, ${size} bytes, valid zip`)
        : fail('pptx export', `file looks wrong: ${size} bytes, magic "${magic}"`);
    }
  }
} catch (e) {
  fail('pptx export', String(e.message).slice(0, 200));
}

await browser.close();

// ---------------------------------------------------------------------------
console.log('\n================ BROWSER VERIFICATION ================');
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  — ' + r.detail : ''}`);
}
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (consoleErrors.length) {
  console.log(`\nconsole errors seen (${consoleErrors.length}), first 6:`);
  [...new Set(consoleErrors)].slice(0, 6).forEach((e) => console.log('  - ' + e));
}
process.exit(failed.length ? 1 : 0);
