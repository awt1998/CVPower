# CVPower — Roadmap

Built milestone by milestone. Each milestone is shippable, independently valuable, and gated on the previous one. Every milestone begins with a goal + architecture + implementation plan before code (see [project-rules.md](project-rules.md)).

## ✅ Milestone 1 — Foundation & Design System
Project init (Next.js 15, React 19, TS), full folder structure, design tokens (light/dark), shadcn/ui component library, brand + layout shell, `next-intl` EN/AR + RTL wiring, theming, repo hygiene (CI, issue/PR templates), and planning docs. **No feature logic.**

## ✅ Milestone 2 — Resume Data Model & Builder
Canonical `Resume` types, Zustand stores + LocalStorage persistence (schema versioning + migrations + wipe), the structured resume editor (React Hook Form + Zod) with all sections, live preview, and multiple profiles. Client-side import (PDF via pdf.js, DOCX via mammoth) with a manual-correction fallback.

## ✅ Milestone 3 — Scoring Engine & ATS Analyzer
Skills taxonomy v1, the pure scoring engine with weighted sub-scores and explainable reasons, the ATS analyzer, and the analysis UI (score ring, sub-score breakdown). Web Worker for heavy compute. High unit-test coverage.

## ✅ Milestone 4 — Job Matching & Recommendations
JD input + requirement extraction, the matching engine (matched/partial/missing), the keyword-gap explorer, and ranked actionable recommendations with estimated impact and one-click insert. Re-score loop.

## ✅ Milestone 5 — Templates & PDF Export
ATS-safe premium templates behind a common interface, the PDF export engine (selectable text, embedded fonts, RTL), export dialog, and print support. Arabic export tests.

## Milestone 6 — Polish, Should-Haves & Launch (in progress)
Done: bullet improver (rule-based), one-click skill insert, resumes dashboard,
cover-letter assist, JSON backup import/export, richer landing page, SEO
(metadata/OG, robots, sitemap), and a skip-to-content link. Remaining: diff view,
keyword-gap explorer, readability panel, full performance budget verification, and
final launch prep. Already public on GitHub and deployed on Vercel.

## Deployment strategy
- **Host:** Vercel. No environment secrets (the app has none).
- **Flow:** preview deploy per PR; production on `main`.
- **Gates:** CI (typecheck + lint + unit + build) must pass before merge; Lighthouse performance ≥ 95 tracked.
- **Rollback:** Vercel instant rollback to a previous deployment.

## Testing strategy (summary)
Unit (Vitest) for engines/utils with high coverage; component tests (Vitest + Testing Library); E2E (Playwright) for the import → analyze → export loop; accessibility checks per component. Details in [architecture.md](architecture.md#testing).
