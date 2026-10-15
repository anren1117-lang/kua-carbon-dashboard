// A waitFor budget must be STRICTLY LESS than the test budget that contains it.
//
// Equal is a flake waiting for a loaded machine, and that is not a hypothetical:
// pageLiveErrorSurfaced.test.js gave a wait `{ timeout: 5000 }` while
// vite.config.js declares no `test` block, so Vitest's default testTimeout of
// 5000ms applied. The wait was allowed exactly as long as the whole test,
// leaving nothing for mounting five pages of chart components. Under full-suite
// parallel load the test hit Vitest's limit and died before waitFor could even
// report which element it never found — so the failure arrived as an unhelpful
// timeout, only ever in full runs, and passed 6/6 in isolation. Four more full
// runs never reproduced it. READING the arithmetic found it; re-running could
// not have.
//
// The other half of the same bug is a fix applied to one site and not its
// sibling: that file had two waits and the original fix reached only one,
// leaving the 1000ms default on the test that mounts the MOST components.
//
// HONEST LIMITATION, so nobody trusts this further than it goes. The check is
// FILE-level, not per-test: it compares each wait budget against the largest
// per-test budget declared anywhere in the same file, falling back to the
// governing default. A file that declares a generous budget on test A and a
// long wait inside un-budgeted test B would pass. Pairing each wait with its
// own enclosing `it` needs a parser, and a guard with a fragile matcher is a
// guard that cries wolf and trains you to skim it. File granularity is what a
// regex can defend, and it is enough to catch the defect that actually shipped.

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.resolve(new URL('.', import.meta.url).pathname);
const CONFIG = path.join(HERE, '..', 'vite.config.js');

// Vitest's documented default. Only used when the config declares nothing —
// which is the case that bit us, so it is the case that must be right.
const VITEST_DEFAULT_TEST_TIMEOUT = 5000;

function governingDefault() {
  const src = fs.readFileSync(CONFIG, 'utf8');
  const m = /testTimeout:\s*(\d+)/.exec(stripComments(src));
  return m ? Number(m[1]) : VITEST_DEFAULT_TEST_TIMEOUT;
}

// Comments mention budgets in prose — this file's own header says
// "{ timeout: 5000 }" — and a guard that reads its own documentation as code
// reports itself. Strip line comments before scanning.
const stripComments = (src) => src.split('\n')
  .map((l) => l.replace(/\/\/.*$/, ''))
  .join('\n');

const numbersOf = (src, re) => {
  const out = [];
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(src)) !== null) out.push(Number(m[1]));
  return out;
};

const WAIT_BUDGET = /timeout:\s*(\d+)/g;
const TEST_BUDGET = /\}\s*,\s*(\d{3,})\s*\)\s*;/g;

export function budgetViolationsIn(relPath, root = HERE, fallback = null) {
  const src = stripComments(fs.readFileSync(path.join(root, relPath), 'utf8'));
  const waits = numbersOf(src, WAIT_BUDGET);
  if (waits.length === 0) return [];
  const perTest = numbersOf(src, TEST_BUDGET);
  const ceiling = perTest.length ? Math.max(...perTest) : (fallback ?? governingDefault());
  return waits
    .filter((w) => w >= ceiling)
    .map((w) => `${relPath} — waitFor budget ${w}ms is not under the test budget ${ceiling}ms`);
}

const TEST_FILES = fs.readdirSync(HERE).filter((f) => f.endsWith('.test.js'));

describe('async wait budgets fit inside their test budgets', () => {
  it('found the test files at all — a zero-length sweep proves nothing', () => {
    expect(TEST_FILES.length).toBeGreaterThan(50);
    expect(TEST_FILES).toContain('pageLiveErrorSurfaced.test.js');
  });

  it.each(TEST_FILES)('%s keeps every wait under its test budget', (f) => {
    expect(budgetViolationsIn(f)).toEqual([]);
  });

  it('actually fires on the arithmetic that shipped', () => {
    // The real pre-fix shape: a 5000ms wait in a file declaring no per-test
    // budget, against the 5000ms default. Equal, so it must be caught.
    const tmp = path.join(HERE, '.budget-probe.test.js');
    fs.writeFileSync(
      tmp,
      'it("x", async () => { await waitFor(() => {}, { timeout: 5000 }); });\n',
      'utf8',
    );
    try {
      expect(budgetViolationsIn('.budget-probe.test.js')).toHaveLength(1);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('spares a wait that has real headroom', () => {
    const tmp = path.join(HERE, '.budget-ok.test.js');
    fs.writeFileSync(
      tmp,
      'it("x", async () => { await waitFor(() => {}, { timeout: 5000 }); }, 20000);\n',
      'utf8',
    );
    try {
      expect(budgetViolationsIn('.budget-ok.test.js')).toEqual([]);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('reads an explicit testTimeout from the config when there is one', () => {
    // Guards the fallback itself: if someone adds `testTimeout` to
    // vite.config.js, the ceiling must follow it rather than staying at 5000.
    const tmp = path.join(HERE, '.budget-cfg.test.js');
    fs.writeFileSync(tmp, 'await waitFor(() => {}, { timeout: 8000 });\n', 'utf8');
    try {
      expect(budgetViolationsIn('.budget-cfg.test.js', HERE, 10000)).toEqual([]);
      expect(budgetViolationsIn('.budget-cfg.test.js', HERE, 8000)).toHaveLength(1);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('the governing default matches Vitest’s, since the config sets none', () => {
    const src = stripComments(fs.readFileSync(CONFIG, 'utf8'));
    expect(/testTimeout:/.test(src)).toBe(false);
    expect(governingDefault()).toBe(VITEST_DEFAULT_TEST_TIMEOUT);
  });
});
