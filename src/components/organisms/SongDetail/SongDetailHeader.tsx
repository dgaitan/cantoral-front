import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import type { SongDetailHeaderProps } from "@/types/song";

export function SongDetailHeader({ song }: SongDetailHeaderProps) {
  const categoryName = song.tags?.[0]?.name;
  const authorName = song.authors.map((a) => a.name).join(", ");
  const year = song.created_at ? new Date(song.created_at).getFullYear() : null;

  return (
    <div className="flex gap-4 mb-[18px] lg:flex-col lg:gap-4 lg:mb-5">
      {/* Cover art — mobile: 92px inline; desktop: full-width 220px */}
      <div className="shrink-0 lg:shrink-0 lg:w-full">
        <div className="lg:hidden">
          <CoverArt song={song} size={92} radius={18} />
        </div>
        <div className="hidden lg:block">
          <CoverArt song={song} size={220} radius={20} />
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        {categoryName && (
          <div
            data-testid="song-category"
            className="font-sans text-[11.5px] font-bold tracking-[0.14em] uppercase text-orange mb-1"
          >
            {categoryName}
          </div>
        )}
        <h1 className="font-serif text-2xl lg:text-[26px] font-semibold text-ink leading-[1.15] mt-0 mb-[6px]">
          {song.name}
        </h1>
        {authorName && (
          <p
            data-testid="song-author"
            className="font-sans text-[13px] text-muted m-0"
          >
            {authorName}
            {year && <span className="ml-1">· {year}</span>}
          </p>
        )}
      </div>
    </div>
  );
}
