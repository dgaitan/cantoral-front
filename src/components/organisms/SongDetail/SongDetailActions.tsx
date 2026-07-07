"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";
import { toggleFavorite } from "@/actions/favorites";
import type { SongDetailActionsProps } from "@/types/song";

export function SongDetailActions({ presentacionHref, songId, isFavorited }: SongDetailActionsProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  // null = user hasn't interacted yet; prop drives the display
  const [optimisticFavorited, setOptimisticFavorited] = useState<boolean | null>(null);
  const [isPending, setIsPending] = useState(false);
  const favorited = optimisticFavorited !== null ? optimisticFavorited : isFavorited;

  async function handleGuardar() {
    if (!isAuthenticated) {
      router.push("/register");
      return;
    }
    setIsPending(true);
    try {
      const res = await toggleFavorite(songId);
      if (res.ok) setOptimisticFavorited(res.data.is_favorite);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-[10px] mb-5 lg:flex-col lg:gap-3">
      <Button
        variant="secondary"
        className="font-semibold"
        fullWidth
        onPress={() => router.push(presentacionHref)}
      >
        Proyectar
      </Button>
      <Button
        data-testid="action-guardar"
        variant="outline"
        fullWidth
        isDisabled={isPending}
        onPress={handleGuardar}
      >
        {favorited ? "Guardado" : "Guardar"}
      </Button>
    </div>
  );
}
