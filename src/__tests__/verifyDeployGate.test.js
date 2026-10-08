// The deploy-verification rules, as code rather than as a habit.
//
// Every rule in scripts/verifyDeploy.mjs was learned by getting it wrong. Two
// of them were rediscovered AFTER being written down, which is the whole
// argument for the script: a checklist you have to remember is one you skip.
//
// The rule this test exists for is the one that kept failing — a --present
// marker that does not exist in the local build cannot match in production,
// so polling for it is guaranteed waste. In a single session that happened
// twice, 24 attempts and then 18, both times with the miss printed on screen
// and ignored, because the check was advice and not a gate.
//
// Both misses had the same cause and it is worth naming: the marker was a
// sentence split by a JSX interpolation. `{n} tables missing` and
// `${TOTAL_STUDENTS} students, Plainfield NH` never exist as literals in the
// bundle, however obviously they appear in the source. checkLocalMarkers
// catches exactly that class, because it reads the built chunks and not the
// source.

import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { checkLocalMarkers } from '../../scripts/verifyDeploy.mjs';

function fakeBuild(contents) {
  const dir = mkdtempSync(join(tmpdir(), 'vdg-'));
  const assets = join(dir, 'assets');
  mkdirSync(assets);
  contents.forEach((c, i) => writeFileSync(join(assets, `chunk-${i}.js`), c));
  return assets;
}

describe('the local-marker gate', () => {
  it('passes when every marker is in the build', () => {
    const dir = fakeBuild(['const a="Dorms ranked";', 'const b="not all of it";']);
    const r = checkLocalMarkers(['Dorms ranked', 'not all of it'], dir);
    expect(r.ok).toBe(true);
    expect(r.missing).toEqual([]);
    expect(r.scanned).toBe(2);
    rmSync(dir, { recursive: true, force: true });
  });

  it('fails, and names the marker, when one is absent', () => {
    const dir = fakeBuild(['const a="Dorms ranked";']);
    const r = checkLocalMarkers(['Dorms ranked', 'zzz-never-built'], dir);
    expect(r.ok).toBe(false);
    expect(r.missing).toEqual(['zzz-never-built']);
    rmSync(dir, { recursive: true, force: true });
  });

  it('catches the real failure mode: a string split by interpolation', () => {
    // what the bundle holds after `{n} tables missing from the database`
    const dir = fakeBuild(['x," missing from the database",y']);
    expect(checkLocalMarkers(['tables missing from the database'], dir).ok).toBe(false);
    // the substring that survives minification does match
    expect(checkLocalMarkers([' missing from the database'], dir).ok).toBe(true);
    rmSync(dir, { recursive: true, force: true });
  });

  it('refuses when there is no build at all, rather than passing vacuously', () => {
    const r = checkLocalMarkers(['anything'], join(tmpdir(), 'vdg-does-not-exist'));
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/no local build/);
  });

  it('an empty marker list is not a pass to celebrate', () => {
    const dir = fakeBuild(['const a=1;']);
    // vacuously ok, but the CLI requires at least one marker before running
    expect(checkLocalMarkers([], dir).ok).toBe(true);
    const cli = readFileSync(resolve(process.cwd(), '..', 'scripts', 'verifyDeploy.mjs'), 'utf8');
    expect(cli).toMatch(/present\.length === 0 && absent\.length === 0/);
    rmSync(dir, { recursive: true, force: true });
  });

  it('the script encodes the traps it was written for', () => {
    const cli = readFileSync(resolve(process.cwd(), '..', 'scripts', 'verifyDeploy.mjs'), 'utf8');
    expect(cli).toMatch(/looksLikeShell/);          // a 200 proves nothing
    expect(cli).toMatch(/lazy chunk paths are string literals/i);
    expect(cli).toMatch(/process\.exit\(1\)/);      // local miss is a hard stop
    expect(cli).toMatch(/allPresent && noneStale/); // present AND absent
  });
});
