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
