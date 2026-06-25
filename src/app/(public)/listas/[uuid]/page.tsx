import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlaylist, getPlaylistSongs } from "@/lib/django/queries";
import { PlaylistDetail } from "@/components/organisms/PlaylistDetail/PlaylistDetail";
import {
  buildPlaylistJsonLd,
  buildBreadcrumbJsonLd,
  jsonLdHtml,
} from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/seo/site";

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uuid } = await params;
  const res = await getPlaylist(uuid).catch(() => null);
  const playlist = res?.success ? res.data : null;

  if (!playlist) {
    return { title: "Lista no encontrada", robots: { index: false, follow: false } };
  }

  // Private lists must not be indexed.
  if (!playlist.is_public) {
    return { title: playlist.name, robots: { index: false, follow: false } };
  }

  const description =
    playlist.description ??
    `${playlist.name} — lista de cantos católicos para tu liturgia.`;

  return {
    title: playlist.name,
    description,
    alternates: { canonical: `/listas/${uuid}` },
    openGraph: {
      title: playlist.name,
      description,
      url: `/listas/${uuid}`,
    },
  };
}

export default async function PlaylistDetailPage({ params }: PageProps) {
  const { uuid } = await params;

  const [playlistRes, songsRes] = await Promise.all([
    getPlaylist(uuid).catch(() => null),
    getPlaylistSongs(uuid).catch(() => null),
  ]);

  if (!playlistRes?.success || !playlistRes.data) {
    notFound();
  }

  const playlist = playlistRes.data;
  const songs = songsRes?.data?.results ?? [];

  // Structured data only for publicly-indexable lists.
  const jsonLd = playlist.is_public
    ? [
        buildPlaylistJsonLd(playlist, songs, SITE_URL),
        buildBreadcrumbJsonLd(
          [
            { name: "Inicio", path: "/" },
            { name: "Listas", path: "/listas" },
            { name: playlist.name, path: `/listas/${uuid}` },
          ],
          SITE_URL
        ),
      ]
    : [];

  return (
    <>
      {jsonLd.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }}
        />
      ))}
      <PlaylistDetail playlist={playlist} initialSongs={songs} />
    </>
  );
}
