"use client";

import useSWR from "swr";
import { fetcher, toQueryString } from "@/lib/api/fetcher";
import type { PaginatedResponse, SongListItem, SongsQuery } from "@/types";

export function useSongs(query: SongsQuery | null = {}) {
  return useSWR(
    query ? ["songs", query] : null,
    () => fetcher<PaginatedResponse<SongListItem>>(`/api/songs${toQueryString(query!)}`),
    { keepPreviousData: true, revalidateOnFocus: false },
  );
}
