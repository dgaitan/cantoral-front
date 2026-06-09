import Link from "next/link";
import { Logo } from "@/components/atoms/Logo/Logo";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";

export function HomeHero() {
  return (
    <div className="bg-ink px-5 pt-[88px] pb-[30px] rounded-b-[28px] relative overflow-hidden">
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
