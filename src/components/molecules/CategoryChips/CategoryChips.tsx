"use client";

import { Button } from "@heroui/react";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/song";

interface CategoryChipsProps {
  categories: Category[];
  activeId: string | "all";
  onChange: (id: string | "all") => void;
}

export function CategoryChips({
  categories,
  activeId,
  onChange,
}: CategoryChipsProps) {
  const chips = [{ id: "all", name: "Todas" }, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {chips.map((c) => {
        const active = activeId === c.id;
        return (
          <Button
            key={c.id}
            size="sm"
            variant="ghost"
            onPress={() => onChange(c.id as string | "all")}
            className={cn(
              "shrink-0 rounded-full text-[13.5px] font-semibold px-3.5 border transition-all duration-150",
              active
                ? "bg-ink text-white border-ink hover:bg-ink/90"
                : "bg-white text-ink border-line hover:bg-paper-2"
            )}
          >
            {c.name}
          </Button>
        );
      })}
    </div>
  );
}
