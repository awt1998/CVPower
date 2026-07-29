import { hasMetric } from '@/lib/text';
import { analyzeJob } from '@/features/matching';

/** A structured cover letter. Not generative — the user writes it, guided. */
export interface CoverLetter {
  senderName: string;
  recipientName: string;
  company: string;
  role: string;
  intro: string;
  body: string;
  closing: string;
}

/** Assemble the fields into a plain-text letter ready to copy or print. The
 * `greeting` line (e.g. "Dear Hiring Manager,") is built by the caller so it can
 * be localized. */
export function assembleCoverLetter(letter: CoverLetter, greeting: string): string {
  const parts = [greeting, letter.intro, letter.body, letter.closing, letter.senderName]
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.join('\n\n');
}

export type CoverCheckId = 'company' | 'role' | 'keywords' | 'metric' | 'length';

export interface CoverCheck {
  id: CoverCheckId;
  ok: boolean;
}

const MIN_WORDS = 80;
const MAX_WORDS = 350;

/** A JD-aware quality checklist for the letter (all client-side). */
export function coverChecklist(letter: CoverLetter, jobText: string): CoverCheck[] {
  const written = `${letter.intro} ${letter.body} ${letter.closing}`;
  const text = written.toLowerCase();
  const words = written.split(/\s+/).filter(Boolean).length;

  const jobSkills = jobText.trim() ? analyzeJob(jobText).skills : [];
  const referenced = jobSkills.filter((skill) => text.includes(skill.toLowerCase())).length;

  return [
    { id: 'company', ok: letter.company.trim().length > 0 && text.includes(letter.company.toLowerCase()) },
    { id: 'role', ok: letter.role.trim().length > 0 && text.includes(letter.role.toLowerCase()) },
    { id: 'keywords', ok: referenced >= 2 },
    { id: 'metric', ok: hasMetric(text) },
    { id: 'length', ok: words >= MIN_WORDS && words <= MAX_WORDS },
  ];
}
