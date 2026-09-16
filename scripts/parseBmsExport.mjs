#!/usr/bin/env node
// CLI: read an HOURLY Distech Eclypse Meter Trends CSV export and emit the
// compact JS module the dashboard ships as static data.
//
// Usage:
//   node scripts/parseBmsExport.mjs <input.csv> <output.js>
//
// The parsing rules live in src/data/parseBmsExport.js so the browser runs the
// same code — /admin/bms-export parses an uploaded file with that module, and
// this script stays a thin wrapper that writes the result to disk.

import fs from 'node:fs';
import { parseMeterTrendsHourly } from '../src/data/parseBmsExport.js';

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error('Usage: parseBmsExport.mjs <input.csv> <output.js>');
  process.exit(1);
}

let parsed;
try {
  parsed = parseMeterTrendsHourly(fs.readFileSync(inputPath, 'utf8'), inputPath.split('/').pop());
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const { meta, meters } = parsed;

const out = `// Auto-generated from ${meta.sourceFile} by scripts/parseBmsExport.mjs
// Do not edit by hand. Re-run the parser with a fresh export to update.
//
// Source window: ${meta.windowStartIso} → ${meta.windowEndIso}
// Meters: ${meta.meterCount}, hours covered: ${meta.hoursCovered}.
// Per-meter shape: { id, totalKwh, peakKw, avgKw, hourly[24], daily[{date,kwh,peakKw}], sampleCount }.

export const BMS_EXPORT_META = ${JSON.stringify(meta, null, 2)};

export const bmsExportMeters = ${JSON.stringify(meters, null, 2)};
`;

fs.writeFileSync(outputPath, out, 'utf8');
console.log(`Wrote ${meters.length} meters → ${outputPath}`);
console.log(`Window: ${meta.windowStartIso} → ${meta.windowEndIso} (${meta.hoursCovered} hours)`);
console.log('Top 5 meters by total kWh:');
meters.slice(0, 5).forEach((m, i) => {
  console.log(`  ${i + 1}. ${m.id.padEnd(45)} ${String(m.totalKwh).padStart(10)} kWh  peak ${m.peakKw} kW`);
});
