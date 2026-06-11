import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeadProps {
  title: string;
  kicker?: string;
  action?: string;
  actionHref?: string;
}

export function SectionHead({ title, kicker, action, actionHref }: SectionHeadProps) {
  return (
    <div className="flex items-end justify-between mb-[14px]">
      <div>
        {kicker && (
          <div className="font-[family-name:var(--font-hanken)] text-[11.5px] font-bold tracking-[0.16em] uppercase text-[var(--orange)] mb-[5px] whitespace-nowrap">
            {kicker}
          </div>
        )}
        <h2 className="font-[family-name:var(--font-newsreader)] text-[22px] font-semibold text-[var(--ink)] m-0 tracking-[-0.01em] whitespace-nowrap">
          {title}
        </h2>
      </div>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="flex items-center gap-[3px] font-[family-name:var(--font-hanken)] text-[13.5px] font-semibold text-[var(--muted)] no-underline"
        >
          {action}
          <ChevronRight size={15} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
