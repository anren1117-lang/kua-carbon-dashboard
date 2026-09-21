// Three admin AI endpoints quote the same benchmark library — the reduction
// measures an admin gets recommended, with mt/yr and cost ranges:
//
//   api/admin/plan.js                    the plan generator
//   api/admin/plan-item-alternatives.js  "the same benchmark library the plan
//                                         endpoint uses" (its own words)
//   api/admin/estimate-action.js         the per-action estimator
//
// Phases 409/410 repriced rooftop solar from the INVENTORY average to the
// AVERT MARGINAL rate — solar displaces whichever plant is running at the
// margin, which is dirtier than the grid-wide average, so pricing displacement
// at the inventory rate understates it by about half. estimate-action.js was
// corrected to 12–17 mt/yr. The other two were not, and kept quoting 6–8.
//
// Every OTHER benchmark in the library agrees across all three files
// (heat-pump 600-900, LED 6-10, HVAC 9-15, setpoint 15-22, beef ~56, compost
// 4-6, commute 25-35). Solar was the lone survivor of the old rate, which is
// exactly the shape of a correction applied to one file and not its siblings.
//
// This pins agreement rather than a literal, so the next reprice has to move
// all three or fail here.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const API = resolve(process.cwd(), '..', 'api', 'admin');
const read = (f) => readFileSync(resolve(API, f), 'utf8');
const FILES = ['plan.js', 'plan-item-alternatives.js', 'estimate-action.js'];

// Pull "60 kW ... solar ... N–M mt" out of whichever sentence carries it.
function solarRange(src) {
  for (const line of src.split('\n')) {
    if (!/60\s*kW/i.test(line) || !/solar/i.test(line)) continue;
    // the mt range that follows the words "60 kW ... solar"
    const after = line.slice(line.search(/60\s*kW/i));
    const m = after.match(/(\d+)\s*[-–]\s*(\d+)\s*mt/i);
    if (m) return [Number(m[1]), Number(m[2])];
  }
  return null;
}

describe('the solar benchmark agrees across every prompt that quotes it', () => {
  it('finds a 60 kW solar benchmark in all three prompt files', () => {
    // An empty extraction would make the agreement check vacuously true.
    for (const f of FILES) {
      expect(solarRange(read(f)), `no 60 kW solar range found in ${f}`).not.toBeNull();
    }
  });

  it('all three quote the SAME range', () => {
    const ranges = FILES.map((f) => [f, solarRange(read(f))]);
    const [, first] = ranges[0];
    for (const [f, r] of ranges) {
      expect(r, `${f} disagrees: ${JSON.stringify(r)} vs ${JSON.stringify(first)}`).toEqual(first);
    }
  });

  it('quotes the MARGINAL-rate figure, not the superseded inventory one', () => {
    // 6–8 mt is the pre-Phase-409 number, priced at the inventory average.
    // Asserted as a floor rather than an exact literal so a future reprice can
    // move the figure without rewriting this test — but never back below the
    // marginal basis.
    for (const f of FILES) {
      const [lo, hi] = solarRange(read(f));
      expect(lo, `${f} still quotes the inventory-rate low end`).toBeGreaterThan(8);
      expect(hi).toBeGreaterThan(lo);
    }
  });

  it('says WHY solar is priced at the margin, where the figure is defined', () => {
    // The number alone invites the same mistake again.
    expect(read('estimate-action.js')).toMatch(/margin(al)?/i);
    expect(read('estimate-action.js')).toMatch(/AVERT/);
  });
});
