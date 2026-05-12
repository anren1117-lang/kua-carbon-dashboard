import React, { useState } from 'react';
import { useTable } from './useTable';
import { formStyles as s } from './formStyles';
import { EducationalCard } from '../../../components/EducationalCard';

const empty = { zip_code: '', state: '', graduation_year: '2026', school_year: '2025-2026' };

function StudentUSBoarding() {
  const { rows, error, insert, remove } = useTable('us_boarding_students', 'created_at');
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await insert(form);
      setForm(empty);
      setMsg({ ok: true, text: 'US boarding student added.' });
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try { await remove(id); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 3 · Student Travel</div>
      <h1 style={s.title}>US Boarding Students</h1>
      <p style={s.subtitle}>
        Domestic boarders captured by home ZIP and state. Term-break round-trips drive emissions;
        mode (drive vs fly) is inferred from distance.
      </p>
      <div style={s.factor}>Factor source: EPA (ground) + DEFRA (air with radiative forcing)</div>

      <EducationalCard
        title="Term-break travel is a major Scope 3 source"
        sections={[
          {
            heading: 'A single round-trip flight',
            body: [
              'BOS ↔ LAX round-trip in economy: roughly 1.2 mtCO₂e per passenger — about half a year\'s per-student dorm electricity, in a single weekend of travel.',
              'Most US boarders fly home 3–4 times per year (Thanksgiving, winter break, spring break, summer). That can total 4–5 mtCO₂e per student per year.',
              'For a 100-student domestic boarding cohort, that\'s 400–500 mtCO₂e — comparable in scale to KUA\'s entire Scope 1 + 2 footprint.',
            ],
          },
          {
            heading: 'When driving beats flying',
            body: [
              'Below ~500 miles, driving a car with 4 people often emits less per passenger than flying.',
              'Above ~1,000 miles, flying is usually unavoidable but radiative-forcing-corrected factors make air emissions worse than the raw kg-of-fuel suggest.',
              'A 4-person carpool over 500 miles produces about the same total emissions as one person flying solo.',
            ],
          },
          {
            heading: 'Why we record by ZIP',
            body: 'Home ZIP gives us distance to BOS/MHT, which combined with mode (drive vs fly, inferred above/below the threshold) lets us compute term-break round-trip emissions per student. Each student is one row; school-year total is the sum.',
            citation: 'EPA Emission Factors Hub (ground); DEFRA 2024 conversion factors with radiative forcing multiplier (air).',
          },
        ]}
      />

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>Add US boarding student</h2>
        <div style={s.formGrid}>
          <label style={s.field}>
            <span style={s.label}>ZIP</span>
            <input type="text" value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} style={s.input} placeholder="e.g. 90210" required />
          </label>
          <label style={s.field}>
            <span style={s.label}>State</span>
            <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} style={s.input} placeholder="e.g. CA" required />
          </label>
          <label style={s.field}>
            <span style={s.label}>Graduation year</span>
            <input type="text" value={form.graduation_year} onChange={(e) => setForm({ ...form, graduation_year: e.target.value })} style={s.input} required />
          </label>
          <label style={s.field}>
            <span style={s.label}>School year</span>
            <input type="text" value={form.school_year} onChange={(e) => setForm({ ...form, school_year: e.target.value })} style={s.input} required />
          </label>
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
              <th style={s.th}>State</th>
              <th style={s.th}>Grad</th>
              <th style={s.th}>School year</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={s.td}>{r.zip_code}</td>
                <td style={s.td}>{r.state}</td>
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

export default StudentUSBoarding;
