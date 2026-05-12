// POST /api/admin/ai-ingestion
//
// Body:
//   { text?: string, images?: ImageInput[], hint?: string }
//   - text: raw document text (parsed by client; PDFs go through pdfjs
//     via src/utils/extractFileText.js before getting here)
//   - images: optional array of { media_type: 'image/png'|'image/jpeg'|
//     'image/gif'|'image/webp', data: base64 string }. Used for scanned
//     PDFs (rasterized client-side) and photos of invoices/meters.
//     Either text OR images (or both) must be provided.
//   - hint: optional admin hint about what to extract (e.g. "this is
//     a heating-oil delivery invoice from FW Webb")
//
// Response (200):
//   {
//     mode: 'llm' | 'unavailable',
//     summary: string,                  // 1-2 sentence "what this document is"
//     extractedRows: [
//       {
//         table:       'fuel_bills'|'scope1_heating_oil'|'scope1_propane'|...,
//         scope:       'Scope 1'|'Scope 2'|'Scope 3'|'Sinks'|'Renewables',
//         confidence:  'high'|'medium'|'low',
//         fields:      { ... per-table columns ... },
//         provenance:  'measured'|'cited'|'estimated',
//         sourceQuote: string  // verbatim snippet the extraction is anchored on
//       }
//     ],
//     flags: string[]                   // notes for the admin
//   }
//
// Response (400/401/429/503): { error: string }
//
// Routing target tables intentionally match ADMIN_TABLE_SOURCES so the
// extracted rows can flow into the per-scope admin forms with no
// further translation. Admin reviews + accepts on the UI side; this
// endpoint does NOT write to Supabase directly.

import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';

// Generous per-IP throttle — each call can burn ~10K input tokens
// (a multi-page PDF), so we limit aggressive batch ingestion.
const limiter = createRateLimit({ capacity: 6, refillPerSec: 0.05 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You are KUA's document-ingestion agent. You extract structured emissions-related data from heterogeneous source documents (heating-oil delivery invoices, propane bills, BMS exports, dining-vendor purchase orders, study-abroad travel itineraries, etc.) and emit STRICT JSON for the admin dashboard's per-scope tables.

KUA's canonical Supabase tables (extract into these — never invent new tables):
- Scope 1: fuel_bills, scope1_heating_oil, scope1_propane, scope1_fleet, scope1_refrigerants
- Scope 3: day_students, us_boarding_students, international_students, study_abroad, faculty_travel, waste, purchased_goods, commuting
- Sinks: forest_stand_actuals
- Renewables: renewables_solar, renewables_geothermal, renewables_wind

Per-table field shapes (use these exact field names — case-sensitive):
- scope1_heating_oil: { delivery_date: 'YYYY-MM-DD', gallons: number, cost_usd?: number, vendor?: string, building_or_tank?: string, invoice_number?: string, data_quality?: 'measured'|'estimated'|'modeled' }
- scope1_propane:     { delivery_date: 'YYYY-MM-DD', gallons: number, cost_usd?: number, vendor?: string, building_or_tank?: string, invoice_number?: string, data_quality?: 'measured'|'estimated'|'modeled' }
- scope1_fleet:       { period_start: 'YYYY-MM-DD', period_end: 'YYYY-MM-DD', vehicle_id?: string, fuel_type: 'Gasoline'|'Diesel'|'Propane'|'CNG', gallons: number, miles?: number }
- scope1_refrigerants:{ service_date: 'YYYY-MM-DD', system_id?: string, refrigerant_type: 'R-410A'|'R-134a'|'R-22'|'R-404A'|'R-407C'|'R-32'|'R-1234yf'|'other', recharge_lb: number, reclaim_lb: number }
- renewables_solar:   { period_start: 'YYYY-MM-DD', period_end: 'YYYY-MM-DD', inverter_id?: string, gross_kwh: number, self_consumed_kwh?: number, exported_kwh?: number }
- waste:              { date: 'YYYY-MM-DD', waste_type: 'Landfill'|'Recycling'|'Compost'|'C&D'|'Hazardous', amount: number, unit: 'tons'|'lbs'|'cy' }
- purchased_goods:    { invoice_date?: 'YYYY-MM-DD', vendor?: string, category?: string, spend_usd: number, eeio_factor_override?: number }
- faculty_travel:     { departure_date: 'YYYY-MM-DD', return_date?: 'YYYY-MM-DD', destination_city?: string, destination_country?: string, trip_purpose?: string }
- study_abroad:       { departure_date: 'YYYY-MM-DD', return_date?: 'YYYY-MM-DD', destination_city?: string, destination_country?: string }

Output STRICT JSON only — no prose before or after — matching this shape:
{
  "summary": "1-2 sentence description of what the document(s) cover",
  "extractedRows": [
    {
      "table": "scope1_heating_oil",
      "scope": "Scope 1",
      "confidence": "high",
      "fields": { "delivery_date": "2026-02-14", "gallons": 1850, "vendor": "FW Webb", "cost_usd": 5550 },
      "provenance": "measured",
      "sourceQuote": "verbatim snippet from the document that supports this row",
      "sourceDocument": "name of the file or section the row came from (use the '--- filename ---' marker when present)"
    }
  ],
  "flags": [
    "Date '2/14' interpreted as 2026-02-14 — confirm the year if this might be a prior cycle."
  ]
}

Rules:
1. ONLY extract rows you can ground in the document. If a number is implied but not stated, do NOT fabricate it — leave the field out and mention it in flags.
2. confidence: 'high' = numbers + dates clearly stated in source. 'medium' = some inference (e.g. computed from line items). 'low' = significant interpretation; flag it.
3. provenance: 'measured' for invoice/meter/BMS numbers (the document IS the measurement). 'cited' when the document references a known methodology. 'estimated' only when you had to guess.
4. data_quality (where applicable) defaults to 'measured' for invoice documents.
5. Dates: emit ISO 'YYYY-MM-DD'. If the year is ambiguous (e.g. "2/14" with no year), assume the most-recent past occurrence and flag it.
6. Numbers: extract as raw numerics (no commas, no units in the value). Units go in the dedicated unit fields where they exist.
7. If a single document covers multiple periods (e.g. annual statement with 12 monthly rows), emit one row per period — don't collapse.
8. If MULTIPLE documents are provided (separated by '--- filename ---' markers), emit rows for each and tag every row with sourceDocument so the admin can see which file each row came from.
9. If the document doesn't contain any emissions-relevant data, return { summary, extractedRows: [], flags: ["No emissions-relevant data detected — likely a different document type."] }.
10. NEVER write to a table not in the list above. If a document references something else (e.g. building permits, payroll), skip it.
11. Cross-row inference: if you see one row clearly (e.g. month 3 of a year) and the others use the same template, emit the implied rows but mark them medium confidence + flag the inference. Don't fabricate values that aren't on the page in some form.`;

function buildUserMessage(text, hint) {
  const lines = [
    'Document text follows. Extract every emissions-relevant row.',
  ];
  if (hint) lines.push(`Admin hint: ${hint}`);
  lines.push('', '--- DOCUMENT BEGIN ---', text, '--- DOCUMENT END ---');
  return lines.join('\n');
}

function tryParseJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

const ALLOWED_TABLES = new Set([
  'fuel_bills', 'scope1_heating_oil', 'scope1_propane', 'scope1_fleet', 'scope1_refrigerants',
  'day_students', 'us_boarding_students', 'international_students',
  'study_abroad', 'faculty_travel', 'waste', 'purchased_goods', 'commuting',
  'forest_stand_actuals',
  'renewables_solar', 'renewables_geothermal', 'renewables_wind',
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader && res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const authed = verifyAdminRequest(req);
  if (!authed.ok) {
    res.status(authed.status).json({ error: authed.reason });
    return;
  }

  const limit = limiter.consume(getClientKey(req));
  if (!limit.allowed) {
    if (typeof res.setHeader === 'function') {
      res.setHeader('Retry-After', String(Math.ceil(limit.retryAfterMs / 1000)));
    }
    res.status(429).json({ error: 'Too many requests', retryAfterMs: limit.retryAfterMs });
    return;
  }

  const body = req.body || {};
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const hint = typeof body.hint === 'string' ? body.hint.slice(0, 280) : '';
  const images = Array.isArray(body.images) ? body.images : [];

  // Validate images: accept up to 6 (Anthropic's effective practical
  // cap) with known media types + base64 strings under ~5 MB each.
  const ALLOWED_MEDIA = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
  const MAX_IMG_B64 = 7_000_000; // ~5 MB binary
  const validImages = images.slice(0, 6).filter((img) =>
    img && typeof img === 'object'
    && ALLOWED_MEDIA.has(img.media_type)
    && typeof img.data === 'string'
    && img.data.length > 100
    && img.data.length < MAX_IMG_B64
  );

  if (text.length < 20 && validImages.length === 0) {
    res.status(400).json({ error: 'Either text (≥20 chars) or at least one image is required.' });
    return;
  }

  // Truncate very large documents — keep token budget bounded. 40K
  // chars ≈ 10K tokens, fits comfortably in a single Claude request.
  const TEXT_CAP = 40_000;
  const clipped = text.length > TEXT_CAP ? text.slice(0, TEXT_CAP) : text;
  const truncated = text.length > TEXT_CAP;

  const apiKey = readEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    // Without an LLM key we can't do real extraction. Return an empty
    // result + a clear flag so the UI tells the admin to set the key.
    res.status(200).json({
      mode: 'unavailable',
      summary: 'AI ingestion requires ANTHROPIC_API_KEY in the Vercel project env.',
      extractedRows: [],
      flags: ['LLM is not configured. Set ANTHROPIC_API_KEY in Vercel env to enable document extraction.'],
    });
    return;
  }

  try {
    // Multimodal content: image blocks first (Claude does better when
    // visuals lead) + a text block with hint + transcribed text.
    const content = [];
    for (const img of validImages) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: img.media_type, data: img.data },
      });
    }
    content.push({ type: 'text', text: buildUserMessage(clipped || '(no transcribed text — read the image(s))', hint) });

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        // Phase 95: bump ingestion to Opus 4.7 too. Document
        // extraction often hinges on vision + handwriting OCR +
        // multi-page reasoning where Opus's extra capability
        // materially reduces error rate. Cost is bearable because
        // ingestion is admin-initiated (not user-facing) + each
        // run is a single call.
        model: 'claude-opus-4-7',
        max_tokens: 6000,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content },
        ],
      }),
    });

    if (!apiRes.ok) {
      let detail = '';
      try {
        const errBody = await apiRes.json();
        detail = errBody?.error?.message || errBody?.message || JSON.stringify(errBody);
      } catch {
        try { detail = await apiRes.text(); } catch {}
      }
      res.status(502).json({ error: `Anthropic API ${apiRes.status}${detail ? ` — ${detail}` : ''}` });
      return;
    }

    const json = await apiRes.json();
    const out = (json.content || [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n\n');
    const parsed = tryParseJson(out);
    if (!parsed) {
      res.status(502).json({ error: 'Could not parse JSON from LLM response' });
      return;
    }

    const extractedRows = Array.isArray(parsed.extractedRows)
      ? parsed.extractedRows
          .filter((r) => r && typeof r === 'object' && ALLOWED_TABLES.has(r.table))
          .slice(0, 100) // Opus + bigger token budget can emit more rows
          .map((r) => ({
            table:          String(r.table),
            scope:          String(r.scope || '').slice(0, 30),
            confidence:     ['high','medium','low'].includes(r.confidence) ? r.confidence : 'low',
            fields:         (r.fields && typeof r.fields === 'object') ? r.fields : {},
            provenance:     ['measured','cited','estimated'].includes(r.provenance) ? r.provenance : 'estimated',
            sourceQuote:    String(r.sourceQuote || '').slice(0, 400),
            sourceDocument: String(r.sourceDocument || '').slice(0, 200),
          }))
      : [];

    const flags = Array.isArray(parsed.flags)
      ? parsed.flags.slice(0, 10).map((f) => String(f).slice(0, 280))
      : [];
    if (truncated) flags.unshift(`Document was truncated to ${TEXT_CAP.toLocaleString()} chars before extraction; later content was not processed.`);
    if (validImages.length > 0) flags.unshift(`${validImages.length} image${validImages.length === 1 ? '' : 's'} processed via Claude vision.`);

    res.status(200).json({
      mode: 'llm',
      summary: String(parsed.summary || '').slice(0, 500),
      extractedRows,
      flags,
    });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || 'extraction failed') });
  }
}
