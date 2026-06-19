"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import type { SongDetailActionsProps } from "@/types/song";

export function SongDetailActions({ presentacionHref }: SongDetailActionsProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-[10px] mb-5 lg:flex-col lg:gap-3">
      <Button
        className="bg-ink text-cream font-semibold"
        fullWidth
        onPress={() => router.push(presentacionHref)}
      >
        Proyectar
      </Button>
      <Button
        data-testid="action-guardar"
        variant="outline"
        fullWidth
      >
        Guardar
      </Button>
    </div>
  );
}
