"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { SongRow } from "@/components/molecules/SongRow/SongRow";
import { PaginationBar } from "@/components/molecules/PaginationBar/PaginationBar";
import { buildSongParam } from "@/lib/utils/song-param";
import type { SongListItem } from "@/types";

const PAGE_SIZE = 20;

interface SongBrowserProps {
  useSongsHook: (query: { search?: string; page?: number }) => {
    data: { data: { results: SongListItem[]; count: number } } | undefined;
    isLoading: boolean;
  };
  baseUrl: string;
  emptyMessage?: string;
}

function SongBrowserContent({ useSongsHook, baseUrl, emptyMessage = "No se encontraron canciones" }: SongBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page") ?? "1"));

  const { data, isLoading } = useSongsHook({
    search: search || undefined,
    page,
  });

  const songs = data?.data?.results ?? [];
  const count = data?.data?.count ?? 0;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) =>
      v == null ? params.delete(k) : params.set(k, v)
    );
    router.replace(`${baseUrl}?${params.toString()}`, { scroll: false });
  }

  function handleSearch(q: string) {
    setSearch(q);
    setPage(1);
    updateParams({ q: q || null, page: null });
  }

  function handlePage(newPage: number) {
    setPage(newPage);
    updateParams({ page: newPage > 1 ? String(newPage) : null });
  }

  return (
    <div>
      <div className="mb-4">
        <SearchBar
          defaultValue={search}
          onSearch={handleSearch}
          placeholder="Buscar canción, autor, tono…"
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] text-muted">
          {isLoading ? "Cargando…" : `${count} canciones`}
        </span>
      </div>

      {isLoading && songs.length === 0 && (
        <div className="py-10 text-center text-muted">Cargando canciones…</div>
      )}
      {!isLoading && songs.length === 0 && (
        <div className="py-10 text-center text-muted">{emptyMessage}</div>
      )}
      {songs.map((song) => (
        <SongRow
          key={song.id}
          song={song}
          href={`/canciones/${buildSongParam(song.id, song.slug)}`}
        />
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center py-6">
          <PaginationBar page={page} totalPages={totalPages} onChange={handlePage} />
        </div>
      )}
    </div>
  );
}

export function SongBrowser(props: SongBrowserProps) {
  return (
    <Suspense>
      <SongBrowserContent {...props} />
    </Suspense>
  );
}
