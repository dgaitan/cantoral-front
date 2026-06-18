import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChordControls } from "./ChordControls";

// The API sends song.tone in Spanish notation with title case ("Sol", "Re", "Lam").
// ChordControls uses transposeKey which handles both Spanish and English notation.

const defaultProps = {
  steps: 0,
  onStepsChange: vi.fn(),
  showChords: true,
  onShowChordsChange: vi.fn(),
  fontSize: 18,
  onFontSizeChange: vi.fn(),
  baseKey: "Sol",
};

describe("Chord Transport — ChordControls", () => {
  // ── Tone buttons ─────────────────────────────────────────────────────────────

  it("pressing 'Subir tono' calls onStepsChange with steps + 1", async () => {
    const onStepsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ChordControls {...defaultProps} steps={0} onStepsChange={onStepsChange} />
    );
    await user.click(screen.getByRole("button", { name: /subir tono/i }));
    expect(onStepsChange).toHaveBeenCalledWith(1);
  });

  it("pressing 'Bajar tono' calls onStepsChange with steps - 1", async () => {
    const onStepsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ChordControls {...defaultProps} steps={0} onStepsChange={onStepsChange} />
    );
    await user.click(screen.getByRole("button", { name: /bajar tono/i }));
    expect(onStepsChange).toHaveBeenCalledWith(-1);
  });

  // ── Key display ──────────────────────────────────────────────────────────────

  it("shows the original key when steps is zero", () => {
    // transposeKey returns key unchanged at steps=0
    render(<ChordControls {...defaultProps} baseKey="Sol" steps={0} />);
    expect(screen.getByTestId("current-key")).toHaveTextContent("Sol");
  });

  it("shows the transposed key when steps is non-zero (Sol + 2 = LA)", () => {
    render(<ChordControls {...defaultProps} baseKey="Sol" steps={2} />);
    // "Sol".toUpperCase()="SOL"=G, G+2=A=LA
    expect(screen.getByTestId("current-key")).toHaveTextContent("LA");
  });

  it("shows the step offset indicator when steps is non-zero", () => {
    render(<ChordControls {...defaultProps} baseKey="Sol" steps={3} />);
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("hides the step offset indicator when steps is zero", () => {
    render(<ChordControls {...defaultProps} baseKey="Sol" steps={0} />);
    expect(screen.queryByText(/^[+-]\d+$/)).not.toBeInTheDocument();
  });

  // ── Chords toggle ────────────────────────────────────────────────────────────

  it("pressing 'Acordes' calls onShowChordsChange with false when chords are shown", async () => {
    const onShowChordsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ChordControls
        {...defaultProps}
        showChords={true}
        onShowChordsChange={onShowChordsChange}
      />
    );
    await user.click(screen.getByRole("button", { name: /acordes/i }));
    expect(onShowChordsChange).toHaveBeenCalledWith(false);
  });
});
