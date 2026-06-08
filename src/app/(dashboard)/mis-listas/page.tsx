"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import useSWR from "swr";
import { apiClient } from "@/lib/api/client";
import { CoverArt } from "@/components/atoms/CoverArt/CoverArt";
import type { Playlist, PaginatedResponse } from "@/types";

async function fetchPlaylists(): Promise<Playlist[]> {
  try {
    const { data } =
      await apiClient.get<PaginatedResponse<Playlist>>("/playlists/");
    return data.data?.results ?? [];
  } catch {
    return [];
  }
}

export default function MisListasPage() {
  const { data: playlists = [], isLoading } = useSWR(
    "mis-listas",
    fetchPlaylists,
    { revalidateOnFocus: false }
  );

  return (
    <div style={{ padding: "20px 20px 0", background: "var(--paper)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: 26,
            fontWeight: 600,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          Mis listas
        </h1>
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "none",
            background: "var(--orange)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label="Nueva lista"
        >
          <Plus size={20} />
        </button>
      </div>

      {isLoading && (
        <p
          style={{
            fontFamily: "var(--font-hanken)",
            color: "var(--muted)",
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          Cargando…
        </p>
      )}

      {!isLoading && playlists.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p
            style={{
              fontFamily: "var(--font-hanken)",
              color: "var(--muted)",
              marginBottom: 16,
            }}
          >
            Aún no tienes listas creadas
          </p>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "var(--orange)",
              color: "#fff",
              borderRadius: 13,
              border: "none",
              padding: "13px 20px",
              fontFamily: "var(--font-hanken)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
            Crear lista
          </button>
        </div>
      )}

      {playlists.map((playlist) => {
        const covers = playlist.songs.slice(0, 3).map((ps) => ps.song);
        const count = playlist.songs.length;

        return (
          <Link
            key={playlist.id}
            href={`/listas/${playlist.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 0",
              borderTop: "1px solid var(--line)",
              textDecoration: "none",
            }}
          >
            {/* Stacked covers */}
            <div style={{ position: "relative", width: 66, height: 48, flexShrink: 0 }}>
              {covers.length === 0 && (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "var(--paper-2)",
                  }}
                />
              )}
              {covers.slice(0, 3).map((song, i) => (
                <div
                  key={song.id}
                  style={{
                    position: "absolute",
                    left: i * 10,
                    top: 0,
                    zIndex: covers.length - i,
                    boxShadow: "0 1px 4px rgba(10,29,43,0.12)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <CoverArt song={song} size={48} radius={10} />
                </div>
              ))}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-newsreader)",
                  fontSize: 17,
                  fontWeight: 500,
                  color: "var(--ink)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {playlist.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-hanken)",
                  fontSize: 12,
                  color: "var(--muted)",
                  marginTop: 2,
                }}
              >
                {count === 0
                  ? "Sin canciones"
                  : `${count} canción${count !== 1 ? "es" : ""}`}
              </div>
            </div>
          </Link>
        );
      })}

      {playlists.length > 0 && (
        <div style={{ borderTop: "1px solid var(--line)" }} />
      )}

      <div style={{ height: 90 }} />
    </div>
  );
}
