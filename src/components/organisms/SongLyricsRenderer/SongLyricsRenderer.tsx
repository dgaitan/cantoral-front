"use client";

import { cn } from "@/lib/utils/cn";
import { useFitScale } from "@/hooks/useFitScale";
import {
  isSpanishChordLine,
  transposeSpanishChordLine,
} from "@/lib/lyrics/transpose-spanish";
import type { LyricBlock, SongLyricsRendererProps } from "@/types/song";

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

function extractLines(content: string): string[] {
  const matches = content.match(/<p>([\s\S]*?)<\/p>/g);
  if (!matches) return [];
  return matches.map((p) => p.replace(/^<p>/, "").replace(/<\/p>$/, ""));
}

export function SongLyricsRenderer({
  lyrics,
  showChords,
  steps = 0,
  fontSize = 18,
  dark = false,
}: SongLyricsRendererProps) {
  const blocks = showChords ? lyrics.chords : lyrics.lyric;

  const { containerRef, contentRef, scale, naturalHeight } = useFitScale({
    deps: [fontSize, blocks, showChords, steps],
  });

  const measured = showChords && naturalHeight > 0;

  let verseCount = 0;

  const inner = (
    <div
      data-testid="song-lyrics-renderer"
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
              className="font-[family-name:var(--font-hanken)] text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--muted)] mb-[7px]"
            >
              {label}
            </div>
            <div className="flex flex-col gap-[calc(var(--lyrics-font-size,18px)*0.42)]">
              {lines.map((line, lineIndex) => {
                const isChord = isSpanishChordLine(line);

                if (isChord && !showChords) return null;

                if (isChord) {
                  const rendered =
                    steps !== 0 ? transposeSpanishChordLine(line, steps) : line;
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

  if (!showChords) return inner;

  return (
    <div
      ref={containerRef}
      className="overflow-hidden relative"
      style={measured ? { height: naturalHeight * scale } : undefined}
    >
      <div
        ref={contentRef}
        className={cn(
          "w-fit top-0 left-0 origin-top-left",
          measured ? "absolute" : "relative"
        )}
        style={{ transform: `scale(${scale})` }}
      >
        {inner}
      </div>
    </div>
  );
}
