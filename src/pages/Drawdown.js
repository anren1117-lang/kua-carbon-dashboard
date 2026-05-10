import React, { useState } from 'react';
import Renewables from './Renewables2.js';
import Sinks from './Sinks2.js';

// Combined Drawdown page — both Renewables and Sinks pull carbon out
// (or displace what would otherwise be emitted). Reading them in one
// place makes the offset side of the ledger easier to reason about.
// /renewables-os and /sinks-os still work standalone.

export default function Drawdown() {
  const [tab, setTab] = useState('renewables');

  // Arrow-key tablist navigation per WAI-ARIA — automatic activation.
  function onKey(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next = tab === 'renewables' ? 'sinks' : 'renewables';
    const target = e.key === 'Home' ? 'renewables' : e.key === 'End' ? 'sinks' : next;
    setTab(target);
    requestAnimationFrame(() => {
      const el = document.getElementById(`drawdown-tab-${target}`);
      if (el) el.focus();
    });
  }

  return (
    <div>
      <div style={styles.tabs} role="tablist" aria-label="Drawdown sections" onKeyDown={onKey}>
        <Tab active={tab === 'renewables'} onClick={() => setTab('renewables')} id="drawdown-tab-renewables" controlsId="drawdown-panel-renewables">
          Renewables (solar, geothermal)
        </Tab>
        <Tab active={tab === 'sinks'} onClick={() => setTab('sinks')} id="drawdown-tab-sinks" controlsId="drawdown-panel-sinks">
          Sinks (forest, soil)
        </Tab>
      </div>
      <div
        id={`drawdown-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`drawdown-tab-${tab}`}
      >
        {tab === 'renewables' ? <Renewables /> : <Sinks />}
      </div>
    </div>
  );
}

function Tab({ active, onClick, id, controlsId, children }) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      aria-controls={controlsId}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      style={{
        padding: '10px 18px',
        background: active ? '#0f172a' : 'transparent',
        color: active ? '#22c55e' : '#94a3b8',
        border: '1px solid',
        borderColor: active ? '#22c55e' : '#1f2937',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

const styles = {
  tabs: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', maxWidth: 1100, margin: '0 auto 20px', padding: '0 16px' },
};
