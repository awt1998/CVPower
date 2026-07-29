import { describe, it, expect } from 'vitest';
import { analyzeAts } from '../ats';
import { createResume } from '@/features/resume';

describe('analyzeAts', () => {
  it('flags the gaps in an empty resume', () => {
    const ats = analyzeAts(createResume());
    const failing = ats.checks.filter((c) => !c.ok).map((c) => c.id);
    expect(failing).toContain('email');
    expect(failing).toContain('experience');
    expect(ats.score).toBeLessThan(1);
  });

  it('scores a complete resume highly', () => {
    const resume = createResume();
    resume.basics.fullName = 'Sara';
    resume.basics.email = 'sara@example.com';
    resume.basics.phone = '0555';
    resume.basics.summary = 'A professional summary long enough to satisfy the ATS check.';
    resume.sections.experience.push({
      id: 'e1',
      company: 'ACME',
      role: 'Engineer',
      current: true,
      startDate: '2020-01',
      highlights: ['Improved performance by 20%'],
    });
    resume.sections.skills.push({ id: 's1', category: 'Tech', items: ['React'] });

    expect(analyzeAts(resume).score).toBeGreaterThan(0.8);
  });
});
