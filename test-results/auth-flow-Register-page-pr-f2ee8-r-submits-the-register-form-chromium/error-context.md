# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-flow.spec.ts >> Register page >> pressing Enter submits the register form
- Location: tests/e2e/auth-flow.spec.ts:185:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel('Nombre')

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
  - generic [ref=e13]:
    - img "Cancionero Católico" [ref=e15]
    - heading "Crear cuenta" [level=1] [ref=e16]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - img [ref=e20]
        - textbox "Tu nombre" [ref=e23]
      - generic [ref=e24]:
        - img [ref=e26]
        - textbox "tu@correo.com" [ref=e29]
      - generic [ref=e30]:
        - img [ref=e32]
        - textbox "Contraseña (mín. 8 caracteres)" [ref=e35]
      - button "Crear cuenta" [ref=e36] [cursor=pointer]
    - generic [ref=e37]:
      - text: ¿Ya tienes cuenta?
      - link "Ingresar" [ref=e38] [cursor=pointer]:
        - /url: /login
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
  - button "Open Next.js Dev Tools" [ref=e64] [cursor=pointer]:
    - img [ref=e65]
  - alert [ref=e68]
```

# Test source

```ts
  88  |       }),
  89  |     })
  90  |   );
  91  | }
  92  | 
  93  | async function mockVerifyError(page: Page) {
  94  |   await page.route(`${BACKEND}/auth/verify`, (route) =>
  95  |     route.fulfill({
  96  |       status: 400,
  97  |       contentType: "application/json",
  98  |       body: JSON.stringify({
  99  |         success: false,
  100 |         data: {},
  101 |         errors: ["Código inválido o expirado"],
  102 |         message: "",
  103 |       }),
  104 |     })
  105 |   );
  106 | }
  107 | 
  108 | async function withPendingEmail(page: Page, email = "test@example.com") {
  109 |   await page.addInitScript(
  110 |     (e) => sessionStorage.setItem("cc_pending_email", e),
  111 |     email
  112 |   );
  113 | }
  114 | 
  115 | // ─────────────────────────────────────────────
  116 | //  LOGIN  (/login)
  117 | // ─────────────────────────────────────────────
  118 | 
  119 | test.describe("Login page", () => {
  120 |   test("shows email and password fields with Ingresar button", async ({ page }) => {
  121 |     await page.goto("/login");
  122 |     await expect(page.getByLabel("Correo electrónico")).toBeVisible();
  123 |     await expect(page.getByLabel("Contraseña")).toBeVisible();
  124 |     await expect(page.getByRole("button", { name: "Ingresar" })).toBeVisible();
  125 |   });
  126 | 
  127 |   test("successful login redirects to /verify", async ({ page }) => {
  128 |     await mockLoginSuccess(page);
  129 |     await page.goto("/login");
  130 |     await page.getByLabel("Correo electrónico").fill("test@example.com");
  131 |     await page.getByLabel("Contraseña").fill("password123");
  132 |     await page.getByRole("button", { name: "Ingresar" }).click();
  133 |     await expect(page).toHaveURL("/verify");
  134 |   });
  135 | 
  136 |   test("pressing Enter submits the login form", async ({ page }) => {
  137 |     await mockLoginSuccess(page);
  138 |     await page.goto("/login");
  139 |     await page.getByLabel("Correo electrónico").fill("test@example.com");
  140 |     await page.getByLabel("Contraseña").fill("password123");
  141 |     await page.keyboard.press("Enter");
  142 |     await expect(page).toHaveURL("/verify");
  143 |   });
  144 | 
  145 |   test("invalid credentials show an error toast", async ({ page }) => {
  146 |     await mockLoginError(page);
  147 |     await page.goto("/login");
  148 |     await page.getByLabel("Correo electrónico").fill("bad@example.com");
  149 |     await page.getByLabel("Contraseña").fill("wrongpass");
  150 |     await page.getByRole("button", { name: "Ingresar" }).click();
  151 |     await expect(page.locator("[data-sonner-toast]")).toBeVisible();
  152 |     await expect(page).toHaveURL("/login");
  153 |   });
  154 | 
  155 |   test("shows inline validation for empty fields", async ({ page }) => {
  156 |     await page.goto("/login");
  157 |     await page.getByRole("button", { name: "Ingresar" }).click();
  158 |     await expect(page.getByRole("alert").first()).toBeVisible();
  159 |   });
  160 | });
  161 | 
  162 | // ─────────────────────────────────────────────
  163 | //  REGISTER  (/register)
  164 | // ─────────────────────────────────────────────
  165 | 
  166 | test.describe("Register page", () => {
  167 |   test("shows name, email, password fields and Crear cuenta button", async ({ page }) => {
  168 |     await page.goto("/register");
  169 |     await expect(page.getByLabel("Nombre")).toBeVisible();
  170 |     await expect(page.getByLabel("Correo electrónico")).toBeVisible();
  171 |     await expect(page.getByLabel("Contraseña")).toBeVisible();
  172 |     await expect(page.getByRole("button", { name: "Crear cuenta" })).toBeVisible();
  173 |   });
  174 | 
  175 |   test("successful registration redirects to /verify", async ({ page }) => {
  176 |     await mockRegisterSuccess(page);
  177 |     await page.goto("/register");
  178 |     await page.getByLabel("Nombre").fill("Test User");
  179 |     await page.getByLabel("Correo electrónico").fill("new@example.com");
  180 |     await page.getByLabel("Contraseña").fill("password123");
  181 |     await page.getByRole("button", { name: "Crear cuenta" }).click();
  182 |     await expect(page).toHaveURL("/verify");
  183 |   });
  184 | 
  185 |   test("pressing Enter submits the register form", async ({ page }) => {
  186 |     await mockRegisterSuccess(page);
  187 |     await page.goto("/register");
> 188 |     await page.getByLabel("Nombre").fill("Test User");
      |                                     ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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
  280 |       await inputs.nth(i).focus();
  281 |       await page.keyboard.type("0");
  282 |     }
  283 |     await expect(page.locator("[data-sonner-toast]")).toBeVisible();
  284 |     await expect(page).toHaveURL("/verify");
  285 |   });
  286 | 
  287 |   test("navigating directly to /verify without pending email redirects to /login", async ({ page }) => {
  288 |     await page.goto("/verify");
```