# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-flow.spec.ts >> Login page >> pressing Enter submits the login form
- Location: tests/e2e/auth-flow.spec.ts:136:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel('Correo electrónico')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Cancionero Católico" [ref=e5] [cursor=pointer]:
    - /url: /
    - img "Cancionero Católico" [ref=e6]
  - generic [ref=e8]:
    - img "Cancionero Católico" [ref=e10]
    - heading "Ingresar" [level=1] [ref=e11]
    - generic [ref=e12]:
      - generic [ref=e13]:
        - img [ref=e15]
        - textbox "tu@correo.com" [ref=e18]
      - generic [ref=e19]:
        - img [ref=e21]
        - textbox "Contraseña" [ref=e24]
      - button "Ingresar" [ref=e25] [cursor=pointer]
    - generic [ref=e26]:
      - text: ¿No tienes cuenta?
      - link "Crear cuenta" [ref=e27] [cursor=pointer]:
        - /url: /register
  - navigation "Navegación principal" [ref=e28]:
    - link "Inicio" [ref=e29] [cursor=pointer]:
      - /url: /
      - img [ref=e30]
      - generic [ref=e33]: Inicio
    - link "Explorar" [ref=e34] [cursor=pointer]:
      - /url: /explorar
      - img [ref=e35]
      - generic [ref=e38]: Explorar
    - link "Listas" [ref=e39] [cursor=pointer]:
      - /url: /listas
      - img [ref=e40]
      - generic [ref=e42]: Listas
    - link "Cuenta" [ref=e43] [cursor=pointer]:
      - /url: /login
      - img [ref=e44]
      - generic [ref=e47]: Cuenta
  - button "Open Next.js Dev Tools" [ref=e53] [cursor=pointer]:
    - img [ref=e54]
  - alert [ref=e57]
```

# Test source

```ts
  39  |     route.fulfill({
  40  |       status: 201,
  41  |       contentType: "application/json",
  42  |       body: JSON.stringify({
  43  |         success: true,
  44  |         data: {},
  45  |         errors: null,
  46  |         message: "Check your email inbox and use the code to log in.",
  47  |       }),
  48  |     })
  49  |   );
  50  | }
  51  | 
  52  | async function mockRegisterError(page: Page) {
  53  |   await page.route(`${BACKEND}/auth/register`, (route) =>
  54  |     route.fulfill({
  55  |       status: 400,
  56  |       contentType: "application/json",
  57  |       body: JSON.stringify({
  58  |         success: false,
  59  |         data: {},
  60  |         errors: ["El correo ya está registrado"],
  61  |         message: "",
  62  |       }),
  63  |     })
  64  |   );
  65  | }
  66  | 
  67  | async function mockVerifySuccess(page: Page) {
  68  |   await page.route(`${BACKEND}/auth/verify`, (route) =>
  69  |     route.fulfill({
  70  |       status: 200,
  71  |       contentType: "application/json",
  72  |       body: JSON.stringify({
  73  |         success: true,
  74  |         data: { access: "mock-access-token", refresh: "mock-refresh-token" },
  75  |         errors: null,
  76  |         message: "Email successfully verified.",
  77  |       }),
  78  |     })
  79  |   );
  80  |   await page.route(`${BACKEND}/users/me/`, (route) =>
  81  |     route.fulfill({
  82  |       status: 200,
  83  |       contentType: "application/json",
  84  |       body: JSON.stringify({
  85  |         success: true,
  86  |         data: { id: "1", email: "test@example.com", name: "Test User" },
  87  |         errors: null,
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
> 139 |     await page.getByLabel("Correo electrónico").fill("test@example.com");
      |                                                 ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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
```