"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Share2, ArrowLeft, Eye, Heart as HeartFill, Play } from "lucide-react";
import { useSongs } from "@/hooks/useSongs";
import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import { KeyBadge } from "@/components/atoms/KeyBadge/KeyBadge";
import { ChordControls } from "@/components/organisms/ChordControls/ChordControls";
import { LyricsRenderer } from "@/components/organisms/LyricsRenderer/LyricsRenderer";
import { SongRow } from "@/components/molecules/SongRow/SongRow";
import { transposeChord } from "@/lib/lyrics/transpose";
import { buildSongParam } from "@/lib/utils/song-param";
import type { Song } from "@/types";

interface Props {
  song: Song;
  presentacionHref: string;
}

export function SongDetailClient({ song, presentacionHref }: Props) {
  const router = useRouter();
  const [steps, setSteps] = useState(0);
  const [showChords, setShowChords] = useState(true);
  const [fontSize, setFontSize] = useState(18);

  const { data: similarData } = useSongs();
  const similarSongs = (similarData?.data?.results ?? []).filter(
    (s) => s.id !== song.id
  ).slice(0, 5);

  const rawLyrics = song.lyrics_with_chords ?? song.lyrics ?? "";
  const baseKey = song.tone ?? "";
  const displayKey = baseKey ? transposeChord(baseKey, steps) : "";
  const categoryName = song.tags?.[0]?.name;
  const authorName = song.authors.map((a) => a.name).join(", ");

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      {/* Top action bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(250,247,241,0.9)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1px solid var(--line)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink)",
            cursor: "pointer",
          }}
          aria-label="Volver"
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "1px solid var(--line)",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink)",
              cursor: "pointer",
            }}
            aria-label="Guardar"
          >
            <Heart size={18} />
          </button>
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "1px solid var(--line)",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink)",
              cursor: "pointer",
            }}
            aria-label="Compartir"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Header: cover + meta */}
        <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
          <div style={{ flexShrink: 0 }}>
            <CoverArt song={song} size={92} radius={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {categoryName && (
              <div
                style={{
                  fontFamily: "var(--font-hanken)",
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--orange)",
                  marginBottom: 4,
                }}
              >
                {categoryName}
              </div>
            )}
            <h1
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: 24,
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.15,
                margin: "0 0 6px",
              }}
            >
              {song.name}
            </h1>
            {authorName && (
              <p
                style={{
                  fontFamily: "var(--font-hanken)",
                  fontSize: 13,
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                {authorName}
              </p>
            )}
          </div>
        </div>

        {/* Meta row: key + views + likes */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {displayKey && <KeyBadge tone={displayKey} />}
          {song.views != null && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "var(--font-hanken)",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              <Eye size={13} />
              {song.views.toLocaleString("es")}
            </span>
          )}
          {song.likes != null && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "var(--font-hanken)",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              <HeartFill size={13} />
              {song.likes.toLocaleString("es")}
            </span>
          )}
        </div>

        {/* Action row */}
        <div
          style={{ display: "flex", gap: 10, marginBottom: 20 }}
        >
          <Link
            href={presentacionHref}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 48,
              borderRadius: 14,
              background: "var(--ink)",
              color: "var(--cream)",
              fontFamily: "var(--font-hanken)",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Proyectar
          </Link>
          <button
            style={{
              flex: 1,
              height: 48,
              borderRadius: 14,
              border: "1.5px solid var(--ink)",
              background: "transparent",
              color: "var(--ink)",
              fontFamily: "var(--font-hanken)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Guardar
          </button>
        </div>

        {/* ChordControls */}
        {rawLyrics && (
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: 18,
              padding: "16px 16px",
              marginBottom: 24,
            }}
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

        {/* Lyrics */}
        {rawLyrics ? (
          <div style={{ marginBottom: 32 }}>
            <LyricsRenderer
              raw={rawLyrics}
              steps={steps}
              showChords={showChords}
              fontSize={fontSize}
            />
          </div>
        ) : (
          <p
            style={{
              fontFamily: "var(--font-hanken)",
              color: "var(--muted)",
              marginBottom: 32,
            }}
          >
            Esta canción no tiene letra disponible.
          </p>
        )}

        {/* YouTube placeholder */}
        {song.youtube_url && (
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "var(--font-hanken)",
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 10,
              }}
            >
              Video
            </div>
            <div
              style={{
                background: "var(--ink)",
                borderRadius: 16,
                aspectRatio: "16/9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--orange)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Play size={24} fill="white" color="white" />
              </div>
            </div>
          </div>
        )}

        {/* Similar songs */}
        {similarSongs.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "var(--font-hanken)",
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 4,
              }}
            >
              {categoryName ? `Más de ${categoryName}` : "Canciones similares"}
            </div>
            {similarSongs.map((s) => (
              <SongRow
                key={s.id}
                song={s}
                href={`/canciones/${buildSongParam(s.id, s.slug)}`}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 90 }} />
    </div>
  );
}
