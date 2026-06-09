import type { AuthTokens, DjangoResponse, User } from "@/types";
import { apiClient } from "./client";

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

export async function verifyOtp(
  email: string,
  token: string
): Promise<DjangoResponse<AuthTokens>> {
  const { data } = await apiClient.post<DjangoResponse<AuthTokens>>(
    "/auth/verify",
    { email, token }
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

export async function verifyMagicLink(
  email: string,
  token: string
): Promise<DjangoResponse<AuthTokens>> {
  const { data } = await apiClient.post<DjangoResponse<AuthTokens>>(
    "/auth/verify/",
    { email, token }
  );
  return data;
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function fetchCurrentUser(): Promise<DjangoResponse<User>> {
  const { data } = await apiClient.get<DjangoResponse<User>>("/users/me/");
  return data;
}
