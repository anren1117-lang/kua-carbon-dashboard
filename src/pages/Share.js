import React, { useMemo, useState } from 'react';
import qrcode from 'qrcode-generator';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection } from '../components/ModuleShell.js';
import { Icon } from '../components/Icon.js';

// /share — generates a QR code linking to any page on the dashboard.
// Useful for printing on dorm bulletin board flyers, school events,
// admissions hand-outs, etc. Pure client-side; the qrcode-generator
// library renders SVG that we inject directly so it stays crisp
// at any print size.
//
// Default URL is the canonical production deploy. Visitor can pick a
// preset destination (homepage, dorm leaderboard, scenarios, FAQ) or
// type any URL. The resulting QR code can be downloaded as SVG (best
// for print) or PNG (best for slides).

const DEFAULT_BASE = 'https://kua-carbon-dashboard.vercel.app';

const PRESETS = [
  { label: 'Homepage', path: '/' },
  { label: 'Campus map', path: '/campus-map' },
  { label: 'Dorm leaderboard', path: '/dorm-leaderboard' },
  { label: 'Dorm challenge', path: '/challenge' },
  { label: 'Your footprint', path: '/your-footprint' },
  { label: 'News', path: '/news' },
  { label: 'Scenarios (simulator)', path: '/scenarios' },
  { label: 'FAQ', path: '/faq' },
];

export default function Share() {
  const [preset, setPreset] = useState('/');
  const [customUrl, setCustomUrl] = useState('');
  const url = customUrl.trim() || (DEFAULT_BASE + preset);

  // Render the QR to an SVG string we can inject + offer as download.
  const svgString = useMemo(() => {
    try {
      // Type 0 = autodetect smallest QR version that fits the data;
      // 'M' error correction = ~15% redundancy (recommended for
      // printed material that might smudge).
      const qr = qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      // createSvgTag returns a complete <svg>...</svg> string.
      return qr.createSvgTag({ scalable: true, margin: 4 });
    } catch (err) {
      return null;
    }
  }, [url]);

  function downloadSvg() {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    triggerDownload(blob, `kua-qr-${slugify(url)}.svg`);
  }

  function downloadPng() {
    if (!svgString) return;
    // Render to canvas via Image, then export PNG. Standard SVG-to-
    // PNG dance — no canvas size attribute on the source SVG, so
    // we scale to a fixed 800×800 for a print-friendly resolution.
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 800);
      ctx.drawImage(img, 0, 0, 800, 800);
      canvas.toBlob((png) => {
        if (png) triggerDownload(png, `kua-qr-${slugify(typeof url === 'string' ? url : '')}.png`);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = url;
  }

  return (
    <ModulePage
      title="Share — printable QR code"
      subtitle="Generate a QR code linking to any dashboard page. Useful for dorm bulletin boards, school events, admissions hand-outs."
    >
      <ModuleSection title="Pick a destination">
        <div style={styles.presetGrid}>
          {PRESETS.map((p) => (
            <button
              key={p.path}
              type="button"
              onClick={() => { setPreset(p.path); setCustomUrl(''); }}
              style={{
                ...styles.presetBtn,
                ...(preset === p.path && !customUrl ? styles.presetBtnActive : {}),
              }}
            >
              {p.label}
              <span style={styles.presetPath}>{p.path}</span>
            </button>
          ))}
        </div>

        <div style={styles.customWrap}>
          <label style={styles.customLabel}>Or paste any URL:</label>
          <input
            type="url"
            placeholder="https://kua-carbon-dashboard.vercel.app/..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            style={styles.customInput}
          />
        </div>
      </ModuleSection>

      <ModuleSection title="QR code" hint="Scan with any phone camera to open the linked page.">
        <div style={styles.qrWrap}>
          {svgString ? (
            <div
              style={styles.qrInner}
              // QR SVG is generated client-side from a sanitized URL;
              // safe to inject as the only dynamic content is structural.
              dangerouslySetInnerHTML={{ __html: svgString }}
            />
          ) : (
            <div style={styles.qrError}>Could not generate QR for that URL.</div>
          )}
          <div style={styles.urlReadout}>
            <code style={styles.urlCode}>{url}</code>
          </div>
        </div>

        <div style={styles.downloadRow}>
          <button type="button" onClick={downloadSvg} style={styles.downloadBtn} disabled={!svgString}>
            <Icon.Download size={13} />
            <span style={{ marginLeft: 7 }}>Download SVG (best for print)</span>
          </button>
          <button type="button" onClick={downloadPng} style={styles.downloadBtn} disabled={!svgString}>
            <Icon.Download size={13} />
            <span style={{ marginLeft: 7 }}>Download PNG (best for slides)</span>
          </button>
        </div>
      </ModuleSection>

      <ModuleSection title="Printing tips">
        <ul style={styles.tips}>
          <li>Minimum size on a flyer: <strong>2 cm × 2 cm</strong>. Smaller than that and phone cameras struggle to scan from arm's length.</li>
          <li>Print at <strong>300 DPI minimum</strong>. The SVG download is vector so it scales without pixelation — use SVG when you can.</li>
          <li>Quiet zone (white border around the code) is built into the rendering at 4 modules. Don't crop it off.</li>
          <li>Test the print by scanning it with a phone before making 100 copies.</li>
        </ul>
      </ModuleSection>

      <p style={styles.fineprint}>
        QR rendering is done entirely in your browser — no URL is sent to any server.
        See <Link to="/methodology" style={styles.link}>Methodology</Link> for the rest of the dashboard's privacy posture.
      </p>
    </ModulePage>
  );
}

function triggerDownload(blob, filename) {
  const a = document.createElement('a');
  const u = URL.createObjectURL(blob);
  a.href = u;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}

function slugify(url) {
  return (url || '')
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'kua';
}

const styles = {
  presetGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 },
  presetBtn:    { padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#cbd5e1', fontSize: 13, cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'inherit', fontWeight: 600 },
  presetBtnActive: { background: '#0e3a5f', borderColor: '#22d3ee', color: '#22d3ee' },
  presetPath:   { fontSize: 11, color: '#64748b', fontWeight: 400 },

  customWrap:   { marginTop: 14 },
  customLabel:  { display: 'block', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: 700, marginBottom: 6 },
  customInput:  { width: '100%', padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' },

  qrWrap:       { padding: '20px', background: '#ffffff', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, maxWidth: 420, margin: '0 auto' },
  qrInner:      { width: 320, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qrError:      { padding: 24, color: '#dc2626', fontSize: 13 },
  urlReadout:   { padding: '6px 10px', background: '#f3f4f6', borderRadius: 4, maxWidth: '100%', overflow: 'hidden' },
  urlCode:      { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11, color: '#0b1220', wordBreak: 'break-all' },

  downloadRow:  { marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' },
  downloadBtn:  { padding: '10px 16px', background: '#052e16', color: '#86efac', border: '1px solid #16a34a', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center' },

  tips:         { paddingLeft: 20, fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: '8px 0' },
  fineprint:    { fontSize: 12, color: '#64748b', marginTop: 18, fontStyle: 'italic' },
  link:         { color: '#22d3ee', textDecoration: 'none' },
};
