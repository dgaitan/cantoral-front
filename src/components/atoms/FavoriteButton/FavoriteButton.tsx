"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/hooks/useAuth";
import { toggleFavorite } from "@/actions/favorites";

interface FavoriteButtonProps {
  songId: string;
  isFavorited: boolean;
  className?: string;
}

export function FavoriteButton({ songId, isFavorited, className }: FavoriteButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  // null = user hasn't interacted yet; prop drives the display
  const [optimisticFavorited, setOptimisticFavorited] = useState<boolean | null>(null);
  const [isPending, setIsPending] = useState(false);
  const favorited = optimisticFavorited !== null ? optimisticFavorited : isFavorited;

  async function handlePress() {
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

  if (isPending) {
    return (
      <Button
        isIconOnly
        variant="outline"
        isDisabled
        aria-label="Cargando"
        className={cn(
          "w-10 h-10 min-w-10 rounded-xl border border-[var(--line)] bg-white text-[var(--ink)]",
          className
        )}
      >
        <Loader2 size={18} className="animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      isIconOnly
      variant="outline"
      onPress={handlePress}
      aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={cn(
        "w-10 h-10 min-w-10 rounded-xl border border-[var(--line)] bg-white",
        favorited ? "text-blue-800" : "text-[var(--ink)]",
        className
      )}
    >
      <Heart size={18} fill={favorited ? "currentColor" : "none"} />
    </Button>
  );
}
