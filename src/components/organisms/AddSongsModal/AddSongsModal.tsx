"use client";

import { X } from "lucide-react";
import {
  Button,
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
import { AddSongsContent } from "@/components/organisms/AddSongsContent/AddSongsContent";
import type { Playlist } from "@/types/playlist";

interface AddSongsModalProps {
  playlist: Playlist;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDone?: () => void;
}

export function AddSongsModal({ playlist, isOpen, onOpenChange, onDone }: AddSongsModalProps) {
  const state = useOverlayState({ isOpen, onOpenChange });

  return (
    <ModalRoot state={state}>
      <ModalBackdrop isDismissable />
      <ModalContainer size="lg">
        <ModalDialog>
          <ModalHeader className="flex items-start justify-between px-6 pt-6 pb-0">
            <div>
              <ModalHeading className="font-serif text-[20px] font-semibold text-ink">
                Agregar canciones
              </ModalHeading>
              <p className="text-[13px] text-muted mt-0.5">
                Busca y añade cantos a la lista.
              </p>
            </div>
            <ModalCloseTrigger>
              <Button
                isIconOnly
                variant="ghost"
                aria-label="Cerrar"
                className="w-8 h-8 min-w-0 -mt-1"
                onPress={onDone}
              >
                <X size={18} aria-hidden="true" />
              </Button>
            </ModalCloseTrigger>
          </ModalHeader>
          <ModalBody className="px-6 pb-6 pt-4 max-h-[60vh] overflow-y-auto">
            <AddSongsContent playlistUuid={playlist.uuid} />
          </ModalBody>
        </ModalDialog>
      </ModalContainer>
    </ModalRoot>
  );
}
