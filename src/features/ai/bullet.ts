import { normalizeText, hasMetric } from '@/lib/text';

/**
 * Rule-based bullet-point analyzer. Detects common resume weaknesses so users can
 * self-improve. 100% deterministic and on-device — no external/paid LLM.
 */
export type BulletIssueCode = 'weakOpener' | 'noMetric' | 'passive' | 'tooLong' | 'tooShort';

export type BulletSeverity = 'high' | 'medium' | 'low';

export interface BulletIssue {
  code: BulletIssueCode;
  severity: BulletSeverity;
}

export interface BulletFeedback {
  issues: BulletIssue[];
  ok: boolean;
}

/** Weak phrases that bury the achievement; a bullet should open with an action verb. */
const WEAK_OPENERS = [
  'responsible for',
  'worked on',
  'helped',
  'assisted',
  'involved in',
  'tasked with',
  'participated in',
  'duties included',
  'in charge of',
  'responsible',
  // Arabic weak openers
  'مسؤول عن',
  'عملت على',
  'ساعدت',
  'شاركت في',
  'قمت بـ',
  'مكلف بـ',
  'كنت مسؤولا عن',
];

/** Filler first words that weaken a bullet. */
const FILLER_STARTS = new Set(['i', 'we', 'my', 'a', 'an', 'the', 'was', 'were']);

const PASSIVE_RE = /\b(?:was|were|been|being|is|are|be)\s+\w+(?:ed|en)\b/i;

const MIN_WORDS = 4;
const MAX_WORDS = 40;

/** Analyze a single bullet and return the issues found (empty text is fine). */
export function analyzeBullet(text: string): BulletFeedback {
  const trimmed = text.trim();
  if (!trimmed) return { issues: [], ok: true };

  const words = trimmed.split(/\s+/).filter(Boolean);
  const lower = normalizeText(trimmed);
  const firstWord = (words[0] ?? '').toLowerCase().replace(/[^a-z]/g, '');
  const issues: BulletIssue[] = [];

  if (WEAK_OPENERS.some((phrase) => lower.startsWith(phrase)) || FILLER_STARTS.has(firstWord)) {
    issues.push({ code: 'weakOpener', severity: 'high' });
  }
  if (!hasMetric(trimmed)) {
    issues.push({ code: 'noMetric', severity: 'medium' });
  }
  if (PASSIVE_RE.test(trimmed)) {
    issues.push({ code: 'passive', severity: 'low' });
  }
  if (words.length < MIN_WORDS) {
    issues.push({ code: 'tooShort', severity: 'low' });
  } else if (words.length > MAX_WORDS) {
    issues.push({ code: 'tooLong', severity: 'medium' });
  }

  return { issues, ok: issues.length === 0 };
}

/** Analyze many bullets at once. */
export function analyzeBullets(bullets: string[]): BulletFeedback[] {
  return bullets.map(analyzeBullet);
}
