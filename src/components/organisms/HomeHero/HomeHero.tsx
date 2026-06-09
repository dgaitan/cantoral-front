import Link from "next/link";
import { Logo } from "@/components/atoms/Logo/Logo";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";

export function HomeHero() {
  return (
    <div className="bg-ink px-5 pt-[58px] pb-[30px] rounded-b-[28px] relative overflow-hidden">
      <svg
        viewBox="0 0 300 200"
        className="absolute right-[-60px] top-[-40px] w-[280px] opacity-50 pointer-events-none"
        aria-hidden="true"
      >
        <circle cx="150" cy="100" r="130" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.35" />
        <circle cx="150" cy="100" r="95" fill="none" stroke="var(--orange)" strokeWidth="1" opacity="0.35" />
        <circle cx="150" cy="100" r="60" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.25" />
      </svg>

      <div className="relative">
        <div className="flex items-center justify-between mb-[26px]">
          <Logo size={24} mono />
          <Link
            href="/auth/login"
            aria-label="Mi cuenta"
            className="w-10 h-10 rounded-[12px] border border-[rgba(243,234,214,0.18)] bg-white/[0.06] text-cream flex items-center justify-center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>
        </div>

        <h1 className="font-serif text-[32px] font-semibold leading-[1.1] text-cream tracking-[-0.02em] mb-4">
          ¿Qué cantamos
          <br />
          <em className="not-italic text-gold">hoy</em>?
        </h1>

        <Link href="/explorar" className="no-underline block">
          <SearchBar glass placeholder="Buscar canción, autor, tono…" readOnly />
        </Link>
      </div>
    </div>
  );
}
