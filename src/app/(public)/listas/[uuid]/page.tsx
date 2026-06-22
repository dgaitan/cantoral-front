import { notFound } from "next/navigation";
import { fetchPlaylist, fetchPlaylistSongs } from "@/lib/api/playlists";
import { PlaylistDetail } from "@/components/organisms/PlaylistDetail/PlaylistDetail";

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function PlaylistDetailPage({ params }: PageProps) {
  const { uuid } = await params;

  const [playlistRes, songsRes] = await Promise.all([
    fetchPlaylist(uuid).catch(() => null),
    fetchPlaylistSongs(uuid).catch(() => null),
  ]);

  if (!playlistRes?.success || !playlistRes.data) {
    notFound();
  }

  const songs = songsRes?.data?.results ?? [];

  return (
    <PlaylistDetail
      playlist={playlistRes.data}
      initialSongs={songs}
    />
  );
}
