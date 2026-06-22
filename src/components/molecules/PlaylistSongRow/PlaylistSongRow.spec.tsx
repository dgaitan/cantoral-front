import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PlaylistSongRow } from "./PlaylistSongRow";
import type { SongListItem } from "@/types/song";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
}));

const mockSong: SongListItem = {
  id: "1",
  name: "Gloria",
  slug: "gloria",
  short_description: null,
  image: null,
  has_lyrics: true,
  views: null,
  likes: null,
  tone: "G",
  created_at: null,
  updated_at: null,
  authors: [{ id: "1", name: "Anónimo", slug: "anonimo" }],
  tags: [],
};

describe("Playlists — PlaylistSongRow", () => {
  it("displays the song name and author", () => {
    render(<PlaylistSongRow song={mockSong} order={1} />);
    expect(screen.getByText("Gloria")).toBeInTheDocument();
    expect(screen.getByText("Anónimo")).toBeInTheDocument();
  });

  it("renders a drag handle icon when isDraggable is true", () => {
    render(<PlaylistSongRow song={mockSong} order={1} isDraggable />);
    expect(screen.getByRole("button", { name: /reordenar/i })).toBeInTheDocument();
  });

  it("does not render a drag handle when isDraggable is false", () => {
    render(<PlaylistSongRow song={mockSong} order={1} isDraggable={false} />);
    expect(screen.queryByRole("button", { name: /reordenar/i })).not.toBeInTheDocument();
  });
});
