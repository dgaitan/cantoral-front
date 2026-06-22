"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@heroui/react";
import { PlaylistCard } from "@/components/molecules/PlaylistCard/PlaylistCard";
import { PlaylistDialog } from "@/components/organisms/PlaylistDialog/PlaylistDialog";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useAuthStore } from "@/store/authStore";
import type { Playlist } from "@/types/playlist";

export default function ListasPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading, mutate } = usePlaylists();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const playlists: Playlist[] = data?.data?.results ?? [];
  const total = data?.data?.count ?? 0;

  function handleCreated(playlist: Playlist) {
    mutate();
    setCreateOpen(false);
  }

  return (
    <div className="max-w-[1100px] mx-auto px-5 lg:px-8 pt-8 pb-28">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-orange mb-1">
            Descubre y comparte
          </p>
          <h1 className="font-serif text-[30px] lg:text-[38px] font-semibold text-ink leading-tight">
            Listas públicas
          </h1>
        </div>

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

      {/* Search — placeholder for future filter */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 rounded-[14px] px-4 py-3 bg-white border border-line shadow-[0_1px_2px_rgba(10,29,43,0.04)]">
          <span className="text-muted text-[15px]" aria-hidden="true">🔍</span>
          <span className="text-muted text-[15px]">Buscar lista o autor...</span>
        </div>
      </div>

      {!isLoading && total > 0 && (
        <p className="text-[13px] text-muted mb-4">{total} listas de la comunidad</p>
      )}

      {isLoading && (
        <div className="py-16 text-center text-muted">Cargando listas…</div>
      )}

      {!isLoading && playlists.length === 0 && (
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
