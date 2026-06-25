"use client";

import { createContext, useContext, type ReactNode } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Re-fetch the session (call after login/logout to refresh auth-dependent UI). */
  refresh: () => Promise<unknown>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  refresh: async () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, mutate } = useSWR(
    "/api/auth/me",
    (url) => fetcher<{ user: User | null }>(url),
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  const user = data?.user ?? null;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), isLoading, refresh: () => mutate() }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
