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
          - searchbox "Buscar canciones" [active] [ref=e32]: canto
        - generic [ref=e34]:
          - button "Todas" [ref=e35] [cursor=pointer]
          - button "Entrada" [ref=e36] [cursor=pointer]
          - button "Comunión" [ref=e37] [cursor=pointer]
          - button "Ofertorio" [ref=e38] [cursor=pointer]
      - generic [ref=e40]: 1 canciones
      - link "Canto de Entrada Anónimo G" [ref=e42] [cursor=pointer]:
        - /url: /canciones/201-canto-de-entrada
        - generic [ref=e43]:
          - img [ref=e44]
          - generic [ref=e47]: C
        - generic [ref=e48]:
          - generic [ref=e49]: Canto de Entrada
          - generic [ref=e50]: Anónimo
        - generic [ref=e51]:
          - img [ref=e52]
          - text: G
  - navigation "Navegación principal" [ref=e56]:
    - link "Inicio" [ref=e57] [cursor=pointer]:
      - /url: /
      - img [ref=e58]
      - generic [ref=e61]: Inicio
    - link "Explorar" [ref=e62] [cursor=pointer]:
      - /url: /explorar
      - img [ref=e63]
      - generic [ref=e66]: Explorar
    - link "Listas" [ref=e67] [cursor=pointer]:
      - /url: /listas
      - img [ref=e68]
      - generic [ref=e70]: Listas
    - link "Cuenta" [ref=e71] [cursor=pointer]:
      - /url: /login
      - img [ref=e72]
      - generic [ref=e75]: Cuenta
  - button "Open Next.js Dev Tools" [ref=e81] [cursor=pointer]:
    - img [ref=e82]
  - alert [ref=e85]
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