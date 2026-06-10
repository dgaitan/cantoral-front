"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { useSongs } from "@/hooks/useSongs";
import { LiturgyMoments, SectionHead, SongCard, SongRow } from "@/components/molecules";
import { buildSongParam } from "@/lib/utils/song-param";

export function HomeSections() {
  const { data: categories = [] } = useCategories();
  const { data: songsData } = useSongs();
  const songs = songsData?.data?.results ?? [];
  const rail = songs.slice(0, 6);
  const recientes = songs.slice(0, 5);

  return (
    <>
      {categories.length > 0 && <LiturgyMoments categories={categories} />}

      {rail.length > 0 && (
        <div className="pt-[18px] pb-2">
          <div className="px-5">
            <SectionHead
              kicker="Para tu liturgia"
              title="Más buscadas"
              action="Ver todo"
              actionHref="/explorar"
            />
          </div>
          <div className="flex gap-[14px] overflow-x-auto px-5 pt-0.5 pb-2 [scrollbar-width:none]">
            {rail.map((song) => (
              <SongCard key={song.id} song={song} width={150} />
            ))}
          </div>
        </div>
      )}

      {recientes.length > 0 && (
        <div className="px-5 pt-[14px]">
          <SectionHead kicker="Catálogo" title="Recién agregadas" />
          {recientes.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i + 1}
              href={`/canciones/${buildSongParam(song.id, song.slug)}`}
            />
          ))}
        </div>
      )}

      {songs.length === 0 && (
        <div className="px-5 py-10 text-center">
          <p className="font-sans text-muted mb-4">Explora el catálogo de canciones</p>
          <Link
            href="/explorar"
            className="inline-block bg-orange text-white font-semibold rounded-[13px] px-5 py-3 no-underline"
          >
            Ver canciones
          </Link>
        </div>
      )}
    </>
  );
}
