import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SongLyricsRenderer } from "./SongLyricsRenderer";
import type { SongLyric } from "@/types/song";

// Chord block: SOL/DO chord line above a lyric line (transposable).
const mockLyrics: SongLyric = {
  chords: [
    {
      type: "verse",
      content:
        "<p>SOL   DO   SOL   DO</p><p>Señor,   hoy yo me quiero_ofrendar</p>",
    },
  ],
  lyric: [
    {
      type: "verse",
      content: "<p>Señor,   hoy yo me quiero_ofrendar</p>",
    },
  ],
};

describe("SongLyricsRenderer", () => {
  // ── Chord rendering ──────────────────────────────────────────────────────────

  it("renders chord lines as-is when steps is zero", () => {
    render(<SongLyricsRenderer lyrics={mockLyrics} showChords steps={0} />);
    const chordLines = screen.getAllByTestId("chord-line");
    expect(chordLines[0]).toHaveTextContent(/SOL\s+DO\s+SOL\s+DO/);
  });

  it("transposes chord lines when steps is non-zero", () => {
    render(<SongLyricsRenderer lyrics={mockLyrics} showChords steps={2} />);
    const chordLines = screen.getAllByTestId("chord-line");
    // SOL(G)+2=A=LA, DO(C)+2=D=RE
    expect(chordLines[0]).toHaveTextContent(/LA\s+RE\s+LA\s+RE/);
    expect(chordLines[0]).not.toHaveTextContent("SOL");
  });

  it("hides chord lines when showChords is false (uses lyric-only blocks)", () => {
    render(
      <SongLyricsRenderer lyrics={mockLyrics} showChords={false} steps={0} />
    );
    expect(screen.queryAllByTestId("chord-line")).toHaveLength(0);
  });

  // ── Section labels ───────────────────────────────────────────────────────────

  it("shows 'Estrofa 1' label for the first verse block", () => {
    render(<SongLyricsRenderer lyrics={mockLyrics} showChords steps={0} />);
    expect(screen.getByText("Estrofa 1")).toBeInTheDocument();
  });

  it("shows 'Estribillo' label for chorus blocks", () => {
    const chorusLyrics: SongLyric = {
      chords: [{ type: "chorus", content: "<p>Cristo vive en mí</p>" }],
      lyric: [{ type: "chorus", content: "<p>Cristo vive en mí</p>" }],
    };
    render(<SongLyricsRenderer lyrics={chorusLyrics} showChords steps={0} />);
    expect(screen.getByText("Estribillo")).toBeInTheDocument();
  });

  it("shows 'Puente' label for bridge blocks", () => {
    const bridgeLyrics: SongLyric = {
      chords: [{ type: "bridge", content: "<p>Cristo está vivo en mí</p>" }],
      lyric: [{ type: "bridge", content: "<p>Cristo está vivo en mí</p>" }],
    };
    render(<SongLyricsRenderer lyrics={bridgeLyrics} showChords steps={0} />);
    expect(screen.getByText("Puente")).toBeInTheDocument();
  });

  it("numbers multiple verse blocks sequentially", () => {
    const multiVerseLyrics: SongLyric = {
      chords: [
        { type: "verse", content: "<p>Primera estrofa</p>" },
        { type: "verse", content: "<p>Segunda estrofa</p>" },
      ],
      lyric: [
        { type: "verse", content: "<p>Primera estrofa</p>" },
        { type: "verse", content: "<p>Segunda estrofa</p>" },
      ],
    };
    render(
      <SongLyricsRenderer lyrics={multiVerseLyrics} showChords steps={0} />
    );
    expect(screen.getByText("Estrofa 1")).toBeInTheDocument();
    expect(screen.getByText("Estrofa 2")).toBeInTheDocument();
  });
});
