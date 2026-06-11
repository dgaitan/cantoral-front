"use client";

import { cn } from "@/lib/utils/cn";
import { parseLyricsIntoBlocks } from "@/lib/lyrics/parser";
import { transposeChord } from "@/lib/lyrics/transpose";
import type { LyricsToken } from "@/lib/lyrics/parser";

interface LyricsRendererProps {
  lyrics: LyricsItems;
  showChords: boolean;
  fontSize: number;
}

type WordSegment = { chord: string | null; text: string };
type WordGroup = WordSegment[] | " ";

function buildWordGroups(tokens: LyricsToken[]): WordGroup[] {
  const words: WordGroup[] = [];
  let current: WordSegment[] = [];
  let pendingChord: string | null = null;

  for (const token of tokens) {
    if (token.type === "chord") {
      pendingChord = token.name;
      continue;
    }
    const parts = token.content.split(/(\s+)/);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i] ?? "";
      if (part === "") continue;
      if (/^\s+$/.test(part)) {
        if (current.length) {
          words.push(current);
          current = [];
        }
        words.push(" ");
      } else {
        current.push({ chord: i === 0 ? pendingChord : null, text: part });
        pendingChord = null;
      }
    }
  }
  if (current.length) words.push(current);

  return words;
}

interface LineProps {
  tokens: LyricsToken[];
  steps: number;
  showChords: boolean;
  fontSize: number;
  dark: boolean;
}

function LyricsLineView({
  tokens,
  steps,
  showChords,
  fontSize,
  dark,
}: LineProps) {
  const chordColor = dark ? "var(--gold)" : "var(--orange)";
  const textColor = dark ? "var(--cream)" : "var(--ink)";
  const hasChords = tokens.some((t) => t.type === "chord");
  const words = buildWordGroups(tokens);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        rowGap: showChords && hasChords ? fontSize * 0.5 : 0,
      }}
    >
      {words.map((word, wi) =>
        word === " " ? (
          <span key={wi} style={{ width: fontSize * 0.28 }} />
        ) : (
          <span
            key={wi}
            style={{
              display: "inline-flex",
              alignItems: "flex-end",
              whiteSpace: "nowrap",
            }}
          >
            {word.map((seg, si) => (
              <span
                key={si}
                style={{ display: "inline-flex", flexDirection: "column" }}
              >
                {showChords && (
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontWeight: 700,
                      fontSize: fontSize * 0.72,
                      color: chordColor,
                      height: hasChords ? fontSize * 0.95 : 0,
                      lineHeight: 1,
                      whiteSpace: "pre",
                    }}
                  >
                    {seg.chord ? transposeChord(seg.chord, steps) : ""}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: "var(--font-hanken)",
                    fontSize,
                    color: textColor,
                    whiteSpace: "pre",
                  }}
                >
                  {seg.text || "​"}
                </span>
              </span>
            ))}
          </span>
        )
      )}
    </div>
  );
}

interface LyricsItem {
  type: "verse" | "chorus";
  content: string;
}

interface LyricsItems {
  lyric: LyricsItem[];
  chords: LyricsItem[];
}

export function LyricsRenderer({
  lyrics = { lyric: [], chords: [] },
  showChords = true,
  fontSize = 18,
}: LyricsRendererProps) {
  return (
    <div
      className="flex flex-col gap-8"
      data-testid="lyrics-renderer"
    >
      {!showChords && lyrics.lyric.map((item: LyricsItem, i: number) => (
        <div
          key={i}
        >
          <div
            style={{
              fontFamily: "var(--font-hanken)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 7,
            }}
          >
            {item.type === 'verse' ? 'Estribillo' : 'Coro'}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: fontSize,
              gap: fontSize * 0.4,
            }}
            dangerouslySetInnerHTML={{ __html: item.content }}
          >
          </div>
        </div>
      ))}

      {showChords && lyrics.chords.map((item: LyricsItem, i: number) => (
        <div
        key={i}
      >
        <div
          style={{
            fontFamily: "var(--font-hanken)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 7,
          }}
        >
          {item.type === 'verse' ? 'Estribillo' : 'Coro'}
        </div>
        <pre
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: fontSize - 4,
            gap: (fontSize - 4) * 0.4,
            fontFamily: "monospace",
          }}
          dangerouslySetInnerHTML={{ __html: item.content }}
        >
        </pre>
      </div>
      ))}
    </div>
  );
}
