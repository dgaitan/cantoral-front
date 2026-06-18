import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import type { SongDetailHeaderProps } from "@/types/song";

export function SongDetailHeader({ song }: SongDetailHeaderProps) {
  const categoryName = song.tags?.[0]?.name;
  const authorName = song.authors.map((a) => a.name).join(", ");

  return (
    <div className="flex gap-4 mb-[18px]">
      <div data-testid="cover-art" className="shrink-0">
        <CoverArt song={song} size={92} radius={18} />
      </div>
      <div className="flex-1 min-w-0">
        {categoryName && (
          <div
            data-testid="song-category"
            className="font-[family-name:var(--font-hanken)] text-[11.5px] font-bold tracking-[0.14em] uppercase text-[var(--orange)] mb-1"
          >
            {categoryName}
          </div>
        )}
        <h1 className="font-[family-name:var(--font-newsreader)] text-2xl font-semibold text-[var(--ink)] leading-[1.15] mt-0 mb-[6px]">
          {song.name}
        </h1>
        {authorName && (
          <p
            data-testid="song-author"
            className="font-[family-name:var(--font-hanken)] text-[13px] text-[var(--muted)] m-0"
          >
            {authorName}
          </p>
        )}
      </div>
    </div>
  );
}
