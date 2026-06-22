import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreatePlaylistForm } from "./CreatePlaylistForm";

vi.mock("@/lib/api/playlists", () => ({
  createPlaylist: vi.fn(),
}));

vi.mock("@/lib/utils/api-error", () => ({
  extractApiError: vi.fn((err) => {
    const msg = (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors?.[0];
    return msg ?? "Error desconocido";
  }),
}));

import { createPlaylist } from "@/lib/api/playlists";

const mockPlaylist = {
  uuid: "abc-123",
  name: "Mi Lista",
  description: null,
  is_public: false,
  is_collaborative: false,
  owner_id: 1,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("Playlists — CreatePlaylistForm", () => {
  beforeEach(() => {
    vi.mocked(createPlaylist).mockClear();
  });

  it("shows a validation error when name is empty", async () => {
    render(<CreatePlaylistForm />);
    await userEvent.click(screen.getByRole("button", { name: /crear lista/i }));
    await waitFor(() =>
      expect(screen.getByText(/obligatorio/i)).toBeInTheDocument()
    );
  });

  it("calls createPlaylist with the correct payload when filled", async () => {
    vi.mocked(createPlaylist).mockResolvedValue({ data: mockPlaylist, success: true, errors: null, status: 201 });
    render(<CreatePlaylistForm />);

    await userEvent.type(screen.getByPlaceholderText(/misa de pentecostés/i), "Mi Lista de Misa");
    await userEvent.type(screen.getByPlaceholderText(/para qué celebración/i), "Para el domingo");

    const publicSwitch = screen.getByRole("switch", { name: /lista pública/i });
    await userEvent.click(publicSwitch);

    await userEvent.click(screen.getByRole("button", { name: /crear lista/i }));

    await waitFor(() =>
      expect(createPlaylist).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Mi Lista de Misa",
          description: "Para el domingo",
          is_public: true,
          is_collaborative: false,
        })
      )
    );
  });

  it("shows a loading state while the API call is in flight", async () => {
    let resolve!: (val: unknown) => void;
    vi.mocked(createPlaylist).mockReturnValue(new Promise((r) => { resolve = r; }) as never);
    render(<CreatePlaylistForm />);

    await userEvent.type(screen.getByPlaceholderText(/misa de pentecostés/i), "Test");
    await userEvent.click(screen.getByRole("button", { name: /crear lista/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /creando/i })).toBeDisabled()
    );
    resolve({ data: mockPlaylist, success: true, errors: null, status: 201 });
  });

  it("shows an API error message when the request fails", async () => {
    vi.mocked(createPlaylist).mockRejectedValue({
      response: { data: { errors: ["El nombre ya existe"] } },
    });
    render(<CreatePlaylistForm />);

    await userEvent.type(screen.getByPlaceholderText(/misa de pentecostés/i), "Test");
    await userEvent.click(screen.getByRole("button", { name: /crear lista/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("El nombre ya existe")
    );
  });

  it("calls onSuccess and resets the form after successful submission", async () => {
    vi.mocked(createPlaylist).mockResolvedValue({ data: mockPlaylist, success: true, errors: null, status: 201 });
    const onSuccess = vi.fn();
    render(<CreatePlaylistForm onSuccess={onSuccess} />);

    await userEvent.type(screen.getByPlaceholderText(/misa de pentecostés/i), "Test");
    await userEvent.click(screen.getByRole("button", { name: /crear lista/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(mockPlaylist));
    expect(screen.getByPlaceholderText(/misa de pentecostés/i)).toHaveValue("");
  });
});
