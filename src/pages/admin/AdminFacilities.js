import React, { useState, useMemo } from 'react';
import { ModulePage, ModuleSection, Pill } from '../../components/ModuleShell.js';
import { ProvenancePill } from '../../components/ProvenancePill.js';
import {
  getInventoryView,
  addRecord,
  editRecord,
  removeRecord,
  recommissionRecord,
  revertEdit,
  resetInventory,
  SCHEMAS,
  KIND_LABELS,
} from '../../data/assetInventory.js';

// Single admin page covering every editable physical-asset class.
// Tabs across the top, each tab a CRUD list backed by the
// assetInventory override layer (localStorage).
//
// Provenance pill on every row tells you which records are seeded,
// edited, decommissioned, or user-added — same vocabulary used
// everywhere else on the dashboard.

const KINDS = Object.keys(SCHEMAS); // buildings, meters, forestStands, soilSamples, solarSites

const PROV_TO_PILL = {
  'seeded':         { provenance: 'cited',     label: 'Seeded' },
  'overridden':     { provenance: 'estimated', label: 'Overridden' },
  'decommissioned': { provenance: 'estimated', label: 'Decommissioned' },
  'user-added':     { provenance: 'measured',  label: 'User added' },
};

export default function AdminFacilities() {
  const [activeKind, setActiveKind] = useState('buildings');
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [tick, setTick] = useState(0);     // bumped after every mutation to force re-read
  const refresh = () => setTick((t) => t + 1);

  const view = useMemo(() => getInventoryView(activeKind), [activeKind, tick]);
  const schema = SCHEMAS[activeKind];

  return (
    <ModulePage
      title="Facilities & asset inventory"
      subtitle="Add, edit, decommission, or recommission every physical asset the dashboard tracks. Buildings, meters, forest stands, soil samples, solar arrays — all editable here, no code change required. Changes save to your browser; backend integration to push these to the canonical data files is a follow-up."
    >
      <ModuleSection title="Asset class">
        <div style={styles.tabRow}>
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => { setActiveKind(k); setEditingId(null); setShowAdd(false); }}
              style={{ ...styles.tab, ...(activeKind === k ? styles.tabActive : {}) }}
            >
              {KIND_LABELS[k]}
            </button>
          ))}
        </div>
        <div style={styles.countsRow}>
          <span><ProvenancePill provenance="cited" /> {view.counts.seeded} seeded</span>
          <span><ProvenancePill provenance="estimated" label="Overridden" /> {view.counts.overridden} edited</span>
          <span><ProvenancePill provenance="estimated" label="Decommissioned" /> {view.counts.decommissioned} decommissioned</span>
          <span><ProvenancePill provenance="measured" label="User added" /> {view.counts.added} user-added</span>
        </div>
      </ModuleSection>

      <ModuleSection
        title={`${KIND_LABELS[activeKind]} (${view.rows.length})`}
        hint="Each row is a real-world asset. Add when KUA installs / commissions something new; decommission (don't delete) when retired so the historical record is preserved."
      >
        <div style={styles.actionBar}>
          <button type="button" style={styles.addBtn} onClick={() => { setShowAdd(true); setEditingId(null); }}>+ Add new</button>
          <button
            type="button"
            style={styles.resetBtn}
            onClick={() => {
              if (window.confirm(`Reset all ${KIND_LABELS[activeKind]} edits / additions / decommissions back to seed? Cannot be undone.`)) {
                resetInventory(activeKind);
                refresh();
              }
            }}
          >
            Reset to seed
          </button>
        </div>

        {showAdd && (
          <RecordForm
            schema={schema}
            initial={{}}
            onCancel={() => setShowAdd(false)}
            onSubmit={(rec) => {
              try {
                addRecord(activeKind, rec);
                setShowAdd(false);
                refresh();
              } catch (err) {
                // addRecord throws if the id collides with a seeded
                // record. Re-throw as a string so RecordForm's error
                // banner picks it up.
                throw err;
              }
            }}
            mode="add"
          />
        )}

        <div style={styles.list}>
          {view.rows.map((row) => {
            const isEditing = editingId === row.id;
            const pill = PROV_TO_PILL[row._provenance] || PROV_TO_PILL.seeded;
            const isDecommissioned = row._provenance === 'decommissioned';
            return (
              <div
                key={row.id}
                style={{
                  ...styles.row,
                  borderLeftColor: provenanceBorder(row._provenance),
                  opacity: isDecommissioned ? 0.6 : 1,
                }}
              >
                <div style={styles.rowHead}>
                  <div style={styles.rowName}>
                    {row.name || row.id}
                    <span style={{ marginLeft: 10 }}>
                      <ProvenancePill provenance={pill.provenance} label={pill.label} />
                    </span>
                  </div>
                  <div style={styles.rowActions}>
                    {!isDecommissioned && (
                      <button type="button" style={styles.editBtn} onClick={() => { setEditingId(isEditing ? null : row.id); setShowAdd(false); }}>
                        {isEditing ? 'Close' : 'Edit'}
                      </button>
                    )}
                    {row._provenance === 'overridden' && (
                      <button type="button" style={styles.revertBtn} onClick={() => { revertEdit(activeKind, row.id); refresh(); }}>
                        Revert
                      </button>
                    )}
                    {!isDecommissioned ? (
                      <button
                        type="button"
                        style={styles.removeBtn}
                        onClick={() => {
                          if (window.confirm(`${row._provenance === 'user-added' ? 'Delete' : 'Decommission'} ${row.name || row.id}?`)) {
                            removeRecord(activeKind, row.id);
                            refresh();
                          }
                        }}
                      >
                        {row._provenance === 'user-added' ? 'Delete' : 'Decommission'}
                      </button>
                    ) : (
                      <button type="button" style={styles.recomBtn} onClick={() => { recommissionRecord(activeKind, row.id); refresh(); }}>
                        Recommission
                      </button>
                    )}
                  </div>
                </div>

                <div style={styles.rowMeta}>
                  {schema.filter((f) => f.key !== 'id' && f.key !== 'name' && row[f.key] !== undefined && row[f.key] !== '').slice(0, 4).map((f) => (
                    <span key={f.key} style={styles.metaItem}>
                      <span style={styles.metaLabel}>{f.label}:</span> {String(row[f.key])}
                    </span>
                  ))}
                  <span style={styles.metaItem}><span style={styles.metaLabel}>id:</span> <code>{row.id}</code></span>
                </div>

                {isEditing && (
                  <RecordForm
                    schema={schema}
                    initial={row}
                    onCancel={() => setEditingId(null)}
                    onSubmit={(patch) => {
                      editRecord(activeKind, row.id, patch);
                      setEditingId(null);
                      refresh();
                    }}
                    mode="edit"
                  />
                )}
              </div>
            );
          })}
        </div>
      </ModuleSection>

      <ModuleSection title="How this connects to the rest of the dashboard">
        <div style={styles.connectList}>
          <div style={styles.connectRow}>
            <Pill kind="info">Buildings</Pill>
            Used by the public <code>/buildings</code> page (live now), plus Hotspots, Trend Builder, and the Plan Agent's institutional context. Adding a new building shows up immediately on /buildings.
          </div>
          <div style={styles.connectRow}>
            <Pill kind="info">Meters & hardware</Pill>
            Used by <code>/api/meters/readings</code> via the active adapter. Adding a new meter exposes it to the Trend Builder dropdown.
          </div>
          <div style={styles.connectRow}>
            <Pill kind="info">Forest stands</Pill>
            Used by the Sinks page and the Plan Agent's sequestration calc. Adding/decommissioning shifts the campus annual sequestration total.
          </div>
          <div style={styles.connectRow}>
            <Pill kind="info">Solar arrays</Pill>
            Used by the Renewables page and the Executive on-campus solar metric. Adding a new array shifts the kWh/yr figure on the homepage.
          </div>
          <div style={styles.connectRow}>
            <Pill kind="info">Soil samples</Pill>
            Used by the Sinks page soil-carbon stock calculation. Coring campaign results feed in here.
          </div>
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

function RecordForm({ schema, initial, onCancel, onSubmit, mode }) {
  const [form, setForm] = useState(() => {
    const out = {};
    schema.forEach((f) => { out[f.key] = initial[f.key] !== undefined ? initial[f.key] : ''; });
    return out;
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const f of schema) {
      if (f.required && (form[f.key] === '' || form[f.key] === null || form[f.key] === undefined)) {
        setError(`Required: ${f.label}`);
        return;
      }
    }
    // Coerce numeric fields. Reject NaN explicitly — earlier code would
    // happily save Number('abc') = NaN into localStorage, which then
    // poisoned the inventory totals on every subsequent read.
    const out = {};
    for (const f of schema) {
      if (form[f.key] === '' || form[f.key] === undefined) continue;
      if (f.type === 'number') {
        const n = Number(form[f.key]);
        if (!Number.isFinite(n)) {
          setError(`${f.label} must be a number (got "${form[f.key]}")`);
          return;
        }
        out[f.key] = n;
      } else {
        out[f.key] = form[f.key];
      }
    }
    if (mode === 'edit') {
      // Don't allow id changes on edit; strip it.
      delete out.id;
    }
    try {
      onSubmit(out);
    } catch (err) {
      // addRecord throws on id collision with a seed record. Surface
      // it in the form's error banner instead of letting it bubble.
      setError(err?.message || String(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGrid}>
        {schema.map((f) => (
          <label key={f.key} style={styles.field}>
            <div style={styles.fieldLabel}>
              {f.label}
              {f.required && <span style={{ color: '#fca5a5', marginLeft: 4 }}>*</span>}
            </div>
            {f.type === 'select' ? (
              <select
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                style={styles.input}
                disabled={mode === 'edit' && f.key === 'id'}
              >
                <option value="">— select —</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                style={styles.input}
                disabled={mode === 'edit' && f.key === 'id'}
              />
            )}
            {f.hint && <div style={styles.fieldHint}>{f.hint}</div>}
          </label>
        ))}
      </div>
      {error && <div style={styles.formError}>{error}</div>}
      <div style={styles.formActions}>
        <button type="submit" style={styles.saveBtn}>{mode === 'add' ? 'Add' : 'Save changes'}</button>
        <button type="button" style={styles.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function provenanceBorder(p) {
  switch (p) {
    case 'seeded':         return '#22d3ee';
    case 'overridden':     return '#fbbf24';
    case 'decommissioned': return '#64748b';
    case 'user-added':     return '#22c55e';
    default:               return '#1f2937';
  }
}

const styles = {
  tabRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 },
  tab: { padding: '8px 14px', background: '#0b1220', color: '#cbd5e1', border: '1px solid #334155', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  tabActive: { background: '#22d3ee', color: '#0b1220', borderColor: '#22d3ee', fontWeight: 700 },
  countsRow: { display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', fontSize: 12, color: '#94a3b8' },

  actionBar: { display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' },
  addBtn: { padding: '8px 14px', background: '#22c55e', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  resetBtn: { padding: '8px 14px', background: 'transparent', color: '#fca5a5', border: '1px solid #7f1d1d', borderRadius: 6, fontSize: 12, cursor: 'pointer' },

  list: { display: 'grid', gap: 8 },
  row: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 6 },
  rowHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  rowName: { fontSize: 14, color: '#e5e7eb', fontWeight: 700 },
  rowActions: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  editBtn:    { padding: '4px 10px', background: 'transparent', color: '#cbd5e1', border: '1px solid #334155', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  revertBtn:  { padding: '4px 10px', background: 'transparent', color: '#fbbf24', border: '1px solid #92400e', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  removeBtn:  { padding: '4px 10px', background: 'transparent', color: '#fca5a5', border: '1px solid #7f1d1d', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  recomBtn:   { padding: '4px 10px', background: 'transparent', color: '#86efac', border: '1px solid #14532d', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  rowMeta: { display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap', fontSize: 12, color: '#cbd5e1' },
  metaItem: { fontVariantNumeric: 'tabular-nums' },
  metaLabel: { color: '#64748b', fontWeight: 600, marginRight: 4 },

  form: { marginTop: 12, padding: '14px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 },
  field: { display: 'block' },
  fieldLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldHint: { fontSize: 11, color: '#64748b', marginTop: 4, lineHeight: 1.4 },
  input: { width: '100%', boxSizing: 'border-box', padding: '8px 10px', background: '#0b1220', border: '1px solid #334155', borderRadius: 4, color: '#e5e7eb', fontSize: 13 },
  formError: { marginTop: 10, padding: '8px 12px', background: '#3a0d12', color: '#fca5a5', border: '1px solid #7f1d1d', borderRadius: 4, fontSize: 12 },
  formActions: { display: 'flex', gap: 8, marginTop: 12 },
  saveBtn: { padding: '8px 14px', background: '#22d3ee', color: '#0b1220', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  cancelBtn: { padding: '8px 14px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 4, fontSize: 13, cursor: 'pointer' },

  connectList: { display: 'grid', gap: 8 },
  connectRow: { padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
};
