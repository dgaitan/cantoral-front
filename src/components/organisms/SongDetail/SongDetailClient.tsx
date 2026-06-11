"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Heart, Share2, ArrowLeft, Eye, Heart as HeartFill, Play, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSongs } from "@/hooks/useSongs";
import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import { IconButton } from "@/components/atoms/IconButton/IconButton";
import { SectionHead } from "@/components/molecules/SectionHead/SectionHead";
import { ChordControls } from "@/components/organisms/ChordControls/ChordControls";
import { LyricsRenderer } from "@/components/organisms/LyricsRenderer/LyricsRenderer";
import { StructuredLyricsRenderer } from "@/components/organisms/StructuredLyricsRenderer/StructuredLyricsRenderer";
import { SongRow } from "@/components/molecules/SongRow/SongRow";
import { transposeChord } from "@/lib/lyrics/transpose";
import { buildSongParam } from "@/lib/utils/song-param";
import type { Song } from "@/types";

interface Props {
  song: Song;
  presentacionHref: string;
}

interface MetaStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetaStat({ icon, label, value }: MetaStatProps) {
  return (
    <div className="flex flex-col gap-[3px]">
      <span className="flex items-center gap-[5px] font-[family-name:var(--font-hanken)] text-[11px] font-semibold tracking-[0.10em] uppercase text-[var(--muted)]">
        {icon}
        {label}
      </span>
      <span className="font-[family-name:var(--font-newsreader)] text-[18px] font-semibold text-[var(--ink)]">
        {value}
      </span>
    </div>
  );
}

function stripFrontmatter(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return raw.replace(/^---[\s\S]*?---\s*\n*/m, "").trim() || null;
}

export function SongDetailClient({ song, presentacionHref }: Props) {
  const router = useRouter();
  const [steps, setSteps] = useState(0);
  const [showChords, setShowChords] = useState(true);
  const [fontSize, setFontSize] = useState(18);

  const { data: similarData } = useSongs();
  const similarSongs = (similarData?.data?.results ?? [])
    .filter((s) => s.id !== song.id)
    .slice(0, 5);

  const hasStructured = !!song.lyric;
  const rawLyricsFallback = stripFrontmatter(song.plain_lyrics ?? song.lyrics_with_chords);
  const hasLyrics = hasStructured || !!rawLyricsFallback;

  const baseKey = song.tone ?? "";
  const displayKey = baseKey ? transposeChord(baseKey, steps) : "";
  const categoryName = song.tags?.[0]?.name;
  const authorName = song.authors.map((a) => a.name).join(", ");

  const viewsValue =
    song.views == null
      ? null
      : song.views >= 1000
        ? `${(song.views / 1000).toFixed(1)}k`
        : song.views.toLocaleString("es");

  return (
    <div className="bg-[var(--paper)] min-h-screen">

      {/* Top action bar */}
      <div className="flex items-center justify-between px-4 py-[14px] sticky top-0 z-20 bg-[rgba(250,247,241,0.9)] backdrop-blur-[10px] border-b border-[var(--line)]">
        <IconButton onPress={() => router.back()} aria-label="Volver">
          <ArrowLeft size={18} />
        </IconButton>
        <div className="flex gap-2">
          <IconButton aria-label="Guardar">
            <Heart size={18} />
          </IconButton>
          <IconButton aria-label="Compartir">
            <Share2 size={18} />
          </IconButton>
        </div>
      </div>

      <div className="px-5 pt-5">

        {/* Song header: cover art + title block */}
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
              <p data-testid="song-author" className="font-[family-name:var(--font-hanken)] text-[13px] text-[var(--muted)] m-0">
                {authorName}
              </p>
            )}
          </div>
        </div>

        {/* Meta stats: tono · vistas · me gusta */}
        <div className="flex gap-[18px] pb-4">
          {displayKey && <MetaStat icon={<KeyRound size={15} />} label="Tono" value={displayKey} />}
          {viewsValue && <MetaStat icon={<Eye size={15} />} label="Vistas" value={viewsValue} />}
          {song.likes != null && (
            <MetaStat icon={<HeartFill size={15} />} label="Me gusta" value={song.likes.toLocaleString("es")} />
          )}
        </div>

        {/* Primary actions */}
        <div className="flex gap-[10px] mb-5">
          <Link
            href={presentacionHref}
            className={cn(
              "flex-1 flex items-center justify-center h-12 rounded-[14px] no-underline",
              "bg-[var(--ink)] text-[var(--cream)]",
              "font-[family-name:var(--font-hanken)] text-sm font-semibold"
            )}
          >
            Proyectar
          </Link>
          <Button
            data-testid="action-guardar"
            variant="outline"
            className={cn(
              "flex-1 h-12 rounded-[14px]",
              "border-[1.5px] border-[var(--ink)] text-[var(--ink)]",
              "font-[family-name:var(--font-hanken)] text-sm font-semibold"
            )}
          >
            Guardar
          </Button>
        </div>

        {/* Chord controls */}
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

        {/* Lyrics */}
        <div className="mb-8">
          {hasStructured ? (
            <StructuredLyricsRenderer
              blocks={showChords ? song.lyric!.chords : song.lyric!.lyric}
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

        {/* Video */}
        {song.youtube_url && (
          <div data-testid="video-section" className="mb-8">
            <SectionHead kicker="Video" title="Escuchar" />
            <div className="bg-[var(--ink)] rounded-2xl aspect-video flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[var(--orange)] flex items-center justify-center">
                <Play size={24} fill="white" color="white" />
              </div>
            </div>
          </div>
        )}

        {/* Similar songs */}
        {similarSongs.length > 0 && (
          <div data-testid="similar-songs" className="mb-8">
            <SectionHead
              kicker="También te puede gustar"
              title={categoryName ? `Más de ${categoryName}` : "Canciones similares"}
            />
            {similarSongs.map((s) => (
              <SongRow key={s.id} song={s} href={`/canciones/${buildSongParam(s.id, s.slug)}`} />
            ))}
          </div>
        )}

      </div>

      <div className="h-[90px]" />
    </div>
  );
}
