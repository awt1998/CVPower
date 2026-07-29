'use client';

import { useTranslations } from 'next-intl';

import { certificationSchema } from '../../schema';
import { createCertification } from '../../factory';
import { ArraySection } from '../parts/array-section';
import { TextField } from '../fields/text-field';
import { fieldErrors } from '../validation';
import type { Resume } from '../../types';

export function CertificationsStep({ resume }: { resume: Resume }) {
  const t = useTranslations('builder.certifications');
  const tc = useTranslations('builder.common');

  return (
    <ArraySection
      resume={resume}
      sectionKey="certifications"
      createItem={createCertification}
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
        const errors = fieldErrors(certificationSchema, item);
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label={t('name')} value={item.name} onChange={(v) => update({ name: v })} />
            <TextField label={t('issuer')} value={item.issuer ?? ''} onChange={(v) => update({ issuer: v })} />
            <TextField label={t('date')} type="month" value={item.date ?? ''} onChange={(v) => update({ date: v })} />
            <TextField label={t('expiry')} type="month" value={item.expiryDate ?? ''} onChange={(v) => update({ expiryDate: v })} />
            <TextField label={t('url')} type="url" value={item.url ?? ''} onChange={(v) => update({ url: v })} error={errors['url']} placeholder="https://" />
          </div>
        );
      }}
    />
  );
}
