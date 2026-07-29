'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedRing } from '@/components/common/animated-ring';
import { Link } from '@/i18n/navigation';
import { useMounted } from '@/hooks/use-mounted';
import { useResumeStore } from '@/features/resume/store';
import { useJobStore } from '@/features/matching/store';
import { ResumeSelect } from '@/features/resume/components/parts/resume-select';
import { resumeHealth } from '@/features/scoring';
import { MetricCard } from './metric-card';

export function HealthShell() {
  const mounted = useMounted();
  const t = useTranslations('health');
  const order = useResumeStore((s) => s.order);
  const activeId = useResumeStore((s) => s.activeResumeId);
  const resume = useResumeStore((s) =>
    s.activeResumeId ? (s.resumes[s.activeResumeId] ?? null) : null,
  );
  const jobText = useJobStore((s) => s.jobText);

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

  return (
    <div className="grid gap-8">
      <div className="max-w-sm">
        <ResumeSelect />
      </div>

      <GlassCard className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-start">
          <p className="text-lg font-semibold">{t('overallLabel')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('readingTime', { seconds: health.readingTimeSeconds })} ·{' '}
            {t('keywords', { count: health.keywordDensity })}
          </p>
        </div>
        <AnimatedRing
          value={health.overall}
          label={t('overall')}
          ariaLabel={t('overallAria', { score: health.overall })}
          size={140}
        />
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {health.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
