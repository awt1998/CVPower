'use client';

import { useTranslations } from 'next-intl';

import { SKILL_LEVELS } from '../../constants';
import { createSkillGroup } from '../../factory';
import { ArraySection } from '../parts/array-section';
import { TextField } from '../fields/text-field';
import { SelectField } from '../fields/select-field';
import { TagInput } from '../fields/tag-input';
import type { Resume } from '../../types';

export function SkillsStep({ resume }: { resume: Resume }) {
  const t = useTranslations('builder.skills');
  const tc = useTranslations('builder.common');

  const levelOptions = [
    { value: '', label: t('noLevel') },
    ...SKILL_LEVELS.map((level) => ({ value: level, label: t(`levels.${level}`) })),
  ];

  return (
    <ArraySection
      resume={resume}
      sectionKey="skills"
      createItem={createSkillGroup}
      itemTitle={(item) => item.category || t('fallback')}
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
            <TextField label={t('category')} value={item.category} onChange={(v) => update({ category: v })} placeholder={t('categoryPlaceholder')} />
            <SelectField
              label={t('level')}
              value={item.level ?? ''}
              options={levelOptions}
              onChange={(v) => update({ level: v === '' ? undefined : (v as (typeof SKILL_LEVELS)[number]) })}
            />
          </div>
          <TagInput
            label={t('items')}
            values={item.items}
            onChange={(items) => update({ items })}
            placeholder={t('itemsPlaceholder')}
            description={t('itemsHint')}
          />
        </>
      )}
    />
  );
}
