"use client";

import dynamic from "next/dynamic";
import { use } from "react";
import { PresentationLayout } from "@/components/templates/PresentationLayout/PresentationLayout";
import { parseSongParam } from "@/lib/utils/song-param";
import { splitIntoSlides, lyricsToPlainText } from "@/lib/lyrics/parser";
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
  const { id } = parseSongParam(param);
  const { data, isLoading } = useSong(id);

  const song = data?.data ?? null;

  if (isLoading) {
    return (
      <PresentationLayout>
        <div className="flex h-full items-center justify-center bg-black text-white">
          Cargando…
        </div>
      </PresentationLayout>
    );
  }

  if (!song) {
    return (
      <PresentationLayout>
        <div className="flex h-full items-center justify-center bg-black text-white">
          Canción no encontrada.
        </div>
      </PresentationLayout>
    );
  }

  const raw = song.lyrics_with_chords ?? song.lyrics ?? "";
  const slides = splitIntoSlides(lyricsToPlainText(raw));

  return (
    <PresentationLayout>
      <RevealPresentation
        slides={slides}
        bgColor={song.presentation_background_color ?? undefined}
        textColor={song.presentation_text_color ?? undefined}
        fontSize={song.presentation_font_size ?? undefined}
      />
    </PresentationLayout>
  );
}
