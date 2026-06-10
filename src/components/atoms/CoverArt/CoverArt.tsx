import type { SongListItem } from "@/types/song";

const ART_THEMES = [
  { bg: "#0a1d2b", ink: "#f3ead6", mark: "var(--gold)" },
  { bg: "#13344a", ink: "#f3ead6", mark: "var(--orange)" },
  { bg: "#0e2636", ink: "#f3ead6", mark: "var(--gold)" },
] as const;

const LEADING_ARTICLE = /^(el|la|los|las|un|una)\s+/i;

interface CoverArtProps {
  song: SongListItem;
  size?: number;
  radius?: number;
  showCategory?: boolean;
}

export function CoverArt({
  song,
  size = 56,
  radius = 14,
  showCategory = false,
}: CoverArtProps) {
  const theme = ART_THEMES[(parseInt(song.id, 10) || 0) % ART_THEMES.length]!;
  const initial = song.name
    .replace(LEADING_ARTICLE, "")
    .charAt(0)
    .toUpperCase();
  const categoryName = song.tags?.[0]?.name ?? "";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: theme.bg,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.5,
        }}
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="118"
          r="78"
          fill="none"
          stroke={theme.mark}
          strokeWidth="1"
          opacity="0.4"
        />
        <circle
          cx="50"
          cy="118"
          r="58"
          fill="none"
          stroke={theme.mark}
          strokeWidth="1"
          opacity="0.25"
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-newsreader)",
          fontWeight: 600,
          color: theme.ink,
          fontSize: size * 0.46,
          position: "relative",
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        {initial}
      </span>
      {showCategory && categoryName && (
        <span
          style={{
            position: "absolute",
            bottom: 6,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "var(--font-hanken)",
            fontSize: 8.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: theme.mark,
            fontWeight: 700,
          }}
          aria-hidden="true"
        >
          {categoryName}
        </span>
      )}
    </div>
  );
}
