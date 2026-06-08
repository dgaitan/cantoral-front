"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

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

  useEffect(() => {
    onSearch?.(debounced);
  }, [debounced, onSearch]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: glass ? "rgba(255,255,255,0.1)" : "#fff",
        border: `1px solid ${glass ? "rgba(243,234,214,0.18)" : "var(--line)"}`,
        borderRadius: 14,
        padding: "13px 15px",
        boxShadow: glass ? "none" : "0 1px 2px rgba(10,29,43,0.04)",
        backdropFilter: glass ? "blur(8px)" : "none",
      }}
    >
      <Search
        size={20}
        aria-hidden="true"
        style={{ color: glass ? "var(--gold)" : "var(--muted)", flexShrink: 0 }}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onFocus={onFocus}
        readOnly={readOnly}
        aria-label="Buscar canciones"
        style={{
          border: "none",
          outline: "none",
          flex: 1,
          fontFamily: "var(--font-hanken)",
          fontSize: 15,
          color: glass ? "rgba(243,234,214,0.7)" : "var(--ink)",
          background: "transparent",
          minWidth: 0,
        }}
      />
    </div>
  );
}
