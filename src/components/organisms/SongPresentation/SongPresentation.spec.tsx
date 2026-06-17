import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { SongPresentation } from "./SongPresentation";
import type { Song, SongPresentationSlide } from "@/types/song";

const mockSong: Song = {
  id: "136",
  name: "Cristo Vive en Mi",
  slug: "cristo-vive-en-mi",
  short_description: null,
  image: null,
  has_lyrics: true,
  views: null,
  likes: null,
  tone: null,
  created_at: null,
  updated_at: null,
  authors: [{ id: "1", name: "David A. Mijares", slug: "david-a-mijares" }],
  tags: [],
  plain_lyrics: null,
  lyrics: null,
  lyrics_with_chords: null,
  youtube_url: null,
  presentation_background_color: null,
  presentation_text_color: null,
  presentation_font_size: null,
  meta_title: null,
  meta_description: null,
  meta_keywords: null,
  is_public: true,
};

const slides: SongPresentationSlide[] = [
  { type: "presentation", song: mockSong, label: null, content: null },
  { type: "standard", song: mockSong, content: "<p>Señor, hoy yo me quiero ofrendar</p>" },
  { type: "standard", song: mockSong, label: "Estribillo", content: "<p>Cristo vive en mí</p>" },
  { type: "standard", song: mockSong, content: "<p>Señor, me quiero comprometer</p>" },
  { type: "standard", song: mockSong, content: "<p>Cristo está vivo en mí</p>" },
];

describe("Song Presentation Slideshow", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it("first slide shows song title and authors", () => {
    render(<SongPresentation slides={slides} />);
    expect(screen.getByText("Cristo Vive en Mi")).toBeInTheDocument();
    expect(screen.getByText(/M,L: David A\. Mijares/)).toBeInTheDocument();
  });

  it("lyric slides render HTML content without chord markers", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    await user.keyboard("{ArrowRight}");
    expect(
      screen.getByText(/Señor, hoy yo me quiero ofrendar/)
    ).toBeInTheDocument();
  });

  it("chorus slide shows Estribillo label", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Estribillo")).toBeInTheDocument();
  });

  it("non-chorus slides do not show a section label", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    await user.keyboard("{ArrowRight}");
    expect(screen.queryByText("Estribillo")).not.toBeInTheDocument();
  });

  it("applies dark background and light text colors", () => {
    render(
      <SongPresentation slides={slides} bgColor="#202020" textColor="#ffffff" />
    );
    const container = screen.getByTestId("song-presentation");
    expect(container).toHaveStyle({ backgroundColor: "#202020", color: "#ffffff" });
  });

  // ── Progress bar ───────────────────────────────────────────────────────────

  it("shows progress bar reflecting position 1 of 5 on first slide", () => {
    render(<SongPresentation slides={slides} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "1");
    expect(bar).toHaveAttribute("aria-valuemax", "5");
  });

  it("progress bar advances to position 2 after navigating forward", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  });

  // ── Keyboard navigation ────────────────────────────────────────────────────

  it("ArrowRight key advances to the next slide", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    await user.keyboard("{ArrowRight}");
    expect(
      screen.getByText(/Señor, hoy yo me quiero ofrendar/)
    ).toBeInTheDocument();
  });

  it("ArrowLeft key goes back to the previous slide", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("Cristo Vive en Mi")).toBeInTheDocument();
  });

  it("ArrowRight key does nothing on the last slide", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    for (let i = 0; i < 5; i++) await user.keyboard("{ArrowRight}");
    expect(screen.getByText(/Cristo está vivo en mí/)).toBeInTheDocument();
  });

  it("ArrowLeft key does nothing on the first slide", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("Cristo Vive en Mi")).toBeInTheDocument();
  });

  // ── Button navigation ──────────────────────────────────────────────────────

  it("next button advances to the next slide", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    await user.click(
      screen.getByRole("button", { name: /siguiente diapositiva/i })
    );
    expect(
      screen.getByText(/Señor, hoy yo me quiero ofrendar/)
    ).toBeInTheDocument();
  });

  it("previous button goes back to the prior slide", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    await user.click(
      screen.getByRole("button", { name: /siguiente diapositiva/i })
    );
    await user.click(
      screen.getByRole("button", { name: /diapositiva anterior/i })
    );
    expect(screen.getByText("Cristo Vive en Mi")).toBeInTheDocument();
  });

  it("previous button is not rendered on the first slide", () => {
    render(<SongPresentation slides={slides} />);
    expect(
      screen.queryByRole("button", { name: /diapositiva anterior/i })
    ).not.toBeInTheDocument();
  });

  it("next button is not rendered on the last slide", async () => {
    const user = userEvent.setup();
    render(<SongPresentation slides={slides} />);
    for (let i = 0; i < 4; i++) await user.keyboard("{ArrowRight}");
    expect(
      screen.queryByRole("button", { name: /siguiente diapositiva/i })
    ).not.toBeInTheDocument();
  });
});
