import Link from "next/link";
import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import { buildSongParam } from "@/lib/utils/song-param";
import type { SongListItem } from "@/types";

interface SongCardProps {
  song: SongListItem;
  width?: number;
}

export function SongCard({ song, width }: SongCardProps) {
  const href = `/canciones/${buildSongParam(song.id, song.slug)}`;
  const author = song.authors[0]?.name ?? "";

  return (
    <Link
      href={href}
      data-testid="song-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: 12,
        cursor: "pointer",
        textAlign: "left",
        textDecoration: "none",
        flexShrink: 0,
        width: width ?? undefined,
        boxShadow:
          "0 1px 3px rgba(10,29,43,.08), 0 4px 16px rgba(10,29,43,.06)",
      }}
    >
      <CoverArt song={song} size={width ?? 130} radius={11} showCategory />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-hanken)",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.25,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {song.name}
        </div>
        {author && (
          <div
            style={{
              fontFamily: "var(--font-hanken)",
              fontSize: 12,
              color: "var(--muted)",
              marginTop: 3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {author}
          </div>
        )}
      </div>
    </Link>
  );
}
