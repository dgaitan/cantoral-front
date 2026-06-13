"use client";

import { cn } from "@/lib/utils/cn";
import { useFitScale } from "@/hooks/useFitScale";

interface LyricsItem {
  type: "verse" | "chorus";
  content: string;
}

interface LyricsItems {
  lyric: LyricsItem[];
  chords: LyricsItem[];
}

interface LyricsRendererProps {
  lyrics: LyricsItems;
  showChords: boolean;
  fontSize: number;
}

interface ChordBlocksProps {
  chords: LyricsItem[];
  fontSize: number;
}

function SectionLabel({ type }: { type: LyricsItem["type"] }) {
  return (
    <div className="font-[var(--font-hanken)] text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--muted)] mb-[7px]">
      {type === "verse" ? "Estribillo" : "Coro"}
    </div>
  );
}

function ChordBlocks({ chords, fontSize }: ChordBlocksProps) {
  const { containerRef, contentRef, scale, naturalHeight } = useFitScale({
    deps: [fontSize, chords],
  });

  const measured = naturalHeight > 0;

  return (
    <div
      ref={containerRef}
      className="overflow-hidden relative"
      style={measured ? { height: naturalHeight * scale } : undefined}
    >
      <div
        ref={contentRef}
        className={cn("w-fit top-0 left-0 origin-top-left", measured ? "absolute" : "relative")}
        style={{ transform: `scale(${scale})` }}
      >
        <div className="flex flex-col gap-8">
          {chords.map((item, i) => (
            <div key={i}>
              <SectionLabel type={item.type} />
              <div
                className="flex flex-col whitespace-pre font-mono"
                style={{ fontSize: fontSize - 4, gap: (fontSize - 4) * 0.4 }}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LyricsRenderer({
  lyrics = { lyric: [], chords: [] },
  showChords = true,
  fontSize = 18,
}: LyricsRendererProps) {
  return (
    <div className="flex flex-col gap-8" data-testid="lyrics-renderer">
      {!showChords &&
        lyrics.lyric.map((item, i) => (
          <div key={i}>
            <SectionLabel type={item.type} />
            <div
              className="flex flex-col"
              style={{ fontSize, gap: fontSize * 0.4 }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        ))}

      {showChords && <ChordBlocks chords={lyrics.chords} fontSize={fontSize} />}
    </div>
  );
}
