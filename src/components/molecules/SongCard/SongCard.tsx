import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { buildSongParam } from "@/lib/utils/song-param";
import type { SongListItem } from "@/types";

interface SongCardProps {
  song: SongListItem;
  className?: string;
}

export function SongCard({ song, className }: SongCardProps) {
  const href = `/canciones/${buildSongParam(song.id, song.slug)}`;

  return (
    <Link
      href={href}
      data-testid="song-card"
      className={cn(
        "block rounded-xl border border-default-200 bg-content1 p-4 shadow-sm",
        "hover:shadow-md hover:border-primary/40 transition-all duration-200",
        className
      )}
    >
      <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
        {song.name}
      </h3>
      {song.short_description && (
        <p className="text-sm text-foreground/60 line-clamp-2 mb-2">
          {song.short_description}
        </p>
      )}
      <div className="flex items-center gap-3 text-xs text-foreground/40">
        {song.tone && <span>{song.tone}</span>}
        {song.likes !== null && (
          <span>{song.likes} {song.likes === 1 ? "me gusta" : "me gusta"}</span>
        )}
      </div>
    </Link>
  );
}
