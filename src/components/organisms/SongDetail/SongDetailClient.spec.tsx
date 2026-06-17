import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SongDetailClient } from "./SongDetailClient";
import type { Song } from "@/types";

vi.mock("@/hooks/useSongs", () => ({
  useSongs: () => ({ data: null }),
}));

const mockSong: Song = {
  id: "1",
  name: "Cristo Vive en Mí",
  slug: "cristo-vive-en-mi",
  short_description: null,
  image: null,
  has_lyrics: true,
  views: null,
  likes: null,
  tone: "Sol",
  created_at: null,
  updated_at: null,
  authors: [],
  tags: [],
  plain_lyrics: null,
  lyrics: {
    lyric: [{ type: "verse", content: "<p>Señor, hoy yo me quiero_ofrendar</p>" }],
    chords: [
      {
        type: "verse",
        content:
          "<p>SOL   DO   SOL   DO</p><p>Señor, hoy yo me quiero_ofrendar</p>",
      },
    ],
  },
  lyrics_with_chords: null,
  youtube_url: null,
  presentation_background_color: null,
  presentation_text_color: null,
  presentation_font_size: null,
  meta_title: null,
  meta_description: null,
  meta_keywords: null,
  is_public: true,
};

describe("Chord Transport — SongDetailClient page-load default", () => {
  it("steps start at zero: key display shows original song tone unchanged", () => {
    render(
      <SongDetailClient song={mockSong} presentacionHref="/canciones/1-cristo-vive-en-mi/presentacion" />
    );
    // At steps=0, transposeKey returns "Sol" unchanged
    expect(screen.getByTestId("current-key")).toHaveTextContent("Sol");
  });

  it("chord content is shown without transposition on first render", () => {
    render(
      <SongDetailClient song={mockSong} presentacionHref="/canciones/1-cristo-vive-en-mi/presentacion" />
    );
    const chordLines = screen.getAllByTestId("chord-line");
    expect(chordLines[0]).toHaveTextContent(/SOL\s+DO\s+SOL\s+DO/);
  });
});
