import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Logo } from "@/components/atoms/Logo/Logo";
import { SongCard } from "@/components/molecules/SongCard/SongCard";
import { SongRow } from "@/components/molecules/SongRow/SongRow";
import { SectionHead } from "@/components/molecules/SectionHead/SectionHead";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
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
    <div style={{ background: "var(--paper)" }}>
      {/* Navy hero */}
      <div
        style={{
          background: "var(--ink)",
          padding: "58px 20px 30px",
          borderRadius: "0 0 28px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 300 200"
          style={{
            position: "absolute",
            right: -60,
            top: -40,
            width: 280,
            opacity: 0.5,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <circle
            cx="150"
            cy="100"
            r="130"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1"
            opacity="0.35"
          />
          <circle
            cx="150"
            cy="100"
            r="95"
            fill="none"
            stroke="var(--orange)"
            strokeWidth="1"
            opacity="0.35"
          />
          <circle
            cx="150"
            cy="100"
            r="60"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1"
            opacity="0.25"
          />
        </svg>
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 26,
            }}
          >
            <Logo size={24} mono />
            <Link
              href="/auth/login"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid rgba(243,234,214,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "var(--cream)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Mi cuenta"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: 32,
              fontWeight: 600,
              lineHeight: 1.1,
              color: "var(--cream)",
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
            }}
          >
            ¿Qué cantamos
            <br />
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}>hoy</em>?
          </h1>
          <Link href="/explorar" style={{ textDecoration: "none" }}>
            <SearchBar
              glass
              placeholder="Buscar canción, autor, tono…"
              readOnly
            />
          </Link>
        </div>
      </div>

      {/* Momentos de la Misa */}
      {categories.length > 0 && (
        <div style={{ padding: "24px 20px 4px" }}>
          <div
            style={{
              fontFamily: "var(--font-hanken)",
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 4,
            }}
          >
            Momentos de la Misa
          </div>
          <div>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/explorar?cat=${cat.slug}`}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderTop: "1px solid var(--line)",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontSize: 21,
                    fontWeight: 500,
                    color: "var(--ink)",
                  }}
                >
                  {cat.name}
                </span>
                <ChevronRight
                  size={16}
                  style={{ color: "var(--orange)" }}
                  aria-hidden="true"
                />
              </Link>
            ))}
            <div style={{ borderTop: "1px solid var(--line)" }} />
          </div>
        </div>
      )}

      {/* Más buscadas rail */}
      {rail.length > 0 && (
        <div style={{ padding: "18px 0 8px" }}>
          <div style={{ padding: "0 20px" }}>
            <SectionHead
              kicker="Para tu liturgia"
              title="Más buscadas"
              action="Ver todo"
              actionHref="/explorar"
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              overflowX: "auto",
              padding: "2px 20px 8px",
              scrollbarWidth: "none",
            }}
          >
            {rail.map((song) => (
              <SongCard key={song.id} song={song} width={150} />
            ))}
          </div>
        </div>
      )}

      {/* Recién agregadas */}
      {recientes.length > 0 && (
        <div style={{ padding: "14px 20px 0" }}>
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

      {/* Fallback when no API data */}
      {songs.length === 0 && (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-hanken)",
              color: "var(--muted)",
              marginBottom: 16,
            }}
          >
            Explora el catálogo de canciones
          </p>
          <Link
            href="/explorar"
            style={{
              display: "inline-block",
              background: "var(--orange)",
              color: "#fff",
              borderRadius: 13,
              padding: "13px 20px",
              fontFamily: "var(--font-hanken)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Ver canciones
          </Link>
        </div>
      )}

      <div style={{ height: 90 }} />
    </div>
  );
}
