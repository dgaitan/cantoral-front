import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { FavoriteButton } from "./FavoriteButton";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

let mockAuth = { isAuthenticated: false };
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockAuth,
}));

vi.mock("@/actions/favorites", () => ({
  toggleFavorite: vi.fn(),
}));

import { toggleFavorite } from "@/actions/favorites";

describe("Song Favorites — FavoriteButton", () => {
  beforeEach(() => {
    mockPush.mockClear();
    vi.mocked(toggleFavorite).mockClear();
    mockAuth = { isAuthenticated: false };
  });

  it("guest user sees the heart button", () => {
    render(<FavoriteButton songId="1" isFavorited={false} />);
    expect(screen.getByRole("button", { name: /favorit/i })).toBeInTheDocument();
  });

  it("guest user is redirected to /register when clicking the heart button", async () => {
    render(<FavoriteButton songId="1" isFavorited={false} />);
    await userEvent.click(screen.getByRole("button", { name: /favorit/i }));
    expect(mockPush).toHaveBeenCalledWith("/register");
  });

  it("authenticated user sees an unfilled heart when the song is not favorited", () => {
    mockAuth = { isAuthenticated: true };
    render(<FavoriteButton songId="1" isFavorited={false} />);
    expect(screen.getByRole("button", { name: /agregar a favoritos/i })).toBeInTheDocument();
  });

  it("authenticated user sees a filled heart when the song is already favorited", () => {
    mockAuth = { isAuthenticated: true };
    render(<FavoriteButton songId="1" isFavorited={true} />);
    expect(screen.getByRole("button", { name: /quitar de favoritos/i })).toBeInTheDocument();
  });

  it("shows a spinner and disables the button while the API call is in flight", async () => {
    mockAuth = { isAuthenticated: true };
    let resolveToggle!: (val: unknown) => void;
    vi.mocked(toggleFavorite).mockReturnValue(
      new Promise((res) => { resolveToggle = res; }) as never
    );
    render(<FavoriteButton songId="1" isFavorited={false} />);
    await userEvent.click(screen.getByRole("button", { name: /agregar a favoritos/i }));
    expect(screen.getByRole("button", { name: /cargando/i })).toBeDisabled();
    resolveToggle({ ok: true, data: { is_favorite: true } });
  });

  it("turns the heart active after successfully adding to favorites", async () => {
    mockAuth = { isAuthenticated: true };
    vi.mocked(toggleFavorite).mockResolvedValue({ ok: true, data: { is_favorite: true } } as never);
    render(<FavoriteButton songId="1" isFavorited={false} />);
    await userEvent.click(screen.getByRole("button", { name: /agregar a favoritos/i }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /quitar de favoritos/i })).toBeInTheDocument()
    );
    expect(screen.queryByRole("button", { name: /cargando/i })).not.toBeInTheDocument();
  });

  it("resets the heart to unfilled after successfully removing from favorites", async () => {
    mockAuth = { isAuthenticated: true };
    vi.mocked(toggleFavorite).mockResolvedValue({ ok: true, data: { is_favorite: false } } as never);
    render(<FavoriteButton songId="1" isFavorited={true} />);
    await userEvent.click(screen.getByRole("button", { name: /quitar de favoritos/i }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /agregar a favoritos/i })).toBeInTheDocument()
    );
    expect(screen.queryByRole("button", { name: /cargando/i })).not.toBeInTheDocument();
  });
});
