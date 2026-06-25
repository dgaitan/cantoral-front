import Link from "next/link";
import { FooterBrand } from "./FooterBrand";
import { FooterColumn } from "./FooterColumn";
import { FOOTER_COLUMNS, FOOTER_LEGAL } from "./footer-links";
import { SITE_NAME } from "@/lib/seo/site";
import { Container } from "@/components/templates/Grid/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      {/* Decorative concentric circles (top-right), matching the hero motif. */}
      <svg
        viewBox="0 0 400 200"
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-12 w-[420px] opacity-[0.18]"
      >
        <circle cx="200" cy="100" r="150" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.18" />
        <circle cx="200" cy="100" r="105" fill="none" stroke="var(--orange)" strokeWidth="1" opacity="0.18" />
      </svg>

      <Container>
        <div className="relative pt-14 pb-24 lg:pb-12">
          {/* Brand + 4 link columns. On lg the inner wrapper uses `contents` so its
              four children flatten into this 5-column grid; on mobile they form a 2×2. */}
          <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr_1fr_1fr_1fr] lg:gap-8">
            <FooterBrand />
            <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:contents">
              {FOOTER_COLUMNS.map((column) => (
                <FooterColumn key={column.title} column={column} />
              ))}
            </div>
          </div>

          {/* Legal bottom bar */}
          <div className="mt-12 flex flex-col gap-3 border-t border-cream/10 pt-[22px] text-[13px] text-cream/50 lg:flex-row lg:items-center lg:justify-between">
            <span>
              © {year} {SITE_NAME} · Todos los derechos reservados
            </span>
            <ul className="flex items-center gap-5">
              {FOOTER_LEGAL.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-cream/50 no-underline transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
