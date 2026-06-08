"use client";

import { use, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { PresentationLayout } from "@/components/templates/PresentationLayout/PresentationLayout";
import { parseSongParam, buildSongParam } from "@/lib/utils/song-param";
import { lyricsToSlides } from "@/lib/lyrics/parser";
import { transposeChord } from "@/lib/lyrics/transpose";
import { useSong } from "@/hooks/useSong";

const RevealPresentation = dynamic(
  () =>
    import(
      "@/components/organisms/RevealPresentation/RevealPresentation"
    ).then((m) => ({ default: m.RevealPresentation })),
  { ssr: false }
);

interface Props {
  params: Promise<{ song: string }>;
}

export default function PresentacionPage({ params }: Props) {
  const { song: param } = use(params);
  const router = useRouter();
  const { id } = parseSongParam(param);
  const { data, isLoading } = useSong(id);

  const [steps, setSteps] = useState(0);
  const [showChords, setShowChords] = useState(false);
  const [fontSize, setFontSize] = useState(28);

  const song = data?.data ?? null;

  const slides = useMemo(() => {
    if (!song) return [];
    const raw = song.lyrics_with_chords ?? song.lyrics ?? "";
    return lyricsToSlides(raw, {
      withChords: showChords,
      transposer: steps !== 0 ? (c) => transposeChord(c, steps) : undefined,
    });
  }, [song, showChords, steps]);

  const detailHref = song
    ? `/canciones/${buildSongParam(song.id, song.slug)}`
    : "/explorar";

  const displayKey = song?.tone ? transposeChord(song.tone, steps) : null;
  const categoryName = song?.categories[0]?.name;

  if (isLoading) {
    return (
      <PresentationLayout>
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#fff",
            fontFamily: "var(--font-hanken)",
          }}
        >
          Cargando…
        </div>
      </PresentationLayout>
    );
  }

  if (!song) {
    return (
      <PresentationLayout>
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#fff",
            fontFamily: "var(--font-hanken)",
          }}
        >
          Canción no encontrada.
        </div>
      </PresentationLayout>
    );
  }

  return (
    <PresentationLayout>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Header overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
            pointerEvents: "none",
          }}
        >
          <div>
            {categoryName && (
              <div
                style={{
                  fontFamily: "var(--font-hanken)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: 2,
                }}
              >
                {categoryName}
              </div>
            )}
            <div
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: 18,
                fontWeight: 500,
                color: "var(--cream)",
              }}
            >
              {song.name}
            </div>
          </div>
          <Link
            href={detailHref}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              pointerEvents: "auto",
            }}
            aria-label="Cerrar presentación"
          >
            <X size={16} />
          </Link>
        </div>

        {/* Reveal.js */}
        <RevealPresentation
          slides={slides}
          bgColor={song.presentation_background_color ?? undefined}
          textColor={song.presentation_text_color ?? undefined}
          fontSize={fontSize}
        />

        {/* Dock controls */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(10,29,43,0.88)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: 18,
            padding: "8px 12px",
            border: "1px solid rgba(243,234,214,0.12)",
          }}
        >
          {/* Font size */}
          <DockBtn
            onClick={() => setFontSize((f) => Math.max(16, f - 2))}
            label="A−"
            small
          />
          <DockBtn
            onClick={() => setFontSize((f) => Math.min(60, f + 2))}
            label="A+"
          />

          <div
            style={{
              width: 1,
              height: 24,
              background: "rgba(255,255,255,0.15)",
              margin: "0 4px",
            }}
          />

          {/* Tone */}
          <DockBtn
            onClick={() => setSteps((s) => s - 1)}
            label="−"
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--gold)",
              minWidth: 28,
              textAlign: "center",
            }}
          >
            {displayKey ?? "—"}
          </span>
          <DockBtn
            onClick={() => setSteps((s) => s + 1)}
            label="+"
          />

          <div
            style={{
              width: 1,
              height: 24,
              background: "rgba(255,255,255,0.15)",
              margin: "0 4px",
            }}
          />

          {/* Chord toggle */}
          <button
            onClick={() => setShowChords((v) => !v)}
            aria-pressed={showChords}
            style={{
              height: 34,
              padding: "0 12px",
              borderRadius: 10,
              border: "none",
              background: showChords ? "var(--gold)" : "rgba(255,255,255,0.1)",
              color: showChords ? "var(--ink)" : "rgba(255,255,255,0.7)",
              fontFamily: "var(--font-hanken)",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              letterSpacing: "0.05em",
              transition: "background 0.15s",
            }}
          >
            Acordes
          </button>
        </div>
      </div>
    </PresentationLayout>
  );
}

interface DockBtnProps {
  onClick: () => void;
  label: string;
  small?: boolean;
}

function DockBtn({ onClick, label, small }: DockBtnProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        border: "none",
        background: "rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.85)",
        fontFamily: small ? "var(--font-hanken)" : "var(--font-jetbrains)",
        fontWeight: 700,
        fontSize: small ? 11 : 14,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label}
    </button>
  );
}
