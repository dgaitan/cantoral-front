"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  glass?: boolean;
  onFocus?: () => void;
  readOnly?: boolean;
  defaultValue?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar canción, autor…",
  glass = false,
  onFocus,
  readOnly = false,
  defaultValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const debounced = useDebounce(value, 300);
  const isMounted = useRef(false);

  // Skip the initial mount call — only fire onSearch when the user actually types
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    onSearch?.(debounced);
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-[14px] px-[15px] py-3",
        glass
          ? "bg-white/10 border border-[rgba(243,234,214,0.18)] backdrop-blur-sm"
          : "bg-white border border-line shadow-[0_1px_2px_rgba(10,29,43,0.04)]"
      )}
    >
      <Search
        size={20}
        aria-hidden="true"
        className={cn("shrink-0", glass ? "text-gold" : "text-muted")}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onFocus={onFocus}
        readOnly={readOnly}
        aria-label="Buscar canciones"
        className={cn(
          "flex-1 min-w-0 bg-transparent border-none outline-none text-[15px]",
          glass
            ? "text-[rgba(243,234,214,0.7)] placeholder:text-[rgba(243,234,214,0.4)]"
            : "text-ink placeholder:text-muted"
        )}
      />
    </div>
  );
}
