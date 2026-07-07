"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { PaginatedResponse, Playlist } from "@/types";

export function useMyPlaylists(page = 1) {
  return useSWR(
    ["my-playlists", page],
    () => fetcher<PaginatedResponse<Playlist>>(`/api/playlists/mine?page=${page}`),
    { keepPreviousData: true, revalidateOnFocus: false },
  );
}
