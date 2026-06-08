const SHARP: readonly string[] = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];
const FLAT: readonly string[] = [
  "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
];
const FLAT_TO_IDX: Record<string, number> = {
  Db: 1, Eb: 3, Gb: 6, Ab: 8, Bb: 10, Cb: 11, Fb: 4,
};

function noteIndex(note: string): number {
  if (note in FLAT_TO_IDX) return FLAT_TO_IDX[note]!;
  const i = SHARP.indexOf(note);
  return i >= 0 ? i : -1;
}

export function transposeChord(
  chord: string,
  steps: number,
  preferFlat = false
): string {
  if (!chord) return chord;
  return chord
    .split("/")
    .map((part) => {
      const m = part.match(/^([A-G][#b]?)(.*)$/);
      if (!m) return part;
      const idx = noteIndex(m[1]!);
      if (idx < 0) return part;
      const ni = (((idx + steps) % 12) + 12) % 12;
      const root = preferFlat ? FLAT[ni]! : SHARP[ni]!;
      return root + m[2]!;
    })
    .join("/");
}
