import React, { useState } from 'react';
import { useTable } from './useTable';
import { formStyles as s } from './formStyles';

const wasteTypes = ['Landfill', 'Recycling', 'Composting', 'Hazardous', 'E-Waste'];
const units = ['tons', 'lbs', 'cubic yards'];
const wasteFactors = { Landfill: 0.52, Recycling: -0.10, Composting: 0.04, Hazardous: 0.50, 'E-Waste': 0.30 };
const empty = { date: '', waste_type: 'Landfill', amount: '', unit: 'tons', notes: '', school_year: '2025-2026' };

function Cat5Waste() {
  const { rows, error, insert, remove } = useTable('waste', 'date');
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(form.amount);
    if (!Number.isFinite(amountNum) || amountNum < 0) {
      setMsg({ ok: false, text: `Amount must be a non-negative number (got "${form.amount}")` });
      return;
    }
    try {
      await insert({
        date: form.date,
        waste_type: form.waste_type,
        amount: amountNum,
        unit: form.unit,
        notes: form.notes || null,
        school_year: form.school_year,
      });
      setForm(empty);
      setMsg({ ok: true, text: 'Waste record added.' });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try { await remove(id); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 3 · Category 5</div>
      <h1 style={s.title}>Waste Generated in Operations</h1>
      <p style={s.subtitle}>
        Landfill, recycling, composting, hazardous, and e-waste streams. EPA WARM model factors
        capture both direct emissions and avoided virgin-material production.
      </p>
      <div style={s.factor}>Factors (kg CO₂e/ton): {Object.entries(wasteFactors).map(([k, v]) => `${k} ${v}`).join(' · ')}</div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>Add waste record</h2>
        <div style={s.formGrid}>
          <div style={s.field}>
            <label style={s.label}>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={s.input} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Type</label>
            <select value={form.waste_type} onChange={(e) => setForm({ ...form, waste_type: e.target.value })} style={s.input}>
              {wasteTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Amount</label>
            <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={s.input} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Unit</label>
            <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} style={s.input}>
              {units.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>School year</label>
            <input type="text" value={form.school_year} onChange={(e) => setForm({ ...form, school_year: e.target.value })} style={s.input} />
          </div>
          <div style={{ ...s.field, ...s.full }}>
            <label style={s.label}>Notes</label>
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} placeholder="optional" />
          </div>
        </div>
        <button type="submit" style={s.submit}>Add record</button>
      </form>

      <h2 style={s.recordsTitle}>Existing records</h2>
      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      {rows.length === 0 ? (
        <div style={s.empty}>No records yet.</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Date</th>
              <th style={s.th}>Type</th>
              <th style={s.th}>Amount</th>
              <th style={s.th}>Notes</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={s.td}>{r.date}</td>
                <td style={s.td}>{r.waste_type}</td>
                <td style={s.td}>{r.amount} {r.unit}</td>
                <td style={s.td}>{r.notes || '—'}</td>
                <td style={s.td}><button type="button" style={s.delBtn} onClick={() => onDelete(r.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Cat5Waste;
