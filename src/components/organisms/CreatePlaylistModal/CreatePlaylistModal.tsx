"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Modal,
  useOverlayState,
} from "@heroui/react";
import { CreatePlaylistForm } from "@/components/organisms/CreatePlaylistForm/CreatePlaylistForm";
import type { Playlist } from "@/types/playlist";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (playlist: Playlist) => void;
}

export function CreatePlaylistModal({ isOpen, onOpenChange, onSuccess }: CreatePlaylistModalProps) {
  // const state = useOverlayState({ isOpen, onOpenChange });
  const state = useOverlayState();
  

  function handleSuccess(playlist: Playlist) {
    onOpenChange(false);
    onSuccess?.(playlist);
  }

  return (
    <Modal.Backdrop isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="lg">
        <Modal.Dialog>
          <Modal.Header className="flex items-start justify-between  pt-6 pb-0">
            <div>
              <Modal.Heading className="font-serif text-[22px] font-semibold text-ink">
                Nueva lista
              </Modal.Heading>
              <p className="text-[13px] text-muted mt-0.5">
                Organiza cantos para una celebración o momento.
              </p>
            </div>
            <Modal.CloseTrigger
              aria-label="Cerrar"
              className="-mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <X size={18} aria-hidden="true" />
            </Modal.CloseTrigger>
          </Modal.Header>
          <Modal.Body className="pt-5">
            <CreatePlaylistForm onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
