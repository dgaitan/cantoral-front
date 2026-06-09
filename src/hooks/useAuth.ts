"use client";

import { useAuthStore } from "@/store/authStore";
import {
  loginWithPassword,
  registerUser,
  verifyOtp,
  logoutUser,
  fetchCurrentUser,
} from "@/lib/api/auth";
import { setMemoryToken } from "@/lib/auth/token";

export function useAuth() {
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();

  async function login(email: string, password: string): Promise<void> {
    await loginWithPassword(email, password);
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    await registerUser(name, email, password);
  }

  async function verifyToken(email: string, token: string): Promise<void> {
    const authResponse = await verifyOtp(email, token);
    if (!authResponse.success || !authResponse.data) {
      throw new Error("Verificación fallida");
    }

    const { access, refresh } = authResponse.data;

    await fetch("/api/auth/set-cookies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access, refresh }),
    });

    setMemoryToken(access);

    const userResponse = await fetchCurrentUser();
    if (userResponse.success && userResponse.data) {
      setUser(userResponse.data);
    }
  }

  async function logout(): Promise<void> {
    await logoutUser();
    setMemoryToken(null);
    clearAuth();
  }

  return { user, isAuthenticated, login, register, verifyToken, logout };
}
