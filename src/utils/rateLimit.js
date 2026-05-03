// Tiny in-memory token-bucket rate limiter, scoped by an arbitrary key
// (typically the request IP). Lives in process memory — survives across
// requests on a single warm Vercel function instance, resets on cold
// start. Good enough to stop a casual loop from running up the LLM
// bill; for stronger guarantees, swap in Redis / Upstash.
//
// Usage:
//   const limit = createRateLimit({ capacity: 10, refillPerSec: 1/6 });
//   if (!limit.consume(ip)) { res.status(429).json({...}); return; }

/**
 * @param {object} opts
 * @param {number} opts.capacity        Maximum tokens in the bucket
 * @param {number} opts.refillPerSec    Tokens added per second
 */
export function createRateLimit({ capacity, refillPerSec }) {
  /** @type {Map<string, { tokens: number, last: number }>} */
  const buckets = new Map();

  function consume(key, cost = 1) {
    const now = Date.now();
    let b = buckets.get(key);
    if (!b) {
      b = { tokens: capacity, last: now };
      buckets.set(key, b);
    }
    // Refill since last touch.
    const elapsedSec = (now - b.last) / 1000;
    b.tokens = Math.min(capacity, b.tokens + elapsedSec * refillPerSec);
    b.last = now;
    if (b.tokens < cost) return { allowed: false, retryAfterMs: Math.ceil(((cost - b.tokens) / refillPerSec) * 1000) };
    b.tokens -= cost;
    return { allowed: true, retryAfterMs: 0 };
  }

  function reset(key) {
    if (key) buckets.delete(key); else buckets.clear();
  }

  return { consume, reset };
}

/**
 * Best-effort client IP extraction from a Vercel/Node request. Falls
 * back to "unknown" so unkeyed requests share one bucket rather than
 * being unrestricted.
 */
export function getClientKey(req) {
  const xff = req.headers?.['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  const xri = req.headers?.['x-real-ip'];
  if (xri) return String(xri);
  if (req.socket?.remoteAddress) return req.socket.remoteAddress;
  return 'unknown';
}
