// Shared helpers for streaming Anthropic responses through SSE to the
// admin dashboard. Centralizes the pattern so every admin AI endpoint
// uses the same protocol:
//
//   event: progress    — { charCount } accumulated so far
//   event: delta       — { text } per-chunk text delta (chat endpoints)
//   event: done        — final payload (per-endpoint shape)
//   event: error       — { message }
//
// Server side: openSSE(res) sets the headers. streamAnthropicJson()
// runs the Anthropic call + returns the accumulated text. Caller
// then parses / wraps as needed for their 'done' shape.

export function openSSE(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  return (event, payload) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
  };
}

/**
 * Calls Anthropic with stream:true and pipes deltas back as SSE events
 * via the provided `send` function. Returns { ok, text, error } once
 * the stream completes.
 *
 * mode 'progress' — emit one 'progress' event every ~200 chars
 *                   (good for big JSON outputs like plan + ingestion).
 * mode 'token'    — emit one 'delta' event per text chunk
 *                   (good for chat where typewriter feel matters).
 */
export async function streamAnthropicJson({
  apiKey,
  send,
  body,
  mode = 'progress',
  progressInterval = 200,
}) {
  const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ ...body, stream: true }),
  });
  if (!apiRes.ok || !apiRes.body) {
    let detail = '';
    try { const b = await apiRes.json(); detail = b?.error?.message || JSON.stringify(b); } catch {}
    send('error', { message: `Anthropic API ${apiRes.status}${detail ? ` — ${detail}` : ''}` });
    return { ok: false, text: '' };
  }
  const reader = apiRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';
  let chunkSinceProgress = 0;
  // Phase 154: capture Anthropic's usage block from message_start +
  // message_delta events so callers can surface "this generation
  // cost $X / used Y tokens" telemetry.
  const usage = { inputTokens: 0, outputTokens: 0, cacheCreationInputTokens: 0, cacheReadInputTokens: 0 };
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf('\n\n')) >= 0) {
      const chunk = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const dataLine = chunk.split('\n').find((l) => l.startsWith('data: '));
      if (!dataLine) continue;
      try {
        const ev = JSON.parse(dataLine.slice(6));
        if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
          const t = ev.delta.text || '';
          full += t;
          if (mode === 'token') {
            send('delta', { text: t });
          } else {
            chunkSinceProgress += t.length;
            if (chunkSinceProgress >= progressInterval) {
              send('progress', { charCount: full.length });
              chunkSinceProgress = 0;
            }
          }
        } else if (ev.type === 'message_start' && ev.message?.usage) {
          const u = ev.message.usage;
          usage.inputTokens = u.input_tokens || 0;
          usage.cacheCreationInputTokens = u.cache_creation_input_tokens || 0;
          usage.cacheReadInputTokens = u.cache_read_input_tokens || 0;
        } else if (ev.type === 'message_delta' && ev.usage) {
          usage.outputTokens = ev.usage.output_tokens || usage.outputTokens;
        } else if (ev.type === 'message_stop') {
          // Anthropic done.
          break;
        }
      } catch { /* ignore malformed event */ }
    }
  }
  return { ok: true, text: full, usage };
}

export function tryParseJsonLoose(text) {
  const match = (text || '').match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}
