import { describe, it, expect } from "vitest";
import {
  isSpanishChordLine,
  transposeSpanishChordLine,
  transposeKey,
} from "./transpose-spanish";

describe("Chord Transport — Spanish notation utilities", () => {
  // ── isSpanishChordLine ───────────────────────────────────────────────────────

  describe("isSpanishChordLine", () => {
    it("detects a pure Spanish chord line", () => {
      expect(
        isSpanishChordLine("     DO            SOL                 RE")
      ).toBe(true);
    });

    it("does not detect a lyric line as a chord line", () => {
      expect(isSpanishChordLine("Señor, hoy yo me quiero_ofrendar")).toBe(
        false
      );
    });

    it("does not detect a mixed chord-and-lyric line as a chord line", () => {
      expect(
        isSpanishChordLine(
          "HOM: Cristo vive / hoy y reina ya_en mi voluntad."
        )
      ).toBe(false);
    });

    it("treats a whitespace-only line as not a chord line", () => {
      expect(isSpanishChordLine("   ")).toBe(false);
    });

    it("treats an empty string as not a chord line", () => {
      expect(isSpanishChordLine("")).toBe(false);
    });
  });

  // ── transposeSpanishChordLine ────────────────────────────────────────────────

  describe("transposeSpanishChordLine", () => {
    it("returns the line unchanged when steps is zero", () => {
      const line = "     DO            SOL                 RE";
      expect(transposeSpanishChordLine(line, 0)).toBe(line);
    });

    it("preserves whitespace exactly when steps is zero", () => {
      const line = "DO    SOL    RE";
      expect(transposeSpanishChordLine(line, 0)).toBe(line);
    });

    it("transposes a Spanish chord line up by one semitone", () => {
      // SOL(G)+1=G#=SOL#  DO(C)+1=C#=DO#
      expect(transposeSpanishChordLine("SOL   DO   SOL   DO", 1)).toBe(
        "SOL#   DO#   SOL#   DO#"
      );
    });

    it("transposes chords with quality suffixes (m) up by two semitones", () => {
      // LAm(Am)+2=B=SIm  MIm(Em)+2=F#=FA#m  RE(D)+2=E=MI
      expect(
        transposeSpanishChordLine("LAm           MIm                RE", 2)
      ).toBe("SIm           FA#m                MI");
    });

    it("wraps around the octave: SOL + 6 semitones = DO#", () => {
      // G(7)+6=13 mod12=1=C#=DO#
      expect(transposeSpanishChordLine("SOL", 6)).toBe("DO#");
    });

    it("transposes down with negative steps: DO - 1 = SI", () => {
      // C(0)-1=11=B=SI
      expect(transposeSpanishChordLine("DO", -1)).toBe("SI");
    });

    it("handles a full chorus chord line", () => {
      // DO(C)+2=D=RE  SOL(G)+2=A=LA  RE(D)+2=E=MI
      const input = "     DO            SOL                 RE";
      const result = transposeSpanishChordLine(input, 2);
      expect(result).toContain("RE");
      expect(result).toContain("LA");
      expect(result).toContain("MI");
    });
  });

  // ── transposeKey ─────────────────────────────────────────────────────────────

  describe("transposeKey", () => {
    it("returns the key unchanged when steps is zero", () => {
      expect(transposeKey("Sol", 0)).toBe("Sol");
      expect(transposeKey("G", 0)).toBe("G");
    });

    it("transposes a Spanish key in title case (Sol + 2 = LA)", () => {
      // "Sol" → uppercase "SOL"=G, G+2=A=LA
      expect(transposeKey("Sol", 2)).toBe("LA");
    });

    it("transposes a Spanish key in all-caps (SOL + 2 = LA)", () => {
      expect(transposeKey("SOL", 2)).toBe("LA");
    });

    it("transposes an English key (G + 2 = A)", () => {
      expect(transposeKey("G", 2)).toBe("A");
    });

    it("returns empty string unchanged", () => {
      expect(transposeKey("", 3)).toBe("");
    });
  });
});
