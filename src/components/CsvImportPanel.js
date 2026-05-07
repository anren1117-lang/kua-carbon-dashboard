import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { parseCsv } from '../utils/csv.js';
import { logAdminWrite } from '../utils/adminAudit.js';

// Reusable CSV bulk-import panel for the admin portal. Each canonical
// admin table (fuel_bills, waste, day_students, …) embeds one of
// these next to its single-row entry form. The flow is identical
// across tables — only the per-row validator and the example CSV
// differ — so this component captures the pattern.
//
// Three states:
//   1. Closed: just the toggle button.
//   2. Open + empty/typing: textarea + Preview button.
//   3. Open + previewed: row-count summary, per-row errors (capped at
//      20), and (when ≥1 valid row) a green Import button.
//
// The actual Supabase insert + audit log entry happen in this
// component. The parent only needs to pass `onComplete()` so it can
// re-fetch its data and clear "no records" placeholders.

/**
 * @param {{
 *   tableName: string,                   // Supabase table name
 *   labelSingular: string,               // e.g. "fuel bill", "day student"
 *   columnsHint: string,                 // shown in the hint paragraph
 *   examplePlaceholder: string,          // textarea placeholder text
 *   validateRow: (raw: object, idx: number) => { ok: true, row: object } | { ok: false, message: string },
 *   onComplete?: () => void,
 *   onMessage?: (msg: string) => void,
 * }} props
 */
export default function CsvImportPanel({
  tableName,
  labelSingular,
  columnsHint,
  examplePlaceholder,
  validateRow,
  onComplete,
  onMessage,
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);

  const message = (msg) => { if (typeof onMessage === 'function') onMessage(msg); };

  const handlePreview = () => {
    const parsed = parseCsv(text);
    const rowResults = parsed.rows.map((r, i) => validateRow(r, i));
    const valid = rowResults.filter((r) => r.ok).map((r) => r.row);
    const errors = [
      ...parsed.errors.map((e) => `row ${e.row}: ${e.message}`),
      ...rowResults.filter((r) => !r.ok).map((r) => r.message),
    ];
    setPreview({ valid, errors, totalRowsParsed: parsed.rows.length });
  };

  const handleCommit = async () => {
    if (!preview || preview.valid.length === 0) return;
    setBusy(true);
    try {
      const { error } = await supabase.from(tableName).insert(preview.valid);
      if (error) throw error;
      logAdminWrite({
        action: 'insert',
        table: tableName,
        payload: { bulk_count: preview.valid.length },
        note: `CSV bulk import: ${preview.valid.length} ${labelSingular}${preview.valid.length === 1 ? '' : 's'}`,
      });
      message(`✓ ${preview.valid.length} ${labelSingular}${preview.valid.length === 1 ? '' : 's'} imported`);
      setText('');
      setPreview(null);
      setOpen(false);
      if (typeof onComplete === 'function') onComplete();
    } catch (err) {
      message('Import error: ' + err.message);
    }
    setBusy(false);
  };

  return (
    <div style={styles.wrap}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={styles.toggle}
      >
        {open ? 'Single entry' : 'Bulk import (CSV)'}
      </button>

      {open && (
        <div style={styles.block}>
          <p style={styles.hint}>
            Paste CSV with columns <code>{columnsHint}</code>. The first row must be the header.
          </p>
          <textarea
            placeholder={examplePlaceholder}
            value={text}
            onChange={(e) => { setText(e.target.value); setPreview(null); }}
            style={styles.textarea}
            spellCheck={false}
          />
          <div style={styles.btnRow}>
            <button
              type="button"
              onClick={handlePreview}
              style={styles.previewBtn}
              disabled={!text.trim()}
            >
              Preview
            </button>
            {preview && preview.valid.length > 0 && (
              <button
                type="button"
                onClick={handleCommit}
                disabled={busy}
                style={styles.commitBtn}
              >
                {busy ? 'Importing…' : `Import ${preview.valid.length} ${labelSingular}${preview.valid.length === 1 ? '' : 's'}`}
              </button>
            )}
          </div>
          {preview && (
            <div style={styles.preview}>
              <div style={{ marginBottom: 8 }}>
                <strong>Parsed {preview.totalRowsParsed} rows</strong>: {preview.valid.length} valid
                {preview.errors.length > 0 && `, ${preview.errors.length} with errors`}
              </div>
              {preview.errors.length > 0 && (
                <ul style={styles.errors}>
                  {preview.errors.slice(0, 20).map((e, i) => <li key={i}>{e}</li>)}
                  {preview.errors.length > 20 && <li>…and {preview.errors.length - 20} more</li>}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Per-table validators. Centralizing them in one module so callers
// just import + pass them as props.
//
// Each validator takes (rawRow, idx) where idx is 0-indexed in the
// data section (so user-facing row numbers are idx + 2 to account
// for 1-indexing and the header row).
//
// Convention: return { ok: true, row: { ...sanitized... } } for
// valid rows so the commit step can pass them straight to
// supabase.insert(). Return { ok: false, message } for invalid rows.

const date = (raw, key = 'date') => (raw[key] || '').trim();
const dateOk = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const numOk = (s) => Number.isFinite(parseFloat(s)) && parseFloat(s) >= 0;

export function validateFuelRow(raw, idx) {
  const d = date(raw);
  const fuel_type = (raw.fuel_type || raw['fuel type'] || '').trim();
  const gal = (raw.gallons || '').trim();
  const cost = (raw.cost || '').trim();
  const notes = (raw.notes || '').trim();
  if (!d) return { ok: false, message: `row ${idx + 2}: missing date` };
  if (!dateOk(d)) return { ok: false, message: `row ${idx + 2}: date must be YYYY-MM-DD (got "${d}")` };
  if (!['Propane', 'Heating Oil', 'Diesel', 'Gasoline'].includes(fuel_type)) {
    return { ok: false, message: `row ${idx + 2}: fuel_type must be one of Propane/Heating Oil/Diesel/Gasoline (got "${fuel_type}")` };
  }
  if (!numOk(gal)) return { ok: false, message: `row ${idx + 2}: gallons must be a non-negative number (got "${gal}")` };
  let costNum = null;
  if (cost) {
    if (!numOk(cost)) return { ok: false, message: `row ${idx + 2}: cost must be a non-negative number (got "${cost}")` };
    costNum = parseFloat(cost);
  }
  return { ok: true, row: { date: d, fuel_type, gallons: parseFloat(gal), cost: costNum, notes: notes || null } };
}

export function validateWasteRow(raw, idx) {
  const d = date(raw);
  const waste_type = (raw.waste_type || raw['waste type'] || '').trim();
  const amount = (raw.amount || '').trim();
  const unit = (raw.unit || 'tons').trim();
  const notes = (raw.notes || '').trim();
  const school_year = (raw.school_year || raw['school year'] || '2025-2026').trim();
  if (!d) return { ok: false, message: `row ${idx + 2}: missing date` };
  if (!dateOk(d)) return { ok: false, message: `row ${idx + 2}: date must be YYYY-MM-DD (got "${d}")` };
  if (!['Landfill', 'Recycling', 'Composting', 'Hazardous', 'E-Waste'].includes(waste_type)) {
    return { ok: false, message: `row ${idx + 2}: waste_type must be one of Landfill/Recycling/Composting/Hazardous/E-Waste (got "${waste_type}")` };
  }
  if (!numOk(amount)) return { ok: false, message: `row ${idx + 2}: amount must be a non-negative number (got "${amount}")` };
  if (!['tons', 'lbs', 'cubic yards'].includes(unit)) {
    return { ok: false, message: `row ${idx + 2}: unit must be one of tons/lbs/cubic yards (got "${unit}")` };
  }
  return { ok: true, row: { date: d, waste_type, amount: parseFloat(amount), unit, notes: notes || null, school_year } };
}

export function validateDayStudentRow(raw, idx) {
  const zip_code = (raw.zip_code || raw['zip code'] || '').trim();
  const graduation_year = (raw.graduation_year || raw['graduation year'] || '').trim();
  const school_year = (raw.school_year || raw['school year'] || '2025-2026').trim();
  if (!zip_code) return { ok: false, message: `row ${idx + 2}: missing zip_code` };
  if (!/^\d{5}(-\d{4})?$/.test(zip_code)) return { ok: false, message: `row ${idx + 2}: zip_code must be 5 digits (got "${zip_code}")` };
  if (!/^\d{4}$/.test(graduation_year)) return { ok: false, message: `row ${idx + 2}: graduation_year must be 4 digits (got "${graduation_year}")` };
  return { ok: true, row: { zip_code, graduation_year, school_year } };
}

export function validateUSStudentRow(raw, idx) {
  const zip_code = (raw.zip_code || raw['zip code'] || '').trim();
  const state = (raw.state || '').trim().toUpperCase();
  const graduation_year = (raw.graduation_year || raw['graduation year'] || '').trim();
  const school_year = (raw.school_year || raw['school year'] || '2025-2026').trim();
  if (!zip_code) return { ok: false, message: `row ${idx + 2}: missing zip_code` };
  if (!/^\d{5}(-\d{4})?$/.test(zip_code)) return { ok: false, message: `row ${idx + 2}: zip_code must be 5 digits (got "${zip_code}")` };
  if (state && !/^[A-Z]{2}$/.test(state)) return { ok: false, message: `row ${idx + 2}: state must be a 2-letter abbrev (got "${state}")` };
  if (!/^\d{4}$/.test(graduation_year)) return { ok: false, message: `row ${idx + 2}: graduation_year must be 4 digits (got "${graduation_year}")` };
  return { ok: true, row: { zip_code, state: state || null, graduation_year, school_year } };
}

export function validateIntlStudentRow(raw, idx) {
  const country = (raw.country || '').trim();
  const graduation_year = (raw.graduation_year || raw['graduation year'] || '').trim();
  const school_year = (raw.school_year || raw['school year'] || '2025-2026').trim();
  if (!country) return { ok: false, message: `row ${idx + 2}: missing country` };
  if (!/^\d{4}$/.test(graduation_year)) return { ok: false, message: `row ${idx + 2}: graduation_year must be 4 digits (got "${graduation_year}")` };
  return { ok: true, row: { country, graduation_year, school_year } };
}

export function validateStudyAbroadRow(raw, idx) {
  const destination_country = (raw.destination_country || raw['destination country'] || '').trim();
  const destination_city = (raw.destination_city || raw['destination city'] || '').trim();
  const departure_date = (raw.departure_date || raw['departure date'] || '').trim();
  const return_date = (raw.return_date || raw['return date'] || '').trim();
  const school_year = (raw.school_year || raw['school year'] || '2025-2026').trim();
  if (!destination_country) return { ok: false, message: `row ${idx + 2}: missing destination_country` };
  if (departure_date && !dateOk(departure_date)) return { ok: false, message: `row ${idx + 2}: departure_date must be YYYY-MM-DD (got "${departure_date}")` };
  if (return_date && !dateOk(return_date)) return { ok: false, message: `row ${idx + 2}: return_date must be YYYY-MM-DD (got "${return_date}")` };
  return {
    ok: true,
    row: {
      destination_country,
      destination_city: destination_city || null,
      departure_date: departure_date || null,
      return_date: return_date || null,
      school_year,
    },
  };
}

export function validateForestStandRow(raw, idx) {
  const stand_id = (raw.stand_id || raw['stand id'] || '').trim();
  const name = (raw.name || '').trim();
  const acresStr = (raw.acres || '').trim();
  const type = (raw.type || 'mixed_hardwood').trim();
  const age_class = (raw.age_class || raw['age class'] || 'mature').trim();
  const rateStr = (raw.mtco2e_acre_yr || raw['mtco2e acre yr'] || raw['mtco2e/acre/yr'] || '').trim();
  const dominant_species = (raw.dominant_species || raw['dominant species'] || '').trim();
  const surveyed_at = (raw.surveyed_at || raw['surveyed at'] || '').trim();
  const surveyed_by = (raw.surveyed_by || raw['surveyed by'] || '').trim();
  const notes = (raw.notes || '').trim();
  const school_year = (raw.school_year || raw['school year'] || '').trim();

  if (!name) return { ok: false, message: `row ${idx + 2}: missing name` };
  if (!numOk(acresStr)) return { ok: false, message: `row ${idx + 2}: acres must be a non-negative number (got "${acresStr}")` };
  if (!['mixed_hardwood', 'softwood', 'transitional', 'open_grown'].includes(type)) {
    return { ok: false, message: `row ${idx + 2}: type must be one of mixed_hardwood/softwood/transitional/open_grown (got "${type}")` };
  }
  if (!['young', 'intermediate', 'mature', 'old_growth'].includes(age_class)) {
    return { ok: false, message: `row ${idx + 2}: age_class must be one of young/intermediate/mature/old_growth (got "${age_class}")` };
  }
  // Rate is optional — defaults applied per type when blank.
  let rate = null;
  if (rateStr) {
    if (!numOk(rateStr)) return { ok: false, message: `row ${idx + 2}: mtco2e_acre_yr must be a non-negative number (got "${rateStr}")` };
    rate = parseFloat(rateStr);
  } else {
    const defaults = { mixed_hardwood: 2.5, softwood: 1.9, transitional: 2.7, open_grown: 4.0 };
    rate = defaults[type] ?? 2.5;
  }
  if (surveyed_at && !dateOk(surveyed_at)) {
    return { ok: false, message: `row ${idx + 2}: surveyed_at must be YYYY-MM-DD (got "${surveyed_at}")` };
  }
  return {
    ok: true,
    row: {
      stand_id: stand_id || null,
      name,
      acres: parseFloat(acresStr),
      type,
      age_class,
      mtco2e_acre_yr: rate,
      dominant_species: dominant_species || null,
      surveyed_at: surveyed_at || null,
      surveyed_by: surveyed_by || null,
      notes: notes || null,
      school_year: school_year || null,
    },
  };
}

export function validateFacultyTravelRow(raw, idx) {
  const destination_country = (raw.destination_country || raw['destination country'] || '').trim();
  const destination_city = (raw.destination_city || raw['destination city'] || '').trim();
  const trip_purpose = (raw.trip_purpose || raw['trip purpose'] || 'Conference').trim();
  const departure_date = (raw.departure_date || raw['departure date'] || '').trim();
  const return_date = (raw.return_date || raw['return date'] || '').trim();
  if (!destination_country) return { ok: false, message: `row ${idx + 2}: missing destination_country` };
  if (!['Admissions', 'Conference', 'Professional Development', 'Athletic', 'Other'].includes(trip_purpose)) {
    return { ok: false, message: `row ${idx + 2}: trip_purpose must be one of Admissions/Conference/Professional Development/Athletic/Other (got "${trip_purpose}")` };
  }
  if (departure_date && !dateOk(departure_date)) return { ok: false, message: `row ${idx + 2}: departure_date must be YYYY-MM-DD (got "${departure_date}")` };
  if (return_date && !dateOk(return_date)) return { ok: false, message: `row ${idx + 2}: return_date must be YYYY-MM-DD (got "${return_date}")` };
  return {
    ok: true,
    row: {
      destination_country,
      destination_city: destination_city || null,
      trip_purpose,
      departure_date: departure_date || null,
      return_date: return_date || null,
    },
  };
}

const styles = {
  wrap: {},
  toggle: { padding: '6px 14px', background: 'transparent', color: '#22c55e', border: '1px solid #22c55e', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.4, textTransform: 'uppercase' },
  block: { marginTop: 14, padding: 14, background: '#0b1220', border: '1px dashed #334155', borderRadius: 8 },
  hint: { margin: '0 0 10px 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 },
  textarea: { width: '100%', minHeight: 120, padding: 10, background: '#0a0f1c', border: '1px solid #334155', borderRadius: 6, color: '#e5e7eb', fontFamily: 'ui-monospace, monospace', fontSize: 12, boxSizing: 'border-box' },
  btnRow: { display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' },
  previewBtn: { padding: '6px 14px', background: 'transparent', color: '#22c55e', border: '1px solid #22c55e', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.4, textTransform: 'uppercase' },
  commitBtn: { padding: '8px 16px', background: '#22c55e', color: '#0b1220', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  preview: { marginTop: 12, padding: 10, background: '#0a0f1c', border: '1px solid #1f2937', borderRadius: 6, fontSize: 12, color: '#cbd5e1' },
  errors: { margin: '4px 0 0 16px', padding: 0, color: '#fca5a5', fontSize: 11, lineHeight: 1.5 },
};
