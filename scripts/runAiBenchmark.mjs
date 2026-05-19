#!/usr/bin/env node
// Q3 — AI ingestion benchmark runner.
//
// Loads tagged benchmark cases from src/data/aiIngestionBenchmark.js,
// posts each one's source text to /api/admin/ai-ingestion (the same
// endpoint the live drop-document page uses), scores the extracted
// rows against the ground-truth, and writes a JSON summary plus a
// human-readable console report.
//
// Usage:
//   node scripts/runAiBenchmark.mjs                # against http://localhost:5173
//   API_BASE=https://kua-carbon-dashboard.vercel.app node scripts/runAiBenchmark.mjs
//   ADMIN_TOKEN=... node scripts/runAiBenchmark.mjs   # for protected envs
//
// Output:
//   - prints per-case + overall accuracy to stdout
//   - writes docs/ai-ingestion-benchmark-results.json
//   - exits non-zero if overall accuracy below the targets:
//       routine fields >= 0.95
//       safety-critical fields == 1.00

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { benchmarkCases, scoreCase } from '../src/data/aiIngestionBenchmark.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const RESULTS_PATH = path.join(REPO_ROOT, 'docs', 'ai-ingestion-benchmark-results.json');

const API_BASE = process.env.API_BASE || 'http://localhost:5173';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

async function callAgent(sourceText, hints) {
  const headers = { 'Content-Type': 'application/json' };
  if (ADMIN_TOKEN) headers['Authorization'] = `Bearer ${ADMIN_TOKEN}`;
  const res = await fetch(`${API_BASE}/api/admin/ai-ingestion`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ sourceText, hints }),
  });
  if (!res.ok) {
    throw new Error(`Agent returned HTTP ${res.status}: ${await res.text()}`);
  }
  const payload = await res.json();
  // The agent returns { rows: [{ table, fields }] } — see api/admin/ai-ingestion.js
  return Array.isArray(payload?.rows) ? payload.rows : [];
}

async function main() {
  if (benchmarkCases.length === 0) {
    console.log('No benchmark cases tagged yet.');
    console.log('Populate src/data/aiIngestionBenchmark.js — see docs/ai-ingestion-benchmark.md');
    process.exit(0);
  }

  console.log(`Running ${benchmarkCases.length} benchmark cases against ${API_BASE}\n`);

  const caseResults = [];
  for (const bc of benchmarkCases) {
    process.stdout.write(`  ${bc.id} (${bc.docType}) ... `);
    try {
      const extracted = await callAgent(bc.sourceText, bc.hints);
      const result = scoreCase(extracted, bc);
      caseResults.push(result);
      const pct = (result.overallAccuracy * 100).toFixed(0);
      const safety = result.safetyCriticalTotal > 0
        ? ` · safety ${result.safetyCriticalCorrect}/${result.safetyCriticalTotal}`
        : '';
      console.log(`${result.correctFields}/${result.totalFields} fields (${pct}%)${safety}`);
    } catch (err) {
      console.log(`ERROR — ${err.message}`);
      caseResults.push({ id: bc.id, docType: bc.docType, error: err.message });
    }
  }

  // Aggregate across cases
  const allFields = caseResults.flatMap((r) => r.perRow?.flatMap((pr) => pr.fields) || []);
  const routineFields = allFields.filter((f) => !f.safetyCritical);
  const safetyFields = allFields.filter((f) => f.safetyCritical);
  const routineAccuracy = routineFields.length > 0
    ? routineFields.filter((f) => f.correct).length / routineFields.length
    : 0;
  const safetyAccuracy = safetyFields.length > 0
    ? safetyFields.filter((f) => f.correct).length / safetyFields.length
    : null;

  const summary = {
    runAt: new Date().toISOString(),
    apiBase: API_BASE,
    cases: benchmarkCases.length,
    routineFields: routineFields.length,
    routineCorrect: routineFields.filter((f) => f.correct).length,
    routineAccuracy: +routineAccuracy.toFixed(4),
    safetyCriticalFields: safetyFields.length,
    safetyCriticalCorrect: safetyFields.filter((f) => f.correct).length,
    safetyCriticalAccuracy: safetyAccuracy === null ? null : +safetyAccuracy.toFixed(4),
    targets: { routine: 0.95, safetyCritical: 1.0 },
    pass: {
      routine: routineAccuracy >= 0.95,
      safetyCritical: safetyAccuracy === null ? null : safetyAccuracy >= 1.0,
    },
    caseResults,
  };

  console.log('\n──────────────────────────────────────────────');
  console.log('Overall:');
  console.log(`  Routine fields (date, kwh, gallons, etc.):    ${(routineAccuracy * 100).toFixed(1)}%  (target ≥ 95%)  ${summary.pass.routine ? '✓' : '✗'}`);
  if (safetyAccuracy !== null) {
    console.log(`  Safety-critical fields (account, unit, etc.): ${(safetyAccuracy * 100).toFixed(1)}%  (target 100%)  ${summary.pass.safetyCritical ? '✓' : '✗'}`);
  } else {
    console.log('  Safety-critical fields: none tagged in benchmark');
  }
  console.log('──────────────────────────────────────────────\n');

  await fs.mkdir(path.dirname(RESULTS_PATH), { recursive: true });
  await fs.writeFile(RESULTS_PATH, JSON.stringify(summary, null, 2));
  console.log(`Wrote ${path.relative(REPO_ROOT, RESULTS_PATH)}`);

  const passed = summary.pass.routine && (summary.pass.safetyCritical !== false);
  process.exit(passed ? 0 : 1);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(2);
});
