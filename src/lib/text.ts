/**
 * Small, dependency-free text utilities shared by the matching and scoring
 * engines. Deterministic and pure — no network, no models.
 */

/** Lowercase and collapse whitespace. */
export function normalizeText(input: string): string {
  return input.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Escape a string for safe use inside a RegExp. */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Word tokens: sequences of letters/numbers (Unicode-aware) plus a few symbols
 * common in tech terms (+, #, .). Used for keyword frequency.
 */
export function tokenize(input: string): string[] {
  const matches = input.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}+#.]*/gu);
  return matches ? matches.filter((token) => token.length > 1 || /[\p{L}\p{N}]/u.test(token)) : [];
}

/** Common English stopwords (kept intentionally small and practical). */
export const STOPWORDS = new Set<string>([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'for', 'to', 'of', 'in', 'on',
  'at', 'by', 'with', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'this',
  'that', 'these', 'those', 'it', 'its', 'we', 'you', 'your', 'our', 'they', 'their', 'will',
  'would', 'can', 'could', 'should', 'may', 'might', 'must', 'have', 'has', 'had', 'do', 'does',
  'did', 'not', 'no', 'so', 'up', 'out', 'about', 'into', 'over', 'than', 'too', 'very', 'just',
  'per', 'via', 'etc', 'e.g', 'i.e', 'who', 'whom', 'which', 'what', 'when', 'where', 'why',
  'how', 'all', 'any', 'both', 'each', 'more', 'most', 'other', 'some', 'such', 'only', 'own',
  'same', 'also', 'able', 'across', 'within', 'including', 'include', 'includes', 'work',
  'working', 'role', 'team', 'teams', 'help', 'using', 'use', 'used', 'strong', 'good', 'great',
  'plus', 'years', 'year', 'experience', 'experienced', 'skills', 'skill', 'ability', 'looking',
  'join', 'candidate', 'candidates', 'ideal', 'you\'ll', 'we\'re', 'you\'re',
]);

/** Drop stopwords and 1-character tokens. */
export function removeStopwords(tokens: string[]): string[] {
  return tokens.filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

/** Generate n-grams (joined by a single space) of the given size. */
export function ngrams(tokens: string[], size: number): string[] {
  if (size <= 1) return [...tokens];
  const result: string[] = [];
  for (let i = 0; i + size <= tokens.length; i++) {
    result.push(tokens.slice(i, i + size).join(' '));
  }
  return result;
}

/**
 * Very light stemmer: trims a few common English suffixes so "manages",
 * "managing", "managed" collapse toward "manage". Heuristic, not linguistic.
 */
export function stem(word: string): string {
  let w = word;
  if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
  else if (w.length > 4 && w.endsWith('ies')) w = `${w.slice(0, -3)}y`;
  else if (w.length > 3 && w.endsWith('es')) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  return w;
}

/**
 * Whether `term` appears in `haystack` as a whole token (word-boundary aware,
 * tolerant of tech symbols like c++, c#, .net). Both should be lowercased.
 */
export function containsTerm(haystack: string, term: string): boolean {
  if (!term) return false;
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}+#.])${escapeRegExp(term)}(?=$|[^\\p{L}\\p{N}+#.])`, 'u');
  return pattern.test(haystack);
}

/** Count occurrences of each string. */
export function countBy(items: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return counts;
}

/** Whether the text contains a number/metric signal (digits, %, $, k+, x). */
export function hasMetric(text: string): boolean {
  return /\d/.test(text) || /%|\$|€|£/.test(text);
}
