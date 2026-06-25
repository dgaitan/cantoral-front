"use client";

import { X } from "lucide-react";
import {
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
import { CreatePlaylistForm } from "@/components/organisms/CreatePlaylistForm/CreatePlaylistForm";
import type { Playlist } from "@/types/playlist";

interface CreatePlaylistDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (playlist: Playlist) => void;
}

export function CreatePlaylistDrawer({ isOpen, onOpenChange, onSuccess }: CreatePlaylistDrawerProps) {
  const state = useOverlayState({ isOpen, onOpenChange });

  function handleSuccess(playlist: Playlist) {
    onOpenChange(false);
    onSuccess?.(playlist);
  }

  return (
    <DrawerRoot state={state}>
      <DrawerBackdrop isDismissable />
      <DrawerContent placement="bottom">
        <DrawerDialog>
          <DrawerHandle />
          <DrawerHeader className="flex justify-between pb-0">
            <div>
              <DrawerHeading className="font-serif text-[22px] font-semibold text-ink">
                Nueva lista
              </DrawerHeading>
              <p className="text-[13px] text-muted mt-0.5">
                Organiza cantos para una celebración o momento.
              </p>
            </div>
            <DrawerCloseTrigger
              aria-label="Cerrar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <X size={18} aria-hidden="true" />
            </DrawerCloseTrigger>
          </DrawerHeader>
          <DrawerBody className="pb-8 pt-5">
            <CreatePlaylistForm onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
          </DrawerBody>
        </DrawerDialog>
      </DrawerContent>
    </DrawerRoot>
  );
}
