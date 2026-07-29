# Changelog

All notable changes to CVPower are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Milestone 2 — Resume Core Engine
- Added the feature-based architecture under `src/features/` (resume implemented;
  scoring/matching/pdf/templates/ai/plugins reserved).
- Built the resume data engine in `src/features/resume`: Zod schema as the single
  source of truth with inferred TypeScript types; pure `operations` (all business
  logic, immutable); factories; a Zustand `store` (create/duplicate/delete,
  unlimited resumes, section CRUD); SSR-safe **debounced LocalStorage** persistence;
  versioned **migrations**; and JSON **backup** import/export (replace + merge).
- Added shared `lib/id` and `lib/debounce` utilities.
- Added Vitest unit tests for schema, operations, migrations, serialization,
  persistence (debounce), and the store.

### Resume Builder (UI)
- Added a **References** section to the data model, bumped the schema to **v2**,
  and added a v1→v2 migration that backfills it on existing data.
- Built the `/builder` route: a multi-step editor (Personal Info, Summary,
  Experience, Education, Skills, Languages, Certifications, Projects, References)
  bound directly to the Zustand store with autosave and Zod validation on change.
- Dynamic add/remove/reorder for every repeatable section; multiple resumes with
  create/duplicate/delete; JSON import/export; responsive layout; RTL/LTR; native
  keyboard-accessible controls.
- Added EN/AR translations for the whole builder, plus tests for field validation
  and the reorder utilities.

### Scoring, Job Matching & ATS
- Added the **matching** feature: a curated skills taxonomy (canonical + synonyms),
  resume indexing, job-description requirement extraction, and matched/partial/missing
  matching with weighted coverage. Current JD text persists on-device.
- Added the **scoring** feature: an explainable 0–100 score from weighted sub-scores
  (keyword coverage, skills match, ATS-friendliness, quantified impact, readability,
  completeness) plus an ATS analyzer and ranked, localized recommendations.
- Added the `/analyze` route: paste a job description to see the match score, a
  breakdown, requirement chips (matched/partial/missing), and recommendations — all
  computed in the browser, no external AI.
- Added shared `lib/text.ts` (tokenizer, stopwords, stemmer, n-grams), EN/AR
  translations, and unit tests for the taxonomy, matching, ATS, and scoring.

### Preview, Templates & PDF Export
- Added the **templates** feature: a shared, ATS-safe, single-column
  `ResumeDocument` with two themes (**classic**, **modern**); template choice is
  stored per resume (`meta.templateId`).
- Added the **pdf** feature: export via the browser's native print pipeline
  (`window.print()` + `@media print`), giving real selectable text (ATS-safe),
  correct fonts, and RTL — no new dependencies.
- Added the `/preview` route with a live preview, template picker, and Export
  button; wired a Preview/Export action into the builder (replacing the disabled
  "Next" on the final step).
- EN/AR translations and unit tests for template formatting + the theme registry.

### Fixed
- **i18n startup crash:** removed `hasLocale` (a next-intl **v4-only** export) which
  broke the app on the installed next-intl v3. Locale validation now uses a local
  `isValidLocale` type guard, and the root layout loads messages via `getMessages()`
  and passes them explicitly to `NextIntlClientProvider`.

### Security
- Upgraded **Next.js 15.3.0 → 15.5.21** (July 2026 security release) and
  `eslint-config-next` to match.
- Upgraded dev tooling (`vitest` → v3, `@vitejs/plugin-react`) to drop transitively
  flagged `esbuild`/`vite` versions.
- Run `npm audit` after install; use `npm audit fix` for any remaining transitive
  advisories.

### Milestone 1 — Foundation & Design System
- Initialized Next.js 15 + React 19 + TypeScript project.
- Configured Tailwind CSS design tokens (light/dark) and shadcn/ui.
- Set up `next-intl` locale routing with English + Arabic (RTL) support.
- Added `next-themes` theming and app providers.
- Built the reusable UI component library (button, card, input, textarea, label,
  badge, separator, progress, skeleton, switch, tabs, dialog, tooltip,
  dropdown-menu, sheet, toast).
- Added brand components (logo, privacy badge) and layout shell (header, footer).
- Authored planning docs under `docs/` and repo hygiene (CI, issue/PR templates).

[Unreleased]: https://github.com/awt1998/CVPower/commits/main
