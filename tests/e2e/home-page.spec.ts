import { test, expect, type Page } from "@playwright/test";

const BACKEND = "http://localhost:8000/api";

const mockTags = {
  success: true,
  data: {
    count: 3,
    next: null,
    previous: null,
    results: [
      { id: 10, name: "Entrada", slug: "entrada", parent_id: null },
      { id: 20, name: "Comunión", slug: "comunion", parent_id: null },
      { id: 30, name: "Ofertorio", slug: "ofertorio", parent_id: null },
    ],
  },
};

const mockSongFactory = (id: number, name: string) => ({
  id,
  name,
  slug: name.toLowerCase().replace(/\s/g, "-"),
  tone: "G",
  views: 0,
  is_public: true,
  plain_lyrics: "",
  tags: [],
  authors: [{ id: 1, name: "Anónimo", image: "", bio: "", slug: "anonimo" }],
  lyrics: { lyric: [], chords: [] },
});

const mockSongs = {
  success: true,
  data: {
    count: 2,
    next: null,
    previous: null,
    results: [
      mockSongFactory(101, "Pescador de Hombres"),
      mockSongFactory(102, "Ave María"),
    ],
  },
};

const mockFilteredSongs = {
  success: true,
  data: {
    count: 1,
    next: null,
    previous: null,
    results: [mockSongFactory(201, "Canto de Entrada")],
  },
};

const mockEmptySongs = {
  success: true,
  data: { count: 0, next: null, previous: null, results: [] },
};

// Regex patterns match any URL containing those paths (including trailing slash and query params)
async function mockTagsApi(page: Page) {
  await page.route(/localhost:8000\/api\/v1\/tags/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockTags),
    })
  );
}

async function mockSongsApi(page: Page) {
  await page.route(/localhost:8000\/api\/v1\/songs/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSongs),
    })
  );
}

// ─────────────────────────────────────────────
//  HOME PAGE  (/)
// ─────────────────────────────────────────────

test.describe("Home page — real API data", () => {
  test("shows tags from API in the LiturgyMoments section", async ({ page }) => {
    await mockTagsApi(page);
    await mockSongsApi(page);
    await page.goto("/");
    await expect(page.getByText("Entrada")).toBeVisible();
    await expect(page.getByText("Comunión")).toBeVisible();
    await expect(page.getByText("Ofertorio")).toBeVisible();
  });

  test("does not show hardcoded mock song titles", async ({ page }) => {
    await mockTagsApi(page);
    await mockSongsApi(page);
    await page.goto("/");
    await expect(page.getByText("Pescador de Hombres")).toBeVisible();
    await expect(page.getByText("Aleluya (Taizé)")).not.toBeVisible();
    await expect(page.getByText("Dios Está Aquí")).not.toBeVisible();
  });

  test("shows songs from API in the latest songs section", async ({ page }) => {
    await mockTagsApi(page);
    await mockSongsApi(page);
    await page.goto("/");
    await expect(page.getByText("Ave María")).toBeVisible();
  });
});

// ─────────────────────────────────────────────
//  LITURGY MOMENTS → /explorar?tag_id=
// ─────────────────────────────────────────────

test.describe("LiturgyMoments navigation", () => {
  test("clicking a tag navigates to /explorar with tag_id param (not slug)", async ({ page }) => {
    await mockTagsApi(page);
    await mockSongsApi(page);
    await page.goto("/");
    await expect(page.getByText("Entrada")).toBeVisible();
    await page.getByText("Entrada").click();
    await expect(page).toHaveURL(/\/explorar\?.*tag_id=10/);
  });

  test("clicking a tag does NOT produce a ?cat= param", async ({ page }) => {
    await mockTagsApi(page);
    await mockSongsApi(page);
    await page.goto("/");
    await expect(page.getByText("Entrada")).toBeVisible();
    await page.getByText("Entrada").click();
    expect(page.url()).not.toContain("cat=");
  });
});

// ─────────────────────────────────────────────
//  HOME SEARCHBAR → /explorar
// ─────────────────────────────────────────────

test.describe("Home page SearchBar", () => {
  test("tapping the search bar link navigates to /explorar", async ({ page }) => {
    await mockTagsApi(page);
    await mockSongsApi(page);
    await page.goto("/");
    // The SearchBar is wrapped in a Link — click the link container
    await page.locator('a[href="/explorar"]').click();
    await expect(page).toHaveURL(/\/explorar/);
  });
});

// ─────────────────────────────────────────────
//  /explorar — filters
// ─────────────────────────────────────────────

test.describe("/explorar filters", () => {
  test.beforeEach(async ({ page }) => {
    await mockTagsApi(page);
  });

  test("shows all songs by default with total count", async ({ page }) => {
    await mockSongsApi(page);
    await page.goto("/explorar");
    await expect(page.getByText(/2 canciones/)).toBeVisible();
  });

  test("filters songs by search term and updates URL", async ({ page }) => {
    let capturedUrl = "";
    await page.route(/localhost:8000\/api\/v1\/songs/, (route) => {
      capturedUrl = route.request().url();
      const isSearch = route.request().url().includes("search=");
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(isSearch ? mockFilteredSongs : mockSongs),
      });
    });

    await page.goto("/explorar");
    await page.getByPlaceholder(/Buscar canción/).fill("entrada");
    // SearchBar debounces 300ms before calling onSearch — wait for it
    await page.waitForTimeout(400);
    await expect(page).toHaveURL(/[?&]q=entrada/);
    expect(capturedUrl).toContain("search=entrada");
  });

  test("filters by tag when tag chip is clicked and updates URL", async ({ page }) => {
    let capturedUrl = "";
    await page.route(/localhost:8000\/api\/v1\/songs/, (route) => {
      capturedUrl = route.request().url();
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockFilteredSongs),
      });
    });

    await page.goto("/explorar");
    await expect(page.getByRole("button", { name: "Entrada" })).toBeVisible();
    await page.getByRole("button", { name: "Entrada" }).click();
    await expect(page).toHaveURL(/[?&]tag_id=10/);
    expect(capturedUrl).toContain("tag_id=10");
  });

  test("navigating with ?author_id=1 sends author_id to the API", async ({ page }) => {
    let capturedUrl = "";
    await page.route(/localhost:8000\/api\/v1\/songs/, (route) => {
      capturedUrl = route.request().url();
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSongs),
      });
    });

    await page.goto("/explorar?author_id=1");
    await page.waitForLoadState("networkidle");
    expect(capturedUrl).toContain("author_id=1");
  });

  test("combining tag and search filters passes both params to the API", async ({ page }) => {
    const capturedUrls: string[] = [];
    await page.route(/localhost:8000\/api\/v1\/songs/, (route) => {
      capturedUrls.push(route.request().url());
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockFilteredSongs),
      });
    });

    await page.goto("/explorar");
    await expect(page.getByRole("button", { name: "Entrada" })).toBeVisible();
    await page.getByRole("button", { name: "Entrada" }).click();
    await expect(page).toHaveURL(/tag_id=10/);

    await page.getByPlaceholder(/Buscar canción/).fill("canto");
    await page.waitForTimeout(400);
    await expect(page).toHaveURL(/q=canto/);

    const combined = capturedUrls.find(
      (u) => u.includes("tag_id=10") && u.includes("search=canto")
    );
    expect(combined).toBeTruthy();
  });

  test("shows empty state when no songs match", async ({ page }) => {
    await page.route(/localhost:8000\/api\/v1\/songs/, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockEmptySongs),
      })
    );
    await page.goto("/explorar");
    await expect(page.getByText("No se encontraron canciones")).toBeVisible();
  });
});
