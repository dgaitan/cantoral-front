"use client";

import Link from "next/link";
import { Container } from "@/components/utils/Container";
import { Logo } from "@/components/atoms/Logo/Logo";
import { useSiteStore } from "@/store/siteStore";

export function Navigation() {
  const { logoStyle, showLogo } = useSiteStore();
  return (
    <div className="absolute top-0 left-0 right-0 z-50">
        <Container>
            <div className="flex items-center justify-between w-full py-4">
                {showLogo && (
                    <Link href="/">
                        <Logo size={24} white={logoStyle === "white"} />
                    </Link>
                )}
                {/* Navigation links for desktop */}
                <nav className="hidden md:block">
                    <Link href="/">Inicio</Link>
                    <Link href="/explorar">Explorar</Link>
                    <Link href="/listas">Listas</Link>
                    <Link href="/auth/login">Mi cuenta</Link>
                </nav>
            </div>
        </Container>
    </div>
  );
}