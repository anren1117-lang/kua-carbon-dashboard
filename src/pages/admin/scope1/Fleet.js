import React, { useState } from 'react';
import { useTable, useFactor, RecordsTable, PreviewBanner, formStyles as s, today, firstOfMonth } from '../_shared';

const factorKeys = { gasoline: 'epa_gasoline_co2_kg_per_gal', diesel: 'epa_diesel_co2_kg_per_gal', other: null };

const empty = () => ({
  period_start: firstOfMonth(),
  period_end: today(),
  vehicle_id: '',
  fuel_type: 'gasoline',
  gallons: '',
  miles: '',
  cost_usd: '',
  data_quality: 'measured',
  source: '',
  notes: '',
});

function Fleet() {
  const { rows, error, insert, update, remove } = useTable('scope1_fleet', 'period_end');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const factor = useFactor(factorKeys[form.fuel_type] || 'epa_gasoline_co2_kg_per_gal');
  const gallons = parseFloat(form.gallons);
  const preview = factor && !isNaN(gallons) ? gallons * Number(factor.value) : null;

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({ ...r, gallons: r.gallons ?? '', miles: r.miles ?? '', cost_usd: r.cost_usd ?? '' }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.gallons && !form.miles) { setMsg({ ok: false, text: 'Need either gallons or miles.' }); return; }
    // Each numeric field can be empty (kept as null) but if filled in
    // must coerce to a finite non-negative value.
    const coerce = (val, name) => {
      if (val === '') return null;
      const n = parseFloat(val);
      if (!Number.isFinite(n) || n < 0) {
        setMsg({ ok: false, text: `${name} must be a non-negative number (got "${val}")` });
        return false;
      }
      return n;
    };
    const gallonsNum = coerce(form.gallons, 'gallons');
    if (gallonsNum === false) return;
    const milesNum   = coerce(form.miles,   'miles');
    if (milesNum === false) return;
    const costNum    = coerce(form.cost_usd, 'cost_usd');
    if (costNum === false) return;
    try {
      const payload = {
        period_start: form.period_start,
        period_end: form.period_end,
        vehicle_id: form.vehicle_id || null,
        fuel_type: form.fuel_type,
        gallons: gallonsNum,
        miles: milesNum,
        cost_usd: costNum,
        data_quality: form.data_quality,
        source: form.source || null,
        notes: form.notes || null,
      };
      if (editingId) { await update(editingId, payload); setMsg({ ok: true, text: 'Period updated.' }); }
      else { await insert(payload); setMsg({ ok: true, text: 'Period added.' }); }
      reset();
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try { await remove(id); if (editingId === id) reset(); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 1 · Fleet</div>
      <h1 style={s.title}>Fleet Vehicle Fuel</h1>
      <p style={s.subtitle}>
        Campus-owned vans and trucks. Gallons from fuel-card records is preferred; miles is
        accepted as an alternate when only odometer data is available.
      </p>
      <div style={s.factor}>
        Methodology: EPA GHG Emission Factors Hub (mobile combustion){factor && ` — ${form.fuel_type}: ${factor.value} ${factor.unit}`}
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit period' : 'Add period'}</h2>
        <div style={s.formGrid}>
          <label style={s.field}><span style={s.label}>Period start</span><input type="date" value={form.period_start} onChange={(e) => setForm({ ...form, period_start: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Period end</span><input type="date" value={form.period_end} onChange={(e) => setForm({ ...form, period_end: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Vehicle ID</span><input type="text" value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} style={s.input} placeholder="e.g. Van-1" /></label>
          <label style={s.field}><span style={s.label}>Fuel type</span>
            <select value={form.fuel_type} onChange={(e) => setForm({ ...form, fuel_type: e.target.value })} style={s.input}>
              <option value="gasoline">gasoline</option><option value="diesel">diesel</option><option value="other">other</option>
            </select>
          </label>
          <label style={s.field}><span style={s.label}>Gallons</span><input type="number" step="0.01" min="0" value={form.gallons} onChange={(e) => setForm({ ...form, gallons: e.target.value })} style={s.input} placeholder="preferred" /></label>
          <label style={s.field}><span style={s.label}>Miles</span><input type="number" step="0.1" min="0" value={form.miles} onChange={(e) => setForm({ ...form, miles: e.target.value })} style={s.input} placeholder="alternate" /></label>
          <label style={s.field}><span style={s.label}>Cost (USD)</span><input type="number" step="0.01" min="0" value={form.cost_usd} onChange={(e) => setForm({ ...form, cost_usd: e.target.value })} style={s.input} /></label>
          <label style={s.field}><span style={s.label}>Data quality</span>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </label>
          <label style={{ ...s.field, ...s.full }}><span style={s.label}>Notes</span><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} /></label>
        </div>
        <PreviewBanner kgCo2e={preview} citation={factor?.source_citation} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" style={s.submit}>{editingId ? 'Save changes' : 'Add period'}</button>
          {editingId && <button type="button" onClick={reset} style={{ ...s.submit, background: 'transparent', color: '#cbd5e1', border: '1px solid #334155' }}>Cancel</button>}
        </div>
      </form>

      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      <RecordsTable
        rows={rows} onEdit={handleEdit} onDelete={onDelete} editingId={editingId}
        columns={[
          { key: 'period_end', label: 'Period end' },
          { key: 'vehicle_id', label: 'Vehicle' },
          { key: 'fuel_type', label: 'Fuel' },
          { key: 'gallons', label: 'Gallons' },
          { key: 'miles', label: 'Miles' },
        ]}
      />
    </div>
  );
}

export default Fleet;
