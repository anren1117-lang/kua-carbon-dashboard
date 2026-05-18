import React, { useState } from 'react';
import Goals from './Goals.js';
import Actions from './Actions.js';
import { Icon } from '../components/Icon.js';

// Combined Plan page — Goals are "where we're going", Actions are "how
// we get there". Tightly coupled so it makes sense to read them in one
// view, but each underlying page (/goals, /actions) still has its own
// route too.

export default function Plan() {
  const [tab, setTab] = useState('goals');

  // Arrow-key tablist navigation per WAI-ARIA — automatic activation.
  function onKey(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next = tab === 'goals' ? 'actions' : 'goals';
    setTab(e.key === 'Home' ? 'goals' : e.key === 'End' ? 'actions' : next);
    requestAnimationFrame(() => {
      const target = e.key === 'Home' ? 'goals' : e.key === 'End' ? 'actions' : next;
      const el = document.getElementById(`plan-tab-${target}`);
      if (el) el.focus();
    });
  }

  return (
    <div>
      <div style={styles.tabs} role="tablist" aria-label="Plan sections" onKeyDown={onKey}>
        <Tab
          active={tab === 'goals'}
          onClick={() => setTab('goals')}
          id="plan-tab-goals"
          controlsId="plan-panel-goals"
          icon={Icon.Chart}
        >
          Goals & Targets
        </Tab>
        <Tab
          active={tab === 'actions'}
          onClick={() => setTab('actions')}
          id="plan-tab-actions"
          controlsId="plan-panel-actions"
          icon={Icon.Bolt}
        >
          Reduction Actions
        </Tab>
      </div>
      <div
        id={`plan-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`plan-tab-${tab}`}
        key={tab}
        className="page-fade-in"
      >
        {tab === 'goals' ? <Goals /> : <Actions />}
      </div>
    </div>
  );
}

function Tab({ active, onClick, id, controlsId, children, icon: TabIcon }) {
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
        position: 'relative',
        padding: '12px 22px',
        background: active ? 'linear-gradient(135deg, #0e3a5f 0%, #0f172a 100%)' : 'transparent',
        color: active ? '#22d3ee' : '#94a3b8',
        border: '1px solid',
        borderColor: active ? '#22d3ee' : '#1f2937',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        transition: 'background 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease',
        boxShadow: active ? '0 4px 14px -6px rgba(34, 211, 238, 0.5)' : 'none',
      }}
    >
      {TabIcon && <TabIcon size={15} />}
      {children}
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 14, right: 14, bottom: -1,
            height: 2,
            background: 'linear-gradient(90deg, #22d3ee, #06b6d4)',
            borderRadius: 1,
          }}
        />
      )}
    </button>
  );
}

const styles = {
  tabs: { display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', maxWidth: 1100, margin: '0 auto 24px', padding: '0 16px' },
};
