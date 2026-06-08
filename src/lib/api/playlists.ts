import type { DjangoResponse, PaginatedResponse, Playlist } from "@/types";
import { apiClient } from "./client";

export async function fetchPublicPlaylists(
  page = 1
): Promise<PaginatedResponse<Playlist>> {
  const { data } = await apiClient.get<PaginatedResponse<Playlist>>(
    "/playlists/",
    { params: { page, is_public: true } }
  );
  return data;
}

export async function fetchPlaylist(
  id: string
): Promise<DjangoResponse<Playlist>> {
  const { data } = await apiClient.get<DjangoResponse<Playlist>>(
    `/playlists/${id}/`
  );
  return data;
}

export async function fetchMyPlaylists(): Promise<PaginatedResponse<Playlist>> {
  const { data } = await apiClient.get<PaginatedResponse<Playlist>>(
    "/playlists/mine/"
  );
  return data;
}
