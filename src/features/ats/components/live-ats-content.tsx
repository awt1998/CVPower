'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { AnimatedRing } from '@/components/common/animated-ring';
import { useResumeStore } from '@/features/resume/store';
import { useJobStore } from '@/features/matching/store';
import {
  healthScore,
  metricStatus,
  scoreContent,
  scoreEducation,
  scoreExperience,
  scoreFormatting,
  scoreKeywords,
  scoreSkills,
  type MetricStatus,
} from '@/features/scoring';

function barColor(status: MetricStatus): string {
  if (status === 'green') return 'bg-success';
  if (status === 'yellow') return 'bg-warning';
  return 'bg-destructive';
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor(metricStatus(value)))}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/** Real-time ATS metrics for the active resume; recomputes as the resume/JD change. */
export function LiveAtsContent() {
  const t = useTranslations('liveAts');
  const resume = useResumeStore((s) =>
    s.activeResumeId ? (s.resumes[s.activeResumeId] ?? null) : null,
  );
  const jobText = useJobStore((s) => s.jobText);

  const data = React.useMemo(() => {
    if (!resume) return null;
    return {
      overall: healthScore(resume, jobText),
      keyword: scoreKeywords(resume, jobText),
      formatting: scoreFormatting(resume),
      content: scoreContent(resume),
      skills: scoreSkills(resume),
      experience: scoreExperience(resume),
      education: scoreEducation(resume),
    };
  }, [resume, jobText]);

  if (!resume || !data) {
    return <p className="text-sm text-muted-foreground">{t('empty')}</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-center">
        <AnimatedRing
          value={data.overall}
          label={t('overall')}
          ariaLabel={t('overallAria', { score: data.overall })}
        />
      </div>
      <div className="grid gap-2.5">
        <Bar label={t('keyword')} value={data.keyword} />
        <Bar label={t('formatting')} value={data.formatting} />
        <Bar label={t('content')} value={data.content} />
        <Bar label={t('skills')} value={data.skills} />
        <Bar label={t('experience')} value={data.experience} />
        <Bar label={t('education')} value={data.education} />
      </div>
    </div>
  );
}
