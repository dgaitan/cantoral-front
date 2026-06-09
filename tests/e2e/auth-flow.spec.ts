import { test, expect, type Page } from "@playwright/test";

const BACKEND = "http://localhost:8000/api";

// --- Mock helpers ---

async function mockLoginSuccess(page: Page) {
  await page.route(`${BACKEND}/auth/login`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {},
        errors: null,
        message: "If credentials are correct, check your email for a login code.",
      }),
    })
  );
}

async function mockLoginError(page: Page) {
  await page.route(`${BACKEND}/auth/login`, (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        data: {},
        errors: ["Credenciales inválidas"],
        message: "",
      }),
    })
  );
}

async function mockRegisterSuccess(page: Page) {
  await page.route(`${BACKEND}/auth/register`, (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {},
        errors: null,
        message: "Check your email inbox and use the code to log in.",
      }),
    })
  );
}

async function mockRegisterError(page: Page) {
  await page.route(`${BACKEND}/auth/register`, (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        data: {},
        errors: ["El correo ya está registrado"],
        message: "",
      }),
    })
  );
}

async function mockVerifySuccess(page: Page) {
  await page.route(`${BACKEND}/auth/verify`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { access: "mock-access-token", refresh: "mock-refresh-token" },
        errors: null,
        message: "Email successfully verified.",
      }),
    })
  );
  await page.route(`${BACKEND}/users/me/`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { id: "1", email: "test@example.com", name: "Test User" },
        errors: null,
      }),
    })
  );
}

async function mockVerifyError(page: Page) {
  await page.route(`${BACKEND}/auth/verify`, (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        data: {},
        errors: ["Código inválido o expirado"],
        message: "",
      }),
    })
  );
}

async function withPendingEmail(page: Page, email = "test@example.com") {
  await page.addInitScript(
    (e) => sessionStorage.setItem("cc_pending_email", e),
    email
  );
}

// ─────────────────────────────────────────────
//  LOGIN  (/login)
// ─────────────────────────────────────────────

test.describe("Login page", () => {
  test("shows email and password fields with Ingresar button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel("Correo electrónico")).toBeVisible();
    await expect(page.getByLabel("Contraseña")).toBeVisible();
    await expect(page.getByRole("button", { name: "Ingresar" })).toBeVisible();
  });

  test("successful login redirects to /verify", async ({ page }) => {
    await mockLoginSuccess(page);
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill("test@example.com");
    await page.getByLabel("Contraseña").fill("password123");
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page).toHaveURL("/verify");
  });

  test("pressing Enter submits the login form", async ({ page }) => {
    await mockLoginSuccess(page);
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill("test@example.com");
    await page.getByLabel("Contraseña").fill("password123");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/verify");
  });

  test("invalid credentials show an error toast", async ({ page }) => {
    await mockLoginError(page);
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill("bad@example.com");
    await page.getByLabel("Contraseña").fill("wrongpass");
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page.locator("[data-sonner-toast]")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("shows inline validation for empty fields", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page.getByRole("alert").first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────
//  REGISTER  (/register)
// ─────────────────────────────────────────────

test.describe("Register page", () => {
  test("shows name, email, password fields and Crear cuenta button", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByLabel("Nombre")).toBeVisible();
    await expect(page.getByLabel("Correo electrónico")).toBeVisible();
    await expect(page.getByLabel("Contraseña")).toBeVisible();
    await expect(page.getByRole("button", { name: "Crear cuenta" })).toBeVisible();
  });

  test("successful registration redirects to /verify", async ({ page }) => {
    await mockRegisterSuccess(page);
    await page.goto("/register");
    await page.getByLabel("Nombre").fill("Test User");
    await page.getByLabel("Correo electrónico").fill("new@example.com");
    await page.getByLabel("Contraseña").fill("password123");
    await page.getByRole("button", { name: "Crear cuenta" }).click();
    await expect(page).toHaveURL("/verify");
  });

  test("pressing Enter submits the register form", async ({ page }) => {
    await mockRegisterSuccess(page);
    await page.goto("/register");
    await page.getByLabel("Nombre").fill("Test User");
    await page.getByLabel("Correo electrónico").fill("new@example.com");
    await page.getByLabel("Contraseña").fill("password123");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/verify");
  });

  test("duplicate email shows an error toast", async ({ page }) => {
    await mockRegisterError(page);
    await page.goto("/register");
    await page.getByLabel("Nombre").fill("Test User");
    await page.getByLabel("Correo electrónico").fill("existing@example.com");
    await page.getByLabel("Contraseña").fill("password123");
    await page.getByRole("button", { name: "Crear cuenta" }).click();
    await expect(page.locator("[data-sonner-toast]")).toBeVisible();
    await expect(page).toHaveURL("/register");
  });

  test("shows inline validation for empty fields", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("button", { name: "Crear cuenta" }).click();
    await expect(page.getByRole("alert").first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────
//  OTP VERIFICATION  (/verify)
// ─────────────────────────────────────────────

test.describe("Verify page", () => {
  test("shows 6 digit inputs with first field focused", async ({ page }) => {
    await withPendingEmail(page);
    await page.goto("/verify");
    const inputs = page.locator("[data-otp-digit]");
    await expect(inputs).toHaveCount(6);
    await expect(inputs.first()).toBeFocused();
  });

  test("typing a digit auto-advances focus to next field", async ({ page }) => {
    await withPendingEmail(page);
    await page.goto("/verify");
    const inputs = page.locator("[data-otp-digit]");
    await inputs.first().focus();
    await page.keyboard.type("1");
    await expect(inputs.nth(1)).toBeFocused();
  });

  test("pasting a 6-digit code fills all fields", async ({ page }) => {
    await withPendingEmail(page);
    await page.goto("/verify");
    const inputs = page.locator("[data-otp-digit]");
    await inputs.first().focus();
    await page.evaluate(() => {
      const dt = new DataTransfer();
      dt.setData("text/plain", "123456");
      const evt = new ClipboardEvent("paste", { clipboardData: dt, bubbles: true });
      document.querySelector("[data-otp-digit]")?.dispatchEvent(evt);
    });
    for (let i = 0; i < 6; i++) {
      await expect(inputs.nth(i)).toHaveValue(String(i + 1));
    }
  });

  test("pressing Backspace on an empty field moves focus back", async ({ page }) => {
    await withPendingEmail(page);
    await page.goto("/verify");
    const inputs = page.locator("[data-otp-digit]");
    await inputs.first().focus();
    await page.keyboard.type("1");
    await expect(inputs.nth(1)).toBeFocused();
    await page.keyboard.press("Backspace");
    await expect(inputs.first()).toBeFocused();
  });

  test("correct 6-digit code redirects to /perfil", async ({ page }) => {
    await withPendingEmail(page);
    await mockVerifySuccess(page);
    await page.goto("/verify");
    const inputs = page.locator("[data-otp-digit]");
    for (let i = 0; i < 6; i++) {
      await inputs.nth(i).focus();
      await page.keyboard.type(String(i + 1));
    }
    await expect(page).toHaveURL("/perfil");
  });

  test("incorrect code shows error toast and stays on /verify", async ({ page }) => {
    await withPendingEmail(page);
    await mockVerifyError(page);
    await page.goto("/verify");
    const inputs = page.locator("[data-otp-digit]");
    for (let i = 0; i < 6; i++) {
      await inputs.nth(i).focus();
      await page.keyboard.type("0");
    }
    await expect(page.locator("[data-sonner-toast]")).toBeVisible();
    await expect(page).toHaveURL("/verify");
  });

  test("navigating directly to /verify without pending email redirects to /login", async ({ page }) => {
    await page.goto("/verify");
    await expect(page).toHaveURL("/login");
  });
});

// ─────────────────────────────────────────────
//  PERFIL  (/perfil — blank placeholder)
// ─────────────────────────────────────────────

test.describe("Perfil page", () => {
  test("is accessible after OTP verification without redirecting to /login", async ({ page }) => {
    await withPendingEmail(page);
    await mockVerifySuccess(page);
    await page.goto("/verify");
    const inputs = page.locator("[data-otp-digit]");
    for (let i = 0; i < 6; i++) {
      await inputs.nth(i).focus();
      await page.keyboard.type(String(i + 1));
    }
    await expect(page).toHaveURL("/perfil");
    await expect(page).not.toHaveURL("/login");
  });
});
