// Every npm package a serverless function imports must be declared in the
// ROOT package.json — the one Vercel's functions resolve from.
//
// WHY. On 2026-11-11 every route importing api/_lib/supabaseAdmin.js
// returned FUNCTION_INVOCATION_FAILED: /api/health, /api/admin/records,
// audit-log, both bms_* routes. That module statically imports
// @supabase/supabase-js, which lived only in src/package.json. vercel.json
// installed src/ alone, and Node resolving from api/_lib/ walks up to the
// repo root's node_modules, never into src/node_modules.
//
// The suite stayed green because this machine still had a stale root
// node_modules from the Create-React-App era, so the import resolved
// locally. That is why this test reads DECLARATIONS rather than trying an
// import: what happens to be installed here is not what Vercel installs.
//
// The same gap was silent elsewhere: storage/supabaseServer.js imports the
// package dynamically inside a try/catch, so in production alerts, teacher
// lessons and quiz attempts fell back to in-memory storage with no error.

import { describe, it, expect } from 'vitest';
import { buildSync } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), '..');
const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const srcLock = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/package-lock.json'), 'utf8'));
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));

const walk = (d) => fs.readdirSync(d, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const entries = walk(path.join(ROOT, 'api')).filter((f) => f.endsWith('.js'));

/** Bare package names an entry point needs at runtime, transitively. */
function externalPackages(files) {
  const { metafile } = buildSync({
    entryPoints: files, bundle: true, platform: 'node', format: 'esm',
    packages: 'external', write: false, metafile: true, outdir: '/tmp/unused', logLevel: 'silent',
  });
  const names = new Set();
  for (const out of Object.values(metafile.outputs)) {
    for (const imp of out.imports || []) {
      if (!imp.external || imp.path.startsWith('node:')) continue;
      const p = imp.path;
      names.add(p.startsWith('@') ? p.split('/').slice(0, 2).join('/') : p.split('/')[0]);
    }
  }
  return [...names].sort();
}

const needed = externalPackages(entries);
const declared = rootPkg.dependencies || {};

describe('serverless function dependencies', () => {
  it('finds the functions and their imports at all', () => {
    expect(entries.length).toBeGreaterThan(20);
    expect(needed).toContain('@supabase/supabase-js');
  });

  it('every package an api/ function imports is declared in the root package.json', () => {
    const missing = needed.filter((n) => !(n in declared));
    expect(missing, `api/ imports these but root package.json does not declare them, ` +
      `so they will not exist on Vercel:\n  ${missing.join('\n  ')}`).toEqual([]);
  });

  it('root pins each shared package to the version src/ locks, so browser and server agree', () => {
    for (const [name, version] of Object.entries(declared)) {
      const src = srcLock.packages[`node_modules/${name}`]?.version;
      expect(version, name).toBe(src);
    }
  });

  it('Vercel installs the root as well as src/', () => {
    expect(vercel.installCommand).toMatch(/^npm ci && cd src && /);
    expect(fs.existsSync(path.join(ROOT, 'package-lock.json'))).toBe(true);
  });
});
