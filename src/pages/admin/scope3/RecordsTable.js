import React, { useMemo, useState } from 'react';
import { formStyles as s } from './formStyles';

const localStyles = {
  toolbar: { marginTop: 24, marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  toolbarLeft: { fontSize: 16, color: '#e5e7eb', fontWeight: 600 },
  search: { flex: 1, minWidth: 200, maxWidth: 360, padding: '6px 10px', background: '#0b1220', border: '1px solid #334155', borderRadius: 6, color: '#e5e7eb', fontSize: 13 },
  count: { fontSize: 12, color: '#64748b' },
  editBtn: { background: 'transparent', color: '#22d3ee', border: '1px solid #155e75', borderRadius: 4, padding: '4px 8px', fontSize: 12, cursor: 'pointer', marginRight: 6 },
  rowActive: { background: '#1e293b' },
  qPill: (q) => ({ fontSize: 10, padding: '2px 6px', borderRadius: 999, background: q === 'measured' ? '#052e1a' : q === 'estimated' ? '#3a2a0d' : '#1e293b', color: q === 'measured' ? '#86efac' : q === 'estimated' ? '#fbbf24' : '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.4 }),
};

// Generic records table with search, click-to-edit, delete.
// `columns` is an array of { key, label, render?, mono? }.
// `editingId` highlights the row currently loaded into the form.
export function RecordsTable({ title = 'Existing records', rows, columns, onEdit, onDelete, editingId }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.trim().toLowerCase();
    return rows.filter((r) =>
      columns.some((c) => {
        const v = r[c.key];
        return v != null && String(v).toLowerCase().includes(needle);
      })
    );
  }, [rows, columns, q]);

  return (
    <>
      <div style={localStyles.toolbar}>
        <div style={localStyles.toolbarLeft}>{title}</div>
        <input
          type="search"
          placeholder="Search records…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={localStyles.search}
        />
        <div style={localStyles.count}>{filtered.length} of {rows.length}</div>
      </div>
      {filtered.length === 0 ? (
        <div style={s.empty}>{rows.length === 0 ? 'No records yet.' : 'No matches for that search.'}</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              {columns.map((c) => <th key={c.key} style={s.th}>{c.label}</th>)}
              <th style={s.th}>Quality</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} style={editingId === r.id ? localStyles.rowActive : undefined}>
                {columns.map((c) => (
                  <td key={c.key} style={c.mono ? { ...s.td, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } : s.td}>
                    {c.render ? c.render(r) : (r[c.key] ?? '—')}
                  </td>
                ))}
                <td style={s.td}>
                  {r.data_quality ? <span style={localStyles.qPill(r.data_quality)}>{r.data_quality}</span> : <span style={{ color: '#64748b' }}>—</span>}
                </td>
                <td style={s.td}>
                  {onEdit && <button type="button" style={localStyles.editBtn} onClick={() => onEdit(r)}>Edit</button>}
                  {onDelete && <button type="button" style={s.delBtn} onClick={() => onDelete(r.id)}>Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export const qualityPill = localStyles.qPill;
