import {
  createResume,
  createExperience,
  createEducation,
  createSkillGroup,
  createProject,
} from '@/features/resume/factory';
import { extractSkills } from '@/features/matching';
import type { Resume } from '@/features/resume/types';

/**
 * Best-effort heuristic parser: turns extracted resume text into a structured
 * resume. Imperfect by nature — it fills what it can confidently detect
 * (contact, skills, section blocks) and leaves the rest for the user to refine.
 */

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE = /\+?\d[\d\s()-]{7,}\d/;
const URL = /\bhttps?:\/\/[^\s]+/i;

const HEADERS: { key: 'summary' | 'experience' | 'education' | 'skills' | 'projects'; re: RegExp }[] = [
  { key: 'summary', re: /^(summary|profile|objective|about)\b/i },
  { key: 'experience', re: /^(experience|employment|work history|professional experience)\b/i },
  { key: 'education', re: /^(education|academic)\b/i },
  { key: 'skills', re: /^(skills|technical skills|core skills)\b/i },
  { key: 'projects', re: /^(projects|selected projects)\b/i },
];

interface Entry {
  title: string;
  bullets: string[];
}

function splitSections(lines: string[]): Partial<Record<string, string[]>> {
  const out: Partial<Record<string, string[]>> = {};
  let current: string | null = null;
  for (const raw of lines) {
    const line = raw.trim();
    const header = line.length <= 40 ? HEADERS.find((h) => h.re.test(line)) : undefined;
    if (header) {
      current = header.key;
      out[current] = out[current] ?? [];
      continue;
    }
    if (current) out[current]!.push(raw);
  }
  return out;
}

function parseEntries(lines: string[]): Entry[] {
  const blocks: string[][] = [];
  let block: string[] = [];
  for (const raw of lines) {
    if (raw.trim() === '') {
      if (block.length) blocks.push(block);
      block = [];
    } else {
      block.push(raw.trim());
    }
  }
  if (block.length) blocks.push(block);

  return blocks
    .map((b) => ({
      title: b[0] ?? '',
      bullets: b
        .slice(1)
        .map((l) => l.replace(/^[•\-*•]\s*/, '').trim())
        .filter(Boolean),
    }))
    .filter((e) => e.title);
}

export function buildResumeFromText(text: string): Resume {
  const lines = text.split(/\r?\n/);
  const resume = createResume({ title: 'Imported resume' });

  const email = text.match(EMAIL);
  if (email) resume.basics.email = email[0];
  const website = text.match(URL);
  if (website) resume.basics.website = website[0];
  const phone = text.match(PHONE);
  if (phone) resume.basics.phone = phone[0].trim();

  const firstLine = lines
    .map((l) => l.trim())
    .find((l) => l && !EMAIL.test(l) && !PHONE.test(l) && !URL.test(l));
  if (firstLine && firstLine.length <= 60) resume.basics.fullName = firstLine;

  const sections = splitSections(lines);

  if (sections.summary?.length) {
    resume.basics.summary = sections.summary.join(' ').trim().slice(0, 2000);
  }

  const skillItems = new Set<string>(extractSkills(text).map((d) => d.canonical));
  if (sections.skills?.length) {
    for (const line of sections.skills) {
      for (const part of line.split(/[,•|/]/)) {
        const skill = part.trim();
        if (skill && skill.length <= 40) skillItems.add(skill);
      }
    }
  }
  if (skillItems.size > 0) {
    resume.sections.skills = [
      createSkillGroup({ category: 'Skills', items: [...skillItems].slice(0, 30) }),
    ];
  }

  if (sections.experience?.length) {
    resume.sections.experience = parseEntries(sections.experience).map((e) =>
      createExperience({ role: e.title, current: false, highlights: e.bullets }),
    );
  }
  if (sections.education?.length) {
    resume.sections.education = parseEntries(sections.education).map((e) =>
      createEducation({ institution: e.title, current: false, highlights: e.bullets }),
    );
  }
  if (sections.projects?.length) {
    resume.sections.projects = parseEntries(sections.projects).map((e) =>
      createProject({ name: e.title, highlights: e.bullets }),
    );
  }

  // Nothing structured detected — keep the raw text so nothing is lost.
  if (!resume.basics.summary && !sections.experience?.length && skillItems.size === 0) {
    resume.basics.summary = text.trim().slice(0, 2000);
  }

  return resume;
}
