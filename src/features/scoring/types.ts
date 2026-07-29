export type Severity = 'high' | 'medium' | 'low' | 'good';

export type ScoreDimension =
  | 'keywordCoverage'
  | 'skillsMatch'
  | 'atsFriendliness'
  | 'quantification'
  | 'readability'
  | 'completeness';

export interface SubScore {
  dimension: ScoreDimension;
  /** Normalized score in [0, 1]. */
  score: number;
  /** Relative weight in the overall composite. */
  weight: number;
  /** False when the dimension can't be evaluated (e.g. no job pasted). */
  applicable: boolean;
}

/**
 * An explainable reason behind the score. `code` + `params` are resolved to a
 * localized message in the UI, so the engine stays pure and language-agnostic.
 */
export interface ScoreReason {
  id: string;
  dimension: ScoreDimension;
  severity: Severity;
  code: string;
  params?: Record<string, string | number>;
  /** Estimated points (0–100 scale) recoverable by addressing this. */
  impact: number;
}

export interface ScoreResult {
  /** Overall score, 0–100. */
  overall: number;
  subScores: SubScore[];
  reasons: ScoreReason[];
  hasJob: boolean;
}

export interface AtsCheck {
  id: string;
  ok: boolean;
  severity: Severity;
  code: string;
  params?: Record<string, string | number>;
}

export interface AtsResult {
  /** Normalized ATS-friendliness in [0, 1]. */
  score: number;
  checks: AtsCheck[];
}
