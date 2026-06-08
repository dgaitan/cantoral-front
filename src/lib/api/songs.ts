import type { DjangoResponse, PaginatedResponse, Song, SongListItem } from "@/types";
import { apiClient } from "./client";

export interface SongsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export async function fetchSongs(
  query: SongsQuery = {}
): Promise<PaginatedResponse<SongListItem>> {
  const { data } = await apiClient.get<PaginatedResponse<SongListItem>>(
    "/songs/",
    { params: query }
  );
  return data;
}

export async function fetchSong(id: string): Promise<DjangoResponse<Song>> {
  const { data } = await apiClient.get<DjangoResponse<Song>>(`/songs/${id}/`);
  return data;
}

export async function transposeSong(
  id: string,
  interval: "semi_tone" | "tone",
  direction: "up" | "down"
): Promise<DjangoResponse<Song>> {
  const { data } = await apiClient.post<DjangoResponse<Song>>(
    `/songs/${id}/transport/`,
    { interval, direction }
  );
  return data;
}
