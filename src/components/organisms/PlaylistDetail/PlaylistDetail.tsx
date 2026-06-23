"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, GripVertical, Plus, Music, User, Trash2 } from "lucide-react";
import { Button } from "@heroui/react";
import { Heading } from "@/components/atoms/Heading/Heading";
import { PlaylistCoverArt } from "@/components/atoms/PlaylistCoverArt/PlaylistCoverArt";
import { PlaylistSongList } from "./PlaylistSongList";
import { AddSongsDialog } from "@/components/organisms/AddSongsDialog/AddSongsDialog";
import { deletePlaylist } from "@/actions/playlists";
import { useAuth } from "@/hooks/useAuth";
import type { Playlist, PlaylistSong } from "@/types/playlist";

interface PlaylistDetailProps {
  playlist: Playlist;
  initialSongs: PlaylistSong[];
}

export function PlaylistDetail({ playlist, initialSongs }: PlaylistDetailProps) {
  const [addSongsOpen, setAddSongsOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const isOwner = !!user && Number(user.id) === playlist.owner_id;
  const canManage = isOwner || playlist.is_collaborative;

  const tones = [...new Set(initialSongs.map((s) => s.song.tone).filter(Boolean))];

  async function handleDelete() {
    if (!confirm("¿Eliminar esta lista? Esta acción no se puede deshacer.")) return;
    const res = await deletePlaylist(playlist.uuid);
    if (res.ok) router.push("/listas");
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero header */}
      <div className="bg-ink rounded-b-3xl px-5 pt-10 pb-8 lg:mx-auto lg:max-w-[860px] lg:rounded-3xl lg:mt-6 lg:px-10 lg:pt-10 lg:pb-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
          <PlaylistCoverArt name={playlist.name} uuid={playlist.uuid} size="lg" className="hidden lg:block" />

          <div className="flex-1 min-w-0">
            {playlist.is_public && (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-cream/70 bg-white/10 rounded-full px-3 py-1 mb-3">
                <Eye size={12} aria-hidden="true" />
                Pública
              </span>
            )}

            <Heading size="lg" tone="cream">
              {playlist.name}
            </Heading>

            {playlist.description && (
              <p className="text-[14px] text-cream/70 mt-2 leading-relaxed">
                {playlist.description}
              </p>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-[13px] text-cream/60">
              <span className="flex items-center gap-1.5">
                <Music size={13} aria-hidden="true" />
                {initialSongs.length} canciones
              </span>
              {tones.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-[12px]">♪</span>
                  {tones.join(" · ")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Songs section */}
      <div className="px-5 pt-6 pb-28 lg:max-w-[860px] lg:mx-auto lg:px-0 lg:pt-8">
        <div className="bg-white rounded-2xl border border-line px-5 pt-5 pb-2">
          <div className="flex items-center justify-between mb-1">
            <div>
              <Heading as="h2" size="sm">Canciones</Heading>
              {canManage && (
                <p className="text-[12px] text-muted flex items-center gap-1 mt-0.5">
                  <GripVertical size={12} aria-hidden="true" />
                  Arrastra para reordenar
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {canManage && (
                <Button
                  onPress={() => setAddSongsOpen(true)}
                  className="font-semibold bg-ink text-cream text-[13px]"
                >
                  <Plus size={15} aria-hidden="true" />
                  {" "}Agregar canciones
                </Button>
              )}
              {isOwner && (
                <Button
                  isIconOnly
                  variant="ghost"
                  onPress={handleDelete}
                  aria-label="Eliminar lista"
                  className="text-muted hover:text-danger"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>

          <PlaylistSongList
            playlistUuid={playlist.uuid}
            initialSongs={initialSongs}
            canManage={canManage}
          />

          {initialSongs.length === 0 && (
            <p className="text-center text-muted text-[14px] py-8">
              Esta lista aún no tiene canciones.
            </p>
          )}
        </div>
      </div>

      <AddSongsDialog
        playlist={playlist}
        isOpen={addSongsOpen}
        onOpenChange={setAddSongsOpen}
        onDone={() => setAddSongsOpen(false)}
      />
    </div>
  );
}
