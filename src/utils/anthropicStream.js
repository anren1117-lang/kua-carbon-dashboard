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

/**
 * Phase 157+: progressive item extraction during JSON streaming.
 *
 * Returns a stepper function. Each call passes the accumulating
 * fullText; the stepper returns any TOP-LEVEL items that have just
 * been completed inside the array reachable from `arrayKey`.
 *
 * Tracks brace depth + string state across calls so the work is O(N)
 * across the whole stream (not O(N²) per delta).
 *
 *   const step = createItemExtractor('plan');
 *   while (streaming) {
 *     fullText += delta;
 *     for (const itemText of step(fullText)) {
 *       try { send('item', JSON.parse(itemText)); } catch {}
 *     }
 *   }
 *
 * @param {string} arrayKey  JSON key whose array elements to extract
 *                           ("plan", "extractedRows", etc.)
 */
export function createItemExtractor(arrayKey) {
  const needle = `"${arrayKey}"`;
  const state = {
    pos: 0,
    arrayStart: -1,
    depth: 0,
    inString: false,
    escape: false,
    itemStart: -1,
    finished: false,
  };
  return function step(fullText) {
    const items = [];
    if (state.finished) return items;
    if (state.arrayStart < 0) {
      const keyIdx = fullText.indexOf(needle, state.pos);
      if (keyIdx < 0) {
        // Stay close to the tail so we re-check newly arrived bytes
        // without re-scanning the whole accumulator.
        state.pos = Math.max(0, fullText.length - needle.length);
        return items;
      }
      const bracket = fullText.indexOf('[', keyIdx);
      if (bracket < 0) {
        state.pos = keyIdx;
        return items;
      }
      state.arrayStart = bracket + 1;
      state.pos = state.arrayStart;
    }
    for (let i = state.pos; i < fullText.length; i++) {
      const c = fullText[i];
      if (state.escape) { state.escape = false; continue; }
      if (c === '\\' && state.inString) { state.escape = true; continue; }
      if (state.inString) {
        if (c === '"') state.inString = false;
        continue;
      }
      if (c === '"') { state.inString = true; continue; }
      if (c === '{') {
        if (state.depth === 0) state.itemStart = i;
        state.depth += 1;
      } else if (c === '}') {
        state.depth -= 1;
        if (state.depth === 0 && state.itemStart >= 0) {
          items.push(fullText.slice(state.itemStart, i + 1));
          state.itemStart = -1;
        }
      } else if (c === ']' && state.depth === 0) {
        state.finished = true;
        state.pos = i + 1;
        return items;
      }
    }
    state.pos = fullText.length;
    return items;
  };
}
