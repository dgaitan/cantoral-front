// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const djangoFetch = vi.fn();
vi.mock("@/lib/django/client", () => ({
  djangoFetch: (...args: unknown[]) => djangoFetch(...args),
}));

function createCookieJar() {
  const store = new Map<string, { value: string; options?: Record<string, unknown> }>();
  return {
    get: vi.fn((name: string) => {
      const entry = store.get(name);
      return entry ? { name, value: entry.value } : undefined;
    }),
    set: vi.fn((name: string, value: string, options?: Record<string, unknown>) => {
      store.set(name, { value, options });
    }),
    __store: store,
  };
}

let cookieJar = createCookieJar();
vi.mock("next/headers", () => ({
  cookies: () => Promise.resolve(cookieJar),
}));

import { recordSongView } from "./songs";

beforeEach(() => {
  djangoFetch.mockReset().mockResolvedValue({ success: true, data: {} });
  cookieJar = createCookieJar();
});

describe("recordSongView", () => {
  it("calls the anonymous view endpoint and sets the dedup cookie when no cookie exists", async () => {
    await recordSongView("482");

    expect(djangoFetch).toHaveBeenCalledWith("/v1/songs/482/view/", { method: "POST" });
    expect(cookieJar.set).toHaveBeenCalledWith(
      "sv_482",
      "1",
      expect.objectContaining({ httpOnly: true, maxAge: 86400 }),
    );
  });

  it("does not call the Django endpoint when the dedup cookie already exists", async () => {
    cookieJar.__store.set("sv_482", { value: "1" });

    await recordSongView("482");

    expect(djangoFetch).not.toHaveBeenCalled();
    expect(cookieJar.set).not.toHaveBeenCalled();
  });

  it("resolves without throwing when the Django call fails", async () => {
    djangoFetch.mockRejectedValue(new Error("network down"));

    await expect(recordSongView("482")).resolves.toBeUndefined();
  });

  it("sanitizes the song id before building the cookie name", async () => {
    await recordSongView("482;evil");

    expect(cookieJar.set).toHaveBeenCalledWith(
      "sv_482evil",
      "1",
      expect.any(Object),
    );
  });
});
