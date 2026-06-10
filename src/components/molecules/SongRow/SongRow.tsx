import Link from "next/link";
import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import { KeyBadge } from "@/components/atoms/KeyBadge/KeyBadge";
import { cn } from "@/lib/utils/cn";
import type { SongListItem } from "@/types/song";

interface SongRowProps {
  song: SongListItem;
  index?: number;
  href: string;
}

export function SongRow({ song, index, href }: SongRowProps) {
  const author = song.authors[0]?.name ?? "";

  return (
    <Link
      href={href}
      className="flex items-center gap-3 w-full py-[9px] no-underline"
      data-testid="song-row"
    >
      {index != null && (
        <span className="w-[18px] text-center text-[13px] font-bold text-muted shrink-0">
          {index}
        </span>
      )}
      <CoverArt song={song} size={52} radius={12} />
      <div className="flex-1 min-w-0">
        <div className={cn("text-[15.5px] font-semibold text-ink truncate")}>
          {song.name}
        </div>
        {author && (
          <div className="text-[13px] text-muted truncate mt-0.5">{author}</div>
        )}
      </div>
      {song.tone && <KeyBadge tone={song.tone} />}
    </Link>
  );
}
