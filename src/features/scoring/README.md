# feature: scoring

The resume scoring engine + ATS analyzer. Pure, deterministic, explainable.

- `score.ts` — `scoreResume`: a 0–100 composite of weighted sub-scores (keyword
  coverage, skills match, ATS-friendliness, quantified impact, readability,
  completeness), re-weighted when no job is provided.
- `ats.ts` — `analyzeAts`: structural ATS checks (contact, dates, sections, bullet length).
- `analyze.ts` — `analyzeResume`: the engine entry point; composes matching + scoring.
- Reasons carry a `code` + `params` resolved to localized text in the UI, so the
  engine stays language-agnostic. `components/` render the score, breakdown, gaps,
  and ranked recommendations on `/analyze`.

See [../../../docs/scoring-engine.md](../../../docs/scoring-engine.md).
