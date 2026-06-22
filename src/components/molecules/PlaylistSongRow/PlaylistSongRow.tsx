import Link from "next/link";
import { GripVertical, X } from "lucide-react";
import { Button } from "@heroui/react";
import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import { KeyBadge } from "@/components/atoms/KeyBadge/KeyBadge";
import { buildSongParam } from "@/lib/utils/song-param";
import { cn } from "@/lib/utils/cn";
import type { SongListItem } from "@/types/song";

interface PlaylistSongRowProps {
  song: SongListItem;
  order: number;
  isDraggable?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  dragHandleRef?: React.Ref<HTMLElement>;
  onRemove?: () => void;
  className?: string;
}

export function PlaylistSongRow({
  song,
  order,
  isDraggable = false,
  dragHandleProps,
  dragHandleRef,
  onRemove,
  className,
}: PlaylistSongRowProps) {
  const author = song.authors[0]?.name ?? "";

  return (
    <div className={cn("flex items-center gap-2 py-3 border-b border-line last:border-0", className)}>
      {isDraggable ? (
        <Button
          ref={dragHandleRef as React.Ref<HTMLButtonElement>}
          {...(dragHandleProps as React.ComponentProps<typeof Button>)}
          isIconOnly
          variant="ghost"
          aria-label="Reordenar canción"
          className="text-muted hover:text-ink cursor-grab active:cursor-grabbing shrink-0 touch-none min-w-0 w-7 h-7"
        >
          <GripVertical size={16} aria-hidden="true" />
        </Button>
      ) : (
        <span className="w-7 shrink-0" />
      )}

      <span className="w-5 text-center text-[12px] font-bold text-muted shrink-0">
        {order}
      </span>

      <CoverArt song={song} size={44} radius={10} />

      <Link
        href={`/canciones/${buildSongParam(song.id, song.slug)}`}
        className="flex-1 min-w-0 no-underline"
      >
        <p className="text-[15px] font-semibold text-ink truncate">{song.name}</p>
        {author && (
          <p className="text-[12.5px] text-muted truncate mt-0.5">{author}</p>
        )}
      </Link>

      {song.tone && <KeyBadge tone={song.tone} />}

      {onRemove && (
        <Button
          isIconOnly
          variant="ghost"
          onPress={onRemove}
          aria-label={`Quitar ${song.name} de la lista`}
          className="text-muted hover:text-ink shrink-0 min-w-0 w-7 h-7"
        >
          <X size={16} aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
