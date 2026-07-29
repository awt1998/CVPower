'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { analyzeBullet, type BulletSeverity } from '../bullet';

function dotColor(severity: BulletSeverity): string {
  if (severity === 'high') return 'bg-destructive';
  if (severity === 'medium') return 'bg-warning';
  return 'bg-muted-foreground';
}

/** Inline, non-blocking improvement hints for a single bullet. */
export function BulletHints({ text }: { text: string }) {
  const t = useTranslations('ai.bullet');
  const { issues } = analyzeBullet(text);
  if (issues.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
      {issues.map((issue) => (
        <li key={issue.code} className="flex items-center gap-1">
          <span className={cn('size-1.5 rounded-full', dotColor(issue.severity))} />
          {t(issue.code)}
        </li>
      ))}
    </ul>
  );
}
