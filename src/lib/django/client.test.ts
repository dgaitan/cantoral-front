// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const session = {
  user: {
    id: "1",
    email: "u@e.com",
    name: "U",
    can_create_songs: false,
    can_publish_songs: false,
    can_create_playlists: false,
  },
  accessToken: "old-access",
  refreshToken: "the-refresh",
};

const getSession = vi.fn();
const updateSessionTokens = vi.fn();
const deleteSession = vi.fn();

vi.mock("@/lib/session/session", () => ({
  getSession: () => getSession(),
  updateSessionTokens: (a: string, r: string) => updateSessionTokens(a, r),
  deleteSession: () => deleteSession(),
}));

import { djangoFetch, UnauthorizedError } from "./client";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
  process.env.API_URL_INTERNAL = "http://api.test";
  getSession.mockReset().mockResolvedValue(session);
  updateSessionTokens.mockReset();
  deleteSession.mockReset();
});

describe("djangoFetch auth + refresh", () => {
  it("attaches the access token from the session", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ data: { ok: true } }));

    await djangoFetch("/v1/thing/", { auth: true });

    const headers = (fetchMock.mock.calls[0]?.[1]?.headers ?? {}) as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer old-access");
  });

  it("refreshes on 401 and retries with the new token", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(jsonResponse({ detail: "expired" }, 401)) // first call: 401
      .mockResolvedValueOnce(jsonResponse({ access: "new-access" })) // refresh call
      .mockResolvedValueOnce(jsonResponse({ data: { ok: true } })); // retry succeeds

    const result = await djangoFetch<{ data: { ok: boolean } }>("/v1/thing/", { auth: true });

    expect(updateSessionTokens).toHaveBeenCalledWith("new-access", "the-refresh");
    expect(result.data.ok).toBe(true);
    const retryHeaders = (fetchMock.mock.calls[2]?.[1]?.headers ?? {}) as Record<string, string>;
    expect(retryHeaders.Authorization).toBe("Bearer new-access");
  });

  it("clears the session and throws when refresh fails", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(jsonResponse({ detail: "expired" }, 401))
      .mockResolvedValueOnce(jsonResponse({ detail: "bad refresh" }, 401));

    await expect(djangoFetch("/v1/thing/", { auth: true })).rejects.toBeInstanceOf(UnauthorizedError);
    expect(deleteSession).toHaveBeenCalled();
  });

  it("throws UnauthorizedError immediately when there is no session", async () => {
    getSession.mockResolvedValue(null);
    await expect(djangoFetch("/v1/thing/", { auth: true })).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("preserves a path prefix on the base URL (e.g. /api)", async () => {
    process.env.API_URL_INTERNAL = "http://localhost:8000/api";
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ data: [] }));

    await djangoFetch("/v1/songs/", { params: { page: 2 } });

    expect(fetchMock.mock.calls[0]?.[0]).toBe("http://localhost:8000/api/v1/songs/?page=2");
  });
});
