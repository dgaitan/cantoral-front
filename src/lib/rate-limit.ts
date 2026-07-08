import "server-only";
import { headers } from "next/headers";

interface Bucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const DEFAULT_MAX_ATTEMPTS = 5;
const PRUNE_THRESHOLD = 1000;

const buckets = new Map<string, Bucket>();

function prune(now: number): void {
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

/**
 * In-memory fixed-window rate limiter, keyed by an arbitrary string (e.g.
 * `${action}:${ip}`). Single-process and non-durable: resets on redeploy and
 * doesn't coordinate across multiple instances. Acceptable for the current
 * single-instance deploy — move to a shared store (e.g. Upstash) if scaled
 * horizontally.
 */
export function isRateLimited(key: string, maxAttempts = DEFAULT_MAX_ATTEMPTS): boolean {
  const now = Date.now();
  if (buckets.size > PRUNE_THRESHOLD) prune(now);

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > maxAttempts;
}

/** Best-effort caller IP from forwarding headers (typical single reverse proxy / PaaS setup). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}
