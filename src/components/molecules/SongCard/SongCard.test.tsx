import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SongCard } from "./SongCard";
import type { SongListItem } from "@/types";

const mockSong: SongListItem = {
  id: "42",
  name: "Gracia Admirable",
  slug: "gracia-admirable",
  short_description: "Un himno clásico",
  image: null,
  has_lyrics: true,
  views: 100,
  likes: 5,
  tone: "G",
  created_at: null,
  updated_at: null,
  authors: [{ id: "1", name: "John Newton", slug: "john-newton" }],
  tags: [{ id: "entrada", name: "Entrada", slug: "entrada" }],
};

describe("SongCard", () => {
  it("renders the song name", () => {
    render(<SongCard song={mockSong} />);
    expect(screen.getByText("Gracia Admirable")).toBeInTheDocument();
  });

  it("links to the correct href", () => {
    render(<SongCard song={mockSong} />);
    const link = screen.getByTestId("song-card");
    expect(link).toHaveAttribute("href", "/canciones/42-gracia-admirable");
  });

  it("renders the author name", () => {
    render(<SongCard song={mockSong} />);
    expect(screen.getByText("John Newton")).toBeInTheDocument();
  });

  it("renders the category label in CoverArt", () => {
    render(<SongCard song={mockSong} />);
    expect(screen.getByText("Gracia Admirable")).toBeInTheDocument();
  });
});
