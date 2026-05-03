import React, { useState, useRef, useEffect } from 'react';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { matchQuery, pickQuizForTopic } from '../utils/chatbotMatch.js';

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

  function ask(q) {
    if (!q || !q.trim()) return;
    const userMsg = { role: 'user', text: q.trim(), id: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    const result = matchQuery(q, { readingLevel });
    let botMsg;
    if (!result.best || result.score < 2) {
      botMsg = {
        role: 'bot',
        id: Date.now() + 1,
        text: "I don't have a confident answer to that one. Try rephrasing, or ask a sustainability lead or teacher. Topics I cover well: carbon footprints, Scope 1/2/3, energy, food emissions, transportation, waste, and KUA-specific data.",
        confidence: 'low',
      };
    } else {
      botMsg = {
        role: 'bot',
        id: Date.now() + 1,
        text: result.best.body,
        title: result.best.title,
        topic: result.best.topic,
        sourceDoc: result.best.sourceDoc,
        related: result.related,
        readingLevel: result.best.readingLevel,
        confidence: result.score >= 6 ? 'high' : 'medium',
      };
    }
    setMessages((m) => [...m, botMsg]);
  }

  function startQuiz(topic) {
    const q = pickQuizForTopic(topic);
    setQuiz(q);
    setQuizPick(null);
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
              <div style={styles.thread} ref={threadRef}>
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
            >
              <input
                style={styles.input}
                type="text"
                placeholder="Ask anything about climate, energy, KUA's footprint..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" style={styles.sendBtn} disabled={!input.trim()}>Send</button>
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
                      onClick={() => setQuizPick(i)}
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
            <Pill kind={message.confidence === 'high' ? 'good' : message.confidence === 'medium' ? 'warn' : 'bad'}>
              {message.confidence} confidence
            </Pill>
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
