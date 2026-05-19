#!/usr/bin/env node
// Capture the live headline numbers from src/data/*.js into a JSON
// file. Used to keep docs/capstone-results.md in sync with the
// codebase — re-run after any data change, diff the JSON against the
// prose in the doc.
//
// Usage:
//   node scripts/captureHeadlineNumbers.mjs                 # writes docs/headline-numbers-YYYYMMDD.json
//   node scripts/captureHeadlineNumbers.mjs --print         # writes nothing, prints to stdout
//   node scripts/captureHeadlineNumbers.mjs --out=PATH.json # custom destination

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const SRC = path.join(REPO_ROOT, 'src');

// Dynamic imports — the data files live in src/, not next to this script
const { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E, GRID_MIX_ANNUAL_MTCO2E, gridMix } =
  await import(path.join(SRC, 'data', 'gridMix.js'));
const { COMPOSED_YTD_AS_OF, COMPOSED_ANNUAL_KWH, COMPOSED_YTD_DAYS_COVERED, COMPOSED_YTD_KWH, COMPOSED_ANNUALIZE_FACTOR } =
  await import(path.join(SRC, 'data', 'composedYtd.js'));
const { SCOPE1_TOTAL_MT, SCOPE3_TOTAL_MT, GROSS_MT, composeScope1, composeScope3 } =
  await import(path.join(SRC, 'data', 'scopeTotals.js'));
const { ANNUAL_SEQUESTRATION_MT, TOTAL_FOREST_ACRES, forestStands } =
  await import(path.join(SRC, 'data', 'sinks.js'));
const { SOLAR_ANNUAL_KWH, MEASURED_APRIL_KWH } =
  await import(path.join(SRC, 'data', 'renewables.js'));
const { TOTAL_STUDENTS } =
  await import(path.join(SRC, 'data', 'students.js'));

const headline = {
  capturedAt: new Date().toISOString(),
  composedYtdAsOf: COMPOSED_YTD_AS_OF,
  totalStudents: TOTAL_STUDENTS,
  totalForestAcres: TOTAL_FOREST_ACRES,
  scopes: {
    scope1: {
      totalMt: SCOPE1_TOTAL_MT,
      provenance: composeScope1().provenance,
      breakdown: composeScope1().breakdown,
    },
    scope2: {
      totalMt: Math.round(GRID_MIX_ANNUAL_MTCO2E),
      provenance: 'cited',
      method: `Composed YTD ${COMPOSED_YTD_KWH.toLocaleString()} kWh through ${COMPOSED_YTD_AS_OF} (${COMPOSED_YTD_DAYS_COVERED} days) × ISO-NE 2024 per-fuel grid factors × ${COMPOSED_ANNUALIZE_FACTOR.toFixed(2)} seasonal annualize.`,
      ytdKwh: COMPOSED_YTD_KWH,
      annualKwh: COMPOSED_ANNUAL_KWH,
      ytdMtco2e: GRID_MIX_TOTAL_MTCO2E,
      annualMtco2e: GRID_MIX_ANNUAL_MTCO2E,
      gridMix,
    },
    scope3: {
      totalMt: SCOPE3_TOTAL_MT,
      provenance: composeScope3().provenance,
      breakdown: composeScope3().breakdown,
    },
  },
  gross: {
    totalMt: Math.round(GROSS_MT),
    perStudentMt: +(GROSS_MT / TOTAL_STUDENTS).toFixed(2),
  },
  sinks: {
    totalMt: Math.round(ANNUAL_SEQUESTRATION_MT),
    provenance: 'cited',
    method: 'Sum over forestStands: acres × per-acre mtCO2e/yr (Birdsey 1992 / Nowak 2013 rates).',
    stands: forestStands.map((s) => ({
      id: s.id, name: s.name, acres: s.acres, type: s.type, ageClass: s.ageClass, mtco2eAcreYr: s.mtco2eAcreYr,
    })),
  },
  renewables: {
    solar: {
      annualKwh: SOLAR_ANNUAL_KWH,
      measuredAprilKwh: MEASURED_APRIL_KWH,
      provenance: 'cited',
      method: 'Measured April 2026 BMS production (1 of 3 arrays reporting reliably) / PVWatts April share of year.',
    },
  },
  net: {
    totalMt: Math.round(GROSS_MT - ANNUAL_SEQUESTRATION_MT),
    perStudentMt: +((GROSS_MT - ANNUAL_SEQUESTRATION_MT) / TOTAL_STUDENTS).toFixed(2),
  },
};

const args = process.argv.slice(2);
const printOnly = args.includes('--print');
const outFlag = args.find((a) => a.startsWith('--out='));

if (printOnly) {
  console.log(JSON.stringify(headline, null, 2));
} else {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const outPath = outFlag
    ? path.resolve(REPO_ROOT, outFlag.slice('--out='.length))
    : path.join(REPO_ROOT, 'docs', `headline-numbers-${date}.json`);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(headline, null, 2));
  console.log(`Wrote ${path.relative(REPO_ROOT, outPath)}`);
  console.log(`  Gross ${headline.gross.totalMt} mt  ·  Sinks ${headline.sinks.totalMt} mt  ·  Net ${headline.net.totalMt} mt`);
  console.log(`  Per student net: ${headline.net.perStudentMt} mtCO₂e/yr across ${headline.totalStudents} students`);
}
