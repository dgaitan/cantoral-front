"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { PaginatedResponse, Playlist } from "@/types";

export function usePlaylists(page = 1, search = "") {
  return useSWR(
    ["playlists", page, search],
    () => {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);
      return fetcher<PaginatedResponse<Playlist>>(`/api/playlists?${params}`);
    },
    { keepPreviousData: true, revalidateOnFocus: false },
  );
}
