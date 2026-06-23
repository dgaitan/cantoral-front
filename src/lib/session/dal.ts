import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@/types";
import { getSession, type SessionPayload } from "./session";

export interface VerifiedSession {
  isAuth: boolean;
  user: User | null;
}

/**
 * Request-memoized session check. Safe to call from multiple Server Components
 * in the same render without re-decrypting the cookie each time.
 */
export const verifySession = cache(async (): Promise<VerifiedSession> => {
  const session = await getSession();
  return { isAuth: Boolean(session), user: session?.user ?? null };
});

/** The current user (from the session), or null when unauthenticated. */
export async function getCurrentUser(): Promise<User | null> {
  return (await verifySession()).user;
}

/** Convenience boolean for guards. */
export async function isAuthenticated(): Promise<boolean> {
  return (await verifySession()).isAuth;
}

/**
 * Return the active session or redirect to login. Use in protected Server
 * Components / actions where an unauthenticated caller should be bounced.
 */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
