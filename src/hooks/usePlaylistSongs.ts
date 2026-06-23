"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { PaginatedResponse, PlaylistSong } from "@/types";

export function usePlaylistSongs(uuid: string, page = 1) {
  return useSWR(
    uuid ? ["playlist-songs", uuid, page] : null,
    () => fetcher<PaginatedResponse<PlaylistSong>>(`/api/playlists/${uuid}/songs?page=${page}`),
    { revalidateOnFocus: false },
  );
}
