import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LyricsLine } from "./LyricsLine";
import type { LyricsLine as LyricsLineTokens } from "@/lib/lyrics/parser";

const tokensWithChords: LyricsLineTokens = [
  { type: "chord", name: "G" },
  { type: "text", content: "Amazing " },
  { type: "chord", name: "C" },
  { type: "text", content: "grace" },
];

describe("LyricsLine", () => {
  it("renders text and chords when showChords=true", () => {
    render(<LyricsLine tokens={tokensWithChords} showChords={true} />);
    expect(screen.getByLabelText("acorde G")).toBeInTheDocument();
    expect(screen.getByText(/Amazing/)).toBeInTheDocument();
    expect(screen.getByLabelText("acorde C")).toBeInTheDocument();
  });

  it("renders only text when showChords=false", () => {
    render(<LyricsLine tokens={tokensWithChords} showChords={false} />);
    expect(screen.queryByLabelText("acorde G")).not.toBeInTheDocument();
    expect(screen.getByText("Amazing grace")).toBeInTheDocument();
  });
});
