// A public page may MENTION where an admin works. It must not offer a
// CLICKABLE LINK to a URL that renders a password form.
//
// index.js:320 mounts every /admin/* route under AdminLayout, and
// AdminLayout.js:347 returns a login card in place of its <Outlet /> when
// there is no session. So each of these was a dead end for a reader:
//
//   Executive.js  wrapped every institutional action row in
//                 <Link to="/admin/actions"> — and the row already shows the
//                 title, reduction, cost, owner and urgency, so the link
//                 promised MORE and delivered a password prompt.
//   Executive.js  listed "Actions (institutional)" -> /admin/actions in the
//                 footer nav of a public page.
//   Actions.js    linked "admin Actions view".
//   Unsubscribe.js linked /admin/alerts.
//
// Prose is left alone deliberately: Buildings, Faq, Hotspots, TrendBuilder and
// AnnualReport:294 name an admin path in a sentence aimed at an admin. That is
// informational, not a promise the reader can click and have broken. Phase 441
// drew the same line for /admin/methodology, where the fix was the opposite —
// the CONTENT belonged in public, so it moved.

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const PAGES_DIR = resolve(process.cwd(), 'pages');
const pages = readdirSync(PAGES_DIR).filter((f) => f.endsWith('.js'));
const read = (f) => readFileSync(resolve(PAGES_DIR, f), 'utf8');

// A link is a routed <Link to="/admin/..."> or an href to one — not a mention.
const LINK_PATTERNS = [
  /<Link[^>]*\bto=["'`]\/admin\//,
  /href=["'`]\/admin\//,
  /\bto:\s*["'`]\/admin\//,      // nav-link descriptor objects
  /navigate\(\s*["'`]\/admin\//,
];

describe('no public page links into the admin login wall', () => {
  it('found the pages to sweep', () => {
    expect(pages.length).toBeGreaterThan(30);
    expect(pages).toContain('Executive.js');
    expect(pages).toContain('Unsubscribe.js');
  });

  it('the detector distinguishes a LINK from a MENTION', () => {
    // Without this, a pattern that matches nothing reads as a clean sweep,
    // and a pattern that matches everything would force prose changes the
    // phase deliberately does not make.
    const hits = (s) => LINK_PATTERNS.some((re) => re.test(s));
    expect(hits('<Link to="/admin/actions" style={x}>')).toBe(true);
    expect(hits("{ to: '/admin/actions', label: 'Actions' }")).toBe(true);
    expect(hits('Map a PM device on /admin/bms-export for daily detail.')).toBe(false);
    expect(hits('captured in <em>/admin/audit-log</em> for accreditation')).toBe(false);
  });

  it.each(pages)('%s offers no clickable admin link', (f) => {
    const hits = read(f).split('\n')
      .map((l, i) => [i + 1, l])
      .filter(([, l]) => !l.trim().startsWith('//') && !l.trim().startsWith('*'))
      .filter(([, l]) => LINK_PATTERNS.some((re) => re.test(l)))
      .map(([n, l]) => `${f}:${n}: ${l.trim().slice(0, 110)}`);
    expect(hits).toEqual([]);
  });
});
