'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedNumber } from '@/components/common/animated-number';
import { Link } from '@/i18n/navigation';
import type { HealthMetric, HealthMetricId, MetricStatus } from '@/features/scoring';

const FIX_ROUTE: Record<HealthMetricId, string> = {
  completeness: '/builder',
  ats: '/analyze',
  keywords: '/analyze',
  actionVerbs: '/builder',
  passiveVoice: '/builder',
  quantified: '/builder',
  formatting: '/builder',
  sections: '/builder',
  typos: '/builder',
  readingTime: '/builder',
};

function tone(status: MetricStatus): string {
  if (status === 'green') return 'text-success';
  if (status === 'yellow') return 'text-warning';
  return 'text-destructive';
}

function bar(status: MetricStatus): string {
  if (status === 'green') return 'bg-success';
  if (status === 'yellow') return 'bg-warning';
  return 'bg-destructive';
}

export function MetricCard({ metric }: { metric: HealthMetric }) {
  const t = useTranslations('health.metrics');
  const th = useTranslations('health');

  return (
    <GlassCard className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium">{t(`${metric.id}.label`)}</h3>
        <span className={cn('text-lg font-bold', tone(metric.status))}>
          <AnimatedNumber value={metric.score} suffix="%" />
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn('h-full rounded-full transition-all duration-500', bar(metric.status))}
          style={{ width: `${metric.score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{t(`${metric.id}.explanation`)}</p>
      <div className="mt-auto pt-1">
        <Button asChild variant="outline" size="sm">
          <Link href={FIX_ROUTE[metric.id]}>{th('fix')}</Link>
        </Button>
      </div>
    </GlassCard>
  );
}
