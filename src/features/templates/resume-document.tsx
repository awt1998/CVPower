'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { formatDateRange, formatResumeDate, formatLocation, joinParts } from './template-utils';
import { getAccent } from './registry';
import type { ResumeDocumentProps } from './types';

/**
 * The single, shared, ATS-safe document. Templates set structure/typography; the
 * resume's own meta (accent, density, header alignment, hidden sections) layers
 * on top. Colors are fixed dark-on-white regardless of app theme.
 */
export function ResumeDocument({ resume, theme }: ResumeDocumentProps) {
  const t = useTranslations('templates');
  const tLang = useTranslations('builder.languages');
  const locale = useLocale();
  const present = t('present');
  const { basics, sections, meta } = resume;

  const accent = getAccent(meta.accent, theme.defaultAccent);
  const density = meta.density ?? 'comfortable';
  const headerAlign = meta.headerAlign ?? 'center';
  const hidden = new Set(meta.hiddenSections ?? []);

  const sectionGap = density === 'compact' ? 'mt-4' : 'mt-6';
  const itemGap = density === 'compact' ? 'space-y-2.5' : 'space-y-3.5';

  const nameClass = cn(theme.nameSizeClass, 'font-bold tracking-tight', accent.color);
  const headingClass = cn(
    'mb-2.5 pb-1 text-[11px] uppercase tracking-[0.18em]',
    theme.headingWeightClass,
    accent.color,
    theme.headingBorderClass && cn(theme.headingBorderClass, accent.border),
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className={cn(sectionGap, 'first:mt-0')}>
      <h2 className={headingClass}>{title}</h2>
      <div className={cn(itemGap, 'text-sm leading-relaxed text-neutral-800')}>{children}</div>
    </section>
  );

  const Bullets = ({ items }: { items: string[] }) => {
    const clean = items.map((i) => i.trim()).filter(Boolean);
    if (clean.length === 0) return null;
    return (
      <ul className="mt-1 list-disc space-y-0.5 ps-5 marker:text-neutral-400">
        {clean.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  const EntryHead = ({ title, meta: metaText }: { title: string; meta?: string }) => (
    <div className="flex items-baseline justify-between gap-3">
      <p className="font-semibold text-neutral-900">{title}</p>
      {metaText && <p className="shrink-0 text-xs text-neutral-500">{metaText}</p>}
    </div>
  );

  const contact = joinParts([
    basics.email,
    basics.phone,
    formatLocation(basics.location),
    basics.website,
    ...basics.links.map((link) => link.label || link.url),
  ]);

  const show = (id: string) => !hidden.has(id);

  return (
    <article className={cn('text-neutral-800', theme.fontClass)}>
      <header className={cn('border-b border-neutral-200 pb-5', headerAlign === 'center' ? 'text-center' : 'text-start')}>
        <h1 className={nameClass}>{basics.fullName || t('unnamed')}</h1>
        {basics.headline && (
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-neutral-500">
            {basics.headline}
          </p>
        )}
        {contact && (
          <p className={cn('mt-2.5 max-w-xl text-xs leading-relaxed text-neutral-500', headerAlign === 'center' && 'mx-auto')}>
            {contact}
          </p>
        )}
      </header>

      {show('summary') && basics.summary?.trim() && (
        <Section title={t('sections.summary')}>
          <p className="whitespace-pre-line">{basics.summary}</p>
        </Section>
      )}

      {show('experience') && sections.experience.length > 0 && (
        <Section title={t('sections.experience')}>
          {sections.experience.map((item) => (
            <div key={item.id}>
              <EntryHead
                title={item.role || item.company}
                meta={formatDateRange(item.startDate, item.endDate, item.current, locale, present)}
              />
              <p className="text-neutral-700">
                {joinParts([item.role ? item.company : undefined, item.location])}
              </p>
              {item.summary?.trim() && <p className="mt-1 whitespace-pre-line">{item.summary}</p>}
              <Bullets items={item.highlights} />
              {item.technologies && item.technologies.length > 0 && (
                <p className="mt-1 text-xs text-neutral-500">{item.technologies.join(' · ')}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {show('education') && sections.education.length > 0 && (
        <Section title={t('sections.education')}>
          {sections.education.map((item) => (
            <div key={item.id}>
              <EntryHead
                title={item.degree || item.institution}
                meta={formatDateRange(item.startDate, item.endDate, item.current, locale, present)}
              />
              <p className="text-neutral-700">
                {joinParts([
                  item.degree ? item.institution : undefined,
                  item.field,
                  item.location,
                  item.grade,
                ])}
              </p>
              <Bullets items={item.highlights} />
            </div>
          ))}
        </Section>
      )}

      {show('skills') && sections.skills.length > 0 && (
        <Section title={t('sections.skills')}>
          {sections.skills.map((group) => (
            <p key={group.id}>
              {group.category && <span className="font-semibold text-neutral-900">{group.category}: </span>}
              {group.items.join(' · ')}
            </p>
          ))}
        </Section>
      )}

      {show('projects') && sections.projects.length > 0 && (
        <Section title={t('sections.projects')}>
          {sections.projects.map((item) => (
            <div key={item.id}>
              <EntryHead
                title={item.name}
                meta={formatDateRange(item.startDate, item.endDate, false, locale, present)}
              />
              {item.url && <p className={cn('text-xs', accent.color)}>{item.url}</p>}
              {item.description?.trim() && (
                <p className="mt-1 whitespace-pre-line">{item.description}</p>
              )}
              <Bullets items={item.highlights} />
              {item.technologies && item.technologies.length > 0 && (
                <p className="mt-1 text-xs text-neutral-500">{item.technologies.join(' · ')}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {show('certifications') && sections.certifications.length > 0 && (
        <Section title={t('sections.certifications')}>
          {sections.certifications.map((item) => (
            <div key={item.id}>
              <EntryHead title={item.name} meta={formatResumeDate(item.date, locale)} />
              <p className="text-neutral-700">{joinParts([item.issuer, item.url])}</p>
            </div>
          ))}
        </Section>
      )}

      {show('languages') && sections.languages.length > 0 && (
        <Section title={t('sections.languages')}>
          <p>
            {sections.languages
              .map((lang) => `${lang.name} (${tLang(`proficiency.${lang.proficiency}`)})`)
              .join(' · ')}
          </p>
        </Section>
      )}

      {show('references') && sections.references.length > 0 && (
        <Section title={t('sections.references')}>
          {sections.references.map((item) => (
            <div key={item.id}>
              <EntryHead title={item.name} meta={item.relationship} />
              <p className="text-neutral-700">{joinParts([item.title, item.company])}</p>
              <p className="text-neutral-600">{joinParts([item.email, item.phone])}</p>
              {item.summary?.trim() && <p className="mt-1">{item.summary}</p>}
            </div>
          ))}
        </Section>
      )}

      {show('custom') &&
        sections.custom.map((custom) =>
          custom.items.length > 0 ? (
            <Section key={custom.id} title={custom.title || t('sections.custom')}>
              {custom.items.map((item) => (
                <div key={item.id}>
                  <EntryHead title={item.title ?? ''} meta={formatResumeDate(item.date, locale)} />
                  {item.subtitle && <p className="text-neutral-700">{item.subtitle}</p>}
                  {item.description?.trim() && (
                    <p className="mt-1 whitespace-pre-line">{item.description}</p>
                  )}
                  <Bullets items={item.highlights} />
                </div>
              ))}
            </Section>
          ) : null,
        )}
    </article>
  );
}
