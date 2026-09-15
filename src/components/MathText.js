import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Render a text run that may contain LaTeX delimited by $...$ (inline) or
// $$...$$ (block). Splits the run into text and math segments and renders
// each appropriately. This is what AP subunit content uses to show chemical
// formulas, exponents, Greek letters, and proper subscripts/superscripts.
//
// Authoring conventions:
//   $...$              inline math, e.g. $C_6H_{12}O_6$
//   $$...$$            display math on its own line
//   Backslashes for LaTeX commands need to be doubled inside JS template
//   literals: $\\alpha$ becomes \alpha when rendered.
export function MathText({ children }) {
  if (!children) return null;
  if (typeof children !== 'string') return <>{children}</>;
  const parts = splitMath(children);
  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'inline') {
          try {
            return <InlineMath key={i} math={p.value} />;
          } catch {
            return <code key={i}>{p.value}</code>;
          }
        }
        if (p.type === 'block') {
          try {
            return <BlockMath key={i} math={p.value} />;
          } catch {
            return <pre key={i}>{p.value}</pre>;
          }
        }
        return <React.Fragment key={i}>{p.value}</React.Fragment>;
      })}
    </>
  );
}

// Lex the input string into a sequence of {type, value} parts. Recognises
// $$...$$ first (greedy), then $...$. Avoids matching escaped \$.
function splitMath(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === '\\' && s[i + 1] === '$') {
      // escaped dollar — emit as literal
      out.push({ type: 'text', value: '$' });
      i += 2;
      continue;
    }
    if (s[i] === '$' && s[i + 1] === '$') {
      const end = s.indexOf('$$', i + 2);
      if (end > -1) {
        out.push({ type: 'block', value: s.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (s[i] === '$') {
      // find next unescaped $
      let j = i + 1;
      while (j < s.length) {
        if (s[j] === '\\' && s[j + 1] === '$') { j += 2; continue; }
        if (s[j] === '$') break;
        j += 1;
      }
      if (j < s.length) {
        out.push({ type: 'inline', value: s.slice(i + 1, j) });
        i = j + 1;
        continue;
      }
    }
    // accumulate plain text until next potential delimiter
    let k = i;
    while (k < s.length && s[k] !== '$' && s[k] !== '\\') k += 1;
    if (k > i) {
      out.push({ type: 'text', value: s.slice(i, k) });
      i = k;
    } else if (k === i) {
      // single non-math char (\ that didn't start an escape)
      out.push({ type: 'text', value: s[i] });
      i += 1;
    }
  }
  return out;
}
