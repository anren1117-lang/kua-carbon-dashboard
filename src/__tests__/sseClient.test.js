// Unit tests for parseSSE — the client-side consumer for streaming
// admin AI responses. Locks in the wire-protocol contract (delta /
// progress / thinking / done / error) so future endpoint additions
// can't silently break the four call sites in AdminPlanAgent.js.

import { describe, it, expect, vi } from 'vitest';
import { parseSSE } from '../utils/sseClient.js';

// Build a fake Response whose body streams the given chunks (strings)
// in order. Each chunk is encoded as bytes; consumers see them through
// the same .body.getReader() + Uint8Array path as a real fetch().
function fakeSSEResponse(chunks) {
  const encoder = new TextEncoder();
  const queue = chunks.map((c) => encoder.encode(c));
  let i = 0;
  return {
    body: {
      getReader() {
        return {
          async read() {
            if (i >= queue.length) return { value: undefined, done: true };
            const value = queue[i++];
            return { value, done: false };
          },
        };
      },
    },
  };
}

// Convenience: turn a single (event, payload) into wire bytes.
const wire = (event, payload) =>
  `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;

describe('parseSSE', () => {
  it('returns the done payload merged with mode:"llm"', async () => {
    const r = fakeSSEResponse([wire('done', { plan: ['a', 'b'], usage: { inputTokens: 100 } })]);
    const out = await parseSSE(r);
    expect(out).toEqual({ mode: 'llm', plan: ['a', 'b'], usage: { inputTokens: 100 } });
  });

  it('forwards delta events to onDelta', async () => {
    const onDelta = vi.fn();
    const r = fakeSSEResponse([
      wire('delta', { text: 'Hello ' }),
      wire('delta', { text: 'world' }),
      wire('done',  { reply: 'Hello world' }),
    ]);
    const out = await parseSSE(r, onDelta);
    expect(onDelta).toHaveBeenCalledTimes(2);
    expect(onDelta).toHaveBeenNthCalledWith(1, { text: 'Hello ' });
    expect(onDelta).toHaveBeenNthCalledWith(2, { text: 'world' });
    expect(out.reply).toBe('Hello world');
  });

  it('forwards progress events to onProgress', async () => {
    const onProgress = vi.fn();
    const r = fakeSSEResponse([
      wire('progress', { charCount: 200 }),
      wire('progress', { charCount: 400 }),
      wire('done',     { ok: true }),
    ]);
    await parseSSE(r, undefined, onProgress);
    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress).toHaveBeenNthCalledWith(2, { charCount: 400 });
  });

  it('forwards thinking events to onThinking (Phase 174 contract)', async () => {
    const onThinking = vi.fn();
    const r = fakeSSEResponse([
      wire('thinking', { charCount: 800 }),
      wire('thinking', { charCount: 1600 }),
      wire('thinking', { charCount: 2400 }),
      wire('done',     { reply: 'done' }),
    ]);
    await parseSSE(r, undefined, undefined, onThinking);
    expect(onThinking).toHaveBeenCalledTimes(3);
    expect(onThinking).toHaveBeenLastCalledWith({ charCount: 2400 });
  });

  it('does not call thinking callback when none provided (backward compat)', async () => {
    // Earlier callers (diff, alternatives) pass parseSSE(r) with no
    // callbacks — server-side thinking events must not crash them.
    const r = fakeSSEResponse([
      wire('thinking', { charCount: 500 }),
      wire('done',     { ok: true }),
    ]);
    await expect(parseSSE(r)).resolves.toEqual({ mode: 'llm', ok: true });
  });

  it('throws when the server sends an error event', async () => {
    const r = fakeSSEResponse([wire('error', { message: 'rate limited' })]);
    await expect(parseSSE(r)).rejects.toThrow('rate limited');
  });

  it('throws when the server omits a message on the error event', async () => {
    const r = fakeSSEResponse([wire('error', {})]);
    await expect(parseSSE(r)).rejects.toThrow('stream error');
  });

  it('throws when the stream closes without a done event', async () => {
    const r = fakeSSEResponse([wire('progress', { charCount: 100 })]);
    await expect(parseSSE(r)).rejects.toThrow('Stream ended without a result');
  });

  it('handles an event split across multiple chunks', async () => {
    // Real fetch streams arrive in arbitrary byte boundaries — the
    // parser must buffer until \n\n is seen.
    const full = wire('done', { ok: true, score: 42 });
    const cut = Math.floor(full.length / 2);
    const r = fakeSSEResponse([full.slice(0, cut), full.slice(cut)]);
    const out = await parseSSE(r);
    expect(out).toEqual({ mode: 'llm', ok: true, score: 42 });
  });

  it('handles multiple events arriving in a single chunk', async () => {
    const onDelta = vi.fn();
    const r = fakeSSEResponse([
      wire('delta', { text: 'A' }) + wire('delta', { text: 'B' }) + wire('done', { ok: true }),
    ]);
    await parseSSE(r, onDelta);
    expect(onDelta).toHaveBeenCalledTimes(2);
  });

  it('ignores chunks with malformed JSON in the data line', async () => {
    // The server should never send this, but if it does, we shouldn't
    // crash the whole stream — skip the bad chunk and keep going.
    const r = fakeSSEResponse([
      'event: delta\ndata: {not-json}\n\n',
      wire('done', { ok: true }),
    ]);
    const onDelta = vi.fn();
    const out = await parseSSE(r, onDelta);
    expect(onDelta).not.toHaveBeenCalled();
    expect(out.ok).toBe(true);
  });
});
