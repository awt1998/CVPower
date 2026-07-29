# feature: matching

The job-matching engine. Pure, client-side, no LLM.

- `taxonomy.ts` — curated skills dictionary (canonical + synonyms + categories) and
  `extractSkills` / `resolveSkill`. This is data; extend it via PR to improve quality.
- `resume-index.ts` — flattens a resume into a searchable index (skills, tokens, stems).
- `job-analysis.ts` — `analyzeJob`: extracts requirements (skills + keywords) from a JD
  and marks "nice to have" items as preferred.
- `match.ts` — `matchRequirements`: matched / partial / missing per requirement + weighted coverage.
- `store.ts` — persists the current JD text on-device.

See [../../../docs/job-matching.md](../../../docs/job-matching.md).
