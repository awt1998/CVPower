'use client';

import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '../../store';
import { basicsSchema } from '../../schema';
import { createLink } from '../../factory';
import { arrayMove } from '../utils';
import { fieldErrors } from '../validation';
import { TextField } from '../fields/text-field';
import type { Resume } from '../../types';

export function PersonalInfoStep({ resume }: { resume: Resume }) {
  const t = useTranslations('builder.personal');
  const { basics } = resume;
  const errors = fieldErrors(basicsSchema, basics);

  const update = (patch: Partial<Resume['basics']>) =>
    useResumeStore.getState().updateBasics(resume.id, patch);
  const setLinks = (links: Resume['basics']['links']) => update({ links });

  return (
    <div className="grid gap-6">
      <TextField
        label={t('resumeName')}
        value={resume.meta.title}
        onChange={(v) => useResumeStore.getState().renameResume(resume.id, v)}
        description={t('resumeNameHint')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={t('fullName')} value={basics.fullName} onChange={(v) => update({ fullName: v })} autoComplete="name" />
        <TextField label={t('headline')} value={basics.headline ?? ''} onChange={(v) => update({ headline: v })} placeholder={t('headlinePlaceholder')} />
        <TextField label={t('email')} type="email" value={basics.email ?? ''} onChange={(v) => update({ email: v })} error={errors['email']} autoComplete="email" inputMode="email" />
        <TextField label={t('phone')} type="tel" value={basics.phone ?? ''} onChange={(v) => update({ phone: v })} autoComplete="tel" inputMode="tel" />
        <TextField label={t('city')} value={basics.location?.city ?? ''} onChange={(v) => update({ location: { ...(basics.location ?? {}), city: v } })} />
        <TextField label={t('country')} value={basics.location?.country ?? ''} onChange={(v) => update({ location: { ...(basics.location ?? {}), country: v } })} />
        <TextField label={t('website')} type="url" value={basics.website ?? ''} onChange={(v) => update({ website: v })} error={errors['website']} placeholder="https://" />
      </div>

      <div className="grid gap-2">
        <Label>{t('links')}</Label>
        {basics.links.map((link, index) => {
          const linkError = fieldErrors(basicsSchema.shape.links.element, link);
          return (
            <div key={link.id} className="flex items-start gap-1.5">
              <Input
                className="max-w-[10rem]"
                value={link.label ?? ''}
                placeholder={t('linkLabel')}
                aria-label={t('linkLabel')}
                onChange={(e) =>
                  setLinks(basics.links.map((l) => (l.id === link.id ? { ...l, label: e.target.value } : l)))
                }
              />
              <div className="grid flex-1 gap-1">
                <Input
                  value={link.url ?? ''}
                  placeholder="https://"
                  aria-label={t('linkUrl')}
                  aria-invalid={linkError['url'] ? true : undefined}
                  onChange={(e) =>
                    setLinks(basics.links.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)))
                  }
                />
                {linkError['url'] && <p className="text-xs text-destructive">{linkError['url']}</p>}
              </div>
              <div className="flex shrink-0">
                <Button type="button" variant="ghost" size="icon" className="size-9" disabled={index === 0} aria-label={t('moveUp')} onClick={() => setLinks(arrayMove(basics.links, index, index - 1))}>
                  <ChevronUp className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-9" disabled={index === basics.links.length - 1} aria-label={t('moveDown')} onClick={() => setLinks(arrayMove(basics.links, index, index + 1))}>
                  <ChevronDown className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-destructive" aria-label={t('removeLink')} onClick={() => setLinks(basics.links.filter((l) => l.id !== link.id))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          );
        })}
        <div>
          <Button type="button" variant="outline" size="sm" onClick={() => setLinks([...basics.links, createLink()])}>
            <Plus className="size-4" />
            {t('addLink')}
          </Button>
        </div>
      </div>
    </div>
  );
}
