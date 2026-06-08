import type { Song } from "@/types";
import { lyricsToPlainText } from "@/lib/lyrics/parser";

export function buildSongJsonLd(song: Song, appUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    name: song.name,
    url: `${appUrl}/canciones/${song.id}-${song.slug}/`,
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
