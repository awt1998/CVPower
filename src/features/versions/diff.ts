import type { Resume } from '@/features/resume/types';

/** Meaningful content lines of a resume (summary + bullets + skills). */
export function resumeLines(resume: Resume): string[] {
  const lines: string[] = [];
  if (resume.basics.summary?.trim()) lines.push(resume.basics.summary.trim());
  for (const e of resume.sections.experience) {
    lines.push(...e.highlights.map((h) => h.trim()).filter(Boolean));
  }
  for (const p of resume.sections.projects) {
    lines.push(...p.highlights.map((h) => h.trim()).filter(Boolean));
  }
  for (const g of resume.sections.skills) lines.push(...g.items);
  return lines;
}

export interface LineDiff {
  onlyA: string[];
  onlyB: string[];
  shared: number;
}

/** A simple set-based content diff between two resume versions. */
export function diffResumes(a: Resume, b: Resume): LineDiff {
  const linesA = resumeLines(a);
  const linesB = resumeLines(b);
  const setA = new Set(linesA.map((x) => x.toLowerCase()));
  const setB = new Set(linesB.map((x) => x.toLowerCase()));

  return {
    onlyA: linesA.filter((x) => !setB.has(x.toLowerCase())),
    onlyB: linesB.filter((x) => !setA.has(x.toLowerCase())),
    shared: linesA.filter((x) => setB.has(x.toLowerCase())).length,
  };
}
