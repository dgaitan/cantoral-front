"use client";

import { useAuthStore } from "@/store/authStore";
import { loginWithPassword, registerUser, logoutUser } from "@/lib/api/auth";
import { setMemoryToken } from "@/lib/auth/token";
import type { User } from "@/types";

interface VerifyResponse {
  user: User;
  access: string;
}

export function useAuth() {
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();

  async function login(email: string, password: string): Promise<void> {
    await loginWithPassword(email, password);
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    await registerUser(name, email, password);
  }

  async function verifyToken(
    email: string,
    token: string,
    type: "otp" | "magic" = "otp"
  ): Promise<void> {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, type }),
      credentials: "include",
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? "Verificación fallida");
    }

    const { user: verifiedUser, access } = (await res.json()) as VerifyResponse;
    setMemoryToken(access);
    setUser(verifiedUser);
  }

  async function logout(): Promise<void> {
    await logoutUser();
    setMemoryToken(null);
    clearAuth();
  }

  return { user, isAuthenticated, login, register, verifyToken, logout };
}
