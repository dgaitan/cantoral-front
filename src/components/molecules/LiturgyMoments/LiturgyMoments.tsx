import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/types";

interface LiturgyMomentsProps {
  categories: Category[];
}

export function LiturgyMoments({ categories }: LiturgyMomentsProps) {
  return (
    <div className="px-5 pt-6 pb-1">
      <p className="font-sans text-[11.5px] font-bold tracking-[0.18em] uppercase text-muted mb-1">
        Momentos de la Misa
      </p>
      <div>
        {categories.slice(0, 6).map((cat) => (
          <Link
            key={cat.id}
            href={`/explorar?cat=${cat.slug}`}
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
    </div>
  );
}
