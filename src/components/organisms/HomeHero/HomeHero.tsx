import Link from "next/link";
import { Heading } from "@/components/atoms/Heading/Heading";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { HomeHeroFeatured } from "./HomeHeroFeatured";
import { Container } from "@/components/templates/Grid/Container";

export function HomeHero() {
  return (
    <header className="bg-ink px-5 pt-[88px] pb-[30px] rounded-b-[28px] relative overflow-hidden lg:px-0 lg:pt-0 lg:pb-0 lg:rounded-b-[36px]">
      {/* Mobile decorative circles */}
      <svg
        viewBox="0 0 300 200"
        className="absolute right-[-60px] top-[-40px] w-[280px] opacity-50 pointer-events-none lg:hidden"
        aria-hidden="true"
      >
        <circle cx="150" cy="100" r="130" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.35" />
        <circle cx="150" cy="100" r="95" fill="none" stroke="var(--orange)" strokeWidth="1" opacity="0.35" />
        <circle cx="150" cy="100" r="60" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.25" />
      </svg>

      {/* Desktop decorative circles (larger, right-aligned) */}
      <svg
        viewBox="0 0 400 400"
        className="hidden lg:block absolute right-[-80px] top-[-80px] w-[480px] opacity-30 pointer-events-none"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="180" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.4" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="var(--orange)" strokeWidth="1" opacity="0.3" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.2" />
        <circle cx="200" cy="200" r="60" fill="none" stroke="var(--orange)" strokeWidth="1" opacity="0.15" />
      </svg>

      {/* Content */}
      <Container className="relative">
        {/* Mobile: single column; Desktop: 2-column grid */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:pt-[120px] lg:pb-[80px]">
          {/* Left column */}
          <div>
            {/* Desktop kicker */}
            <p className="hidden lg:block font-sans text-[11px] font-bold tracking-[0.18em] uppercase text-gold mb-5 m-0">
              Biblioteca de Música Católica
            </p>

            <Heading size="xl" tone="cream" className="leading-[1.1] tracking-[-0.02em] mb-4">
              ¿Qué cantamos
              <br />
              <em className="not-italic text-gold">hoy</em>?
            </Heading>

            {/* Desktop subtitle */}
            <p className="hidden lg:block font-sans text-[15px] text-cream/60 mb-7 leading-[1.6] m-0">
              Letras, acordes y tonos para cada momento de la liturgia. Listo para cantar, listo para proyectar.
            </p>

            <Link href="/explorar" className="no-underline block">
              <SearchBar
                glass
                placeholder='Buscar "Te presentamos el vino y el pan"…'
                readOnly
              />
            </Link>
          </div>

          {/* Right column — desktop only */}
          <div className="hidden lg:block">
            <HomeHeroFeatured />
          </div>
        </div>
      </Container>
    </header>
  );
}
