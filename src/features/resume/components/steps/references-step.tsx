'use client';

import { useTranslations } from 'next-intl';

import { referenceSchema } from '../../schema';
import { createReference } from '../../factory';
import { ArraySection } from '../parts/array-section';
import { TextField } from '../fields/text-field';
import { TextareaField } from '../fields/textarea-field';
import { fieldErrors } from '../validation';
import type { Resume } from '../../types';

export function ReferencesStep({ resume }: { resume: Resume }) {
  const t = useTranslations('builder.references');
  const tc = useTranslations('builder.common');

  return (
    <ArraySection
      resume={resume}
      sectionKey="references"
      createItem={createReference}
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
        const errors = fieldErrors(referenceSchema, item);
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label={t('name')} value={item.name} onChange={(v) => update({ name: v })} />
              <TextField label={t('title')} value={item.title ?? ''} onChange={(v) => update({ title: v })} />
              <TextField label={t('company')} value={item.company ?? ''} onChange={(v) => update({ company: v })} />
              <TextField label={t('relationship')} value={item.relationship ?? ''} onChange={(v) => update({ relationship: v })} />
              <TextField label={t('email')} type="email" value={item.email ?? ''} onChange={(v) => update({ email: v })} error={errors['email']} inputMode="email" />
              <TextField label={t('phone')} type="tel" value={item.phone ?? ''} onChange={(v) => update({ phone: v })} inputMode="tel" />
            </div>
            <TextareaField label={t('note')} value={item.summary ?? ''} rows={2} onChange={(v) => update({ summary: v })} />
          </>
        );
      }}
    />
  );
}
