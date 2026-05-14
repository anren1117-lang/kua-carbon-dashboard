// CSV → MeterReading parser. Used by the CsvMeterAdapter and the
// /data-admin upload form.
//
// Accepted CSV shape (header-driven, columns can be in any order):
//   meter_id,timestamp,value,unit,interval_minutes,demand_kw,data_quality
// Required columns: meter_id, timestamp, value, unit, interval_minutes
// Optional columns: demand_kw, data_quality
//
// Anything looking like a name, email, or other PII column is rejected
// up-front so accidental student-data uploads can't silently land.

import { meters } from '../data/meters.js';

const REQUIRED = ['meter_id', 'timestamp', 'value', 'unit', 'interval_minutes'];
const OPTIONAL = ['demand_kw', 'data_quality'];
const PII_KEYS = ['name', 'email', 'student_id', 'sis_id', 'address', 'phone'];

/** Tiny RFC-4180-ish CSV splitter. Handles quoted commas + escaped quotes. */
function splitCsvRow(line) {
  const out = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuote) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQuote = false; }
      else cur += c;
    } else {
      if (c === '"') inQuote = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/**
 * @param {string} csv
 * @returns {{ readings: import('../adapters/meter/MeterDataAdapter.js').MeterReading[], errors: string[] }}
 */
export function parseMeterCsv(csv) {
  if (typeof csv !== 'string' || !csv.trim()) {
    return { readings: [], errors: ['empty input'] };
  }

  // Strip a leading UTF-8 BOM (Excel and many Windows tools write it).
  // Without this the first header column reads as "﻿meter_id" and
  // the required-columns check fails with a confusing error.
  const cleaned = csv.charCodeAt(0) === 0xFEFF ? csv.slice(1) : csv;
  const lines = cleaned.replace(/\r\n?/g, '\n').split('\n').filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { readings: [], errors: ['CSV must have a header plus at least one data row'] };
  }

  const header = splitCsvRow(lines[0]).map((h) => h.toLowerCase());
  const errors = [];

  // PII guard
  for (const key of PII_KEYS) {
    if (header.includes(key)) {
      errors.push(`Refusing upload — column "${key}" looks like personal data. Strip it before uploading.`);
    }
  }
  if (errors.length) return { readings: [], errors };

  for (const r of REQUIRED) {
    if (!header.includes(r)) {
      errors.push(`missing required column "${r}"`);
    }
  }
  if (errors.length) return { readings: [], errors };

  const meterIds = new Set(meters.map((m) => m.id));
  const meterById = Object.fromEntries(meters.map((m) => [m.id, m]));
  const idx = (k) => header.indexOf(k);

  const readings = [];
  for (let lineNo = 1; lineNo < lines.length; lineNo++) {
    const row = splitCsvRow(lines[lineNo]);
    const meterId = row[idx('meter_id')];
    const timestamp = row[idx('timestamp')];
    const rawValue = row[idx('value')];
    const unit = row[idx('unit')];
    const intervalMinutes = Number(row[idx('interval_minutes')]);

    if (!meterIds.has(meterId)) {
      errors.push(`row ${lineNo + 1}: unknown meter_id "${meterId}"`);
      continue;
    }
    // Guard the empty cell explicitly — Number('') is 0, not NaN, so
    // a blank value column would otherwise slip through as a real
    // 0-kWh reading instead of being flagged as missing.
    if (rawValue === undefined || rawValue === '') {
      errors.push(`row ${lineNo + 1}: value is missing`);
      continue;
    }
    const value = Number(rawValue);
    if (Number.isNaN(value)) {
      errors.push(`row ${lineNo + 1}: value "${rawValue}" is not numeric`);
      continue;
    }
    const ts = new Date(timestamp);
    if (Number.isNaN(ts.getTime())) {
      errors.push(`row ${lineNo + 1}: timestamp "${timestamp}" is not a valid date`);
      continue;
    }
    if (![15, 30, 60, 1440].includes(intervalMinutes)) {
      errors.push(`row ${lineNo + 1}: interval_minutes must be 15, 30, 60, or 1440 (got ${intervalMinutes})`);
      continue;
    }

    const meter = meterById[meterId];
    // Empty optional demand_kw cell stays undefined — Number('') is 0,
    // which would otherwise record a phantom 0 kW demand peak.
    const rawDemand = idx('demand_kw') >= 0 ? row[idx('demand_kw')] : undefined;
    const optDemand = rawDemand !== undefined && rawDemand !== '' ? Number(rawDemand) : undefined;
    const optQuality = idx('data_quality') >= 0 ? row[idx('data_quality')] : 'actual';

    readings.push({
      id: `${meterId}_${ts.getTime()}`,
      meterId,
      buildingId: meter.buildingId,
      meterType: meter.type,
      timestamp: ts.toISOString(),
      intervalMinutes,
      value,
      unit,
      demandKw: optDemand !== undefined && !Number.isNaN(optDemand) ? optDemand : undefined,
      dataQuality: ['actual', 'estimated', 'missing', 'anomaly'].includes(optQuality) ? optQuality : 'actual',
      source: 'csv',
    });
  }

  return { readings, errors };
}
