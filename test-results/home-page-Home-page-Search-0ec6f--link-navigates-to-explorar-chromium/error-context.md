# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home-page.spec.ts >> Home page SearchBar >> tapping the search bar link navigates to /explorar
- Location: tests/e2e/home-page.spec.ts:141:7

# Error details

```
Error: locator.click: Error: strict mode violation: locator('a[href="/explorar"]') resolved to 4 elements:
    1) <a href="/explorar">Explorar</a> aka getByRole('link', { name: 'Explorar' }).first()
    2) <a href="/explorar" class="no-underline block">…</a> aka getByRole('link', { name: 'Buscar canciones' })
    3) <a href="/explorar">…</a> aka getByRole('link', { name: 'Ver todo' })
    4) <a href="/explorar" class="flex flex-col items-center gap-1 px-[14px] py-[2px] no-underline text-muted">…</a> aka getByLabel('Navegación principal').getByRole('link', { name: 'Explorar' })

Call log:
  - waiting for locator('a[href="/explorar"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - link "Cancionero Católico" [ref=e5] [cursor=pointer]:
      - /url: /
      - img "Cancionero Católico" [ref=e6]
    - navigation [ref=e7]:
      - link "Inicio" [ref=e8] [cursor=pointer]:
        - /url: /
      - link "Explorar" [ref=e9] [cursor=pointer]:
        - /url: /explorar
      - link "Listas" [ref=e10] [cursor=pointer]:
        - /url: /listas
      - link "Mi cuenta" [ref=e11] [cursor=pointer]:
        - /url: /auth/login
  - generic [ref=e12]:
    - generic [ref=e13]:
      - img
      - generic [ref=e14]:
        - heading "¿Qué cantamos hoy?" [level=1] [ref=e15]:
          - text: ¿Qué cantamos
          - emphasis [ref=e16]: hoy
          - text: "?"
        - link "Buscar canciones" [ref=e17] [cursor=pointer]:
          - /url: /explorar
          - generic [ref=e18]:
            - img [ref=e19]
            - searchbox "Buscar canciones" [ref=e22]
    - generic [ref=e23]:
      - paragraph [ref=e24]: Momentos de la Misa
      - generic [ref=e25]:
        - link "Entrada" [ref=e26] [cursor=pointer]:
          - /url: /explorar?tag_id=10
          - generic [ref=e27]: Entrada
          - img [ref=e28]
        - link "Comunión" [ref=e30] [cursor=pointer]:
          - /url: /explorar?tag_id=20
          - generic [ref=e31]: Comunión
          - img [ref=e32]
        - link "Ofertorio" [ref=e34] [cursor=pointer]:
          - /url: /explorar?tag_id=30
          - generic [ref=e35]: Ofertorio
          - img [ref=e36]
    - generic [ref=e39]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - generic [ref=e43]: Para tu liturgia
          - heading "Más buscadas" [level=2] [ref=e44]
        - link "Ver todo" [ref=e45] [cursor=pointer]:
          - /url: /explorar
          - text: Ver todo
          - img [ref=e46]
      - generic [ref=e48]:
        - link "Pescador de Hombres Anónimo" [ref=e49] [cursor=pointer]:
          - /url: /canciones/101-pescador-de-hombres
          - generic [ref=e50]:
            - img [ref=e51]
            - generic [ref=e54]: P
          - generic [ref=e55]:
            - generic [ref=e56]: Pescador de Hombres
            - generic [ref=e57]: Anónimo
        - link "Ave María Anónimo" [ref=e58] [cursor=pointer]:
          - /url: /canciones/102-ave-maría
          - generic [ref=e59]:
            - img [ref=e60]
            - generic [ref=e63]: A
          - generic [ref=e64]:
            - generic [ref=e65]: Ave María
            - generic [ref=e66]: Anónimo
    - generic [ref=e67]:
      - generic [ref=e69]:
        - generic [ref=e70]: Catálogo
        - heading "Recién agregadas" [level=2] [ref=e71]
      - link "1 Pescador de Hombres Anónimo G" [ref=e72] [cursor=pointer]:
        - /url: /canciones/101-pescador-de-hombres
        - generic [ref=e73]: "1"
        - generic [ref=e74]:
          - img [ref=e75]
          - generic [ref=e78]: P
        - generic [ref=e79]:
          - generic [ref=e80]: Pescador de Hombres
          - generic [ref=e81]: Anónimo
        - generic [ref=e82]:
          - img [ref=e83]
          - text: G
      - link "2 Ave María Anónimo G" [ref=e86] [cursor=pointer]:
        - /url: /canciones/102-ave-maría
        - generic [ref=e87]: "2"
        - generic [ref=e88]:
          - img [ref=e89]
          - generic [ref=e92]: A
        - generic [ref=e93]:
          - generic [ref=e94]: Ave María
          - generic [ref=e95]: Anónimo
        - generic [ref=e96]:
          - img [ref=e97]
          - text: G
  - navigation "Navegación principal" [ref=e101]:
    - link "Inicio" [ref=e102] [cursor=pointer]:
      - /url: /
      - img [ref=e103]
      - generic [ref=e106]: Inicio
    - link "Explorar" [ref=e107] [cursor=pointer]:
      - /url: /explorar
      - img [ref=e108]
      - generic [ref=e111]: Explorar
    - link "Listas" [ref=e112] [cursor=pointer]:
      - /url: /listas
      - img [ref=e113]
      - generic [ref=e115]: Listas
    - link "Cuenta" [ref=e116] [cursor=pointer]:
      - /url: /login
      - img [ref=e117]
      - generic [ref=e120]: Cuenta
  - button "Open Next.js Dev Tools" [ref=e126] [cursor=pointer]:
    - img [ref=e127]
  - alert [ref=e130]
```

# Test source

```ts
  46  |   success: true,
  47  |   data: {
  48  |     count: 1,
  49  |     next: null,
  50  |     previous: null,
  51  |     results: [mockSongFactory(201, "Canto de Entrada")],
  52  |   },
  53  | };
  54  | 
  55  | const mockEmptySongs = {
  56  |   success: true,
  57  |   data: { count: 0, next: null, previous: null, results: [] },
  58  | };
  59  | 
  60  | // Regex patterns match any URL containing those paths (including trailing slash and query params)
  61  | async function mockTagsApi(page: Page) {
  62  |   await page.route(/localhost:8000\/api\/v1\/tags/, (route) =>
  63  |     route.fulfill({
  64  |       status: 200,
  65  |       contentType: "application/json",
  66  |       body: JSON.stringify(mockTags),
  67  |     })
  68  |   );
  69  | }
  70  | 
  71  | async function mockSongsApi(page: Page) {
  72  |   await page.route(/localhost:8000\/api\/v1\/songs/, (route) =>
  73  |     route.fulfill({
  74  |       status: 200,
  75  |       contentType: "application/json",
  76  |       body: JSON.stringify(mockSongs),
  77  |     })
  78  |   );
  79  | }
  80  | 
  81  | // ─────────────────────────────────────────────
  82  | //  HOME PAGE  (/)
  83  | // ─────────────────────────────────────────────
  84  | 
  85  | test.describe("Home page — real API data", () => {
  86  |   test("shows tags from API in the LiturgyMoments section", async ({ page }) => {
  87  |     await mockTagsApi(page);
  88  |     await mockSongsApi(page);
  89  |     await page.goto("/");
  90  |     await expect(page.getByText("Entrada")).toBeVisible();
  91  |     await expect(page.getByText("Comunión")).toBeVisible();
  92  |     await expect(page.getByText("Ofertorio")).toBeVisible();
  93  |   });
  94  | 
  95  |   test("does not show hardcoded mock song titles", async ({ page }) => {
  96  |     await mockTagsApi(page);
  97  |     await mockSongsApi(page);
  98  |     await page.goto("/");
  99  |     await expect(page.getByText("Pescador de Hombres")).toBeVisible();
  100 |     await expect(page.getByText("Aleluya (Taizé)")).not.toBeVisible();
  101 |     await expect(page.getByText("Dios Está Aquí")).not.toBeVisible();
  102 |   });
  103 | 
  104 |   test("shows songs from API in the latest songs section", async ({ page }) => {
  105 |     await mockTagsApi(page);
  106 |     await mockSongsApi(page);
  107 |     await page.goto("/");
  108 |     await expect(page.getByText("Ave María")).toBeVisible();
  109 |   });
  110 | });
  111 | 
  112 | // ─────────────────────────────────────────────
  113 | //  LITURGY MOMENTS → /explorar?tag_id=
  114 | // ─────────────────────────────────────────────
  115 | 
  116 | test.describe("LiturgyMoments navigation", () => {
  117 |   test("clicking a tag navigates to /explorar with tag_id param (not slug)", async ({ page }) => {
  118 |     await mockTagsApi(page);
  119 |     await mockSongsApi(page);
  120 |     await page.goto("/");
  121 |     await expect(page.getByText("Entrada")).toBeVisible();
  122 |     await page.getByText("Entrada").click();
  123 |     await expect(page).toHaveURL(/\/explorar\?.*tag_id=10/);
  124 |   });
  125 | 
  126 |   test("clicking a tag does NOT produce a ?cat= param", async ({ page }) => {
  127 |     await mockTagsApi(page);
  128 |     await mockSongsApi(page);
  129 |     await page.goto("/");
  130 |     await expect(page.getByText("Entrada")).toBeVisible();
  131 |     await page.getByText("Entrada").click();
  132 |     expect(page.url()).not.toContain("cat=");
  133 |   });
  134 | });
  135 | 
  136 | // ─────────────────────────────────────────────
  137 | //  HOME SEARCHBAR → /explorar
  138 | // ─────────────────────────────────────────────
  139 | 
  140 | test.describe("Home page SearchBar", () => {
  141 |   test("tapping the search bar link navigates to /explorar", async ({ page }) => {
  142 |     await mockTagsApi(page);
  143 |     await mockSongsApi(page);
  144 |     await page.goto("/");
  145 |     // The SearchBar is wrapped in a Link — click the link container
> 146 |     await page.locator('a[href="/explorar"]').click();
      |                                               ^ Error: locator.click: Error: strict mode violation: locator('a[href="/explorar"]') resolved to 4 elements:
  147 |     await expect(page).toHaveURL(/\/explorar/);
  148 |   });
  149 | });
  150 | 
  151 | // ─────────────────────────────────────────────
  152 | //  /explorar — filters
  153 | // ─────────────────────────────────────────────
  154 | 
  155 | test.describe("/explorar filters", () => {
  156 |   test.beforeEach(async ({ page }) => {
  157 |     await mockTagsApi(page);
  158 |   });
  159 | 
  160 |   test("shows all songs by default with total count", async ({ page }) => {
  161 |     await mockSongsApi(page);
  162 |     await page.goto("/explorar");
  163 |     await expect(page.getByText(/2 canciones/)).toBeVisible();
  164 |   });
  165 | 
  166 |   test("filters songs by search term and updates URL", async ({ page }) => {
  167 |     let capturedUrl = "";
  168 |     await page.route(/localhost:8000\/api\/v1\/songs/, (route) => {
  169 |       capturedUrl = route.request().url();
  170 |       const isSearch = route.request().url().includes("search=");
  171 |       route.fulfill({
  172 |         status: 200,
  173 |         contentType: "application/json",
  174 |         body: JSON.stringify(isSearch ? mockFilteredSongs : mockSongs),
  175 |       });
  176 |     });
  177 | 
  178 |     await page.goto("/explorar");
  179 |     await page.getByPlaceholder(/Buscar canción/).fill("entrada");
  180 |     // SearchBar debounces 300ms before calling onSearch — wait for it
  181 |     await page.waitForTimeout(400);
  182 |     await expect(page).toHaveURL(/[?&]q=entrada/);
  183 |     expect(capturedUrl).toContain("search=entrada");
  184 |   });
  185 | 
  186 |   test("filters by tag when tag chip is clicked and updates URL", async ({ page }) => {
  187 |     let capturedUrl = "";
  188 |     await page.route(/localhost:8000\/api\/v1\/songs/, (route) => {
  189 |       capturedUrl = route.request().url();
  190 |       route.fulfill({
  191 |         status: 200,
  192 |         contentType: "application/json",
  193 |         body: JSON.stringify(mockFilteredSongs),
  194 |       });
  195 |     });
  196 | 
  197 |     await page.goto("/explorar");
  198 |     await expect(page.getByRole("button", { name: "Entrada" })).toBeVisible();
  199 |     await page.getByRole("button", { name: "Entrada" }).click();
  200 |     await expect(page).toHaveURL(/[?&]tag_id=10/);
  201 |     expect(capturedUrl).toContain("tag_id=10");
  202 |   });
  203 | 
  204 |   test("navigating with ?author_id=1 sends author_id to the API", async ({ page }) => {
  205 |     let capturedUrl = "";
  206 |     await page.route(/localhost:8000\/api\/v1\/songs/, (route) => {
  207 |       capturedUrl = route.request().url();
  208 |       route.fulfill({
  209 |         status: 200,
  210 |         contentType: "application/json",
  211 |         body: JSON.stringify(mockSongs),
  212 |       });
  213 |     });
  214 | 
  215 |     await page.goto("/explorar?author_id=1");
  216 |     await page.waitForLoadState("networkidle");
  217 |     expect(capturedUrl).toContain("author_id=1");
  218 |   });
  219 | 
  220 |   test("combining tag and search filters passes both params to the API", async ({ page }) => {
  221 |     const capturedUrls: string[] = [];
  222 |     await page.route(/localhost:8000\/api\/v1\/songs/, (route) => {
  223 |       capturedUrls.push(route.request().url());
  224 |       route.fulfill({
  225 |         status: 200,
  226 |         contentType: "application/json",
  227 |         body: JSON.stringify(mockFilteredSongs),
  228 |       });
  229 |     });
  230 | 
  231 |     await page.goto("/explorar");
  232 |     await expect(page.getByRole("button", { name: "Entrada" })).toBeVisible();
  233 |     await page.getByRole("button", { name: "Entrada" }).click();
  234 |     await expect(page).toHaveURL(/tag_id=10/);
  235 | 
  236 |     await page.getByPlaceholder(/Buscar canción/).fill("canto");
  237 |     await page.waitForTimeout(400);
  238 |     await expect(page).toHaveURL(/q=canto/);
  239 | 
  240 |     const combined = capturedUrls.find(
  241 |       (u) => u.includes("tag_id=10") && u.includes("search=canto")
  242 |     );
  243 |     expect(combined).toBeTruthy();
  244 |   });
  245 | 
  246 |   test("shows empty state when no songs match", async ({ page }) => {
```