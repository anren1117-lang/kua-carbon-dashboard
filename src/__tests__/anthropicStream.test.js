// Unit tests for the streaming helpers in src/utils/anthropicStream.js.
//
// Focus on createItemExtractor — Phase 157+158 use it to extract
// completed plan items / extracted rows from a streaming JSON blob.
// The state machine handles string-aware brace nesting, depth
// tracking across deltas (O(N) total), and graceful handling of
// partial input. Regression-test the tricky cases.

import { describe, it, expect } from 'vitest';
import { createItemExtractor, tryParseJsonLoose } from '../utils/anthropicStream.js';

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
