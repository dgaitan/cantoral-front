import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlaylistCard } from "./PlaylistCard";
import type { Playlist } from "@/types/playlist";

const basePlaylist: Playlist = {
  uuid: "550e8400-e29b-41d4-a716-446655440000",
  name: "Adviento 2024",
  description: "Canciones del tiempo de Adviento",
  is_public: true,
  is_collaborative: false,
  owner_id: 1,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("Playlists — PlaylistCard", () => {
  it("displays the playlist name and description", () => {
    render(<PlaylistCard playlist={basePlaylist} />);
    expect(screen.getByText("Adviento 2024")).toBeInTheDocument();
    expect(screen.getByText("Canciones del tiempo de Adviento")).toBeInTheDocument();
  });

  it('shows a "Pública" badge when the playlist is public', () => {
    render(<PlaylistCard playlist={{ ...basePlaylist, is_public: true }} />);
    expect(screen.getByText("Pública")).toBeInTheDocument();
  });

  it('shows a "Privada" badge when the playlist is private', () => {
    render(<PlaylistCard playlist={{ ...basePlaylist, is_public: false }} />);
    expect(screen.getByText("Privada")).toBeInTheDocument();
  });

  it('shows a "Colaborativa" badge when the playlist is collaborative', () => {
    render(<PlaylistCard playlist={{ ...basePlaylist, is_collaborative: true }} />);
    expect(screen.getByText("Colaborativa")).toBeInTheDocument();
  });

  it("links to the playlist detail page using the UUID", () => {
    render(<PlaylistCard playlist={basePlaylist} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/listas/550e8400-e29b-41d4-a716-446655440000");
  });
});
