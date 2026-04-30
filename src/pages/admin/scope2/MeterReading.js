import React, { useState } from 'react';
import { useTable, useFactor, RecordsTable, PreviewBanner, formStyles as s, today, firstOfMonth } from '../_shared';

const empty = () => ({
  period_start: firstOfMonth(),
  period_end: today(),
  meter_id: '',
  building: '',
  kwh: '',
  data_quality: 'measured',
  source: 'campus_meter',
  notes: '',
});

const LB_TO_KG = 0.45359237;

function MeterReading() {
  const { rows, error, insert, update, remove } = useTable('scope2_meter_readings', 'period_end');
  const factor = useFactor('iso_ne_grid_co2_lb_per_mwh'); // 643 lb CO2 / MWh
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  // Preview: kWh × (lb CO2 / MWh) / 1000 × LB_TO_KG  →  kg CO2
  const kwh = parseFloat(form.kwh);
  const preview = factor && !isNaN(kwh) ? (kwh / 1000) * Number(factor.value) * LB_TO_KG : null;

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({ ...r, kwh: String(r.kwh) }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        period_start: form.period_start,
        period_end: form.period_end,
        meter_id: form.meter_id || null,
        building: form.building || null,
        kwh: parseFloat(form.kwh),
        data_quality: form.data_quality,
        source: form.source || 'campus_meter',
        notes: form.notes || null,
      };
      if (editingId) { await update(editingId, payload); setMsg({ ok: true, text: 'Reading updated.' }); }
      else { await insert(payload); setMsg({ ok: true, text: 'Reading added.' }); }
      reset();
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this reading?')) return;
    try { await remove(id); if (editingId === id) reset(); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 2 · Electricity</div>
      <h1 style={s.title}>Campus Meter Readings</h1>
      <p style={s.subtitle}>
        Campus real-time meter is the source of truth for quantity. Liberty bills go in the
        Utility Bills page for reconciliation only.
      </p>
      <div style={s.factor}>
        Methodology: ISO New England Electric Generator Air Emissions Report (location-based){factor && ` — ${factor.value} ${factor.unit}`}
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit reading' : 'Add reading'}</h2>
        <div style={s.formGrid}>
          <div style={s.field}><label style={s.label}>Period start</label><input type="date" value={form.period_start} onChange={(e) => setForm({ ...form, period_start: e.target.value })} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>Period end</label><input type="date" value={form.period_end} onChange={(e) => setForm({ ...form, period_end: e.target.value })} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>kWh</label><input type="number" step="0.01" min="0" value={form.kwh} onChange={(e) => setForm({ ...form, kwh: e.target.value })} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>Meter ID</label><input type="text" value={form.meter_id} onChange={(e) => setForm({ ...form, meter_id: e.target.value })} style={s.input} placeholder="optional" /></div>
          <div style={s.field}><label style={s.label}>Building</label><input type="text" value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} style={s.input} placeholder="campus-wide if blank" /></div>
          <div style={s.field}><label style={s.label}>Data quality</label>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </div>
          <div style={{ ...s.field, ...s.full }}><label style={s.label}>Source pointer</label><input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} style={s.input} placeholder="campus_meter / Envysion export ref" /></div>
          <div style={{ ...s.field, ...s.full }}><label style={s.label}>Notes</label><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} /></div>
        </div>
        <PreviewBanner kgCo2e={preview} citation={factor?.source_citation} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" style={s.submit}>{editingId ? 'Save changes' : 'Add reading'}</button>
          {editingId && <button type="button" onClick={reset} style={{ ...s.submit, background: 'transparent', color: '#cbd5e1', border: '1px solid #334155' }}>Cancel</button>}
        </div>
      </form>

      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      <RecordsTable
        rows={rows} onEdit={handleEdit} onDelete={onDelete} editingId={editingId}
        columns={[
          { key: 'period_end', label: 'Period end' },
          { key: 'building', label: 'Building' },
          { key: 'meter_id', label: 'Meter', mono: true },
          { key: 'kwh', label: 'kWh' },
          { key: 'source', label: 'Source', mono: true },
        ]}
      />
    </div>
  );
}

export default MeterReading;
