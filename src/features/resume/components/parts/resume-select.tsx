'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { SelectField } from '../fields/select-field';
import { useResumeStore } from '../../store';

/**
 * Compact resume chooser: sets the active resume (the one every page — builder,
 * preview, analyze — operates on). Shown when at least one resume exists.
 */
export function ResumeSelect() {
  const t = useTranslations('builder.switcher');
  const order = useResumeStore((s) => s.order);
  const resumes = useResumeStore((s) => s.resumes);
  const activeId = useResumeStore((s) => s.activeResumeId);

  const options = React.useMemo(
    () =>
      order
        .map((id) => resumes[id])
        .filter((r): r is NonNullable<typeof r> => Boolean(r))
        .map((r) => ({ value: r.id, label: r.meta.title || t('untitled') })),
    [order, resumes, t],
  );

  if (options.length === 0) return null;

  return (
    <SelectField
      label={t('label')}
      value={activeId ?? ''}
      options={options}
      onChange={(id) => useResumeStore.getState().setActiveResume(id)}
    />
  );
}
