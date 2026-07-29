'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { useResumeStore } from '@/features/resume/store';
import { DEFAULT_TEMPLATE_ID, TEMPLATE_IDS } from '../registry';
import type { Resume } from '@/features/resume/types';

/** Lets the user pick which template renders their resume. */
export function TemplatePicker({ resume }: { resume: Resume }) {
  const t = useTranslations('templates');
  const active = resume.meta.templateId ?? DEFAULT_TEMPLATE_ID;

  return (
    <div role="group" aria-label={t('choose')} className="flex flex-wrap gap-2">
      {TEMPLATE_IDS.map((id) => {
        const selected = id === active;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={selected}
            onClick={() => useResumeStore.getState().updateMeta(resume.id, { templateId: id })}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {t(`names.${id}`)}
          </button>
        );
      })}
    </div>
  );
}
