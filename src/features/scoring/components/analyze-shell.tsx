'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/navigation';
import { useMounted } from '@/hooks/use-mounted';
import { useResumeStore } from '@/features/resume/store';
import { createSkillGroup } from '@/features/resume/factory';
import { ResumeSelect } from '@/features/resume/components/parts/resume-select';
import { analyzeResume } from '@/features/scoring';
import { useJobStore } from '@/features/matching/store';
import { AnalyzeIntro } from './analyze-intro';
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

  const addTerm = React.useCallback(
    (term: string) => {
      if (!resume) return;
      const groups = resume.sections.skills;
      const exists = groups.some((g) =>
        g.items.some((i) => i.toLowerCase() === term.toLowerCase()),
      );
      if (exists) return;

      const store = useResumeStore.getState();
      const first = groups[0];
      if (first) {
        store.updateArrayItem(resume.id, 'skills', first.id, { items: [...first.items, term] });
      } else {
        store.addArrayItem(
          resume.id,
          'skills',
          createSkillGroup({ category: t('addedGroupName'), items: [term] }),
        );
      }
    },
    [resume, t],
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

  const missingSkills = match
    ? match.items
        .filter((i) => i.requirement.kind === 'skill' && i.status !== 'matched')
        .map((i) => i.requirement.label)
    : [];

  const tailor = () => {
    if (!resume) return;
    const store = useResumeStore.getState();
    const current = store.getActiveResume() ?? resume;
    const existing = new Set(
      current.sections.skills.flatMap((g) => g.items.map((i) => i.toLowerCase())),
    );
    const toAdd = missingSkills.filter((s) => !existing.has(s.toLowerCase()));
    if (toAdd.length === 0) return;

    const first = current.sections.skills[0];
    if (first) {
      store.updateArrayItem(current.id, 'skills', first.id, { items: [...first.items, ...toAdd] });
    } else {
      store.addArrayItem(
        current.id,
        'skills',
        createSkillGroup({ category: t('addedGroupName'), items: toAdd }),
      );
    }
    toast.success(t('tailored', { count: toAdd.length }));
  };

  return (
    <div className="grid gap-6">
      <AnalyzeIntro />

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
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">{t('requirements')}</CardTitle>
              {missingSkills.length > 0 && (
                <Button size="sm" variant="secondary" onClick={tailor}>
                  {t('tailor')}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <RequirementList match={match} onAdd={addTerm} />
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
