import { test, expect, type Page } from "@playwright/test";

const BACKEND = "http://localhost:8000/api";

async function seedAuthState(page: Page) {
  // Set the httpOnly session cookie so the proxy middleware grants access to /perfil.
  // Value is base64url-encoded JSON matching the format written by buildSetCookieHeader.
  const sessionPayload = Buffer.from(
    JSON.stringify({ refreshToken: "mock-refresh-token" })
  ).toString("base64url");

  await page.context().addCookies([
    {
      name: "cc_session",
      value: sessionPayload,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);

  // Populate Zustand auth store so perfil/page.tsx renders user data immediately.
  await page.addInitScript(() => {
    const user = {
      id: "1",
      email: "david@example.com",
      name: "David",
      can_create_songs: false,
      can_publish_songs: false,
      can_create_playlists: true,
    };
    localStorage.setItem(
      "cc-auth",
      JSON.stringify({ state: { user, isAuthenticated: true }, version: 0 })
    );
  });

  // Intercept the BFF refresh route so the Axios client can acquire a memory token
  // on the first 401, enabling authenticated requests to the favorites API.
  await page.route("/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ access: "mock-access-token" }),
    })
  );
}

async function mockFavoritesEmpty(page: Page) {
  await page.route(`${BACKEND}/v1/profile/favorites/**`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { results: [], count: 0, next: null, previous: null },
        errors: null,
        status: 200,
      }),
    })
  );
}

async function mockFavoritesWithSongs(page: Page) {
  const songs = [
    { id: "10", name: "Canto de Entrada", slug: "canto-de-entrada", short_description: null, image: null, has_lyrics: true, views: 10, likes: 5, tone: "Do", created_at: null, updated_at: null, authors: [], tags: [] },
    { id: "11", name: "Aleluya", slug: "aleluya", short_description: null, image: null, has_lyrics: true, views: 20, likes: 8, tone: "Re", created_at: null, updated_at: null, authors: [], tags: [] },
  ];
  await page.route(`${BACKEND}/v1/profile/favorites/**`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { results: songs, count: 2, next: null, previous: null },
        errors: null,
        status: 200,
      }),
    })
  );
}

async function mockFavoritesSearchMatch(page: Page) {
  const songs = [
    { id: "10", name: "Canto de Entrada", slug: "canto-de-entrada", short_description: null, image: null, has_lyrics: true, views: 10, likes: 5, tone: "Do", created_at: null, updated_at: null, authors: [], tags: [] },
  ];
  await page.route(`${BACKEND}/v1/profile/favorites/**`, (route) => {
    const url = new URL(route.request().url());
    const search = url.searchParams.get("search");
    const results = search
      ? songs.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      : songs;
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { results, count: results.length, next: null, previous: null },
        errors: null,
        status: 200,
      }),
    });
  });
}

test.describe("Song Favorites — /perfil page", () => {
  test("shows user name and email in the header", async ({ page }) => {
    await seedAuthState(page);
    await mockFavoritesEmpty(page);
    await page.goto("/perfil");
    await expect(page.getByText("David")).toBeVisible();
    await expect(page.getByText("david@example.com")).toBeVisible();
  });

  test("has three tabs: Favoritos, Listas, Cuenta", async ({ page }) => {
    await seedAuthState(page);
    await mockFavoritesEmpty(page);
    await page.goto("/perfil");
    await expect(page.getByRole("tab", { name: "Favoritos" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Listas" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Cuenta" })).toBeVisible();
  });

  test("Favoritos tab is active by default", async ({ page }) => {
    await seedAuthState(page);
    await mockFavoritesEmpty(page);
    await page.goto("/perfil");
    await expect(page.getByRole("tab", { name: "Favoritos" })).toHaveAttribute(
      "data-selected",
      "true"
    );
  });

  test("lists favorite songs with a search bar visible", async ({ page }) => {
    await seedAuthState(page);
    await mockFavoritesWithSongs(page);
    await page.goto("/perfil");
    await expect(page.getByText("Canto de Entrada")).toBeVisible();
    await expect(page.getByText("Aleluya")).toBeVisible();
    await expect(page.getByPlaceholder(/buscar/i)).toBeVisible();
  });

  test("shows empty state when user has no favorites", async ({ page }) => {
    await seedAuthState(page);
    await mockFavoritesEmpty(page);
    await page.goto("/perfil");
    await expect(page.getByText(/no tienes canciones favoritas/i)).toBeVisible();
  });

  test("filters favorites when searching", async ({ page }) => {
    await seedAuthState(page);
    await mockFavoritesSearchMatch(page);
    await page.goto("/perfil");
    const search = page.getByPlaceholder(/buscar/i);
    await search.fill("Canto");
    await expect(page.getByText("Canto de Entrada")).toBeVisible();
    await expect(page.getByText("Aleluya")).not.toBeVisible();
  });

  test("shows no-results message when search matches nothing", async ({ page }) => {
    await seedAuthState(page);
    await page.route(`${BACKEND}/v1/profile/favorites/**`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { results: [], count: 0, next: null, previous: null },
          errors: null,
          status: 200,
        }),
      })
    );
    await page.goto("/perfil");
    const search = page.getByPlaceholder(/buscar/i);
    await search.fill("xyznotfound");
    await expect(page.getByText(/no se encontraron canciones/i)).toBeVisible();
  });
});
