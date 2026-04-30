import React, { useState } from 'react';
import { useTable, useFactor, RecordsTable, formStyles as s, today } from '../_shared';

// Jenkins-style allometric for mixed hardwood (rough fallback when species-specific
// equation is unavailable):
//   biomass_kg = exp(-2.4800 + 2.4835 * ln(DBH_cm))
// Carbon = biomass × 0.5
const estimateBiomassKg = (dbhCm) => Math.exp(-2.4800 + 2.4835 * Math.log(dbhCm));

const empty = () => ({
  survey_date: today(),
  tree_id: '',
  latitude: '',
  longitude: '',
  species_common: '',
  species_scientific: '',
  dbh_cm: '',
  height_m: '',
  health_condition: 'good',
  land_class: 'lawn',
  data_quality: 'measured',
  source: '',
  notes: '',
});

function TreeInventory() {
  const { rows, error, insert, update, remove } = useTable('sinks_trees', 'survey_date');
  const seqFactor = useFactor('nowak_tree_seq_kg_c_per_m2_yr');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const dbh = parseFloat(form.dbh_cm);
  const biomassKg = !isNaN(dbh) && dbh > 0 ? estimateBiomassKg(dbh) : null;
  const carbonKg = biomassKg != null ? biomassKg * 0.5 : null;
  const co2eKg = carbonKg != null ? carbonKg * (44 / 12) : null;

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({
    ...r,
    latitude: r.latitude ?? '', longitude: r.longitude ?? '',
    dbh_cm: String(r.dbh_cm), height_m: r.height_m ?? '',
  }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        survey_date: form.survey_date,
        tree_id: form.tree_id || null,
        latitude: form.latitude === '' ? null : parseFloat(form.latitude),
        longitude: form.longitude === '' ? null : parseFloat(form.longitude),
        species_common: form.species_common || null,
        species_scientific: form.species_scientific || null,
        dbh_cm: parseFloat(form.dbh_cm),
        height_m: form.height_m === '' ? null : parseFloat(form.height_m),
        health_condition: form.health_condition,
        land_class: form.land_class,
        data_quality: form.data_quality,
        source: form.source || null,
        notes: form.notes || null,
      };
      if (editingId) { await update(editingId, payload); setMsg({ ok: true, text: 'Tree updated.' }); }
      else { await insert(payload); setMsg({ ok: true, text: 'Tree added.' }); }
      reset();
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this tree?')) return;
    try { await remove(id); if (editingId === id) reset(); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Sinks · Trees</div>
      <h1 style={s.title}>Tree Inventory</h1>
      <p style={s.subtitle}>
        DBH-based ground inventory. Per-tree biomass is computed from a Jenkins-style allometric
        as a fallback; species-specific equations from the USDA Urban Tree Database can replace
        this row-by-row later. Aerial canopy-cover analysis fills the Nowak (2013) campus-wide
        baseline.
      </p>
      <div style={s.factor}>
        Methodology: USDA Urban Tree Database allometrics · Nowak et al. (2013) urban averages{seqFactor && ` · ${seqFactor.value} ${seqFactor.unit}`}
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit tree' : 'Add tree'}</h2>
        <div style={s.formGrid}>
          <div style={s.field}><label style={s.label}>Survey date</label><input type="date" value={form.survey_date} onChange={(e) => setForm({ ...form, survey_date: e.target.value })} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>Tree ID</label><input type="text" value={form.tree_id} onChange={(e) => setForm({ ...form, tree_id: e.target.value })} style={s.input} placeholder="optional tag" /></div>
          <div style={s.field}><label style={s.label}>DBH (cm)</label><input type="number" step="0.1" min="0" value={form.dbh_cm} onChange={(e) => setForm({ ...form, dbh_cm: e.target.value })} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>Height (m)</label><input type="number" step="0.1" min="0" value={form.height_m} onChange={(e) => setForm({ ...form, height_m: e.target.value })} style={s.input} placeholder="optional" /></div>
          <div style={s.field}><label style={s.label}>Common name</label><input type="text" value={form.species_common} onChange={(e) => setForm({ ...form, species_common: e.target.value })} style={s.input} placeholder="e.g. Sugar maple" /></div>
          <div style={s.field}><label style={s.label}>Scientific name</label><input type="text" value={form.species_scientific} onChange={(e) => setForm({ ...form, species_scientific: e.target.value })} style={s.input} placeholder="Acer saccharum" /></div>
          <div style={s.field}><label style={s.label}>Health</label>
            <select value={form.health_condition} onChange={(e) => setForm({ ...form, health_condition: e.target.value })} style={s.input}>
              <option>good</option><option>fair</option><option>poor</option><option>dead</option>
            </select>
          </div>
          <div style={s.field}><label style={s.label}>Land class</label>
            <select value={form.land_class} onChange={(e) => setForm({ ...form, land_class: e.target.value })} style={s.input}>
              <option>forest</option><option>lawn</option><option>athletic</option><option>garden</option><option>hardscape</option><option>other</option>
            </select>
          </div>
          <div style={s.field}><label style={s.label}>Latitude</label><input type="number" step="0.000001" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Longitude</label><input type="number" step="0.000001" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Data quality</label>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </div>
          <div style={{ ...s.field, ...s.full }}><label style={s.label}>Notes</label><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} /></div>
        </div>
        {co2eKg != null && (
          <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, border: '1px solid #14532d', background: '#052e1a', color: '#86efac', fontSize: 14, display: 'grid', gap: 4 }}>
            <div>Estimated biomass (Jenkins-style fallback): <strong>{biomassKg.toFixed(1)} kg</strong></div>
            <div>Carbon stored: <strong>{carbonKg.toFixed(1)} kg C</strong> · CO₂-equivalent: <strong>{co2eKg.toFixed(1)} kg CO₂e</strong></div>
            <div style={{ opacity: 0.7 }}>Replace with species-specific allometric for production accounting.</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" style={s.submit}>{editingId ? 'Save changes' : 'Add tree'}</button>
          {editingId && <button type="button" onClick={reset} style={{ ...s.submit, background: 'transparent', color: '#cbd5e1', border: '1px solid #334155' }}>Cancel</button>}
        </div>
      </form>

      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      <RecordsTable
        rows={rows} onEdit={handleEdit} onDelete={onDelete} editingId={editingId}
        columns={[
          { key: 'survey_date', label: 'Surveyed' },
          { key: 'tree_id', label: 'Tag', mono: true },
          { key: 'species_common', label: 'Species' },
          { key: 'dbh_cm', label: 'DBH cm' },
          { key: 'health_condition', label: 'Health' },
          { key: 'land_class', label: 'Land' },
        ]}
      />
    </div>
  );
}

export default TreeInventory;
