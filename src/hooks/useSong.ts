"use client";

import useSWR from "swr";
import { fetchSong } from "@/lib/api/songs";

export function useSong(id: string | null | undefined) {
  return useSWR(id ? ["song", id] : null, () => fetchSong(id!), {
    revalidateOnFocus: false,
  });
}
