"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@heroui/react";
import { Heading } from "@/components/atoms/Heading/Heading";
import { PlaylistCard } from "@/components/molecules/PlaylistCard/PlaylistCard";
import { PlaylistDialog } from "@/components/organisms/PlaylistDialog/PlaylistDialog";
import { usePlaylists } from "@/hooks/usePlaylists";
import type { Playlist } from "@/types/playlist";

export default function MisListasPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading, mutate } = usePlaylists();

  const playlists: Playlist[] = data?.data?.results ?? [];

  function handleCreated() {
    mutate();
    setCreateOpen(false);
  }

  return (
    <div className="px-5 pt-5 pb-28 min-h-screen bg-paper">
      <div className="flex items-center justify-between mb-5">
        <Heading>Mis listas</Heading>
        <Button
          isIconOnly
          variant="primary"
          onPress={() => setCreateOpen(true)}
          aria-label="Nueva lista"
          className="w-10 h-10 min-w-10 rounded-xl"
        >
          <Plus size={20} aria-hidden="true" />
        </Button>
      </div>

      {isLoading && (
        <p className="text-muted text-center py-10">Cargando…</p>
      )}

      {!isLoading && playlists.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted mb-4">Aún no tienes listas creadas</p>
          <Button
            variant="primary"
            onPress={() => setCreateOpen(true)}
            className="font-semibold"
          >
            <Plus size={16} aria-hidden="true" />
            {" "}Crear lista
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
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
