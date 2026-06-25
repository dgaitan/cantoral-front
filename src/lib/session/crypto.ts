import { EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";
import { SESSION_MAX_AGE } from "@/lib/auth/constants";
import type { User } from "@/types";

/**
 * Pure session encryption helpers. No `next/headers` and no `server-only`
 * marker so this module is safe to import from Edge middleware as well as
 * Server Actions / Route Handlers.
 */

export interface SessionPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

let cachedKey: Uint8Array | null = null;

/** Derive a 256-bit key from JWT_SECRET using Web Crypto (Edge + Node safe). */
async function getKey(): Promise<Uint8Array> {
  if (cachedKey) return cachedKey;
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  cachedKey = new Uint8Array(digest);
  return cachedKey;
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
  const key = await getKey();
  return new EncryptJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE)
    .encrypt(key);
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const key = await getKey();
    const { payload } = await jwtDecrypt(token, key);
    return payload as unknown as SessionPayload;
  } catch {
    // Tampered, expired, or wrong-key cookie → treat as no session.
    return null;
  }
}
