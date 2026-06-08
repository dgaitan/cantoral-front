"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { Logo } from "@/components/atoms/Logo/Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        padding: "12px 18px",
        background: scrolled ? "rgba(250,247,241,0.88)" : "var(--paper)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.2s",
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <Logo size={24} />
      </Link>
      <div style={{ display: "flex", gap: 8 }}>
        <Link
          href="/explorar"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1px solid var(--line)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink)",
          }}
          aria-label="Buscar"
        >
          <Search size={20} />
        </Link>
        <Link
          href="/auth/login"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1px solid var(--line)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink)",
          }}
          aria-label="Mi cuenta"
        >
          <User size={20} />
        </Link>
      </div>
    </header>
  );
}
