import React, { useState } from 'react';
import { useTable } from './useTable';
import { formStyles as s } from './formStyles';

const empty = { zip_code: '', graduation_year: '2026', school_year: '2025-2026' };

function StudentDay() {
  const { rows, error, insert, remove } = useTable('day_students', 'created_at');
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await insert(form);
      setForm(empty);
      setMsg({ ok: true, text: 'Day student added.' });
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try { await remove(id); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 3 · Student Travel</div>
      <h1 style={s.title}>Day Students</h1>
      <p style={s.subtitle}>
        Local commuters, captured by home ZIP code. Distance to campus and per-passenger-mile
        factors translate ZIP into annual commuting emissions.
      </p>
      <div style={s.factor}>Factor source: EPA Emission Factors Hub (per-passenger-mile)</div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>Add day student</h2>
        <div style={s.formGrid}>
          <div style={s.field}>
            <label style={s.label}>ZIP</label>
            <input type="text" value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} style={s.input} placeholder="e.g. 03753" required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Graduation year</label>
            <input type="text" value={form.graduation_year} onChange={(e) => setForm({ ...form, graduation_year: e.target.value })} style={s.input} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>School year</label>
            <input type="text" value={form.school_year} onChange={(e) => setForm({ ...form, school_year: e.target.value })} style={s.input} required />
          </div>
        </div>
        <button type="submit" style={s.submit}>Add</button>
      </form>

      <h2 style={s.recordsTitle}>Existing records</h2>
      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      {rows.length === 0 ? (
        <div style={s.empty}>No records yet.</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ZIP</th>
              <th style={s.th}>Grad year</th>
              <th style={s.th}>School year</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={s.td}>{r.zip_code}</td>
                <td style={s.td}>{r.graduation_year}</td>
                <td style={s.td}>{r.school_year}</td>
                <td style={s.td}><button type="button" style={s.delBtn} onClick={() => onDelete(r.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentDay;
