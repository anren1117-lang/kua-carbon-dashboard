import React, { useMemo } from 'react';
import qrcode from 'qrcode-generator';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection } from '../components/ModuleShell.js';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';

// /dorm-posters — printable sheet of QR codes, one per dorm,
// each linking to that dorm's /buildings/:id detail page.
//
// Use case: RA prints this from their browser, cuts the sheet
// into individual cards, and posts a QR on each dorm's door.
// Residents scan it to see their dorm's energy stats, ranking,
// monthly trend. Lightweight engagement multiplier.
//
// All-client-side QR generation via qrcode-generator (same lib
// the /share page uses, so no bundle bump).

const BASE_URL = (typeof window !== 'undefined' && window.location?.origin)
  ? window.location.origin
  : 'https://kua-carbon-dashboard.vercel.app';

function svgForUrl(url) {
  try {
    const qr = qrcode(0, 'M');
    qr.addData(url);
    qr.make();
    return qr.createSvgTag({ scalable: true, margin: 2 });
  } catch {
    return null;
  }
}

export default function DormPosters() {
  const { rows } = useMemo(() => computeBuildingEmissions(), []);
  const dorms = useMemo(() => {
    return rows
      .filter((r) => r.category === 'Dorm' && r.occupants > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  return (
    <ModulePage
      title="Dorm QR posters"
      subtitle={`Printable sheet of ${dorms.length} QR codes, one per dorm. Each QR links to that dorm's stats page. Print this sheet, cut along the lines, and post each card on the corresponding dorm's door — residents scan with their phone camera to see how their dorm is doing.`}
      toolbar={
        <button
          type="button"
          onClick={() => window.print()}
          style={styles.printBtn}
          title="Print this sheet"
        >
          🖨 Print this sheet
        </button>
      }
    >
      <ModuleSection title="Printing tips" hint="">
        <ul style={styles.tips}>
          <li>Use <strong>Print → Save as PDF → Print at actual size</strong> for crispest QR codes.</li>
          <li>Each card prints at roughly 3" × 3" — fits standard letter paper with margins.</li>
          <li>QR codes scan reliably down to ~2cm; if you reduce the size, test one with your phone camera first.</li>
          <li>The print stylesheet hides nav + footer so the printed page is just the cards.</li>
        </ul>
      </ModuleSection>

      <ModuleSection title={`${dorms.length} dorm cards`} hint="">
        <div style={styles.grid}>
          {dorms.map((d) => {
            const url = `${BASE_URL}/buildings/${d.id}`;
            const svg = svgForUrl(url);
            return (
              <div key={d.id} style={styles.card} className="kua-card-hover">
                <div style={styles.cardHead}>
                  <Link to={`/buildings/${d.id}`} style={styles.cardName}>{d.name}</Link>
                  <div style={styles.cardMeta}>{d.occupants} residents</div>
                </div>
                <div style={styles.qrWrap}>
                  {svg
                    ? <div style={styles.qrInner} dangerouslySetInnerHTML={{ __html: svg }} />
                    : <div style={styles.qrErr}>QR generation failed</div>}
                </div>
                <div style={styles.cardScan}>
                  Scan to see {d.name}'s
                  <br />energy stats + trend
                </div>
                <code style={styles.cardUrl}>{url.replace(/^https?:\/\//, '')}</code>
              </div>
            );
          })}
        </div>
      </ModuleSection>

      <p style={styles.footer}>
        QR codes link to the building detail page which auto-updates as each new month of BMS
        data comes in. Print once per term and the QR keeps working — no need to reprint when
        the data refreshes.
      </p>
    </ModulePage>
  );
}

const styles = {
  printBtn: { padding: '8px 14px', background: '#0e7490', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' },

  tips: { paddingLeft: 20, fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, margin: '8px 0' },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
    marginTop: 4,
  },
  card: {
    padding: '16px 14px',
    background: '#ffffff',
    border: '2px dashed #cbd5e1',
    borderRadius: 10,
    color: '#0b1220',
    textAlign: 'center',
    pageBreakInside: 'avoid',
  },
  cardHead: { marginBottom: 10 },
  cardName: { fontSize: 18, fontWeight: 800, color: '#0b1220', textDecoration: 'none', display: 'block', marginBottom: 4 },
  cardMeta: { fontSize: 11, color: '#475569', fontWeight: 600 },
  qrWrap: { padding: 10, background: '#ffffff', borderRadius: 6, display: 'flex', justifyContent: 'center', marginBottom: 10 },
  qrInner: { width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qrErr: { color: '#dc2626', fontSize: 12, padding: 20 },
  cardScan: { fontSize: 12, color: '#475569', fontWeight: 600, lineHeight: 1.4, marginBottom: 8 },
  cardUrl: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 9, color: '#64748b', wordBreak: 'break-all' },

  footer: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginTop: 20, lineHeight: 1.6 },
};
