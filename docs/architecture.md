# CVPower — Architecture

## 1. Principles in code
Everything runs in the browser. There is no server, no database, no auth, and no external API. The app is a Next.js 15 App Router project that behaves like a static single-page-ish app: pages are locale-scoped and rendered without server data, and all "intelligence" (scoring, matching, PDF) is pure client-side TypeScript.

## 2. High-level layers
```
┌──────────────────────────────────────────────────────────┐
│ Presentation      app/[locale]/**, components/ui, brand, │
│                   layout, common                         │
├──────────────────────────────────────────────────────────┤
│ Feature modules   components/<feature>/ + hooks          │
│                   (builder, analyze, export, templates)  │
├──────────────────────────────────────────────────────────┤
│ State             stores/ (Zustand, persisted)           │
├──────────────────────────────────────────────────────────┤
│ Domain engines    lib/scoring, lib/matching, lib/pdf,    │
│                   lib/parsing, lib/taxonomy              │
├──────────────────────────────────────────────────────────┤
│ Persistence       lib/storage (LocalStorage + schema     │
│                   versioning + migrations)               │
└──────────────────────────────────────────────────────────┘
```
Dependencies point downward only. Presentation never touches storage directly; it goes through stores. Engines are pure functions with no React and no storage dependency, which makes them trivially testable.

## 3. Folder structure
The full target layout (feature folders are created as their milestones land):

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx          # root html/body, providers, header/footer
│       ├── page.tsx            # landing
│       ├── builder/            # resume editor (M2)
│       ├── analyze/            # scoring + matching results (M3–M4)
│       ├── templates/          # template gallery (M5)
│       ├── privacy/            # privacy explainer + wipe control
│       └── not-found.tsx
├── components/                 # shared UI (not feature-owned)
│   ├── ui/                     # shadcn primitives (M1)
│   ├── brand/                  # logo, privacy-badge
│   ├── layout/                 # container, site-header, site-footer
│   └── common/                 # theme-toggle, locale-switcher, shared atoms
├── features/                   # feature-based domains (business logic + feature UI)
│   ├── resume/                 # ✅ M2 — the resume data engine (see §4)
│   │   ├── constants.ts  schema.ts  types.ts  factory.ts
│   │   ├── operations.ts       # pure state transforms (all business logic)
│   │   ├── migrations.ts  serialization.ts  persistence.ts
│   │   ├── store.ts  selectors.ts  index.ts   # public API barrel
│   │   ├── components/         # builder UI: steps/, fields/, parts/, hooks/
│   │   └── __tests__/          # vitest unit tests
│   ├── scoring/                # M3 — scoring engine
│   ├── matching/               # M4 — job-matching engine
│   ├── pdf/                    # M5 — pdf export engine
│   ├── templates/              # M5 — resume templates
│   ├── ai/                     # M6 — rule-based on-device suggestions
│   └── plugins/                # future — optional analyzers/exporters
├── lib/                        # cross-feature utilities (utils, id, debounce)
├── hooks/
├── i18n/                       # next-intl routing/request/navigation
└── config/                     # site metadata
messages/                       # en.json, ar.json
```

Each feature owns its domain end to end (types, logic, state, and later its UI) and
exposes a single public API via `index.ts`. Nothing imports a feature's internal
files directly. Dependencies flow one way: `app` → `features` → `lib`.

## 4. State architecture (Zustand)
The resume engine (`features/resume`) is layered for testability:

- **Pure core** (`operations.ts`) — all business logic as `(ResumeData) => ResumeData`
  functions. No React, no Zustand, no browser globals.
- **Store** (`store.ts`) — a thin Zustand wrapper that orchestrates the pure
  operations and wires persistence. `createResumeStore()` builds isolated instances
  (used by tests); `useResumeStore` is the app singleton.
- **Persistence** (`persistence.ts`) — SSR-safe, debounced LocalStorage adapter
  behind Zustand's `persist`, with versioned `migrate`.

Planned additional stores in later milestones: `jobStore` (M4), `analysisStore`
(cache of scoring/matching results, M3–M4), `settingsStore` (locale/theme/template),
and a transient `uiStore`. Analysis results will be **derived, not duplicated** — a
pure function of `activeResume + currentJob`, memoized and cached for display only.

### Lifecycle per analysis view
`empty` (no resume/job) → `editing` → `analyzing` (engine running, possibly in a Web Worker) → `analyzed` → `exporting`. Every state has an explicit render; there are no placeholder-only paths.

## 5. Persistence & storage schema
- **Mechanism:** `localStorage`, wrapped by `features/resume/persistence.ts` with an SSR-safe adapter, debounced writes (autosave), and a `schemaVersion`.
- **Migrations:** `migrations.ts` upgrades older payloads one version at a time on load; the store validates the result with Zod and falls back to empty rather than corrupting state. Unknown/newer versions are not downgraded.
- **Namespacing:** keys prefixed `cvpower:` (e.g. `cvpower:resume-store`). A future `wipeAll()` clears every `cvpower:*` key.
- **Size discipline:** store text and structured JSON only — never binaries or embedded fonts/images. Warn the user near the ~5MB quota.
- **Backup:** `serialization.ts` exports/imports a single validated JSON blob (`cvpower-backup`) for manual portability between devices, in `replace` or `merge` mode.

## 6. Engines (client-side, pure)
- **Scoring** — explainable 0–100 with weighted sub-scores. See [scoring-engine.md](scoring-engine.md).
- **Job matching** — maps JD requirements to resume evidence. See [job-matching.md](job-matching.md).
- **PDF export** — deterministic, ATS-safe, selectable-text output. See [pdf-export.md](pdf-export.md).
- **Parsing** — pdf.js (PDF) and mammoth (DOCX) adapters normalize uploads into the resume model; lazy-loaded so they stay out of the initial bundle.

Heavy work (scoring on large inputs, PDF generation) runs in a **Web Worker** where practical to keep the UI at 60fps.

## 7. Performance strategy
Code-split parsers and the PDF engine; `optimizePackageImports` for icons; memoized selectors; debounced persistence; virtualize long lists (keyword/gap explorer). Target: time-to-first-score < 300 ms on typical inputs; Lighthouse performance ≥ 95.

## 8. Accessibility
Radix primitives give us keyboard and screen-reader support by default. Global visible focus rings, semantic headings, `dir`-aware layout, color-contrast-safe tokens, and reduced-motion respect are mandatory.

## 9. Internationalization
`next-intl` with locale-prefixed routing (`/[locale]`), `en` + `ar`, RTL via `dir` on `<html>`. See [ui-design.md](ui-design.md#rtl) and the localization section below.

## 10. Testing
Unit (Vitest) for engines and utils — engines are pure, so coverage targets are high (≥ 90% for `lib/scoring`, `lib/matching`). Component tests (Vitest + Testing Library) for interactive UI. E2E (Playwright) for the core loop: import → analyze → export. CI runs typecheck + lint + unit + build on every PR.

## 11. Deployment
Static-friendly Next build deployed to Vercel. No environment secrets. Preview deploys per PR; production on `main`. See the deployment section in [roadmap.md](roadmap.md) and the CI workflow in `.github/workflows/ci.yml`.
