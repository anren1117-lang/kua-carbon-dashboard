import React, { useState } from 'react';
import { useTable, useFactor, RecordsTable, formStyles as s, today, firstOfMonth } from '../_shared';

const fuelKeys = { heating_oil: 'epa_heating_oil_co2_kg_per_gal', propane: 'epa_propane_co2_kg_per_gal', none: null };
// Heat content per gallon (HHV) for the counterfactual fossil case.
const fuelBtu = { heating_oil: 138500, propane: 91500 };
const KWH_TO_BTU = 3412.14;

const empty = () => ({
  period_start: firstOfMonth(),
  period_end: today(),
  system_id: '',
  kwh_input: '',
  cop: '',
  avoided_fuel_type: 'heating_oil',
  data_quality: 'estimated',
  source: '',
  notes: '',
});

function Geothermal() {
  const { rows, error, insert, update, remove } = useTable('renewables_geothermal', 'period_end');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const fuelFactor = useFactor(fuelKeys[form.avoided_fuel_type] || 'epa_heating_oil_co2_kg_per_gal');

  const kwh = parseFloat(form.kwh_input) || 0;
  const cop = parseFloat(form.cop) || 0;
  const thermalBtu = kwh * cop * KWH_TO_BTU;
  const counterfactualGal = form.avoided_fuel_type !== 'none' ? thermalBtu / fuelBtu[form.avoided_fuel_type] : 0;
  const avoidedKg = fuelFactor ? counterfactualGal * Number(fuelFactor.value) : 0;

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({ ...r, kwh_input: String(r.kwh_input), cop: r.cop ?? '' }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    const kwhNum = parseFloat(form.kwh_input);
    if (!Number.isFinite(kwhNum) || kwhNum < 0) {
      setMsg({ ok: false, text: `kWh input must be a non-negative number (got "${form.kwh_input}")` });
      return;
    }
    let copNum = null;
    if (form.cop !== '') {
      copNum = parseFloat(form.cop);
      // Real heat-pump COPs are 1.5–6; reject anything wildly outside.
      if (!Number.isFinite(copNum) || copNum < 0 || copNum > 20) {
        setMsg({ ok: false, text: `COP must be a non-negative number under 20 (got "${form.cop}")` });
        return;
      }
    }
    try {
      const payload = {
        period_start: form.period_start,
        period_end: form.period_end,
        system_id: form.system_id || null,
        kwh_input: kwhNum,
        cop: copNum,
        avoided_fuel_type: form.avoided_fuel_type,
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
      <div style={s.cat}>Renewables · Geothermal</div>
      <h1 style={s.title}>Geothermal Heat Pump</h1>
      <p style={s.subtitle}>
        Avoided fossil heat (counterfactual), labeled as estimated by default. Thermal output =
        kWh × COP × 3412 BTU/kWh. Avoided fuel = thermal / fuel HHV. Avoided emissions = avoided
        fuel × Scope 1 fuel factor.
      </p>
      <div style={s.factor}>
        Methodology: counterfactual avoided-fossil estimate · fuel HHV: oil 138,500 BTU/gal, propane 91,500 BTU/gal
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit period' : 'Add period'}</h2>
        <div style={s.formGrid}>
          <div style={s.field}><label style={s.label}>Period start</label><input type="date" value={form.period_start} onChange={(e) => setForm({ ...form, period_start: e.target.value })} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>Period end</label><input type="date" value={form.period_end} onChange={(e) => setForm({ ...form, period_end: e.target.value })} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>kWh input</label><input type="number" step="0.01" min="0" value={form.kwh_input} onChange={(e) => setForm({ ...form, kwh_input: e.target.value })} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>COP</label><input type="number" step="0.01" min="0" value={form.cop} onChange={(e) => setForm({ ...form, cop: e.target.value })} style={s.input} placeholder="design or measured" /></div>
          <div style={s.field}><label style={s.label}>Avoided fuel</label>
            <select value={form.avoided_fuel_type} onChange={(e) => setForm({ ...form, avoided_fuel_type: e.target.value })} style={s.input}>
              <option value="heating_oil">heating oil</option><option value="propane">propane</option><option value="none">none</option>
            </select>
          </div>
          <div style={s.field}><label style={s.label}>System ID</label><input type="text" value={form.system_id} onChange={(e) => setForm({ ...form, system_id: e.target.value })} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Data quality</label>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </div>
          <div style={{ ...s.field, ...s.full }}><label style={s.label}>Notes</label><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} /></div>
        </div>
        <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, border: '1px solid #14532d', background: '#052e1a', color: '#86efac', fontSize: 14, display: 'grid', gap: 4 }}>
          <div>Thermal output: <strong>{(thermalBtu / 1e6).toFixed(2)} MMBtu</strong></div>
          {form.avoided_fuel_type !== 'none' && (
            <>
              <div>Counterfactual {form.avoided_fuel_type.replace('_', ' ')}: <strong>{counterfactualGal.toFixed(1)} gal</strong></div>
              <div>Avoided emissions: <strong>{avoidedKg.toFixed(2)} kg CO₂e</strong> <span style={{ opacity: 0.7 }}>(estimate)</span></div>
            </>
          )}
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
          { key: 'kwh_input', label: 'kWh in' },
          { key: 'cop', label: 'COP' },
          { key: 'avoided_fuel_type', label: 'Avoided fuel' },
          { key: 'system_id', label: 'System' },
        ]}
      />
    </div>
  );
}

export default Geothermal;
