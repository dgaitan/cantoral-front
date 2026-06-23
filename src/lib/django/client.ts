import "server-only";
import { getSession, updateSessionTokens, deleteSession } from "@/lib/session/session";

function baseUrl(): string | undefined {
  return process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;
}

export class DjangoError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = "DjangoError";
  }
}

export class UnauthorizedError extends DjangoError {
  constructor(message = "No autenticado") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export interface DjangoFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Attach the session's access token and refresh-on-401. Throws if unauthenticated. */
  auth?: boolean;
  /** Attach the token only if a session exists; never throws and never refreshes. Safe in Server Components. */
  optionalAuth?: boolean;
  /** Use this access token directly (no session, no refresh) — for the verify flow before a session exists. */
  bearer?: string;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
}

function buildUrl(path: string, params?: DjangoFetchOptions["params"]): string {
  const url = new URL(path, baseUrl());
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function rawFetch(
  path: string,
  opts: DjangoFetchOptions,
  accessToken?: string,
): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  return fetch(buildUrl(path, opts.params), {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    next: opts.next,
    cache: opts.next ? undefined : (opts.cache ?? "no-store"),
  });
}

/** Exchange the session refresh token for a fresh access token; rotate the cookie. */
async function tryRefresh(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  const res = await fetch(buildUrl("/auth/token/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: session.refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { access: string; refresh?: string };
  await updateSessionTokens(data.access, data.refresh ?? session.refreshToken);
  return data.access;
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const json = (await res.json().catch(() => null)) as
    | (Record<string, unknown> & { errors?: Record<string, string[]> | null; detail?: string })
    | null;

  if (!res.ok) {
    const message =
      (typeof json?.detail === "string" && json.detail) ||
      `Django request failed (${res.status})`;
    throw new DjangoError(message, res.status, json?.errors ?? null);
  }
  return json as T;
}

/**
 * Single entry point for every server-side Django call. Reads the encrypted
 * session for authenticated requests, transparently refreshes on 401, and
 * retries once. The browser never sees a token.
 */
export async function djangoFetch<T>(path: string, opts: DjangoFetchOptions = {}): Promise<T> {
  let accessToken = opts.bearer;
  if (!accessToken && (opts.auth || opts.optionalAuth)) {
    const session = await getSession();
    if (!session) {
      if (opts.auth) throw new UnauthorizedError();
    } else {
      accessToken = session.accessToken;
    }
  }

  let res = await rawFetch(path, opts, accessToken);

  if (res.status === 401 && opts.auth && !opts.bearer) {
    const refreshed = await tryRefresh();
    if (!refreshed) {
      await deleteSession();
      throw new UnauthorizedError();
    }
    res = await rawFetch(path, opts, refreshed);
  }

  return parse<T>(res);
}
