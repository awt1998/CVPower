import { describe, it, expect } from 'vitest';
import { healthScore, resumeHealth, metricStatus, scoreSkills } from '../metrics';
import { createResume } from '@/features/resume';

function filledResume() {
  const r = createResume();
  r.basics.fullName = 'Sara';
  r.basics.email = 'sara@example.com';
  r.basics.phone = '0555';
  r.basics.summary = 'A sufficiently long professional summary so the ATS content check passes.';
  r.sections.experience.push({
    id: 'e1',
    company: 'ACME',
    role: 'Engineer',
    current: true,
    startDate: '2020-01',
    highlights: ['Increased revenue by 30% across two markets'],
  });
  r.sections.skills.push({ id: 's1', category: 'Tech', items: ['React', 'TypeScript'] });
  return r;
}

describe('metrics', () => {
  it('metricStatus maps to the right bands', () => {
    expect(metricStatus(80)).toBe('green');
    expect(metricStatus(60)).toBe('yellow');
    expect(metricStatus(20)).toBe('red');
  });

  it('resumeHealth returns 10 metrics and a low score for an empty resume', () => {
    const health = resumeHealth(createResume());
    expect(health.metrics).toHaveLength(10);
    expect(health.overall).toBeLessThan(50);
  });

  it('scores a filled resume higher than an empty one', () => {
    expect(healthScore(filledResume())).toBeGreaterThan(healthScore(createResume()));
  });

  it('rewards more skills', () => {
    const r = createResume();
    r.sections.skills.push({ id: 's', category: 'T', items: ['React', 'TypeScript', 'AWS'] });
    expect(scoreSkills(r)).toBeGreaterThan(0);
  });
});
