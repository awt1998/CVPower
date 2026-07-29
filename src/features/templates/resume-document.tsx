'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { formatDateRange, formatResumeDate, formatLocation, joinParts } from './template-utils';
import type { ResumeDocumentProps } from './types';

/**
 * The single, shared, ATS-safe document. Every template renders through this so
 * the structure stays semantic and machine-parseable; only `theme` styling
 * differs. Colors are fixed (dark text on a white sheet) regardless of app
 * theme, because a resume is always a light document.
 */
export function ResumeDocument({ resume, theme }: ResumeDocumentProps) {
  const t = useTranslations('templates');
  const tLang = useTranslations('builder.languages');
  const locale = useLocale();
  const present = t('present');
  const { basics, sections } = resume;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mt-5 first:mt-0">
      <h2 className={theme.headingClass}>{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-neutral-800">{children}</div>
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

  const EntryHead = ({ title, meta }: { title: string; meta?: string }) => (
    <div className="flex items-baseline justify-between gap-3">
      <p className="font-semibold text-neutral-900">{title}</p>
      {meta && <p className="shrink-0 text-xs text-neutral-500">{meta}</p>}
    </div>
  );

  const contact = joinParts([
    basics.email,
    basics.phone,
    formatLocation(basics.location),
    basics.website,
    ...basics.links.map((link) => link.label || link.url),
  ]);

  return (
    <article className={cn('text-neutral-800', theme.fontClass)}>
      <header className="border-b border-neutral-200 pb-4">
        <h1 className={theme.nameClass}>{basics.fullName || t('unnamed')}</h1>
        {basics.headline && <p className="mt-0.5 text-base text-neutral-600">{basics.headline}</p>}
        {contact && <p className="mt-2 text-sm text-neutral-600">{contact}</p>}
      </header>

      {basics.summary?.trim() && (
        <Section title={t('sections.summary')}>
          <p className="whitespace-pre-line">{basics.summary}</p>
        </Section>
      )}

      {sections.experience.length > 0 && (
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

      {sections.education.length > 0 && (
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

      {sections.skills.length > 0 && (
        <Section title={t('sections.skills')}>
          {sections.skills.map((group) => (
            <p key={group.id}>
              {group.category && <span className="font-semibold text-neutral-900">{group.category}: </span>}
              {group.items.join(' · ')}
            </p>
          ))}
        </Section>
      )}

      {sections.projects.length > 0 && (
        <Section title={t('sections.projects')}>
          {sections.projects.map((item) => (
            <div key={item.id}>
              <EntryHead
                title={item.name}
                meta={formatDateRange(item.startDate, item.endDate, false, locale, present)}
              />
              {item.url && <p className={cn('text-xs', theme.accentClass)}>{item.url}</p>}
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

      {sections.certifications.length > 0 && (
        <Section title={t('sections.certifications')}>
          {sections.certifications.map((item) => (
            <div key={item.id}>
              <EntryHead title={item.name} meta={formatResumeDate(item.date, locale)} />
              <p className="text-neutral-700">{joinParts([item.issuer, item.url])}</p>
            </div>
          ))}
        </Section>
      )}

      {sections.languages.length > 0 && (
        <Section title={t('sections.languages')}>
          <p>
            {sections.languages
              .map((lang) => `${lang.name} (${tLang(`proficiency.${lang.proficiency}`)})`)
              .join(' · ')}
          </p>
        </Section>
      )}

      {sections.references.length > 0 && (
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

      {sections.custom.map((custom) =>
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
