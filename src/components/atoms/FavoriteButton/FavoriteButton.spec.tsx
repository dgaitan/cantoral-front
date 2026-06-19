import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { FavoriteButton } from "./FavoriteButton";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/api/client", () => ({
  getMemoryToken: vi.fn(),
}));

vi.mock("@/lib/api/favorites", () => ({
  toggleFavorite: vi.fn(),
}));

import { getMemoryToken } from "@/lib/api/client";
import { toggleFavorite } from "@/lib/api/favorites";

describe("Song Favorites — FavoriteButton", () => {
  beforeEach(() => {
    mockPush.mockClear();
    vi.mocked(toggleFavorite).mockClear();
  });

  it("guest user sees the heart button", () => {
    vi.mocked(getMemoryToken).mockReturnValue(null);
    render(<FavoriteButton songId="1" isFavorited={false} />);
    expect(screen.getByRole("button", { name: /favorit/i })).toBeInTheDocument();
  });

  it("guest user is redirected to /register when clicking the heart button", async () => {
    vi.mocked(getMemoryToken).mockReturnValue(null);
    render(<FavoriteButton songId="1" isFavorited={false} />);
    await userEvent.click(screen.getByRole("button", { name: /favorit/i }));
    expect(mockPush).toHaveBeenCalledWith("/register");
  });

  it("authenticated user sees an unfilled heart when the song is not favorited", () => {
    vi.mocked(getMemoryToken).mockReturnValue("mock-token");
    render(<FavoriteButton songId="1" isFavorited={false} />);
    expect(screen.getByRole("button", { name: /agregar a favoritos/i })).toBeInTheDocument();
  });

  it("authenticated user sees a filled heart when the song is already favorited", () => {
    vi.mocked(getMemoryToken).mockReturnValue("mock-token");
    render(<FavoriteButton songId="1" isFavorited={true} />);
    expect(screen.getByRole("button", { name: /quitar de favoritos/i })).toBeInTheDocument();
  });

  it("shows a spinner and disables the button while the API call is in flight", async () => {
    vi.mocked(getMemoryToken).mockReturnValue("mock-token");
    let resolveToggle!: (val: unknown) => void;
    vi.mocked(toggleFavorite).mockReturnValue(
      new Promise((res) => { resolveToggle = res; }) as never
    );
    render(<FavoriteButton songId="1" isFavorited={false} />);
    await userEvent.click(screen.getByRole("button", { name: /agregar a favoritos/i }));
    expect(screen.getByRole("button", { name: /cargando/i })).toBeDisabled();
    resolveToggle({ data: { is_favorite: true } });
  });

  it("turns the heart active after successfully adding to favorites", async () => {
    vi.mocked(getMemoryToken).mockReturnValue("mock-token");
    vi.mocked(toggleFavorite).mockResolvedValue({ data: { is_favorite: true } } as never);
    render(<FavoriteButton songId="1" isFavorited={false} />);
    await userEvent.click(screen.getByRole("button", { name: /agregar a favoritos/i }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /quitar de favoritos/i })).toBeInTheDocument()
    );
    expect(screen.queryByRole("button", { name: /cargando/i })).not.toBeInTheDocument();
  });

  it("resets the heart to unfilled after successfully removing from favorites", async () => {
    vi.mocked(getMemoryToken).mockReturnValue("mock-token");
    vi.mocked(toggleFavorite).mockResolvedValue({ data: { is_favorite: false } } as never);
    render(<FavoriteButton songId="1" isFavorited={true} />);
    await userEvent.click(screen.getByRole("button", { name: /quitar de favoritos/i }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /agregar a favoritos/i })).toBeInTheDocument()
    );
    expect(screen.queryByRole("button", { name: /cargando/i })).not.toBeInTheDocument();
  });
});
