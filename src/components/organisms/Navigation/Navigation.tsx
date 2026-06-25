"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/atoms/Logo/Logo";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { cn } from "@/lib/utils/cn";
import APP_URLS from "@/lib/constants";

const NAV_LINKS = [
  { label: "Explorar", href: APP_URLS.EXPLORER },
  { label: "Listas", href: APP_URLS.LISTAS },
] as const;

interface NavigationProps {
  logoStyle?: "normal" | "white";
  showLogo?: boolean;
}

export function Navigation({ logoStyle = "normal", showLogo = true }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isWhite = logoStyle === "white";
  const { isAuthenticated } = useAuth();

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-[1100px] mx-auto w-full px-5 lg:px-8">
        <div className="flex items-center justify-between w-full py-4 lg:py-[18px]">
          {showLogo && (
            <Link href="/" className="shrink-0 no-underline">
              <Logo size={24} white={isWhite} />
            </Link>
          )}

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-7 ml-10">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "font-sans text-[14px] font-semibold no-underline transition-opacity",
                    isWhite
                      ? cn("text-cream", isActive ? "opacity-100" : "opacity-60 hover:opacity-90")
                      : cn("text-ink", isActive ? "opacity-100" : "opacity-50 hover:opacity-80")
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop: search + auth */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <div className="w-[280px]">
              <SearchBar
                glass={isWhite}
                placeholder="Buscar canción, autor, tono…"
                readOnly
                onFocus={() => router.push("/explorar")}
              />
            </div>

            {isAuthenticated ? (
              <Link
                href={APP_URLS.PROFILE}
                className="font-sans text-[13.5px] font-semibold px-4 py-[9px] rounded-[12px] no-underline border transition-colors"
              >
                Mi cuenta
              </Link>
            ) : (
              <>
                <Link
                  href={APP_URLS.LOGIN}
                  className={cn(
                    "font-sans text-[13.5px] font-semibold px-4 py-[9px] rounded-[12px] no-underline border transition-colors",
                    isWhite
                      ? "text-cream border-cream/30 hover:bg-cream/10"
                      : "text-ink border-ink/20 hover:bg-ink/5"
                  )}
                >
                  Ingresar
                </Link>
                <Link
                  href={APP_URLS.REGISTER}
                  className="button button--primary button--sm font-sans text-[13.5px] font-semibold no-underline"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
