import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AddSongsContent } from "./AddSongsContent";
import type { SongListItem } from "@/types/song";

vi.mock("@/hooks/useSongs", () => ({
  useSongs: vi.fn(),
}));

vi.mock("@/lib/api/playlists", () => ({
  attachSongsToPlaylist: vi.fn(),
}));

import { useSongs } from "@/hooks/useSongs";
import { attachSongsToPlaylist } from "@/lib/api/playlists";

const makeSong = (id: string, name: string): SongListItem => ({
  id,
  name,
  slug: name.toLowerCase().replace(/ /g, "-"),
  short_description: null,
  image: null,
  has_lyrics: true,
  views: null,
  likes: null,
  tone: "G",
  created_at: null,
  updated_at: null,
  authors: [{ id: "1", name: "Autor Ejemplo", slug: "autor-ejemplo" }],
  tags: [{ id: "1", name: "Ordinario", slug: "ordinario" }],
});

const THREE_SONGS = [makeSong("1", "Gloria"), makeSong("2", "Kyrie"), makeSong("3", "Ave María")];

function mockHook(songs: SongListItem[], loading = false) {
  vi.mocked(useSongs).mockReturnValue({
    data: loading ? undefined : { data: { results: songs, count: songs.length }, success: true, errors: null, status: 200 },
    isLoading: loading,
  } as ReturnType<typeof useSongs>);
}

describe("Playlists — AddSongsContent", () => {
  beforeEach(() => {
    vi.mocked(attachSongsToPlaylist).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a list of songs from the API", () => {
    mockHook(THREE_SONGS);
    render(<AddSongsContent playlistUuid="uuid-1" />);
    expect(screen.getByText("Gloria")).toBeInTheDocument();
    expect(screen.getByText("Kyrie")).toBeInTheDocument();
    expect(screen.getByText("Ave María")).toBeInTheDocument();
  });

  it("shows a search input", () => {
    mockHook(THREE_SONGS);
    render(<AddSongsContent playlistUuid="uuid-1" />);
    expect(screen.getByPlaceholderText(/buscar canción/i)).toBeInTheDocument();
  });

  it("calls useSongs with the search query when the user types", () => {
    vi.useFakeTimers();
    mockHook(THREE_SONGS);
    render(<AddSongsContent playlistUuid="uuid-1" />);
    const input = screen.getByPlaceholderText(/buscar canción/i);
    // Use fireEvent to avoid userEvent's internal async delays conflicting with fake timers
    fireEvent.change(input, { target: { value: "Ave María" } });
    act(() => { vi.advanceTimersByTime(400); });
    const lastCall = vi.mocked(useSongs).mock.calls.at(-1)![0];
    expect(lastCall?.search).toBe("Ave María");
  });

  it("shows a checked state for songs already in the playlist", () => {
    mockHook(THREE_SONGS);
    render(<AddSongsContent playlistUuid="uuid-1" initialSongIds={[2]} />);
    expect(screen.getByRole("button", { name: /quitar kyrie/i })).toBeInTheDocument();
  });

  it("calls attachSongsToPlaylist when toggling a song in", async () => {
    vi.mocked(attachSongsToPlaylist).mockResolvedValue({ data: {}, success: true, errors: null, status: 200 });
    mockHook(THREE_SONGS);
    render(<AddSongsContent playlistUuid="uuid-1" initialSongIds={[]} />);
    await userEvent.click(screen.getByRole("button", { name: /añadir gloria/i }));
    await waitFor(() =>
      expect(attachSongsToPlaylist).toHaveBeenCalledWith("uuid-1", [1])
    );
  });

  it("calls attachSongsToPlaylist when toggling a song out", async () => {
    vi.mocked(attachSongsToPlaylist).mockResolvedValue({ data: {}, success: true, errors: null, status: 200 });
    mockHook(THREE_SONGS);
    render(<AddSongsContent playlistUuid="uuid-1" initialSongIds={[1]} />);
    await userEvent.click(screen.getByRole("button", { name: /quitar gloria/i }));
    await waitFor(() =>
      expect(attachSongsToPlaylist).toHaveBeenCalledWith("uuid-1", [1])
    );
  });

  it("shows a loading state while songs are being fetched", () => {
    mockHook([], true);
    render(<AddSongsContent playlistUuid="uuid-1" />);
    expect(screen.getByText(/cargando canciones/i)).toBeInTheDocument();
  });

  it('shows an empty state when the search returns no results', () => {
    mockHook([]);
    render(<AddSongsContent playlistUuid="uuid-1" />);
    expect(screen.getByText(/no se encontraron canciones/i)).toBeInTheDocument();
  });
});
