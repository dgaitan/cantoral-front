import { transposeChord } from "./transpose";

// Spanish note → standard (C D E F G A B)
const SP_TO_STD: Record<string, string> = {
  DO: "C",
  RE: "D",
  MI: "E",
  FA: "F",
  SOL: "G",
  LA: "A",
  SI: "B",
};
const STD_TO_SP: Record<string, string> = Object.fromEntries(
  Object.entries(SP_TO_STD).map(([k, v]) => [v, k])
);

// Spanish roots, longest-first so SOL matches before SI/SO ambiguity is impossible,
// and so multi-letter roots win over single-letter ones in alternation.
const SP_ROOTS = "SOL|DO|RE|MI|FA|LA|SI";

// One chord token: Spanish root + optional accidental + zero or more modifier suffixes.
// Multi-character modifiers (maj, sus, add, aug, dim) MUST precede their single-character
// prefixes (m) in the alternation, otherwise "m" greedily matches the start of "maj" and
// leaves "aj" unconsumed — which would make a valid chord line read as non-chord text.
const CHORD_TOKEN = new RegExp(
  `\\b(${SP_ROOTS})([#b♭]?)((?:maj|sus[24]?|add\\d*|aug|dim|[mM7°]|\\d|/)*)`,
  "g"
);

/** Normalize a flat glyph (♭) to ASCII "b" so transposeChord understands it. */
function normalizeAccidental(acc: string): string {
  return acc === "♭" ? "b" : acc;
}

/**
 * Convert a Spanish chord token (root + accidental + suffix) to standard notation.
 * Example: "DO#m7" → "C#m7", "SOLb" → "Gb".
 */
function spToStd(root: string, accidental: string, suffix: string): string {
  const stdRoot = SP_TO_STD[root];
  if (stdRoot === undefined) {
    // Unknown root — return the original token untouched.
    return `${root}${accidental}${suffix}`;
  }
  return `${stdRoot}${normalizeAccidental(accidental)}${suffix}`;
}

/**
 * Convert a standard chord (as produced by transposeChord) back to Spanish notation.
 * Example: "G#m7" → "SOL#m7", "Db" → "REb".
 * The root may be one of C D E F G A B with an optional # or b accidental;
 * everything after the root+accidental is the preserved suffix.
 */
function stdToSp(stdChord: string): string {
  const m = stdChord.match(/^([A-G])([#b]?)(.*)$/);
  if (!m) return stdChord;
  const [, root, accidental, suffix] = m;
  const spRoot = STD_TO_SP[root!];
  if (spRoot === undefined) return stdChord;
  return `${spRoot}${accidental}${suffix}`;
}

/**
 * Detect whether a stripped <p> line is a chord line.
 * A chord line consists only of Spanish chord tokens and whitespace.
 * After removing every chord token and all whitespace, the remainder must be empty.
 * An empty / whitespace-only line is NOT a chord line (nothing to align).
 */
export function isSpanishChordLine(line: string): boolean {
  if (line.trim().length === 0) return false;
  const withoutChords = line.replace(CHORD_TOKEN, "");
  return withoutChords.replace(/\s/g, "").length === 0;
}

/**
 * Transpose all Spanish chord tokens in a chord line by `steps` semitones.
 * Preserves surrounding whitespace exactly (the renderer uses whitespace: pre,
 * so column alignment of chords above syllables depends on byte-for-byte spacing).
 * A zero step is a no-op fast path.
 */
export function transposeSpanishChordLine(line: string, steps: number): string {
  if (steps === 0) return line;
  return line.replace(
    CHORD_TOKEN,
    (_match, root: string, accidental: string, suffix: string) => {
      const std = spToStd(root, accidental, suffix);
      const transposed = transposeChord(std, steps);
      return stdToSp(transposed);
    }
  );
}
