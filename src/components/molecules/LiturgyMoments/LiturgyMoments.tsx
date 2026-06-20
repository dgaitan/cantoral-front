import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/types";

interface LiturgyMomentsProps {
  categories: Category[];
}

export function LiturgyMoments({ categories }: LiturgyMomentsProps) {
  return (
    <div className="px-5 pt-6 pb-1 lg:px-0 lg:pt-8 lg:pb-6">
      <p className="font-sans text-[11.5px] font-bold tracking-[0.18em] uppercase text-muted mb-1 lg:mb-4">
        Explora por momento
      </p>
      <h2 className="hidden lg:block font-serif text-[24px] font-semibold text-ink mb-5 mt-0">
        Momentos de la Misa
      </h2>

      {/* Mobile: vertical list */}
      <div className="lg:hidden">
        {categories.slice(0, 6).map((cat) => (
          <Link
            key={cat.id}
            href={`/explorar?tag_id=${cat.id}`}
            className="w-full flex items-baseline justify-between py-[14px] border-t border-line no-underline"
          >
            <span className="font-serif text-[21px] font-medium text-ink">
              {cat.name}
            </span>
            <ChevronRight size={16} className="text-orange" aria-hidden="true" />
          </Link>
        ))}
        <div className="border-t border-line" />
      </div>

      {/* Desktop: 4-col grid */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-3">
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat.id}
            href={`/explorar?tag_id=${cat.id}`}
            className="flex items-center justify-between p-4 rounded-[16px] border border-line no-underline hover:bg-paper-2 transition-colors group"
          >
            <div>
              <span className="font-serif text-[18px] font-medium text-ink block">
                {cat.name}
              </span>
              {cat.songs_count != null && (
                <span className="font-sans text-[12px] text-muted mt-0.5 block">
                  {cat.songs_count} cantos
                </span>
              )}
            </div>
            <ChevronRight
              size={16}
              className="text-orange shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
