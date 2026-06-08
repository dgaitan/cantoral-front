"use client";

import useSWR from "swr";
import { fetchSongs, type SongsQuery } from "@/lib/api/songs";

export function useSongs(query: SongsQuery = {}) {
  return useSWR(["songs", query], () => fetchSongs(query), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });
}
