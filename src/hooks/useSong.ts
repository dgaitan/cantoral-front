"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { DjangoResponse, Song } from "@/types";

export function useSong(id: string | null | undefined) {
  return useSWR(
    id ? ["song", id] : null,
    () => fetcher<DjangoResponse<Song>>(`/api/songs/${id}`),
    { revalidateOnFocus: false },
  );
}
