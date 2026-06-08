import { SongCard } from "@/components/molecules/SongCard/SongCard";
import { cn } from "@/lib/utils/cn";
import type { SongListItem } from "@/types";

interface SongListProps {
  songs: SongListItem[];
  loading?: boolean;
  error?: string;
  className?: string;
}

export function SongList({ songs, loading, error, className }: SongListProps) {
  if (error) {
    return (
      <p className="text-center text-danger py-8">
        Error al cargar canciones: {error}
      </p>
    );
  }

  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-default-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <p className="text-center text-foreground/50 py-8">
        No se encontraron canciones.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {songs.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );
}
