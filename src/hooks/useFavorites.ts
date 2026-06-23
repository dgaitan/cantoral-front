"use client";

import useSWR from "swr";
import { fetcher, toQueryString } from "@/lib/api/fetcher";
import type { PaginatedResponse, SongListItem, SongsQuery } from "@/types";

export function useFavorites(query: SongsQuery = {}) {
  return useSWR(
    ["favorites", query],
    () => fetcher<PaginatedResponse<SongListItem>>(`/api/favorites${toQueryString(query)}`),
    { keepPreviousData: true, revalidateOnFocus: false },
  );
}
