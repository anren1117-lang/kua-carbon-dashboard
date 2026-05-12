import React, { useState } from 'react';
import { useTable, useFactor, RecordsTable, PreviewBanner, formStyles as s, today, currentSchoolYear } from '../_shared';

const modes = [
  { value: 'car_solo', label: 'Car (solo)',     factorKey: 'epa_commute_car_solo_kg_co2e_per_pmi' },
  { value: 'carpool',  label: 'Carpool',         factorKey: 'epa_commute_carpool_kg_co2e_per_pmi' },
  { value: 'transit',  label: 'Public transit',  factorKey: 'epa_commute_transit_kg_co2e_per_pmi' },
  { value: 'ev',       label: 'Electric vehicle',factorKey: 'epa_commute_ev_kg_co2e_per_pmi' },
  { value: 'bike',     label: 'Bicycle',         factorKey: 'epa_commute_bike_kg_co2e_per_pmi' },
  { value: 'walk',     label: 'Walk',            factorKey: 'epa_commute_walk_kg_co2e_per_pmi' },
];

const empty = () => ({
  school_year: currentSchoolYear(),
  employee_role: 'faculty',
  home_zip: '',
  one_way_miles: '',
  mode: 'car_solo',
  days_per_week: '5',
  weeks_per_year: '36',
  survey_date: today(),
  data_quality: 'estimated',
  source: '',
  notes: '',
});

function Cat7Commuting() {
  const { rows, error, insert, update, remove } = useTable('commuting', 'survey_date');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const activeMode = modes.find((m) => m.value === form.mode) || modes[0];
  const factor = useFactor(activeMode.factorKey);

  const miles = parseFloat(form.one_way_miles);
  const days = parseFloat(form.days_per_week);
  const weeks = parseFloat(form.weeks_per_year);
  // annual round-trip passenger-miles × per-mile factor
  const preview = factor && !isNaN(miles) && !isNaN(days) && !isNaN(weeks)
    ? miles * 2 * days * weeks * Number(factor.value)
    : null;

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({
    ...r,
    one_way_miles: String(r.one_way_miles),
    days_per_week: String(r.days_per_week ?? '5'),
    weeks_per_year: String(r.weeks_per_year ?? '36'),
    survey_date: r.survey_date ?? today(),
    home_zip: r.home_zip ?? '',
  }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    const milesNum = parseFloat(form.one_way_miles);
    const daysNum  = parseFloat(form.days_per_week);
    const weeksNum = parseFloat(form.weeks_per_year);
    const numericChecks = [
      ['one_way_miles', milesNum, 0, 200],
      ['days_per_week', daysNum, 0, 7],
      ['weeks_per_year', weeksNum, 0, 52],
    ];
    for (const [name, n, lo, hi] of numericChecks) {
      if (!Number.isFinite(n) || n < lo || n > hi) {
        setMsg({ ok: false, text: `${name} must be a number between ${lo} and ${hi} (got "${n}")` });
        return;
      }
    }
    try {
      const payload = {
        school_year: form.school_year,
        employee_role: form.employee_role,
        home_zip: form.home_zip || null,
        one_way_miles: milesNum,
        mode: form.mode,
        days_per_week: daysNum,
        weeks_per_year: weeksNum,
        survey_date: form.survey_date || null,
        data_quality: form.data_quality,
        source: form.source || null,
        notes: form.notes || null,
      };
      if (editingId) { await update(editingId, payload); setMsg({ ok: true, text: 'Commute updated.' }); }
      else { await insert(payload); setMsg({ ok: true, text: 'Commute added.' }); }
      reset();
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this commute entry?')) return;
    try { await remove(id); if (editingId === id) reset(); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 3 · Category 7</div>
      <h1 style={s.title}>Employee Commuting</h1>
      <p style={s.subtitle}>
        Annual survey rows for non-resident faculty and staff. One row per person per school
        year. Distance from ZIP to campus is entered as one-way miles (use Google Maps or a
        ZIP-distance tool); the form computes annual round-trip passenger-miles automatically.
      </p>
      <div style={s.factor}>
        Methodology: EPA per-passenger-mile factors by mode{factor && ` — ${activeMode.label}: ${factor.value} ${factor.unit}`}
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit commute' : 'Add commute'}</h2>
        <div style={s.formGrid}>
          <label style={s.field}>
            <span style={s.label}>School year</span>
            <input type="text" value={form.school_year} onChange={(e) => setForm({ ...form, school_year: e.target.value })} style={s.input} required />
          </label>
          <label style={s.field}>
            <span style={s.label}>Role</span>
            <select value={form.employee_role} onChange={(e) => setForm({ ...form, employee_role: e.target.value })} style={s.input}>
              <option>faculty</option><option>staff</option><option>student</option><option>other</option>
            </select>
          </label>
          <label style={s.field}>
            <span style={s.label}>Home ZIP</span>
            <input type="text" value={form.home_zip} onChange={(e) => setForm({ ...form, home_zip: e.target.value })} style={s.input} placeholder="optional" />
          </label>
          <label style={s.field}>
            <span style={s.label}>One-way miles</span>
            <input type="number" step="0.1" min="0" value={form.one_way_miles} onChange={(e) => setForm({ ...form, one_way_miles: e.target.value })} style={s.input} required />
          </label>
          <label style={s.field}>
            <span style={s.label}>Mode</span>
            <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} style={s.input}>
              {modes.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </label>
          <label style={s.field}>
            <span style={s.label}>Days / week</span>
            <input type="number" step="0.1" min="0" max="7" value={form.days_per_week} onChange={(e) => setForm({ ...form, days_per_week: e.target.value })} style={s.input} required />
          </label>
          <label style={s.field}>
            <span style={s.label}>Weeks / year</span>
            <input type="number" step="0.1" min="0" max="52" value={form.weeks_per_year} onChange={(e) => setForm({ ...form, weeks_per_year: e.target.value })} style={s.input} required />
          </label>
          <label style={s.field}>
            <span style={s.label}>Survey date</span>
            <input type="date" value={form.survey_date} onChange={(e) => setForm({ ...form, survey_date: e.target.value })} style={s.input} />
          </label>
          <label style={s.field}>
            <span style={s.label}>Data quality</span>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </label>
          <label style={{ ...s.field, ...s.full }}>
            <span style={s.label}>Notes</span>
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} />
          </label>
        </div>
        <PreviewBanner kgCo2e={preview} citation={factor?.source_citation} label="Annual round-trip emissions" />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" style={s.submit}>{editingId ? 'Save changes' : 'Add commute'}</button>
          {editingId && <button type="button" onClick={reset} style={{ ...s.submit, background: 'transparent', color: '#cbd5e1', border: '1px solid #334155' }}>Cancel</button>}
        </div>
      </form>

      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      <RecordsTable
        rows={rows} onEdit={handleEdit} onDelete={onDelete} editingId={editingId}
        columns={[
          { key: 'school_year', label: 'Year' },
          { key: 'employee_role', label: 'Role' },
          { key: 'home_zip', label: 'ZIP', mono: true },
          { key: 'one_way_miles', label: 'Miles' },
          { key: 'mode', label: 'Mode' },
          { key: 'days_per_week', label: 'Days/wk' },
        ]}
      />
    </div>
  );
}

export default Cat7Commuting;
