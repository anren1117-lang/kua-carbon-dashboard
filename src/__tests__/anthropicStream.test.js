// Unit tests for the streaming helpers in src/utils/anthropicStream.js.
//
// Focus on createItemExtractor — Phase 157+158 use it to extract
// completed plan items / extracted rows from a streaming JSON blob.
// The state machine handles string-aware brace nesting, depth
// tracking across deltas (O(N) total), and graceful handling of
// partial input. Regression-test the tricky cases.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createItemExtractor, tryParseJsonLoose, streamAnthropicJson } from '../utils/anthropicStream.js';

describe('createItemExtractor', () => {
  it('returns no items when array key is not yet in the text', () => {
    const step = createItemExtractor('plan');
    expect(step('{"summary": "Across 12 items"')).toEqual([]);
    expect(step('{"summary": "Across 12 items", "thing": ')).toEqual([]);
  });

  it('extracts a single complete item across multiple deltas', () => {
    const step = createItemExtractor('plan');
    // Drip-feed the JSON one chunk at a time.
    expect(step('{"summary":"x","plan":[')).toEqual([]);
    expect(step('{"summary":"x","plan":[{"id":"01","title":"Heat pump"')).toEqual([]);
    const items = step('{"summary":"x","plan":[{"id":"01","title":"Heat pump"}');
    expect(items).toHaveLength(1);
    expect(JSON.parse(items[0])).toEqual({ id: '01', title: 'Heat pump' });
  });

  it('extracts multiple items as they finish, never re-emitting', () => {
    const step = createItemExtractor('plan');
    const stages = [
      '{"plan":[',
      '{"id":"01"',
      '{"id":"01","title":"A"}',
      '{"id":"01","title":"A"},{"id":"02"',
      '{"id":"01","title":"A"},{"id":"02","title":"B"}',
      '{"id":"01","title":"A"},{"id":"02","title":"B"},{"id":"03","title":"C"}',
    ];
    const emitted = [];
    let prefix = '';
    for (const tail of stages) {
      prefix = '{"plan":[' + tail.replace('{"plan":[', '');
      emitted.push(...step(prefix));
    }
    expect(emitted).toHaveLength(3);
    expect(JSON.parse(emitted[0])).toMatchObject({ id: '01', title: 'A' });
    expect(JSON.parse(emitted[1])).toMatchObject({ id: '02', title: 'B' });
    expect(JSON.parse(emitted[2])).toMatchObject({ id: '03', title: 'C' });
  });

  it('does not get fooled by braces or brackets inside string values', () => {
    const step = createItemExtractor('plan');
    // Title contains a "{" — naive depth counters would over-count.
    const text = '{"plan":[{"id":"01","title":"Step 1: open {dorm}"}]}';
    const items = step(text);
    expect(items).toHaveLength(1);
    expect(JSON.parse(items[0]).title).toBe('Step 1: open {dorm}');
  });

  it('handles escaped quotes inside strings', () => {
    const step = createItemExtractor('plan');
    // The escaped \" should NOT toggle inString — depth tracking must
    // keep going correctly across the closing brace.
    const text = '{"plan":[{"why":"He said \\"go for it\\" and we did"}]}';
    const items = step(text);
    expect(items).toHaveLength(1);
    expect(JSON.parse(items[0]).why).toBe('He said "go for it" and we did');
  });

  it('handles nested objects inside an item', () => {
    const step = createItemExtractor('plan');
    const text = '{"plan":[{"id":"01","sub":{"a":1,"b":{"c":2}}}]}';
    const items = step(text);
    expect(items).toHaveLength(1);
    expect(JSON.parse(items[0]).sub.b.c).toBe(2);
  });

  it('stops at the closing bracket of the array (no work past `]`)', () => {
    const step = createItemExtractor('plan');
    const text = '{"plan":[{"id":"01"}], "extra":{"weird":"after"}}';
    const items = step(text);
    expect(items).toHaveLength(1);
    // Subsequent calls return nothing — `finished` flag stops scanning.
    expect(step(text)).toEqual([]);
  });

  it('works with a different arrayKey (parameterized for ai-ingestion)', () => {
    const step = createItemExtractor('extractedRows');
    const text = '{"summary":"x","extractedRows":[{"table":"fuel_bills","gallons":100}]}';
    const items = step(text);
    expect(items).toHaveLength(1);
    expect(JSON.parse(items[0])).toMatchObject({ table: 'fuel_bills', gallons: 100 });
  });

  it('preserves cursor across calls — only emits each item once', () => {
    const step = createItemExtractor('plan');
    // First chunk contains a partially open item.
    const t1 = '{"plan":[{"id":"01","title":"in';
    expect(step(t1)).toEqual([]);
    // Second chunk finishes that item AND opens a partial next one.
    const t2 = t1 + 'flight"},{"id":"02","title":"';
    const after2 = step(t2);
    expect(after2).toHaveLength(1);
    expect(JSON.parse(after2[0]).id).toBe('01');
    // Third chunk closes the second item.
    const t3 = t2 + 'partial"}';
    const after3 = step(t3);
    expect(after3).toHaveLength(1);
    expect(JSON.parse(after3[0]).id).toBe('02');
    // Calling step on the same text again returns nothing (cursor
    // advanced past both items).
    expect(step(t3)).toEqual([]);
  });
});

describe('tryParseJsonLoose', () => {
  it('extracts the first JSON object from surrounding prose', () => {
    expect(tryParseJsonLoose('blah {"a":1} blah')).toEqual({ a: 1 });
  });

  it('returns null when there is no JSON object in the text', () => {
    expect(tryParseJsonLoose('no json here')).toBeNull();
    expect(tryParseJsonLoose('')).toBeNull();
    expect(tryParseJsonLoose(null)).toBeNull();
    expect(tryParseJsonLoose(undefined)).toBeNull();
  });

  it('returns null when the matched braces aren\'t valid JSON', () => {
    expect(tryParseJsonLoose('{not json at all}')).toBeNull();
  });
});

// --- streamAnthropicJson ----------------------------------------------
//
// Phase 180 funneled /plan + /ai-ingestion through this helper, so it
// now owns the entire server-side streaming contract: text
// accumulation, thinking deltas, usage capture, progress/delta events,
// and (with arrayKey) progressive item extraction. Mock global.fetch
// with a fake Anthropic SSE stream and assert on both the returned
// value and what the `send` callback received.

// Each Anthropic SSE event is `data: <json>\n\n` — the helper only
// reads the data: line. Build a Response-like object that streams the
// given events as bytes.
function fakeAnthropicStream(events, { ok = true, status = 200, errorBody } = {}) {
  const encoder = new TextEncoder();
  const chunks = events.map((ev) => encoder.encode(`data: ${JSON.stringify(ev)}\n\n`));
  let i = 0;
  return {
    ok,
    status,
    json: async () => errorBody || {},
    body: ok ? {
      getReader() {
        return {
          async read() {
            if (i >= chunks.length) return { value: undefined, done: true };
            return { value: chunks[i++], done: false };
          },
        };
      },
    } : null,
  };
}

const textDelta  = (text) => ({ type: 'content_block_delta', delta: { type: 'text_delta', text } });
const thinkDelta = (t)    => ({ type: 'content_block_delta', delta: { type: 'thinking_delta', thinking: t } });
const msgStart   = (u)    => ({ type: 'message_start', message: { usage: u } });
const msgDelta   = (u)    => ({ type: 'message_delta', usage: u });
const msgStop    = ()     => ({ type: 'message_stop' });

describe('streamAnthropicJson', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  function mockFetch(response) {
    vi.stubGlobal('fetch', vi.fn(async () => response));
  }

  it('accumulates text deltas and returns the full text', async () => {
    mockFetch(fakeAnthropicStream([
      textDelta('{"summary":'),
      textDelta('"hello"}'),
      msgStop(),
    ]));
    const events = [];
    const out = await streamAnthropicJson({
      apiKey: 'k', send: (e, p) => events.push([e, p]), body: {},
    });
    expect(out.ok).toBe(true);
    expect(out.text).toBe('{"summary":"hello"}');
  });

  it('captures usage from message_start + message_delta', async () => {
    mockFetch(fakeAnthropicStream([
      msgStart({ input_tokens: 1200, cache_read_input_tokens: 800, cache_creation_input_tokens: 50 }),
      textDelta('{}'),
      msgDelta({ output_tokens: 640 }),
      msgStop(),
    ]));
    const out = await streamAnthropicJson({ apiKey: 'k', send: () => {}, body: {} });
    expect(out.usage).toEqual({
      inputTokens: 1200,
      outputTokens: 640,
      cacheReadInputTokens: 800,
      cacheCreationInputTokens: 50,
    });
  });

  it('accumulates thinking deltas separately from the response text', async () => {
    mockFetch(fakeAnthropicStream([
      thinkDelta('Let me reason '),
      thinkDelta('about this.'),
      textDelta('{"answer":42}'),
      msgStop(),
    ]));
    const out = await streamAnthropicJson({ apiKey: 'k', send: () => {}, body: {} });
    expect(out.thinking).toBe('Let me reason about this.');
    expect(out.text).toBe('{"answer":42}');
  });

  it('emits progress events once past the interval', async () => {
    mockFetch(fakeAnthropicStream([
      textDelta('x'.repeat(120)),
      textDelta('x'.repeat(120)), // crosses the 200-char default interval
      msgStop(),
    ]));
    const events = [];
    await streamAnthropicJson({
      apiKey: 'k', send: (e, p) => events.push([e, p]), body: {},
    });
    const progress = events.filter(([e]) => e === 'progress');
    expect(progress.length).toBe(1);
    expect(progress[0][1].charCount).toBe(240);
  });

  it('emits delta events per chunk in token mode', async () => {
    mockFetch(fakeAnthropicStream([
      textDelta('Hello '),
      textDelta('world'),
      msgStop(),
    ]));
    const events = [];
    await streamAnthropicJson({
      apiKey: 'k', send: (e, p) => events.push([e, p]), body: {}, mode: 'token',
    });
    const deltas = events.filter(([e]) => e === 'delta');
    expect(deltas.map(([, p]) => p.text)).toEqual(['Hello ', 'world']);
  });

  it('emits item events as array elements complete when arrayKey is set', async () => {
    mockFetch(fakeAnthropicStream([
      textDelta('{"plan":['),
      textDelta('{"id":"01","title":"Heat pumps"}'),
      textDelta(',{"id":"02","title":"LED retrofit"}'),
      textDelta(']}'),
      msgStop(),
    ]));
    const events = [];
    const out = await streamAnthropicJson({
      apiKey: 'k', send: (e, p) => events.push([e, p]), body: {}, arrayKey: 'plan',
    });
    const items = events.filter(([e]) => e === 'item');
    expect(items).toHaveLength(2);
    expect(items[0][1]).toEqual({ index: 0, item: { id: '01', title: 'Heat pumps' } });
    expect(items[1][1]).toEqual({ index: 1, item: { id: '02', title: 'LED retrofit' } });
    expect(out.text).toBe('{"plan":[{"id":"01","title":"Heat pumps"},{"id":"02","title":"LED retrofit"}]}');
  });

  it('does not emit item events when arrayKey is omitted', async () => {
    mockFetch(fakeAnthropicStream([
      textDelta('{"plan":[{"id":"01"}]}'),
      msgStop(),
    ]));
    const events = [];
    await streamAnthropicJson({
      apiKey: 'k', send: (e, p) => events.push([e, p]), body: {},
    });
    expect(events.some(([e]) => e === 'item')).toBe(false);
  });

  it('emits an error event and returns ok:false on a non-ok response', async () => {
    mockFetch(fakeAnthropicStream([], {
      ok: false, status: 429, errorBody: { error: { message: 'rate limited' } },
    }));
    const events = [];
    const out = await streamAnthropicJson({
      apiKey: 'k', send: (e, p) => events.push([e, p]), body: {},
    });
    expect(out.ok).toBe(false);
    expect(events).toHaveLength(1);
    expect(events[0][0]).toBe('error');
    expect(events[0][1].message).toMatch(/429/);
    expect(events[0][1].message).toMatch(/rate limited/);
  });

  it('skips malformed event lines without crashing the stream', async () => {
    // A garbage data: line lands between two valid text deltas.
    const encoder = new TextEncoder();
    const chunks = [
      encoder.encode(`data: ${JSON.stringify(textDelta('{"a":'))}\n\n`),
      encoder.encode('data: {not json}\n\n'),
      encoder.encode(`data: ${JSON.stringify(textDelta('1}'))}\n\n`),
      encoder.encode(`data: ${JSON.stringify(msgStop())}\n\n`),
    ];
    let i = 0;
    mockFetch({
      ok: true, status: 200, json: async () => ({}),
      body: { getReader: () => ({ async read() {
        if (i >= chunks.length) return { value: undefined, done: true };
        return { value: chunks[i++], done: false };
      } }) },
    });
    const out = await streamAnthropicJson({ apiKey: 'k', send: () => {}, body: {} });
    expect(out.ok).toBe(true);
    expect(out.text).toBe('{"a":1}');
  });

  it('sends stream:true in the request body', async () => {
    const fetchMock = vi.fn(async () => fakeAnthropicStream([msgStop()]));
    vi.stubGlobal('fetch', fetchMock);
    await streamAnthropicJson({ apiKey: 'k', send: () => {}, body: { model: 'claude-opus-4-7', max_tokens: 8000 } });
    const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sentBody.stream).toBe(true);
    expect(sentBody.model).toBe('claude-opus-4-7');
    expect(sentBody.max_tokens).toBe(8000);
  });
});
