import Link from "next/link";
import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import { KeyBadge } from "@/components/atoms/KeyBadge/KeyBadge";
import type { SongListItem } from "@/types/song";

interface SongRowProps {
  song: SongListItem;
  index?: number;
  href: string;
}

export function SongRow({ song, index, href }: SongRowProps) {
  const author = song.authors[0]?.name ?? "";

  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
        width: "100%",
        textAlign: "left",
        padding: "9px 0",
        textDecoration: "none",
      }}
      data-testid="song-row"
    >
      {index != null && (
        <span
          style={{
            width: 18,
            textAlign: "center",
            fontFamily: "var(--font-hanken)",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--muted)",
            flexShrink: 0,
          }}
        >
          {index}
        </span>
      )}
      <CoverArt song={song} size={52} radius={12} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-hanken)",
            fontSize: 15.5,
            fontWeight: 600,
            color: "var(--ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {song.name}
        </div>
        {author && (
          <div
            style={{
              fontFamily: "var(--font-hanken)",
              fontSize: 13,
              color: "var(--muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: 2,
            }}
          >
            {author}
          </div>
        )}
      </div>
      {song.tone && <KeyBadge tone={song.tone} />}
    </Link>
  );
}
