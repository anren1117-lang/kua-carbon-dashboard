// @vitest-environment jsdom
//
// /sinks and /sinks-os publish the same sequestration number to different
// standards, and /sinks-os is the one the teaching content points at.
//
// geographicEstimates.js computes SINKS_RECONCILIATION: the adopted 2,650 is
// the TOP of a four-method spread whose central is 1,730 — +53%. The only
// genuinely independent method in the set (EPA GHG Equivalencies) gives 1,000.
// Sinks.js renders that gap in its headline block. Sinks2.js — the "Sinks OS"
// module mounted at /sinks-os — imported nothing from geographicEstimates and
// showed 2,650 with the note "Stand-weighted (placeholder)".
//
// That matters because lessonLibrary.js sends students to /sinks-os TWICE and
// asks them to compare their own derivation against "the published 2,650". A
// student whose leaf-level or logistic-growth estimate lands near 1,700 is
// being told, implicitly, that they got it wrong.
//
// This is disclosure, not repricing: whether to adopt the central instead is
// still an open decision. The page simply has to say where its number sits.
//
// Rendered, not grepped — for the reason liveErrorSurfaced.test.js gives: a
// source-level guard passes against a page that computes a string and never
// displays it, which is exactly how PERIOD_RECONCILIATION shipped nowhere.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROUTER_FUTURE } from './routerFuture.js';

const { setNextResponses, makeQueryHarness } = vi.hoisted(() => {
  let responses = {};
  const setNextResponses = (next) => { responses = next; };
  const makeQueryHarness = () => {
    function makeBuilder(table) {
      const promiseLike = {
        select() { return promiseLike; },
        order()  { return promiseLike; },
        limit()  { return promiseLike; },
        eq()     { return promiseLike; },
        then(resolve, reject) {
          return Promise.resolve(responses[table] ?? { data: [], error: null }).then(resolve, reject);
        },
      };
      return promiseLike;
    }
    return { from: (table) => makeBuilder(table) };
  };
  return { setNextResponses, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import Sinks from '../pages/Sinks.js';
import Sinks2 from '../pages/Sinks2.js';
import { SINKS_RECONCILIATION } from '../data/geographicEstimates.js';
import { LEARNING_PATHS } from '../components/LearnAgent.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { _resetCacheForTests } from '../hooks/measuredCache.js';

const mount = (C) => render(
  <MemoryRouter future={ROUTER_FUTURE}><C /></MemoryRouter>
);

beforeEach(() => { cleanup(); _resetCacheForTests?.(); setNextResponses({}); });
afterEach(() => { cleanup(); });

// Built from the constant, so a reprice moves the assertion rather than
// stranding it on a literal.
const central = SINKS_RECONCILIATION.centralMt.toLocaleString();
const gap = String(SINKS_RECONCILIATION.gapPct);

describe('the adopted sink figure is disclosed as the top of its spread', () => {
  it('the gap is real and worth disclosing', () => {
    expect(SINKS_RECONCILIATION.adoptedMt).toBe(SINKS_RECONCILIATION.highMt);
    expect(SINKS_RECONCILIATION.gapPct).toBeGreaterThan(25);
    expect(SINKS_RECONCILIATION.methodCount).toBe(4);
  });

  it('/sinks states the central it sits above', async () => {
    mount(Sinks);
    await waitFor(() => {
      expect(screen.getAllByText(new RegExp(central)).length).toBeGreaterThan(0);
    });
  });

  // The word "mid-estimate" was attached to the adopted figure in four places
  // across two files — including one that called it "~3,000 mid-estimate",
  // above even the adopted 2,650. Whatever the dashboard adopts, describing
  // the top of a range as its middle is the claim that cannot stand.
  it('nothing describes the adopted figure as a mid-estimate', () => {
    const bodies = [];
    const walk = (n) => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (n && typeof n === 'object') {
        for (const v of Object.values(n)) {
          if (typeof v === 'string') bodies.push(v); else walk(v);
        }
      }
    };
    walk(LEARNING_PATHS);
    expect(bodies.length).toBeGreaterThan(50);
    expect(bodies.filter((b) => /mid-estimate/i.test(b))).toEqual([]);

    const peer = readFileSync(resolve(process.cwd(), 'components/PeerComparison.js'), 'utf8');
    expect(peer).not.toMatch(/mid-estimate/i);
    expect(peer).toMatch(/SINKS_RECONCILIATION/);
  });

  it('/sinks-os states it too — the page the lessons send students to', async () => {
    mount(Sinks2);
    await waitFor(() => {
      expect(screen.getAllByText(new RegExp(central)).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText(new RegExp(gap.replace('.', '\\.'))).length).toBeGreaterThan(0);
  });
});
