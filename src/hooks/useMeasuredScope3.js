// Hydrate Scope 3 from the six Supabase tables admins write to.
//
// Same pattern as useMeasuredScope1: initial render uses the
// synchronous placeholder (composeScope3) so the page draws
// immediately, then a single Supabase round-trip either confirms (no
// rows → keep placeholder) or upgrades to measured component-by-
// component via composeScope3FromRecords.

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { composeScope3, composeScope3FromRecords } from '../data/scopeTotals.js';

/**
 * @returns {{
 *   totalMt: number,
 *   breakdown: Array<{ source: string, mt: number, provenance: string, method: string }>,
 *   provenance: string,
 *   note: string,
 *   loading: boolean,
 *   error: string | null,
 *   measured: boolean,
 * }}
 */
export function useMeasuredScope3() {
  const [state, setState] = useState(() => ({
    ...composeScope3(),
    loading: true,
    error: null,
    measured: false,
  }));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [day, us, intl, sa, fac, waste] = await Promise.all([
          supabase.from('day_students').select('zip_code, school_year'),
          supabase.from('us_boarding_students').select('zip_code, state'),
          supabase.from('international_students').select('country'),
          supabase.from('study_abroad').select('destination_country, destination_city, departure_date, return_date'),
          supabase.from('faculty_travel').select('destination_country, destination_city, trip_purpose'),
          supabase.from('waste').select('waste_type, amount, unit'),
        ]);
        if (cancelled) return;

        // Surface the first error if any one query fails — the
        // composer will simply use empty arrays for the rest.
        const firstError = [day, us, intl, sa, fac, waste].find((r) => r.error)?.error;
        if (firstError) {
          setState((prev) => ({ ...prev, loading: false, error: firstError.message || 'Supabase error' }));
          return;
        }

        const composed = composeScope3FromRecords({
          dayStudents: day.data || [],
          usBoardingStudents: us.data || [],
          internationalStudents: intl.data || [],
          studyAbroad: sa.data || [],
          facultyTravel: fac.data || [],
          wasteRecords: waste.data || [],
        });
        setState({
          ...composed,
          loading: false,
          error: null,
          measured: composed.provenance === 'measured',
        });
      } catch (err) {
        if (cancelled) return;
        setState((prev) => ({ ...prev, loading: false, error: err.message || 'fetch failed' }));
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return state;
}
