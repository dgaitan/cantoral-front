import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StructuredLyricsRenderer } from "./StructuredLyricsRenderer";
import type { LyricBlock } from "@/types/song";

// Block with one chord line followed by one lyric line.
// Chord line: "SOL   DO   SOL   DO" — transposed by 2: "LA   RE   LA   RE"
const verseBlock: LyricBlock = {
  type: "verse",
  content:
    "<p>SOL   DO   SOL   DO</p><p>Señor,   hoy yo me quiero_ofrendar</p>",
};

describe("Chord Transport — StructuredLyricsRenderer", () => {
  // ── Chord rendering ──────────────────────────────────────────────────────────

  it("renders chord lines as-is when steps is zero", () => {
    render(
      <StructuredLyricsRenderer blocks={[verseBlock]} showChords steps={0} />
    );
    const chordLines = screen.getAllByTestId("chord-line");
    expect(chordLines[0]).toHaveTextContent(/SOL\s+DO\s+SOL\s+DO/);
  });

  it("transposes chord lines when steps is non-zero", () => {
    render(
      <StructuredLyricsRenderer blocks={[verseBlock]} showChords steps={2} />
    );
    const chordLines = screen.getAllByTestId("chord-line");
    // SOL(G)+2=A=LA, DO(C)+2=D=RE
    expect(chordLines[0]).toHaveTextContent(/LA\s+RE\s+LA\s+RE/);
    expect(chordLines[0]).not.toHaveTextContent("SOL");
  });

  it("hides all chord lines when showChords is false", () => {
    render(
      <StructuredLyricsRenderer
        blocks={[verseBlock]}
        showChords={false}
        steps={0}
      />
    );
    expect(screen.queryAllByTestId("chord-line")).toHaveLength(0);
  });

  // ── Section labels ───────────────────────────────────────────────────────────

  it("shows 'Estrofa 1' label for the first verse block", () => {
    render(
      <StructuredLyricsRenderer blocks={[verseBlock]} showChords steps={0} />
    );
    expect(screen.getByText("Estrofa 1")).toBeInTheDocument();
  });

  it("shows 'Estribillo' label for chorus blocks", () => {
    const chorusBlock: LyricBlock = {
      type: "chorus",
      content: "<p>Cristo vive en mí</p>",
    };
    render(
      <StructuredLyricsRenderer blocks={[chorusBlock]} showChords steps={0} />
    );
    expect(screen.getByText("Estribillo")).toBeInTheDocument();
  });

  it("shows 'Puente' label for bridge blocks", () => {
    const bridgeBlock: LyricBlock = {
      type: "bridge",
      content: "<p>Cristo está vivo en mí</p>",
    };
    render(
      <StructuredLyricsRenderer blocks={[bridgeBlock]} showChords steps={0} />
    );
    expect(screen.getByText("Puente")).toBeInTheDocument();
  });

  it("numbers multiple verse blocks sequentially", () => {
    const blocks: LyricBlock[] = [
      { type: "verse", content: "<p>Primera estrofa</p>" },
      { type: "verse", content: "<p>Segunda estrofa</p>" },
    ];
    render(
      <StructuredLyricsRenderer blocks={blocks} showChords steps={0} />
    );
    expect(screen.getByText("Estrofa 1")).toBeInTheDocument();
    expect(screen.getByText("Estrofa 2")).toBeInTheDocument();
  });
});
