import { test, expect, type Page } from "@playwright/test";

// Song 139 (Fija Tus Ojos En Cristo) is used for detail-page tests — backend must be running.
// The slug portion of the URL is ignored by parseSongParam; only the ID matters.
const SONG_ID = "139";
const DETAIL_URL = `/canciones/${SONG_ID}-a-quien-enviare`;
const PRESENTACION_URL = `${DETAIL_URL}/presentacion`;

// Mock for the client-side useSong hook (presentation page uses Axios, not SSR fetch).
const mockSong = {
  id: SONG_ID,
  name: "A Quién Enviaré",
  slug: "a-quien-enviare",
  short_description: null,
  image: null,
  has_lyrics: true,
  views: null,
  likes: null,
  tone: "G",
  created_at: null,
  updated_at: null,
  authors: [],
  tags: [{ id: "1", name: "Enviado", slug: "enviado" }],
  lyrics: null,
  plain_lyrics: null,
  lyrics_with_chords: "{G}Aquí estoy Señor\n\n{D}Listo para ir",
  lyric: null,
  youtube_url: null,
  presentation_background_color: null,
  presentation_text_color: null,
  presentation_font_size: null,
  meta_title: null,
  meta_description: null,
  meta_keywords: null,
  is_public: true,
};

async function mockClientSongApi(page: Page, song = mockSong) {
  await page.route(`**/api/v1/songs/${SONG_ID}/`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: song, errors: null }),
    })
  );
}

// ─────────────────────────────────────────────
//  SONG DETAIL  (/canciones/{id}-{slug})
//  These tests rely on a live backend (server-side fetch, cannot mock).
// ─────────────────────────────────────────────

test.describe("Song Detail Page", () => {
  test("user can navigate to the song detail page via the canonical URL", async ({ page }) => {
    const response = await page.goto(DETAIL_URL);
    expect(response?.status()).toBe(200);
    // A 404 heading means the backend song fetch failed even though the URL stays the same.
    await expect(page.getByRole("heading", { name: "404", exact: true })).not.toBeVisible();
  });

  test("song detail page displays the song title prominently", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText("404");
  });

  test("song detail page displays lyrics when available", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.locator('[data-testid="lyrics-renderer"]')).toBeVisible();
  });

  // The v1 API returns lyrics in a structured format (plain_lyrics field) that does not
  // include inline {chord} markers. This scenario requires a song migrated to the
  // {Am}word format — skip until that data is available.
  test.skip("song detail page displays chords above lyrics when available", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const lyricsContainer = page.locator('[data-testid="lyrics-renderer"]');
    await expect(lyricsContainer).toBeVisible();
    const chordSpan = lyricsContainer.locator("span").filter({ hasText: /^[A-G][#b]?m?$/ });
    await expect(chordSpan.first()).toBeVisible();
  });

  // Requires a song with neither plain_lyrics nor lyrics_with_chords — skip until fixture available.
  test.skip("song detail page shows a fallback when no lyrics are available", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByText("Esta canción no tiene letra disponible.")).toBeVisible();
  });

  test("song detail page shows a Presentar link to the presentation URL", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const link = page.getByRole("link", { name: "Presentar", exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", new RegExp(`/canciones/${SONG_ID}-[^/]+/presentacion$`));
  });

  test("unknown song URL returns a 404 page", async ({ page }) => {
    const response = await page.goto("/canciones/999999-cancion-inexistente");
    expect(response?.status()).toBe(404);
  });
});

// ─────────────────────────────────────────────
//  PRESENTATION  (/canciones/{id}-{slug}/presentacion)
//  The presentation page uses useSong (client-side Axios), so we mock the API.
//  Dock controls (A+/−, transpose, chords) are Chromium-only: Reveal.js renders
//  its fixed-position container differently on the Mobile Chrome viewport.
// ─────────────────────────────────────────────

test.describe("Song Presentation Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockClientSongApi(page);
  });

  test("user can navigate to the presentation page and see the song name", async ({ page }) => {
    await page.goto(PRESENTACION_URL);
    await expect(page.getByText(mockSong.name)).toBeVisible();
  });

  test("presentation page displays the song lyrics as slides", async ({ page }) => {
    await page.goto(PRESENTACION_URL);
    // Reveal.js may keep the outer deck container hidden while initialising on some viewports.
    // Check slide text directly; scope to <pre> to avoid the aria-live duplicate.
    await expect(page.locator("pre").filter({ hasText: "Aquí estoy Señor" }).first()).toBeVisible();
  });

  test("close button navigates back to the song detail page", async ({ page }) => {
    await page.goto(PRESENTACION_URL);
    await page.getByRole("link", { name: /cerrar presentación/i }).click();
    await expect(page).toHaveURL(new RegExp(`/canciones/${SONG_ID}-`));
  });

  test("Acordes toggle button is visible in the dock", async ({ page }) => {
    await page.goto(PRESENTACION_URL);
    await expect(page.getByRole("button", { name: /acordes/i })).toBeVisible();
  });

  test("toggling Acordes makes chords visible in the slide text", async ({ page, isMobile }) => {
    test.skip(isMobile, "Presentation dock targets desktop/projector use");
    await page.goto(PRESENTACION_URL);
    const acordesBtn = page.getByRole("button", { name: /acordes/i });
    await expect(acordesBtn).toBeVisible();
    await expect(acordesBtn).toHaveAttribute("aria-pressed", "false");
    await acordesBtn.click();
    await expect(acordesBtn).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("pre").filter({ hasText: /\[G\]/ }).first()).toBeVisible();
  });

  test("A+ button increases the lyric font size", async ({ page, isMobile }) => {
    test.skip(isMobile, "Presentation dock targets desktop/projector use");
    await page.goto(PRESENTACION_URL);
    const deck = page.locator('[data-testid="reveal-presentation"]');
    await expect(deck).toHaveCSS("font-size", "28px");
    await page.getByRole("button", { name: "A+", exact: true }).click();
    await expect(deck).toHaveCSS("font-size", "30px");
  });

  test("+ transpose button shifts the displayed key up by one semitone", async ({ page, isMobile }) => {
    test.skip(isMobile, "Presentation dock targets desktop/projector use");
    await page.goto(PRESENTACION_URL);
    await expect(page.getByText("G")).toBeVisible();
    await page.getByRole("button", { name: "+", exact: true }).click();
    await expect(page.getByText("G#")).toBeVisible();
  });

  test("− transpose button shifts the displayed key down by one semitone", async ({ page, isMobile }) => {
    test.skip(isMobile, "Presentation dock targets desktop/projector use");
    await page.goto(PRESENTACION_URL);
    await expect(page.getByText("G")).toBeVisible();
    await page.getByRole("button", { name: "−", exact: true }).click();
    await expect(page.getByText("F#")).toBeVisible();
  });
});
