import type { TemplateId, TemplateTheme } from './types';

/** Default template applied to new resumes. */
export const DEFAULT_TEMPLATE_ID: TemplateId = 'classic';

/** Ordered list of selectable template ids. */
export const TEMPLATE_IDS: TemplateId[] = ['classic', 'modern'];

/**
 * Template themes. Both are single-column and ATS-safe by construction; they
 * differ only in typography and accent so the underlying text stays parseable.
 */
export const TEMPLATE_THEMES: Record<TemplateId, TemplateTheme> = {
  classic: {
    id: 'classic',
    fontClass: 'font-serif',
    nameClass: 'text-3xl font-bold tracking-tight text-neutral-900',
    headingClass:
      'mb-2.5 border-b border-neutral-200 pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-800',
    accentClass: 'text-neutral-900',
  },
  modern: {
    id: 'modern',
    fontClass: 'font-sans',
    nameClass: 'text-3xl font-bold tracking-tight text-indigo-700',
    headingClass:
      'mb-2.5 border-b-2 border-indigo-100 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600',
    accentClass: 'text-indigo-700',
  },
};

/** Resolve a (possibly missing/unknown) template id to a concrete theme. */
export function getTemplateTheme(id: string | undefined): TemplateTheme {
  if (id && Object.prototype.hasOwnProperty.call(TEMPLATE_THEMES, id)) {
    return TEMPLATE_THEMES[id as TemplateId];
  }
  return TEMPLATE_THEMES[DEFAULT_TEMPLATE_ID];
}
