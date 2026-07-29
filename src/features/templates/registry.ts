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
    nameClass: 'text-3xl font-bold text-neutral-900',
    headingClass:
      'mb-2 border-b border-neutral-300 pb-1 text-xs font-bold uppercase tracking-widest text-neutral-900',
    accentClass: 'text-neutral-900',
  },
  modern: {
    id: 'modern',
    fontClass: 'font-sans',
    nameClass: 'text-3xl font-bold text-indigo-700',
    headingClass:
      'mb-2 border-b-2 border-indigo-200 pb-1 text-xs font-semibold uppercase tracking-widest text-indigo-700',
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
