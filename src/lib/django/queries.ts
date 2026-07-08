import "server-only";
import { djangoFetch } from "./client";
import type {
  Category,
  DjangoResponse,
  PaginatedData,
  PaginatedResponse,
  Playlist,
  PlaylistSong,
  Song,
  SongListItem,
  SongsQuery,
} from "@/types";

/**
 * Server-side Django read functions. Shared by Server Components and the BFF
 * route handlers so there is a single, typed data path to Django.
 */

export async function getSongs(query: SongsQuery = {}): Promise<PaginatedResponse<SongListItem>> {
  // When `limit` is passed, Django returns `data` as a plain array instead of
  // the paginated envelope — normalize here so every consumer can always read
  // `data.results`/`data.count`.
  const raw = await djangoFetch<{
    success: boolean;
    data: PaginatedData<SongListItem> | SongListItem[];
    errors: Record<string, string[]> | null;
    status: number;
  }>("/v1/songs/", { params: query, next: { revalidate: 60 } });

  const data: PaginatedData<SongListItem> = Array.isArray(raw.data)
    ? { results: raw.data, count: raw.data.length, next: null, previous: null }
    : raw.data;
  return { ...raw, data };
}

export function getSong(id: string): Promise<DjangoResponse<Song>> {
  return djangoFetch<DjangoResponse<Song>>(`/v1/songs/${id}/`, {
    optionalAuth: true,
    next: { revalidate: 3600, tags: [`song-${id}`] },
  });
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await djangoFetch<{
      success: boolean;
      data: {
        results: Array<{
          id: number;
          name: string;
          slug: string;
          parent_id: number | null;
          songs_count?: number;
        }>;
      };
    }>("/v1/tags/", { next: { revalidate: 3600 } });

    return (data.data?.results ?? []).map((tag) => ({
      id: String(tag.id),
      name: tag.name,
      slug: tag.slug,
      ...(tag.songs_count != null ? { songs_count: tag.songs_count } : {}),
    }));
  } catch {
    return [];
  }
}

export function getFavorites(query: SongsQuery = {}): Promise<PaginatedResponse<SongListItem>> {
  return djangoFetch<PaginatedResponse<SongListItem>>("/v1/profile/favorites/", {
    params: query,
    auth: true,
  });
}

export function getPlaylists(page = 1, search?: string): Promise<PaginatedResponse<Playlist>> {
  return djangoFetch<PaginatedResponse<Playlist>>("/v1/playlists/", {
    params: { page, search },
    optionalAuth: true,
  });
}

export function getMyPlaylists(page = 1): Promise<PaginatedResponse<Playlist>> {
  return djangoFetch<PaginatedResponse<Playlist>>("/v1/profile/playlists/", {
    params: { page },
    auth: true,
  });
}

export function getPlaylist(uuid: string): Promise<DjangoResponse<Playlist>> {
  return djangoFetch<DjangoResponse<Playlist>>(`/v1/playlists/${uuid}/`, {
    optionalAuth: true,
  });
}

export function getPlaylistSongs(uuid: string, page = 1): Promise<PaginatedResponse<PlaylistSong>> {
  return djangoFetch<PaginatedResponse<PlaylistSong>>(`/v1/playlists/${uuid}/songs/`, {
    params: { page },
    optionalAuth: true,
  });
}
