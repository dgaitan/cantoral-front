import type { DjangoResponse, PaginatedResponse, SongListItem } from "@/types";
import { apiClient } from "./client";
import type { SongsQuery } from "./songs";

export async function toggleFavorite(songId: string): Promise<DjangoResponse<{ is_favorite: boolean }>> {
  const { data } = await apiClient.post<DjangoResponse<{ is_favorite: boolean }>>(
    `/v1/songs/${songId}/favorites/`
  );
  return data;
}

export async function fetchFavorites(
  query: SongsQuery = {}
): Promise<PaginatedResponse<SongListItem>> {
  const { data } = await apiClient.get<PaginatedResponse<SongListItem>>(
    "/v1/profile/favorites/",
    { params: query }
  );
  return data;
}
