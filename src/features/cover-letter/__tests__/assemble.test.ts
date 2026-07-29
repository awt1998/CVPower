import { describe, it, expect } from 'vitest';
import { assembleCoverLetter, coverChecklist, type CoverLetter } from '../assemble';

const base: CoverLetter = {
  senderName: 'Sara',
  recipientName: '',
  company: 'ACME',
  role: 'Engineer',
  intro: 'I am applying for the Engineer role at ACME.',
  body: 'I increased conversion by 30% using React and TypeScript over two quarters of focused work on the funnel.',
  closing: 'Thank you for your consideration.',
};

describe('assembleCoverLetter', () => {
  it('joins the greeting and non-empty parts', () => {
    const text = assembleCoverLetter(base, 'Dear Hiring Manager,');
    expect(text.startsWith('Dear Hiring Manager,')).toBe(true);
    expect(text).toContain('ACME');
    expect(text.trim().endsWith('Sara')).toBe(true);
  });

  it('skips empty fields', () => {
    const text = assembleCoverLetter({ ...base, closing: '' }, 'Hi,');
    expect(text).not.toContain('\n\n\n');
  });
});

describe('coverChecklist', () => {
  it('passes company, role, and metric checks for a good letter', () => {
    const checks = coverChecklist(base, 'React and TypeScript engineer needed.');
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.ok]));
    expect(byId['company']).toBe(true);
    expect(byId['role']).toBe(true);
    expect(byId['metric']).toBe(true);
    expect(byId['keywords']).toBe(true);
  });

  it('flags a missing metric', () => {
    const checks = coverChecklist({ ...base, body: 'I am a hard worker and a fast learner.' }, '');
    expect(checks.find((c) => c.id === 'metric')?.ok).toBe(false);
  });
});
