import React, { useState } from 'react';
import { useTable, RecordsTable, formStyles as s, today } from '../_shared';

const empty = () => ({
  status: 'offline',
  as_of_date: today(),
  last_operational_date: '',
  rated_kw: '',
  hub_height_m: '',
  historical_kwh: '',
  data_quality: 'estimated',
  source: '',
  notes: '',
});

function Wind() {
  const { rows, error, insert, update, remove } = useTable('renewables_wind', 'as_of_date');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({ ...r, last_operational_date: r.last_operational_date ?? '', rated_kw: r.rated_kw ?? '', hub_height_m: r.hub_height_m ?? '', historical_kwh: r.historical_kwh ?? '' }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    const coerce = (val, name) => {
      if (val === '') return null;
      const n = parseFloat(val);
      if (!Number.isFinite(n) || n < 0) {
        setMsg({ ok: false, text: `${name} must be a non-negative number (got "${val}")` });
        return false;
      }
      return n;
    };
    const ratedNum   = coerce(form.rated_kw, 'rated_kw');
    if (ratedNum === false) return;
    const hubNum     = coerce(form.hub_height_m, 'hub_height_m');
    if (hubNum === false) return;
    const histNum    = coerce(form.historical_kwh, 'historical_kwh');
    if (histNum === false) return;
    try {
      const payload = {
        status: form.status,
        as_of_date: form.as_of_date,
        last_operational_date: form.last_operational_date || null,
        rated_kw: ratedNum,
        hub_height_m: hubNum,
        historical_kwh: histNum,
        data_quality: form.data_quality,
        source: form.source || null,
        notes: form.notes || null,
      };
      if (editingId) { await update(editingId, payload); setMsg({ ok: true, text: 'Snapshot updated.' }); }
      else { await insert(payload); setMsg({ ok: true, text: 'Snapshot added.' }); }
      reset();
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this snapshot?')) return;
    try { await remove(id); if (editingId === id) reset(); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Renewables · Wind</div>
      <h1 style={s.title}>Wind Turbine</h1>
      <p style={s.subtitle}>
        Currently offline. Documented as an offline asset rather than omitted, so a future
        restoration decision has the historical baseline. The same data model can ingest live
        generation once the turbine is restored.
      </p>
      <div style={s.factor}>Methodology: GHG Protocol — honest treatment of inactive assets</div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit snapshot' : 'Add snapshot'}</h2>
        <div style={s.formGrid}>
          <label style={s.field}><span style={s.label}>As of</span><input type="date" value={form.as_of_date} onChange={(e) => setForm({ ...form, as_of_date: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Status</span>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={s.input}>
              <option>online</option><option>offline</option><option>decommissioned</option>
            </select>
          </label>
          <label style={s.field}><span style={s.label}>Last operational date</span><input type="date" value={form.last_operational_date} onChange={(e) => setForm({ ...form, last_operational_date: e.target.value })} style={s.input} /></label>
          <label style={s.field}><span style={s.label}>Rated kW</span><input type="number" step="0.01" min="0" value={form.rated_kw} onChange={(e) => setForm({ ...form, rated_kw: e.target.value })} style={s.input} /></label>
          <label style={s.field}><span style={s.label}>Hub height (m)</span><input type="number" step="0.1" min="0" value={form.hub_height_m} onChange={(e) => setForm({ ...form, hub_height_m: e.target.value })} style={s.input} /></label>
          <label style={s.field}><span style={s.label}>Historical kWh</span><input type="number" step="0.01" min="0" value={form.historical_kwh} onChange={(e) => setForm({ ...form, historical_kwh: e.target.value })} style={s.input} placeholder="while operational" /></label>
          <label style={s.field}><span style={s.label}>Data quality</span>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </label>
          <label style={{ ...s.field, ...s.full }}><span style={s.label}>Notes</span><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} placeholder="What records exist? Last service notes? Restoration plan?" /></label>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" style={s.submit}>{editingId ? 'Save changes' : 'Add snapshot'}</button>
          {editingId && <button type="button" onClick={reset} style={{ ...s.submit, background: 'transparent', color: '#cbd5e1', border: '1px solid #334155' }}>Cancel</button>}
        </div>
      </form>

      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      <RecordsTable
        rows={rows} onEdit={handleEdit} onDelete={onDelete} editingId={editingId}
        columns={[
          { key: 'as_of_date', label: 'As of' },
          { key: 'status', label: 'Status' },
          { key: 'last_operational_date', label: 'Last op' },
          { key: 'rated_kw', label: 'Rated kW' },
          { key: 'historical_kwh', label: 'Historical kWh' },
        ]}
      />
    </div>
  );
}

export default Wind;
