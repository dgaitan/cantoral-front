"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useSongs } from "@/hooks/useSongs";
import { fetchSong } from "@/lib/api/songs";
import { useAuthStore } from "@/store/authStore";
import { ChordControls } from "@/components/organisms/ChordControls/ChordControls";
import { SongLyricsRenderer } from "@/components/organisms/SongLyricsRenderer/SongLyricsRenderer";
import { transposeKey } from "@/lib/lyrics/transpose-spanish";
import { SongDetailTopBar } from "./SongDetailTopBar";
import { SongDetailHeader } from "./SongDetailHeader";
import { SongDetailMeta } from "./SongDetailMeta";
import { SongDetailActions } from "./SongDetailActions";
import { SongDetailVideo } from "./SongDetailVideo";
import { SongDetailSimilar } from "./SongDetailSimilar";
import type { SongDetailProps } from "@/types/song";

export function SongDetailClient({ song, presentacionHref }: SongDetailProps) {
  const router = useRouter();
  const [steps, setSteps] = useState(0);
  const [showChords, setShowChords] = useState(true);
  const [fontSize, setFontSize] = useState(18);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: freshSongResponse } = useSWR(
    isAuthenticated ? ["song", song.id] : null,
    () => fetchSong(song.id),
    { fallbackData: { success: true, data: song, errors: null, status: 200 } }
  );
  const isFavorited = freshSongResponse?.data?.is_favorited ?? song.is_favorited ?? false;

  const { data: similarData } = useSongs();
  const similarSongs = (similarData?.data?.results ?? [])
    .filter((s) => s.id !== song.id)
    .slice(0, 5);

  const hasLyrics = !!song.lyrics;

  const baseKey = song.tone ?? "";
  const displayKey = baseKey ? transposeKey(baseKey, steps) : "";

  return (
    <div className="bg-[var(--paper)] min-h-screen">
      <SongDetailTopBar
        onBack={() => router.back()}
        songId={song.id}
        songSlug={song.slug}
        songTitle={song.name}
        isFavorited={isFavorited}
      />

      <div className="px-5 pt-5">
        <SongDetailHeader song={song} />

        <SongDetailMeta displayKey={displayKey} views={song.views} likes={song.likes} />

        <SongDetailActions presentacionHref={presentacionHref} />

        {hasLyrics && (
          <div data-testid="chord-controls" className="bg-white border border-[var(--line)] rounded-[18px] p-4 mb-6">
            <ChordControls
              steps={steps}
              onStepsChange={setSteps}
              showChords={showChords}
              onShowChordsChange={setShowChords}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              baseKey={baseKey}
            />
          </div>
        )}

        <div className="mb-8">
          {song.lyrics ? (
            <SongLyricsRenderer
              lyrics={song.lyrics}
              showChords={showChords}
              steps={steps}
              fontSize={fontSize}
            />
          ) : (
            <p className="text-[var(--muted)] font-[family-name:var(--font-hanken)]">
              Esta canción no tiene letra disponible.
            </p>
          )}
        </div>

        {song.youtube_url && <SongDetailVideo youtubeUrl={song.youtube_url} />}

        {similarSongs.length > 0 && (
          <SongDetailSimilar songs={similarSongs} categoryName={song.tags?.[0]?.name} />
        )}
      </div>

      <div className="h-[90px]" />
    </div>
  );
}
