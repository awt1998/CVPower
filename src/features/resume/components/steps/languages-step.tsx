'use client';

import { useTranslations } from 'next-intl';

import { LANGUAGE_PROFICIENCIES } from '../../constants';
import { createLanguage } from '../../factory';
import { ArraySection } from '../parts/array-section';
import { TextField } from '../fields/text-field';
import { SelectField } from '../fields/select-field';
import type { Resume } from '../../types';

export function LanguagesStep({ resume }: { resume: Resume }) {
  const t = useTranslations('builder.languages');
  const tc = useTranslations('builder.common');

  const options = LANGUAGE_PROFICIENCIES.map((value) => ({
    value,
    label: t(`proficiency.${value}`),
  }));

  return (
    <ArraySection
      resume={resume}
      sectionKey="languages"
      createItem={createLanguage}
      itemTitle={(item) => item.name || t('fallback')}
      labels={{
        add: t('add'),
        empty: t('empty'),
        description: t('description'),
        moveUp: tc('moveUp'),
        moveDown: tc('moveDown'),
        remove: tc('remove'),
      }}
      renderItem={(item, { update }) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label={t('name')} value={item.name} onChange={(v) => update({ name: v })} />
          <SelectField
            label={t('level')}
            value={item.proficiency}
            options={options}
            onChange={(v) => update({ proficiency: v as (typeof LANGUAGE_PROFICIENCIES)[number] })}
          />
        </div>
      )}
    />
  );
}
