# feature: ai

On-device, **rule-based** resume suggestions. Strictly no external/paid LLM — the
name reflects the goal (smart help), not a hosted model.

- `bullet.ts` — `analyzeBullet` / `analyzeBullets`: detect weak openers, missing
  metrics, passive voice, and length problems in achievement bullets.
- `components/bullet-hints.tsx` — inline, non-blocking hints shown under each bullet
  in the builder (experience & projects).

Deterministic and fully unit-tested. Future rules (e.g. a strong-verb library) plug
in here.
