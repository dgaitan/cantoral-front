"use client";

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
    <div
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        scrollbarWidth: "none",
        paddingBottom: 2,
      }}
    >
      {chips.map((c) => {
        const active = activeId === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id as string | "all")}
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 14px",
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: "var(--font-hanken)",
              fontSize: 13.5,
              fontWeight: 600,
              whiteSpace: "nowrap",
              border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
              background: active ? "var(--ink)" : "#fff",
              color: active ? "#fff" : "var(--ink)",
              transition: "all 0.15s ease",
            }}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
