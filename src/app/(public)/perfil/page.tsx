"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Tabs, Button } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useMyPlaylists } from "@/hooks/useMyPlaylists";
import { SongBrowser } from "@/components/organisms/SongBrowser/SongBrowser";
import { PlaylistCard } from "@/components/molecules/PlaylistCard/PlaylistCard";
import { PlaylistDialog } from "@/components/organisms/PlaylistDialog/PlaylistDialog";
import { PageLoader } from "@/components/atoms/PageLoader/PageLoader";
import { Container } from "@/components/templates/Grid/Container";
import { Heading } from "@/components/atoms/Heading/Heading";
import type { Playlist } from "@/types/playlist";

export default function PerfilPage() {
  const { user, isLoading } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const { data: playlistsData, isLoading: playlistsLoading, mutate: mutatePlaylists } =
    useMyPlaylists();

  if (isLoading || !user) return <PageLoader />;

  const playlists: Playlist[] = playlistsData?.data?.results ?? [];

  function handleCreated() {
    mutatePlaylists();
    setCreateOpen(false);
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="px-5 pt-8 pb-6 border-b border-line">
        <Container>
          <Heading as="p" size="sm">
            {user.name}
          </Heading>
          <p className="text-[14px] text-muted mt-1">{user.email}</p>
        </Container>
      </div>

      <div className="px-5 pt-4">
        <Container>
          <Tabs>
            <Tabs.ListContainer>
              <Tabs.List aria-label="Perfil">
                <Tabs.Tab id="favoritos">
                  Favoritos
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="listas">
                  <Tabs.Separator />
                  Listas
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="cuenta">
                  <Tabs.Separator />
                  Cuenta
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel id="favoritos">
              <div className="pt-4">
                <SongBrowser
                  useSongsHook={useFavorites}
                  baseUrl="/perfil"
                  emptyMessage="No tienes canciones favoritas aún"
                />
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="listas">
              <div className="pt-4">
                <div className="flex items-center justify-end mb-4">
                  <Button
                    variant="primary"
                    onPress={() => setCreateOpen(true)}
                    className="font-semibold"
                  >
                    <Plus size={16} aria-hidden="true" />
                    {" "}Nueva lista
                  </Button>
                </div>

                {playlistsLoading && (
                  <p className="text-muted text-center py-10">Cargando…</p>
                )}

                {!playlistsLoading && playlists.length === 0 && (
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
            </Tabs.Panel>

            <Tabs.Panel id="cuenta">
              <div className="py-10 text-center text-muted">Próximamente</div>
            </Tabs.Panel>
          </Tabs>
        </Container>
      </div>

      <div className="h-[90px]" />
    </div>
  );
}
