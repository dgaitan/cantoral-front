"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { PresentationLayout } from "@/components/templates/PresentationLayout/PresentationLayout";
import { parseSongParam, buildSongParam } from "@/lib/utils/song-param";
import type { SongPresentationSlide } from "@/types/song";
import { SongPresentation } from "@/components/organisms/SongPresentation/SongPresentation";
import { useSong } from "@/hooks/useSong";

interface Props {
  params: Promise<{ song: string }>;
}

export default function PresentacionPage({ params }: Props) {
  const { song: param } = use(params);
  const { id } = parseSongParam(param);
  const { data, isLoading } = useSong(id);

  const song = data?.data ?? null;

  const slides = useMemo((): SongPresentationSlide[] => {
    if (!song) return [];

    const titleSlide: SongPresentationSlide = {
      label: null,
      content: null,
      song,
      type: "presentation",
    };

    const standardSlides: SongPresentationSlide[] = song.lyrics?.lyric?.map((block) => ({
      label: block.type === "chorus" ? "Estribillo" : undefined,
      content: block.content,
      song,
      type: "standard",
    })) ?? [];

    return [titleSlide, ...standardSlides];
  }, [song]);

  const detailHref = song
    ? `/canciones/${buildSongParam(song.id, song.slug)}`
    : "/explorar";

  const categoryName = song?.tags?.[0]?.name;

  if (isLoading) {
    return (
      <PresentationLayout>
        <div className="flex h-full items-center justify-center bg-black text-white font-hanken">
          Cargando…
        </div>
      </PresentationLayout>
    );
  }

  if (!song) {
    return (
      <PresentationLayout>
        <div className="flex h-full items-center justify-center bg-black text-white font-hanken">
          Canción no encontrada.
        </div>
      </PresentationLayout>
    );
  }

  return (
    <PresentationLayout>
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <div>
            {categoryName && (
              <div className="font-hanken text-11px font-bold tracking-0.16em uppercase text-gold">
                {categoryName}
              </div>
            )}
            <div className="font-newsreader text-18px font-medium text-cream">
              {song.name}
            </div>
          </div>
          <Link
            href={detailHref}
            className="w-9 h-9 rounded-full bg-white/12 border border-white/20 flex items-center justify-center text-white pointer-events-auto"
            aria-label="Cerrar presentación"
          >
            <X size={16} />
          </Link>
        </div>

        <SongPresentation
          slides={slides}
          bgColor={song.presentation_background_color ?? "#202020"}
          textColor={song.presentation_text_color ?? "#ffffff"}
          fontSize={song.presentation_font_size ?? 22}
        />
      </div>
    </PresentationLayout>
  );
}

