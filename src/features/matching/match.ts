import { stem, containsTerm } from '@/lib/text';
import type {
  JobAnalysis,
  JobRequirement,
  MatchResult,
  RequirementMatch,
  RequirementStatus,
  ResumeIndex,
} from './types';

function statusFor(requirement: JobRequirement, index: ResumeIndex): RequirementStatus {
  if (requirement.kind === 'skill') {
    if (index.skills.has(requirement.term)) return 'matched';
    // The exact skill term appears in text but wasn't recognized as a skill entry.
    return containsTerm(index.text, requirement.term) ? 'partial' : 'missing';
  }

  // keyword
  if (index.tokens.has(requirement.term) || containsTerm(index.text, requirement.term)) {
    return 'matched';
  }
  return index.stems.has(stem(requirement.term)) ? 'partial' : 'missing';
}

/** Match every requirement against the resume index and aggregate coverage. */
export function matchRequirements(index: ResumeIndex, analysis: JobAnalysis): MatchResult {
  const items: RequirementMatch[] = analysis.requirements.map((requirement) => ({
    requirement,
    status: statusFor(requirement, index),
  }));

  let matchedCount = 0;
  let partialCount = 0;
  let missingCount = 0;
  let totalWeight = 0;
  let achievedWeight = 0;

  for (const item of items) {
    totalWeight += item.requirement.weight;
    if (item.status === 'matched') {
      matchedCount += 1;
      achievedWeight += item.requirement.weight;
    } else if (item.status === 'partial') {
      partialCount += 1;
      achievedWeight += item.requirement.weight * 0.5;
    } else {
      missingCount += 1;
    }
  }

  return {
    items,
    matchedCount,
    partialCount,
    missingCount,
    totalWeight,
    achievedWeight,
    coverage: totalWeight > 0 ? achievedWeight / totalWeight : 0,
  };
}
