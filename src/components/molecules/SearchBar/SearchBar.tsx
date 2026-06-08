"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar canciones…",
  className,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-xl border border-default-200 bg-content1 px-4 py-2",
        "text-sm placeholder:text-foreground/40 outline-none",
        "focus:border-primary transition-colors",
        className
      )}
      aria-label="Buscar canciones"
    />
  );
}
