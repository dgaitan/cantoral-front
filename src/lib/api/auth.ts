import type { DjangoResponse } from "@/types";
import { apiClient, getMemoryToken } from "./client";

export async function loginWithPassword(
  email: string,
  password: string
): Promise<DjangoResponse<null>> {
  const { data } = await apiClient.post<DjangoResponse<null>>(
    "/auth/login",
    { email, password }
  );
  return data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<DjangoResponse<null>> {
  const { data } = await apiClient.post<DjangoResponse<null>>(
    "/auth/register",
    { name, email, password }
  );
  return data;
}

export async function requestMagicLink(
  email: string
): Promise<DjangoResponse<null>> {
  const { data } = await apiClient.post<DjangoResponse<null>>(
    "/auth/request-link/",
    { email }
  );
  return data;
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access: getMemoryToken() }),
    credentials: "include",
  });
}
