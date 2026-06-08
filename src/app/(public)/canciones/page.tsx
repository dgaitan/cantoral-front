"use client";

import { useState } from "react";
import { useSongs } from "@/hooks/useSongs";
import { useDebounce } from "@/hooks/useDebounce";
import { SongList } from "@/components/organisms/SongList/SongList";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";

export default function CancionesPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading, error } = useSongs({ search: debouncedSearch || undefined });

  const songs = data?.data?.results ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Canciones</h1>
        <p className="text-foreground/60">
          {data?.data?.count ?? 0} canciones disponibles
        </p>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={setSearch} />
      </div>

      <SongList
        songs={songs}
        loading={isLoading}
        error={error?.message}
      />
    </div>
  );
}
