# Auth Flow — Spec-Build Report

**Spec:** `.specs/auth-flow.md`  
**Test output:** `tests/e2e/auth-flow.spec.ts`  
**Date:** 2026-06-09

---

## Summary

| Gate | Status |
|------|--------|
| TypeScript (`bun type-check`) | ✅ PASS |
| ESLint new files (`bun lint src/...`) | ✅ PASS |
| Routes respond 200 (`/login`, `/register`, `/verify`, `/perfil`) | ✅ PASS |
| E2E tests (`bun test:e2e --project=chromium`) | ✅ 18/18 PASS (4.6s) |

---

## New files created

| File | Purpose |
|------|---------|
| `src/components/atoms/OtpDigit/OtpDigit.tsx` | Single digit input with focus/blur styling |
| `src/components/molecules/OtpInput/OtpInput.tsx` | 6-digit OTP group with auto-advance, paste, backspace |
| `src/components/molecules/LoginForm/LoginForm.tsx` | Email + password form with zod validation |
| `src/components/molecules/RegisterForm/RegisterForm.tsx` | Name + email + password form with zod validation |
| `src/app/(auth)/register/page.tsx` | `/register` route |
| `src/app/(auth)/verify/page.tsx` | `/verify` route with OTP input |
| `src/app/perfil/page.tsx` | `/perfil` blank placeholder route |
| `src/lib/utils/api-error.ts` | Utility to extract readable message from API errors |
| `tests/e2e/auth-flow.spec.ts` | 18 E2E scenarios (Playwright) |

## Modified files

| File | Change |
|------|--------|
| `src/app/(auth)/login/page.tsx` | Rewritten — uses `LoginForm`, toast on error, redirects to `/verify` |
| `src/lib/api/auth.ts` | Added `loginWithPassword`, `registerUser`, `verifyOtp` |
| `src/hooks/useAuth.ts` | Updated `login` to take password; added `register` |
| `src/app/layout.tsx` | Added `<Toaster position="top-center" richColors />` from `sonner` |
| `src/app/(auth)/registro/page.tsx` | Fixed to call `requestMagicLink` directly (no longer uses `useAuth.login`) |

---

## E2E scenarios (18 total)

### Login (`/login`) — 5 scenarios
- Shows email and password fields with "Ingresar" button
- Successful login redirects to `/verify`
- Pressing Enter submits the form
- Invalid credentials show error toast
- Empty fields show inline validation errors

### Register (`/register`) — 5 scenarios
- Shows name, email, password fields with "Crear cuenta" button
- Successful registration redirects to `/verify`
- Pressing Enter submits the form
- Duplicate email shows error toast
- Empty fields show inline validation errors

### Verify (`/verify`) — 7 scenarios
- Shows 6 digit inputs, first input auto-focused
- Typing a digit advances focus to next field
- Pasting 6 digits fills all fields
- Backspace on empty field moves focus back
- Correct code redirects to `/perfil`
- Incorrect code shows error toast
- Direct navigation without pending email redirects to `/login`

### Perfil (`/perfil`) — 1 scenario
- Accessible after OTP verification without redirect to `/login`

---

## Architecture decisions

- **Email hand-off** between login/register and verify: `sessionStorage.setItem('cc_pending_email', email)`. Cleared on successful verification.
- **Toast library**: `sonner@2.0.7` — added `<Toaster />` to root layout.
- **API endpoints**: New `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/verify` (as documented in `.docs/api.md`). Old `requestMagicLink`/`verifyMagicLink` retained for `/registro` page compatibility.
- **Pending email guard**: Initialized via lazy `useState` (reads `sessionStorage` on first render) to avoid `setState`-in-effect lint error.
