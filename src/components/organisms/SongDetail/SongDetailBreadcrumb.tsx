import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SongDetailBreadcrumbProps {
  categoryName?: string;
  categoryId?: string;
  songTitle: string;
}

export function SongDetailBreadcrumb({ categoryName, categoryId, songTitle }: SongDetailBreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-1.5 text-[13px] text-muted font-sans py-3 border-b border-line"
      aria-label="Ubicación actual"
    >
      <Link href="/explorar" className="text-muted hover:text-ink no-underline transition-colors">
        Explorar
      </Link>
      {categoryName && (
        <>
          <ChevronRight size={13} className="text-line shrink-0" aria-hidden="true" />
          <Link
            href={categoryId ? `/explorar?tag_id=${categoryId}` : "/explorar"}
            className="text-muted hover:text-ink no-underline transition-colors"
          >
            {categoryName}
          </Link>
        </>
      )}
      <ChevronRight size={13} className="text-line shrink-0" aria-hidden="true" />
      <span className="text-ink font-medium truncate max-w-[360px]">{songTitle}</span>
    </nav>
  );
}
