'use client';

import { useTranslations } from 'next-intl';
import { useResumeStore } from '../../store';
import { TextareaField } from '../fields/textarea-field';
import type { Resume } from '../../types';

export function SummaryStep({ resume }: { resume: Resume }) {
  const t = useTranslations('builder.summary');
  return (
    <TextareaField
      label={t('label')}
      value={resume.basics.summary ?? ''}
      rows={6}
      description={t('hint')}
      placeholder={t('placeholder')}
      onChange={(v) => useResumeStore.getState().updateBasics(resume.id, { summary: v })}
    />
  );
}
