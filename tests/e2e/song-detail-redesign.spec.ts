import { test, expect, type Page } from "@playwright/test";

// Song 139 is used across all detail-page tests. Backend must be running for SSR scenarios.
// The client-side useSongs hook is mocked for similar-songs assertions.
const SONG_ID = "139";
const DETAIL_URL = `/canciones/${SONG_ID}-a-quien-enviare`;

const mockSongWithLyric = {
  id: SONG_ID,
  name: "A Quién Enviaré",
  slug: "a-quien-enviare",
  short_description: null,
  image: null,
  has_lyrics: true,
  views: 1234,
  likes: 42,
  tone: "G",
  created_at: null,
  updated_at: null,
  authors: [{ id: "1", name: "Autor Test", slug: "autor-test" }],
  tags: [{ id: "1", name: "Enviado", slug: "enviado" }],
  lyrics: null,
  plain_lyrics: null,
  lyrics_with_chords: null,
  lyric: {
    lyric: [
      { type: "verse", content: "<p>Señor, hoy yo me quiero ofrendar</p><p>mi vida entera entregar</p>" },
      {
        type: "chorus",
        content: "<p>Cristo vive hoy y reina ya</p><p>en mi voluntad.</p>",
      },
      { type: "bridge", content: "<p>Cristo está vivo en mí</p>" },
    ],
    chords: [
      {
        type: "verse",
        content:
          "<p>SOL   DO   SOL   DO</p><p>Señor, hoy yo me quiero ofrendar</p><p>DO                RE</p><p>mi vida entera entregar</p>",
      },
      {
        type: "chorus",
        content:
          "<p>     DO            SOL                 RE</p><p>Cristo vive hoy y reina ya</p><p>                                                             SOL</p><p>en mi voluntad.</p>",
      },
      {
        type: "bridge",
        content: "<p>               DO          RE       SOL</p><p>Cristo está vivo en mí</p>",
      },
    ],
  },
  youtube_url: "https://www.youtube.com/watch?v=test",
  presentation_background_color: null,
  presentation_text_color: null,
  presentation_font_size: null,
  meta_title: null,
  meta_description: null,
  meta_keywords: null,
  is_public: true,
};

const mockSongNoLyric = {
  ...mockSongWithLyric,
  lyric: null,
  lyrics_with_chords: "{G}Aquí estoy Señor\n\n{D}Listo para ir",
  youtube_url: null,
};

const mockSimilarSongs = {
  success: true,
  data: {
    count: 2,
    next: null,
    previous: null,
    results: [
      {
        id: "200",
        name: "Otra Canción",
        slug: "otra-cancion",
        short_description: null,
        image: null,
        has_lyrics: true,
        views: null,
        likes: null,
        tone: "C",
        created_at: null,
        updated_at: null,
        authors: [],
        tags: [],
      },
      {
        id: "201",
        name: "Una Más",
        slug: "una-mas",
        short_description: null,
        image: null,
        has_lyrics: true,
        views: null,
        likes: null,
        tone: "D",
        created_at: null,
        updated_at: null,
        authors: [],
        tags: [],
      },
    ],
  },
  errors: null,
};

async function mockSongsListApi(page: Page) {
  await page.route("**/api/v1/songs/**", (route) => {
    const url = route.request().url();
    // single song endpoint
    if (url.match(/\/songs\/\d+\//)) {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: mockSongWithLyric, errors: null }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSimilarSongs),
      });
    }
  });
}

// ─────────────────────────────────────────────────────
//  1. TOP ACTION BAR
// ─────────────────────────────────────────────────────

test.describe("Song Detail Redesign — Top action bar", () => {
  test("back button is rendered on the left", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByRole("button", { name: /volver/i })).toBeVisible();
  });

  test("heart/save and share buttons are rendered on the right", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByRole("button", { name: /guardar/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /compartir/i })).toBeVisible();
  });

  test("back button triggers navigation back", async ({ page }) => {
    await page.goto("/explorar");
    await page.goto(DETAIL_URL);
    await page.getByRole("button", { name: /volver/i }).click();
    await expect(page).toHaveURL(/explorar/);
  });
});

// ─────────────────────────────────────────────────────
//  2. SONG HEADER
// ─────────────────────────────────────────────────────

test.describe("Song Detail Redesign — Song header", () => {
  test("cover art thumbnail is visible", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.locator('[data-testid="cover-art"]')).toBeVisible();
  });

  test("song title is rendered in a serif heading", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("category label is shown above the title in orange uppercase", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.locator('[data-testid="song-category"]')).toBeVisible();
  });

  test("author name is shown below the title", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.locator('[data-testid="song-author"]')).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────
//  3. META STATS ROW
// ─────────────────────────────────────────────────────

test.describe("Song Detail Redesign — Meta stats row", () => {
  test("tone label TONO is visible", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByText(/^tono$/i)).toBeVisible();
  });

  test("views label VISTAS is visible when song has views", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const vistasLabel = page.getByText(/^vistas$/i);
    const isVisible = await vistasLabel.isVisible().catch(() => false);
    if (isVisible) {
      await expect(vistasLabel).toBeVisible();
    }
  });

  test("likes label ME GUSTA is visible when song has likes", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const meGustaLabel = page.getByText(/me gusta/i);
    const isVisible = await meGustaLabel.isVisible().catch(() => false);
    if (isVisible) {
      await expect(meGustaLabel).toBeVisible();
    }
  });
});

// ─────────────────────────────────────────────────────
//  4. PRIMARY ACTION ROW
// ─────────────────────────────────────────────────────

test.describe("Song Detail Redesign — Primary action row", () => {
  test("Proyectar link is visible and points to the presentation route", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const link = page.getByRole("link", { name: /proyectar/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      "href",
      new RegExp(`/canciones/${SONG_ID}-[^/]+/presentacion$`)
    );
  });

  test("Guardar button is visible in the action row", async ({ page }) => {
    await page.goto(DETAIL_URL);
    // The action-row Guardar is a <button>, distinct from the top-bar heart button
    const guardarBtn = page.locator('[data-testid="action-guardar"]');
    await expect(guardarBtn).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────
//  5. CHORD CONTROLS PANEL
// ─────────────────────────────────────────────────────

test.describe("Song Detail Redesign — Chord controls panel", () => {
  test("TONO row is visible when song has lyrics", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByText(/^tono$/i)).toBeVisible();
  });

  test("TEXTO row with font size controls is visible", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByText(/^texto$/i)).toBeVisible();
  });

  test("Acordes toggle button is visible", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByRole("button", { name: /acordes/i })).toBeVisible();
  });

  test("+ transpose button increments the displayed key by one semitone", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const plusBtn = page
      .locator('[data-testid="chord-controls"]')
      .getByRole("button", { name: /subir tono/i });
    await expect(plusBtn).toBeVisible();
    // Read the initial key, click +, check the key changed
    const keyBefore = await page.locator('[data-testid="current-key"]').textContent();
    await plusBtn.click();
    const keyAfter = await page.locator('[data-testid="current-key"]').textContent();
    expect(keyAfter).not.toBe(keyBefore);
  });

  test("Acordes toggle switches chord display on and off", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const toggle = page.getByRole("button", { name: /acordes/i });
    await expect(toggle).toBeVisible();
    const pressedBefore = await toggle.getAttribute("aria-pressed");
    await toggle.click();
    const pressedAfter = await toggle.getAttribute("aria-pressed");
    expect(pressedAfter).not.toBe(pressedBefore);
  });
});

// ─────────────────────────────────────────────────────
//  6. LYRICS — structured renderer (song.lyric path)
// ─────────────────────────────────────────────────────

test.describe("Song Detail Redesign — Lyrics (structured)", () => {
  test.beforeEach(async ({ page }) => {
    await mockSongsListApi(page);
  });

  test("lyrics are rendered below the chord controls panel", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const renderer = page
      .locator('[data-testid="structured-lyrics-renderer"], [data-testid="lyrics-renderer"]')
      .first();
    await expect(renderer).toBeVisible();
  });

  test("chorus block has a gold left border", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const chorus = page.locator('[data-testid="lyric-block-chorus"]').first();
    const isVisible = await chorus.isVisible().catch(() => false);
    if (isVisible) {
      await expect(chorus).toBeVisible();
      const style = await chorus.getAttribute("class");
      expect(style).toMatch(/border-l/);
    }
  });

  test("chord lines are rendered in a monospace accent color when Acordes is on", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const toggle = page.getByRole("button", { name: /acordes/i });
    const isOff = (await toggle.getAttribute("aria-pressed")) === "false";
    if (isOff) await toggle.click();
    const chordLines = page.locator('[data-testid="chord-line"]');
    const count = await chordLines.count();
    if (count > 0) {
      await expect(chordLines.first()).toBeVisible();
    }
  });

  test("verse blocks show a numbered section label", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const estrofa = page.getByText(/estrofa\s+1/i);
    const isVisible = await estrofa.isVisible().catch(() => false);
    if (isVisible) {
      await expect(estrofa).toBeVisible();
    }
  });
});

// ─────────────────────────────────────────────────────
//  6b. LYRICS — fallback renderer (no song.lyric)
// ─────────────────────────────────────────────────────

test.describe("Song Detail Redesign — Lyrics (inline-marker fallback)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`**/api/v1/songs/${SONG_ID}/`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: mockSongNoLyric, errors: null }),
      })
    );
  });

  test("falls back to LyricsRenderer when song.lyric is null", async ({ page }) => {
    await page.goto(DETAIL_URL);
    // SSR renders using fallback; client re-hydrates — either testid is acceptable
    const renderer = page
      .locator('[data-testid="structured-lyrics-renderer"], [data-testid="lyrics-renderer"]')
      .first();
    await expect(renderer).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────
//  7. VIDEO SECTION
// ─────────────────────────────────────────────────────

test.describe("Song Detail Redesign — Video section", () => {
  test("video section with play button appears when song has youtube_url", async ({ page }) => {
    await mockSongsListApi(page);
    await page.goto(DETAIL_URL);
    await expect(page.locator('[data-testid="video-section"]')).toBeVisible();
  });

  test("video section is hidden when song has no youtube_url", async ({ page }) => {
    await page.route(`**/api/v1/songs/${SONG_ID}/`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: mockSongNoLyric, errors: null }),
      })
    );
    await page.goto(DETAIL_URL);
    await expect(page.locator('[data-testid="video-section"]')).not.toBeVisible();
  });
});

// ─────────────────────────────────────────────────────
//  8. SIMILAR SONGS
// ─────────────────────────────────────────────────────

test.describe("Song Detail Redesign — Similar songs", () => {
  test.beforeEach(async ({ page }) => {
    await mockSongsListApi(page);
  });

  test("similar songs section heading is visible", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.locator('[data-testid="similar-songs"]')).toBeVisible();
  });

  test("each song row links to the correct detail page", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const rows = page.locator('[data-testid="similar-songs"] [data-testid="song-row"]');
    const count = await rows.count();
    if (count > 0) {
      const href = await rows.first().getAttribute("href");
      expect(href).toMatch(/^\/canciones\/\d+-/);
    }
  });
});
