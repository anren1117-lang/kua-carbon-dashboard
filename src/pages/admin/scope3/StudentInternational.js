import React, { useState } from 'react';
import { useTable } from './useTable';
import { formStyles as s } from './formStyles';
import { EducationalCard } from '../../../components/EducationalCard';

const empty = { country: '', graduation_year: '2026', school_year: '2025-2026' };

function StudentInternational() {
  const { rows, error, insert, remove } = useTable('international_students', 'created_at');
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await insert(form);
      setForm(empty);
      setMsg({ ok: true, text: 'International student added.' });
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try { await remove(id); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 3 · Student Travel</div>
      <h1 style={s.title}>International Students</h1>
      <p style={s.subtitle}>
        Long-haul flights are typically the largest per-student source. Distance is computed
        from country (capital or major hub) to BOS/MHT.
      </p>
      <div style={s.factor}>Factor source: DEFRA international air with radiative forcing multiplier</div>

      <EducationalCard
        title="Why international flights dominate the inventory"
        sections={[
          {
            heading: 'A single round trip',
            body: [
              'East-Asia ↔ BOS round-trip in economy: roughly 3–4 mtCO₂e per passenger.',
              'That single round trip is comparable to one full year of an average US household\'s total electricity use.',
              'For a school with 50 international students returning home each summer + winter, this category alone can produce 300–400 mtCO₂e per year.',
              'Kool (2025) at Royal Roads University found that student air travel alone produced 28 million km in a single year — dwarfing every other emissions category at the institution.',
            ],
          },
          {
            heading: 'Why aviation gets a multiplier',
            body: 'Burning jet fuel at 30,000+ feet doesn\'t just produce CO₂ — water vapor, NOₓ, and contrails trap additional heat. DEFRA applies a radiative forcing multiplier of about 1.9× to air-travel CO₂ to account for this. The factor we use is already corrected.',
            citation: 'DEFRA 2024 Conversion Factors for Company Reporting; IPCC AR6 WG1 Ch.7 on aviation non-CO₂ effects.',
          },
          {
            heading: 'Where reduction actually matters',
            body: [
              'Going home twice a year instead of three times saves roughly 1.5–2 mtCO₂e per student — more than any dorm-electricity intervention can achieve.',
              'School-coordinated extended stays during shoulder breaks (eg. spring) reduce one round trip per affected student.',
              'Per-student, intercontinental travel is the highest-leverage individual choice available.',
            ],
          },
        ]}
      />

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>Add international student</h2>
        <div style={s.formGrid}>
          <label style={s.field}>
            <span style={s.label}>Country</span>
            <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} style={s.input} placeholder="e.g. China" required />
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
              <th style={s.th}>Country</th>
              <th style={s.th}>Grad</th>
              <th style={s.th}>School year</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={s.td}>{r.country}</td>
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

export default StudentInternational;
