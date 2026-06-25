"use client";

import { X } from "lucide-react";
import {
  Button,
  Modal,
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
  // const state = useOverlayState({ isOpen, onOpenChange });
  const state = useOverlayState();

  return (
    <Modal.Backdrop isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="lg">
        <Modal.Dialog>
          <Modal.Header className="flex items-start justify-between  pt-6 pb-0">
            <div>
              <Modal.Heading className="font-serif text-[20px] font-semibold text-ink">
                Agregar canciones
              </Modal.Heading>
              <p className="text-[13px] text-muted mt-0.5">
                Busca y añade cantos a la lista.
              </p>
            </div>
            <Modal.CloseTrigger
              aria-label="Cerrar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <Button
                isIconOnly
                variant="ghost"
                aria-label="Cerrar"
                className="w-8 h-8 min-w-0 -mt-1"
                onPress={onDone}
              >
                <X size={18} aria-hidden="true" />
              </Button>
            </Modal.CloseTrigger>
          </Modal.Header>
          <Modal.Body className="pt-4 max-h-[60vh] overflow-y-auto">
            <AddSongsContent playlistUuid={playlist.uuid} />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
