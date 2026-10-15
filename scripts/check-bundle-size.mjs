#!/usr/bin/env node
/**
 * INITIAL-BUNDLE GUARDRAIL.
 *
 * Fails if the eager-loaded entry chunk grows past 600 KB. Code-splitting
 * keeps it around 265 KB today; the limit leaves headroom while still
 * catching the regression that matters — a heavy dependency landing on the
 * path every visitor downloads before seeing anything.
 *
 * WHY THIS IS A FILE AND NOT FOUR LINES OF BASH.
 *
 * It was inline in .github/workflows/ci.yml, which meant the check existed
 * only on the runner: there was no way to run it locally, and nothing kept a
 * local equivalent in step with it. That is the same shape as the NUL guard
 * incident in Phase 524 — CI held a gate the developer could not run, main
 * went red for five commits, and every local run stayed green.
 *
 * Now `npm run verify` and the CI step invoke this same file, so "it passed
 * locally" and "it passed in CI" mean the same thing by construction rather
 * than by diligence.
 *
 * Path-independent on purpose: CI runs most steps with working-directory set
 * to src/, so the script resolves everything from its own location instead of
 * from the caller's cwd.
 */

import fs from 'node:fs';
import path from 'node:path';

const LIMIT_BYTES = 614_400; // 600 KB

const ROOT = path.resolve(import.meta.dirname, '..');
const ASSETS = path.join(ROOT, 'src', 'dist', 'assets');

function fail(msg) {
  // GitHub picks ::error:: up as an annotation on the run; harmless locally.
  if (process.env.GITHUB_ACTIONS) console.error(`::error::${msg}`);
  console.error(`\n  ${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(ASSETS)) {
  fail(
    `No build output at ${path.relative(ROOT, ASSETS)} — run the build before this check. ` +
    `Refusing to pass vacuously: a missing bundle is not a small bundle.`,
  );
}

const entries = fs.readdirSync(ASSETS).filter((f) => /^index-.*\.js$/.test(f));

if (entries.length === 0) {
  fail(`No index-*.js entry chunk in ${path.relative(ROOT, ASSETS)} — nothing to measure.`);
}
if (entries.length > 1) {
  // Two entry chunks means a stale build is still on disk, and `ls -l` in the
  // old bash version would have measured whichever sorted first.
  fail(
    `Found ${entries.length} index-*.js chunks (${entries.join(', ')}). ` +
    `Clear src/dist and rebuild so the measurement is unambiguous.`,
  );
}

const file = path.join(ASSETS, entries[0]);
const bytes = fs.statSync(file).size;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

if (bytes > LIMIT_BYTES) {
  fail(
    `Initial bundle ${entries[0]} is ${bytes} bytes (${kb(bytes)}), over the ` +
    `${LIMIT_BYTES}-byte (${kb(LIMIT_BYTES)}) limit. ` +
    `Code-split a route or drop an eager dependency.`,
  );
}

console.log(
  `✓ Initial bundle ${entries[0]} is ${bytes} bytes (${kb(bytes)}), ` +
  `under the ${kb(LIMIT_BYTES)} limit — ${kb(LIMIT_BYTES - bytes)} of headroom.`,
);
