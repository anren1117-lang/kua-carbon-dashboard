import React, { useState } from 'react';
import { useTable, useFactor, RecordsTable, PreviewBanner, formStyles as s, currentSchoolYear } from '../_shared';

// Each option maps to an emission_factors row keyed for that category. Add new categories
// by inserting a new factor in the migration and adding an option here.
const categories = [
  { value: 'food',         label: 'Food services / dining',     factorKey: 'eeio_food_kg_co2e_per_usd' },
  { value: 'paper',        label: 'Paper, office supplies',     factorKey: 'eeio_paper_kg_co2e_per_usd' },
  { value: 'it',           label: 'IT equipment, electronics',  factorKey: 'eeio_it_kg_co2e_per_usd' },
  { value: 'athletic',     label: 'Athletic equipment',         factorKey: 'eeio_athletic_kg_co2e_per_usd' },
  { value: 'lab',          label: 'Lab supplies, chemicals',    factorKey: 'eeio_lab_kg_co2e_per_usd' },
  { value: 'construction', label: 'Construction materials',     factorKey: 'eeio_construction_kg_co2e_per_usd' },
  { value: 'cleaning',     label: 'Cleaning supplies',          factorKey: 'eeio_cleaning_kg_co2e_per_usd' },
  { value: 'generic',      label: 'Other / uncategorized',      factorKey: 'eeio_generic_kg_co2e_per_usd' },
];

// Convert FY string like '2025-2026' for display. Uses school-year helper as fallback.
const empty = () => ({
  fiscal_year: currentSchoolYear(),
  purchasing_category: 'food',
  spend_usd: '',
  eeio_factor_override: '',
  data_quality: 'estimated',
  source: '',
  notes: '',
});

function Cat1PurchasedGoods() {
  const { rows, error, insert, update, remove } = useTable('purchased_goods', 'fiscal_year');
  const [form, setForm] = useState(empty());
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const activeCategory = categories.find((c) => c.value === form.purchasing_category) || categories[0];
  const factor = useFactor(activeCategory.factorKey);

  const spend = parseFloat(form.spend_usd);
  const overrideFactor = parseFloat(form.eeio_factor_override);
  const usedFactorValue = !isNaN(overrideFactor) ? overrideFactor : (factor ? Number(factor.value) : null);
  const preview = !isNaN(spend) && usedFactorValue != null ? spend * usedFactorValue : null;

  const reset = () => { setForm(empty()); setEditingId(null); };
  const handleEdit = (r) => { setForm({
    ...r,
    spend_usd: String(r.spend_usd),
    eeio_factor_override: r.eeio_factor_override ?? '',
  }); setEditingId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fiscal_year: form.fiscal_year,
        purchasing_category: form.purchasing_category,
        spend_usd: parseFloat(form.spend_usd),
        eeio_factor_override: form.eeio_factor_override === '' ? null : parseFloat(form.eeio_factor_override),
        data_quality: form.data_quality,
        source: form.source || null,
        notes: form.notes || null,
      };
      if (editingId) { await update(editingId, payload); setMsg({ ok: true, text: 'Purchase updated.' }); }
      else { await insert(payload); setMsg({ ok: true, text: 'Purchase added.' }); }
      reset();
    } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this purchase row?')) return;
    try { await remove(id); if (editingId === id) reset(); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };

  return (
    <div>
      <div style={s.cat}>Scope 3 · Category 1</div>
      <h1 style={s.title}>Purchased Goods & Services</h1>
      <p style={s.subtitle}>
        Embodied emissions of food, supplies, equipment, and materials. Spend-based using EPA
        Supply Chain (EEIO) factors — less precise than supplier-specific data, but standard
        practice for institutional inventories. One row per fiscal-year-and-category total.
      </p>
      <div style={s.factor}>
        Methodology: EPA Supply Chain GHG Emission Factors (EEIO){factor && ` — ${activeCategory.label}: ${factor.value} ${factor.unit}`}
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.ok ? s.msgOk : s.msgErr) }}>{msg.text}</div>}

      <form style={s.card} onSubmit={submit}>
        <h2 style={s.h2}>{editingId ? 'Edit purchase row' : 'Add purchase row'}</h2>
        <div style={s.formGrid}>
          <div style={s.field}>
            <label style={s.label}>Fiscal year</label>
            <input type="text" value={form.fiscal_year} onChange={(e) => setForm({ ...form, fiscal_year: e.target.value })} style={s.input} required placeholder="e.g. 2025-2026" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Category</label>
            <select value={form.purchasing_category} onChange={(e) => setForm({ ...form, purchasing_category: e.target.value })} style={s.input}>
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Spend (USD)</label>
            <input type="number" step="0.01" min="0" value={form.spend_usd} onChange={(e) => setForm({ ...form, spend_usd: e.target.value })} style={s.input} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>EEIO factor override</label>
            <input type="number" step="0.001" min="0" value={form.eeio_factor_override} onChange={(e) => setForm({ ...form, eeio_factor_override: e.target.value })} style={s.input} placeholder={factor ? `default ${factor.value}` : 'optional'} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Data quality</label>
            <select value={form.data_quality} onChange={(e) => setForm({ ...form, data_quality: e.target.value })} style={s.input}>
              <option>measured</option><option>estimated</option><option>modeled</option>
            </select>
          </div>
          <div style={{ ...s.field, ...s.full }}>
            <label style={s.label}>Source pointer</label>
            <input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} style={s.input} placeholder="GL export, AP report, ledger reference" />
          </div>
          <div style={{ ...s.field, ...s.full }}>
            <label style={s.label}>Notes</label>
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={s.input} />
          </div>
        </div>
        <PreviewBanner kgCo2e={preview} citation={factor?.source_citation} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" style={s.submit}>{editingId ? 'Save changes' : 'Add purchase row'}</button>
          {editingId && <button type="button" onClick={reset} style={{ ...s.submit, background: 'transparent', color: '#cbd5e1', border: '1px solid #334155' }}>Cancel</button>}
        </div>
      </form>

      {error && <div style={{ ...s.msg, ...s.msgErr }}>{error}</div>}
      <RecordsTable
        rows={rows} onEdit={handleEdit} onDelete={onDelete} editingId={editingId}
        columns={[
          { key: 'fiscal_year', label: 'FY' },
          { key: 'purchasing_category', label: 'Category' },
          { key: 'spend_usd', label: 'Spend', render: (r) => `$${Number(r.spend_usd).toLocaleString()}` },
          { key: 'eeio_factor_override', label: 'Factor', render: (r) => r.eeio_factor_override != null ? `${r.eeio_factor_override} (override)` : 'default' },
        ]}
      />
    </div>
  );
}

export default Cat1PurchasedGoods;
