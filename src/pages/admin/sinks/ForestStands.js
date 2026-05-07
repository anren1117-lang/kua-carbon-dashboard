import React, { useState } from 'react';
import { useTable, RecordsTable, formStyles as s, today, currentSchoolYear } from '../_shared';
import { logAdminWrite } from '../../../utils/adminAudit.js';
import { toCsv, downloadCsv } from '../../../utils/csv.js';
import CsvImportPanel, { validateForestStandRow } from '../../../components/CsvImportPanel.js';

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
  const { rows, error, insert, update, remove, refresh } = useTable('forest_stand_actuals', 'created_at');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
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
      if (editingId) {
        await update(editingId, payload);
        logAdminWrite({ action: 'update', table: 'forest_stand_actuals', payload: { id: editingId, ...payload } });
        setMsg({ ok: true, text: `Updated "${payload.name}" (${payload.acres} acres × ${payload.mtco2e_acre_yr} mt/acre/yr = ${(payload.acres * payload.mtco2e_acre_yr).toFixed(1)} mt/yr).` });
      } else {
        await insert(payload);
        logAdminWrite({ action: 'insert', table: 'forest_stand_actuals', payload });
        setMsg({ ok: true, text: `Saved "${payload.name}" (${payload.acres} acres × ${payload.mtco2e_acre_yr} mt/acre/yr = ${(payload.acres * payload.mtco2e_acre_yr).toFixed(1)} mt/yr).` });
      }
      setForm(empty());
      setEditingId(null);
    } catch (err) {
      setMsg({ ok: false, text: `${editingId ? 'Update' : 'Insert'} failed: ${err.message || err}` });
    }
  };

  // Pre-fill form with this row's values + flip into update mode.
  const onEdit = (row) => {
    setForm({
      stand_id: row.stand_id || '',
      name: row.name || '',
      acres: row.acres != null ? String(row.acres) : '',
      type: row.type || 'mixed_hardwood',
      age_class: row.age_class || 'mature',
      mtco2e_acre_yr: row.mtco2e_acre_yr != null ? String(row.mtco2e_acre_yr) : '',
      dominant_species: row.dominant_species || '',
      surveyed_at: row.surveyed_at || today(),
      surveyed_by: row.surveyed_by || '',
      notes: row.notes || '',
      school_year: row.school_year || currentSchoolYear(),
    });
    setEditingId(row.id);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditingId(null); setForm(empty()); setMsg(null); };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this stand? The Sinks page will refresh on next visit.')) return;
    try {
      await remove(id);
      logAdminWrite({ action: 'delete', table: 'forest_stand_actuals', payload: { id } });
      // If the row being deleted was loaded into the form, drop it.
      if (editingId === id) cancelEdit();
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

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <CsvImportPanel
          tableName="forest_stand_actuals"
          labelSingular="stand"
          columnsHint="stand_id,name,acres,type,age_class,mtco2e_acre_yr,dominant_species,surveyed_at,surveyed_by,notes,school_year"
          examplePlaceholder={'stand_id,name,acres,type,age_class,mtco2e_acre_yr,dominant_species,surveyed_at,surveyed_by,notes\nstand_north,North Hill,320,mixed_hardwood,mature,2.8,"Sugar maple, red oak",2026-04-12,Forestry Consultants LLC,Phase-1 walkthrough\nstand_south,South ridge,240,softwood,mature,1.9,"White pine, hemlock",2026-04-12,Forestry Consultants LLC,'}
          validateRow={validateForestStandRow}
          onComplete={refresh}
          onMessage={(text) => setMsg({ ok: text.startsWith('✓'), text })}
        />
      </div>

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
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="submit" style={s.submit}>{editingId ? 'Update stand' : 'Save stand'}</button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{ padding: '8px 14px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancel edit
            </button>
          )}
        </div>
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
        onEdit={onEdit}
        onDelete={onDelete}
        editingId={editingId}
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
