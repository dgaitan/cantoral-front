export class FetchError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly info?: unknown,
  ) {
    super(message);
    this.name = "FetchError";
  }
}

/** SWR fetcher for the internal BFF route handlers. The session cookie travels automatically. */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const info = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new FetchError(info?.error ?? "No se pudo cargar la información.", res.status, info);
  }
  return res.json() as Promise<T>;
}

/** Build a `?a=1&b=2` query string, skipping empty/undefined values. */
export function toQueryString(
  params: Record<string, string | number | undefined | null>,
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") sp.set(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}
