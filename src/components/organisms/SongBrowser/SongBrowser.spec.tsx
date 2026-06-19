import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { SongBrowser } from "./SongBrowser";
import type { SongListItem } from "@/types";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(),
}));

const mockSongs: SongListItem[] = [
  { id: "1", name: "Canto de Entrada", slug: "canto-de-entrada", short_description: null, image: null, has_lyrics: true, views: 10, likes: 5, tone: "Do", created_at: null, updated_at: null, authors: [], tags: [] },
  { id: "2", name: "Aleluya", slug: "aleluya", short_description: null, image: null, has_lyrics: true, views: 5, likes: 2, tone: "Re", created_at: null, updated_at: null, authors: [], tags: [] },
];

function makeHook(songs: SongListItem[], count: number, loading = false) {
  return () => ({
    data: loading ? undefined : { data: { results: songs, count } },
    isLoading: loading,
  });
}

afterEach(() => {
  mockReplace.mockClear();
});

describe("SongBrowser", () => {
  it("renders a list of songs", () => {
    render(<SongBrowser useSongsHook={makeHook(mockSongs, 2)} baseUrl="/perfil" />);
    expect(screen.getByText("Canto de Entrada")).toBeInTheDocument();
    expect(screen.getByText("Aleluya")).toBeInTheDocument();
  });

  it("shows the search bar", () => {
    render(<SongBrowser useSongsHook={makeHook(mockSongs, 2)} baseUrl="/perfil" />);
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
  });

  it("shows default empty message when there are no songs", () => {
    render(<SongBrowser useSongsHook={makeHook([], 0)} baseUrl="/perfil" />);
    expect(screen.getByText(/no se encontraron canciones/i)).toBeInTheDocument();
  });

  it("shows a custom empty message when provided", () => {
    render(
      <SongBrowser
        useSongsHook={makeHook([], 0)}
        baseUrl="/perfil"
        emptyMessage="No tienes canciones favoritas aún"
      />
    );
    expect(screen.getByText(/no tienes canciones favoritas aún/i)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<SongBrowser useSongsHook={makeHook([], 0, true)} baseUrl="/perfil" />);
    expect(screen.getByText(/cargando canciones/i)).toBeInTheDocument();
  });

  it("triggers handleSearch: hook receives search query after SearchBar fires onSearch", async () => {
    vi.useFakeTimers();
    const hookSpy = vi.fn().mockReturnValue({
      data: { data: { results: mockSongs, count: 2 } },
      isLoading: false,
    });
    render(<SongBrowser useSongsHook={hookSpy} baseUrl="/perfil" />);

    const input = screen.getByPlaceholderText(/buscar/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: "Canto" } });
      vi.advanceTimersByTime(400);
    });
    vi.useRealTimers();

    const lastCall = (hookSpy.mock.calls[hookSpy.mock.calls.length - 1] as [{ search?: string }])[0];
    expect(lastCall.search).toBe("Canto");
  });

  it("shows pagination when there are more songs than one page", () => {
    const manySongs: SongListItem[] = Array.from({ length: 21 }, (_, i) => ({
      id: String(i),
      name: `Song ${i}`,
      slug: `song-${i}`,
      short_description: null,
      image: null,
      has_lyrics: true,
      views: null,
      likes: null,
      tone: null,
      created_at: null,
      updated_at: null,
      authors: [],
      tags: [],
    }));
    render(<SongBrowser useSongsHook={makeHook(manySongs, 25)} baseUrl="/perfil" />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
