import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Logo } from "@/components/atoms/Logo/Logo";
import { SongCard } from "@/components/molecules/SongCard/SongCard";
import { SongRow } from "@/components/molecules/SongRow/SongRow";
import { SectionHead } from "@/components/molecules/SectionHead/SectionHead";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { buildSongParam } from "@/lib/utils/song-param";
import type { SongListItem, Category } from "@/types";

export const revalidate = 3600;

async function getPopularSongs(): Promise<SongListItem[]> {
  try {
    const res = await fetch(
      `${process.env.API_URL_INTERNAL ?? "http://localhost:8000/api"}/songs/?ordering=-views&limit=8`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: { results?: SongListItem[] };
    };
    return json.data?.results ?? [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(
      `${process.env.API_URL_INTERNAL ?? "http://localhost:8000/api"}/categories/`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: { results?: Category[] } | Category[];
    };
    if (Array.isArray(json.data)) return json.data;
    return (json.data as { results?: Category[] })?.results ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [songs, categories] = await Promise.all([
    getPopularSongs(),
    getCategories(),
  ]);

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
              onAction={() => {}}
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
