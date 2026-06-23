import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders children inside an h1 by default", () => {
    render(<Heading>Listas públicas</Heading>);
    const el = screen.getByRole("heading", { level: 1, name: "Listas públicas" });
    expect(el).toBeInTheDocument();
  });

  it("renders the requested tag via `as`", () => {
    render(<Heading as="h2">Canciones</Heading>);
    expect(screen.getByRole("heading", { level: 2, name: "Canciones" })).toBeInTheDocument();
  });

  it("applies the cream tone class on dark backgrounds", () => {
    render(<Heading tone="cream">Hero</Heading>);
    expect(screen.getByRole("heading", { name: "Hero" })).toHaveClass("text-cream");
  });

  it("applies the default ink tone otherwise", () => {
    render(<Heading>Explorar</Heading>);
    expect(screen.getByRole("heading", { name: "Explorar" })).toHaveClass("text-ink");
  });

  it("renders the eyebrow kicker above the heading when provided", () => {
    render(<Heading eyebrow="Descubre y comparte">Listas públicas</Heading>);
    expect(screen.getByText("Descubre y comparte")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Listas públicas" })).toBeInTheDocument();
  });

  it("merges call-site className for layout overrides", () => {
    render(<Heading className="mb-3.5">Explorar</Heading>);
    expect(screen.getByRole("heading", { name: "Explorar" })).toHaveClass("mb-3.5");
  });
});
