import { describe, it, expect } from "vitest";
import { transposeChord } from "./transpose";

describe("transposeChord", () => {
  it("transposes a natural note up by steps", () => {
    expect(transposeChord("C", 2)).toBe("D");
    expect(transposeChord("G", 5)).toBe("C");
  });

  it("transposes a sharp note", () => {
    expect(transposeChord("C#", 1)).toBe("D");
    expect(transposeChord("F#", 2)).toBe("G#");
  });

  it("wraps around the octave", () => {
    expect(transposeChord("B", 1)).toBe("C");
    expect(transposeChord("A#", 2)).toBe("C");
  });

  it("transposes down (negative steps)", () => {
    expect(transposeChord("D", -2)).toBe("C");
    expect(transposeChord("C", -1)).toBe("B");
  });

  it("preserves chord suffix (m, 7, sus4, maj7)", () => {
    expect(transposeChord("Am", 3)).toBe("Cm");
    expect(transposeChord("G7", 1)).toBe("G#7");
    expect(transposeChord("Dsus4", 2)).toBe("Esus4");
    expect(transposeChord("Fmaj7", 4)).toBe("Amaj7");
  });

  it("handles slash chords", () => {
    expect(transposeChord("D/F#", 3)).toBe("F/A");
    expect(transposeChord("C/E", 2)).toBe("D/F#");
  });

  it("uses flats when preferFlat is true", () => {
    expect(transposeChord("C", 1, true)).toBe("Db");
    expect(transposeChord("A", 1, true)).toBe("Bb");
  });

  it("returns the chord unchanged when steps is 0", () => {
    expect(transposeChord("Em7", 0)).toBe("Em7");
  });

  it("returns empty string unchanged", () => {
    expect(transposeChord("", 3)).toBe("");
  });

  it("handles flat note input (Bb, Eb)", () => {
    expect(transposeChord("Bb", 2)).toBe("C");
    expect(transposeChord("Eb", 1)).toBe("E");
  });
});
