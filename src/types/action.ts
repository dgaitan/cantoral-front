/** Discriminated result returned by every Server Action. Safe to import from Client Components (type-only). */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
