// Client-side SSE consumer for the Anthropic-backed admin endpoints.
// Counterpart to server-side openSSE() in anthropicStream.js.
//
// Wire protocol (per src/utils/anthropicStream.js):
//   event: progress  — { charCount } accumulated text length
//   event: delta     — { text } per-chunk text delta (chat endpoints)
//   event: thinking  — { charCount } accumulated thinking length
//   event: done      — final payload (per-endpoint shape)
//   event: error     — { message }
//
// Returns { mode: 'llm', ...donePayload }. Throws if the stream errors
// or ends without a 'done' event.

export async function parseSSE(response, onDelta, onProgress, onThinking) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let final = null;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf('\n\n')) >= 0) {
      const chunk = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const eventLine = chunk.split('\n').find((l) => l.startsWith('event: '));
      const dataLine  = chunk.split('\n').find((l) => l.startsWith('data: '));
      if (!eventLine || !dataLine) continue;
      const event = eventLine.slice(7).trim();
      let payload = null;
      try { payload = JSON.parse(dataLine.slice(6)); } catch {}
      if (!payload) continue;
      if      (event === 'progress' && onProgress) onProgress(payload);
      else if (event === 'delta'    && onDelta)    onDelta(payload);
      else if (event === 'thinking' && onThinking) onThinking(payload);
      else if (event === 'done')                   final = payload;
      else if (event === 'error')                  throw new Error(payload.message || 'stream error');
    }
  }
  if (!final) throw new Error('Stream ended without a result');
  return { mode: 'llm', ...final };
}
