'use client';

import * as React from 'react';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedRing } from '@/components/common/animated-ring';
import { AnimatedNumber } from '@/components/common/animated-number';
import { Link } from '@/i18n/navigation';
import { useMounted } from '@/hooks/use-mounted';
import { useResumeStore } from '@/features/resume/store';
import { useJobStore } from '@/features/matching/store';
import { ResumeSelect } from '@/features/resume/components/parts/resume-select';
import { resumeHealth, scoreCompleteness } from '@/features/scoring';
import type { Resume } from '@/features/resume/types';
import { useAnalyticsStore } from '../store';
import { LineChart } from './line-chart';

const SECTION_IDS = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'references',
] as const;

type SectionId = (typeof SECTION_IDS)[number];

function sectionDone(resume: Resume, id: SectionId): boolean {
  if (id === 'summary') return Boolean(resume.basics.summary?.trim());
  return resume.sections[id].length > 0;
}

export function ProgressShell() {
  const mounted = useMounted();
  const t = useTranslations('progress');
  const tSteps = useTranslations('builder.steps');
  const order = useResumeStore((s) => s.order);
  const activeId = useResumeStore((s) => s.activeResumeId);
  const resume = useResumeStore((s) =>
    s.activeResumeId ? (s.resumes[s.activeResumeId] ?? null) : null,
  );
  const jobText = useJobStore((s) => s.jobText);
  const record = useAnalyticsStore((s) => s.record);
  const history = useAnalyticsStore((s) => (resume ? (s.history[resume.id] ?? []) : []));

  React.useEffect(() => {
    if (!mounted) return;
    const store = useResumeStore.getState();
    if (!store.activeResumeId && store.order.length > 0) {
      store.setActiveResume(store.order[0] ?? null);
    }
  }, [mounted, order.length, activeId]);

  const health = React.useMemo(
    () => (resume ? resumeHealth(resume, jobText) : null),
    [resume, jobText],
  );

  React.useEffect(() => {
    if (mounted && resume && health) record(resume.id, health.overall);
  }, [mounted, resume, health, record]);

  if (!mounted) return <Skeleton className="h-[60vh] w-full" />;

  if (!resume || !health) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">{t('empty')}</p>
        <Button asChild className="mt-4">
          <Link href="/builder">{t('goToBuilder')}</Link>
        </Button>
      </div>
    );
  }

  const completion = scoreCompleteness(resume);
  const sections = SECTION_IDS.map((id) => ({ id, done: sectionDone(resume, id) }));
  const completed = sections.filter((s) => s.done);
  const missing = sections.filter((s) => !s.done);

  return (
    <div className="grid gap-8">
      <div className="max-w-sm">
        <ResumeSelect />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="flex flex-col items-center justify-center gap-2 p-6">
          <AnimatedRing
            value={health.overall}
            label={t('strength')}
            ariaLabel={t('strengthAria', { score: health.overall })}
          />
        </GlassCard>
        <GlassCard className="flex flex-col justify-center gap-1 p-6">
          <p className="text-sm text-muted-foreground">{t('completion')}</p>
          <p className="text-3xl font-bold">
            <AnimatedNumber value={completion} suffix="%" />
          </p>
        </GlassCard>
        <GlassCard className="flex flex-col justify-center gap-1 p-6">
          <p className="text-sm text-muted-foreground">{t('versions')}</p>
          <p className="text-3xl font-bold">
            <AnimatedNumber value={order.length} />
          </p>
        </GlassCard>
      </div>

      <GlassCard className="grid gap-4 p-6">
        <h2 className="text-base font-semibold">{t('historyTitle')}</h2>
        {history.length > 1 ? (
          <LineChart points={history.map((h) => ({ value: h.value }))} ariaLabel={t('historyAria')} />
        ) : (
          <p className="text-sm text-muted-foreground">{t('historyEmpty')}</p>
        )}
      </GlassCard>

      <GlassCard className="grid gap-4 p-6">
        <h2 className="text-base font-semibold">{t('sectionsTitle')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-success">
              {t('completed')} ({completed.length})
            </p>
            <ul className="grid gap-1 text-sm">
              {completed.map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <Check className="size-4 text-success" />
                  {tSteps(s.id)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {t('missing')} ({missing.length})
            </p>
            <ul className="grid gap-1 text-sm text-muted-foreground">
              {missing.map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <X className="size-4" />
                  {tSteps(s.id)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
