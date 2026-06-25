import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth/constants";
import { encryptSession, decryptSession, type SessionPayload } from "./crypto";

export type { SessionPayload } from "./crypto";

/** Read and decrypt the current session from the request cookies. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

/** Write the encrypted session cookie. Only valid in Server Actions / Route Handlers. */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Re-issue the session with rotated Django tokens, preserving the user. */
export async function updateSessionTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const current = await getSession();
  if (!current) return;
  await createSession({ ...current, accessToken, refreshToken });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
