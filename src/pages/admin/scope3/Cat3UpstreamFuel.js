import React from 'react';
import { Link } from 'react-router-dom';
import { formStyles as s } from './formStyles';

const styles = {
  link: { color: '#f59e0b' },
  formula: { marginTop: 12, padding: 16, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 },
  warn: { marginTop: 16, padding: 14, background: '#0f172a', border: '1px dashed #334155', borderRadius: 8, color: '#94a3b8', fontSize: 13 },
};

function Cat3UpstreamFuel() {
  return (
    <div>
      <div style={s.cat}>Scope 3 · Category 3</div>
      <h1 style={s.title}>Upstream Fuel & Energy</h1>
      <p style={s.subtitle}>
        Well-to-pump emissions from extracting, producing, and transporting the heating oil,
        propane, and grid electricity already counted downstream in Scopes 1 and 2. Typically
        15–20% of direct combustion emissions.
      </p>
      <div style={s.factor}>
        Factor source: EPA upstream emission factors (versioned)
      </div>

      <div style={s.card}>
        <h2 style={s.h2}>Derived — no manual entry</h2>
        <p style={{ color: '#cbd5e1', fontSize: 14, marginTop: 8 }}>
          This category is computed automatically from Scope 1 fuel deliveries and Scope 2
          electricity quantities. Editing the underlying entries automatically updates Cat 3.
        </p>
        <div style={styles.formula}>
          cat3_oil   = Σ(scope1.heating_oil.gal) × upstream_factor_oil<br />
          cat3_lp    = Σ(scope1.propane.gal)     × upstream_factor_lp<br />
          cat3_grid  = Σ(scope2.kwh)             × upstream_factor_grid<br />
          cat3_total = cat3_oil + cat3_lp + cat3_grid
        </div>
        <div style={styles.warn}>
          To change Cat 3 totals, update the source data:&nbsp;
          <Link to="/admin/scope-1" style={styles.link}>Scope 1 (fuel)</Link>&nbsp;or&nbsp;
          <Link to="/admin/scope-2" style={styles.link}>Scope 2 (electricity)</Link>.
        </div>
      </div>
    </div>
  );
}

export default Cat3UpstreamFuel;
