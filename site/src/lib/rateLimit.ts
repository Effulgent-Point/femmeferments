const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// In-memory fallback (same as the original per-instance limiter).
const memStore = new Map<string, number[]>();

function memCheck(key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const recent = (memStore.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  memStore.set(key, recent);
  if (memStore.size > 5000) memStore.clear();
  return recent.length > max;
}

async function redisCheck(
  key: string,
  windowMs: number,
  max: number,
): Promise<boolean> {
  const bucket = Math.floor(Date.now() / windowMs);
  const rk = `${key}:${bucket}`;
  const ttl = Math.ceil(windowMs / 1000) + 60;
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", rk],
        ["EXPIRE", rk, ttl],
      ]),
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return memCheck(key, windowMs, max);
    const data = (await res.json()) as { result: number }[];
    const count = data?.[0]?.result ?? 0;
    return count > max;
  } catch {
    return memCheck(key, windowMs, max);
  }
}

export function isRateLimited(
  scope: string,
  ip: string,
  windowMs: number,
  max: number,
): Promise<boolean> | boolean {
  const key = `rl:${scope}:${ip}`;
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    return redisCheck(key, windowMs, max);
  }
  return memCheck(key, windowMs, max);
}
