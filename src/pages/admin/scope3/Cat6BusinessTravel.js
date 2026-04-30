import React, { useState } from 'react';
import { useTable } from './useTable';
import { formStyles as s } from './formStyles';

const purposes = ['Conference', 'Recruiting', 'Athletic', 'Professional Development', 'Other'];
const empty = { destination_country: '', destination_city: '', trip_purpose: 'Conference', departure_date: '', return_date: '' };

function Cat6BusinessTravel() {
  const { rows, error, insert, remove } = useTable('faculty_travel', 'departure_date');
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await insert(form);
      setForm(empty);
      setMsg({ ok: true, text: 'Faculty travel added.' });
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
      <div style={s.cat}>Scope 3 · Category 6</div>
      <h1 style={s.title}>Business Travel</h1>
      <p style={s.subtitle}>
        Faculty and staff travel on KUA business — flights, trains, hotel stays, and personal
        vehicle mileage. Mode and distance are inferred from origin/destination, then converted
        with EPA factors for ground travel and DEFRA factors for air (with radiative forcing).
      </p>
      <div style={s.factor}>Factor sources: EPA Emission Factors Hub · DEFRA conversion factors</div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>Add trip</h2>
        <div style={s.formGrid}>
          <div style={s.field}>
            <label style={s.label}>Country</label>
            <input type="text" value={form.destination_country} onChange={(e) => setForm({ ...form, destination_country: e.target.value })} style={s.input} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>City</label>
            <input type="text" value={form.destination_city} onChange={(e) => setForm({ ...form, destination_city: e.target.value })} style={s.input} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Purpose</label>
            <select value={form.trip_purpose} onChange={(e) => setForm({ ...form, trip_purpose: e.target.value })} style={s.input}>
              {purposes.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Departure</label>
            <input type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} style={s.input} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Return</label>
            <input type="date" value={form.return_date} onChange={(e) => setForm({ ...form, return_date: e.target.value })} style={s.input} required />
          </div>
        </div>
        <button type="submit" style={s.submit}>Add trip</button>
      </form>

      <h2 style={s.recordsTitle}>Existing trips</h2>
      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      {rows.length === 0 ? (
        <div style={s.empty}>No trips yet.</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Departure</th>
              <th style={s.th}>Return</th>
              <th style={s.th}>Destination</th>
              <th style={s.th}>Purpose</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={s.td}>{r.departure_date}</td>
                <td style={s.td}>{r.return_date}</td>
                <td style={s.td}>{r.destination_city}, {r.destination_country}</td>
                <td style={s.td}>{r.trip_purpose}</td>
                <td style={s.td}><button type="button" style={s.delBtn} onClick={() => onDelete(r.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Cat6BusinessTravel;
