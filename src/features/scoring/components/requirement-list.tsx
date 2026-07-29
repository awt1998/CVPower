'use client';

import { Check, Minus, X, Plus } from 'lucide-react';
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

export interface RequirementListProps {
  match: MatchResult;
  /** When provided, missing/partial skill chips become buttons that add the term. */
  onAdd?: (label: string) => void;
}

/** Shows every job requirement as a status chip; addable skills become buttons. */
export function RequirementList({ match, onAdd }: RequirementListProps) {
  const t = useTranslations('analyze');
  const items = [...match.items].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        {t('coverageSummary', { matched: match.matchedCount, total: match.items.length })}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const addable = Boolean(onAdd) && item.requirement.kind === 'skill' && item.status !== 'matched';

          if (addable) {
            return (
              <li key={item.requirement.id}>
                <button
                  type="button"
                  onClick={() => onAdd?.(item.requirement.label)}
                  aria-label={t('addToResume', { term: item.requirement.label })}
                  title={t('addToResume', { term: item.requirement.label })}
                  className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Badge variant={variantFor(item.status)} className="gap-1 font-normal transition-colors hover:border-primary hover:text-foreground">
                    <Plus className="size-3" />
                    {item.requirement.label}
                  </Badge>
                </button>
              </li>
            );
          }

          return (
            <li key={item.requirement.id}>
              <Badge variant={variantFor(item.status)} className="gap-1 font-normal">
                {iconFor(item.status)}
                {item.requirement.label}
              </Badge>
            </li>
          );
        })}
      </ul>
      {onAdd && <p className="mt-3 text-xs text-muted-foreground">{t('addHint')}</p>}
    </div>
  );
}
