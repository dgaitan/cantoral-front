"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useSongs } from "@/hooks/useSongs";
import { fetcher } from "@/lib/api/fetcher";
import { useAuth } from "@/hooks/useAuth";
import { recordSongView } from "@/actions/songs";
import { Heading } from "@/components/atoms/Heading/Heading";
import { ChordControls } from "@/components/organisms/ChordControls/ChordControls";
import { SongLyricsRenderer } from "@/components/organisms/SongLyricsRenderer/SongLyricsRenderer";
import { transposeKey } from "@/lib/lyrics/transpose-spanish";
import { SongDetailTopBar } from "./SongDetailTopBar";
import { SongDetailHeader } from "./SongDetailHeader";
import { SongDetailMeta } from "./SongDetailMeta";
import { SongDetailActions } from "./SongDetailActions";
import { SongDetailVideo } from "./SongDetailVideo";
import { SongDetailSimilar } from "./SongDetailSimilar";
import { SongDetailBreadcrumb } from "./SongDetailBreadcrumb";
import type { SongDetailProps } from "@/types/song";
import type { DjangoResponse, Song } from "@/types";
import { Container } from "@/components/templates/Grid/Container";

export function SongDetailClient({ song, presentacionHref }: SongDetailProps) {
  const router = useRouter();
  const [steps, setSteps] = useState(0);
  const [showChords, setShowChords] = useState(true);
  const [fontSize, setFontSize] = useState(18);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    void recordSongView(song.id);
  }, [song.id]);

  const { data: freshSongResponse } = useSWR(
    isAuthenticated ? ["song", song.id] : null,
    () => fetcher<DjangoResponse<Song>>(`/api/songs/${song.id}`),
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
  const categoryName = song.tags?.[0]?.name;

  return (
    <div className="bg-[var(--paper)] min-h-screen">
      {/* Mobile-only sticky top bar */}
      <div className="lg:hidden">
        <SongDetailTopBar
          onBack={() => router.back()}
          songId={song.id}
          songSlug={song.slug}
          songTitle={song.name}
          isFavorited={isFavorited}
        />
      </div>

      {/* Single responsive grid:
          mobile  → 1 col, sections stack in natural order
          desktop → [220px | 1fr | 220px] 3-col */}
      <Container className="px-5 pt-5 lg:pt-12 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] lg:gap-8 lg:items-start">

          {/* Col 1 — song info + controls */}
          <div className="lg:sticky lg:top-[84px]">
            <SongDetailHeader song={song} />
            <SongDetailMeta displayKey={displayKey} views={song.views} likes={song.likes} />
            <SongDetailActions
              presentacionHref={presentacionHref}
              songId={song.id}
              isFavorited={isFavorited}
            />

            {hasLyrics && (
              <div
                data-testid="chord-controls"
                className="bg-white border border-[var(--line)] rounded-[18px] p-4 mb-6"
              >
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
          </div>

          {/* Col 2 — lyrics */}
          <div className="min-w-0">
            <Heading as="h2" size="sm" className="hidden lg:block mb-5 mt-0">
              Letra y acordes
            </Heading>

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
          </div>

          {/* Col 3 — similar songs */}
          <div>
            {similarSongs.length > 0 && (
              <SongDetailSimilar songs={similarSongs} categoryName={categoryName} />
            )}
          </div>
        </div>
      </Container>

      <div className="h-[90px] lg:hidden" />
    </div>
  );
}
