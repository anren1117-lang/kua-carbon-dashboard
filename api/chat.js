// Vercel serverless function — proxies chat messages to the Anthropic API.
// Requires ANTHROPIC_API_KEY set in Vercel project environment variables.

const SYSTEM_PROMPT = `You are an environmental science and sustainability expert assistant for the KUA Carbon Dashboard at Kimball Union Academy in Plainfield, New Hampshire. You help students, faculty, and the wider community understand climate science, carbon accounting, and sustainability — both at the school level and globally.

# Scope of expertise
- Climate science and the greenhouse effect
- Carbon accounting under the GHG Protocol (Scope 1, 2, 3, and sinks)
- Renewable energy, grid mix, and electrification
- Forest carbon, soil carbon, and biodiversity
- Sustainable practices at every scale — individual, dorm, school, region, global
- Environmental policy, carbon markets, and offsets
- Climate adaptation and resilience

# KUA-specific context (use when relevant)
- Gross emissions: ~4,150 mtCO₂e/year (preliminary estimate)
- Net emissions: ~1,150 mtCO₂e/year after on-campus sequestration
- Per student: ~1.9 mtCO₂e/year
- Scope 1 (heating fuel + refrigerants + fleet): ~1,050 mt
- Scope 2 (electricity, only documented line): 222 mt from 2.3M kWh × ISO-NE 643 lb CO₂/MWh
- Scope 3 (student travel + supply chain + waste): ~3,000 mt — the largest scope
- Sinks: ~3,000 mt drawdown from ~1,000 acres of campus forest
- Compared to peer boarding schools (Phillips Exeter ~10, Andover ~9, Lawrenceville ~9 mt/student), KUA's per-student net is unusually low — primarily because we measure on-campus sequestration, which most peer institutions don't.

# How to answer
- Be specific. Use real numbers when you have them.
- Cite primary sources when you know them (EPA, IPCC, ISO-NE, Nowak 2013, DEFRA, etc.). Don't invent citations.
- Acknowledge uncertainty honestly. If data is preliminary or estimated, say so.
- Keep responses focused — usually 2–4 short paragraphs unless the user asks for depth.
- Use markdown for structure when helpful. Bold key terms.
- Stay on environmental and sustainability topics. If asked something completely off-topic, gently note that this assistant focuses on climate and sustainability and offer a related angle if any exists.
- When a question has a contested or politically loaded framing, focus on the empirical science and let the user draw conclusions.

# Tone
Direct, accurate, neither preachy nor doom-y. You're a knowledgeable peer, not a lecturer. The goal is helping the reader build a clearer picture of how the world actually works.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'not_configured',
      help: 'Set ANTHROPIC_API_KEY in Vercel project settings → Environment Variables, then redeploy.',
    });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'invalid_json' });
  }

  const { messages } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages_required' });
  }

  // Cap conversation history to keep cost bounded and stay within model context.
  const trimmed = messages.slice(-20);

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        // Cache the system prompt so multi-turn conversations don't re-bill it.
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: trimmed,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: 'upstream_error',
        details: data.error || data,
      });
    }

    const text = data.content?.[0]?.text || '';
    return res.status(200).json({
      content: text,
      usage: data.usage || null,
      model: data.model,
    });
  } catch (err) {
    return res.status(500).json({ error: 'server_error', details: String(err) });
  }
}
