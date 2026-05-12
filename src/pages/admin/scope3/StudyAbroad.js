import React, { useState } from 'react';
import { useTable } from './useTable';
import { formStyles as s } from './formStyles';
import { EducationalCard } from '../../../components/EducationalCard';

const empty = { destination_country: '', destination_city: '', departure_date: '', return_date: '', school_year: '2025-2026' };

function StudyAbroad() {
  const { rows, error, insert, remove } = useTable('study_abroad', 'departure_date');
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await insert(form);
      setForm(empty);
      setMsg({ ok: true, text: 'Study abroad trip added.' });
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try { await remove(id); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 3 · Student Travel</div>
      <h1 style={s.title}>Study Abroad</h1>
      <p style={s.subtitle}>
        School-organized international programs. One round-trip flight per participant per
        program; ground travel within the destination country is currently excluded as a
        materiality simplification.
      </p>
      <div style={s.factor}>Factor source: DEFRA international air with radiative forcing</div>

      <EducationalCard
        title="Tracking the carbon of an educational trip"
        sections={[
          {
            heading: 'Order of magnitude',
            body: [
              'BOS ↔ Madrid round-trip in economy: roughly 1.7 mtCO₂e per student.',
              'A 12-student spring-term Spain program produces ~20 mtCO₂e in flights alone — comparable to a small US household\'s entire annual footprint.',
              'Domestic programs (BOS ↔ DEN, ~0.9 mtCO₂e round-trip) cost less than half the carbon of a transatlantic one.',
            ],
          },
          {
            heading: 'Why we track it openly',
            body: [
              'Study abroad has substantial educational value. The point of measuring isn\'t to discourage it — it\'s to make the carbon cost visible alongside the academic benefit so the school can make informed choices about which programs to invest in.',
              'Schools that publish carbon-per-student-per-program let students factor it into their decisions, and let admissions/development reason honestly about institutional climate commitments.',
            ],
          },
          {
            heading: 'What we currently exclude',
            body: 'Ground travel within the destination country, hotel stays, and food are not yet captured by this category — only the round-trip flight per participant. The flight is typically 70–85% of total program emissions, so the simplification is a known materiality choice we will document publicly on the methodology page.',
            citation: 'DEFRA 2024 international air factors with radiative forcing multiplier.',
          },
        ]}
      />

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>Add study abroad trip</h2>
        <div style={s.formGrid}>
          <label style={s.field}>
            <span style={s.label}>Country</span>
            <input type="text" value={form.destination_country} onChange={(e) => setForm({ ...form, destination_country: e.target.value })} style={s.input} placeholder="e.g. Spain" required />
          </label>
          <label style={s.field}>
            <span style={s.label}>City</span>
            <input type="text" value={form.destination_city} onChange={(e) => setForm({ ...form, destination_city: e.target.value })} style={s.input} required />
          </label>
          <label style={s.field}>
            <span style={s.label}>Departure</span>
            <input type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} style={s.input} required />
          </label>
          <label style={s.field}>
            <span style={s.label}>Return</span>
            <input type="date" value={form.return_date} onChange={(e) => setForm({ ...form, return_date: e.target.value })} style={s.input} required />
          </label>
          <label style={s.field}>
            <span style={s.label}>School year</span>
            <input type="text" value={form.school_year} onChange={(e) => setForm({ ...form, school_year: e.target.value })} style={s.input} required />
          </label>
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
              <th style={s.th}>School year</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={s.td}>{r.departure_date}</td>
                <td style={s.td}>{r.return_date}</td>
                <td style={s.td}>{r.destination_city}, {r.destination_country}</td>
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

export default StudyAbroad;
