import type { Resume } from '@/features/resume/types';
import type { MatchResult, RequirementKind, JobRequirement } from '@/features/matching';
import { hasMetric } from '@/lib/text';
import { analyzeAts, collectBullets } from './ats';
import type { ScoreDimension, ScoreReason, ScoreResult, Severity, SubScore } from './types';

const WEIGHTS: Record<ScoreDimension, number> = {
  keywordCoverage: 0.3,
  skillsMatch: 0.25,
  atsFriendliness: 0.15,
  quantification: 0.12,
  readability: 0.08,
  completeness: 0.1,
};

function severityImpact(severity: Severity): number {
  if (severity === 'high') return 12;
  if (severity === 'medium') return 7;
  return 3;
}

function requirementRank(req: JobRequirement): number {
  return (req.required ? 2 : 0) + (req.kind === 'skill' ? 1 : 0);
}

/** Weighted coverage over requirements of one kind, or null if there are none. */
function coverageByKind(match: MatchResult, kind: RequirementKind): number | null {
  const items = match.items.filter((item) => item.requirement.kind === kind);
  if (items.length === 0) return null;
  let total = 0;
  let achieved = 0;
  for (const item of items) {
    total += item.requirement.weight;
    if (item.status === 'matched') achieved += item.requirement.weight;
    else if (item.status === 'partial') achieved += item.requirement.weight * 0.5;
  }
  return total > 0 ? achieved / total : null;
}

function quantification(bullets: string[]): { score: number; applicable: boolean } {
  if (bullets.length === 0) return { score: 0, applicable: false };
  const quantified = bullets.filter((b) => hasMetric(b)).length;
  return { score: Math.min(1, quantified / bullets.length / 0.5), applicable: true };
}

function readability(
  resume: Resume,
  bullets: string[],
): { score: number; applicable: boolean } {
  const parts: number[] = [];
  if (bullets.length > 0) {
    const good = bullets.filter((b) => {
      const words = b.split(/\s+/).filter(Boolean).length;
      return words >= 4 && words <= 40;
    }).length;
    parts.push(good / bullets.length);
  }
  const summary = resume.basics.summary?.trim();
  if (summary) {
    const words = summary.split(/\s+/).filter(Boolean).length;
    parts.push(words >= 20 && words <= 120 ? 1 : 0.5);
  }
  if (parts.length === 0) return { score: 0, applicable: false };
  return { score: parts.reduce((a, b) => a + b, 0) / parts.length, applicable: true };
}

function completeness(resume: Resume): number {
  const { basics, sections } = resume;
  const checks = [
    basics.fullName.trim().length > 0,
    Boolean(basics.email),
    Boolean(basics.phone),
    Boolean(basics.summary && basics.summary.trim()),
    sections.experience.length > 0,
    sections.education.length > 0,
    sections.skills.some((group) => group.items.length > 0),
  ];
  return checks.filter(Boolean).length / checks.length;
}

/**
 * Produce an explainable 0–100 score. `match` is null when no job description is
 * provided; keyword/skills dimensions then become inapplicable and the remaining
 * dimensions are re-weighted, giving a baseline resume-quality score.
 */
export function scoreResume(resume: Resume, match: MatchResult | null): ScoreResult {
  const ats = analyzeAts(resume);
  const bullets = collectBullets(resume);

  const keywordCoverage = match ? coverageByKind(match, 'keyword') : null;
  const skillsMatch = match ? coverageByKind(match, 'skill') : null;
  const q = quantification(bullets);
  const r = readability(resume, bullets);
  const completenessScore = completeness(resume);

  const subScores: SubScore[] = [
    { dimension: 'keywordCoverage', score: keywordCoverage ?? 0, weight: WEIGHTS.keywordCoverage, applicable: keywordCoverage !== null },
    { dimension: 'skillsMatch', score: skillsMatch ?? 0, weight: WEIGHTS.skillsMatch, applicable: skillsMatch !== null },
    { dimension: 'atsFriendliness', score: ats.score, weight: WEIGHTS.atsFriendliness, applicable: true },
    { dimension: 'quantification', score: q.score, weight: WEIGHTS.quantification, applicable: q.applicable },
    { dimension: 'readability', score: r.score, weight: WEIGHTS.readability, applicable: r.applicable },
    { dimension: 'completeness', score: completenessScore, weight: WEIGHTS.completeness, applicable: true },
  ];

  let totalWeight = 0;
  let weighted = 0;
  for (const sub of subScores) {
    if (!sub.applicable) continue;
    totalWeight += sub.weight;
    weighted += sub.weight * sub.score;
  }
  const overall = totalWeight > 0 ? Math.round((weighted / totalWeight) * 100) : 0;

  const reasons: ScoreReason[] = [];

  for (const check of ats.checks) {
    if (!check.ok) {
      reasons.push({
        id: `ats:${check.id}`,
        dimension: 'atsFriendliness',
        severity: check.severity,
        code: check.code,
        impact: severityImpact(check.severity),
      });
    }
  }

  if (match) {
    const missing = match.items
      .filter((item) => item.status !== 'matched')
      .sort((a, b) => requirementRank(b.requirement) - requirementRank(a.requirement))
      .slice(0, 8);
    for (const item of missing) {
      const req = item.requirement;
      reasons.push({
        id: `req:${req.id}`,
        dimension: req.kind === 'skill' ? 'skillsMatch' : 'keywordCoverage',
        severity: req.required ? 'high' : 'medium',
        code: item.status === 'partial' ? 'strengthenTerm' : 'addTerm',
        params: { term: req.label },
        impact: req.required ? 6 : 3,
      });
    }
  }

  if (q.applicable && q.score < 0.5) {
    reasons.push({ id: 'quant', dimension: 'quantification', severity: 'medium', code: 'quantify', impact: 8 });
  }
  if (bullets.length === 0 && resume.sections.experience.length > 0) {
    reasons.push({ id: 'nobullets', dimension: 'readability', severity: 'medium', code: 'addBullets', impact: 8 });
  } else if (r.applicable && r.score < 0.6) {
    reasons.push({ id: 'read', dimension: 'readability', severity: 'low', code: 'improveBullets', impact: 5 });
  }

  reasons.sort((a, b) => b.impact - a.impact);

  return { overall, subScores, reasons, hasJob: match !== null };
}
