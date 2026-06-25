// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { encryptSession, decryptSession, type SessionPayload } from "./crypto";

const payload: SessionPayload = {
  user: {
    id: "1",
    email: "user@example.com",
    name: "Test User",
    can_create_songs: false,
    can_publish_songs: false,
    can_create_playlists: true,
  },
  accessToken: "access.jwt.token",
  refreshToken: "refresh.jwt.token",
};

describe("session crypto", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-value-for-session-encryption";
  });

  it("round-trips an encrypted session back to the original payload", async () => {
    const token = await encryptSession(payload);
    expect(token).not.toContain("access.jwt.token"); // genuinely encrypted, not just encoded
    const decoded = await decryptSession(token);
    expect(decoded?.accessToken).toBe(payload.accessToken);
    expect(decoded?.refreshToken).toBe(payload.refreshToken);
    expect(decoded?.user.email).toBe(payload.user.email);
  });

  it("returns null for a tampered or malformed token", async () => {
    expect(await decryptSession("not-a-valid-jwe")).toBeNull();
    expect(await decryptSession(undefined)).toBeNull();
  });
});
