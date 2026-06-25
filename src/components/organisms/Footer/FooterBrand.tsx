import Link from "next/link";
import { Logo } from "@/components/atoms/Logo/Logo";
import { SITE_TAGLINE } from "@/lib/seo/site";
import { FOOTER_SOCIALS } from "./footer-links";

export function FooterBrand() {
  return (
    <div className="max-w-[300px]">
      <Link href="/" aria-label="Cancionero Católico — Inicio" className="inline-block no-underline">
        <Logo size={30} white />
      </Link>

      <p className="mt-4 text-[14px] leading-relaxed text-cream/60">{SITE_TAGLINE}</p>

      <ul className="mt-6 flex items-center gap-2.5">
        {FOOTER_SOCIALS.map((social) => (
          <li key={social.label}>
            <Link
              href={social.href}
              aria-label={social.name}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-[11px] font-bold text-cream/70 no-underline transition-colors hover:border-cream/50 hover:text-cream"
            >
              {social.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
