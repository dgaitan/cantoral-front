import Link from "next/link";
import type { FooterColumnProps } from "@/types/footer";

export function FooterColumn({ column }: FooterColumnProps) {
  return (
    <nav aria-label={column.title}>
      <p className="mb-4 font-sans text-[11.5px] font-bold uppercase tracking-[0.16em] text-gold">
        {column.title}
      </p>
      <ul className="flex flex-col gap-3">
        {column.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[14px] text-cream/70 no-underline transition-colors hover:text-cream"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
