import axios from "axios";

export function extractApiError(
  error: unknown,
  fallback = "Ha ocurrido un error. Intenta nuevamente."
): string {
  if (!axios.isAxiosError(error)) return fallback;

  const data = error.response?.data as {
    message?: string;
    errors?: unknown;
  } | undefined;

  if (!data) return fallback;

  if (typeof data.message === "string" && data.message) return data.message;

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    if (typeof first === "string") return first;
    if (typeof first === "object" && first !== null) {
      const values = Object.values(first as Record<string, string[]>).flat();
      if (values.length > 0) return values[0] ?? fallback;
    }
  }

  if (data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
    const values = Object.values(data.errors as Record<string, string[]>).flat();
    if (values.length > 0) return values[0] ?? fallback;
  }

  return fallback;
}
