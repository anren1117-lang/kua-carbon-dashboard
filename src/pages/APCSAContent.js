import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ModulePage } from '../components/ModuleShell.js';
import { PasswordGate } from '../components/PasswordGate.js';
import { APCSA_UNITS } from '../data/ap-content/apcsa.js';
import { APCSA_FIGURES } from '../data/ap-content/apcsa-figures.js';
import { resolveVideo } from '../data/ap-content/_videos-by-ap.js';
import { MathText } from '../components/MathText.js';

// Estimate reading time at 225 wpm (typical adult reading). Round up.
function readingTimeMin(text) {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 225));
}

// AP Computer Science A — full teaching content viewer.
// 9 units, 99 subunits, ~155K words. Imported from terra-council
// where the content was authored. Each subunit is read-to-learn
// prose; key concepts / formulas / practice / pitfalls follow.
//
// Layout: left rail of units (with subunit numbers), main column
// renders the selected unit. Subunits render top-down so a student
// can read the unit in one sitting.

export default function APCSAContent() {
  return (
    <PasswordGate
      title="AP Computer Science A"
      subtitle="Full teaching content — 9 units, 99 subunits. Students: read the subunit you're studying. Teachers: assign or project."
      envKey="TEACHER_PASSWORD"
      storageKey="kua_teacher_unlocked"
      defaultPassword="kua-teach"
      accent="#22c55e"
    >
      <APCSAViewer />
    </PasswordGate>
  );
}

function APCSAViewer() {
  const [params, setParams] = useSearchParams();
  const initialUnit = parseInt(params.get('unit') || '1', 10);
  const [selectedUnitNum, setSelectedUnitNumRaw] = useState(
    APCSA_UNITS.find((u) => u.number === initialUnit) ? initialUnit : 1,
  );

  const setSelectedUnitNum = (n) => {
    setSelectedUnitNumRaw(n);
    setParams({ unit: String(n) }, { replace: true });
    // Scroll the body column back to top on unit change.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const unit = useMemo(
    () => APCSA_UNITS.find((u) => u.number === selectedUnitNum) || APCSA_UNITS[0],
    [selectedUnitNum],
  );

  const totalSubunits = useMemo(
    () => APCSA_UNITS.reduce((sum, u) => sum + (u.subunits?.length || 0), 0),
    [],
  );

  // Reading-progress bar: bound to window scroll within the article.
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [selectedUnitNum]);

  return (
    <ModulePage
      title="AP Computer Science A — full content"
      subtitle={`${APCSA_UNITS.length} units · ${totalSubunits} subunits · read-to-learn teaching material. Original authoring: KUA Carbon Dashboard.`}
      toolbar={
        <Link to="/teacher/lessons" style={styles.backBtn}>
          ← Back to AP unit map
        </Link>
      }
    >
      {/* Reading-progress bar (sticky just below the page header) */}
      <div style={styles.progressTrack} className="no-print" aria-hidden="true">
        <div style={{ ...styles.progressBar, width: `${progress * 100}%` }} />
      </div>

      <div style={styles.shell} className="kua-apes-shell">
        {/* Left rail: all 9 units */}
        <nav style={styles.rail} aria-label="APES units">
          {APCSA_UNITS.map((u) => {
            const on = u.number === selectedUnitNum;
            return (
              <button
                key={u.number}
                onClick={() => setSelectedUnitNum(u.number)}
                style={{ ...styles.railItem, ...(on ? styles.railItemOn : null) }}
                aria-current={on ? 'page' : undefined}
              >
                <div style={styles.railNum}>Unit {u.number}</div>
                <div style={styles.railTitle}>{u.title.replace(/^.*?—\s*/, '')}</div>
                <div style={styles.railMeta}>
                  {u.weight} · {u.subunits?.length || 0} subunits
                </div>
              </button>
            );
          })}
        </nav>

        {/* Main reading column */}
        <article style={styles.body}>
          <UnitView unit={unit} />
        </article>

        {/* Right rail: subunits of the current unit (with active highlighting) */}
        <SubunitTOC unit={unit} />
      </div>
    </ModulePage>
  );
}

// Right-side sticky table of contents — jump to any subunit, with the
// active one highlighted via IntersectionObserver. Smooth-scrolls on
// click. Also includes a "Print this unit" button at the bottom.
function SubunitTOC({ unit }) {
  const [activeCode, setActiveCode] = useState(unit.subunits?.[0]?.code || null);

  // Recompute active subunit on unit change.
  useEffect(() => {
    setActiveCode(unit.subunits?.[0]?.code || null);
  }, [unit.number, unit.subunits]);

  useEffect(() => {
    const subunits = unit.subunits || [];
    if (subunits.length === 0) return;

    // IntersectionObserver fires as each subunit enters viewport.
    // We pick the topmost intersecting entry as "active."
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const code = visible[0].target.id.replace(/^s-/, '');
          setActiveCode(code);
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: [0] },
    );

    // Wait a tick for DOM to render the subunit blocks.
    const id = requestAnimationFrame(() => {
      subunits.forEach((s) => {
        const el = document.getElementById(`s-${s.code}`);
        if (el) observer.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(id);
      observer.disconnect();
    };
  }, [unit.number, unit.subunits]);

  const handleJump = (code) => (e) => {
    e.preventDefault();
    const el = document.getElementById(`s-${code}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveCode(code);
    }
  };

  if (!unit.subunits || unit.subunits.length === 0) return null;

  return (
    <aside style={styles.tocRail} aria-label="Subunits in this unit" className="no-print">
      <div style={styles.tocHead}>In this unit</div>
      <div style={styles.tocList}>
        {unit.subunits.map((s) => {
          const on = activeCode === s.code;
          const min = readingTimeMin(s.content);
          return (
            <a
              key={s.code}
              href={`#s-${s.code}`}
              onClick={handleJump(s.code)}
              style={{ ...styles.tocItem, ...(on ? styles.tocItemOn : null) }}
              aria-current={on ? 'true' : undefined}
            >
              <span style={styles.tocItemCode}>{s.code}</span>
              <span style={styles.tocItemTitle}>{s.title}</span>
              <span style={styles.tocItemTime}>{min} min</span>
            </a>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        style={styles.tocPrint}
      >
        🖨️ Print this unit
      </button>
    </aside>
  );
}

function UnitView({ unit }) {
  const [pptBusy, setPptBusy] = useState(false);
  const [pptError, setPptError] = useState(null);

  const handlePPT = async () => {
    setPptBusy(true);
    setPptError(null);
    try {
      // Lazy-load the generator so pptxgenjs (~600 KB) only loads
      // when a teacher actually downloads a deck.
      const { downloadUnitPPT } = await import('../utils/pptGenerator.js');
      await downloadUnitPPT({ course: 'AP Computer Science A', unit });
    } catch (err) {
      setPptError(err?.message || 'PPT generation failed');
    } finally {
      setPptBusy(false);
    }
  };

  return (
    <div>
      <header style={styles.unitHead}>
        <div style={styles.unitEyebrow}>Unit {unit.number} · {unit.weight} exam weight</div>
        <h2 style={styles.unitTitle}>{unit.title}</h2>
        {unit.notes && <p style={styles.unitNotes}>{unit.notes}</p>}

        {/* Per-unit teaching artifacts — PPT download + worksheet route */}
        <div style={styles.artifactStrip}>
          <button
            type="button"
            onClick={handlePPT}
            disabled={pptBusy}
            style={{ ...styles.artifactBtn, ...(pptBusy ? styles.artifactBtnBusy : null) }}
          >
            <span aria-hidden="true" style={{ marginRight: 6 }}>📊</span>
            {pptBusy ? 'Building deck…' : 'Download PPT'}
          </button>
          <Link
            to={`/teacher/ap/apcsa/unit/${unit.number}/worksheet`}
            style={styles.artifactBtn}
          >
            <span aria-hidden="true" style={{ marginRight: 6 }}>📝</span>
            Open worksheet
          </Link>
          {pptError && <span style={styles.artifactError}>· {pptError}</span>}
        </div>
      </header>

      {/* Subunits — each rendered as a section with the long-form
          teaching content. Paragraphs separated by blank lines in the
          source string render as separate <p> elements. */}
      <section>
        {unit.subunits?.map((s) => (
          <SubunitBlock key={s.code} subunit={s} />
        ))}
      </section>

      {/* Unit-level extras */}
      {unit.keyConcepts?.length > 0 && (
        <section style={styles.extras}>
          <h3 style={styles.extrasHead}>Key concepts</h3>
          <ul style={styles.kcList}>
            {unit.keyConcepts.map((k, i) => <li key={i} style={styles.kcItem}>{k}</li>)}
          </ul>
        </section>
      )}

      {unit.formulas?.length > 0 && (
        <section style={styles.extras}>
          <h3 style={styles.extrasHead}>Formulas</h3>
          {unit.formulas.map((f, i) => (
            <div key={i} style={styles.formulaCard}>
              <div style={styles.formulaName}>{f.name}</div>
              <div style={styles.formulaEq}>{f.equation}</div>
              <div style={styles.formulaMeaning}>{f.meaning}</div>
              {f.example && <div style={styles.formulaExample}><em>Example:</em> {f.example}</div>}
            </div>
          ))}
        </section>
      )}

      {unit.practice?.length > 0 && (
        <section style={styles.extras}>
          <h3 style={styles.extrasHead}>Practice questions</h3>
          {unit.practice.map((p, i) => (
            <details key={i} style={styles.practiceCard}>
              <summary style={styles.practiceQ}>Q{i + 1}. {p.q}</summary>
              <div style={styles.practiceA}>{p.a}</div>
              {p.work && <div style={styles.practiceWork}><em>Work:</em> {p.work}</div>}
            </details>
          ))}
        </section>
      )}

      {unit.pitfalls?.length > 0 && (
        <section style={styles.extras}>
          <h3 style={styles.extrasHead}>Common pitfalls</h3>
          <ul style={styles.pitfallList}>
            {unit.pitfalls.map((p, i) => <li key={i} style={styles.pitfallItem}>{p}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}

function SubunitBlock({ subunit }) {
  // Convert the markdown-flavored content (with **bold**, blank-line
  // paragraphs, and **Header** patterns) into structured HTML. Light
  // touch: paragraphs split on blank lines, **text** becomes <strong>.
  const paragraphs = useMemo(() => parseSubunitContent(subunit.content || ''), [subunit.content]);
  const figures = APCSA_FIGURES[subunit.code] || [];

  // Splice figures in roughly 1/3 of the way through long subunits so
  // they break up the text rather than all clustering at the top.
  const splitIdx = Math.max(1, Math.floor(paragraphs.length / 3));
  const before = paragraphs.slice(0, splitIdx);
  const after = paragraphs.slice(splitIdx);

  const minutes = readingTimeMin(subunit.content);

  return (
    <div style={styles.subunit} id={`s-${subunit.code}`}>
      <h3 style={styles.subunitHead}>
        <span style={styles.subunitCode}>{subunit.code}</span>
        <span style={{ flex: 1 }}>{subunit.title}</span>
        <span style={styles.subunitTime} aria-label={`${minutes} minute read`}>{minutes} min</span>
      </h3>
      {(subunit.video || resolveVideo('apcsa', subunit)) && <VideoBlock video={subunit.video || resolveVideo('apcsa', subunit)} />}
      <div style={styles.subunitBody}>
        {before.map((p, i) => renderParagraph(p, i))}
        {figures.length > 0 && (
          <div style={styles.figureColumn}>
            {figures.map((f, i) => <Figure key={f.id || i} figure={f} />)}
          </div>
        )}
        {after.map((p, i) => renderParagraph(p, i + splitIdx))}
        {subunit.extendedContent && (
          <div style={styles.extendedBlock}>
            <div style={styles.extendedLabel}>Going deeper</div>
            {parseSubunitContent(subunit.extendedContent).map((p, i) => renderParagraph(p, `e${i}`))}
          </div>
        )}
      </div>
    </div>
  );
}

function VideoBlock({ video }) {
  if (!video || !video.url) return null;
  const embed = toEmbedUrl(video.url);
  return (
    <div style={styles.videoBlock}>
      <div style={styles.videoMeta}>
        <span style={styles.videoTag}>{video.provider || 'Video'}</span>
        <span style={styles.videoTitle}>{video.title || 'Watch'}</span>
        <a href={video.url} target="_blank" rel="noopener noreferrer" style={styles.videoLink}>
          Open ↗
        </a>
      </div>
      {embed && (
        <div style={styles.videoFrameWrap}>
          <iframe
            src={embed}
            title={video.title || 'subunit video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={styles.videoFrame}
          />
        </div>
      )}
    </div>
  );
}

function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      let id = u.searchParams.get('v');
      if (!id && u.hostname.includes('youtu.be')) id = u.pathname.replace(/^\//, '');
      const list = u.searchParams.get('list');
      if (id) {
        return `https://www.youtube.com/embed/${id}${list ? `?list=${list}` : ''}`;
      }
      if (list) {
        return `https://www.youtube.com/embed/videoseries?list=${list}`;
      }
    }
    return url;
  } catch {
    return null;
  }
}

function Figure({ figure }) {
  const { Cmp, caption, source, id } = figure;
  return (
    <figure style={styles.figure} id={`fig-${id}`}>
      <div style={styles.figureFrame}>
        <Cmp />
      </div>
      <figcaption style={styles.figureCaption}>
        <span style={styles.figureLabel}>Figure</span> {caption}
        {source && <span style={styles.figureSource}> · {source}</span>}
      </figcaption>
    </figure>
  );
}

// Parse content string into paragraphs. Each entry is either:
//   { type: 'p',  text: '...' }     — normal paragraph
//   { type: 'h',  text: '...' }     — heading line that was the whole para wrapped in ** **
//   { type: 'ul', items: [...] }    — bullet list (lines starting with '- ')
//   { type: 'pre',text: '...' }     — fenced code or formula block
function parseSubunitContent(raw) {
  if (!raw) return [];
  const blocks = raw.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((b) => {
    // Heading: whole block is wrapped in ** **
    const hMatch = b.match(/^\*\*([^*]+)\*\*\.?$/);
    if (hMatch) return { type: 'h', text: hMatch[1] };
    // Bullet list: lines starting with - or *
    if (/^[-*]\s+/.test(b)) {
      const items = b.split('\n').filter((l) => /^[-*]\s+/.test(l)).map((l) => l.replace(/^[-*]\s+/, ''));
      return { type: 'ul', items };
    }
    // Tables (markdown |---|) — render as plain text in pre
    if (/^\|.*\|/.test(b)) {
      return { type: 'pre', text: b };
    }
    // Default: paragraph
    return { type: 'p', text: b };
  });
}

function renderParagraph(block, key) {
  if (block.type === 'h') {
    return <h4 key={key} style={styles.contentHead}>{block.text}</h4>;
  }
  if (block.type === 'ul') {
    return (
      <ul key={key} style={styles.contentList}>
        {block.items.map((it, i) => <li key={i} style={styles.contentLi}>{renderInline(it)}</li>)}
      </ul>
    );
  }
  if (block.type === 'pre') {
    return <pre key={key} style={styles.contentPre}>{block.text}</pre>;
  }
  return <p key={key} style={styles.contentP}>{renderInline(block.text)}</p>;
}

// Inline: replace **bold** with <strong>, and render $...$/$$...$$ math
// via KaTeX through the MathText helper.
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    const m = p.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i} style={{ color: '#e5e7eb' }}><MathText>{m[1]}</MathText></strong>;
    return <MathText key={i}>{p}</MathText>;
  });
}

const styles = {
  shell: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr) minmax(0, 240px)',
    gap: 20,
    marginTop: 18,
    alignItems: 'start',
  },

  // Top progress bar — bound to window scroll position within unit
  progressTrack: {
    height: 3,
    background: '#1f2937',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #22c55e, #22d3ee)',
    transition: 'width 80ms linear',
  },

  // Right rail — subunits in the current unit
  tocRail: {
    position: 'sticky',
    top: 16,
    maxHeight: 'calc(100vh - 80px)',
    overflowY: 'auto',
    padding: '4px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  tocHead: {
    fontSize: 10.5,
    color: '#22d3ee',
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    padding: '0 12px 8px',
    borderBottom: '1px solid #1f2937',
    marginBottom: 6,
  },
  tocList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  tocItem: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'baseline',
    gap: 8,
    padding: '7px 12px 8px',
    borderLeft: '2px solid transparent',
    borderRadius: 3,
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: 12.5,
    transition: 'color 120ms ease, border-color 120ms ease, background 120ms ease',
  },
  tocItemOn: {
    color: '#e5e7eb',
    borderLeftColor: '#22d3ee',
    background: 'rgba(34, 211, 238, 0.06)',
  },
  tocItemCode: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 10.5,
    color: '#22c55e',
    fontWeight: 700,
  },
  tocItemTitle: {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tocItemTime: {
    fontSize: 10,
    color: '#64748b',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  tocPrint: {
    marginTop: 10,
    padding: '8px 12px',
    border: '1px solid #1f2937',
    borderRadius: 4,
    background: '#0b1220',
    color: '#cbd5e1',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    textAlign: 'left',
  },

  // Subunit reading-time badge
  subunitTime: {
    fontSize: 11,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    color: '#64748b',
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 4,
    padding: '2px 8px',
    fontWeight: 600,
    letterSpacing: 0.2,
  },
  rail: {
    position: 'sticky',
    top: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    maxHeight: 'calc(100vh - 80px)',
    overflowY: 'auto',
    padding: '4px 0',
  },
  railItem: {
    display: 'block',
    textAlign: 'left',
    padding: '10px 12px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderLeft: '3px solid transparent',
    borderRadius: 6,
    color: '#cbd5e1',
    cursor: 'pointer',
    transition: 'border-color 120ms ease, background 120ms ease',
  },
  railItemOn: {
    borderLeftColor: '#22c55e',
    background: '#0f172a',
    boxShadow: '0 0 0 1px rgba(34, 197, 94, 0.18) inset',
  },
  railNum: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  railTitle: { fontSize: 13.5, color: '#e5e7eb', fontWeight: 600, marginTop: 2, letterSpacing: '-0.005em' },
  railMeta: { fontSize: 11, color: '#64748b', marginTop: 3 },

  body: { minWidth: 0 },
  unitHead: {
    paddingBottom: 16,
    marginBottom: 20,
    borderBottom: '1px solid #1f2937',
  },
  unitEyebrow: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#22d3ee',
    marginBottom: 8,
  },
  unitTitle: {
    fontSize: 'clamp(22px, 4vw, 30px)',
    color: '#e5e7eb',
    margin: 0,
    fontWeight: 800,
    letterSpacing: '-0.012em',
    lineHeight: 1.2,
  },
  unitNotes: {
    fontSize: 13.5,
    color: '#94a3b8',
    margin: '12px 0 0',
    lineHeight: 1.55,
    maxWidth: '70ch',
  },

  // Per-unit teaching artifacts (PPT + Worksheet buttons)
  artifactStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  artifactBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 14px',
    background: '#0f172a',
    border: '1px solid #14532d',
    borderRadius: 6,
    color: '#86efac',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 120ms ease, border-color 120ms ease',
  },
  artifactBtnBusy: {
    opacity: 0.6,
    cursor: 'wait',
  },
  artifactError: {
    fontSize: 12,
    color: '#fca5a5',
    marginLeft: 4,
  },

  subunit: {
    padding: '20px 0 18px',
    borderBottom: '1px solid #1f2937',
  },
  subunitHead: {
    fontSize: 18,
    color: '#e5e7eb',
    margin: '0 0 12px',
    fontWeight: 700,
    letterSpacing: '-0.005em',
    display: 'flex',
    gap: 12,
    alignItems: 'baseline',
  },
  subunitCode: {
    fontSize: 12,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    color: '#22c55e',
    fontWeight: 700,
    letterSpacing: 0.4,
  },
  subunitBody: { color: '#cbd5e1', fontSize: 14.5, lineHeight: 1.65, maxWidth: '72ch' },

  // Figures — break up the text with inline SVG diagrams.
  figureColumn: { margin: '24px 0 22px' },
  figure: {
    margin: '0 0 18px',
    padding: 0,
  },
  figureFrame: {
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 0,
    display: 'block',
  },
  videoBlock: {
    margin: '4px 0 18px',
    padding: 12,
    background: 'rgba(34, 197, 94, 0.05)',
    border: '1px solid rgba(34, 197, 94, 0.25)',
    borderRadius: 10,
  },
  videoMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  videoTag: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    padding: '2px 8px',
    background: 'rgba(34, 197, 94, 0.18)',
    color: '#22c55e',
    borderRadius: 4,
  },
  videoTitle: {
    flex: 1,
    fontSize: 13,
    color: '#e5e7eb',
    fontWeight: 600,
  },
  videoLink: {
    fontSize: 12,
    color: '#22c55e',
    textDecoration: 'none',
    fontWeight: 600,
  },
  videoFrameWrap: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    background: '#0f172a',
    borderRadius: 6,
    overflow: 'hidden',
  },
  videoFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0,
  },
  extendedBlock: {
    marginTop: 16,
    padding: '12px 14px',
    background: 'rgba(59, 130, 246, 0.06)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderLeft: '3px solid #3b82f6',
    borderRadius: 6,
  },
  extendedLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#60a5fa',
    marginBottom: 8,
  },
  figureCaption: {
    marginTop: 8,
    fontSize: 12.5,
    color: '#94a3b8',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
  figureLabel: {
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#22d3ee',
    marginRight: 6,
    fontStyle: 'normal',
  },
  figureSource: {
    color: '#64748b',
    fontSize: 11.5,
    fontStyle: 'normal',
  },

  contentP: { margin: '0 0 14px' },
  contentHead: {
    fontSize: 14.5,
    color: '#e5e7eb',
    margin: '20px 0 8px',
    fontWeight: 700,
    letterSpacing: '-0.005em',
  },
  contentList: { margin: '0 0 14px', paddingLeft: 22 },
  contentLi: { marginBottom: 6 },
  contentPre: {
    margin: '0 0 14px',
    padding: '10px 12px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 6,
    color: '#94a3b8',
    fontSize: 12.5,
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
  },

  extras: { marginTop: 28 },
  extrasHead: {
    fontSize: 16,
    color: '#e5e7eb',
    margin: '0 0 10px',
    fontWeight: 700,
    letterSpacing: '-0.005em',
    paddingBottom: 6,
    borderBottom: '1px solid #1f2937',
  },
  kcList: { margin: 0, paddingLeft: 22, color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 },
  kcItem: { marginBottom: 6 },

  formulaCard: {
    padding: '12px 14px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 8,
    marginBottom: 10,
  },
  formulaName: {
    fontSize: 12.5,
    color: '#67e8f9',
    fontWeight: 700,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  formulaEq: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 8,
    padding: '6px 10px',
    background: '#020617',
    border: '1px solid #1f2937',
    borderRadius: 4,
  },
  formulaMeaning: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.55, marginBottom: 6 },
  formulaExample: { fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55 },

  practiceCard: {
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 8,
    cursor: 'pointer',
  },
  practiceQ: {
    fontSize: 13.5,
    color: '#e5e7eb',
    fontWeight: 600,
    listStyle: 'none',
    outline: 'none',
  },
  practiceA: { marginTop: 10, fontSize: 13, color: '#86efac', lineHeight: 1.55 },
  practiceWork: { marginTop: 6, fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55 },

  pitfallList: { margin: 0, paddingLeft: 22, color: '#fbbf24', fontSize: 13.5, lineHeight: 1.6 },
  pitfallItem: { marginBottom: 6 },

  backBtn: {
    padding: '6px 12px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 6,
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: 12.5,
    fontWeight: 600,
  },
};
