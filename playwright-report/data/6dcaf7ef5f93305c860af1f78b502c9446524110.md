# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home-page.spec.ts >> /explorar filters >> combining tag and search filters passes both params to the API
- Location: tests/e2e/home-page.spec.ts:220:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: undefined
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - link "Cancionero Católico" [ref=e5] [cursor=pointer]:
    - /url: /
    - img "Cancionero Católico" [ref=e6]
  - banner [ref=e7]:
    - link "Cancionero Católico" [ref=e8] [cursor=pointer]:
      - /url: /
      - img "Cancionero Católico" [ref=e9]
    - generic [ref=e10]:
      - link "Buscar" [ref=e11] [cursor=pointer]:
        - /url: /explorar
        - img [ref=e12]
      - link "Mi cuenta" [ref=e15] [cursor=pointer]:
        - /url: /auth/login
        - img [ref=e16]
  - main [ref=e19]:
    - generic [ref=e20]:
      - generic [ref=e21]:
        - heading "Explorar" [level=1] [ref=e22]
        - generic [ref=e23]:
          - img [ref=e24]
          - searchbox "Buscar canciones" [active] [ref=e27]: canto
        - generic [ref=e29]:
          - button "Todas" [ref=e30] [cursor=pointer]
          - button "Entrada" [ref=e31] [cursor=pointer]
          - button "Comunión" [ref=e32] [cursor=pointer]
          - button "Ofertorio" [ref=e33] [cursor=pointer]
      - generic [ref=e35]: 1 canciones
      - link "Canto de Entrada Anónimo G" [ref=e37] [cursor=pointer]:
        - /url: /canciones/201-canto-de-entrada
        - generic [ref=e38]:
          - img [ref=e39]
          - generic [ref=e42]: C
        - generic [ref=e43]:
          - generic [ref=e44]: Canto de Entrada
          - generic [ref=e45]: Anónimo
        - generic [ref=e46]:
          - img [ref=e47]
          - text: G
  - navigation "Navegación principal" [ref=e51]:
    - link "Inicio" [ref=e52] [cursor=pointer]:
      - /url: /
      - img [ref=e53]
      - generic [ref=e56]: Inicio
    - link "Explorar" [ref=e57] [cursor=pointer]:
      - /url: /explorar
      - img [ref=e58]
      - generic [ref=e61]: Explorar
    - link "Listas" [ref=e62] [cursor=pointer]:
      - /url: /listas
      - img [ref=e63]
      - generic [ref=e65]: Listas
    - link "Cuenta" [ref=e66] [cursor=pointer]:
      - /url: /login
      - img [ref=e67]
      - generic [ref=e70]: Cuenta
  - button "Open Next.js Dev Tools" [ref=e76] [cursor=pointer]:
    - img [ref=e77]
  - alert [ref=e80]
```

# Test source

```ts
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
> 243 |     expect(combined).toBeTruthy();
      |                      ^ Error: expect(received).toBeTruthy()
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