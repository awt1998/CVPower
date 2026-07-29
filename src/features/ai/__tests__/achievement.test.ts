import { describe, it, expect } from 'vitest';
import { generateAchievements } from '../achievement';

describe('generateAchievements', () => {
  it('always returns 5 suggestions by default', () => {
    expect(generateAchievements('Worked on customer service')).toHaveLength(5);
  });

  it('respects a custom count', () => {
    expect(generateAchievements('Managed a team', 3)).toHaveLength(3);
  });

  it('inserts placeholders when the input has no numbers', () => {
    const suggestions = generateAchievements('Managed onboarding');
    expect(suggestions.some((s) => s.hasPlaceholder)).toBe(true);
  });

  it('strips a weak opener into the topic', () => {
    const suggestions = generateAchievements('Responsible for onboarding new hires');
    expect(suggestions.every((s) => s.text.length > 0)).toBe(true);
    expect(suggestions[0]!.text.toLowerCase()).toContain('onboarding');
  });
});
