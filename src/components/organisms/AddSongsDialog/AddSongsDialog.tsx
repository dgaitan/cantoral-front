"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { AddSongsModal } from "@/components/organisms/AddSongsModal/AddSongsModal";
import { AddSongsDrawer } from "@/components/organisms/AddSongsDrawer/AddSongsDrawer";
import type { Playlist } from "@/types/playlist";

interface AddSongsDialogProps {
  playlist: Playlist;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDone?: () => void;
}

export function AddSongsDialog({ playlist, isOpen, onOpenChange, onDone }: AddSongsDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AddSongsDrawer
        playlist={playlist}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onDone={onDone}
      />
    );
  }

  return (
    <AddSongsModal
      playlist={playlist}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onDone={onDone}
    />
  );
}
