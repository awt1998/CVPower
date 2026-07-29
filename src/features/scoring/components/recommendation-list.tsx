'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import type { ScoreReason, Severity } from '../types';

function dotColor(severity: Severity): string {
  if (severity === 'high') return 'bg-destructive';
  if (severity === 'medium') return 'bg-warning';
  if (severity === 'low') return 'bg-muted-foreground';
  return 'bg-success';
}

/** Ranked, actionable recommendations derived from the score reasons. */
export function RecommendationList({ reasons }: { reasons: ScoreReason[] }) {
  const t = useTranslations('analyze.reasons');
  const tk = useTranslations('analyze');

  if (reasons.length === 0) {
    return <p className="text-sm text-muted-foreground">{tk('noReasons')}</p>;
  }

  return (
    <ul className="grid gap-2.5">
      {reasons.map((reason) => (
        <li key={reason.id} className="flex items-start gap-2.5 text-sm">
          <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', dotColor(reason.severity))} />
          <span className="flex-1">{t(reason.code, reason.params)}</span>
          <span className="shrink-0 text-xs font-medium text-muted-foreground">+{reason.impact}</span>
        </li>
      ))}
    </ul>
  );
}
