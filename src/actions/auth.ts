"use server";

import { djangoFetch } from "@/lib/django/client";
import { createSession, deleteSession, getSession } from "@/lib/session/session";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";
import {
  loginSchema,
  registerSchema,
  magicLinkSchema,
  otpSchema,
  verifyMagicSchema,
} from "@/lib/schemas/auth";
import type { ActionResult } from "@/types/action";
import type { AuthTokens, DjangoResponse, User } from "@/types";
import { ok, fail, fromError } from "./_helpers";

const RATE_LIMIT_MESSAGE = "Demasiados intentos. Intenta de nuevo en un minuto.";

/** Request an OTP via email + password. No session yet — the user must verify. */
export async function login(input: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  if (isRateLimited(`login:${await getClientIp()}`)) return fail(RATE_LIMIT_MESSAGE);
  try {
    await djangoFetch<DjangoResponse<null>>("/auth/login", { method: "POST", body: parsed.data });
    return ok(undefined);
  } catch (err) {
    return fromError(err, "No se pudo iniciar sesión. Intenta nuevamente.");
  }
}

/** Register and request an OTP. No session yet — the user must verify. */
export async function register(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return fail("Datos inválidos", parsed.error.flatten().fieldErrors);
  if (isRateLimited(`register:${await getClientIp()}`)) return fail(RATE_LIMIT_MESSAGE);
  try {
    await djangoFetch<DjangoResponse<null>>("/auth/register", { method: "POST", body: parsed.data });
    return ok(undefined);
  } catch (err) {
    return fromError(err, "No se pudo crear la cuenta. Intenta nuevamente.");
  }
}

/** Send a magic link to the given email. */
export async function requestMagicLink(input: unknown): Promise<ActionResult> {
  const parsed = magicLinkSchema.safeParse(input);
  if (!parsed.success) return fail("Correo inválido", parsed.error.flatten().fieldErrors);
  if (isRateLimited(`magic-link:${await getClientIp()}`)) return fail(RATE_LIMIT_MESSAGE);
  try {
    await djangoFetch<DjangoResponse<null>>("/auth/request-link/", {
      method: "POST",
      body: parsed.data,
    });
    return ok(undefined);
  } catch (err) {
    return fromError(err, "No se pudo enviar el enlace. Intenta nuevamente.");
  }
}

/** Verify an OTP code and establish the session. */
export async function verifyOtp(input: unknown): Promise<ActionResult<{ user: User }>> {
  const parsed = otpSchema.safeParse(input);
  if (!parsed.success) return fail("Código inválido", parsed.error.flatten().fieldErrors);
  if (isRateLimited(`verify-otp:${await getClientIp()}`)) return fail(RATE_LIMIT_MESSAGE);
  return completeVerification(parsed.data.email, parsed.data.token, "/auth/verify");
}

/** Verify a magic-link token and establish the session. */
export async function verifyMagic(input: unknown): Promise<ActionResult<{ user: User }>> {
  const parsed = verifyMagicSchema.safeParse(input);
  if (!parsed.success) return fail("Enlace inválido");
  return completeVerification(parsed.data.email, parsed.data.token, "/auth/verify/");
}

async function completeVerification(
  email: string,
  token: string,
  endpoint: string,
): Promise<ActionResult<{ user: User }>> {
  try {
    const verifyRes = await djangoFetch<DjangoResponse<AuthTokens>>(endpoint, {
      method: "POST",
      body: { email, token },
    });
    if (!verifyRes.success || !verifyRes.data) return fail("Verificación fallida");

    const { access_token, refresh_token } = verifyRes.data;

    const profileRes = await djangoFetch<DjangoResponse<User>>("/v1/profile", {
      bearer: access_token,
    });
    if (!profileRes.success || !profileRes.data) return fail("No se pudo obtener el perfil");

    await createSession({
      user: profileRes.data,
      accessToken: access_token,
      refreshToken: refresh_token,
    });
    return ok({ user: profileRes.data });
  } catch (err) {
    return fromError(err, "Verificación fallida. Intenta nuevamente.");
  }
}

/** Best-effort backend logout, then destroy the session cookie. */
export async function logout(): Promise<ActionResult> {
  const session = await getSession();
  if (session) {
    try {
      await djangoFetch<DjangoResponse<null>>("/users/logout/", {
        method: "POST",
        auth: true,
        body: { refresh: session.refreshToken },
      });
    } catch {
      // Logout is best-effort; clearing the local session is what matters.
    }
  }
  await deleteSession();
  return ok(undefined);
}
