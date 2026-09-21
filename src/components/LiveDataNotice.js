import React from 'react';

// A FAILED FETCH AND AN EMPTY TABLE ARE DIFFERENT FACTS.
//
// Phase 432 gave Scope 1 / Scope 3 / Sinks this notice. The homepage could not
// have it: NetEstimate and ScopeExplainer read useMeasuredScopeTotals, and that
// composer folded four hooks together while returning NONE of their errors —
// so a Supabase failure reached the homepage as a silent fallback to the
// build-time constants, rendered exactly like live data.
//
// Renders nothing when there is no error, so an empty table stays quiet.
const styles = {
  wrap: { fontSize: 13, color: '#fbbf24', background: '#3a2a0d', border: '1px solid #92400e', borderRadius: 6, padding: '8px 12px', marginBottom: 12, lineHeight: 1.5 },
};

export function LiveDataNotice({ error, fallbackLabel = 'the published estimate' }) {
  if (!error) return null;
  return (
    <div style={styles.wrap} role="status">
      Live data unavailable ({error}). Showing {fallbackLabel} instead.
    </div>
  );
}

export default LiveDataNotice;
