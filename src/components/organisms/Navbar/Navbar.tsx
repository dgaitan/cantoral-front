"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { Logo } from "@/components/atoms/Logo/Logo";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between px-[18px] py-3 transition-all duration-200",
        scrolled
          ? "bg-paper/[0.88] backdrop-blur-[12px] border-b border-line"
          : "bg-paper border-b border-transparent"
      )}
    >
      <Link href="/" className="no-underline">
        <Logo size={24} />
      </Link>
      <div className="flex gap-2">
        <Link
          href="/explorar"
          aria-label="Buscar"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink"
        >
          <Search size={20} />
        </Link>
        <Link
          href="/auth/login"
          aria-label="Mi cuenta"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink"
        >
          <User size={20} />
        </Link>
      </div>
    </header>
  );
}
