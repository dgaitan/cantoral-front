import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Footer } from "./Footer";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
}));

describe("Footer", () => {
  it("renders the four navigable link columns", () => {
    render(<Footer />);
    ["Explorar", "Recursos", "Comunidad", "Cuenta"].forEach((title) => {
      expect(screen.getByRole("navigation", { name: title })).toBeInTheDocument();
    });
  });

  it("links existing routes and renders the legal bottom bar", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Mis favoritos" })).toHaveAttribute(
      "href",
      "/favoritos"
    );
    expect(screen.getByText(/Todos los derechos reservados/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Términos" })).toBeInTheDocument();
  });

  it("exposes the social badges with accessible names", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "YouTube" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
  });
});
