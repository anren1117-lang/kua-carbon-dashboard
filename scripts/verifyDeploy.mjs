#!/usr/bin/env node
// Prove a deploy actually went live, without a browser or the Vercel CLI.
//
//   node scripts/verifyDeploy.mjs --present "new string" --absent "retired string"
//   node scripts/verifyDeploy.mjs --present A --present B --absent C --attempts 24
//
// `git push` succeeding proves GitHub received the commit, nothing more. This
// fetches what production actually serves and greps it.
//
// WHY THIS IS A SCRIPT AND NOT A HABIT. Every rule below was learned by
// getting it wrong, and the two that cost the most were rediscovered after
// being written down — a checklist you have to remember is a checklist you
// skip at 2am. Encoded here they cannot be skipped:
//
//  1. A 200 PROVES NOTHING. The SPA catch-all rewrite returns index.html for
//     every /assets/*.js path, including files that do not exist. Responses
//     whose first bytes look like HTML are discarded before any grep.
//
//  2. THE SHELL IS NOT THE APP. index.html names only the entry and vendor
//     chunks — 3 of ~240 files here. Every lazy route lives in a chunk the
//     shell never mentions, but Vite emits those paths as string literals
//     inside the entry bundle, so they are discovered from there.
//
//  3. A MISSING LOCAL MARKER IS A HARD STOP, not a warning. A --present
//     marker that does not exist in the local build cannot match anywhere,
//     and polling for it burns minutes proving nothing. Twice in one session
//     the miss was printed and the poll was started anyway — once for 24
//     attempts, once for 18 — because the check was advice rather than a
//     gate. It now exits non-zero before the first fetch.
//
//  4. CHECK PRESENT AND ABSENT. A new marker can already exist in the old
//     build (a prefix of the retired string, a data row that always shipped),
//     so presence alone can pass against a stale deploy. The retired string
//     going to zero in the same fetched bytes is what makes it conclusive —
//     and for a change that only swaps a literal for an interpolation,
//     absence is often the ONLY half that works.
//
//  5. FILENAME HASHES ARE NOT EVIDENCE. Vercel builds independently, so
//     content hashes legitimately differ from the local build. Compare
//     content; never compare chunk names.

import fs from 'node:fs';
import path from 'node:path';

const PROD = process.env.VERIFY_URL || 'https://kua-carbon-dashboard.vercel.app';
const DIST = path.resolve(process.cwd(), 'src/dist/assets');

function parseArgs(argv) {
  const present = [];
  const absent = [];
  let attempts = 24;
  let waitMs = 20000;
  for (let i = 0; i < argv.length; i++) {
    const next = () => argv[++i];
    if (argv[i] === '--present') present.push(next());
    else if (argv[i] === '--absent') absent.push(next());
    else if (argv[i] === '--attempts') attempts = Number(next());
    else if (argv[i] === '--wait') waitMs = Number(next()) * 1000;
  }
  return { present, absent, attempts, waitMs };
}

const looksLikeShell = (text) => /^\s*(<!doctype|<html)/i.test(text.slice(0, 200));

/** Rule 3: every --present marker must exist in the local build first. */
export function checkLocalMarkers(present, readDir = DIST) {
  if (!fs.existsSync(readDir)) {
    return { ok: false, reason: `no local build at ${readDir} — run npm run build first`, missing: [] };
  }
  const files = fs.readdirSync(readDir).filter((f) => f.endsWith('.js'));
  const blob = files.map((f) => fs.readFileSync(path.join(readDir, f), 'utf8')).join('\n');
  const missing = present.filter((m) => !blob.includes(m));
  return { ok: missing.length === 0, missing, scanned: files.length };
}

async function fetchText(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  const text = await res.text();
  return looksLikeShell(text) ? null : text;   // rule 1
}

async function fetchDeployedJs() {
  const indexHtml = await fetch(`${PROD}/?cb=${Math.random()}`).then((r) => r.text());
  const entry = (indexHtml.match(/\/assets\/index-[A-Za-z0-9._-]+\.js/) || [])[0];
  if (!entry) return null;
  const entryJs = await fetchText(`${PROD}${entry}`);
  if (!entryJs) return null;
  // rule 2: lazy chunk paths are string literals inside the entry bundle
  const chunks = [...new Set((entryJs.match(/\/?assets\/[A-Za-z0-9._-]+\.js/g) || [])
    .map((p) => (p.startsWith('/') ? p : `/${p}`)))];
  const bodies = await Promise.all(
    [...new Set([entry, ...chunks])].map((c) => fetchText(`${PROD}${c}`).catch(() => null)),
  );
  const kept = bodies.filter(Boolean);
  return { entry, fetched: kept.length, blob: kept.join('\n') };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const { present, absent, attempts, waitMs } = parseArgs(process.argv.slice(2));
  if (present.length === 0 && absent.length === 0) {
    console.error('Usage: verifyDeploy.mjs --present "..." [--absent "..."]');
    process.exit(2);
  }

  const local = checkLocalMarkers(present);
  if (!local.ok) {
    console.error('LOCAL MISS — refusing to poll production.');
    if (local.reason) console.error(`  ${local.reason}`);
    local.missing.forEach((m) => console.error(`  not in the local build: ${JSON.stringify(m)}`));
    console.error('  A marker absent from your own build cannot match in production.');
    console.error('  Pick a string the build actually contains, or check it is not split by a template literal.');
    process.exit(1);
  }
  console.log(`local build: all ${present.length} present-marker(s) found across ${local.scanned} chunks`);

  for (let i = 1; i <= attempts; i++) {
    const got = await fetchDeployedJs();
    if (!got) { console.log(`attempt ${i}: production served the shell or no entry bundle`); await sleep(waitMs); continue; }
    const hits = present.map((m) => [m, got.blob.includes(m)]);
    const stale = absent.map((m) => [m, got.blob.includes(m)]);
    const allPresent = hits.every(([, v]) => v);
    const noneStale = stale.every(([, v]) => !v);
    console.log(`attempt ${i}: entry=${got.entry} fetched=${got.fetched} `
      + `present=${hits.filter(([, v]) => v).length}/${present.length} `
      + `stale=${stale.filter(([, v]) => v).length}/${absent.length}`);
    if (allPresent && noneStale) {                       // rule 4
      console.log(`\n=== CONFIRMED LIVE (${got.fetched} assets checked) ===`);
      process.exit(0);
    }
    await sleep(waitMs);
  }
  console.error(`\n=== NOT CONFIRMED after ${attempts} attempts — pushed but unverified ===`);
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
