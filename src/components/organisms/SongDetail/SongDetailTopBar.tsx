"use client";

import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton/IconButton";
import { FavoriteButton } from "@/components/atoms/FavoriteButton/FavoriteButton";
import { ShareButton } from "@/components/molecules/ShareButton/ShareButton";
import type { SongDetailTopBarProps } from "@/types/song";

export function SongDetailTopBar({ onBack, songId, songSlug, songTitle, isFavorited }: SongDetailTopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-[14px] sticky top-0 z-20 bg-[rgba(250,247,241,0.9)] backdrop-blur-[10px] border-b border-[var(--line)]">
      <IconButton onPress={onBack} aria-label="Volver">
        <ArrowLeft size={18} />
      </IconButton>
      <div className="flex gap-2">
        <FavoriteButton songId={songId} isFavorited={isFavorited} />
        <ShareButton songId={songId} songSlug={songSlug} songTitle={songTitle} />
      </div>
    </div>
  );
}
