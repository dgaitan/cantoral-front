"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-default-200 bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-foreground hover:text-primary transition-colors"
        >
          Cancionero Católico
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/canciones"
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            Canciones
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                {user?.name ?? "Mi cuenta"}
              </Link>
              <button
                onClick={() => void logout()}
                className="text-foreground/50 hover:text-danger text-xs transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
