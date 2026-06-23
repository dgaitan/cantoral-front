"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { logout as logoutAction } from "@/actions/auth";

export function useAuth() {
  const { user, isAuthenticated, isLoading, refresh } = useAuthContext();
  const router = useRouter();

  async function logout(): Promise<void> {
    await logoutAction();
    await refresh();
    router.push("/");
    router.refresh();
  }

  return { user, isAuthenticated, isLoading, refresh, logout };
}
