import type { MetadataRoute } from "next";
import type { PaginatedData, SongListItem } from "@/types";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const apiUrl = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  const serviceToken = process.env.SITEMAP_SERVICE_TOKEN;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/canciones`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const headers: Record<string, string> = {};
    if (serviceToken) headers.Authorization = `Bearer ${serviceToken}`;

    const res = await fetch(`${apiUrl}/songs/?limit=1000&page=1`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) return staticRoutes;

    const body = (await res.json()) as { data: PaginatedData<SongListItem> };
    const songs = body.data?.results ?? [];

    const songRoutes: MetadataRoute.Sitemap = songs.map((song) => ({
      url: `${appUrl}/canciones/${song.id}-${song.slug}`,
      lastModified: song.updated_at ? new Date(song.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...songRoutes];
  } catch {
    return staticRoutes;
  }
}
