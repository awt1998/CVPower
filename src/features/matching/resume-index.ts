import type { Resume } from '@/features/resume/types';
import { normalizeText, tokenize, removeStopwords, stem } from '@/lib/text';
import { extractSkills } from './taxonomy';
import type { ResumeIndex } from './types';

/** Flatten a resume into a single searchable text blob. */
export function extractResumeText(resume: Resume): string {
  const { basics, sections } = resume;
  const parts: string[] = [basics.fullName, basics.headline ?? '', basics.summary ?? ''];

  for (const e of sections.experience) {
    parts.push(e.role, e.company, e.location ?? '', e.summary ?? '', ...e.highlights, ...(e.technologies ?? []));
  }
  for (const ed of sections.education) {
    parts.push(ed.institution, ed.degree, ed.field ?? '', ...ed.highlights);
  }
  for (const s of sections.skills) {
    parts.push(s.category, ...s.items);
  }
  for (const p of sections.projects) {
    parts.push(p.name, p.description ?? '', ...p.highlights, ...(p.technologies ?? []));
  }
  for (const c of sections.certifications) {
    parts.push(c.name, c.issuer ?? '');
  }
  for (const l of sections.languages) {
    parts.push(l.name);
  }
  for (const cs of sections.custom) {
    parts.push(cs.title);
    for (const it of cs.items) {
      parts.push(it.title ?? '', it.subtitle ?? '', it.description ?? '', ...it.highlights);
    }
  }

  return parts.filter(Boolean).join('. ');
}

/** Build the searchable index used by the matching and scoring engines. */
export function buildResumeIndex(resume: Resume): ResumeIndex {
  const text = extractResumeText(resume);
  const normalized = normalizeText(text);
  const tokens = removeStopwords(tokenize(normalized));
  const skills = new Set(extractSkills(text).map((s) => s.canonical.toLowerCase()));

  return {
    text: normalized,
    skills,
    tokens: new Set(tokens),
    stems: new Set(tokens.map(stem)),
  };
}
