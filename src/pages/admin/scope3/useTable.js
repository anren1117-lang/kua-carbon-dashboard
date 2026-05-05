import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../../../supabaseClient';

export function useTable(table, orderBy = 'created_at', { ascending = false } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Bumped on every refresh so an older in-flight request whose
  // response lands after a newer call started can detect it's stale
  // and skip the setState. Without this, switching tables quickly
  // (or unmounting mid-fetch) lets a stale Supabase response overwrite
  // the current rows.
  const requestSeq = useRef(0);

  const refresh = useCallback(async () => {
    const seq = ++requestSeq.current;
    setLoading(true);
    try {
      const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
      if (seq !== requestSeq.current) return;
      if (error) setError(error.message);
      else { setRows(data || []); setError(''); }
    } catch (err) {
      if (seq !== requestSeq.current) return;
      // Network failure (vs an in-band Supabase error) — surface a
      // message instead of leaving the page stuck in loading and
      // logging an unhandled rejection.
      setError(err?.message || 'Network error');
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, [table, orderBy, ascending]);

  useEffect(() => {
    refresh();
    // Bump the seq on unmount so any in-flight refresh that resolves
    // after this point becomes a no-op instead of warning about
    // setState on an unmounted component.
    return () => { requestSeq.current++; };
  }, [refresh]);

  const insert = async (record) => {
    const { error } = await supabase.from(table).insert([record]);
    if (error) throw error;
    await refresh();
  };

  const update = async (id, record) => {
    const { error } = await supabase.from(table).update(record).eq('id', id);
    if (error) throw error;
    await refresh();
  };

  const remove = async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    await refresh();
  };

  return { rows, loading, error, insert, update, remove, refresh };
}
