import Link from "next/link";
import { Eye, Users, ChevronRight } from "lucide-react";
import { PlaylistCoverArt } from "@/components/atoms/PlaylistCoverArt/PlaylistCoverArt";
import { cn } from "@/lib/utils/cn";
import type { Playlist } from "@/types/playlist";

interface PlaylistCardProps {
  playlist: Playlist;
  className?: string;
}

export function PlaylistCard({ playlist, className }: PlaylistCardProps) {
  const { uuid, name, description, is_public, is_collaborative, songs_count } = playlist;

  return (
    <Link
      href={`/listas/${uuid}`}
      className={cn(
        "flex items-center gap-4 p-4 bg-white rounded-2xl border border-line",
        "hover:border-ink/20 transition-colors no-underline",
        className
      )}
    >
      <PlaylistCoverArt name={name} uuid={uuid} size="md" />

      <div className="flex-1 min-w-0">
        <p className="font-serif font-semibold text-[16px] text-ink truncate leading-snug">
          {name}
        </p>

        {description && (
          <p className="text-[12.5px] text-muted truncate mt-0.5">{description}</p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {is_public && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted bg-paper-2 rounded-full px-2.5 py-0.5">
              <Eye size={11} aria-hidden="true" />
              Pública
            </span>
          )}
          {!is_public && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted bg-paper-2 rounded-full px-2.5 py-0.5">
              Privada
            </span>
          )}
          {is_collaborative && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted bg-paper-2 rounded-full px-2.5 py-0.5">
              <Users size={11} aria-hidden="true" />
              Colaborativa
            </span>
          )}
        </div>

        {songs_count != null && (
          <p className="text-[12px] text-muted mt-1">
            {songs_count === 0
              ? "Sin canciones"
              : `${songs_count} canción${songs_count !== 1 ? "es" : ""}`}
          </p>
        )}
      </div>

      <ChevronRight size={18} className="text-muted shrink-0" aria-hidden="true" />
    </Link>
  );
}
