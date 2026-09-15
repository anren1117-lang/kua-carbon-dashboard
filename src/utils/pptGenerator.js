// Per-unit PowerPoint generator for AP teaching content.
// Uses pptxgenjs to build a downloadable .pptx in the browser.
// Lazy-imported from APESContent so the lib (~600 KB) only loads when
// a teacher actually requests a deck.
//
// Slide structure per unit:
//   1. Title slide (course + unit + weight)
//   2. Per subunit: one slide (code + title + key bullets pulled from
//      the subunit content's bolded headers and lead sentences)
//   3. Key concepts slide
//   4. Formulas slide (one per formula, with equation + meaning)
//   5. Practice slide (Q + reveal note)
//   6. Pitfalls slide

export async function downloadUnitPPT({ course, unit }) {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = `${course} — Unit ${unit.number}: ${cleanTitle(unit.title)}`;
  pptx.subject = `${course} Unit ${unit.number}`;
  pptx.author = 'KUA Carbon Dashboard';

  const ACCENT = '22C55E';
  const BG = '0B1220';
  const TEXT = 'E5E7EB';
  const DIM = '94A3B8';

  // Master slide background
  pptx.defineSlideMaster({
    title: 'KUA_MASTER',
    background: { color: BG },
    objects: [
      { rect: { x: 0, y: 0, w: 0.1, h: '100%', fill: { color: ACCENT } } },
    ],
  });

  // ---- Title slide ----------------------------------------------
  const s1 = pptx.addSlide({ masterName: 'KUA_MASTER' });
  s1.addText(course, {
    x: 0.6, y: 1.5, w: 12, h: 0.5,
    color: ACCENT, fontSize: 16, fontFace: 'Calibri', bold: true,
  });
  s1.addText(`Unit ${unit.number}: ${cleanTitle(unit.title)}`, {
    x: 0.6, y: 2.0, w: 12, h: 1.2,
    color: TEXT, fontSize: 36, fontFace: 'Calibri', bold: true,
  });
  s1.addText(`Exam weight: ${unit.weight} · ${unit.subunits?.length || 0} subunits`, {
    x: 0.6, y: 3.2, w: 12, h: 0.5,
    color: DIM, fontSize: 14, fontFace: 'Calibri',
  });
  if (unit.notes) {
    s1.addText(unit.notes, {
      x: 0.6, y: 4.0, w: 12, h: 1.5,
      color: DIM, fontSize: 13, fontFace: 'Calibri', italic: true,
    });
  }
  s1.addText('KUA Carbon Dashboard · Teacher Portal', {
    x: 0.6, y: 6.6, w: 12, h: 0.4,
    color: DIM, fontSize: 10, fontFace: 'Calibri',
  });

  // ---- One slide per subunit ------------------------------------
  (unit.subunits || []).forEach((sub) => {
    const s = pptx.addSlide({ masterName: 'KUA_MASTER' });
    s.addText(`Subunit ${sub.code}`, {
      x: 0.6, y: 0.4, w: 12, h: 0.4,
      color: ACCENT, fontSize: 12, fontFace: 'Calibri', bold: true,
    });
    s.addText(sub.title, {
      x: 0.6, y: 0.85, w: 12, h: 0.9,
      color: TEXT, fontSize: 26, fontFace: 'Calibri', bold: true,
    });
    const bullets = extractBullets(sub.content || '', 7);
    s.addText(
      bullets.map((b) => ({ text: b, options: { bullet: { code: '25CF' } } })),
      {
        x: 0.6, y: 1.9, w: 12, h: 4.8,
        color: TEXT, fontSize: 16, fontFace: 'Calibri', paraSpaceAfter: 8,
      },
    );
    s.addText(`${sub.code} · ${course} · Unit ${unit.number}`, {
      x: 0.6, y: 6.7, w: 12, h: 0.3,
      color: DIM, fontSize: 9, fontFace: 'Calibri',
    });
  });

  // ---- Key concepts slide ---------------------------------------
  if (unit.keyConcepts?.length) {
    const s = pptx.addSlide({ masterName: 'KUA_MASTER' });
    s.addText('Key concepts', {
      x: 0.6, y: 0.4, w: 12, h: 0.7,
      color: ACCENT, fontSize: 22, fontFace: 'Calibri', bold: true,
    });
    s.addText(
      unit.keyConcepts.map((k) => ({ text: k, options: { bullet: true } })),
      {
        x: 0.6, y: 1.2, w: 12, h: 5.6,
        color: TEXT, fontSize: 14, fontFace: 'Calibri', paraSpaceAfter: 6,
      },
    );
  }

  // ---- Formulas slides (one per formula) ------------------------
  (unit.formulas || []).forEach((f) => {
    const s = pptx.addSlide({ masterName: 'KUA_MASTER' });
    s.addText('Formula', {
      x: 0.6, y: 0.4, w: 12, h: 0.4,
      color: ACCENT, fontSize: 12, fontFace: 'Calibri', bold: true,
    });
    s.addText(f.name, {
      x: 0.6, y: 0.85, w: 12, h: 0.7,
      color: TEXT, fontSize: 24, fontFace: 'Calibri', bold: true,
    });
    s.addText(f.equation, {
      x: 0.6, y: 1.8, w: 12, h: 0.9,
      color: TEXT, fontSize: 22, fontFace: 'Consolas', bold: true, fill: { color: '020617' },
      align: 'center', valign: 'middle',
    });
    s.addText(f.meaning, {
      x: 0.6, y: 2.9, w: 12, h: 1.2,
      color: TEXT, fontSize: 14, fontFace: 'Calibri',
    });
    if (f.example) {
      s.addText([
        { text: 'Example: ', options: { color: ACCENT, bold: true } },
        { text: f.example, options: { color: DIM } },
      ], {
        x: 0.6, y: 4.3, w: 12, h: 2.0,
        fontSize: 13, fontFace: 'Calibri',
      });
    }
  });

  // ---- Practice slide -------------------------------------------
  if (unit.practice?.length) {
    const s = pptx.addSlide({ masterName: 'KUA_MASTER' });
    s.addText('Practice', {
      x: 0.6, y: 0.4, w: 12, h: 0.7,
      color: ACCENT, fontSize: 22, fontFace: 'Calibri', bold: true,
    });
    const items = unit.practice.flatMap((p, i) => ([
      { text: `Q${i + 1}. ${p.q}`, options: { bold: true, color: TEXT, paraSpaceAfter: 4 } },
      { text: `A. ${p.a}`, options: { color: '86EFAC', paraSpaceAfter: 14, fontSize: 12 } },
    ]));
    s.addText(items, {
      x: 0.6, y: 1.2, w: 12, h: 5.8,
      fontSize: 13, fontFace: 'Calibri',
    });
  }

  // ---- Pitfalls slide -------------------------------------------
  if (unit.pitfalls?.length) {
    const s = pptx.addSlide({ masterName: 'KUA_MASTER' });
    s.addText('Common pitfalls', {
      x: 0.6, y: 0.4, w: 12, h: 0.7,
      color: 'FBBF24', fontSize: 22, fontFace: 'Calibri', bold: true,
    });
    s.addText(
      unit.pitfalls.map((p) => ({ text: p, options: { bullet: { code: '26A0' } } })),
      {
        x: 0.6, y: 1.2, w: 12, h: 5.6,
        color: TEXT, fontSize: 13, fontFace: 'Calibri', paraSpaceAfter: 6,
      },
    );
  }

  const fname = `${slugify(course)}_unit-${unit.number}_${slugify(cleanTitle(unit.title))}.pptx`;
  await pptx.writeFile({ fileName: fname });
}

// Strip the leading "The Living World — " prefix from APES titles
// for cleaner deck titles.
function cleanTitle(t) {
  return (t || '').replace(/^[^—]+—\s*/, '').trim() || t;
}

function slugify(s) {
  return (s || 'unit').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Extract bullet points from a subunit's content string. Pulls the
// bold section headers (**...**) and the first sentence after each
// header. Falls back to the first N sentences if no headers.
function extractBullets(content, max = 7) {
  if (!content) return [];
  const trimmed = content.trim();
  const bullets = [];

  // Find lines starting with **Header** patterns
  const headerLines = trimmed.match(/^\*\*([^*]+)\*\*[^\n]*$/gm) || [];
  if (headerLines.length >= 3) {
    for (const line of headerLines) {
      if (bullets.length >= max) break;
      const stripped = line.replace(/^\*\*([^*]+)\*\*\s*\.?\s*/, '$1: ').trim();
      bullets.push(truncate(stripped, 180));
    }
    return bullets;
  }

  // Fallback: take leading sentences from each paragraph
  const paragraphs = trimmed.split(/\n\s*\n/).filter(Boolean);
  for (const p of paragraphs) {
    if (bullets.length >= max) break;
    const stripped = p.replace(/\*\*([^*]+)\*\*/g, '$1').trim();
    const firstSentence = stripped.split(/(?<=[.!?])\s+/)[0];
    if (firstSentence) bullets.push(truncate(firstSentence, 180));
  }
  return bullets;
}

function truncate(s, n) {
  if (!s) return s;
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…';
}
