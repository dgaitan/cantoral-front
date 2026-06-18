import { SectionHead } from "@/components/molecules/SectionHead/SectionHead";
import { SongRow } from "@/components/molecules/SongRow/SongRow";
import { buildSongParam } from "@/lib/utils/song-param";
import type { SongDetailSimilarProps } from "@/types/song";

export function SongDetailSimilar({ songs, categoryName }: SongDetailSimilarProps) {
  return (
    <div data-testid="similar-songs" className="mb-8">
      <SectionHead
        kicker="También te puede gustar"
        title={categoryName ? `Más de ${categoryName}` : "Canciones similares"}
      />
      {songs.map((s) => (
        <SongRow key={s.id} song={s} href={`/canciones/${buildSongParam(s.id, s.slug)}`} />
      ))}
    </div>
  );
}
