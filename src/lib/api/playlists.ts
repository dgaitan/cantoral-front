import type {
  DjangoResponse,
  PaginatedResponse,
  Playlist,
  PlaylistSong,
} from "@/types";
import type { CreatePlaylistPayload, UpdatePlaylistPayload } from "@/types/playlist";
import { apiClient } from "./client";

export async function fetchPlaylists(
  page = 1
): Promise<PaginatedResponse<Playlist>> {
  const { data } = await apiClient.get<PaginatedResponse<Playlist>>(
    "/v1/playlists/",
    { params: { page } }
  );
  return data;
}

export async function fetchPlaylist(
  uuid: string
): Promise<DjangoResponse<Playlist>> {
  const { data } = await apiClient.get<DjangoResponse<Playlist>>(
    `/v1/playlists/${uuid}/`
  );
  return data;
}

export async function createPlaylist(
  payload: CreatePlaylistPayload
): Promise<DjangoResponse<Playlist>> {
  const { data } = await apiClient.post<DjangoResponse<Playlist>>(
    "/v1/playlists/",
    payload
  );
  return data;
}

export async function updatePlaylist(
  uuid: string,
  payload: UpdatePlaylistPayload
): Promise<DjangoResponse<Playlist>> {
  const { data } = await apiClient.post<DjangoResponse<Playlist>>(
    `/v1/playlists/${uuid}/`,
    payload
  );
  return data;
}

export async function deletePlaylist(uuid: string): Promise<void> {
  await apiClient.delete(`/v1/playlists/${uuid}/`);
}

export async function fetchPlaylistSongs(
  uuid: string,
  page = 1
): Promise<PaginatedResponse<PlaylistSong>> {
  const { data } = await apiClient.get<PaginatedResponse<PlaylistSong>>(
    `/v1/playlists/${uuid}/songs/`,
    { params: { page } }
  );
  return data;
}

export async function attachSongsToPlaylist(
  uuid: string,
  songIds: number[]
): Promise<DjangoResponse<Record<string, never>>> {
  const { data } = await apiClient.post<DjangoResponse<Record<string, never>>>(
    `/v1/playlists/${uuid}/songs/attach/`,
    { song_ids: songIds }
  );
  return data;
}

export async function reorderPlaylistSongs(
  uuid: string,
  songIds: number[]
): Promise<DjangoResponse<Record<string, never>>> {
  const { data } = await apiClient.post<DjangoResponse<Record<string, never>>>(
    `/v1/playlists/${uuid}/songs/order/`,
    { song_ids: songIds }
  );
  return data;
}

export async function fetchMyPlaylists(
  page = 1
): Promise<PaginatedResponse<Playlist>> {
  const { data } = await apiClient.get<PaginatedResponse<Playlist>>(
    "/v1/profile/playlists/",
    { params: { page } }
  );
  return data;
}
