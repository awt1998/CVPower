'use client';

import { Check, Minus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import type { MatchResult, RequirementStatus } from '@/features/matching';

const STATUS_ORDER: Record<RequirementStatus, number> = { missing: 0, partial: 1, matched: 2 };

function variantFor(status: RequirementStatus): BadgeProps['variant'] {
  if (status === 'matched') return 'success';
  if (status === 'partial') return 'warning';
  return 'outline';
}

function iconFor(status: RequirementStatus) {
  if (status === 'matched') return <Check className="size-3" />;
  if (status === 'partial') return <Minus className="size-3" />;
  return <X className="size-3" />;
}

/** Shows every job requirement as a status-colored chip, gaps first. */
export function RequirementList({ match }: { match: MatchResult }) {
  const t = useTranslations('analyze');
  const items = [...match.items].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        {t('coverageSummary', { matched: match.matchedCount, total: match.items.length })}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li key={item.requirement.id}>
            <Badge variant={variantFor(item.status)} className="gap-1 font-normal">
              {iconFor(item.status)}
              {item.requirement.label}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
