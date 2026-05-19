import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon.js';
import { toast } from './Toast.js';

// Cmd+K / Ctrl+K command palette. Spotlight-style overlay that
// indexes every public + admin route, surfaces them via fuzzy
// search, supports arrow-key + enter to jump. The hallmark of a
// professional dashboard (Linear, Notion, Raycast, Vercel, Stripe).
//
// Keyboard:
//   Cmd+K / Ctrl+K     — toggle open
//   Escape             — close
//   ArrowDown/Up       — cycle through results
//   Enter              — jump to highlighted result
//
// Mounted once at the Layout level so every page can summon it.

// Action items run a function instead of navigating. Mixed in with
// the nav items so a user typing "print" gets the action right
// alongside any matching pages.
const ACTIONS = [
  {
    key: 'print',
    title: 'Print this page',
    group: 'Actions',
    icon: Icon.Download,
    hint: 'Save as PDF or print the current page',
    run: () => window.print(),
  },
  {
    key: 'github-issue',
    title: 'Suggest a feature',
    group: 'Actions',
    icon: Icon.HelpCircle,
    hint: 'Open the GitHub issue tracker in a new tab',
    run: () => window.open('https://github.com/anren1117-lang/kua-carbon-dashboard/issues/new', '_blank', 'noopener,noreferrer'),
  },
  {
    key: 'github-source',
    title: 'View source code on GitHub',
    group: 'Actions',
    icon: Icon.Share,
    hint: 'Open the public repo',
    run: () => window.open('https://github.com/anren1117-lang/kua-carbon-dashboard', '_blank', 'noopener,noreferrer'),
  },
  {
    key: 'copy-link',
    title: 'Copy current page URL',
    group: 'Actions',
    icon: Icon.Share,
    hint: 'Share this exact view with someone',
    run: () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        toast('Page URL copied', { kind: 'good' });
      }
    },
  },
  {
    key: 'scroll-top',
    title: 'Scroll to top',
    group: 'Actions',
    icon: Icon.ArrowLeft,
    hint: 'Jump to the top of the current page',
    run: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  },
];

const ITEMS = [
  // Most-used public surfaces first
  { path: '/',                 title: 'Overview',                  group: 'Public',    icon: Icon.Chart,       hint: 'Homepage — net carbon balance' },
  { path: '/executive',        title: 'Executive Dashboard',      group: 'Public',    icon: Icon.Chart,       hint: 'Board-level summary' },
  { path: '/your-footprint',   title: 'Your footprint',           group: 'Tools',     icon: Icon.Leaf,        hint: 'Personal carbon calculator' },
  { path: '/dorm-leaderboard', title: 'Dorm leaderboard',         group: 'Tools',     icon: Icon.Trophy,      hint: 'Annualized kWh/resident ranking' },
  { path: '/challenge',        title: 'Dorm challenge',           group: 'Tools',     icon: Icon.Bolt,        hint: 'Monthly competition' },
  { path: '/scenarios',        title: 'Reduction simulator',      group: 'Tools',     icon: Icon.Sparkles,    hint: 'Interactive what-if sliders' },
  { path: '/carbon-math',      title: 'Carbon math practice',     group: 'Tools',     icon: Icon.Chart,       hint: 'Classroom worksheet' },
  { path: '/faq',              title: 'FAQ',                       group: 'Tools',     icon: Icon.HelpCircle,  hint: 'Common questions' },
  { path: '/digest',           title: 'Monthly digest',           group: 'Insights',  icon: Icon.Sparkles,    hint: 'This month\'s highlights' },
  { path: '/compare',          title: 'Compare two months',       group: 'Insights',  icon: Icon.Chart,       hint: 'Month-vs-month delta' },
  { path: '/compare-buildings',title: 'Compare two buildings',    group: 'Insights',  icon: Icon.Chart,       hint: 'Building-vs-building delta' },
  { path: '/dorm-posters',     title: 'Dorm QR posters',          group: 'Tools',     icon: Icon.Share,       hint: 'Printable QR codes per dorm' },
  { path: '/share',            title: 'Share via QR',             group: 'Tools',     icon: Icon.Share,       hint: 'QR code generator' },
  { path: '/news',             title: 'News',                      group: 'Public',    icon: Icon.Leaf,        hint: 'Environmental headlines' },
  { path: '/buildings',        title: 'Buildings',                 group: 'Public',    icon: Icon.Map,         hint: 'Per-building energy + intensity' },
  { path: '/campus-map',       title: 'Campus map',                group: 'Public',    icon: Icon.Map,         hint: '4 modes: schematic/geographic/photo/satellite' },
  { path: '/plan',             title: 'Plan',                      group: 'Public',    icon: Icon.Bolt,        hint: 'Goals + reduction actions' },
  { path: '/goals',            title: 'Goals & targets',           group: 'Public',    icon: Icon.Chart,       hint: 'SBTi-aligned targets + progress' },
  { path: '/methodology',      title: 'Methodology',               group: 'Public',    icon: Icon.HelpCircle,  hint: 'Every emission factor cited' },
  { path: '/report',           title: 'Annual report',             group: 'Public',    icon: Icon.Download,    hint: 'Printable trustee-facing summary' },
  { path: '/scope-1',          title: 'Scope 1',                   group: 'Public',    icon: Icon.Chart,       hint: 'Direct combustion (heating fuel)' },
  { path: '/scope-2',          title: 'Scope 2',                   group: 'Public',    icon: Icon.Chart,       hint: 'Purchased electricity' },
  { path: '/scope-3',          title: 'Scope 3',                   group: 'Public',    icon: Icon.Chart,       hint: 'Indirect (travel, food, supply chain)' },
  { path: '/sinks-os',         title: 'Sinks',                     group: 'Public',    icon: Icon.Leaf,        hint: 'On-campus forest sequestration' },
  { path: '/hotspots',         title: 'Hotspots',                  group: 'Public',    icon: Icon.Bolt,        hint: 'Where emissions concentrate' },
  { path: '/learn',            title: 'Learn',                     group: 'Portals',   icon: Icon.Sparkles,    hint: 'AI-guided learning paths' },
  { path: '/teacher',          title: 'Teacher portal',            group: 'Portals',   icon: Icon.HelpCircle,  hint: 'Assign lessons + see results' },
  { path: '/ask',              title: 'Ask',                       group: 'Portals',   icon: Icon.HelpCircle,  hint: 'Chat with the carbon tutor' },
  { path: '/admin',            title: 'Admin portal',              group: 'Portals',   icon: Icon.Refresh,     hint: 'Staff-only data entry + management' },
  { path: '/admin/ai-ingestion', title: 'Drop documents (admin)', group: 'Admin',     icon: Icon.Download,    hint: 'AI-assisted invoice / PDF / receipt ingestion' },
];

// Fuzzy match: returns a score (higher = better) or 0 for no match.
// Prioritizes title prefix > word-boundary match > scattered chars.
function fuzzyScore(query, item) {
  const q = query.toLowerCase().trim();
  if (!q) return 1; // empty query = everything matches at base score
  const t = item.title.toLowerCase();
  const h = (item.hint || '').toLowerCase();
  const p = item.path.toLowerCase();

  if (t.startsWith(q)) return 100;
  if (t.includes(q)) return 50;
  // Word-boundary match in hint
  if (h.includes(q)) return 25;
  if (p.includes(q)) return 20;
  // Scattered-char fuzzy: every char of query in title in order
  let qi = 0;
  for (const c of t) {
    if (c === q[qi]) qi++;
    if (qi === q.length) return 10;
  }
  return 0;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  // Global Cmd+K / Ctrl+K hotkey
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Focus the input when opening; clear query when closing
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      // Wait a frame so the modal is mounted
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    // Merge nav items + action items into the same searchable list,
    // ranked by fuzzy score. Actions and nav items have the same
    // visual treatment in the results list; only their `run` vs
    // `path` distinguishes them at activation time.
    return [...ITEMS, ...ACTIONS]
      .map((item) => ({ ...item, _score: fuzzyScore(query, item) }))
      .filter((item) => item._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 12);
  }, [query]);

  function activate(item) {
    if (!item) return;
    setOpen(false);
    if (item.run) {
      // Defer slightly so the palette dismisses before any modal
      // (print dialog, new tab) opens — feels cleaner than the
      // palette + dialog being on screen simultaneously.
      setTimeout(() => item.run(), 50);
    } else if (item.path) {
      navigate(item.path);
    }
  }

  // Reset active index when results change
  useEffect(() => { setActiveIdx(0); }, [query]);

  // Keep active item scrolled into view
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[activeIdx];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }, [activeIdx, open]);

  function onInputKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(results[activeIdx]);
    }
  }

  if (!open) return null;

  return (
    <>
      <div style={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />
      <div style={styles.panel} role="dialog" aria-modal="true" aria-label="Command palette">
        <div style={styles.inputRow}>
          <span style={styles.searchIcon} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Jump to anything…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            style={styles.input}
            aria-label="Search dashboard"
          />
          <kbd style={styles.kbdEsc}>esc</kbd>
        </div>

        <div ref={listRef} style={styles.list}>
          {results.length === 0 ? (
            <div style={styles.empty}>No matches. Try a different keyword.</div>
          ) : (
            results.map((item, i) => {
              const Active = activeIdx === i;
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.path || item.key}
                  type="button"
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => activate(item)}
                  style={{ ...styles.row, ...(Active ? styles.rowActive : {}) }}
                >
                  <span style={styles.rowIcon}>{ItemIcon && <ItemIcon size={16} />}</span>
                  <div style={styles.rowMain}>
                    <div style={styles.rowTitle}>{item.title}</div>
                    {item.hint && <div style={styles.rowHint}>{item.hint}</div>}
                  </div>
                  <span style={styles.rowGroup}>{item.group}</span>
                  {Active && <span style={styles.rowEnter}>↵</span>}
                </button>
              );
            })
          )}
        </div>

        <div style={styles.footer}>
          <span><kbd style={styles.kbd}>↑</kbd><kbd style={styles.kbd}>↓</kbd> navigate</span>
          <span><kbd style={styles.kbd}>↵</kbd> jump</span>
          <span><kbd style={styles.kbd}>esc</kbd> close</span>
          <span style={styles.footerSpacer} />
          <span style={styles.footerTip}>⌘K to toggle</span>
        </div>
      </div>
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 200,
    animation: 'kuaCmdkBackdrop 200ms ease-out',
  },
  panel: {
    position: 'fixed',
    top: '15vh', left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(620px, 92vw)',
    maxHeight: '70vh',
    background: 'rgba(15, 23, 42, 0.97)',
    backdropFilter: 'blur(16px) saturate(140%)',
    WebkitBackdropFilter: 'blur(16px) saturate(140%)',
    border: '1px solid #1f2937',
    borderRadius: 14,
    boxShadow: '0 24px 64px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(34, 211, 238, 0.1)',
    zIndex: 201,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'kuaCmdkPanel 200ms cubic-bezier(0.22, 1, 0.36, 1)',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid #1f2937',
    gap: 10,
  },
  searchIcon: { color: '#64748b', display: 'inline-flex' },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e5e7eb',
    fontSize: 16,
    fontFamily: 'inherit',
    fontWeight: 500,
  },
  kbdEsc: {
    fontSize: 10,
    color: '#64748b',
    background: '#0b1220',
    border: '1px solid #1f2937',
    padding: '3px 6px',
    borderRadius: 4,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },

  list: { overflowY: 'auto', flex: 1, padding: '6px 0' },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    width: '100%',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    color: '#cbd5e1',
  },
  rowActive: {
    background: 'rgba(34, 211, 238, 0.1)',
    color: '#22d3ee',
  },
  rowIcon: { color: '#64748b', display: 'inline-flex', width: 16, flexShrink: 0 },
  rowMain: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rowHint: { fontSize: 11, color: '#64748b', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rowGroup: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, flexShrink: 0 },
  rowEnter: { fontSize: 14, color: '#22d3ee', marginLeft: 8 },

  empty: { padding: '24px 16px', color: '#64748b', fontSize: 13, textAlign: 'center' },

  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 16px',
    borderTop: '1px solid #1f2937',
    fontSize: 11,
    color: '#64748b',
    background: '#0b1220',
  },
  footerSpacer: { flex: 1 },
  footerTip: { color: '#94a3b8' },
  kbd: {
    fontSize: 10,
    color: '#cbd5e1',
    background: '#1f2937',
    border: '1px solid #334155',
    padding: '2px 6px',
    borderRadius: 4,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    marginRight: 4,
  },
};
