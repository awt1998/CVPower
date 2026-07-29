import { describe, it, expect } from 'vitest';
import { analyzeResume } from '../analyze';
import { createResume } from '@/features/resume';

describe('analyzeResume', () => {
  it('returns a baseline score when no job is provided', () => {
    const { score, match, job } = analyzeResume(createResume({ title: 'x' }));
    expect(match).toBeNull();
    expect(job).toBeNull();
    expect(score.hasJob).toBe(false);
    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.subScores.find((s) => s.dimension === 'keywordCoverage')?.applicable).toBe(false);
  });

  it('scores a matching resume higher than a non-matching one', () => {
    const strong = createResume();
    strong.basics.fullName = 'Sara';
    strong.basics.email = 'sara@example.com';
    strong.sections.skills.push({ id: 's1', category: 'Tech', items: ['React', 'TypeScript', 'AWS'] });

    const jobText = 'Looking for a React, TypeScript and AWS engineer.';
    const strongResult = analyzeResume(strong, jobText);
    const weakResult = analyzeResume(createResume(), jobText);

    expect(strongResult.match).not.toBeNull();
    expect(strongResult.score.hasJob).toBe(true);
    expect(strongResult.score.overall).toBeGreaterThan(weakResult.score.overall);
  });

  it('recommends adding a missing required skill', () => {
    const resume = createResume();
    resume.basics.fullName = 'Sara';
    resume.basics.email = 'sara@example.com';
    const { score } = analyzeResume(resume, 'Must have Kubernetes experience.');
    expect(score.reasons.map((r) => r.code)).toContain('addTerm');
  });
});
