import Link from "next/link";
import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import { buildSongParam } from "@/lib/utils/song-param";
import { cn } from "@/lib/utils/cn";
import type { SongListItem } from "@/types";

interface SongCardProps {
  song: SongListItem;
  /** "rail" = fixed 150px card for horizontal carousels; "grid" (default) fills its cell. */
  size?: "rail" | "grid";
}

const COVER_SIZE = { rail: 175, grid: 130 } as const;

export function SongCard({ song, size = "grid" }: SongCardProps) {
  const href = `/canciones/${buildSongParam(song.id, song.slug)}`;
  const author = song.authors[0]?.name ?? "";

  return (
    <Link
      href={href}
      data-testid="song-card"
      className={cn(
        "flex flex-col gap-2.5 shrink-0 cursor-pointer rounded-2xl border border-line bg-white p-3 text-left no-underline",
        "shadow-[0_1px_3px_rgba(10,29,43,.08),0_4px_16px_rgba(10,29,43,.06)]",
        size === "rail" && "w-[200px]"
      )}
    >
      <CoverArt song={song} size={COVER_SIZE[size]} radius={11} showCategory />
      <div className="min-w-0">
        <div className="font-sans text-sm font-semibold text-ink leading-tight line-clamp-2">
          {song.name}
        </div>
        {author && (
          <div className="font-sans text-xs text-muted mt-[3px] truncate">{author}</div>
        )}
      </div>
    </Link>
  );
}
