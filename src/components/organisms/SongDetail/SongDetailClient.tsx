"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSongs } from "@/hooks/useSongs";
import { ChordControls } from "@/components/organisms/ChordControls/ChordControls";
import { LyricsRenderer } from "@/components/organisms/LyricsRenderer/LyricsRenderer";
import { StructuredLyricsRenderer } from "@/components/organisms/StructuredLyricsRenderer/StructuredLyricsRenderer";
import { transposeKey } from "@/lib/lyrics/transpose-spanish";
import { SongDetailTopBar } from "./SongDetailTopBar";
import { SongDetailHeader } from "./SongDetailHeader";
import { SongDetailMeta } from "./SongDetailMeta";
import { SongDetailActions } from "./SongDetailActions";
import { SongDetailVideo } from "./SongDetailVideo";
import { SongDetailSimilar } from "./SongDetailSimilar";
import type { SongDetailProps } from "@/types/song";

function stripFrontmatter(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return raw.replace(/^---[\s\S]*?---\s*\n*/m, "").trim() || null;
}

export function SongDetailClient({ song, presentacionHref }: SongDetailProps) {
  const router = useRouter();
  const [steps, setSteps] = useState(0);
  const [showChords, setShowChords] = useState(true);
  const [fontSize, setFontSize] = useState(18);

  const { data: similarData } = useSongs();
  const similarSongs = (similarData?.data?.results ?? [])
    .filter((s) => s.id !== song.id)
    .slice(0, 5);

  const hasStructured = !!song.lyrics;
  const rawLyricsFallback = stripFrontmatter(song.plain_lyrics ?? song.lyrics_with_chords);
  const hasLyrics = hasStructured || !!rawLyricsFallback;

  const baseKey = song.tone ?? "";
  const displayKey = baseKey ? transposeKey(baseKey, steps) : "";

  return (
    <div className="bg-[var(--paper)] min-h-screen">
      <SongDetailTopBar onBack={() => router.back()} />

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
          {hasStructured ? (
            <StructuredLyricsRenderer
              blocks={showChords ? song.lyrics!.chords : song.lyrics!.lyric}
              showChords={showChords}
              steps={steps}
              fontSize={fontSize}
            />
          ) : rawLyricsFallback ? (
            <LyricsRenderer
              lyrics={song.lyrics}
              showChords={showChords}
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
