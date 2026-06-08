"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ListMusic, User } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Inicio", icon: Home, href: "/" },
  { id: "explorar", label: "Explorar", icon: Search, href: "/explorar" },
  { id: "listas", label: "Listas", icon: ListMusic, href: "/listas" },
  { id: "cuenta", label: "Cuenta", icon: User, href: "/auth/login" },
] as const;

function resolveTab(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/explorar") || pathname.startsWith("/canciones"))
    return "explorar";
  if (pathname.startsWith("/listas") || pathname.startsWith("/mis-listas"))
    return "listas";
  if (pathname.startsWith("/auth") || pathname.startsWith("/dashboard"))
    return "cuenta";
  return "home";
}

export function BottomNav() {
  const pathname = usePathname();
  const activeTab = resolveTab(pathname);

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        paddingBottom: 24,
        paddingTop: 9,
        background: "rgba(250,247,241,0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid var(--line)",
        display: "flex",
        justifyContent: "space-around",
      }}
      aria-label="Navegación principal"
    >
      {NAV_ITEMS.map(({ id, label, icon: Icon, href }) => {
        const active = activeTab === id;
        return (
          <Link
            key={id}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "2px 14px",
              color: active ? "var(--orange)" : "var(--muted)",
              textDecoration: "none",
            }}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={23} aria-hidden="true" />
            <span
              style={{
                fontFamily: "var(--font-hanken)",
                fontSize: 10.5,
                fontWeight: active ? 700 : 600,
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
