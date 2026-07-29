import { describe, it, expect } from 'vitest';
import { extractSkills, resolveSkill } from '../taxonomy';

describe('extractSkills', () => {
  it('detects skills via their synonyms', () => {
    const found = extractSkills('Experienced with JS, React and Postgres.').map((s) => s.canonical);
    expect(found).toContain('JavaScript');
    expect(found).toContain('React');
    expect(found).toContain('PostgreSQL');
  });

  it('respects word boundaries (does not read Java from JavaScript)', () => {
    const found = extractSkills('A strong JavaScript developer').map((s) => s.canonical);
    expect(found).toContain('JavaScript');
    expect(found).not.toContain('Java');
  });

  it('handles symbol-heavy skills (C#, C++, Node.js)', () => {
    const found = extractSkills('Built services in C# and C++ with Node.js').map((s) => s.canonical);
    expect(found).toContain('C#');
    expect(found).toContain('C++');
    expect(found).toContain('Node.js');
  });

  it('returns each canonical skill only once', () => {
    const found = extractSkills('react react reactjs react.js').map((s) => s.canonical);
    expect(found.filter((c) => c === 'React')).toHaveLength(1);
  });
});

describe('resolveSkill', () => {
  it('resolves an alias to its canonical', () => {
    expect(resolveSkill('k8s')?.canonical).toBe('Kubernetes');
  });

  it('returns null for an unknown term', () => {
    expect(resolveSkill('zzz-not-a-skill')).toBeNull();
  });
});
