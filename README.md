<div align="center">

# CVPower

**The best free, privacy-first resume optimization platform.**

Paste your resume and a job description. CVPower scores your match, tells you exactly what to fix, and exports an ATS-safe PDF — all in your browser. Nothing is ever uploaded.

[Vision](docs/vision.md) · [PRD](docs/prd.md) · [Architecture](docs/architecture.md) · [Roadmap](docs/roadmap.md) · [Contributing](docs/contributing.md)

</div>

---

## Why CVPower

- **Free forever.** No paywalls, no feature gating, no accounts.
- **Private by design.** No backend, no database, no tracking. Your data stays on your device via LocalStorage.
- **Actually helps you get hired.** Transparent match scoring, ranked fixes, and ATS analysis — not just a pretty template.
- **Premium feel.** Minimal, fast, and elegant. Built to feel like a paid product.

## Tech Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Zustand · React Hook Form · Zod · next-intl · Lucide Icons.

## Getting Started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The app redirects to your locale (e.g. `/en`).

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run format` | Prettier write |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |

## Privacy

CVPower makes **no network requests with your data**. Resume content, job descriptions, and analysis results are computed locally and stored only in your browser. Clearing your browser storage (or the in-app "wipe all data" control) removes everything.

## Project Structure

See [docs/architecture.md](docs/architecture.md) for the full breakdown. High level:

```
src/
├── app/[locale]/      # App Router pages (locale-scoped)
├── components/        # ui/ primitives, brand/, layout/, common/
├── lib/               # utils and (future) engines
├── i18n/              # next-intl routing/request/navigation
├── hooks/             # reusable hooks
└── config/            # site metadata
messages/              # en.json, ar.json
docs/                  # planning documentation
```

## Features

- **Dashboard** (`/dashboard`) — manage all your resumes with a quality score at a glance.
- **Builder** (`/builder`) — a fast, guided, multi-section editor with autosave, JSON backup, and inline bullet hints.
- **Analyze** (`/analyze`) — paste a job description for a transparent match score, gaps, and ranked recommendations; add missing skills in one click.
- **Preview & export** (`/preview`) — ATS-safe templates and a real-text PDF export.
- **Cover letter** (`/cover-letter`) — a guided, job-aware cover letter with a checklist and PDF export.

All of it runs in your browser, in English and Arabic (RTL), with your data stored only on your device.

## Roadmap

CVPower is built milestone by milestone. See [docs/roadmap.md](docs/roadmap.md). The foundation, resume engine, builder, scoring/matching/ATS, templates/PDF, dashboard, and cover-letter milestones are complete; remaining work is polish and launch.

## Contributing

Contributions are welcome. Read [docs/contributing.md](docs/contributing.md) and [docs/project-rules.md](docs/project-rules.md) first.

## License

[MIT](LICENSE) — free forever.
