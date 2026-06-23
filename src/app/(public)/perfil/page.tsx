"use client";

import { Tabs } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { SongBrowser } from "@/components/organisms/SongBrowser/SongBrowser";
import { PageLoader } from "@/components/atoms/PageLoader/PageLoader";
import { Container } from "@/components/templates/Grid/Container";
import { Heading } from "@/components/atoms/Heading/Heading";

export default function PerfilPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) return <PageLoader />;

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
              <div className="py-10 text-center text-muted">Próximamente</div>
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
