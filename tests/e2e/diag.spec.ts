import { test } from "@playwright/test";

const MOCK_TAGS = {
  success: true,
  data: {
    count: 1,
    next: null,
    previous: null,
    results: [{ id: 10, name: "EntradaDEBUG", slug: "entrada", parent_id: null }],
  },
};

const MOCK_SONGS = {
  success: true,
  data: {
    count: 1,
    next: null,
    previous: null,
    results: [{ id: 101, name: "PruebaCancionDEBUG", slug: "prueba", tone: "G", views: 0, is_public: true, plain_lyrics: "", tags: [], authors: [] }],
  },
};

test("DEBUG home - mock intercepted and data renders", async ({ page }) => {
  let tagsCalled = false;
  let songsCalled = false;

  await page.route(/localhost:8000/, (route) => {
    const url = route.request().url();
    if (url.includes("tags")) { tagsCalled = true; }
    if (url.includes("songs")) { songsCalled = true; }
    console.log("INTERCEPTED:", url);
    if (url.includes("tags")) {
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_TAGS) });
    } else if (url.includes("songs")) {
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_SONGS) });
    } else {
      route.continue();
    }
  });

  await page.goto("/");
  await page.waitForTimeout(3000);

  const innerText = await page.evaluate(() => document.body.innerText);
  console.log("tagsCalled:", tagsCalled, "songsCalled:", songsCalled);
  console.log("=== HOME INNER TEXT ===");
  console.log(innerText.substring(0, 800));
});

test("DEBUG explorar - mock intercepted and data renders", async ({ page }) => {
  let tagsCalled = false;
  let songsCalled = false;

  await page.route(/localhost:8000/, (route) => {
    const url = route.request().url();
    if (url.includes("tags")) { tagsCalled = true; }
    if (url.includes("songs")) { songsCalled = true; }
    if (url.includes("tags")) {
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_TAGS) });
    } else if (url.includes("songs")) {
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_SONGS) });
    } else {
      route.continue();
    }
  });

  await page.goto("/explorar");
  await page.waitForTimeout(3000);

  const innerText = await page.evaluate(() => document.body.innerText);
  console.log("tagsCalled:", tagsCalled, "songsCalled:", songsCalled);
  console.log("=== EXPLORAR INNER TEXT ===");
  console.log(innerText.substring(0, 800));
});
