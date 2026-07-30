import { normalizeText, tokenize, removeStopwords, countBy, ngrams } from '@/lib/text';
import { extractSkills } from './taxonomy';
import type { JobAnalysis, JobRequirement } from './types';

const PREFERRED_CUES = [
  'nice to have',
  'preferred',
  'a plus',
  'plus',
  'bonus',
  'ideally',
  'optional',
  'يفضل',
  'يُفضّل',
  'ميزة إضافية',
  'نقطة إضافية',
  'اختياري',
];
const MAX_KEYWORDS = 12;

/**
 * Turn a raw job description into structured requirements. Skills come from the
 * taxonomy; keywords are the most frequent remaining terms. Skills mentioned in
 * a "nice to have / preferred" context are downgraded to preferred (lower weight).
 */
export function analyzeJob(jobText: string): JobAnalysis {
  const normalized = normalizeText(jobText);
  const skills = extractSkills(jobText);
  const tokens = removeStopwords(tokenize(normalized));

  // Skills that appear in a clause marked as preferred/optional.
  const clauses = jobText
    .split(/[\n••;.|،؛]/)
    .map((clause) => normalizeText(clause))
    .filter(Boolean);
  const preferred = new Set<string>();
  for (const clause of clauses) {
    if (PREFERRED_CUES.some((cue) => clause.includes(cue))) {
      for (const skill of skills) {
        if (clause.includes(skill.canonical.toLowerCase())) preferred.add(skill.canonical.toLowerCase());
      }
    }
  }

  const skillRequirements: JobRequirement[] = skills.map((skill) => {
    const isPreferred = preferred.has(skill.canonical.toLowerCase());
    return {
      id: `skill:${skill.canonical.toLowerCase()}`,
      term: skill.canonical.toLowerCase(),
      label: skill.canonical,
      kind: 'skill',
      category: skill.category,
      required: !isPreferred,
      weight: isPreferred ? 1 : 2,
    };
  });

  // Keyword requirements: frequent non-skill unigrams and bigrams.
  const skillTerms = new Set(skills.map((s) => s.canonical.toLowerCase()));
  const unigrams = countBy(tokens);
  const bigrams = countBy(ngrams(tokens, 2));

  const candidates: { term: string; score: number }[] = [];
  for (const [term, count] of unigrams) {
    if (count < 2 || skillTerms.has(term)) continue;
    candidates.push({ term, score: count });
  }
  for (const [term, count] of bigrams) {
    if (count < 2) continue;
    candidates.push({ term, score: count * 1.5 });
  }
  candidates.sort((a, b) => b.score - a.score);

  const keywordRequirements: JobRequirement[] = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    if (keywordRequirements.length >= MAX_KEYWORDS) break;
    if (seen.has(candidate.term)) continue;
    seen.add(candidate.term);
    keywordRequirements.push({
      id: `kw:${candidate.term}`,
      term: candidate.term,
      label: candidate.term,
      kind: 'keyword',
      required: false,
      weight: 1,
    });
  }

  return {
    requirements: [...skillRequirements, ...keywordRequirements],
    skills: skills.map((s) => s.canonical),
    keywords: keywordRequirements.map((k) => k.label),
    wordCount: tokens.length,
  };
}
