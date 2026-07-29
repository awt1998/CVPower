import type { Resume } from '@/features/resume/types';
import {
  analyzeJob,
  buildResumeIndex,
  matchRequirements,
  type JobAnalysis,
  type MatchResult,
} from '@/features/matching';
import { scoreResume } from './score';
import type { ScoreResult } from './types';

export interface FullAnalysis {
  score: ScoreResult;
  job: JobAnalysis | null;
  match: MatchResult | null;
}

/**
 * The engine entry point: score a resume, optionally against a job description.
 * Pure and deterministic — matching + scoring composed in one call.
 */
export function analyzeResume(resume: Resume, jobText?: string): FullAnalysis {
  const trimmed = jobText?.trim();
  if (!trimmed) {
    return { score: scoreResume(resume, null), job: null, match: null };
  }

  const job = analyzeJob(trimmed);
  const match = matchRequirements(buildResumeIndex(resume), job);
  return { score: scoreResume(resume, match), job, match };
}
