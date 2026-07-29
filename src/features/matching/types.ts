import type { SkillCategory } from './taxonomy';

export type RequirementKind = 'skill' | 'keyword';
export type RequirementStatus = 'matched' | 'partial' | 'missing';

/** A single thing the job asks for. */
export interface JobRequirement {
  id: string;
  /** Normalized match term (lowercased canonical skill, or keyword). */
  term: string;
  /** Human-readable label. */
  label: string;
  kind: RequirementKind;
  category?: SkillCategory;
  required: boolean;
  weight: number;
}

/** Structured view of a job description. */
export interface JobAnalysis {
  requirements: JobRequirement[];
  skills: string[];
  keywords: string[];
  wordCount: number;
}

export interface RequirementMatch {
  requirement: JobRequirement;
  status: RequirementStatus;
}

/** Outcome of matching a resume against a job analysis. */
export interface MatchResult {
  items: RequirementMatch[];
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  totalWeight: number;
  achievedWeight: number;
  /** Weighted coverage in [0, 1]. */
  coverage: number;
}

/** Pre-computed searchable view of a resume. */
export interface ResumeIndex {
  text: string;
  skills: Set<string>;
  tokens: Set<string>;
  stems: Set<string>;
}
