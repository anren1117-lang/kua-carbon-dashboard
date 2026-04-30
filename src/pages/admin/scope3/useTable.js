import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';

export function useTable(table, orderBy = 'created_at', { ascending = false } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
    if (error) setError(error.message);
    else { setRows(data || []); setError(''); }
    setLoading(false);
  }, [table, orderBy, ascending]);

  useEffect(() => { refresh(); }, [refresh]);

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
