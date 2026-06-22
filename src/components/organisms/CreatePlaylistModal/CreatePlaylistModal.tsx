"use client";

import { X } from "lucide-react";
import {
  ModalRoot,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalCloseTrigger,
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
  const state = useOverlayState({ isOpen, onOpenChange });

  function handleSuccess(playlist: Playlist) {
    onOpenChange(false);
    onSuccess?.(playlist);
  }

  return (
    <ModalRoot state={state}>
      <ModalBackdrop isDismissable />
      <ModalContainer size="lg">
        <ModalDialog>
          <ModalHeader className="flex items-start justify-between px-6 pt-6 pb-0">
            <div>
              <ModalHeading className="font-serif text-[22px] font-semibold text-ink">
                Nueva lista
              </ModalHeading>
              <p className="text-[13px] text-muted mt-0.5">
                Organiza cantos para una celebración o momento.
              </p>
            </div>
            <ModalCloseTrigger
              aria-label="Cerrar"
              className="-mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <X size={18} aria-hidden="true" />
            </ModalCloseTrigger>
          </ModalHeader>
          <ModalBody className="px-6 pb-6 pt-5">
            <CreatePlaylistForm onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
          </ModalBody>
        </ModalDialog>
      </ModalContainer>
    </ModalRoot>
  );
}
