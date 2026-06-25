import type { Song, Playlist, PlaylistSong } from "@/types";
import { lyricsToPlainText } from "@/lib/lyrics/parser";
import { SITE_NAME, SITE_LANG } from "@/lib/seo/site";

/**
 * Serialize a JSON-LD object for inline injection, escaping `<` to prevent the
 * closing-script-tag XSS vector (per the Next.js JSON-LD guide).
 */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildSongJsonLd(song: Song, appUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    name: song.name,
    url: `${appUrl}/canciones/${song.id}-${song.slug}/`,
    inLanguage: SITE_LANG,
    ...(song.image && { image: song.image }),
    ...(song.lyrics_with_chords && {
      text: lyricsToPlainText(song.lyrics_with_chords),
    }),
    ...(song.authors.length > 0 && {
      composer: song.authors.map((a) => ({
        "@type": "Person",
        name: a.name,
      })),
    }),
  };
}

/** Homepage WebSite node — enables the Google sitelinks search box. */
export function buildWebSiteJsonLd(appUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${appUrl}/`,
    inLanguage: SITE_LANG,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${appUrl}/explorar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${appUrl}/`,
    },
  };
}

export function buildCollectionPageJsonLd(args: {
  name: string;
  description: string;
  path: string;
  appUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: args.name,
    description: args.description,
    url: `${args.appUrl}${args.path}`,
    inLanguage: SITE_LANG,
  };
}

export function buildPlaylistJsonLd(
  playlist: Playlist,
  songs: PlaylistSong[],
  appUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    name: playlist.name,
    url: `${appUrl}/listas/${playlist.uuid}`,
    inLanguage: SITE_LANG,
    ...(playlist.description && { description: playlist.description }),
    numTracks: songs.length,
    ...(songs.length > 0 && {
      track: songs.map((s) => ({
        "@type": "MusicRecording",
        name: s.song.name,
        url: `${appUrl}/canciones/${s.song.id}-${s.song.slug}`,
        ...(s.song.authors?.[0] && {
          byArtist: { "@type": "Person", name: s.song.authors[0].name },
        }),
      })),
    }),
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
  appUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${appUrl}${item.path}`,
    })),
  };
}
