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

Song detail URL format: `/canciones/{id}-{slug}` — see `src/lib/utils/song-param.ts` for encode/decode.

### Auth Flow — BFF (Backend-for-Frontend)

Magic-link and OTP only (no passwords). **The browser never holds a token.** Every Django call goes through the Next.js server, which keeps the Django `access`/`refresh` tokens (plus the user) inside ONE **encrypted httpOnly cookie** (`cc_session`, JWE via `jose` + `JWT_SECRET`).

- **Session layer** (`src/lib/session/`): `crypto.ts` = pure JWE encrypt/decrypt (edge-safe, used by middleware); `session.ts` = `createSession`/`getSession`/`updateSessionTokens`/`deleteSession` via async `cookies()`; `dal.ts` = `getCurrentUser`/`verifySession` (React `cache`)/`requireSession`.
- **Server-side Django client** (`src/lib/django/client.ts`): `djangoFetch<T>(path, { auth, optionalAuth, bearer, params, next })` — attaches the session's bearer, and on 401 refreshes via the refresh token, rotates the cookie, and retries once. `queries.ts` holds typed read functions shared by Server Components and route handlers.
- **Server Actions** (`src/actions/`): `auth.ts` (`login`, `register`, `requestMagicLink`, `verifyOtp`, `verifyMagic`, `logout`), `favorites.ts` (`toggleFavorite`), `playlists.ts` (`createPlaylist`/`updatePlaylist`/`deletePlaylist`/`attachSongs`/`reorderSongs`). All return a typed `ActionResult<T>` (`{ ok, data } | { ok:false, error, fieldErrors }`) and validate input with shared Zod schemas in `src/lib/schemas/`. The same schema feeds the client `zodResolver` (react-hook-form) and the action's server `safeParse`.
- **Verify flow:** `verifyOtp`/`verifyMagic` → Django `/auth/verify` → fetch `/v1/profile` → `createSession()` (sets cookie) → returns `{ user }`; the page calls `useAuth().refresh()` then navigates.
- **Client user state:** no Zustand. `AuthProvider` (`src/components/providers/AuthProvider.tsx`, in the root layout) fetches `/api/auth/me` via SWR; `useAuth()` exposes `{ user, isAuthenticated, isLoading, refresh, logout }`. This keeps public pages **statically rendered** (no `cookies()` in layouts).

**Route protection** — `src/proxy.ts` (Next 16's renamed middleware) **decrypts** the session and redirects: protected paths → `/login?from=` when unauthenticated, auth paths → `/` when authenticated. Public/protected/auth path lists live in `src/lib/auth/routes.ts`.

**Reads** — interactive client reads use SWR pointed at internal BFF route handlers (`/api/songs`, `/api/songs/[id]`, `/api/categories`, `/api/favorites`, `/api/playlists`, `/api/playlists/[uuid]/songs`) via the `fetcher` in `src/lib/api/fetcher.ts`. Server Components call `src/lib/django/queries.ts` directly.

**Security note:** Tokens live only in the encrypted httpOnly cookie — not in `localStorage`/`sessionStorage` — so they are not exposed to XSS.

**Next.js 16 gotchas:** `cookies()` is async (always `await`); cookies can only be set in Server Actions / Route Handlers, never during Server Component render (hence authed reads go through SWR → route handlers); `revalidateTag(tag, "max")` requires the 2nd profile arg.

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

**Co-located child components:** When an organism grows beyond ~80 lines or has distinct visual sections, split into named child files _within the same folder_. Children are never exported from the tier's `index.ts`.

**Types in `src/types/`, never inline:** Every props interface belongs in `src/types/` (grouped by domain, e.g. `song.ts`), not declared inside the component file. Import with `import type { ... } from "@/types/song"`.

```
organisms/SongPresentation/
  SongPresentation.tsx          ← parent (the only public export)
  PresentationSlide.tsx         ← child — slide content area
  PresentationProgressBar.tsx   ← child — nav buttons + progress bar
  SongPresentation.spec.tsx     ← tests always import from the parent
```

### Component Standards

**HeroUI-first rule:** Before building any UI component, check if HeroUI has one. Always use HeroUI components for inputs, buttons, selects, modals, OTP inputs, and toasts.

**No inline styles. Ever.** Use Tailwind classes exclusively. `style={{}}` objects are forbidden in all component and page files. Conditional styles use `cn()` with class strings.

**Toast:** Use `Toast.toast.success()` and `Toast.toast.danger()` from `@heroui/react`. Note: HeroUI uses `.danger()` not `.error()`. Layout must include `<Toast.Provider>`.

**Form inputs:** Use HeroUI `<Input>` with `isInvalid` and `errorMessage` props for validation feedback. Use `startContent` / `endContent` for icons — no manual positioning.

**Reference pattern:** `src/components/molecules/LoginForm/LoginForm.tsx` (post-refactor).

### API Layer

There is **no Axios client** and no client-side Django access. All Django traffic is server-side via `djangoFetch` (`src/lib/django/client.ts`) against `API_URL_INTERNAL`. The client only talks to internal Next.js endpoints: Server Actions (`src/actions/`) for mutations and BFF Route Handlers (`src/app/api/*`) for interactive reads, fetched with `src/lib/api/fetcher.ts`. Song detail pages fetch at `revalidate: 3600`; `toggleFavorite` revalidates `song-${id}`.

### Environment Variables

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_API_URL` | Public Django origin (fallback for server fetch; not used for client Django calls) |
| `NEXT_PUBLIC_APP_URL` | Canonical app origin |
| `NEXT_PUBLIC_API_HOST` | Allowed hostname for `next/image` |
| `API_URL_INTERNAL` | Server-side Django URL for `djangoFetch` (Route Handlers, Server Actions, Server Components) |
| `JWT_SECRET` | **Required.** Derives the key that encrypts the `cc_session` cookie (`src/lib/session/crypto.ts`) and decrypts it in middleware |
| `SITEMAP_SERVICE_TOKEN` | Long-lived token for sitemap ISR fetches |
