import type { Resume } from '@/features/resume/types';
import type { AtsCheck, AtsResult, Severity } from './types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LONG_BULLET = 240;

function severityWeight(severity: Severity): number {
  if (severity === 'high') return 3;
  if (severity === 'medium') return 2;
  return 1;
}

/** Collect every bullet across experience, projects and education. */
export function collectBullets(resume: Resume): string[] {
  const bullets: string[] = [];
  for (const e of resume.sections.experience) bullets.push(...e.highlights);
  for (const p of resume.sections.projects) bullets.push(...p.highlights);
  for (const ed of resume.sections.education) bullets.push(...ed.highlights);
  return bullets.map((b) => b.trim()).filter(Boolean);
}

/**
 * Evaluate structural ATS-friendliness of the resume data. These are the checks
 * that keep a resume parseable and complete for applicant tracking systems.
 */
export function analyzeAts(resume: Resume): AtsResult {
  const { basics, sections } = resume;
  const bullets = collectBullets(resume);
  const checks: AtsCheck[] = [];

  const add = (id: string, ok: boolean, severity: Severity, code: string) =>
    checks.push({ id, ok, severity, code });

  add('name', basics.fullName.trim().length > 0, 'high', 'atsName');
  add('email', Boolean(basics.email && EMAIL_RE.test(basics.email)), 'high', 'atsEmail');
  add('phone', Boolean(basics.phone && basics.phone.trim()), 'medium', 'atsPhone');
  add('summary', Boolean(basics.summary && basics.summary.trim().length >= 40), 'low', 'atsSummary');
  add('experience', sections.experience.length > 0, 'high', 'atsExperience');

  const datesOk =
    sections.experience.length === 0 ||
    sections.experience.every((e) => Boolean(e.startDate) && (e.current || Boolean(e.endDate)));
  add('dates', datesOk, 'medium', 'atsDates');

  add('skills', sections.skills.some((s) => s.items.length > 0), 'medium', 'atsSkills');
  add('bulletLength', !bullets.some((b) => b.length > LONG_BULLET), 'low', 'atsBulletLength');

  let total = 0;
  let achieved = 0;
  for (const check of checks) {
    const weight = severityWeight(check.severity);
    total += weight;
    if (check.ok) achieved += weight;
  }

  return { score: total > 0 ? achieved / total : 1, checks };
}
