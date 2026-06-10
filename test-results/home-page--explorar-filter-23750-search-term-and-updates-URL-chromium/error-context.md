# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home-page.spec.ts >> /explorar filters >> filters songs by search term and updates URL
- Location: tests/e2e/home-page.spec.ts:166:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "search=entrada"
Received string:    "http://localhost:8000/api/v1/songs/"
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
  - banner [ref=e12]:
    - link "Cancionero Católico" [ref=e13] [cursor=pointer]:
      - /url: /
      - img "Cancionero Católico" [ref=e14]
    - generic [ref=e15]:
      - link "Buscar" [ref=e16] [cursor=pointer]:
        - /url: /explorar
        - img [ref=e17]
      - link "Mi cuenta" [ref=e20] [cursor=pointer]:
        - /url: /auth/login
        - img [ref=e21]
  - main [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "Explorar" [level=1] [ref=e27]
        - generic [ref=e28]:
          - img [ref=e29]
          - searchbox "Buscar canciones" [active] [ref=e32]: entrada
        - generic [ref=e34]:
          - button "Todas" [ref=e35] [cursor=pointer]
          - button "Entrada" [ref=e36] [cursor=pointer]
          - button "Comunión" [ref=e37] [cursor=pointer]
          - button "Ofertorio" [ref=e38] [cursor=pointer]
      - generic [ref=e40]: 2 canciones
      - generic [ref=e41]:
        - link "Pescador de Hombres Anónimo G" [ref=e42] [cursor=pointer]:
          - /url: /canciones/101-pescador-de-hombres
          - generic [ref=e43]:
            - img [ref=e44]
            - generic [ref=e47]: P
          - generic [ref=e48]:
            - generic [ref=e49]: Pescador de Hombres
            - generic [ref=e50]: Anónimo
          - generic [ref=e51]:
            - img [ref=e52]
            - text: G
        - link "Ave María Anónimo G" [ref=e55] [cursor=pointer]:
          - /url: /canciones/102-ave-maría
          - generic [ref=e56]:
            - img [ref=e57]
            - generic [ref=e60]: A
          - generic [ref=e61]:
            - generic [ref=e62]: Ave María
            - generic [ref=e63]: Anónimo
          - generic [ref=e64]:
            - img [ref=e65]
            - text: G
  - navigation "Navegación principal" [ref=e69]:
    - link "Inicio" [ref=e70] [cursor=pointer]:
      - /url: /
      - img [ref=e71]
      - generic [ref=e74]: Inicio
    - link "Explorar" [ref=e75] [cursor=pointer]:
      - /url: /explorar
      - img [ref=e76]
      - generic [ref=e79]: Explorar
    - link "Listas" [ref=e80] [cursor=pointer]:
      - /url: /listas
      - img [ref=e81]
      - generic [ref=e83]: Listas
    - link "Cuenta" [ref=e84] [cursor=pointer]:
      - /url: /login
      - img [ref=e85]
      - generic [ref=e88]: Cuenta
  - button "Open Next.js Dev Tools" [ref=e94] [cursor=pointer]:
    - img [ref=e95]
  - alert [ref=e98]
```

# Test source

```ts
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
  146 |     await page.locator('a[href="/explorar"]').click();
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
> 183 |     expect(capturedUrl).toContain("search=entrada");
      |                         ^ Error: expect(received).toContain(expected) // indexOf
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
  247 |     await page.route(/localhost:8000\/api\/v1\/songs/, (route) =>
  248 |       route.fulfill({
  249 |         status: 200,
  250 |         contentType: "application/json",
  251 |         body: JSON.stringify(mockEmptySongs),
  252 |       })
  253 |     );
  254 |     await page.goto("/explorar");
  255 |     await expect(page.getByText("No se encontraron canciones")).toBeVisible();
  256 |   });
  257 | });
  258 | 
```