import React, { useState } from 'react';
import Goals from './Goals.js';
import Actions from './Actions.js';

// Combined Plan page — Goals are "where we're going", Actions are "how
// we get there". Tightly coupled so it makes sense to read them in one
// view, but each underlying page (/goals, /actions) still has its own
// route too.

export default function Plan() {
  const [tab, setTab] = useState('goals');

  return (
    <div>
      <div style={styles.tabs} role="tablist" aria-label="Plan sections">
        <Tab active={tab === 'goals'} onClick={() => setTab('goals')} id="plan-tab-goals" controlsId="plan-panel-goals">
          Goals & Targets
        </Tab>
        <Tab active={tab === 'actions'} onClick={() => setTab('actions')} id="plan-tab-actions" controlsId="plan-panel-actions">
          Reduction Actions
        </Tab>
      </div>
      <div
        id={`plan-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`plan-tab-${tab}`}
      >
        {tab === 'goals' ? <Goals /> : <Actions />}
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
        color: active ? '#22d3ee' : '#94a3b8',
        border: '1px solid',
        borderColor: active ? '#22d3ee' : '#1f2937',
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
