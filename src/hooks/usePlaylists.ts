"use client";

import useSWR from "swr";
import { fetchPlaylists } from "@/lib/api/playlists";

export function usePlaylists(page = 1) {
  return useSWR(["playlists", page], () => fetchPlaylists(page), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });
}
