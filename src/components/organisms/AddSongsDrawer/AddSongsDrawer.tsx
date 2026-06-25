"use client";

import { X } from "lucide-react";
import {
  Button,
  DrawerRoot,
  DrawerBackdrop,
  DrawerContent,
  DrawerDialog,
  DrawerHeader,
  DrawerHeading,
  DrawerBody,
  DrawerHandle,
  DrawerCloseTrigger,
  useOverlayState,
} from "@heroui/react";
import { AddSongsContent } from "@/components/organisms/AddSongsContent/AddSongsContent";
import type { Playlist } from "@/types/playlist";

interface AddSongsDrawerProps {
  playlist: Playlist;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDone?: () => void;
}

export function AddSongsDrawer({ playlist, isOpen, onOpenChange, onDone }: AddSongsDrawerProps) {
  const state = useOverlayState({ isOpen, onOpenChange });

  return (
    <DrawerRoot state={state}>
      <DrawerBackdrop isDismissable />
      <DrawerContent placement="bottom">
        <DrawerDialog>
          <DrawerHandle />
          <DrawerHeader className="flex items-center justify-between px-5 pt-4 pb-0">
            <div>
              <DrawerHeading className="font-serif text-[20px] font-semibold text-ink">
                Agregar canciones
              </DrawerHeading>
              <p className="text-[13px] text-muted mt-0.5">
                Busca y añade cantos a la lista.
              </p>
            </div>
            <DrawerCloseTrigger>
              <Button
                isIconOnly
                variant="ghost"
                aria-label="Cerrar"
                className="w-8 h-8 min-w-0"
                onPress={onDone}
              >
                <X size={18} aria-hidden="true" />
              </Button>
            </DrawerCloseTrigger>
          </DrawerHeader>
          <DrawerBody className="px-5 pb-10 pt-4 overflow-y-auto">
            <AddSongsContent playlistUuid={playlist.uuid} />
          </DrawerBody>
        </DrawerDialog>
      </DrawerContent>
    </DrawerRoot>
  );
}
