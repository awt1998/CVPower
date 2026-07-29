import { describe, it, expect } from 'vitest';
import { diffResumes } from '../diff';
import { createResume } from '@/features/resume';

describe('diffResumes', () => {
  it('separates shared, only-A, and only-B content', () => {
    const a = createResume();
    a.basics.summary = 'Shared summary line';
    a.sections.skills.push({ id: 's', category: 'T', items: ['React'] });

    const b = createResume();
    b.basics.summary = 'Shared summary line';
    b.sections.skills.push({ id: 's2', category: 'T', items: ['Vue'] });

    const diff = diffResumes(a, b);
    expect(diff.shared).toBeGreaterThanOrEqual(1);
    expect(diff.onlyA).toContain('React');
    expect(diff.onlyB).toContain('Vue');
  });
});
