import React, { useState } from 'react';
import { useTable, useFactor, RecordsTable, PreviewBanner, formStyles as s, today, LB_TO_KG } from '../_shared';

// Map UI selection -> factor key in emission_factors. Add new GWPs to the seed
// migration and they automatically appear here.
const refrigerantOptions = [
  { value: 'R-410A', factorKey: 'gwp_r410a_ar6' },
  { value: 'R-22',   factorKey: 'gwp_r22_ar6'   },
  { value: 'R-134a', factorKey: 'gwp_r134a_ar6' },
  { value: 'R-32',   factorKey: 'gwp_r32_ar6'   },
];

const empty = () => ({
  service_date: today(),
  equipment_id: '',
  refrigerant_type: 'R-410A',
  recharge_lb: '',
  reclaim_lb: '',
  service_company: '',
  service_report_number: '',
  data_quality: 'measured',
  source: '',
  notes: '',
});

function Refrigerants() {
  const { rows, error, insert, update, remove } = useTable('scope1_refrigerants', 'service_date');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const factorKey = (refrigerantOptions.find((r) => r.value === form.refrigerant_type) || refrigerantOptions[0]).factorKey;
  const factor = useFactor(factorKey);

  // Mass-balance: emissions = (recharge - reclaim) lb × LB_TO_KG × GWP100
  const recharge = parseFloat(form.recharge_lb) || 0;
  const reclaim = parseFloat(form.reclaim_lb) || 0;
  const netLb = recharge - reclaim;
  const preview = factor ? netLb * LB_TO_KG * Number(factor.value) : null;

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({ ...r, recharge_lb: String(r.recharge_lb ?? ''), reclaim_lb: String(r.reclaim_lb ?? '') }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    // recharge/reclaim are optional — empty stays 0. Non-empty values
    // must coerce to a finite non-negative number, otherwise the
    // mass-balance preview shows the right answer but the saved row
    // gets NaN-as-null and is silently skipped from emissions totals.
    const coerce = (val, name) => {
      if (val === '') return 0;
      const n = parseFloat(val);
      if (!Number.isFinite(n) || n < 0) {
        setMsg({ ok: false, text: `${name} must be a non-negative number (got "${val}")` });
        return null;
      }
      return n;
    };
    const rechargeNum = coerce(form.recharge_lb, 'recharge_lb');
    if (rechargeNum === null) return;
    const reclaimNum  = coerce(form.reclaim_lb,  'reclaim_lb');
    if (reclaimNum === null) return;
    try {
      const payload = {
        service_date: form.service_date,
        equipment_id: form.equipment_id || null,
        refrigerant_type: form.refrigerant_type,
        recharge_lb: rechargeNum,
        reclaim_lb: reclaimNum,
        service_company: form.service_company || null,
        service_report_number: form.service_report_number || null,
        data_quality: form.data_quality,
        source: form.source || null,
        notes: form.notes || null,
      };
      if (editingId) { await update(editingId, payload); setMsg({ ok: true, text: 'Service entry updated.' }); }
      else { await insert(payload); setMsg({ ok: true, text: 'Service entry added.' }); }
      reset();
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try { await remove(id); if (editingId === id) reset(); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 1 · Refrigerants</div>
      <h1 style={s.title}>Refrigerant Service Records</h1>
      <p style={s.subtitle}>
        GHG Protocol mass-balance: fugitive emissions = (recharge − reclaim) by mass × GWP100.
        One row per technician service event from the service report.
      </p>
      <div style={s.factor}>
        Methodology: GHG Protocol Refrigerants tool · IPCC AR6 GWP100{factor && ` — ${form.refrigerant_type} GWP100 = ${factor.value}`}
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit service entry' : 'Add service entry'}</h2>
        <div style={s.formGrid}>
          <div style={s.field}><label style={s.label}>Service date</label><input type="date" value={form.service_date} onChange={(e) => setForm({ ...form, service_date: e.target.value })} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>Refrigerant</label>
            <select value={form.refrigerant_type} onChange={(e) => setForm({ ...form, refrigerant_type: e.target.value })} style={s.input}>
              {refrigerantOptions.map((o) => <option key={o.value}>{o.value}</option>)}
            </select>
          </div>
          <div style={s.field}><label style={s.label}>Recharge (lb)</label><input type="number" step="0.01" min="0" value={form.recharge_lb} onChange={(e) => setForm({ ...form, recharge_lb: e.target.value })} style={s.input} placeholder="0" /></div>
          <div style={s.field}><label style={s.label}>Reclaim (lb)</label><input type="number" step="0.01" min="0" value={form.reclaim_lb} onChange={(e) => setForm({ ...form, reclaim_lb: e.target.value })} style={s.input} placeholder="0" /></div>
          <div style={s.field}><label style={s.label}>Equipment ID</label><input type="text" value={form.equipment_id} onChange={(e) => setForm({ ...form, equipment_id: e.target.value })} style={s.input} placeholder="e.g. RTU-3 Whittemore" /></div>
          <div style={s.field}><label style={s.label}>Service company</label><input type="text" value={form.service_company} onChange={(e) => setForm({ ...form, service_company: e.target.value })} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Service report #</label><input type="text" value={form.service_report_number} onChange={(e) => setForm({ ...form, service_report_number: e.target.value })} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Data quality</label>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </div>
          <div style={{ ...s.field, ...s.full }}><label style={s.label}>Notes</label><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} /></div>
        </div>
        <PreviewBanner kgCo2e={preview} citation={factor?.source_citation} label="Net leakage emissions" />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" style={s.submit}>{editingId ? 'Save changes' : 'Add service entry'}</button>
          {editingId && <button type="button" onClick={reset} style={{ ...s.submit, background: 'transparent', color: '#cbd5e1', border: '1px solid #334155' }}>Cancel</button>}
        </div>
      </form>

      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      <RecordsTable
        rows={rows} onEdit={handleEdit} onDelete={onDelete} editingId={editingId}
        columns={[
          { key: 'service_date', label: 'Date' },
          { key: 'refrigerant_type', label: 'Refrigerant' },
          { key: 'recharge_lb', label: 'Recharge lb' },
          { key: 'reclaim_lb', label: 'Reclaim lb' },
          { key: 'net', label: 'Net lb', render: (r) => ((r.recharge_lb || 0) - (r.reclaim_lb || 0)).toFixed(2) },
          { key: 'equipment_id', label: 'Equipment' },
        ]}
      />
    </div>
  );
}

export default Refrigerants;
