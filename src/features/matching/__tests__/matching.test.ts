import { describe, it, expect } from 'vitest';
import { analyzeJob } from '../job-analysis';
import { matchRequirements } from '../match';
import { buildResumeIndex } from '../resume-index';
import { createResume } from '@/features/resume';

function resumeWithSkills(items: string[]) {
  const resume = createResume({ title: 'Dev' });
  resume.sections.skills.push({ id: 'sk', category: 'Tech', items });
  return resume;
}

describe('analyzeJob', () => {
  it('extracts skills and marks "a plus" skills as preferred', () => {
    const job = analyzeJob(
      'We need a React and TypeScript developer. Experience with AWS is a plus.',
    );
    expect(job.skills).toContain('React');
    expect(job.skills).toContain('AWS');

    const aws = job.requirements.find((r) => r.term === 'aws');
    expect(aws?.required).toBe(false);
    const react = job.requirements.find((r) => r.term === 'react');
    expect(react?.required).toBe(true);
  });
});

describe('matchRequirements', () => {
  it('marks present skills matched and absent skills missing', () => {
    const job = analyzeJob('Looking for React and AWS experience.');
    const index = buildResumeIndex(resumeWithSkills(['React', 'TypeScript']));
    const match = matchRequirements(index, job);

    expect(match.items.find((i) => i.requirement.term === 'react')?.status).toBe('matched');
    expect(match.items.find((i) => i.requirement.term === 'aws')?.status).toBe('missing');
    expect(match.coverage).toBeGreaterThan(0);
    expect(match.coverage).toBeLessThan(1);
  });
});
