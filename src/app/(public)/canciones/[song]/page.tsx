import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SongDetailClient } from "@/components/organisms/SongDetail/SongDetailClient";
import { parseSongParam, buildSongParam } from "@/lib/utils/song-param";
import { lyricsToPlainText } from "@/lib/lyrics/parser";
import { buildSongJsonLd } from "@/lib/utils/seo";
import type { DjangoResponse, Song } from "@/types";

export const revalidate = 3600;

interface Props {
  params: Promise<{ song: string }>;
}

async function getSong(id: string): Promise<Song | null> {
  const apiUrl = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/v1/songs/${id}/`, { next: { revalidate: 3600, tags: [`song-${id}`] } });
    if (!res.ok) return null;
    const body: DjangoResponse<Song> = await res.json();
    return body.success ? (body.data as Song) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { song: param } = await params;
  const { id } = parseSongParam(param);
  const song = await getSong(id);

  if (!song) return { title: "Canción no encontrada" };

  const plainLyrics = stripFrontmatter(song.plain_lyrics ?? song.lyrics_with_chords);
  const description =
    song.meta_description ??
    (plainLyrics ? lyricsToPlainText(plainLyrics).slice(0, 160) : "");

  return {
    title: song.meta_title ?? song.name,
    description,
    openGraph: {
      title: song.name,
      description,
      images: song.image ? [{ url: song.image }] : [],
    },
    alternates: {
      canonical: `/canciones/${buildSongParam(song.id, song.slug)}`,
    },
  };
}

/** Strip YAML frontmatter (---...---) that the backend prepends to plain_lyrics. */
function stripFrontmatter(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;
  return raw.replace(/^---[\s\S]*?---\s*\n*/m, "").trim() || null;
}

export default async function SongPage({ params }: Props) {
  const { song: param } = await params;
  const { id } = parseSongParam(param);
  const song = await getSong(id);

  if (!song) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const jsonLd = buildSongJsonLd(song, appUrl);
  const presentacionHref = `/canciones/${buildSongParam(song.id, song.slug)}/presentacion`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SongDetailClient song={song} presentacionHref={presentacionHref} />
    </>
  );
}
