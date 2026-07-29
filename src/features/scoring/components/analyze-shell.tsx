'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/navigation';
import { useMounted } from '@/hooks/use-mounted';
import { useResumeStore } from '@/features/resume/store';
import { ResumeSelect } from '@/features/resume/components/parts/resume-select';
import { analyzeResume } from '@/features/scoring';
import { useJobStore } from '@/features/matching/store';
import { ScoreRing } from './score-ring';
import { SubScoreList } from './subscore-list';
import { RequirementList } from './requirement-list';
import { RecommendationList } from './recommendation-list';

export function AnalyzeShell() {
  const mounted = useMounted();
  const t = useTranslations('analyze');
  const order = useResumeStore((s) => s.order);
  const activeId = useResumeStore((s) => s.activeResumeId);
  const resume = useResumeStore((s) =>
    s.activeResumeId ? (s.resumes[s.activeResumeId] ?? null) : null,
  );
  const jobText = useJobStore((s) => s.jobText);
  const setJobText = useJobStore((s) => s.setJobText);

  React.useEffect(() => {
    if (!mounted) return;
    const store = useResumeStore.getState();
    if (!store.activeResumeId && store.order.length > 0) {
      store.setActiveResume(store.order[0] ?? null);
    }
  }, [mounted, order.length, activeId]);

  const analysis = React.useMemo(
    () => (resume ? analyzeResume(resume, jobText) : null),
    [resume, jobText],
  );

  if (!mounted) {
    return <Skeleton className="h-[60vh] w-full" />;
  }

  if (!resume || !analysis) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">{t('empty')}</p>
        <Button asChild className="mt-4">
          <Link href="/builder">{t('goToBuilder')}</Link>
        </Button>
      </div>
    );
  }

  const { score, match } = analysis;

  return (
    <div className="grid gap-6">
      <div className="max-w-sm">
        <ResumeSelect />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr]">
      <div className="grid content-start gap-2">
        <Label htmlFor="job-description">{t('jobLabel')}</Label>
        <Textarea
          id="job-description"
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          rows={18}
          placeholder={t('jobPlaceholder')}
          className="resize-y"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t('jobHint')}</span>
          {jobText.trim() && (
            <button
              type="button"
              onClick={() => setJobText('')}
              className="underline-offset-2 hover:underline"
            >
              {t('clear')}
            </button>
          )}
        </div>
      </div>

      <div className="grid content-start gap-6">
        <div className="flex flex-wrap items-center gap-5">
          <ScoreRing
            score={score.overall}
            label={match ? t('matchScore') : t('baseScore')}
            ariaLabel={t('scoreAria', { score: score.overall })}
          />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {match ? t('withJob') : t('withoutJob')}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('breakdown')}</CardTitle>
          </CardHeader>
          <CardContent>
            <SubScoreList subScores={score.subScores} />
          </CardContent>
        </Card>

        {match && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('requirements')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RequirementList match={match} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('recommendations')}</CardTitle>
          </CardHeader>
          <CardContent>
            <RecommendationList reasons={score.reasons} />
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
