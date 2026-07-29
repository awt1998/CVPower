'use client';

import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createEducation } from '../../factory';
import { ArraySection } from '../parts/array-section';
import { TextField } from '../fields/text-field';
import { HighlightsEditor } from '../fields/highlights-editor';
import type { Resume } from '../../types';

export function EducationStep({ resume }: { resume: Resume }) {
  const t = useTranslations('builder.education');
  const tc = useTranslations('builder.common');

  return (
    <ArraySection
      resume={resume}
      sectionKey="education"
      createItem={createEducation}
      itemTitle={(item) => item.degree || item.institution || t('fallback')}
      labels={{
        add: t('add'),
        empty: t('empty'),
        description: t('description'),
        moveUp: tc('moveUp'),
        moveDown: tc('moveDown'),
        remove: tc('remove'),
      }}
      renderItem={(item, { update }) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label={t('institution')} value={item.institution} onChange={(v) => update({ institution: v })} />
            <TextField label={t('degree')} value={item.degree} onChange={(v) => update({ degree: v })} />
            <TextField label={t('fieldOfStudy')} value={item.field ?? ''} onChange={(v) => update({ field: v })} />
            <TextField label={t('grade')} value={item.grade ?? ''} onChange={(v) => update({ grade: v })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch id={`${item.id}-current`} checked={item.current} onCheckedChange={(checked) => update({ current: checked })} />
            <Label htmlFor={`${item.id}-current`}>{t('current')}</Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label={t('startDate')} type="month" value={item.startDate ?? ''} onChange={(v) => update({ startDate: v })} />
            {!item.current && (
              <TextField label={t('endDate')} type="month" value={item.endDate ?? ''} onChange={(v) => update({ endDate: v })} />
            )}
          </div>
          <HighlightsEditor
            label={t('highlights')}
            values={item.highlights}
            addLabel={t('addHighlight')}
            onChange={(highlights) => update({ highlights })}
          />
        </>
      )}
    />
  );
}
