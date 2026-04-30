import React, { useState } from 'react';
import { useTable, useFactor, RecordsTable, PreviewBanner, formStyles as s, today } from '../_shared';

const empty = () => ({
  delivery_date: today(), vendor: '', invoice_number: '',
  building_or_tank: '', gallons: '', cost_usd: '',
  data_quality: 'measured', source: '', notes: '',
});

function HeatingOil() {
  const { rows, error, insert, update, remove } = useTable('scope1_heating_oil', 'delivery_date');
  const factor = useFactor('epa_heating_oil_co2_kg_per_gal');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const gallons = parseFloat(form.gallons);
  const preview = factor && !isNaN(gallons) ? gallons * Number(factor.value) : null;

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({ ...r, gallons: String(r.gallons), cost_usd: r.cost_usd ?? '' }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        delivery_date: form.delivery_date,
        vendor: form.vendor || null,
        invoice_number: form.invoice_number || null,
        building_or_tank: form.building_or_tank || null,
        gallons: parseFloat(form.gallons),
        cost_usd: form.cost_usd === '' ? null : parseFloat(form.cost_usd),
        data_quality: form.data_quality,
        source: form.source || null,
        notes: form.notes || null,
      };
      if (editingId) { await update(editingId, payload); setMsg({ ok: true, text: 'Delivery updated.' }); }
      else { await insert(payload); setMsg({ ok: true, text: 'Delivery added.' }); }
      reset();
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this delivery?')) return;
    try { await remove(id); if (editingId === id) reset(); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 1 · Heating Fuel</div>
      <h1 style={s.title}>Heating Oil Deliveries</h1>
      <p style={s.subtitle}>
        On-site combustion in campus boilers. One row per delivery — gallons is the input the
        methodology requires; the emission factor is applied at report time.
      </p>
      <div style={s.factor}>
        Methodology: EPA GHG Emission Factors Hub (#2 distillate, stationary combustion){factor && ` — ${factor.value} ${factor.unit}`}
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit delivery' : 'Add delivery'}</h2>
        <div style={s.formGrid}>
          <div style={s.field}>
            <label style={s.label}>Delivery date</label>
            <input type="date" value={form.delivery_date} onChange={(e) => setForm({ ...form, delivery_date: e.target.value })} style={s.input} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Gallons</label>
            <input type="number" step="0.01" min="0" value={form.gallons} onChange={(e) => setForm({ ...form, gallons: e.target.value })} style={s.input} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Cost (USD)</label>
            <input type="number" step="0.01" min="0" value={form.cost_usd} onChange={(e) => setForm({ ...form, cost_usd: e.target.value })} style={s.input} placeholder="optional" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Building / tank</label>
            <input type="text" value={form.building_or_tank} onChange={(e) => setForm({ ...form, building_or_tank: e.target.value })} style={s.input} placeholder="e.g. Bicentennial Hall" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Vendor</label>
            <input type="text" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} style={s.input} placeholder="Fuel supplier" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Invoice #</label>
            <input type="text" value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Data quality</label>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </div>
          <div style={{ ...s.field, ...s.full }}>
            <label style={s.label}>Source pointer</label>
            <input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} style={s.input} placeholder="e.g. invoice scan filename" />
          </div>
          <div style={{ ...s.field, ...s.full }}>
            <label style={s.label}>Notes</label>
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} placeholder="optional" />
          </div>
        </div>
        <PreviewBanner kgCo2e={preview} citation={factor?.source_citation} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" style={s.submit}>{editingId ? 'Save changes' : 'Add delivery'}</button>
          {editingId && <button type="button" onClick={reset} style={{ ...s.submit, background: 'transparent', color: '#cbd5e1', border: '1px solid #334155' }}>Cancel</button>}
        </div>
      </form>

      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      <RecordsTable
        rows={rows}
        onEdit={handleEdit}
        onDelete={onDelete}
        editingId={editingId}
        columns={[
          { key: 'delivery_date', label: 'Date' },
          { key: 'gallons', label: 'Gallons', render: (r) => `${r.gallons}` },
          { key: 'building_or_tank', label: 'Building' },
          { key: 'vendor', label: 'Vendor' },
          { key: 'invoice_number', label: 'Invoice', mono: true },
          { key: 'cost_usd', label: 'Cost', render: (r) => r.cost_usd != null ? `$${r.cost_usd}` : '—' },
        ]}
      />
    </div>
  );
}

export default HeatingOil;
