# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-flow.spec.ts >> Verify page >> incorrect code shows error toast and stays on /verify
- Location: tests/e2e/auth-flow.spec.ts:274:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.focus: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-otp-digit]').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "1"
          - generic [ref=e15]: "2"
        - generic [ref=e16]:
          - text: Issue
          - generic [ref=e17]: s
      - button "Collapse issues badge" [ref=e18]:
        - img [ref=e19]
  - generic [ref=e23]:
    - link "Cancionero Católico" [ref=e24] [cursor=pointer]:
      - /url: /
      - img "Cancionero Católico" [ref=e25]
    - navigation [ref=e26]:
      - link "Inicio" [ref=e27] [cursor=pointer]:
        - /url: /
      - link "Explorar" [ref=e28] [cursor=pointer]:
        - /url: /explorar
      - link "Listas" [ref=e29] [cursor=pointer]:
        - /url: /listas
      - link "Mi cuenta" [ref=e30] [cursor=pointer]:
        - /url: /auth/login
  - generic [ref=e32]:
    - img "Cancionero Católico" [ref=e34]
    - heading "Ingresa el código" [level=1] [ref=e35]
    - paragraph [ref=e36]:
      - text: Enviamos un código de 6 dígitos a
      - strong [ref=e37]: test@example.com
    - textbox [ref=e38]
  - navigation "Navegación principal" [ref=e39]:
    - link "Inicio" [ref=e40] [cursor=pointer]:
      - /url: /
      - img [ref=e41]
      - generic [ref=e44]: Inicio
    - link "Explorar" [ref=e45] [cursor=pointer]:
      - /url: /explorar
      - img [ref=e46]
      - generic [ref=e49]: Explorar
    - link "Listas" [ref=e50] [cursor=pointer]:
      - /url: /listas
      - img [ref=e51]
      - generic [ref=e53]: Listas
    - link "Cuenta" [ref=e54] [cursor=pointer]:
      - /url: /login
      - img [ref=e55]
      - generic [ref=e58]: Cuenta
  - alert [ref=e59]
```

# Test source

```ts
  180 |     await page.getByLabel("Contraseña").fill("password123");
  181 |     await page.getByRole("button", { name: "Crear cuenta" }).click();
  182 |     await expect(page).toHaveURL("/verify");
  183 |   });
  184 | 
  185 |   test("pressing Enter submits the register form", async ({ page }) => {
  186 |     await mockRegisterSuccess(page);
  187 |     await page.goto("/register");
  188 |     await page.getByLabel("Nombre").fill("Test User");
  189 |     await page.getByLabel("Correo electrónico").fill("new@example.com");
  190 |     await page.getByLabel("Contraseña").fill("password123");
  191 |     await page.keyboard.press("Enter");
  192 |     await expect(page).toHaveURL("/verify");
  193 |   });
  194 | 
  195 |   test("duplicate email shows an error toast", async ({ page }) => {
  196 |     await mockRegisterError(page);
  197 |     await page.goto("/register");
  198 |     await page.getByLabel("Nombre").fill("Test User");
  199 |     await page.getByLabel("Correo electrónico").fill("existing@example.com");
  200 |     await page.getByLabel("Contraseña").fill("password123");
  201 |     await page.getByRole("button", { name: "Crear cuenta" }).click();
  202 |     await expect(page.locator("[data-sonner-toast]")).toBeVisible();
  203 |     await expect(page).toHaveURL("/register");
  204 |   });
  205 | 
  206 |   test("shows inline validation for empty fields", async ({ page }) => {
  207 |     await page.goto("/register");
  208 |     await page.getByRole("button", { name: "Crear cuenta" }).click();
  209 |     await expect(page.getByRole("alert").first()).toBeVisible();
  210 |   });
  211 | });
  212 | 
  213 | // ─────────────────────────────────────────────
  214 | //  OTP VERIFICATION  (/verify)
  215 | // ─────────────────────────────────────────────
  216 | 
  217 | test.describe("Verify page", () => {
  218 |   test("shows 6 digit inputs with first field focused", async ({ page }) => {
  219 |     await withPendingEmail(page);
  220 |     await page.goto("/verify");
  221 |     const inputs = page.locator("[data-otp-digit]");
  222 |     await expect(inputs).toHaveCount(6);
  223 |     await expect(inputs.first()).toBeFocused();
  224 |   });
  225 | 
  226 |   test("typing a digit auto-advances focus to next field", async ({ page }) => {
  227 |     await withPendingEmail(page);
  228 |     await page.goto("/verify");
  229 |     const inputs = page.locator("[data-otp-digit]");
  230 |     await inputs.first().focus();
  231 |     await page.keyboard.type("1");
  232 |     await expect(inputs.nth(1)).toBeFocused();
  233 |   });
  234 | 
  235 |   test("pasting a 6-digit code fills all fields", async ({ page }) => {
  236 |     await withPendingEmail(page);
  237 |     await page.goto("/verify");
  238 |     const inputs = page.locator("[data-otp-digit]");
  239 |     await inputs.first().focus();
  240 |     await page.evaluate(() => {
  241 |       const dt = new DataTransfer();
  242 |       dt.setData("text/plain", "123456");
  243 |       const evt = new ClipboardEvent("paste", { clipboardData: dt, bubbles: true });
  244 |       document.querySelector("[data-otp-digit]")?.dispatchEvent(evt);
  245 |     });
  246 |     for (let i = 0; i < 6; i++) {
  247 |       await expect(inputs.nth(i)).toHaveValue(String(i + 1));
  248 |     }
  249 |   });
  250 | 
  251 |   test("pressing Backspace on an empty field moves focus back", async ({ page }) => {
  252 |     await withPendingEmail(page);
  253 |     await page.goto("/verify");
  254 |     const inputs = page.locator("[data-otp-digit]");
  255 |     await inputs.first().focus();
  256 |     await page.keyboard.type("1");
  257 |     await expect(inputs.nth(1)).toBeFocused();
  258 |     await page.keyboard.press("Backspace");
  259 |     await expect(inputs.first()).toBeFocused();
  260 |   });
  261 | 
  262 |   test("correct 6-digit code redirects to /perfil", async ({ page }) => {
  263 |     await withPendingEmail(page);
  264 |     await mockVerifySuccess(page);
  265 |     await page.goto("/verify");
  266 |     const inputs = page.locator("[data-otp-digit]");
  267 |     for (let i = 0; i < 6; i++) {
  268 |       await inputs.nth(i).focus();
  269 |       await page.keyboard.type(String(i + 1));
  270 |     }
  271 |     await expect(page).toHaveURL("/perfil");
  272 |   });
  273 | 
  274 |   test("incorrect code shows error toast and stays on /verify", async ({ page }) => {
  275 |     await withPendingEmail(page);
  276 |     await mockVerifyError(page);
  277 |     await page.goto("/verify");
  278 |     const inputs = page.locator("[data-otp-digit]");
  279 |     for (let i = 0; i < 6; i++) {
> 280 |       await inputs.nth(i).focus();
      |                           ^ Error: locator.focus: Test timeout of 30000ms exceeded.
  281 |       await page.keyboard.type("0");
  282 |     }
  283 |     await expect(page.locator("[data-sonner-toast]")).toBeVisible();
  284 |     await expect(page).toHaveURL("/verify");
  285 |   });
  286 | 
  287 |   test("navigating directly to /verify without pending email redirects to /login", async ({ page }) => {
  288 |     await page.goto("/verify");
  289 |     await expect(page).toHaveURL("/login");
  290 |   });
  291 | });
  292 | 
  293 | // ─────────────────────────────────────────────
  294 | //  PERFIL  (/perfil — blank placeholder)
  295 | // ─────────────────────────────────────────────
  296 | 
  297 | test.describe("Perfil page", () => {
  298 |   test("is accessible after OTP verification without redirecting to /login", async ({ page }) => {
  299 |     await withPendingEmail(page);
  300 |     await mockVerifySuccess(page);
  301 |     await page.goto("/verify");
  302 |     const inputs = page.locator("[data-otp-digit]");
  303 |     for (let i = 0; i < 6; i++) {
  304 |       await inputs.nth(i).focus();
  305 |       await page.keyboard.type(String(i + 1));
  306 |     }
  307 |     await expect(page).toHaveURL("/perfil");
  308 |     await expect(page).not.toHaveURL("/login");
  309 |   });
  310 | });
  311 | 
```