"use client";

import { cn } from "@/lib/utils/cn";
import {
  isSpanishChordLine,
  transposeSpanishChordLine,
} from "@/lib/lyrics/transpose-spanish";
import type { LyricBlock } from "@/types/song";

interface Props {
  blocks: LyricBlock[]; // pass song.lyric.lyric or song.lyric.chords depending on showChords
  showChords: boolean;
  steps?: number; // semitone offset for transposition
  fontSize?: number; // px — drives line gap via the --lyrics-font-size CSS var
  dark?: boolean;
}

const SECTION_LABEL: Record<LyricBlock["type"], string> = {
  verse: "Estrofa",
  chorus: "Estribillo",
  bridge: "Puente",
};

const BLOCK_BORDER: Record<LyricBlock["type"], string> = {
  verse: "",
  chorus: "pl-3.5 border-l-[3px] border-[var(--gold)]",
  bridge: "pl-3.5 border-l-[3px] border-[var(--gold-soft)]",
};

/** Extract raw line strings from a block's HTML <p>…</p> content (no dangerouslySetInnerHTML). */
function extractLines(content: string): string[] {
  const matches = content.match(/<p>([\s\S]*?)<\/p>/g);
  if (!matches) return [];
  return matches.map((p) => p.replace(/^<p>/, "").replace(/<\/p>$/, ""));
}

export function StructuredLyricsRenderer({
  blocks,
  showChords,
  steps = 0,
  fontSize = 18,
  dark = false,
}: Props) {
  // Verse blocks are numbered 1-indexed; chorus/bridge are not numbered.
  let verseCount = 0;

  return (
    <div
      data-testid="structured-lyrics-renderer"
      className="flex flex-col gap-[18px]"
      style={{ "--lyrics-font-size": `${fontSize}px` } as React.CSSProperties}
    >
      {blocks.map((block, blockIndex) => {
        const lines = extractLines(block.content);
        const label =
          block.type === "verse"
            ? `${SECTION_LABEL.verse} ${++verseCount}`
            : SECTION_LABEL[block.type];

        return (
          <div key={blockIndex} className={cn(BLOCK_BORDER[block.type])}>
            <div
              data-testid={`lyric-block-${block.type}`}
              className={cn(
                "font-[family-name:var(--font-hanken)] text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--muted)] mb-[7px]"
              )}
            >
              {label}
            </div>
            <div className="flex flex-col gap-[calc(var(--lyrics-font-size,18px)*0.42)]">
              {lines.map((line, lineIndex) => {
                const isChord = isSpanishChordLine(line);

                // Defensive guard: when chords are hidden, never render a chord line
                // even if a chord-typed block slipped through from the parent.
                if (isChord && !showChords) return null;

                if (isChord) {
                  const rendered =
                    steps !== 0
                      ? transposeSpanishChordLine(line, steps)
                      : line;
                  return (
                    <div
                      key={lineIndex}
                      data-testid="chord-line"
                      className={cn(
                        "whitespace-pre font-[family-name:var(--font-jetbrains)] text-[0.72em] leading-none",
                        dark ? "text-[var(--gold)]" : "text-[var(--orange)]"
                      )}
                    >
                      {rendered}
                    </div>
                  );
                }

                return (
                  <div
                    key={lineIndex}
                    className={cn(
                      "whitespace-pre font-[family-name:var(--font-hanken)]",
                      dark ? "text-[var(--cream)]" : "text-[var(--ink)]"
                    )}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
