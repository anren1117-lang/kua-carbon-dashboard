import { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';

// Resolve a single emission factor by key, picking the most recent version whose
// valid_from is on or before today. Returns null while loading or if missing.
export function useFactor(factorKey) {
  const [factor, setFactor] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from('emission_factors')
        .select('value, unit, source_citation, valid_from')
        .eq('factor_key', factorKey)
        .lte('valid_from', today)
        .order('valid_from', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) setFactor(data || null);
    })();
    return () => { cancelled = true; };
  }, [factorKey]);

  return factor;
}
