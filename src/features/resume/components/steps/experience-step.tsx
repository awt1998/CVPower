'use client';

import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AchievementDialog } from '@/features/ai';
import { createExperience } from '../../factory';
import { ArraySection } from '../parts/array-section';
import { TextField } from '../fields/text-field';
import { TextareaField } from '../fields/textarea-field';
import { TagInput } from '../fields/tag-input';
import { HighlightsEditor } from '../fields/highlights-editor';
import type { Resume } from '../../types';

export function ExperienceStep({ resume }: { resume: Resume }) {
  const t = useTranslations('builder.experience');
  const tc = useTranslations('builder.common');

  return (
    <ArraySection
      resume={resume}
      sectionKey="experience"
      createItem={createExperience}
      itemTitle={(item) => item.role || item.company || t('fallback')}
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
            <TextField label={t('role')} value={item.role} onChange={(v) => update({ role: v })} />
            <TextField label={t('company')} value={item.company} onChange={(v) => update({ company: v })} />
            <TextField label={t('location')} value={item.location ?? ''} onChange={(v) => update({ location: v })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id={`${item.id}-current`}
              checked={item.current}
              onCheckedChange={(checked) => update({ current: checked })}
            />
            <Label htmlFor={`${item.id}-current`}>{t('current')}</Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label={t('startDate')} type="month" value={item.startDate ?? ''} onChange={(v) => update({ startDate: v })} />
            {!item.current && (
              <TextField label={t('endDate')} type="month" value={item.endDate ?? ''} onChange={(v) => update({ endDate: v })} />
            )}
          </div>
          <TextareaField label={t('summaryField')} value={item.summary ?? ''} rows={3} onChange={(v) => update({ summary: v })} />
          <HighlightsEditor
            label={t('highlights')}
            values={item.highlights}
            addLabel={t('addHighlight')}
            placeholder={t('highlightPlaceholder')}
            onChange={(highlights) => update({ highlights })}
            showHints
          />
          <div>
            <AchievementDialog
              sourceText={item.summary || item.role || item.highlights.find((h) => h.trim()) || ''}
              onInsert={(text) => update({ highlights: [...item.highlights, text] })}
            />
          </div>
          <TagInput
            label={t('technologies')}
            values={item.technologies ?? []}
            onChange={(technologies) => update({ technologies })}
            placeholder={t('technologiesPlaceholder')}
          />
        </>
      )}
    />
  );
}
