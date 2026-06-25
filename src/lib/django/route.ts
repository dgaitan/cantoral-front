import "server-only";
import { NextResponse } from "next/server";
import { DjangoError } from "./client";

/** Map a thrown Django/Unauthorized error onto a JSON response with the right status. */
export function routeError(err: unknown): NextResponse {
  if (err instanceof DjangoError) {
    return NextResponse.json({ error: err.message, errors: err.errors }, { status: err.status });
  }
  return NextResponse.json({ error: "Error interno" }, { status: 500 });
}

export function numParam(sp: URLSearchParams, key: string): number | undefined {
  const raw = sp.get(key);
  if (raw == null || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}
