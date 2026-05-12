import React, { useState } from 'react';
import { useTable, useFactor, RecordsTable, formStyles as s, today, firstOfMonth } from '../_shared';

const LB_TO_KG = 0.45359237;

const empty = () => ({
  period_start: firstOfMonth(),
  period_end: today(),
  inverter_id: '',
  gross_kwh: '',
  self_consumed_kwh: '',
  exported_kwh: '',
  data_quality: 'measured',
  source: '',
  notes: '',
});

function Solar() {
  const { rows, error, insert, update, remove } = useTable('renewables_solar', 'period_end');
  const factor = useFactor('iso_ne_grid_co2_lb_per_mwh');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const gross = parseFloat(form.gross_kwh) || 0;
  const self = parseFloat(form.self_consumed_kwh) || 0;
  const exp = parseFloat(form.exported_kwh) || 0;
  const total = self + exp;
  const mismatch = gross > 0 && Math.abs(total - gross) / gross > 0.05; // > 5% mismatch

  const avoidedKgFromSelf = factor && self > 0 ? (self / 1000) * Number(factor.value) * LB_TO_KG : 0;
  const avoidedKgFromExport = factor && exp > 0 ? (exp / 1000) * Number(factor.value) * LB_TO_KG : 0;

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({ ...r, gross_kwh: String(r.gross_kwh), self_consumed_kwh: r.self_consumed_kwh ?? '', exported_kwh: r.exported_kwh ?? '' }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    const grossNum = parseFloat(form.gross_kwh);
    if (!Number.isFinite(grossNum) || grossNum < 0) {
      setMsg({ ok: false, text: `Gross kWh must be a non-negative number (got "${form.gross_kwh}")` });
      return;
    }
    const coerceOpt = (val, name) => {
      if (val === '') return null;
      const n = parseFloat(val);
      if (!Number.isFinite(n) || n < 0) {
        setMsg({ ok: false, text: `${name} must be a non-negative number (got "${val}")` });
        return false;
      }
      return n;
    };
    const selfNum = coerceOpt(form.self_consumed_kwh, 'self_consumed_kwh');
    if (selfNum === false) return;
    const expNum  = coerceOpt(form.exported_kwh, 'exported_kwh');
    if (expNum === false) return;
    try {
      const payload = {
        period_start: form.period_start,
        period_end: form.period_end,
        inverter_id: form.inverter_id || null,
        gross_kwh: grossNum,
        self_consumed_kwh: selfNum,
        exported_kwh: expNum,
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
    if (!window.confirm('Delete this period?')) return;
    try { await remove(id); if (editingId === id) reset(); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Renewables · Solar PV</div>
      <h1 style={s.title}>Solar Generation</h1>
      <p style={s.subtitle}>
        Self-consumed kWh reduce Scope 2 directly; exported kWh are tracked separately as
        avoided grid emissions to avoid double-counting under net metering.
      </p>
      <div style={s.factor}>
        Methodology: GHG Protocol on-site renewable + net-metering split{factor && ` · grid factor ${factor.value} ${factor.unit}`}
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit period' : 'Add period'}</h2>
        <div style={s.formGrid}>
          <label style={s.field}><span style={s.label}>Period start</span><input type="date" value={form.period_start} onChange={(e) => setForm({ ...form, period_start: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Period end</span><input type="date" value={form.period_end} onChange={(e) => setForm({ ...form, period_end: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Gross kWh</span><input type="number" step="0.01" min="0" value={form.gross_kwh} onChange={(e) => setForm({ ...form, gross_kwh: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Self-consumed kWh</span><input type="number" step="0.01" min="0" value={form.self_consumed_kwh} onChange={(e) => setForm({ ...form, self_consumed_kwh: e.target.value })} style={s.input} placeholder="reduces Scope 2" /></label>
          <label style={s.field}><span style={s.label}>Exported kWh</span><input type="number" step="0.01" min="0" value={form.exported_kwh} onChange={(e) => setForm({ ...form, exported_kwh: e.target.value })} style={s.input} placeholder="net-metered to grid" /></label>
          <label style={s.field}><span style={s.label}>Inverter ID</span><input type="text" value={form.inverter_id} onChange={(e) => setForm({ ...form, inverter_id: e.target.value })} style={s.input} /></label>
          <label style={s.field}><span style={s.label}>Data quality</span>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </label>
          <label style={{ ...s.field, ...s.full }}><span style={s.label}>Source pointer</span><input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} style={s.input} placeholder="inverter export filename" /></label>
          <label style={{ ...s.field, ...s.full }}><span style={s.label}>Notes</span><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} /></label>
        </div>
        <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, border: `1px solid ${mismatch ? '#7f1d1d' : '#14532d'}`, background: mismatch ? '#3a0d0d' : '#052e1a', color: mismatch ? '#fca5a5' : '#86efac', fontSize: 14, display: 'grid', gap: 4 }}>
          {mismatch && <div>⚠ Self-consumed + exported = {total.toFixed(0)} kWh, gross = {gross.toFixed(0)} kWh — &gt;5% mismatch.</div>}
          <div>Self-consumed avoided emissions: <strong>{avoidedKgFromSelf.toFixed(2)} kg CO₂e</strong> (reduces Scope 2)</div>
          <div>Exported avoided emissions: <strong>{avoidedKgFromExport.toFixed(2)} kg CO₂e</strong> (separate line)</div>
        </div>
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
          { key: 'gross_kwh', label: 'Gross kWh' },
          { key: 'self_consumed_kwh', label: 'Self kWh' },
          { key: 'exported_kwh', label: 'Export kWh' },
          { key: 'inverter_id', label: 'Inverter', mono: true },
        ]}
      />
    </div>
  );
}

export default Solar;
