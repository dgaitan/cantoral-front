"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSongs } from "@/hooks/useSongs";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { CategoryChips } from "@/components/molecules/CategoryChips/CategoryChips";
import { SongRow } from "@/components/molecules/SongRow/SongRow";
import { buildSongParam } from "@/lib/utils/song-param";

function ExplorarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get("cat") ?? "all"
  );
  const debouncedSearch = useDebounce(search, 300);

  const { data: songsData, isLoading } = useSongs({
    search: debouncedSearch || undefined,
    category: activeCategory !== "all" ? activeCategory : undefined,
  });

  const { data: categories = [] } = useCategories();
  const songs = songsData?.data?.results ?? [];
  const count = songsData?.data?.count ?? 0;

  function handleSearch(q: string) {
    setSearch(q);
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q); else params.delete("q");
    router.replace(`/explorar?${params.toString()}`, { scroll: false });
  }

  function handleCategory(id: string) {
    setActiveCategory(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id !== "all") params.set("cat", id); else params.delete("cat");
    router.replace(`/explorar?${params.toString()}`, { scroll: false });
  }

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      {/* Sticky header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(250,247,241,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
          padding: "16px 20px 0",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: 26,
            fontWeight: 600,
            color: "var(--ink)",
            margin: "0 0 14px",
          }}
        >
          Explorar
        </h1>
        <SearchBar
          defaultValue={search}
          onSearch={handleSearch}
          placeholder="Buscar canción, autor, tono…"
        />
        <div style={{ marginTop: 12, marginBottom: 0 }}>
          <CategoryChips
            categories={categories}
            activeId={activeCategory}
            onChange={handleCategory}
          />
        </div>
      </div>

      {/* Count bar */}
      <div
        style={{
          padding: "12px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-hanken)",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          {isLoading ? "Cargando…" : `${count} canciones`}
        </span>
      </div>

      {/* Song list */}
      <div style={{ padding: "4px 20px 0" }}>
        {isLoading && songs.length === 0 && (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: "var(--muted)",
              fontFamily: "var(--font-hanken)",
            }}
          >
            Cargando canciones…
          </div>
        )}
        {!isLoading && songs.length === 0 && (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: "var(--muted)",
              fontFamily: "var(--font-hanken)",
            }}
          >
            No se encontraron canciones
          </div>
        )}
        {songs.map((song, i) => (
          <SongRow
            key={song.id}
            song={song}
            href={`/canciones/${buildSongParam(song.id, song.slug)}`}
          />
        ))}
      </div>

      <div style={{ height: 90 }} />
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense>
      <ExplorarContent />
    </Suspense>
  );
}
