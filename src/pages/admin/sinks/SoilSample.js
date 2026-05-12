import React, { useState } from 'react';
import { useTable, RecordsTable, formStyles as s, today } from '../_shared';

const empty = () => ({
  sample_date: today(),
  sample_id: '',
  latitude: '',
  longitude: '',
  land_use_class: 'forest',
  depth_cm_top: '0',
  depth_cm_bottom: '10',
  bulk_density_g_cm3: '',
  oc_percent: '',
  lab_method: 'dry_combustion',
  data_quality: 'measured',
  source: '',
  notes: '',
});

function SoilSample() {
  const { rows, error, insert, update, remove } = useTable('sinks_soil_samples', 'sample_date');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  // SOC stock (Mg C / ha) = depth_cm × bulk_density × OC% × 0.1 (unit-converted)
  // Equivalent expression used here: depth × density × OC%/100 × 100 = depth × density × OC%
  const top = parseFloat(form.depth_cm_top) || 0;
  const bottom = parseFloat(form.depth_cm_bottom);
  const depth = !isNaN(bottom) ? Math.max(0, bottom - top) : 0;
  const bd = parseFloat(form.bulk_density_g_cm3);
  const oc = parseFloat(form.oc_percent);
  const stockMgPerHa = (!isNaN(bd) && !isNaN(oc) && depth > 0) ? depth * bd * oc : null;

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({
    ...r,
    latitude: r.latitude ?? '', longitude: r.longitude ?? '',
    depth_cm_top: String(r.depth_cm_top ?? '0'),
    depth_cm_bottom: String(r.depth_cm_bottom),
    bulk_density_g_cm3: String(r.bulk_density_g_cm3),
    oc_percent: String(r.oc_percent),
  }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    // Validate the required-numeric fields. The HTML inputs are
    // type=number + required, but those checks can be bypassed (paste,
    // programmatic submit) and would otherwise let NaN slip into the
    // soil-carbon-stock calculation downstream.
    const bottomNum  = parseFloat(form.depth_cm_bottom);
    const densityNum = parseFloat(form.bulk_density_g_cm3);
    const ocNum      = parseFloat(form.oc_percent);
    const numericChecks = [
      ['depth_cm_bottom',     bottomNum,  0,   500],
      ['bulk_density_g_cm3',  densityNum, 0.1, 3.0],
      ['oc_percent',          ocNum,      0,   100],
    ];
    for (const [name, n, lo, hi] of numericChecks) {
      if (!Number.isFinite(n) || n < lo || n > hi) {
        setMsg({ ok: false, text: `${name} must be a number between ${lo} and ${hi} (got "${n}")` });
        return;
      }
    }
    try {
      const payload = {
        sample_date: form.sample_date,
        sample_id: form.sample_id || null,
        latitude: form.latitude === '' ? null : parseFloat(form.latitude),
        longitude: form.longitude === '' ? null : parseFloat(form.longitude),
        land_use_class: form.land_use_class,
        depth_cm_top: parseFloat(form.depth_cm_top) || 0,
        depth_cm_bottom: bottomNum,
        bulk_density_g_cm3: densityNum,
        oc_percent: ocNum,
        lab_method: form.lab_method,
        data_quality: form.data_quality,
        source: form.source || null,
        notes: form.notes || null,
      };
      if (editingId) { await update(editingId, payload); setMsg({ ok: true, text: 'Sample updated.' }); }
      else { await insert(payload); setMsg({ ok: true, text: 'Sample added.' }); }
      reset();
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this sample?')) return;
    try { await remove(id); if (editingId === id) reset(); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Sinks · Soil</div>
      <h1 style={s.title}>Soil Organic Carbon Samples</h1>
      <p style={s.subtitle}>
        Per-sample inputs to the SOC stock equation: <code>stock (Mg C / ha) = depth (cm) × bulk
        density (g/cm³) × OC%</code>. Sample at representative sites and weight by land-use area
        to a campus-wide value at report time.
      </p>
      <div style={s.factor}>Methodology: standard SOC stock; lab assays via dry combustion or loss-on-ignition</div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit sample' : 'Add sample'}</h2>
        <div style={s.formGrid}>
          <label style={s.field}><span style={s.label}>Sample date</span><input type="date" value={form.sample_date} onChange={(e) => setForm({ ...form, sample_date: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Sample ID</span><input type="text" value={form.sample_id} onChange={(e) => setForm({ ...form, sample_id: e.target.value })} style={s.input} /></label>
          <label style={s.field}><span style={s.label}>Land use</span>
            <select value={form.land_use_class} onChange={(e) => setForm({ ...form, land_use_class: e.target.value })} style={s.input}>
              <option>forest</option><option>lawn</option><option>athletic</option><option>garden</option><option>hardscape</option><option>other</option>
            </select>
          </label>
          <label style={s.field}><span style={s.label}>Depth top (cm)</span><input type="number" step="0.1" min="0" value={form.depth_cm_top} onChange={(e) => setForm({ ...form, depth_cm_top: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Depth bottom (cm)</span><input type="number" step="0.1" min="0" value={form.depth_cm_bottom} onChange={(e) => setForm({ ...form, depth_cm_bottom: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Bulk density (g/cm³)</span><input type="number" step="0.01" min="0" value={form.bulk_density_g_cm3} onChange={(e) => setForm({ ...form, bulk_density_g_cm3: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Organic C (%)</span><input type="number" step="0.01" min="0" max="100" value={form.oc_percent} onChange={(e) => setForm({ ...form, oc_percent: e.target.value })} style={s.input} required /></label>
          <label style={s.field}><span style={s.label}>Lab method</span>
            <select value={form.lab_method} onChange={(e) => setForm({ ...form, lab_method: e.target.value })} style={s.input}>
              <option value="dry_combustion">dry combustion</option>
              <option value="loss_on_ignition">loss on ignition</option>
              <option value="other">other</option>
            </select>
          </label>
          <label style={s.field}><span style={s.label}>Latitude</span><input type="number" step="0.000001" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} style={s.input} /></label>
          <label style={s.field}><span style={s.label}>Longitude</span><input type="number" step="0.000001" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} style={s.input} /></label>
          <label style={s.field}><span style={s.label}>Data quality</span>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </label>
          <label style={{ ...s.field, ...s.full }}><span style={s.label}>Notes</span><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} /></label>
        </div>
        {stockMgPerHa != null && (
          <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, border: '1px solid #14532d', background: '#052e1a', color: '#86efac', fontSize: 14 }}>
            SOC stock for this sample: <strong>{stockMgPerHa.toFixed(2)} Mg C / ha</strong> over {depth.toFixed(1)} cm
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" style={s.submit}>{editingId ? 'Save changes' : 'Add sample'}</button>
          {editingId && <button type="button" onClick={reset} style={{ ...s.submit, background: 'transparent', color: '#cbd5e1', border: '1px solid #334155' }}>Cancel</button>}
        </div>
      </form>

      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      <RecordsTable
        rows={rows} onEdit={handleEdit} onDelete={onDelete} editingId={editingId}
        columns={[
          { key: 'sample_date', label: 'Sampled' },
          { key: 'sample_id', label: 'ID', mono: true },
          { key: 'land_use_class', label: 'Land' },
          { key: 'depth', label: 'Depth cm', render: (r) => `${r.depth_cm_top}-${r.depth_cm_bottom}` },
          { key: 'bulk_density_g_cm3', label: 'BD g/cm³' },
          { key: 'oc_percent', label: 'OC %' },
        ]}
      />
    </div>
  );
}

export default SoilSample;
