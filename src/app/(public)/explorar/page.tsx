"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSongs } from "@/hooks/useSongs";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { CategoryChips } from "@/components/molecules/CategoryChips/CategoryChips";
import { SongRow } from "@/components/molecules/SongRow/SongRow";
import { PaginationBar } from "@/components/molecules/PaginationBar/PaginationBar";
import { buildSongParam } from "@/lib/utils/song-param";

const PAGE_SIZE = 20;

function ExplorarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeTagId, setActiveTagId] = useState<string>(
    searchParams.get("tag_id") ?? "all"
  );
  const [page, setPage] = useState(Number(searchParams.get("page") ?? "1"));
  const debouncedSearch = useDebounce(search, 300);
  const authorIdParam = searchParams.get("author_id");

  const { data: songsData, isLoading } = useSongs({
    search: debouncedSearch || undefined,
    tag_id: activeTagId !== "all" ? Number(activeTagId) : undefined,
    author_id: authorIdParam ? Number(authorIdParam) : undefined,
    page,
  });

  const { data: categories = [] } = useCategories();
  const songs = songsData?.data?.results ?? [];
  const count = songsData?.data?.count ?? 0;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) =>
      v == null ? params.delete(k) : params.set(k, v)
    );
    router.replace(`/explorar?${params.toString()}`, { scroll: false });
  }

  function handleSearch(q: string) {
    setSearch(q);
    setPage(1);
    updateParams({ q: q || null, page: null });
  }

  function handleCategory(id: string) {
    setActiveTagId(id);
    setPage(1);
    updateParams({ tag_id: id !== "all" ? id : null, page: null });
  }

  function handlePage(newPage: number) {
    setPage(newPage);
    updateParams({ page: newPage > 1 ? String(newPage) : null });
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="sticky -top-[60px] z-20 bg-paper/95 backdrop-blur-md border-b border-line px-5 pt-4 pb-2">
        <h1 className="font-serif text-[26px] font-semibold text-ink mb-3.5">
          Explorar
        </h1>
        <SearchBar
          defaultValue={search}
          onSearch={handleSearch}
          placeholder="Buscar canción, autor, tono…"
        />
        <div className="mt-3 mb-0">
          <CategoryChips
            categories={categories}
            activeId={activeTagId}
            onChange={handleCategory}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pt-3">
        <span className="text-[13px] text-muted">
          {isLoading ? "Cargando…" : `${count} canciones`}
        </span>
      </div>

      <div className="px-5 pt-1">
        {isLoading && songs.length === 0 && (
          <div className="py-10 text-center text-muted">Cargando canciones…</div>
        )}
        {!isLoading && songs.length === 0 && (
          <div className="py-10 text-center text-muted">
            No se encontraron canciones
          </div>
        )}
        {songs.map((song) => (
          <SongRow
            key={song.id}
            song={song}
            href={`/canciones/${buildSongParam(song.id, song.slug)}`}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center py-6">
          <PaginationBar page={page} totalPages={totalPages} onChange={handlePage} />
        </div>
      )}

      <div className="h-[90px]" />
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
