import { NextRequest } from "next/server";

/**
 * Simple in-memory, fixed-window rate limiter.
 *
 * CAVEAT: this state lives in the memory of a single serverless function
 * instance. On Vercel that means:
 *  - it resets on cold starts
 *  - it is NOT shared across concurrent instances, so under real traffic
 *    the *effective* limit can be higher than the number below (each
 *    warm instance tracks its own counts)
 *
 * That's an acceptable tradeoff for a hobby-scale deployment and it costs
 * nothing to run. If usage grows, swap this for a shared store — Upstash
 * Redis + @upstash/ratelimit is the standard drop-in for Vercel and needs
 * no infra to manage.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Prevent unbounded memory growth from one-off IPs hammering the process.
const MAX_TRACKED_KEYS = 5000;

export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, limit, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, limit, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, limit, remaining: limit - existing.count, resetAt: existing.resetAt };
}