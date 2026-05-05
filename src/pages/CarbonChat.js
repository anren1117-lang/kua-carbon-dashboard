import React, { useState, useRef, useEffect } from 'react';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { matchQuery, pickQuizForTopic } from '../utils/chatbotMatch.js';
import { hashUserId } from '../utils/hash.js';

// Stable hash for the current user. Two paths:
//
// 1. SSO (preferred when configured) — the page calls /api/auth/session
//    once on mount with a Google ID token (or, in dev mode, a mock
//    subject) and caches the returned userIdHash in sessionStorage.
//
// 2. Anonymous fallback — when no SSO is available, mint a per-session
//    random subject and hash that. Quiz attempts still aggregate per
//    session, just without identity continuity across reloads.
//
// Either way, the client never holds the underlying email / SIS ID.
const SESSION_KEY = 'kua_chat_session_hash';

function getCachedHash() {
  try { return sessionStorage.getItem(SESSION_KEY); } catch { return null; }
}
function setCachedHash(h) {
  try { sessionStorage.setItem(SESSION_KEY, h); } catch {}
}

async function getSessionHash() {
  const cached = getCachedHash();
  if (cached) return cached;

  // Try the SSO endpoint in dev-mock mode. If AUTH_DEV_MODE isn't set
  // server-side this 400s and we fall through to the anonymous path.
  try {
    const r = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mockSubject: `anon-${Date.now()}-${Math.random()}@dev.local`, role: 'student' }),
    });
    if (r.ok) {
      const j = await r.json();
      if (j.userIdHash) {
        setCachedHash(j.userIdHash);
        return j.userIdHash;
      }
    }
  } catch {}

  // Fallback: local hash. Same shape so the server still accepts it.
  const local = hashUserId('student', `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);
  setCachedHash(local);
  return local;
}

// Carbon Learning Chatbot v1 — rule-based.
//
// What it can do (phase 1):
// - Answer Q&A about carbon footprint, scopes, energy, food, transport,
//   etc. by matching against curated knowledgeArticles.
// - Pull quiz questions from a per-topic quiz bank.
// - Show citations whenever an answer is sourced from an article.
// - Respect reading level (novice / intermediate / advanced) selector.
//
// Safety rules baked into the answer renderer:
// - Never show personal student/teacher data.
// - Always tag answers with their source when one exists.
// - When no article matches confidently, say "I don't have a confident
//   answer — try rephrasing, or ask a teacher" rather than fabricating.
//
// Phase-2: swap matchQuery() for an LLM/RAG retrieval. The page surface
// stays the same.

const STARTERS = [
  'What is a carbon footprint?',
  'Why does beef have higher emissions than chicken?',
  'What\'s the difference between Scope 1, 2, and 3?',
  'How big is KUA\'s footprint?',
  'How can dorms reduce electricity?',
  'How much carbon does carpooling save?',
];

const READING_LEVELS = [
  { value: 'novice',       label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced',     label: 'Advanced' },
];

export default function CarbonChat() {
  const [readingLevel, setReadingLevel] = useState('intermediate');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('chat'); // 'chat' | 'quiz'
  const [quiz, setQuiz] = useState(null);
  const [quizPick, setQuizPick] = useState(null);
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages]);

  async function ask(q) {
    if (!q || !q.trim()) return;
    // Date.now() granularity is 1 ms. Two clicks within that window
    // (e.g. mashing two starter buttons) would mint colliding ids and
    // setMessages.find(...id===placeholderId) would resolve the WRONG
    // bubble. Append a random suffix so concurrent asks each get a
    // unique key + placeholder id.
    const seq = Math.random().toString(36).slice(2, 8);
    const userMsg = { role: 'user', text: q.trim(), id: `u_${Date.now()}_${seq}` };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    // Optimistic placeholder so the user sees the bot is "working".
    const placeholderId = `b_${Date.now()}_${seq}`;
    setMessages((m) => [...m, { role: 'bot', id: placeholderId, text: 'Thinking…', confidence: 'medium', loading: true }]);

    try {
      const r = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, readingLevel }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setMessages((m) => m.map((msg) => msg.id === placeholderId ? {
        role: 'bot',
        id: placeholderId,
        text: j.answer,
        title: j.title,
        sourceDoc: j.sourceDoc,
        related: j.related,
        readingLevel: j.readingLevel,
        confidence: j.confidence,
        mode: j.mode,
      } : msg));
    } catch {
      // Network unreachable (e.g. offline preview) — fall back to the
      // local rule-based matcher so the page still works.
      const result = matchQuery(q, { readingLevel });
      const fallback = !result.best || result.score < 2
        ? { text: "I don't have a confident answer to that one. Try rephrasing, or ask a sustainability lead or teacher.", confidence: 'low' }
        : {
            text: result.best.body,
            title: result.best.title,
            sourceDoc: result.best.sourceDoc,
            related: result.related,
            readingLevel: result.best.readingLevel,
            confidence: result.score >= 6 ? 'high' : 'medium',
            mode: 'rule',
          };
      setMessages((m) => m.map((msg) => msg.id === placeholderId ? { role: 'bot', id: placeholderId, ...fallback } : msg));
    }
  }

  function startQuiz(topic) {
    const q = pickQuizForTopic(topic);
    setQuiz(q);
    setQuizPick(null);
  }

  async function pickQuizAnswer(i) {
    if (!quiz || quizPick != null) return;
    setQuizPick(i);
    const opt = quiz.options[i];
    // Fire-and-forget log — failure is silent so the UI never blocks.
    try {
      const userIdHash = await getSessionHash();
      await fetch('/api/quiz/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIdHash,
          quizId: quiz.id,
          topic: quiz.topic,
          correct: !!opt.correct,
          pickedIndex: i,
        }),
      });
    } catch {}
  }

  return (
    <ModulePage
      title="Carbon Learning Chatbot"
      subtitle="Ask questions about climate, energy, food, transportation, and KUA's data. Answers are pulled from a curated knowledge base — sources are cited where applicable."
    >
      <ModuleSection>
        <div style={styles.modeRow}>
          <ModeButton active={mode === 'chat'} onClick={() => setMode('chat')}>💬 Chat</ModeButton>
          <ModeButton active={mode === 'quiz'} onClick={() => setMode('quiz')}>🧠 Quiz</ModeButton>
          <div style={styles.spacer} />
          <div style={styles.levelLabel}>Reading level:</div>
          {READING_LEVELS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setReadingLevel(r.value)}
              style={{
                ...styles.levelChip,
                background: readingLevel === r.value ? '#22d3ee' : '#0b1220',
                color: readingLevel === r.value ? '#0b1220' : '#cbd5e1',
                borderColor: readingLevel === r.value ? '#22d3ee' : '#1f2937',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </ModuleSection>

      {mode === 'chat' && (
        <>
          {messages.length === 0 && (
            <ModuleSection title="Try one of these" hint="Or type your own question below.">
              <div style={styles.starterGrid}>
                {STARTERS.map((s) => (
                  <button key={s} type="button" style={styles.starter} onClick={() => ask(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </ModuleSection>
          )}

          {messages.length > 0 && (
            <ModuleSection title="Conversation">
              <div
                style={styles.thread}
                ref={threadRef}
                role="log"
                aria-live="polite"
                aria-label="Chat conversation"
              >
                {messages.map((m) => (
                  m.role === 'user'
                    ? <UserBubble key={m.id} text={m.text} />
                    : <BotBubble key={m.id} message={m} />
                ))}
              </div>
            </ModuleSection>
          )}

          <ModuleSection>
            <form
              style={styles.inputRow}
              onSubmit={(e) => { e.preventDefault(); ask(input); }}
              aria-label="Ask the carbon learning chatbot"
            >
              <label htmlFor="chatbot-input" style={{ position: 'absolute', left: -9999 }}>
                Question for the carbon chatbot
              </label>
              <input
                id="chatbot-input"
                style={styles.input}
                type="text"
                placeholder="Ask anything about climate, energy, KUA's footprint..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" style={styles.sendBtn} disabled={!input.trim()} aria-label="Send question">Send</button>
            </form>
            <div style={styles.disclaimer}>
              Answers are estimates from a curated knowledge base. They are not audited carbon-accounting facts.
              For policy or compliance questions, talk to the sustainability office.
            </div>
          </ModuleSection>
        </>
      )}

      {mode === 'quiz' && (
        <ModuleSection title="Quick quiz" hint="Pick a topic to get a 4-option question.">
          <div style={styles.topicRow}>
            {[
              { topic: 'scopes',       label: 'Scope 1/2/3' },
              { topic: 'food',         label: 'Food emissions' },
              { topic: 'energy',       label: 'Grid mix' },
              { topic: 'kua_specific', label: 'KUA\'s number' },
            ].map((t) => (
              <button key={t.topic} type="button" style={styles.topicBtn} onClick={() => startQuiz(t.topic)}>
                {t.label}
              </button>
            ))}
          </div>

          {quiz && (
            <div style={styles.quizCard}>
              <div style={styles.quizQuestion}>{quiz.question}</div>
              <div style={styles.quizOptions}>
                {quiz.options.map((o, i) => {
                  const picked = quizPick === i;
                  const showResult = quizPick != null;
                  let bg = '#0b1220';
                  let border = '#1f2937';
                  if (showResult && o.correct) { bg = '#052e1a'; border = '#14532d'; }
                  if (showResult && picked && !o.correct) { bg = '#3a0d12'; border = '#7f1d1d'; }
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={showResult}
                      onClick={() => pickQuizAnswer(i)}
                      style={{ ...styles.quizOption, background: bg, borderColor: border }}
                    >
                      {o.text}
                      {showResult && o.correct && <span style={styles.quizMark('good')}> ✓ correct</span>}
                      {showResult && picked && !o.correct && <span style={styles.quizMark('bad')}> ✗ your pick</span>}
                    </button>
                  );
                })}
              </div>
              {quizPick != null && (
                <div style={styles.quizExplain}>
                  {quiz.options.map((o, i) => (
                    <div key={i} style={styles.quizExplainRow}>
                      <Pill kind={o.correct ? 'good' : 'bad'}>{o.correct ? '✓' : '✗'}</Pill>
                      <div>
                        <div style={styles.quizExplainOpt}>{o.text}</div>
                        <div style={styles.quizExplainBody}>{o.explanation}</div>
                      </div>
                    </div>
                  ))}
                  <button type="button" style={styles.quizAgain} onClick={() => { setQuiz(null); setQuizPick(null); }}>
                    Pick another topic
                  </button>
                </div>
              )}
            </div>
          )}
        </ModuleSection>
      )}
    </ModulePage>
  );
}

function UserBubble({ text }) {
  return (
    <div style={styles.userRow}>
      <div style={styles.userBubble}>{text}</div>
    </div>
  );
}

function BotBubble({ message }) {
  return (
    <div style={styles.botRow}>
      <div style={styles.botBubble}>
        {message.title && (
          <div style={styles.botTitleRow}>
            <span style={styles.botTitle}>{message.title}</span>
            <span style={{ display: 'inline-flex', gap: 6 }}>
              {message.mode && (
                <Pill kind={message.mode === 'llm' ? 'info' : 'neutral'}>
                  {message.mode === 'llm' ? 'AI' : 'rule-based'}
                </Pill>
              )}
              <Pill kind={message.confidence === 'high' ? 'good' : message.confidence === 'medium' ? 'warn' : 'bad'}>
                {message.confidence} confidence
              </Pill>
            </span>
          </div>
        )}
        <div style={styles.botText}>{message.text}</div>
        {message.sourceDoc && (
          <div style={styles.citation}>
            <span style={styles.citationLabel}>Source:</span> {message.sourceDoc}
          </div>
        )}
        {message.related && message.related.length > 0 && (
          <div style={styles.related}>
            <div style={styles.relatedLabel}>Related:</div>
            <ul style={styles.relatedList}>
              {message.related.map((r) => (
                <li key={r.id} style={styles.relatedItem}>{r.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function ModeButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        border: '1px solid',
        cursor: 'pointer',
        background: active ? '#22d3ee' : '#0b1220',
        color: active ? '#0b1220' : '#cbd5e1',
        borderColor: active ? '#22d3ee' : '#1f2937',
      }}
    >
      {children}
    </button>
  );
}

const styles = {
  modeRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  spacer: { flex: 1, minWidth: 16 },
  levelLabel: { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginRight: 6 },
  levelChip: { padding: '6px 12px', borderRadius: 999, fontSize: 12, border: '1px solid', cursor: 'pointer', fontWeight: 600 },

  starterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 },
  starter: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: '#cbd5e1', textAlign: 'left', cursor: 'pointer', fontSize: 14, lineHeight: 1.5, fontFamily: 'inherit' },

  thread: { maxHeight: 480, overflowY: 'auto', padding: 4, display: 'grid', gap: 12 },
  userRow: { display: 'flex', justifyContent: 'flex-end' },
  userBubble: { background: '#22d3ee', color: '#0b1220', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', maxWidth: '78%', fontSize: 14, lineHeight: 1.5, fontWeight: 600 },
  botRow: { display: 'flex', justifyContent: 'flex-start' },
  botBubble: { background: '#0b1220', border: '1px solid #1f2937', padding: '12px 14px', borderRadius: '14px 14px 14px 4px', maxWidth: '88%' },
  botTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 },
  botTitle: { fontSize: 13, color: '#22d3ee', fontWeight: 700 },
  botText: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 },
  citation: { marginTop: 10, padding: '6px 10px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, fontSize: 12, color: '#94a3b8' },
  citationLabel: { color: '#64748b', fontWeight: 700, marginRight: 4 },
  related: { marginTop: 10 },
  relatedLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 4 },
  relatedList: { margin: 0, paddingLeft: 18, fontSize: 12, color: '#94a3b8', lineHeight: 1.7 },
  relatedItem: {},

  inputRow: { display: 'flex', gap: 8 },
  input: { flex: 1, padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: '#e5e7eb', fontSize: 14, fontFamily: 'inherit' },
  sendBtn: { padding: '10px 18px', background: '#22d3ee', color: '#0b1220', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  disclaimer: { marginTop: 10, fontSize: 12, color: '#64748b', lineHeight: 1.5 },

  topicRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 },
  topicBtn: { padding: '8px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: '#cbd5e1', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  quizCard: { padding: 16, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  quizQuestion: { fontSize: 16, color: '#e5e7eb', fontWeight: 700, marginBottom: 14 },
  quizOptions: { display: 'grid', gap: 8 },
  quizOption: { padding: '10px 14px', textAlign: 'left', border: '1px solid', borderRadius: 8, color: '#cbd5e1', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },
  quizMark: (k) => ({ marginLeft: 8, fontSize: 12, fontWeight: 700, color: k === 'good' ? '#86efac' : '#fca5a5' }),
  quizExplain: { marginTop: 14, display: 'grid', gap: 10 },
  quizExplainRow: { display: 'grid', gridTemplateColumns: '40px 1fr', gap: 10, alignItems: 'start' },
  quizExplainOpt: { fontSize: 13, color: '#e5e7eb', fontWeight: 600 },
  quizExplainBody: { fontSize: 13, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 },
  quizAgain: { marginTop: 8, padding: '8px 14px', background: 'transparent', border: '1px solid #334155', borderRadius: 6, color: '#cbd5e1', fontSize: 13, cursor: 'pointer' },
};
