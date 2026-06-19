"use client";

import useSWR from "swr";
import { fetchFavorites } from "@/lib/api/favorites";
import type { SongsQuery } from "@/lib/api/songs";

export function useFavorites(query: SongsQuery = {}) {
  return useSWR(["favorites", query], () => fetchFavorites(query), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });
}
