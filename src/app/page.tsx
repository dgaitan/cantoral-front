import Link from "next/link";
import { HomeHero } from "@/components/organisms/HomeHero/HomeHero";
import { LiturgyMoments, SectionHead, SongCard, SongRow } from "@/components/molecules";
import { buildSongParam } from "@/lib/utils/song-param";
import type { SongListItem, Category } from "@/types";

// TODO: replace with real API calls when backend is ready
function getPopularSongs(): SongListItem[] {
  return [
    { id: "1", name: "Pescador de Hombres", slug: "pescador-de-hombres", short_description: null, image: null, has_lyrics: true, views: 1240, likes: 88, tone: "G", created_at: null, updated_at: null, authors: [{ id: "a1", name: "Cesáreo Gabaráin", slug: "cesareo-gabarain" }], categories: [{ id: "c1", name: "Ofertorio", slug: "ofertorio" }] },
    { id: "2", name: "Aleluya (Taizé)", slug: "aleluya-taize", short_description: null, image: null, has_lyrics: true, views: 980, likes: 72, tone: "D", created_at: null, updated_at: null, authors: [{ id: "a2", name: "Comunidad de Taizé", slug: "taize" }], categories: [{ id: "c2", name: "Aclamación", slug: "aclamacion" }] },
    { id: "3", name: "El Señor Es Mi Fuerza", slug: "el-senor-es-mi-fuerza", short_description: null, image: null, has_lyrics: true, views: 870, likes: 61, tone: "Am", created_at: null, updated_at: null, authors: [{ id: "a3", name: "Pedro Rubalcava", slug: "pedro-rubalcava" }], categories: [{ id: "c3", name: "Comunión", slug: "comunion" }] },
    { id: "4", name: "Dios Está Aquí", slug: "dios-esta-aqui", short_description: null, image: null, has_lyrics: true, views: 760, likes: 55, tone: "C", created_at: null, updated_at: null, authors: [{ id: "a4", name: "Marcos Witt", slug: "marcos-witt" }], categories: [{ id: "c1", name: "Ofertorio", slug: "ofertorio" }] },
    { id: "5", name: "Santo (Schubert)", slug: "santo-schubert", short_description: null, image: null, has_lyrics: true, views: 650, likes: 48, tone: "F", created_at: null, updated_at: null, authors: [{ id: "a5", name: "Franz Schubert", slug: "franz-schubert" }], categories: [{ id: "c4", name: "Santo", slug: "santo" }] },
    { id: "6", name: "Cordero de Dios", slug: "cordero-de-dios", short_description: null, image: null, has_lyrics: true, views: 590, likes: 43, tone: "Em", created_at: null, updated_at: null, authors: [{ id: "a6", name: "Anónimo", slug: "anonimo" }], categories: [{ id: "c5", name: "Fracción del Pan", slug: "fraccion-del-pan" }] },
    { id: "7", name: "Ven Espíritu Santo", slug: "ven-espiritu-santo", short_description: null, image: null, has_lyrics: true, views: 520, likes: 39, tone: "Bb", created_at: null, updated_at: null, authors: [{ id: "a7", name: "Varios", slug: "varios" }], categories: [{ id: "c6", name: "Entrada", slug: "entrada" }] },
    { id: "8", name: "Magnificat", slug: "magnificat", short_description: null, image: null, has_lyrics: true, views: 480, likes: 35, tone: "E", created_at: null, updated_at: null, authors: [{ id: "a8", name: "Lucien Deiss", slug: "lucien-deiss" }], categories: [{ id: "c7", name: "Salida", slug: "salida" }] },
  ];
}

function getCategories(): Category[] {
  return [
    { id: "c6", name: "Entrada", slug: "entrada" },
    { id: "c8", name: "Penitencial", slug: "penitencial" },
    { id: "c2", name: "Aclamación", slug: "aclamacion" },
    { id: "c1", name: "Ofertorio", slug: "ofertorio" },
    { id: "c3", name: "Comunión", slug: "comunion" },
    { id: "c7", name: "Salida", slug: "salida" },
  ];
}

export default function HomePage() {
  const songs = getPopularSongs();
  const categories = getCategories();
  const rail = songs.slice(0, 6);
  const recientes = songs.slice(0, 5);

  return (
    <div className="bg-paper">
      <HomeHero />

      {categories.length > 0 && <LiturgyMoments categories={categories} />}

      {rail.length > 0 && (
        <div className="pt-[18px] pb-2">
          <div className="px-5">
            <SectionHead
              kicker="Para tu liturgia"
              title="Más buscadas"
              action="Ver todo"
              actionHref="/explorar"
            />
          </div>
          <div className="flex gap-[14px] overflow-x-auto px-5 pt-0.5 pb-2 [scrollbar-width:none]">
            {rail.map((song) => (
              <SongCard key={song.id} song={song} width={150} />
            ))}
          </div>
        </div>
      )}

      {recientes.length > 0 && (
        <div className="px-5 pt-[14px]">
          <SectionHead kicker="Catálogo" title="Recién agregadas" />
          {recientes.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i + 1}
              href={`/canciones/${buildSongParam(song.id, song.slug)}`}
            />
          ))}
        </div>
      )}

      {songs.length === 0 && (
        <div className="px-5 py-10 text-center">
          <p className="font-sans text-muted mb-4">Explora el catálogo de canciones</p>
          <Link
            href="/explorar"
            className="inline-block bg-orange text-white font-semibold rounded-[13px] px-5 py-3 no-underline"
          >
            Ver canciones
          </Link>
        </div>
      )}

      <div className="h-[90px]" />
    </div>
  );
}
