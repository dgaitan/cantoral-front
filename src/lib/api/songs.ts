import type { DjangoResponse, PaginatedResponse, Song, SongListItem, Category } from "@/types";
import { apiClient } from "./client";

export interface SongsQuery {
  page?: number;
  search?: string;
  tag_id?: number;
  author_id?: number;
}

export async function fetchSongs(
  query: SongsQuery = {}
): Promise<PaginatedResponse<SongListItem>> {
  const { data } = await apiClient.get<PaginatedResponse<SongListItem>>(
    "/v1/songs/",
    { params: query }
  );
  return data;
}

export async function fetchSong(id: string): Promise<DjangoResponse<Song>> {
  const { data } = await apiClient.get<DjangoResponse<Song>>(`/v1/songs/${id}/`);
  return data;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data } = await apiClient.get<{
      success: boolean;
      data: { results: Array<{ id: number; name: string; slug: string; parent_id: number | null }> };
    }>("/v1/tags/");
    return (data.data?.results ?? []).map((tag) => ({
      id: String(tag.id),
      name: tag.name,
      slug: tag.slug,
    }));
  } catch {
    return [];
  }
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
