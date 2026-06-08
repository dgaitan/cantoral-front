import { Chord } from "@/components/atoms/Chord/Chord";
import type { LyricsLine as LyricsLineTokens } from "@/lib/lyrics/parser";

interface LyricsLineProps {
  tokens: LyricsLineTokens;
  showChords: boolean;
}

export function LyricsLine({ tokens, showChords }: LyricsLineProps) {
  if (!showChords) {
    const text = tokens
      .filter((t) => t.type === "text")
      .map((t) => (t.type === "text" ? t.content : ""))
      .join("");
    return <span>{text}</span>;
  }

  return (
    <span className="inline-flex flex-wrap items-end leading-loose">
      {tokens.map((token, i) =>
        token.type === "chord" ? (
          <Chord key={i} name={token.name} />
        ) : (
          <span key={i}>{token.content}</span>
        )
      )}
    </span>
  );
}
