"use client";

import { useSongs } from "@/hooks/useSongs";
import { SectionHead } from "@/components/molecules/SectionHead/SectionHead";
import { SongRow } from "@/components/molecules/SongRow/SongRow";
import { buildSongParam } from "@/lib/utils/song-param";
import type { SongDetailSimilarProps } from "@/types/song";

const DISPLAY_COUNT = 5;

export function SongDetailSimilar({ testId, currentSongId, query, kicker, title }: SongDetailSimilarProps) {
  const { data } = useSongs(query ? { ...query, limit: DISPLAY_COUNT + 1 } : null);
  const songs = (data?.data?.results ?? [])
    .filter((s) => s.id !== currentSongId)
    .slice(0, DISPLAY_COUNT);

  if (songs.length === 0) return null;

  return (
    <div data-testid={testId} className="mb-8">
      <SectionHead kicker={kicker} title={title} />
      {songs.map((s) => (
        <SongRow key={s.id} song={s} href={`/canciones/${buildSongParam(s.id, s.slug)}`} showTone={false} />
      ))}
    </div>
  );
}
