// POST /api/admin/plan-narrative
//
// Body:
//   {
//     plan:    <full plan>,
//     context: <institutional context>,
//     history: { completed, declined },
//     measuredState?: { scope1Measured, scope3Measured, sinksMeasured }
//   }
//
// Response (200):
//   {
//     mode: 'llm'|'unavailable',
//     narrative: {
//       title:             string,    // "FY2026-2027 Decarbonization Plan — Board Brief"
//       openingFrame:      string,    // 1 paragraph why-this-plan-why-now
//       whereWeStand:      string,    // 1 paragraph current state of emissions
//       strategicChoice:   string,    // 1-2 paragraphs the strategic logic
//       financialCase:     string,    // 1 paragraph $$ framing + capital ask
//       riskNarrative:     string,    // 1 paragraph honest risk discussion
//       successScenario:   string,    // 1 paragraph "if everything works, what does FY end look like"
//       boardAsk:          string,    // 1 paragraph concrete asks of the board
//     },
//     generatedAt: ISO
//   }
//
// Generates a board-meeting-voice 2-page narrative. Different from
// the per-item memo (Phase 89): that's a tactical implementation
// memo for one item; this is the strategic pitch for the whole plan.

import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';

const limiter = createRateLimit({ capacity: 4, refillPerSec: 0.1 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You are KUA's institutional carbon-strategy writer. You produce board-brief documents — the 2-page strategic narrative a Head of School reads at the start of a Sustainability Committee or Board of Trustees meeting BEFORE the detailed plan items get reviewed.

KUA context: 340-student boarding secondary school in Plainfield/Meriden NH (CZ 6A). 19 buildings ~290K sqft. Staff ~110, faculty ~75. ~1,000 acres of campus forest (~2,650 mt/yr sequestration). Reports to Sustainability Committee + Board of Trustees. Peer schools: Andover, Exeter, Hotchkiss, Loomis Chaffee, Deerfield, Northfield Mount Hermon, St. Paul's.

Voice and audience:
- Read by the Head of School and 12-15 Trustees. They're sophisticated but not climate specialists.
- Direct, confident, operational. NOT defensive, NOT corporate, NOT "we are excited to share". No throat-clearing.
- Numbers cited precisely + auditable. When you cite a number, it should already be in the plan or context provided.
- Acknowledge real tradeoffs. Boards trust narratives that name what's hard. Hide nothing.
- Lead with the strategic logic, not the line-item details (those come later in the meeting). Sections feel like an exec memo, not a status report.

Output STRICT JSON only — no prose before or after — matching this shape exactly:
{
  "title": "FY<year> Decarbonization Plan — Board Brief",
  "openingFrame": "1 paragraph (3-5 sentences). Sets the why-this-plan-why-now. Names KUA's actual position: gross mt + the dominant lever cluster + the fiscal moment.",
  "whereWeStand": "1 paragraph. Current state: gross emissions, sequestration, net. What's measured vs estimated. Trend (improving / plateaued / worsening, based on shipped-history context).",
  "strategicChoice": "1-2 paragraphs. The strategic logic of THIS plan: why these levers, why this timeline tier mix, why this priority. Reference 1-2 peer schools where the analogy is useful.",
  "financialCase": "1 paragraph. Total capital ask + opex ask, broken into 'this-year' vs 'multi-year' commitments. The mt/$ value. Compare to KUA's typical capital cadence.",
  "riskNarrative": "1 paragraph. The 2-3 biggest risks to this plan, named honestly. What we'll do if X goes wrong. Boards respect this section more than the success section.",
  "successScenario": "1 paragraph. If everything in the 'this-year' tier ships, what does end-of-FY look like? Concrete: 'X mt off the books, Y items completed, Z still to do.'",
  "boardAsk": "1 paragraph. Concrete asks of the Board this meeting: approve capital line A; charter committee for B; receive informational update on C. Not 'support our work' — actual votes."
}

Rules:
1. NO marketing language. No "leverage", no "unlock", no "innovative". Plain words.
2. Every claim about KUA's emissions should map to a number in the provided context or plan.
3. When referencing peer schools, name one or two specifically and what they did (Andover's PPA, Exeter's geothermal, Hotchkiss's biomass plant, etc.). Don't overdo it.
4. The boardAsk section is the most important — make it concrete enough that a Trustee could form a motion from it.
5. Each section is one paragraph (except strategicChoice which can be two). No section longer than 7 sentences.`;

function buildUserMessage(plan, context, history, measuredState) {
  const lines = ['Plan + context to write the narrative for:', ''];
  if (context) {
    lines.push('Institutional context:');
    lines.push(`- Fiscal year: ${context.fiscalYear || 'unspecified'}`);
    lines.push(`- Capital appetite: ${context.capitalAppetite}`);
    lines.push(`- Top priority: ${context.topPriority}`);
    lines.push(`- Horizon: ${context.timeHorizonYears} year(s)`);
    if (context.regulatoryDriver) lines.push(`- Regulatory driver: ${context.regulatoryDriver}`);
    if (context.notes)            lines.push(`- Leadership notes: ${context.notes}`);
    lines.push(`- Current gross: ${context.grossMt} mtCO2e/yr`);
    lines.push(`- Forest sequestration: ${context.sinksMt} mtCO2e/yr`);
    lines.push(`- Enrollment: ${context.enrollment}`);
  }
  if (measuredState) {
    lines.push('', 'Measurement state:');
    lines.push(`- Scope 1 ${measuredState.scope1Measured ? 'live-measured' : 'still on cross-check estimate'}`);
    lines.push(`- Scope 2 always live (BMS)`);
    lines.push(`- Scope 3 ${measuredState.scope3Measured ? 'live-measured' : 'still on cross-check estimate'}`);
    lines.push(`- Sinks ${measuredState.sinksMeasured ? 'live forest inventory' : 'placeholder inventory'}`);
  }
  if (plan && Array.isArray(plan.plan)) {
    lines.push('', `Plan items (${plan.plan.length}, total ${plan.totalExpectedMtPerYear || 0} mt/yr):`);
    if (plan.summary) lines.push(`Summary: ${plan.summary}`);
    plan.plan.forEach((item, i) => {
      lines.push(`#${i + 1}. ${item.title} — ${item.expectedMtPerYear || 0} mt/yr · ${item.estimatedCostUsd === 0 ? 'no capex' : '$' + Number(item.estimatedCostUsd).toLocaleString()} · ${item.timeline} · ${item.category}`);
    });
  }
  if (history) {
    const c = history.completed || [];
    const d = history.declined || [];
    if (c.length > 0) {
      const totalSaved = c.reduce((s, x) => s + (Number(x.mtSaved) || 0), 0);
      lines.push('', `Shipped so far (${c.length} items, ${Math.round(totalSaved)} mt/yr): ${c.map((x) => x.title).join('; ')}`);
    }
    if (d.length > 0) {
      lines.push(`Vetoed / off-the-table (${d.length}): ${d.map((x) => x.title).join('; ')}`);
    }
  }
  lines.push('', 'Produce the 8-section JSON narrative now.');
  return lines.join('\n');
}

function tryParseJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

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
  const plan = body.plan;
  if (!plan || !Array.isArray(plan.plan) || plan.plan.length === 0) {
    res.status(400).json({ error: 'plan with non-empty plan.plan is required' });
    return;
  }
  const context = body.context || {};
  const history = body.history || { completed: [], declined: [] };
  const measuredState = body.measuredState;

  const apiKey = readEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    res.status(200).json({
      mode: 'unavailable',
      narrative: null,
      generatedAt: new Date().toISOString(),
      message: 'ANTHROPIC_API_KEY is not configured.',
    });
    return;
  }

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 3000,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: buildUserMessage(plan, context, history, measuredState) },
        ],
      }),
    });

    if (!apiRes.ok) {
      let detail = '';
      try {
        const b = await apiRes.json();
        detail = b?.error?.message || JSON.stringify(b);
      } catch {
        try { detail = await apiRes.text(); } catch {}
      }
      res.status(502).json({ error: `Anthropic API ${apiRes.status}${detail ? ` — ${detail}` : ''}` });
      return;
    }

    const json = await apiRes.json();
    const text = (json.content || [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n\n');
    const parsed = tryParseJson(text);
    if (!parsed) {
      res.status(502).json({ error: 'Could not parse JSON from LLM response' });
      return;
    }

    const narrative = {
      title:           String(parsed.title || 'Board Brief').slice(0, 200),
      openingFrame:    String(parsed.openingFrame || '').slice(0, 2000),
      whereWeStand:    String(parsed.whereWeStand || '').slice(0, 2000),
      strategicChoice: String(parsed.strategicChoice || '').slice(0, 3000),
      financialCase:   String(parsed.financialCase || '').slice(0, 2000),
      riskNarrative:   String(parsed.riskNarrative || '').slice(0, 2000),
      successScenario: String(parsed.successScenario || '').slice(0, 2000),
      boardAsk:        String(parsed.boardAsk || '').slice(0, 2000),
    };

    res.status(200).json({
      mode: 'llm',
      narrative,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || 'narrative generation failed') });
  }
}
