import { describe, it, expect } from 'vitest';
import { analyzeBullet } from '../bullet';

const codes = (text: string) => analyzeBullet(text).issues.map((i) => i.code);

describe('analyzeBullet', () => {
  it('flags a weak opener and a missing metric', () => {
    const found = codes('Responsible for managing the support team');
    expect(found).toContain('weakOpener');
    expect(found).toContain('noMetric');
  });

  it('passes a strong, quantified bullet', () => {
    expect(analyzeBullet('Increased checkout conversion by 32% across three markets').ok).toBe(true);
  });

  it('flags a too-short bullet', () => {
    expect(codes('Led team')).toContain('tooShort');
  });

  it('flags a filler first word', () => {
    expect(codes('We shipped a new onboarding flow for 10k users')).toContain('weakOpener');
  });

  it('returns no issues for empty text', () => {
    expect(analyzeBullet('   ').issues).toHaveLength(0);
  });
});
