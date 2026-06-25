import "server-only";
import { DjangoError } from "@/lib/django/client";
import type { ActionResult } from "@/types/action";

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail(error: string, fieldErrors?: Record<string, string[]>): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}

/** Map a thrown error (typically a DjangoError) onto an ActionResult. */
export function fromError(err: unknown, fallback: string): ActionResult<never> {
  if (err instanceof DjangoError) {
    return { ok: false, error: err.message || fallback, fieldErrors: err.errors ?? undefined };
  }
  return { ok: false, error: fallback };
}
