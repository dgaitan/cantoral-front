"use client";

import { useState } from "react";
import { parseLyrics } from "@/lib/lyrics/parser";
import { LyricsLine } from "@/components/molecules/LyricsLine/LyricsLine";
import { cn } from "@/lib/utils/cn";

interface LyricsRendererProps {
  raw: string;
  showChords?: boolean;
  fontSize?: number;
  className?: string;
}

export function LyricsRenderer({
  raw,
  showChords = true,
  fontSize,
  className,
}: LyricsRendererProps) {
  const [chordsVisible, setChordsVisible] = useState(showChords);
  const lines = parseLyrics(raw);

  return (
    <div className={cn("space-y-1", className)} data-testid="lyrics-renderer">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setChordsVisible((v) => !v)}
          className="text-xs text-foreground/50 hover:text-foreground transition-colors"
        >
          {chordsVisible ? "Ocultar acordes" : "Mostrar acordes"}
        </button>
      </div>
      <div
        className="font-mono whitespace-pre-wrap leading-relaxed"
        style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
      >
        {lines.map((line, i) => (
          <div key={i} className="min-h-[1.5em]">
            <LyricsLine tokens={line} showChords={chordsVisible} />
          </div>
        ))}
      </div>
    </div>
  );
}
