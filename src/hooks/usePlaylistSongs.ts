"use client";

import useSWR from "swr";
import { fetchPlaylistSongs } from "@/lib/api/playlists";

export function usePlaylistSongs(uuid: string, page = 1) {
  return useSWR(
    uuid ? ["playlist-songs", uuid, page] : null,
    () => fetchPlaylistSongs(uuid, page),
    { revalidateOnFocus: false }
  );
}
