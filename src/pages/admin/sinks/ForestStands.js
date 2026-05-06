import React, { useState } from 'react';
import { useTable, RecordsTable, formStyles as s, today, currentSchoolYear } from '../_shared';
import { logAdminWrite } from '../../../utils/adminAudit.js';
import { toCsv, downloadCsv } from '../../../utils/csv.js';

// Per-stand forest inventory entry. Drives forest_stand_actuals which
// flips the Sinks page from the hardcoded 7-stand placeholder to the
// real walk-through. Composer in src/data/scopeTotals.js does the
// math (acres × mtco2e_acre_yr); this page is just the form + table.
//
// Each row needs:
//   - acreage from the survey (real walk-through trumps the GIS guess)
//   - per-acre sequestration rate. Default to a Birdsey/Nowak band
//     centered on the stand type; admins can override if a USFS FIA
//     site-specific rate is in hand.
//
// Default rate defaults are conservative — closer to Birdsey 1992
// average than to Nowak 2013 open-grown. Admins should bump them
// when an FIA-style local rate is sourced.

const DEFAULT_RATE_BY_TYPE = {
  mixed_hardwood: 2.5,
  softwood:       1.9,
  transitional:   2.7,
  open_grown:     4.0,
};

const empty = () => ({
  stand_id: '',
  name: '',
  acres: '',
  type: 'mixed_hardwood',
  age_class: 'mature',
  mtco2e_acre_yr: '',
  dominant_species: '',
  surveyed_at: today(),
  surveyed_by: '',
  notes: '',
  school_year: currentSchoolYear(),
});

function ForestStands() {
  const { rows, error, insert, remove } = useTable('forest_stand_actuals', 'created_at');
  const [form, setForm] = useState(empty());
  const [msg, setMsg] = useState(null);

  const acresNum = parseFloat(form.acres);
  const rateNum  = parseFloat(form.mtco2e_acre_yr);
  const previewMt = Number.isFinite(acresNum) && Number.isFinite(rateNum) && acresNum >= 0 && rateNum >= 0
    ? acresNum * rateNum
    : null;
  const totalMt = (rows || []).reduce((sum, r) => sum + (Number(r.acres) || 0) * (Number(r.mtco2e_acre_yr) || 0), 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMsg({ ok: false, text: 'Stand name is required.' });
      return;
    }
    if (!Number.isFinite(acresNum) || acresNum < 0) {
      setMsg({ ok: false, text: `Acres must be a non-negative number (got "${form.acres}").` });
      return;
    }
    const rateChosen = Number.isFinite(rateNum) && rateNum >= 0
      ? rateNum
      : DEFAULT_RATE_BY_TYPE[form.type] ?? 2.5;
    const payload = {
      stand_id: form.stand_id.trim() || null,
      name: form.name.trim(),
      acres: acresNum,
      type: form.type,
      age_class: form.age_class,
      mtco2e_acre_yr: rateChosen,
      dominant_species: form.dominant_species.trim() || null,
      surveyed_at: form.surveyed_at || null,
      surveyed_by: form.surveyed_by.trim() || null,
      notes: form.notes.trim() || null,
      school_year: form.school_year || null,
    };
    try {
      await insert(payload);
      logAdminWrite({ action: 'insert', table: 'forest_stand_actuals', payload });
      setMsg({ ok: true, text: `Saved "${payload.name}" (${payload.acres} acres × ${payload.mtco2e_acre_yr} mt/acre/yr = ${(payload.acres * payload.mtco2e_acre_yr).toFixed(1)} mt/yr).` });
      setForm(empty());
    } catch (err) {
      setMsg({ ok: false, text: `Insert failed: ${err.message || err}` });
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this stand? The Sinks page will refresh on next visit.')) return;
    try {
      await remove(id);
      logAdminWrite({ action: 'delete', table: 'forest_stand_actuals', payload: { id } });
    } catch (err) {
      setMsg({ ok: false, text: `Delete failed: ${err.message || err}` });
    }
  };

  const onExport = () => {
    if (!rows || rows.length === 0) return;
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`kua_forest_stand_actuals_${stamp}.csv`, toCsv(rows));
  };

  return (
    <div>
      <h1 style={s.title}>Forest Stand Inventory</h1>
      <p style={s.subtitle}>
        Per-stand acreage + per-acre sequestration rate. The Sinks page total upgrades from
        the hardcoded 7-stand placeholder to whatever rows live here the moment any are entered.
      </p>

      {error && <div style={{ ...s.msg, ...s.msgErr }}>Supabase: {error.message || error}</div>}
      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form onSubmit={submit} style={s.card}>
        <div style={s.formGrid}>
          <Field label="Stand ID (optional, e.g. stand_north)">
            <input type="text" value={form.stand_id} onChange={(e) => setForm({ ...form, stand_id: e.target.value })} style={s.input} />
          </Field>
          <Field label="Name *">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={s.input} required />
          </Field>
          <Field label="Acres *">
            <input type="number" step="0.1" min="0" value={form.acres} onChange={(e) => setForm({ ...form, acres: e.target.value })} style={s.input} required />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, mtco2e_acre_yr: '' })} style={s.input}>
              <option value="mixed_hardwood">Mixed hardwood</option>
              <option value="softwood">Softwood</option>
              <option value="transitional">Transitional</option>
              <option value="open_grown">Open-grown</option>
            </select>
          </Field>
          <Field label="Age class">
            <select value={form.age_class} onChange={(e) => setForm({ ...form, age_class: e.target.value })} style={s.input}>
              <option value="young">Young</option>
              <option value="intermediate">Intermediate</option>
              <option value="mature">Mature</option>
              <option value="old_growth">Old growth</option>
            </select>
          </Field>
          <Field label={`mt CO₂e / acre / yr (default ${DEFAULT_RATE_BY_TYPE[form.type] ?? 2.5})`}>
            <input
              type="number"
              step="0.05"
              min="0"
              placeholder={String(DEFAULT_RATE_BY_TYPE[form.type] ?? 2.5)}
              value={form.mtco2e_acre_yr}
              onChange={(e) => setForm({ ...form, mtco2e_acre_yr: e.target.value })}
              style={s.input}
            />
          </Field>
          <Field label="Dominant species (free text)">
            <input type="text" value={form.dominant_species} onChange={(e) => setForm({ ...form, dominant_species: e.target.value })} style={s.input} />
          </Field>
          <Field label="Surveyed">
            <input type="date" value={form.surveyed_at} onChange={(e) => setForm({ ...form, surveyed_at: e.target.value })} style={s.input} />
          </Field>
          <Field label="Surveyor">
            <input type="text" value={form.surveyed_by} onChange={(e) => setForm({ ...form, surveyed_by: e.target.value })} style={s.input} />
          </Field>
          <Field label="School year">
            <input type="text" value={form.school_year} onChange={(e) => setForm({ ...form, school_year: e.target.value })} style={s.input} />
          </Field>
        </div>
        <Field label="Notes">
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            style={{ ...s.input, minHeight: 60 }}
          />
        </Field>

        {previewMt !== null && (
          <div style={s.factor}>
            Preview: <strong>{form.acres} acres × {form.mtco2e_acre_yr || (DEFAULT_RATE_BY_TYPE[form.type] ?? 2.5)} mt/acre/yr = {previewMt.toFixed(1)} mtCO₂e/yr</strong>
          </div>
        )}
        <button type="submit" style={s.submit}>Save stand</button>
      </form>

      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, color: '#94a3b8' }}>
          {rows ? `${rows.length} stand${rows.length === 1 ? '' : 's'} entered · live total ${totalMt.toFixed(0)} mtCO₂e/yr` : 'Loading…'}
        </div>
        {rows && rows.length > 0 && (
          <button type="button" onClick={onExport} style={{ ...s.submit, padding: '6px 12px', fontSize: 12, background: 'transparent', color: '#22c55e', border: '1px solid #22c55e', textTransform: 'uppercase', letterSpacing: 0.4 }}>Download CSV</button>
        )}
      </div>

      <RecordsTable
        rows={rows}
        columns={[
          { key: 'name',           label: 'Name' },
          { key: 'acres',          label: 'Acres', align: 'right' },
          { key: 'type',           label: 'Type' },
          { key: 'age_class',      label: 'Age' },
          { key: 'mtco2e_acre_yr', label: 'mt/acre/yr', align: 'right' },
          { key: 'dominant_species', label: 'Species' },
          { key: 'surveyed_at',    label: 'Surveyed' },
        ]}
        onDelete={onDelete}
      />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 12 }}>
      <div style={{ marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

export default ForestStands;
