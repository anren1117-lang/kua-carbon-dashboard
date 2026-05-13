// Session-wide tally of Anthropic API usage across all admin AI calls.
//
// Each AI endpoint returns a `usage` object (input/output/cache token
// counts) and a `model` ID in its `done` payload. After every
// successful response, the caller pushes the usage here:
//
//   import { recordUsage } from '../utils/aiUsageTally.js';
//   recordUsage(body.usage, body.model, 'plan');
//
// AdminHome (and any other surface that wants to display it) subscribes
// to the same store and shows "AI this session: 12.4K tok · ~$1.23
// across 7 calls".
//
// Storage: sessionStorage so the tally resets between browser sessions
// (it's session-scoped awareness, not a billing record).

const STORAGE_KEY = 'kua_admin_ai_usage_tally';
const EVENT_NAME = 'kua-admin-ai-usage-updated';

// Per-million-token pricing snapshot. Mirrors PRICING in AdminPlanAgent.
// Cached reads bill at 10% of the input rate.
const PRICING = {
  'claude-opus-4-7':   { input: 15, output: 75 },
  'claude-sonnet-4-6': { input:  3, output: 15 },
};

function emptyTotals() {
  return { inputTokens: 0, outputTokens: 0, cacheCreationInputTokens: 0, cacheReadInputTokens: 0, costUsd: 0, calls: 0 };
}

function readState() {
  if (typeof sessionStorage === 'undefined') return { total: emptyTotals(), byModel: {} };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { total: emptyTotals(), byModel: {} };
    const parsed = JSON.parse(raw);
    return {
      total: { ...emptyTotals(), ...(parsed.total || {}) },
      byModel: parsed.byModel || {},
    };
  } catch {
    return { total: emptyTotals(), byModel: {} };
  }
}

function writeState(state) {
  if (typeof sessionStorage === 'undefined') return;
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    try { window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state })); } catch {}
  }
}

function costFor(usage, model) {
  const p = PRICING[model] || PRICING['claude-opus-4-7'];
  const inp = (Number(usage.inputTokens) || 0) + (Number(usage.cacheCreationInputTokens) || 0);
  const out = Number(usage.outputTokens) || 0;
  const cached = Number(usage.cacheReadInputTokens) || 0;
  return (inp / 1_000_000) * p.input + (out / 1_000_000) * p.output + (cached / 1_000_000) * (p.input * 0.1);
}

/**
 * Push one AI call's usage into the running tally. No-op if usage is
 * missing or model is unknown — telemetry should never block work.
 *
 * @param {object|null} usage  { inputTokens, outputTokens, cacheCreationInputTokens, cacheReadInputTokens }
 * @param {string} model       'claude-opus-4-7' | 'claude-sonnet-4-6'
 * @param {string} [label]     optional source tag ('plan', 'memo', 'ingestion', ...) for byModel breakdown
 */
export function recordUsage(usage, model, label) {
  if (!usage || typeof usage !== 'object') return;
  const cost = costFor(usage, model);
  const state = readState();
  state.total.inputTokens += Number(usage.inputTokens) || 0;
  state.total.outputTokens += Number(usage.outputTokens) || 0;
  state.total.cacheCreationInputTokens += Number(usage.cacheCreationInputTokens) || 0;
  state.total.cacheReadInputTokens += Number(usage.cacheReadInputTokens) || 0;
  state.total.costUsd += cost;
  state.total.calls += 1;
  const key = model || 'unknown';
  const bucket = state.byModel[key] || emptyTotals();
  bucket.inputTokens += Number(usage.inputTokens) || 0;
  bucket.outputTokens += Number(usage.outputTokens) || 0;
  bucket.cacheCreationInputTokens += Number(usage.cacheCreationInputTokens) || 0;
  bucket.cacheReadInputTokens += Number(usage.cacheReadInputTokens) || 0;
  bucket.costUsd += cost;
  bucket.calls += 1;
  state.byModel[key] = bucket;
  // label is currently unused on the tally object — reserved for a
  // future per-endpoint breakdown view. Logged silently so the call
  // site doesn't need to know.
  void label;
  writeState(state);
}

/** Current cumulative tally. */
export function getTally() {
  return readState();
}

/** Reset the tally — wired to a "Reset usage" button in dev / AdminHome. */
export function resetTally() {
  if (typeof sessionStorage === 'undefined') return;
  try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    try { window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { total: emptyTotals(), byModel: {} } })); } catch {}
  }
}

/** Event name to listen on for live updates (window.addEventListener). */
export const AI_USAGE_UPDATED_EVENT = EVENT_NAME;

// Compact "12.4K tok · ~$1.23 · 7 calls" formatter.
export function formatTally(tally) {
  const t = tally?.total;
  if (!t || t.calls === 0) return null;
  const tokens = (t.inputTokens || 0) + (t.outputTokens || 0) + (t.cacheCreationInputTokens || 0) + (t.cacheReadInputTokens || 0);
  const tokensFmt = tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}K` : String(tokens);
  return `${tokensFmt} tok · ~$${t.costUsd.toFixed(3)} · ${t.calls} call${t.calls === 1 ? '' : 's'}`;
}
