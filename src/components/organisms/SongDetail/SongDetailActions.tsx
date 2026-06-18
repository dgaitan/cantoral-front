import Link from "next/link";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils/cn";
import type { SongDetailActionsProps } from "@/types/song";

export function SongDetailActions({ presentacionHref }: SongDetailActionsProps) {
  return (
    <div className="flex gap-[10px] mb-5">
      <Link
        href={presentacionHref}
        className={cn(
          "flex-1 flex items-center justify-center h-12 rounded-[14px] no-underline",
          "bg-[var(--ink)] text-[var(--cream)]",
          "font-[family-name:var(--font-hanken)] text-sm font-semibold"
        )}
      >
        Proyectar
      </Link>
      <Button
        data-testid="action-guardar"
        variant="outline"
        className={cn(
          "flex-1 h-12 rounded-[14px]",
          "border-[1.5px] border-[var(--ink)] text-[var(--ink)]",
          "font-[family-name:var(--font-hanken)] text-sm font-semibold"
        )}
      >
        Guardar
      </Button>
    </div>
  );
}
