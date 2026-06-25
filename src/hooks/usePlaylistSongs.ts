"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { PaginatedResponse, PlaylistSong } from "@/types";

export function usePlaylistSongs(uuid: string, initialSongs?: PlaylistSong[], page = 1) {
  const fallbackData: PaginatedResponse<PlaylistSong> | undefined = initialSongs
    ? {
        data: { results: initialSongs, count: initialSongs.length, next: null, previous: null },
        errors: null,
        success: true,
        status: 200,
      }
    : undefined;

  return useSWR(
    uuid ? ["playlist-songs", uuid, page] : null,
    () => fetcher<PaginatedResponse<PlaylistSong>>(`/api/playlists/${uuid}/songs?page=${page}`),
    { revalidateOnFocus: false, fallbackData },
  );
}
