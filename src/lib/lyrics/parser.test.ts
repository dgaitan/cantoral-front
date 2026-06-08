import { describe, it, expect } from "vitest";
import {
  parseLyrics,
  splitIntoSlides,
  lyricsToPlainText,
  parseLyricsIntoBlocks,
} from "./parser";

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

describe("parseLyricsIntoBlocks", () => {
  it("extracts a named label from the first line of a block", () => {
    const raw = "Estribillo\n{G}Te presentamos\n\n1\n{D}Bendito seas";
    const blocks = parseLyricsIntoBlocks(raw);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]?.label).toBe("Estribillo");
    expect(blocks[1]?.label).toBe("1");
  });

  it("auto-labels blocks without a header as Estrofa N", () => {
    const raw = "{G}Line one\n{D}Line two\n\n{A}Line three";
    const blocks = parseLyricsIntoBlocks(raw);
    expect(blocks[0]?.label).toBe("Estrofa 1");
    expect(blocks[1]?.label).toBe("Estrofa 2");
  });

  it("marks Estribillo and Coro blocks as isChorus", () => {
    const raw = "Estribillo\n{G}chorus line\n\nCoro\n{D}another chorus";
    const blocks = parseLyricsIntoBlocks(raw);
    expect(blocks[0]?.isChorus).toBe(true);
    expect(blocks[1]?.isChorus).toBe(true);
  });

  it("marks non-chorus blocks as isChorus=false", () => {
    const raw = "1\n{G}verse line";
    const blocks = parseLyricsIntoBlocks(raw);
    expect(blocks[0]?.isChorus).toBe(false);
  });

  it("parses content lines into LyricsLine tokens", () => {
    const raw = "Estribillo\n{G}Amazing {C}grace";
    const blocks = parseLyricsIntoBlocks(raw);
    expect(blocks[0]?.lines[0]).toEqual([
      { type: "chord", name: "G" },
      { type: "text", content: "Amazing " },
      { type: "chord", name: "C" },
      { type: "text", content: "grace" },
    ]);
  });

  it("handles numeric labels like '2.' and '3)'", () => {
    const raw = "2.\n{D}line\n\n3)\n{G}line";
    const blocks = parseLyricsIntoBlocks(raw);
    expect(blocks[0]?.label).toBe("2.");
    expect(blocks[1]?.label).toBe("3)");
  });

  it("filters empty blocks", () => {
    const raw = "1\n{G}line\n\n\n\n2\n{D}line";
    const blocks = parseLyricsIntoBlocks(raw);
    expect(blocks).toHaveLength(2);
  });
});
