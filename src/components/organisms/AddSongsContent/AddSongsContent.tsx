"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { Check, Plus } from "lucide-react";
import { Button } from "@heroui/react";
import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { attachSongs } from "@/actions/playlists";
import { useSongs } from "@/hooks/useSongs";
import type { SongListItem } from "@/types/song";

interface AddSongsContentProps {
  playlistUuid: string;
  initialSongIds?: number[];
}

export function AddSongsContent({ playlistUuid, initialSongIds = [] }: AddSongsContentProps) {
  const [search, setSearch] = useState("");
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set(initialSongIds));
  const [pendingId, setPendingId] = useState<number | null>(null);
  const { mutate } = useSWRConfig();

  const { data, isLoading } = useSongs({ search: search || undefined });
  const songs: SongListItem[] = data?.data?.results ?? [];

  async function toggle(song: SongListItem) {
    const id = Number(song.id);
    setPendingId(id);
    try {
      await attachSongs(playlistUuid, [id]);
      setAddedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
      // Invalidate means that it will refetch the playlist songs and the songs will be updated in the UI
      mutate((key) => Array.isArray(key) && key[0] === "playlist-songs" && key[1] === playlistUuid);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        onSearch={setSearch}
        placeholder="Buscar canción o autor..."
      />

      {isLoading && (
        <div className="py-8 text-center text-muted text-[14px]">
          Cargando canciones…
        </div>
      )}

      {!isLoading && songs.length === 0 && (
        <div className="py-8 text-center text-muted text-[14px]">
          No se encontraron canciones
        </div>
      )}

      <div className="flex flex-col divide-y divide-line">
        {songs.map((song) => {
          const id = Number(song.id);
          const isAdded = addedIds.has(id);
          const isPending = pendingId === id;
          const author = song.authors[0]?.name ?? "";
          const tag = song.tags[0]?.name ?? "";

          return (
            <div key={song.id} className="flex items-center gap-3 py-3">
              <CoverArt song={song} size={44} radius={10} />

              <div className="flex-1 min-w-0">
                <p className="text-[14.5px] font-semibold text-ink truncate">{song.name}</p>
                <p className="text-[12px] text-muted truncate">
                  {[author, tag].filter(Boolean).join(" · ")}
                </p>
              </div>

              <Button
                size="sm"
                isDisabled={isPending}
                onPress={() => toggle(song)}
                aria-label={isAdded ? `Quitar ${song.name}` : `Añadir ${song.name}`}
                className={
                  isAdded
                    ? "text-[12.5px] font-semibold bg-paper-2 text-ink min-w-[80px]"
                    : "text-[12.5px] font-semibold bg-ink text-cream min-w-[80px]"
                }
              >
                {isAdded
                  ? <><Check size={13} aria-hidden="true" /> {isPending ? "…" : "Añadida"}</>
                  : <><Plus size={13} aria-hidden="true" /> {isPending ? "…" : "Añadir"}</>
                }
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
