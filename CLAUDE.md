# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
bun dev          # Start dev server with Turbopack on localhost:3000
bun build        # Production build
bun lint         # ESLint
bun type-check   # tsc --noEmit
bun test         # Vitest (watch mode)
bun test:coverage  # Vitest with coverage report
bun test:e2e     # Playwright E2E tests
bun ci           # type-check + lint + test:coverage (full gate)
```

Run a single test file: `bun vitest run src/lib/lyrics/parser.test.ts`

Run a spec-driven test: `bun vitest run src/components/<tier>/<Name>/<Name>.spec.tsx`

## Spec-Driven Development (RDD)

Feature specs live in `.specs/<feature-name>.md` as Gherkin Markdown. Use `/spec-build <feature-name>` to execute the 5-step TDD workflow: parse → red tests → implement → green tests → report. Component specs drive Vitest + Testing Library (output: `*.spec.tsx` alongside the component); E2E specs tagged `@e2e` drive Playwright (output: `tests/e2e/*.spec.ts`). See `.specs/SPEC_TEMPLATE.md` for the format and `.specs/smoke-test.md` for a working example.

## Architecture

**Stack:** Next.js 16.2.7 · React 19 · TypeScript · Tailwind CSS v4 · HeroUI · Zustand · SWR · Axios · Vitest · Playwright

### Route Structure (`src/app/`)

Three route groups share layouts:
- `(auth)/` — login, registro, verificar (magic-link flow)
- `(public)/` — canciones (song list + detail), explorar
- `(dashboard)/` — favoritos, mis-listas (requires auth)

Route Handlers under `api/auth/`: `refresh` (proxies token refresh to Django), `logout` (best-effort backend signout).

Song detail URL format: `/canciones/{id}-{slug}` — see `src/lib/utils/song-param.ts` for encode/decode.

### Auth Flow

Magic-link and OTP only (no passwords). Backend returns JWT tokens in the response body — no cookie-setting endpoint exists. After verification:
1. `useAuth.verifyToken` calls `verifyOtp` → backend returns `{ access_token, refresh_token }` inside `DjangoResponse.data`
2. `access_token` is stored in `memoryToken` (module-level variable in `src/lib/api/client.ts`) **and** persisted to `localStorage` under `cc_access_token`. On page reload, the module init reads it back.
3. `refresh_token` is stored in `localStorage` under `cc_refresh_token` via `setRefreshToken()`.
4. Every Axios request includes `Authorization: Bearer <access_token>` via the request interceptor in `client.ts`.
5. On 401, the interceptor reads `cc_refresh_token` from localStorage, POSTs `{ refresh }` to `/api/auth/refresh` (Next.js BFF), updates `memoryToken`, and retries the original request. If refresh also fails, both tokens are cleared.
6. Logout: `logoutUser()` sends `{ access, refresh }` in the body to `/api/auth/logout` → best-effort call to Django `/users/logout/`.

**No httpOnly cookies.** The `set-cookies` route handler was removed — the backend never supported it. `jose`/`JWT_SECRET` is no longer used in the middleware.

**Middleware** (`src/proxy.ts`) is a pass-through — it returns `NextResponse.next()` for all matched routes. Route protection is handled client-side by `DashboardLayout`, which redirects to `/auth/login` via `useEffect` if `isAuthenticated` is false.

**Security note:** Storing tokens in `localStorage` is vulnerable to XSS. This is an acceptable risk for this app given its low-sensitivity profile (Catholic songbook). If the threat model changes, migrate to httpOnly cookies with a proper backend session endpoint.

User state lives in a Zustand store (`src/store/authStore.ts`) persisted to `localStorage` under `cc-auth` (includes `user` and `isAuthenticated`).

### Lyrics System (`src/lib/lyrics/`)

Songs store lyrics with inline chord markers: `{Am}word {G}another word`.

- `parser.ts` — `parseLyricsIntoBlocks` splits by blank lines into `LyricsBlock[]`. Section labels (Estribillo, Coro, Estrofa, etc.) are detected by regex and stripped from content.
- `transpose.ts` — `transposeChord(chord, steps)` shifts a chord name by semitones.
- `LyricsRenderer` renders chords above their corresponding syllables using inline flex layout.

### Component Architecture

Atomic design under `src/components/`:
- `atoms/` — Chord, CoverArt, KeyBadge, Logo, SectionLabel
- `molecules/` — LyricsLine, SongCard, SongRow, SearchBar, MagicLinkForm, CategoryChips
- `organisms/` — LyricsRenderer, ChordControls, SongDetail, Navbar, BottomNav, RevealPresentation, SongList
- `templates/` — PublicLayout, DashboardLayout, PresentationLayout

### Component Standards

**HeroUI-first rule:** Before building any UI component, check if HeroUI has one. Always use HeroUI components for inputs, buttons, selects, modals, OTP inputs, and toasts.

**No inline styles. Ever.** Use Tailwind classes exclusively. `style={{}}` objects are forbidden in all component and page files. Conditional styles use `cn()` with class strings.

**Toast:** Use `Toast.toast.success()` and `Toast.toast.danger()` from `@heroui/react`. Note: HeroUI uses `.danger()` not `.error()`. Layout must include `<Toast.Provider>`.

**Form inputs:** Use HeroUI `<Input>` with `isInvalid` and `errorMessage` props for validation feedback. Use `startContent` / `endContent` for icons — no manual positioning.

**Reference pattern:** `src/components/molecules/LoginForm/LoginForm.tsx` (post-refactor).

### API Layer (`src/lib/api/`)

`client.ts` exports a singleton Axios instance pointed at `NEXT_PUBLIC_API_URL`. Server Components and Route Handlers use `API_URL_INTERNAL` instead (bypasses the public gateway). Song detail pages fetch at `revalidate: 3600`.

### Environment Variables

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_API_URL` | Axios base URL (client-side) |
| `NEXT_PUBLIC_APP_URL` | Canonical app origin |
| `NEXT_PUBLIC_API_HOST` | Allowed hostname for `next/image` |
| `API_URL_INTERNAL` | Server-side fetch URL (Route Handlers, Server Components) |
| `JWT_SECRET` | No longer used by middleware (removed); may be retained for future server-side validation |
| `SITEMAP_SERVICE_TOKEN` | Long-lived token for sitemap ISR fetches |
