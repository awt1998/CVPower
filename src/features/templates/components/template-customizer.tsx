'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useResumeStore } from '@/features/resume/store';
import type { Resume } from '@/features/resume/types';
import {
  ACCENTS,
  ACCENT_KEYS,
  DEFAULT_HEADER_ALIGN,
  DEFAULT_DENSITY,
  DEFAULT_PAGE_SIZE,
  DEFAULT_TEMPLATE_ID,
  TEMPLATE_IDS,
  getTemplateTheme,
} from '../registry';
import type { AccentKey, Density, HeaderAlign, PageSize, TemplateId } from '../types';

const SECTION_IDS = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'references',
] as const;

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-input hover:bg-accent hover:text-accent-foreground',
      )}
    >
      {children}
    </button>
  );
}

/** Full appearance customizer: template, accent, density, header alignment, visible sections. */
export function TemplateCustomizer({ resume }: { resume: Resume }) {
  const t = useTranslations('templates');
  const tSteps = useTranslations('builder.steps');
  const { meta } = resume;

  const update = (patch: Parameters<ReturnType<typeof useResumeStore.getState>['updateMeta']>[1]) =>
    useResumeStore.getState().updateMeta(resume.id, patch);

  const templateId = (meta.templateId as TemplateId) ?? DEFAULT_TEMPLATE_ID;
  const accent: AccentKey = meta.accent ?? getTemplateTheme(templateId).defaultAccent;
  const density: Density = meta.density ?? DEFAULT_DENSITY;
  const headerAlign: HeaderAlign = meta.headerAlign ?? DEFAULT_HEADER_ALIGN;
  const pageSize: PageSize = meta.pageSize ?? DEFAULT_PAGE_SIZE;
  const hidden = new Set(meta.hiddenSections ?? []);

  const toggleSection = (id: string) => {
    const next = new Set(hidden);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    update({ hiddenSections: [...next] });
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <p className="text-sm font-medium">{t('customize.template')}</p>
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_IDS.map((id) => (
            <OptionButton key={id} active={id === templateId} onClick={() => update({ templateId: id })}>
              {t(`names.${id}`)}
            </OptionButton>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-medium">{t('customize.accent')}</p>
        <div className="flex flex-wrap gap-2">
          {ACCENT_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              aria-label={key}
              aria-pressed={key === accent}
              onClick={() => update({ accent: key })}
              className={cn(
                'size-7 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                ACCENTS[key].dot,
                key === accent && 'ring-2 ring-foreground',
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-medium">{t('customize.density')}</p>
        <div className="flex flex-wrap gap-2">
          <OptionButton active={density === 'comfortable'} onClick={() => update({ density: 'comfortable' })}>
            {t('customize.comfortable')}
          </OptionButton>
          <OptionButton active={density === 'compact'} onClick={() => update({ density: 'compact' })}>
            {t('customize.compact')}
          </OptionButton>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-medium">{t('customize.header')}</p>
        <div className="flex flex-wrap gap-2">
          <OptionButton active={headerAlign === 'center'} onClick={() => update({ headerAlign: 'center' })}>
            {t('customize.center')}
          </OptionButton>
          <OptionButton active={headerAlign === 'start'} onClick={() => update({ headerAlign: 'start' })}>
            {t('customize.start')}
          </OptionButton>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-medium">{t('customize.pageSize')}</p>
        <div className="flex flex-wrap gap-2">
          <OptionButton active={pageSize === 'a4'} onClick={() => update({ pageSize: 'a4' })}>
            {t('customize.a4')}
          </OptionButton>
          <OptionButton active={pageSize === 'letter'} onClick={() => update({ pageSize: 'letter' })}>
            {t('customize.letter')}
          </OptionButton>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-medium">{t('customize.sections')}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {SECTION_IDS.map((id) => {
            const visible = !hidden.has(id);
            return (
              <div key={id} className="flex items-center justify-between gap-2">
                <Label htmlFor={`sec-${id}`} className="font-normal">
                  {tSteps(id)}
                </Label>
                <Switch id={`sec-${id}`} checked={visible} onCheckedChange={() => toggleSection(id)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
