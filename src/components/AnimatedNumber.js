import React, { useEffect, useRef, useState } from 'react';

// Counts up to `value` over `duration` ms using requestAnimationFrame.
// Designed for hero stats — the homepage net-balance number and the
// per-student callout — so the dashboard has motion the moment a
// visitor lands.
//
// Respects prefers-reduced-motion: skips the animation and renders
// the final value immediately. People who set that preference do so
// because animation makes them sick; the dashboard shouldn't ignore it.
//
// Easing: ease-out cubic, so the count starts fast and lands gently
// on the final value. Linear feels mechanical; ease-out reads as
// "deliberate, settling."

const REDUCED_MOTION = typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Hook variant — useful when the consumer needs to render the
 * animated value inside an SVG <text> or another non-span context
 * where the AnimatedNumber component's <span> won't work.
 *
 * @param {number} value           target number to count to
 * @param {number} [duration=1100] ms
 * @returns {number} the current eased value (updated each frame)
 */
export function useAnimatedNumber(value, duration = 1100) {
  const [display, setDisplay] = useState(() => REDUCED_MOTION ? value : 0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(REDUCED_MOTION ? value : 0);
  const targetRef = useRef(value);

  useEffect(() => {
    if (REDUCED_MOTION) {
      setDisplay(value);
      return undefined;
    }
    fromRef.current = display;
    targetRef.current = value;
    startRef.current = null;
    function step(ts) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const next = fromRef.current + (targetRef.current - fromRef.current) * eased;
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return display;
}

/**
 * @param {object} props
 * @param {number} props.value           target number to count to
 * @param {number} [props.duration=1100] ms
 * @param {number} [props.decimals=0]    decimal places in displayed value
 * @param {(n: number) => string} [props.format] custom formatter (default toLocaleString)
 */
export function AnimatedNumber({ value, duration = 1100, decimals = 0, format }) {
  const display = useAnimatedNumber(value, duration);
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(display * factor) / factor;
  const text = format ? format(rounded) : rounded.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{text}</span>;
}
