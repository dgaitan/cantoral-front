"use client";

import Link from "next/link";
import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import { KeyBadge } from "@/components/atoms/KeyBadge/KeyBadge";
import { useSongs } from "@/hooks/useSongs";
import { buildSongParam } from "@/lib/utils/song-param";

export function HomeHeroFeatured() {
  const { data } = useSongs();
  const songs = (data?.data?.results ?? []).slice(0, 3);

  if (songs.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {songs.map((song) => {
        const category = song.tags?.[0]?.name;
        const author = song.authors[0]?.name ?? "";
        const href = `/canciones/${buildSongParam(song.id, song.slug)}`;

        return (
          <Link
            key={song.id}
            href={href}
            className="flex items-center gap-3 bg-white/[0.07] rounded-[16px] px-4 py-[14px] no-underline hover:bg-white/[0.12] transition-colors"
          >
            <CoverArt song={song} size={52} radius={12} />
            <div className="flex-1 min-w-0">
              {category && (
                <p className="font-sans text-[10.5px] font-bold tracking-[0.14em] uppercase text-orange mb-0.5 m-0">
                  {category}
                </p>
              )}
              <p className="font-serif text-[15px] font-semibold text-cream truncate m-0">
                {song.name}
              </p>
              {author && (
                <p className="font-sans text-[12.5px] text-cream/50 truncate mt-0.5 m-0">
                  {author}
                </p>
              )}
            </div>
            {song.tone && <KeyBadge tone={song.tone} />}
          </Link>
        );
      })}
    </div>
  );
}
