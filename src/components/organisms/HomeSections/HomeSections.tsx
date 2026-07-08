"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { useSongs } from "@/hooks/useSongs";
import { LiturgyMoments, SectionHead, SongCard, SongRow } from "@/components/molecules";
import { Container } from "@/components/templates/Grid/Container";
import { buildSongParam } from "@/lib/utils/song-param";
import { HOME_HERO_COUNT, HOME_RECIENTES_COUNT, HOME_MAS_BUSCADAS_COUNT } from "@/lib/constants/home";

export function HomeSections() {
  const { data: categories = [] } = useCategories();

  const { data: latestData } = useSongs({
    order_by: "created_at",
    order: "desc",
    limit: HOME_HERO_COUNT + HOME_RECIENTES_COUNT,
  });
  const latest = latestData?.data?.results ?? [];
  // Skip the songs already shown in the hero (same positions, same underlying fetch).
  const recientes = latest.slice(HOME_HERO_COUNT, HOME_HERO_COUNT + HOME_RECIENTES_COUNT);

  const { data: topViewedData } = useSongs({
    order_by: "views",
    order: "desc",
    limit: HOME_MAS_BUSCADAS_COUNT,
  });
  const rail = topViewedData?.data?.results ?? [];

  return (
    <Container>
      {categories.length > 0 && (
        <section aria-label="Momentos de la liturgia">
          <LiturgyMoments categories={categories} />
        </section>
      )}

      {rail.length > 0 && (
        <section aria-labelledby="home-mas-buscadas" className="pt-[18px] pb-2">
          <div className="px-5 lg:px-0">
            <SectionHead
              headingId="home-mas-buscadas"
              kicker="Para tu liturgia"
              title="Más buscadas"
              action="Ver todo"
              actionHref="/explorar"
            />
          </div>
          <div className="flex gap-[14px] overflow-x-auto px-5 lg:px-0 pt-0.5 pb-2 [scrollbar-width:none]">
            {rail.map((song) => (
              <SongCard key={song.id} song={song} size="rail" />
            ))}
          </div>
        </section>
      )}

      {recientes.length > 0 && (
        <section aria-labelledby="home-recientes" className="px-5 lg:px-0 pt-[14px]">
          <SectionHead headingId="home-recientes" kicker="Catálogo" title="Recién agregadas" />
          {recientes.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i + 1}
              href={`/canciones/${buildSongParam(song.id, song.slug)}`}
            />
          ))}
        </section>
      )}

      {rail.length === 0 && recientes.length === 0 && (
        <div className="px-5 lg:px-0 py-10 text-center">
          <p className="font-sans text-muted mb-4">Explora el catálogo de canciones</p>
          <Link
            href="/explorar"
            className="button button--primary font-semibold no-underline"
          >
            Ver canciones
          </Link>
        </div>
      )}
    </Container>
  );
}
