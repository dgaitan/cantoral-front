"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ListMusic, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { id: "home", label: "Inicio", icon: Home, href: "/" },
  { id: "explorar", label: "Explorar", icon: Search, href: "/explorar" },
  { id: "listas", label: "Listas", icon: ListMusic, href: "/listas" },
  { id: "cuenta", label: "Cuenta", icon: User, href: "/login" },
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
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-line bg-paper/[0.92] pt-[9px] pb-2 backdrop-blur-[14px]"
      aria-label="Navegación principal"
    >
      {NAV_ITEMS.map(({ id, label, icon: Icon, href }) => {
        const active = activeTab === id;
        return (
          <Link
            key={id}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-[14px] py-[2px] no-underline",
              active ? "text-orange" : "text-muted"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={23} aria-hidden="true" />
            <span
              className={cn(
                "font-sans text-[10.5px]",
                active ? "font-bold" : "font-semibold"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
