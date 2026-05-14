// Smoke tests for /api/chat — the public environmental chatbot. It's
// the one /api/* handler apiRoutes.test.js doesn't cover, and the
// module comment flags it as a real wallet risk (each turn can run up
// to 5 paid web searches plus LLM tokens), so its guard rails — method
// gate, config gate, body validation, rate limiting — need pinning.
//
// The Anthropic call is mocked; these tests never hit the network.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import chatHandler from '../../api/chat.js';

function makeRes() {
  let statusCode = 200, body = null;
  const headers = {};
  const res = {
    status(c) { statusCode = c; return res; },
    json(p) { body = p; return res; },
    setHeader(k, v) { headers[k] = v; return res; },
  };
  return { res, get statusCode() { return statusCode; }, get body() { return body; }, get headers() { return headers; } };
}
async function call(req) {
  const w = makeRes();
  await chatHandler(req, w.res);
  return w;
}
// Each test that reaches the rate limiter gets a unique IP so the
// module-level token bucket can't leak state across tests.
let ipCounter = 0;
const post = (body, headers = {}) => ({
  method: 'POST',
  body,
  headers: { 'x-forwarded-for': `chat-test-${++ipCounter}`, ...headers },
});

// A minimal but realistic Anthropic /v1/messages response.
function anthropicResponse(content) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ content, usage: { input_tokens: 10, output_tokens: 20 }, model: 'claude-sonnet-4-6' }),
  };
}

let savedKey;
beforeEach(() => {
  savedKey = process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY = 'test-key';
});
afterEach(() => {
  if (savedKey === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = savedKey;
  vi.unstubAllGlobals();
});

describe('/api/chat — guard rails', () => {
  it('405s a non-POST request with an Allow header', async () => {
    const r = await call({ method: 'GET', headers: {} });
    expect(r.statusCode).toBe(405);
    expect(r.body.error).toBe('method_not_allowed');
    expect(r.headers.Allow).toBe('POST');
  });

  it('503s when ANTHROPIC_API_KEY is not configured', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const r = await call(post({ messages: [{ role: 'user', content: 'hi' }] }));
    expect(r.statusCode).toBe(503);
    expect(r.body.error).toBe('not_configured');
  });

  it('400s an unparseable JSON string body', async () => {
    const r = await call(post('{not valid json'));
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toBe('invalid_json');
  });

  it('400s when messages is missing, empty, or not an array', async () => {
    for (const body of [{}, { messages: [] }, { messages: 'nope' }]) {
      const r = await call(post(body));
      expect(r.statusCode).toBe(400);
      expect(r.body.error).toBe('messages_required');
    }
  });

  it('rate-limits a client past the burst capacity with a Retry-After header', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => anthropicResponse([{ type: 'text', text: 'ok' }])));
    const ip = 'chat-burst-ip';
    let rateLimited = null;
    // capacity is 20; the 21st request from one IP should trip.
    for (let i = 0; i < 25; i++) {
      const r = await call(post({ messages: [{ role: 'user', content: 'q' }] }, { 'x-forwarded-for': ip }));
      if (r.statusCode === 429) { rateLimited = r; break; }
    }
    expect(rateLimited).not.toBeNull();
    expect(rateLimited.body.error).toBe('rate_limited');
    expect(rateLimited.headers['Retry-After']).toBeDefined();
  });
});

describe('/api/chat — successful proxy', () => {
  it('returns concatenated text, citations, searched topics, usage, and model', async () => {
    const content = [
      { type: 'server_tool_use', name: 'web_search', input: { query: 'ISO-NE 2024 grid mix' } },
      { type: 'web_search_tool_result' },
      {
        type: 'text',
        text: 'The grid is getting cleaner.',
        citations: [
          { type: 'web_search_result_location', url: 'https://iso-ne.com/x', title: 'ISO-NE', cited_text: 'mix data' },
        ],
      },
      { type: 'text', text: 'Second paragraph.' },
    ];
    const fetchMock = vi.fn(async () => anthropicResponse(content));
    vi.stubGlobal('fetch', fetchMock);

    const r = await call(post({ messages: [{ role: 'user', content: 'is the grid cleaner?' }] }));

    expect(r.statusCode).toBe(200);
    expect(r.body.content).toBe('The grid is getting cleaner.\n\nSecond paragraph.');
    expect(r.body.citations).toEqual([
      { url: 'https://iso-ne.com/x', title: 'ISO-NE', cited_text: 'mix data' },
    ]);
    expect(r.body.searchedTopics).toEqual(['ISO-NE 2024 grid mix']);
    expect(r.body.usage).toEqual({ input_tokens: 10, output_tokens: 20 });
    expect(r.body.model).toBe('claude-sonnet-4-6');
  });

  it('caps forwarded conversation history at the last 20 messages', async () => {
    const fetchMock = vi.fn(async () => anthropicResponse([{ type: 'text', text: 'ok' }]));
    vi.stubGlobal('fetch', fetchMock);

    const messages = Array.from({ length: 25 }, (_, i) => ({ role: 'user', content: `msg ${i}` }));
    await call(post({ messages }));

    const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sentBody.messages).toHaveLength(20);
    expect(sentBody.messages[0].content).toBe('msg 5');   // last 20 → 5..24
    expect(sentBody.messages[19].content).toBe('msg 24');
  });

  it('passes the Anthropic upstream error status through', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false, status: 429, json: async () => ({ error: { type: 'overloaded' } }),
    })));
    const r = await call(post({ messages: [{ role: 'user', content: 'hi' }] }));
    expect(r.statusCode).toBe(429);
    expect(r.body.error).toBe('upstream_error');
  });

  it('500s when the upstream fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network down'); }));
    const r = await call(post({ messages: [{ role: 'user', content: 'hi' }] }));
    expect(r.statusCode).toBe(500);
    expect(r.body.error).toBe('server_error');
  });

  it('accepts an already-parsed object body (not just a JSON string)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => anthropicResponse([{ type: 'text', text: 'parsed ok' }])));
    const r = await call(post({ messages: [{ role: 'user', content: 'hi' }] }));
    expect(r.statusCode).toBe(200);
    expect(r.body.content).toBe('parsed ok');
  });
});
