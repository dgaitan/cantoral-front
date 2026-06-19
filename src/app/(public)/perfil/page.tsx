"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@heroui/react";
import { useAuthStore } from "@/store/authStore";
import { useFavorites } from "@/hooks/useFavorites";
import { SongBrowser } from "@/components/organisms/SongBrowser/SongBrowser";
import { PageLoader } from "@/components/atoms/PageLoader/PageLoader";
import APP_URLS from "@/lib/constants";

export default function PerfilPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace(APP_URLS.LOGIN);
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) return <PageLoader />;
  if (!user) return null;

  return (
    <div className="bg-paper min-h-screen">
      <div className="px-5 pt-8 pb-6 border-b border-line">
        <p className="font-serif text-[22px] font-semibold text-ink leading-tight">
          {user.name}
        </p>
        <p className="text-[14px] text-muted mt-1">{user.email}</p>
      </div>

      <div className="px-5 pt-4">
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
      </div>

      <div className="h-[90px]" />
    </div>
  );
}
