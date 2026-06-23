"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@heroui/react";
import { Heading } from "@/components/atoms/Heading/Heading";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { PlaylistCard } from "@/components/molecules/PlaylistCard/PlaylistCard";
import { PlaylistDialog } from "@/components/organisms/PlaylistDialog/PlaylistDialog";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useAuth } from "@/hooks/useAuth";
import type { Playlist } from "@/types/playlist";

export default function ListasPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading, mutate } = usePlaylists(1, search);
  const { isAuthenticated } = useAuth();

  const playlists: Playlist[] = data?.data?.results ?? [];
  const total = data?.data?.count ?? 0;

  function handleCreated() {
    mutate();
    setCreateOpen(false);
  }

  return (
    <div className="max-w-[1100px] mx-auto px-5 lg:px-8 pt-8 pb-28">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <Heading size="lg" eyebrow="Descubre y comparte">
          Listas públicas
        </Heading>

        {isAuthenticated && (
          <Button
            onPress={() => setCreateOpen(true)}
            className="font-bold bg-orange text-white shrink-0 mt-1"
          >
            <Plus size={16} aria-hidden="true" />
            {" "}Nueva lista
          </Button>
        )}
      </div>

      <div className="mb-5">
        <SearchBar onSearch={setSearch} placeholder="Buscar lista o autor…" />
      </div>

      {!isLoading && total > 0 && (
        <p className="text-[13px] text-muted mb-4">{total} listas de la comunidad</p>
      )}

      {!isLoading && total === 0 && search && (
        <p className="text-[13px] text-muted mb-4">
          No se encontraron listas para “{search}”.
        </p>
      )}

      {isLoading && (
        <div className="py-16 text-center text-muted">Cargando listas…</div>
      )}

      {!isLoading && playlists.length === 0 && !search && (
        <div className="py-16 text-center text-muted">
          <p className="text-[15px]">Aún no hay listas públicas.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.uuid} playlist={playlist} />
        ))}
      </div>

      <PlaylistDialog
        isOpen={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCreated}
      />
    </div>
  );
}
