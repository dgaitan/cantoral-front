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

Route Handlers under `api/auth/` manage cookie lifecycle: `set-cookies`, `refresh`, `logout`.

Song detail URL format: `/canciones/{id}-{slug}` — see `src/lib/utils/song-param.ts` for encode/decode.

### Auth Flow

Magic-link only (no passwords). After verification:
1. `useAuth.verifyToken` calls `/api/auth/set-cookies` → sets `cc_access` / `cc_refresh` as httpOnly cookies
2. Access token is also written to `memoryToken` in `src/lib/api/client.ts` (module-level variable) so Axios can attach it to requests
3. On 401, the Axios interceptor transparently calls `/api/auth/refresh`, updates `memoryToken`, and retries
4. Middleware (`src/proxy.ts`) validates the access cookie with `jose` + `JWT_SECRET` to protect `/dashboard`, `/mis-listas`, `/favoritos`

User state lives in a Zustand store (`src/store/authStore.ts`) persisted to `localStorage` under `cc-auth`.

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

### API Layer (`src/lib/api/`)

`client.ts` exports a singleton Axios instance pointed at `NEXT_PUBLIC_API_URL`. Server Components and Route Handlers use `API_URL_INTERNAL` instead (bypasses the public gateway). Song detail pages fetch at `revalidate: 3600`.

### Environment Variables

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_API_URL` | Axios base URL (client-side) |
| `NEXT_PUBLIC_APP_URL` | Canonical app origin |
| `NEXT_PUBLIC_API_HOST` | Allowed hostname for `next/image` |
| `API_URL_INTERNAL` | Server-side fetch URL (Route Handlers, Server Components) |
| `JWT_SECRET` | Shared with Django to verify access tokens in middleware |
| `SITEMAP_SERVICE_TOKEN` | Long-lived token for sitemap ISR fetches |
