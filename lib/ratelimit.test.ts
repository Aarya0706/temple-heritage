import { describe, it, expect, vi, afterEach } from "vitest";
import { checkRateLimit } from "./ratelimit";

describe("checkRateLimit", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit", () => {
    const key = `test-allow-${Math.random()}`;
    const limit = 3;

    for (let i = 0; i < limit; i++) {
      const result = checkRateLimit(key, limit, 60_000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(limit - 1 - i);
    }
  });

  it("blocks the request once the limit is exceeded", () => {
    const key = `test-block-${Math.random()}`;
    const limit = 2;

    checkRateLimit(key, limit, 60_000);
    checkRateLimit(key, limit, 60_000);
    const blocked = checkRateLimit(key, limit, 60_000);

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("tracks separate keys independently", () => {
    const limit = 1;
    const a = checkRateLimit(`test-a-${Math.random()}`, limit, 60_000);
    const b = checkRateLimit(`test-b-${Math.random()}`, limit, 60_000);

    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
  });

  it("resets the count after the window elapses", () => {
    vi.useFakeTimers();
    const key = `test-reset-${Math.random()}`;
    const limit = 1;
    const windowMs = 1_000;

    const first = checkRateLimit(key, limit, windowMs);
    expect(first.allowed).toBe(true);

    const blocked = checkRateLimit(key, limit, windowMs);
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(windowMs + 1);

    const afterReset = checkRateLimit(key, limit, windowMs);
    expect(afterReset.allowed).toBe(true);
  });

  it("reports a resetAt timestamp in the future", () => {
    const key = `test-resetat-${Math.random()}`;
    const before = Date.now();
    const result = checkRateLimit(key, 5, 60_000);
    expect(result.resetAt).toBeGreaterThan(before);
  });
});
