"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { CreatePlaylistModal } from "@/components/organisms/CreatePlaylistModal/CreatePlaylistModal";
import { CreatePlaylistDrawer } from "@/components/organisms/CreatePlaylistDrawer/CreatePlaylistDrawer";
import type { Playlist } from "@/types/playlist";

interface PlaylistDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (playlist: Playlist) => void;
}

export function PlaylistDialog({ isOpen, onOpenChange, onSuccess }: PlaylistDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <CreatePlaylistDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <CreatePlaylistModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}
