'use client';

import { useTranslations } from 'next-intl';

import { projectSchema } from '../../schema';
import { createProject } from '../../factory';
import { ArraySection } from '../parts/array-section';
import { TextField } from '../fields/text-field';
import { TextareaField } from '../fields/textarea-field';
import { TagInput } from '../fields/tag-input';
import { HighlightsEditor } from '../fields/highlights-editor';
import { fieldErrors } from '../validation';
import type { Resume } from '../../types';

export function ProjectsStep({ resume }: { resume: Resume }) {
  const t = useTranslations('builder.projects');
  const tc = useTranslations('builder.common');

  return (
    <ArraySection
      resume={resume}
      sectionKey="projects"
      createItem={createProject}
      itemTitle={(item) => item.name || t('fallback')}
      labels={{
        add: t('add'),
        empty: t('empty'),
        description: t('description'),
        moveUp: tc('moveUp'),
        moveDown: tc('moveDown'),
        remove: tc('remove'),
      }}
      renderItem={(item, { update }) => {
        const errors = fieldErrors(projectSchema, item);
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label={t('name')} value={item.name} onChange={(v) => update({ name: v })} />
              <TextField label={t('url')} type="url" value={item.url ?? ''} onChange={(v) => update({ url: v })} error={errors['url']} placeholder="https://" />
              <TextField label={t('startDate')} type="month" value={item.startDate ?? ''} onChange={(v) => update({ startDate: v })} />
              <TextField label={t('endDate')} type="month" value={item.endDate ?? ''} onChange={(v) => update({ endDate: v })} />
            </div>
            <TextareaField label={t('descriptionField')} value={item.description ?? ''} rows={3} onChange={(v) => update({ description: v })} />
            <HighlightsEditor
              label={t('highlights')}
              values={item.highlights}
              addLabel={t('addHighlight')}
              onChange={(highlights) => update({ highlights })}
              showHints
            />
            <TagInput
              label={t('technologies')}
              values={item.technologies ?? []}
              onChange={(technologies) => update({ technologies })}
            />
          </>
        );
      }}
    />
  );
}
