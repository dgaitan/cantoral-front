export type LyricsToken =
  | { type: "text"; content: string }
  | { type: "chord"; name: string };

export type LyricsLine = LyricsToken[];

export interface LyricsBlock {
  label: string;
  lines: LyricsLine[];
  isChorus: boolean;
}

const SECTION_LABEL_RE =
  /^(estribillo|coro|estrofa|verso|puente|interludio|\d+[.)]?)\s*$/i;

export function parseLyricsIntoBlocks(raw: string): LyricsBlock[] {
  const rawBlocks = raw.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  let estrofaCount = 0;
  return rawBlocks.map((block) => {
    const blockLines = block.split("\n");
    const firstLine = blockLines[0] ?? "";
    const hasLabel =
      !firstLine.includes("{") && SECTION_LABEL_RE.test(firstLine);
    const label = hasLabel
      ? firstLine.trim()
      : `Estrofa ${++estrofaCount}`;
    const contentLines = hasLabel ? blockLines.slice(1) : blockLines;
    return {
      label,
      lines: contentLines.map(parseLine),
      isChorus: /estribillo|coro/i.test(label),
    };
  });
}

export function parseLyrics(raw: string): LyricsLine[] {
  return raw.split("\n").map(parseLine);
}

function parseLine(line: string): LyricsLine {
  const tokens: LyricsToken[] = [];
  // Matches {chord_name} or plain text between chords
  const pattern = /(\{[^}]+\})|([^{]+)/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    if (match[1] !== undefined) {
      tokens.push({ type: "chord", name: match[1].slice(1, -1) });
    } else if (match[2] !== undefined) {
      tokens.push({ type: "text", content: match[2] });
    }
  }

  return tokens;
}

export function splitIntoSlides(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function lyricsToPlainText(raw: string): string {
  return raw
    .replace(/\{[^}]+\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split lyrics into presentation slides (one per stanza), strip chord markers. */
export function lyricsToSlides(
  raw: string,
  options: { withChords?: boolean; transposer?: (chord: string) => string } = {}
): string[] {
  const { withChords = false, transposer } = options;
  return raw
    .split(/\n\s*\n/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return null;
      if (withChords) {
        return trimmed.replace(/\{([^}]+)\}/g, (_, name: string) =>
          `[${transposer ? transposer(name) : name}]`
        );
      }
      return trimmed.replace(/\{[^}]+\}/g, "").replace(/[ \t]+/g, " ").trim();
    })
    .filter(Boolean) as string[];
}
