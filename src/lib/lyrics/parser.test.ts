import { describe, it, expect } from "vitest";
import { parseLyrics, splitIntoSlides, lyricsToPlainText } from "./parser";

describe("parseLyrics", () => {
  it("parses a plain line with no chords", () => {
    const result = parseLyrics("Amazing grace");
    expect(result[0]).toEqual([{ type: "text", content: "Amazing grace" }]);
  });

  it("parses inline chords", () => {
    const result = parseLyrics("{G}Amazing {C}grace");
    expect(result[0]).toEqual([
      { type: "chord", name: "G" },
      { type: "text", content: "Amazing " },
      { type: "chord", name: "C" },
      { type: "text", content: "grace" },
    ]);
  });

  it("handles sharp chords like {C#}", () => {
    const result = parseLyrics("{C#}Sound");
    expect(result[0]?.[0]).toEqual({ type: "chord", name: "C#" });
  });

  it("parses multiple lines", () => {
    const result = parseLyrics("line one\nline two");
    expect(result).toHaveLength(2);
  });

  it("returns empty line tokens for blank lines", () => {
    const result = parseLyrics("line\n\nline");
    expect(result).toHaveLength(3);
    expect(result[1]).toEqual([]);
  });
});

describe("splitIntoSlides", () => {
  it("splits on double newlines", () => {
    const result = splitIntoSlides("verso uno\nlinea\n\nverso dos\nlinea");
    expect(result).toHaveLength(2);
  });

  it("trims whitespace from each slide", () => {
    const result = splitIntoSlides("  verso  \n\n  coro  ");
    expect(result[0]).toBe("verso");
    expect(result[1]).toBe("coro");
  });

  it("filters empty blocks", () => {
    const result = splitIntoSlides("a\n\n\n\nb");
    expect(result).toHaveLength(2);
  });
});

describe("lyricsToPlainText", () => {
  it("strips chord markers", () => {
    expect(lyricsToPlainText("{G}Amazing {C}grace")).toBe("Amazing grace");
  });

  it("collapses extra whitespace", () => {
    expect(lyricsToPlainText("{G}  hello   world  ")).toBe("hello world");
  });
});
