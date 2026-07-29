'use client';

import { useTranslations } from 'next-intl';
import { Progress } from '@/components/ui/progress';
import type { SubScore } from '../types';

/** Renders the applicable weighted sub-scores as labeled progress bars. */
export function SubScoreList({ subScores }: { subScores: SubScore[] }) {
  const t = useTranslations('analyze.dimensions');
  const applicable = subScores.filter((sub) => sub.applicable);

  return (
    <div className="grid gap-3">
      {applicable.map((sub) => (
        <div key={sub.dimension}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>{t(sub.dimension)}</span>
            <span className="text-muted-foreground">{Math.round(sub.score * 100)}%</span>
          </div>
          <Progress value={sub.score * 100} />
        </div>
      ))}
    </div>
  );
}
