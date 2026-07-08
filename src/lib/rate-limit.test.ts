// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";

const headersMock = vi.fn();
vi.mock("next/headers", () => ({
  headers: () => headersMock(),
}));

const { isRateLimited, getClientIp } = await import("./rate-limit");

afterEach(() => {
  vi.useRealTimers();
});

describe("isRateLimited", () => {
  it("allows requests under the limit", () => {
    const key = `under-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key, 5)).toBe(false);
    }
  });

  it("blocks requests once the limit is exceeded", () => {
    const key = `over-${Math.random()}`;
    for (let i = 0; i < 5; i++) isRateLimited(key, 5);
    expect(isRateLimited(key, 5)).toBe(true);
  });

  it("isolates limits per key", () => {
    const keyA = `a-${Math.random()}`;
    const keyB = `b-${Math.random()}`;
    for (let i = 0; i < 5; i++) isRateLimited(keyA, 5);

    expect(isRateLimited(keyA, 5)).toBe(true);
    expect(isRateLimited(keyB, 5)).toBe(false);
  });

  it("resets the window after it expires", () => {
    vi.useFakeTimers();
    const key = `reset-${Math.random()}`;
    for (let i = 0; i < 5; i++) isRateLimited(key, 5);
    expect(isRateLimited(key, 5)).toBe(true);

    vi.advanceTimersByTime(61_000);
    expect(isRateLimited(key, 5)).toBe(false);
  });

  it("prunes expired buckets once the map grows large", () => {
    vi.useFakeTimers();
    for (let i = 0; i < 1001; i++) {
      isRateLimited(`prune-${i}`, 5);
    }
    vi.advanceTimersByTime(61_000);
    expect(isRateLimited("prune-trigger", 5)).toBe(false);
  });
});

describe("getClientIp", () => {
  it("returns the first address from x-forwarded-for", async () => {
    headersMock.mockResolvedValue(new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }));
    expect(await getClientIp()).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", async () => {
    headersMock.mockResolvedValue(new Headers({ "x-real-ip": "9.9.9.9" }));
    expect(await getClientIp()).toBe("9.9.9.9");
  });

  it("falls back to 'unknown' when no IP headers are present", async () => {
    headersMock.mockResolvedValue(new Headers());
    expect(await getClientIp()).toBe("unknown");
  });
});
