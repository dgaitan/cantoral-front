import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chord } from "./Chord";

describe("Chord", () => {
  it("renders the chord name", () => {
    render(<Chord name="G" />);
    expect(screen.getByText("G")).toBeInTheDocument();
  });

  it("has correct aria-label in Spanish", () => {
    render(<Chord name="C#" />);
    expect(screen.getByLabelText("acorde C#")).toBeInTheDocument();
  });

  it("applies additional className", () => {
    const { container } = render(<Chord name="Am" className="text-red-500" />);
    expect(container.firstChild).toHaveClass("text-red-500");
  });
});
