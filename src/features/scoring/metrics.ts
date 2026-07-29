import type { Resume } from '@/features/resume/types';
import {
  analyzeJob,
  buildResumeIndex,
  extractResumeText,
  matchRequirements,
} from '@/features/matching';
import { hasMetric, tokenize, removeStopwords } from '@/lib/text';
import { analyzeBullet } from '@/features/ai/bullet';
import { analyzeAts, collectBullets } from './ats';

/**
 * Modular, reusable scoring functions. Each returns a 0–100 number and reuses the
 * existing pure engines (ATS, matching, bullet analysis). No React, no storage.
 */

export type MetricStatus = 'green' | 'yellow' | 'red';

export function metricStatus(score: number): MetricStatus {
  if (score >= 75) return 'green';
  if (score >= 50) return 'yellow';
  return 'red';
}

const pct = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const ratio = (part: number, total: number): number => (total > 0 ? part / total : 0);

/* ----------------------------- core scores ----------------------------- */

export function scoreATS(resume: Resume): number {
  return pct(analyzeAts(resume).score * 100);
}

export function scoreFormatting(resume: Resume): number {
  const checks = analyzeAts(resume).checks.filter((c) =>
    ['dates', 'bulletLength', 'experience', 'skills'].includes(c.id),
  );
  return checks.length === 0 ? 100 : pct(ratio(checks.filter((c) => c.ok).length, checks.length) * 100);
}

export function scoreContent(resume: Resume): number {
  const bullets = collectBullets(resume);
  if (bullets.length === 0) {
    return resume.basics.summary && resume.basics.summary.trim().length >= 40 ? 40 : 0;
  }
  const strong = bullets.filter((b) => analyzeBullet(b).ok).length;
  const quantified = bullets.filter((b) => hasMetric(b)).length;
  const summaryBonus = resume.basics.summary && resume.basics.summary.trim().length >= 40 ? 1 : 0.5;
  const parts = [ratio(strong, bullets.length), Math.min(1, ratio(quantified, bullets.length) / 0.5), summaryBonus];
  return pct((parts.reduce((a, b) => a + b, 0) / parts.length) * 100);
}

export function scoreKeywords(resume: Resume, jobText?: string): number {
  if (jobText && jobText.trim()) {
    const match = matchRequirements(buildResumeIndex(resume), analyzeJob(jobText));
    return pct(match.coverage * 100);
  }
  // No job: reward keyword density (recognized skills across the resume).
  const count = buildResumeIndex(resume).skills.size;
  return pct(Math.min(1, count / 12) * 100);
}

export function scoreExperience(resume: Resume): number {
  const exp = resume.sections.experience;
  if (exp.length === 0) return 0;
  const withBullets = exp.filter((e) => e.highlights.some((h) => h.trim())).length;
  const bullets = exp.flatMap((e) => e.highlights).filter((h) => h.trim());
  const quantified = bullets.filter((b) => hasMetric(b)).length;
  const parts = [Math.min(1, exp.length / 2), ratio(withBullets, exp.length), ratio(quantified, bullets.length)];
  return pct((parts.reduce((a, b) => a + b, 0) / parts.length) * 100);
}

export function scoreEducation(resume: Resume): number {
  const ed = resume.sections.education;
  if (ed.length === 0) return 0;
  const complete = ed.filter((e) => e.institution.trim() && e.degree.trim()).length;
  return pct(ratio(complete, ed.length) * 100);
}

export function scoreSkills(resume: Resume): number {
  const items = resume.sections.skills.flatMap((g) => g.items).filter(Boolean);
  return pct(Math.min(1, items.length / 10) * 100);
}

/* --------------------------- extra health metrics --------------------------- */

export function scoreActionVerbs(resume: Resume): number {
  const bullets = collectBullets(resume);
  if (bullets.length === 0) return 0;
  const strong = bullets.filter((b) => !analyzeBullet(b).issues.some((i) => i.code === 'weakOpener')).length;
  return pct(ratio(strong, bullets.length) * 100);
}

export function scoreActiveVoice(resume: Resume): number {
  const bullets = collectBullets(resume);
  if (bullets.length === 0) return 100;
  const active = bullets.filter((b) => !analyzeBullet(b).issues.some((i) => i.code === 'passive')).length;
  return pct(ratio(active, bullets.length) * 100);
}

export function scoreQuantified(resume: Resume): number {
  const bullets = collectBullets(resume);
  if (bullets.length === 0) return 0;
  return pct(Math.min(1, ratio(bullets.filter((b) => hasMetric(b)).length, bullets.length) / 0.5) * 100);
}

export function scoreCompleteness(resume: Resume): number {
  const { basics, sections } = resume;
  const checks = [
    basics.fullName.trim().length > 0,
    Boolean(basics.email),
    Boolean(basics.phone),
    Boolean(basics.summary && basics.summary.trim()),
    sections.experience.length > 0,
    sections.education.length > 0,
    sections.skills.some((g) => g.items.length > 0),
  ];
  return pct(ratio(checks.filter(Boolean).length, checks.length) * 100);
}

export function scoreSectionsCompleted(resume: Resume): number {
  const s = resume.sections;
  const populated = [
    Boolean(resume.basics.summary?.trim()),
    s.experience.length > 0,
    s.education.length > 0,
    s.skills.some((g) => g.items.length > 0),
    s.projects.length > 0,
    s.certifications.length > 0,
    s.languages.length > 0,
    s.references.length > 0,
  ];
  return pct(ratio(populated.filter(Boolean).length, populated.length) * 100);
}

/** Number of recognizable skills across the resume. */
export function keywordDensity(resume: Resume): number {
  return buildResumeIndex(resume).skills.size;
}

export function resumeWordCount(resume: Resume): number {
  return removeStopwords(tokenize(extractResumeText(resume))).length;
}

/** Estimated recruiter scan time in seconds (~200 wpm). */
export function readingTimeSeconds(resume: Resume): number {
  const words = tokenize(extractResumeText(resume)).length;
  return Math.round((words / 200) * 60);
}

export function scoreReadingLength(resume: Resume): number {
  const words = tokenize(extractResumeText(resume)).length;
  if (words >= 350 && words <= 800) return 100;
  if (words >= 200 && words <= 1000) return 70;
  if (words === 0) return 0;
  return 45;
}

/** Lightweight typo/style check (repeated words, double spaces, spacing before punctuation). */
export function scoreTypos(resume: Resume): number {
  const text = extractResumeText(resume);
  if (!text.trim()) return 100;
  let penalties = 0;
  penalties += (text.match(/ {2,}/g) ?? []).length;
  penalties += (text.match(/\s+[,.;:!?]/g) ?? []).length;
  penalties += (text.match(/\b(\w+)\s+\1\b/gi) ?? []).length;
  penalties += (text.match(/(^|\s)i(\s|$)/g) ?? []).length; // standalone lowercase "i"
  return pct(100 - penalties * 6);
}

/* ------------------------------ composites ------------------------------ */

export function healthScore(resume: Resume, jobText?: string): number {
  const parts = [
    scoreATS(resume),
    scoreFormatting(resume),
    scoreContent(resume),
    scoreKeywords(resume, jobText),
    scoreExperience(resume),
    scoreEducation(resume),
    scoreSkills(resume),
  ];
  return pct(parts.reduce((a, b) => a + b, 0) / parts.length);
}

export type HealthMetricId =
  | 'completeness'
  | 'ats'
  | 'keywords'
  | 'actionVerbs'
  | 'passiveVoice'
  | 'quantified'
  | 'formatting'
  | 'sections'
  | 'typos'
  | 'readingTime';

export interface HealthMetric {
  id: HealthMetricId;
  score: number;
  status: MetricStatus;
}

export interface ResumeHealth {
  overall: number;
  readingTimeSeconds: number;
  keywordDensity: number;
  metrics: HealthMetric[];
}

/** Rich health report for the Resume Health dashboard. */
export function resumeHealth(resume: Resume, jobText?: string): ResumeHealth {
  const raw: Record<HealthMetricId, number> = {
    completeness: scoreCompleteness(resume),
    ats: scoreATS(resume),
    keywords: scoreKeywords(resume, jobText),
    actionVerbs: scoreActionVerbs(resume),
    passiveVoice: scoreActiveVoice(resume),
    quantified: scoreQuantified(resume),
    formatting: scoreFormatting(resume),
    sections: scoreSectionsCompleted(resume),
    typos: scoreTypos(resume),
    readingTime: scoreReadingLength(resume),
  };

  const metrics = (Object.keys(raw) as HealthMetricId[]).map((id) => ({
    id,
    score: raw[id],
    status: metricStatus(raw[id]),
  }));

  const overall = pct(metrics.reduce((a, m) => a + m.score, 0) / metrics.length);
  return {
    overall,
    readingTimeSeconds: readingTimeSeconds(resume),
    keywordDensity: keywordDensity(resume),
    metrics,
  };
}
