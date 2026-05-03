#!/usr/bin/env node
// Scan tracked source files for stray NUL bytes (0x00).
//
// We hit this once: a regex pattern intended as `` was emitted as
// the literal NUL code point during code generation. The file remained
// functionally correct but Git auto-classified it as binary, hiding the
// diffs of subsequent edits to that file. This guard catches the same
// failure mode at commit / CI time.
//
// Run via:  node scripts/check-no-nul-bytes.mjs
// Exit 0:   no NUL bytes found
// Exit 1:   one or more NUL bytes found (printed with file + offset)

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const SCANNED_EXTENSIONS = new Set([
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx',
  '.html', '.css', '.md',
  '.sql', '.json', '.yml', '.yaml',
]);

function listTrackedFiles() {
  const out = execSync('git ls-files', { encoding: 'utf8' });
  return out.split('\n').filter(Boolean);
}

function hasScannedExtension(path) {
  const dot = path.lastIndexOf('.');
  if (dot < 0) return false;
  return SCANNED_EXTENSIONS.has(path.slice(dot));
}

function findNulOffsets(buf) {
  const offsets = [];
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] === 0) offsets.push(i);
  }
  return offsets;
}

const files = listTrackedFiles().filter(hasScannedExtension);
let bad = 0;
for (const f of files) {
  let buf;
  try { buf = readFileSync(f); } catch { continue; }
  const nuls = findNulOffsets(buf);
  if (nuls.length === 0) continue;
  bad++;
  console.error(`✗ ${f} contains ${nuls.length} NUL byte${nuls.length === 1 ? '' : 's'}`);
  for (const off of nuls.slice(0, 5)) {
    // Locate the 1-based line/col for friendly reporting.
    let line = 1, col = 1;
    for (let i = 0; i < off; i++) {
      if (buf[i] === 0x0a) { line++; col = 1; } else { col++; }
    }
    console.error(`    at byte ${off} (line ${line}, col ${col})`);
  }
  if (nuls.length > 5) console.error(`    … and ${nuls.length - 5} more`);
}

if (bad === 0) {
  console.log(`✓ No NUL bytes found across ${files.length} source files.`);
  process.exit(0);
}
console.error(`\n${bad} file${bad === 1 ? '' : 's'} contain NUL bytes. Replace literal NULs with the \\u0000 escape.`);
process.exit(1);
