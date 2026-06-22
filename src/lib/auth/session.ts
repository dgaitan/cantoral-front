import "server-only";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "./constants";

export interface SessionData {
  refreshToken: string;
}

export function decodeSessionCookie(raw: string): SessionData | null {
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf-8")) as SessionData;
  } catch {
    return null;
  }
}

export function buildSetCookieHeader(refreshToken: string): string {
  const payload = Buffer.from(JSON.stringify({ refreshToken })).toString("base64url");
  const parts = [
    `${SESSION_COOKIE_NAME}=${payload}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE}`,
  ];
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function buildClearCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}
