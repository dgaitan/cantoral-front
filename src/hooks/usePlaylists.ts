"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { PaginatedResponse, Playlist } from "@/types";

export function usePlaylists(page = 1) {
  return useSWR(
    ["playlists", page],
    () => fetcher<PaginatedResponse<Playlist>>(`/api/playlists?page=${page}`),
    { keepPreviousData: true, revalidateOnFocus: false },
  );
}
