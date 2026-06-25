import type { MetadataRoute } from "next";
import type { PaginatedData, SongListItem, Playlist } from "@/types";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const apiUrl = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  const serviceToken = process.env.SITEMAP_SERVICE_TOKEN;
  const headers: Record<string, string> = {};
  if (serviceToken) headers.Authorization = `Bearer ${serviceToken}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/explorar`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${appUrl}/canciones`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${appUrl}/listas`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
  ];

  const [songRoutes, playlistRoutes] = await Promise.all([
    fetchSongRoutes(apiUrl, appUrl, headers),
    fetchPlaylistRoutes(apiUrl, appUrl, headers),
  ]);

  return [...staticRoutes, ...songRoutes, ...playlistRoutes];
}

async function fetchSongRoutes(
  apiUrl: string,
  appUrl: string,
  headers: Record<string, string>
): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${apiUrl}/songs/?limit=1000&page=1`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { data: PaginatedData<SongListItem> };
    return (body.data?.results ?? []).map((song) => ({
      url: `${appUrl}/canciones/${song.id}-${song.slug}`,
      lastModified: song.updated_at ? new Date(song.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}

/** Public lists only. Depends on the endpoint returning public playlists; guarded so a
 * failure (or an auth-scoped endpoint) never breaks the rest of the sitemap. */
async function fetchPlaylistRoutes(
  apiUrl: string,
  appUrl: string,
  headers: Record<string, string>
): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${apiUrl}/playlists/?limit=1000&page=1`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { data: PaginatedData<Playlist> };
    return (body.data?.results ?? [])
      .filter((p) => p.is_public)
      .map((p) => ({
        url: `${appUrl}/listas/${p.uuid}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
  } catch {
    return [];
  }
}
