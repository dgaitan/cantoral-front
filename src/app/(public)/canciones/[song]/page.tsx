import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LyricsRenderer } from "@/components/organisms/LyricsRenderer/LyricsRenderer";
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
  // Prefer plain_lyrics (v1 API field); fall back to legacy lyrics_with_chords.
  const lyricsRaw = stripFrontmatter(song.plain_lyrics ?? song.lyrics_with_chords);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{song.name}</h1>
            {song.tone && (
              <p className="text-sm text-foreground/50 mt-1">Tono: {song.tone}</p>
            )}
            {song.authors.length > 0 && (
              <p className="text-sm text-foreground/50">
                {song.authors.map((a) => a.name).join(", ")}
              </p>
            )}
          </div>
          <Link
            href={presentacionHref}
            className="shrink-0 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Presentar
          </Link>
        </div>

        {lyricsRaw ? (
          <LyricsRenderer raw={lyricsRaw} showChords={false} />
        ) : (
          <p className="text-foreground/50">Esta canción no tiene letra disponible.</p>
        )}
      </div>
    </>
  );
}
