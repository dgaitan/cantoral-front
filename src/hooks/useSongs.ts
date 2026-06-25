"use client";

import useSWR from "swr";
import { fetcher, toQueryString } from "@/lib/api/fetcher";
import type { PaginatedResponse, SongListItem, SongsQuery } from "@/types";

export function useSongs(query: SongsQuery = {}) {
  return useSWR(
    ["songs", query],
    () => fetcher<PaginatedResponse<SongListItem>>(`/api/songs${toQueryString(query)}`),
    { keepPreviousData: true, revalidateOnFocus: false },
  );
}
