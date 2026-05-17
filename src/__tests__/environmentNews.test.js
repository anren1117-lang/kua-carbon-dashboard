// Tests for /api/environment-news — the public environmental news
// feed handler. Anthropic + web_search lookup is mocked; assertions
// focus on the guard rails (method gate, config gate, rate limit,
// cache behavior, validation of returned items, force-refresh) since
// those are what protect the wallet on a public endpoint.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import handler, { _resetEnvironmentNewsCache } from '../../api/environment-news.js';

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
  await handler(req, w.res);
  return w;
}
let ipCounter = 0;
const get = (over = {}) => ({
  method: 'GET',
  headers: { 'x-forwarded-for': `news-test-${++ipCounter}` },
  query: {},
  body: {},
  ...over,
});

// Build a plausible Anthropic response containing a JSON block with N
// items. The handler tolerates any text wrapping the JSON; here we
// give it clean JSON so parsing always succeeds.
function anthropicWith(items, { ok = true, status = 200, model = 'claude-sonnet-4-6' } = {}) {
  return {
    ok, status,
    json: async () => ({
      content: [{ type: 'text', text: JSON.stringify({ items }) }],
      model,
      usage: { input_tokens: 100, output_tokens: 200 },
    }),
  };
}
const goodItem = (over = {}) => ({
  headline: 'IPCC: warming on track to exceed 1.5 °C',
  summary: 'The latest IPCC assessment projects warming will pass 1.5 °C in the early 2030s under current policies.',
  topic: 'climate',
  sourceName: 'IPCC',
  sourceUrl: 'https://www.ipcc.ch/example',
  dateApprox: '2026-05',
  ...over,
});

let savedKey;
beforeEach(() => {
  savedKey = process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY = 'test-key';
  _resetEnvironmentNewsCache();
});
afterEach(() => {
  if (savedKey === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = savedKey;
  vi.unstubAllGlobals();
});

describe('/api/environment-news — guard rails', () => {
  it('rejects a PUT with 405 + Allow', async () => {
    const r = await call({ method: 'PUT', headers: {}, query: {} });
    expect(r.statusCode).toBe(405);
    expect(r.headers.Allow).toBe('GET, POST');
  });

  it('503s when ANTHROPIC_API_KEY is not configured', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const r = await call(get());
    expect(r.statusCode).toBe(503);
    expect(r.body.error).toBe('not_configured');
  });

  it('rate-limits a single IP past the burst capacity', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => anthropicWith([goodItem()])));
    const ip = 'news-burst';
    let limited = null;
    for (let i = 0; i < 10; i++) {
      const r = await call({ method: 'GET', headers: { 'x-forwarded-for': ip }, query: {} });
      if (r.statusCode === 429) { limited = r; break; }
    }
    expect(limited).not.toBeNull();
    expect(limited.body.error).toBe('rate_limited');
    expect(limited.headers['Retry-After']).toBeDefined();
  });
});

describe('/api/environment-news — happy path + validation', () => {
  it('returns the cleaned items with metadata on a fresh fetch', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => anthropicWith([goodItem()])));
    const r = await call(get());
    expect(r.statusCode).toBe(200);
    expect(r.body.items).toHaveLength(1);
    expect(r.body.items[0]).toMatchObject({
      headline: expect.stringContaining('IPCC'),
      topic: 'climate',
      sourceUrl: 'https://www.ipcc.ch/example',
    });
    expect(r.body.generatedAt).toBeDefined();
    expect(r.body.fromCache).toBe(false);
  });

  it('drops items with a missing or non-https sourceUrl', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => anthropicWith([
      goodItem({ headline: 'keep' }),
      goodItem({ headline: 'drop-no-url', sourceUrl: undefined }),
      goodItem({ headline: 'drop-bad-protocol', sourceUrl: 'javascript:alert(1)' }),
      goodItem({ headline: 'drop-empty-string', sourceUrl: '' }),
    ])));
    const r = await call(get());
    expect(r.body.items.map((x) => x.headline)).toEqual(['keep']);
  });

  it('falls back to "climate" for an unknown topic', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => anthropicWith([goodItem({ topic: 'invented' })])));
    const r = await call(get());
    expect(r.body.items[0].topic).toBe('climate');
  });

  it('502s on an unparseable Anthropic response', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true, status: 200,
      json: async () => ({ content: [{ type: 'text', text: 'not json' }] }),
    })));
    const r = await call(get());
    expect(r.statusCode).toBe(502);
    expect(r.body.error).toBe('unparseable_response');
  });

  it('502s when every returned item fails validation (no_valid_items)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => anthropicWith([
      goodItem({ sourceUrl: 'javascript:alert(1)' }),
    ])));
    const r = await call(get());
    expect(r.statusCode).toBe(502);
    expect(r.body.error).toBe('no_valid_items');
  });

  it('passes the upstream Anthropic status through on failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false, status: 429, json: async () => ({ error: { type: 'overloaded' } }),
    })));
    const r = await call(get());
    expect(r.statusCode).toBe(429);
    expect(r.body.error).toBe('upstream_error');
  });
});

describe('/api/environment-news — caching', () => {
  it('serves the cached payload (fromCache: true) without re-billing Anthropic', async () => {
    const fetchMock = vi.fn(async () => anthropicWith([goodItem()]));
    vi.stubGlobal('fetch', fetchMock);

    const first  = await call(get());
    const second = await call(get());

    expect(first.body.fromCache).toBe(false);
    expect(second.body.fromCache).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(second.body.items).toEqual(first.body.items);
  });

  it('force=true (query param) bypasses the cache and re-fetches', async () => {
    const fetchMock = vi.fn(async () => anthropicWith([goodItem()]));
    vi.stubGlobal('fetch', fetchMock);

    await call(get());
    await call(get({ query: { force: 'true' } }));

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('force=true (POST body) also bypasses the cache', async () => {
    const fetchMock = vi.fn(async () => anthropicWith([goodItem()]));
    vi.stubGlobal('fetch', fetchMock);

    await call(get());
    await call(get({ method: 'POST', body: { force: true } }));

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
