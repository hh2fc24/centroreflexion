type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function now() {
  return Date.now();
}

export function getClientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]!.trim();
  const xr = req.headers.get("x-real-ip");
  if (xr) return xr.trim();
  return "unknown";
}

export function checkRateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }) {
  const t = now();
  const b = buckets.get(key);
  if (!b || t >= b.resetAt) {
    const next: Bucket = { count: 1, resetAt: t + windowMs };
    buckets.set(key, next);
    return { ok: true, remaining: limit - 1, resetAt: next.resetAt };
  }
  if (b.count >= limit) {
    return { ok: false, remaining: 0, resetAt: b.resetAt };
  }
  b.count++;
  return { ok: true, remaining: Math.max(0, limit - b.count), resetAt: b.resetAt };
}

